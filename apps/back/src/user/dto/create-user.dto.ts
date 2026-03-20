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
import { LoginDto } from 'src/auth/dtos/Login.dto';
import { Activity } from '../enums';

export class CreateUserDto extends LoginDto {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsEnum(Activity, {
    each: true,
  })
  @IsOptional({
    each: true,
  })
  activities?: Activity[];

  @IsEnum(Rol)
  @IsOptional()
  rol?: Rol;
}
