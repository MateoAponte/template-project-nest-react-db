import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsEmail()
  @MinLength(3)
  @MaxLength(100)
  @IsNotEmpty()
  email: string;

  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d{3,})(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  )
  @IsString()
  @MinLength(12)
  @MaxLength(100)
  @IsNotEmpty()
  password: string;
}
