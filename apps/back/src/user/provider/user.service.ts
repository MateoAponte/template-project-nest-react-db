import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserRepositoryService } from './user.repository.service';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UserResponseDto } from '../dto/user-response.dto';

@Injectable()
export class UserService {
  constructor(
    /**
     * Inject the UserService
     * @param userRepository - Inject the UserRepositoryService
     */
    private readonly userRepository: UserRepositoryService,
  ) {}

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll();
    return users.map((user) => UserResponseDto.fromEntity(user));
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findUserById(id);

    if (user == null)
      throw new NotFoundException(`User with id ${id} not found`);
    return UserResponseDto.fromEntity(user);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    const user = await this.userRepository.findUserById(id);
    if (user === null)
      throw new NotFoundException(`User with id ${id} not found`);

    return this.userRepository.updateUser(id, updateUserDto);
  }

  async remove(id: string): Promise<DeleteResult> {
    const user = await this.userRepository.findUserById(id);

    if (user === null)
      throw new NotFoundException(`User with id ${id} not found`);

    return this.userRepository.deleteUser(id);
  }
}
