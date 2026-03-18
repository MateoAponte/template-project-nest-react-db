import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserRepositoryService } from './user.repository.service';
import { User } from '../user.entity';
import { DeleteResult, UpdateResult } from 'typeorm';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepositoryService) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.createUser(createUserDto);
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
