import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Rol } from '../enums/Rol';
import { Activities } from '../enums/Activities';
import { LoginDto } from 'src/auth/dtos/Login.dto';

export class CreateUserDto extends LoginDto {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsEnum(Activities, {
    each: true,
  })
  @IsOptional({
    each: true,
  })
  activities?: Activities[];

  @IsEnum(Rol)
  @IsOptional()
  rol?: Rol;
}
