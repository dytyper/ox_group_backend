import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

function generateOtp(): string {
  const value = Math.floor(100000 + Math.random() * 900000);
  return String(value);
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const { email } = dto;

    let user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
        },
      });
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this.prisma.otpCode.deleteMany({ where: { email } });
    await this.prisma.otpCode.create({
      data: {
        email,
        code: otp,
        expiresAt,
        userId: user.id,
      },
    });

    return {
      email,
      otp,
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const { email, otp } = dto;

    const record = await this.prisma.otpCode.findFirst({
      where: {
        email,
        code: otp,
      },
      orderBy: { expiresAt: 'desc' },
    });

    if (!record || record.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const payload = { sub: user.id };
    const accessToken = await this.jwtService.signAsync(payload);

    await this.prisma.otpCode.deleteMany({
      where: { email },
    });

    return { accessToken };
  }
}

