import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserRepositoryService {
  constructor(
    /**
     * Inject the UserService
     */
    @InjectRepository(User) private repo: Repository<User>,
  ) {}

  createUser(body: CreateUserDto): Promise<User> {
    const user = this.repo.create(body);
    return this.repo.save(user);
  }

  findAll(): Promise<User[]> {
    return this.repo.find();
  }

  findUserById(id: string): Promise<User | null> {
    return this.repo.findOne({
      where: {
        id,
      },
    });
  }

  findUserByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({
      where: {
        email,
      },
    });
  }

  updateUser(
    id: string,
    body: UpdateUserDto,
  ): Promise<UpdateResult> | undefined {
    const user = this.findUserById(id);

    if (user !== null) {
      return this.repo.update(
        { id },
        {
          ...body,
        },
      );
    }
  }

  deleteUser(id: string): Promise<DeleteResult> {
    return this.repo.delete({
      id,
    });
  }
}
