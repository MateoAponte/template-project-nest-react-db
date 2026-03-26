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
    {
      message:
        'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  @IsString()
  @MinLength(12)
  @MaxLength(100)
  @IsNotEmpty()
  password: string;
}
