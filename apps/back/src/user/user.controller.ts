import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './provider/user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Rol, Activity } from './enums';
import { ActivitiesGuard, JwtAuthGuard, RolesGuard } from 'src/auth/guards';
import {
  DeleteUserDocumentation,
  GetAllUsersDocumentation,
  GetUserDocumentation,
  UpdateUserDocumentation,
} from './decorators/userDocumentation.decorator';
import { UserResponseDto } from './dto/user-response.dto';
import { AccessValidator } from './decorators/accessValidator.decorator';

@ApiBearerAuth()
@ApiTags('users')
@UseGuards(JwtAuthGuard, RolesGuard, ActivitiesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @GetAllUsersDocumentation()
  @AccessValidator({
    rol: Rol.USER,
    activities: [Activity.READER],
  })
  @Get()
  findAll(): Promise<UserResponseDto[]> {
    return this.userService.findAll();
  }

  @GetUserDocumentation()
  @AccessValidator({
    rol: Rol.USER,
    activities: [Activity.READER],
  })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.findOne(id);
  }

  @UpdateUserDocumentation()
  @AccessValidator({
    activities: [Activity.EDITOR, Activity.WRITER],
  })
  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    return this.userService.update(id, updateUserDto);
  }

  @DeleteUserDocumentation()
  @AccessValidator({
    activities: [Activity.EDITOR, Activity.WRITER],
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.userService.remove(id);
  }
}
