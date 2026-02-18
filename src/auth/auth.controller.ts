import { Controller, Get, Post, Body, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { CreateUserDto } from '../users/dto/create-user.dto.js';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 1. REGISTER
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  // 2. LOGIN - set refresh token as HTTP-only cookie
  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: Response, // allow setting cookie
  ) {
    return this.authService.login(body.email, body.password, res);
  }

  // 3. LOGOUT - clear refresh token cookie
  @Post('logout')
  async logout(
    @Body() body: { userId: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(body.userId, res);
    return { message: 'Logged out successfully' };
  }

  // 4. REFRESH - issue new access token using HTTP-only cookie
  @Get('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies['refreshToken'];
    if (!token) return { error: 'No refresh token' };

    // You would extract userId from the token or DB
    // For example, verify token and get userId
    const newTokens = await this.authService.refreshToken(token); // fill userId as needed
    return { accessToken: newTokens.accessToken };
  }
}
