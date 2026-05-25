import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepositoryService } from 'src/user/provider/user.repository.service';
import { LoginDto, TokenDto, TokenUserDto } from './dtos';
import { AesProvider, JwtProvider } from './providers';
import { AES_KEY } from './constants';
import { EncoderService } from 'src/common/services/encoder.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserResponseDto } from 'src/user/dto/user-response.dto';
import { MatchPass } from 'src/user/helpers/CheckExpression';

@Injectable()
export class AuthService {
  constructor(
    /**
     * Inject JWT Provider
     */
    private readonly jwtProvider: JwtProvider,

    /**
     * Inject Users Repository
     */
    @Inject()
    private readonly usersRepositoryService: UserRepositoryService,

    /**
     * Inject AES Provider
     */
    private readonly aesProvider: AesProvider,
  ) {}

  async hashPassword(pass: string): Promise<string> {
    const salt = await bcrypt.genSalt(); // Cadena aleatoria de caracterés
    return await bcrypt.hash(pass, salt);
  }

  async compareHash(pass: string, hashPass: string): Promise<boolean> {
    return await bcrypt.compare(pass, hashPass);
  }

  async checkAuthenticatedUser(
    password: string,
    dbPassword: string,
  ): Promise<boolean> {
    // ... Lógica relacionada al proceso de autenticación
    return await this.compareHash(password, dbPassword);
  }

  async login(body: LoginDto): Promise<TokenUserDto> {
    const user = await this.usersRepositoryService.findUserByEmail(body.email);
    if (!!user === false) throw new UnauthorizedException('User not found');

    const rPass = new EncoderService().decode(body.password);

    const isValidate = await this.compareHash(rPass, user.password);
    if (!isValidate) throw new UnauthorizedException('Incorrect credentials');

    return {
      ...this.jwtProvider.signTokens(user),
      user,
    };
  }

  refresh(refreshToken: string): TokenUserDto {
    const payload = this.jwtProvider.refreshTokens(refreshToken);
    return this.jwtProvider.signTokens(payload);
  }

  encrypt(secret: TokenDto): TokenDto {
    const rts = this.aesProvider.encrypt(secret.rt_secret, AES_KEY);
    const ats = this.aesProvider.encrypt(secret.at_secret, AES_KEY);
    return {
      rt_secret: rts,
      at_secret: ats,
    };
  }

  async register(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    if (!MatchPass(createUserDto.password)) {
      throw new ConflictException(
        'Password must contain at least 12 characters, one uppercase letter, one lowercase letter, one number and one special character (!@#$%^&*)',
      );
    }

    const hashPass = await this.hashPassword(createUserDto.password);

    const existingUser = await this.usersRepositoryService.findUserByEmail(
      createUserDto.email,
    );
    if (existingUser !== null)
      throw new ConflictException(
        `User with email ${createUserDto.email} already exists`,
      );

    const user = await this.usersRepositoryService.createUser({
      ...createUserDto,
      password: hashPass,
    });

    return UserResponseDto.fromEntity(user);
  }
}
