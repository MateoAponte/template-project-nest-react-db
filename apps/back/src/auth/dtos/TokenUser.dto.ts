import { TokenDto } from './Encrypt.dto';
import { IntersectionType, PartialType } from '@nestjs/swagger';
import { User } from 'src/user/user.entity';

class TokenUser extends IntersectionType(TokenDto, User) {}

export class TokenUserDto extends PartialType(TokenUser) {}
