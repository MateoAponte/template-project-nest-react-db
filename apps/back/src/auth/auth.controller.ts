import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto, TokenDto, TokenUserDto } from './dtos';
import { AuthService } from './auth.service';
import type { Request } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    /**
     * Inject Auth Service
     */
    private readonly authService: AuthService,
  ) {}

  @ApiResponse({
    status: 200,
    description: 'Returns a JWT token.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Post('login')
  login(@Body() body: LoginDto): Promise<TokenUserDto | { message: string }> {
    return this.authService.login(body);
  }

  @ApiResponse({
    status: 200,
    description: 'Returns a new JWT token.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @UseGuards(AuthGuard('refresh-token'))
  @Post('refresh')
  refresh(@Req() req: Request): TokenUserDto | { message: string } {
    const authHeader = req.headers.authorization;
    if (authHeader == null || authHeader == undefined)
      return { message: 'No authorization header found' };

    const refreshToken = authHeader.split(' ')[1];
    return this.authService.refresh(refreshToken);
  }

  @ApiResponse({
    status: 200,
    description: 'Returns a new JWT token.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Post('encrypt')
  encrypt(@Body() encrypt: TokenDto): TokenDto {
    return this.authService.encrypt(encrypt);
  }
}
