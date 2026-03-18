import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './provider/user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './user.entity';
import { DeleteResult, UpdateResult } from 'typeorm';

@ApiTags('users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Returns an array of users.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @ApiResponse({
    status: 200,
    description: 'Returns a user by id.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<User | null> {
    return this.userService.findOne(id);
  }

  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> | undefined {
    return this.userService.update(id, updateUserDto);
  }

  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.userService.remove(id);
  }
}
