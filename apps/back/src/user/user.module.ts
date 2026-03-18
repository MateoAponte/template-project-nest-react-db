import { Module } from '@nestjs/common';
import { UserService } from './provider/user.service';
import { UserController } from './user.controller';
import { UserRepositoryService } from './provider/user.repository.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, UserRepositoryService],
})
export class UserModule {}
