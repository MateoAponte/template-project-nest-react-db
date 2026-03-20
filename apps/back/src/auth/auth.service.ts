import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepositoryService } from 'src/user/provider/user.repository.service';
import { LoginDto, TokenDto, TokenUserDto } from './dtos';
import { AesProvider, JwtProvider } from './providers';
import { AES_KEY } from './constants';

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

  async login(body: LoginDto): Promise<TokenUserDto | { message: string }> {
    const user = await this.usersRepositoryService.findUserByEmail(body.email);
    if (!!user === false)
      return {
        message: 'No se encontro el usuario',
      };

    const isValidate = await this.compareHash(body.password, user.password);
    if (!isValidate)
      return {
        message: 'Las credenciales son incorrectas',
      };

    return this.jwtProvider.signTokens(user);
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
}
