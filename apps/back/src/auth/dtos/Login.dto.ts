import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserWithEmailDto {
  @IsEmail()
  @MinLength(3)
  @MaxLength(100)
  @IsNotEmpty()
  email: string;
}

export class LoginDto extends UserWithEmailDto {
  @IsString()
  @MinLength(12)
  @MaxLength(100)
  @IsNotEmpty()
  password: string;
}
