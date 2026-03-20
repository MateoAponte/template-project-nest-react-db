import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserRepositoryService } from './user.repository.service';
import { User } from '../user.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    /**
     * Inject the UserService
     * @param userRepository - Inject the UserRepositoryService
     */
    private readonly userRepository: UserRepositoryService,

    /**
     * Inject the AuthService
     * @param authService - Inject the AuthService
     */
    private readonly authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashPass = await this.authService.hashPassword(
      createUserDto.password,
    );
    return this.userRepository.createUser({
      ...createUserDto,
      password: hashPass,
    });
  }

  findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  findOne(id: string): Promise<User | null> {
    return this.userRepository.findUserById(id);
  }

  update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> | undefined {
    return this.userRepository.updateUser(id, updateUserDto);
  }

  remove(id: string): Promise<DeleteResult> {
    return this.userRepository.deleteUser(id);
  }
}
