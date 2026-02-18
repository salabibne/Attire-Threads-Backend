import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service.js';
import { UsersService } from '../users/users.service.js';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  // 1. REGISTER
  async register(registerDto: any) {
    const exists = await this.usersService.findByEmail(registerDto.email);
    if (exists) throw new ConflictException('Email already exists');

    const user = await this.usersService.create(registerDto);
    return user;
  }

  // 2. LOGIN - sets refresh token as HTTP-only cookie
  async login(email: string, pass: string, res: Response) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 24 * 60 * 60 * 1000, // 60 days
    });

    return { accessToken: tokens.accessToken };
  }

  // 3. TOKEN GENERATION & HASHING
  async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
      expiresIn: '60d',
    });

    // Hash refresh token for DB
    const hashedRt = await bcrypt.hash(refreshToken, 10);

    // Check if a refresh token already exists for the user
    const existing = await this.prisma.refreshToken.findFirst({
      where: { userId },
    });

    if (existing) {
      // Update existing refresh token
      await this.prisma.refreshToken.update({
        where: { id: existing.id },
        data: {
          token: hashedRt,
          expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        },
      });
    } else {
      // Create new refresh token
      await this.prisma.refreshToken.create({
        data: {
          userId,
          token: hashedRt,
          expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        },
      });
    }

    return { accessToken, refreshToken };
  }

  // 4. REFRESH TOKEN
  async refreshToken(token: string) {
  //  verify token and extract userId
  const decoded = await this.jwtService.verifyAsync(token, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
    });
    const userId = decoded?.sub;
    const stored = await this.prisma.refreshToken.findFirst({
      where: { userId },
    });
    if (!stored) throw new UnauthorizedException('No refresh token found');

    const isValid = await bcrypt.compare(token, stored.token);
    if (!isValid) throw new UnauthorizedException('Invalid refresh token');

    return this.generateTokens(userId, '', ''); // Role/email optional here
  }

  // 5. LOGOUT
  async logout(userId: string, res: Response) {
    await this.prisma.refreshToken.deleteMany({ where: { userId } });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/auth/refresh',
    });
  }
}
