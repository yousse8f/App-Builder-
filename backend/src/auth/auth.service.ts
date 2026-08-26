import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserRole, UserStatus, ClientStatus } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { name, email, password, companyName } = registerDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await argon2.hash(password);

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: UserRole.CLIENT,
        status: UserStatus.ACTIVE,
        client: companyName
          ? {
              create: {
                companyName,
                status: ClientStatus.ACTIVE,
              },
            }
          : undefined,
      },
      include: { client: true },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    await this.storeRefreshTokenHash(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        clientId: user.client?.id,
        client: user.client
          ? {
              id: user.client.id,
              companyName: user.client.companyName,
              status: user.client.status,
            }
          : null,
      },
      ...tokens,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { client: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await argon2.verify(user.passwordHash, password);

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check user status
    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Account is not active');
    }

    // For clients, also check client status
    if (user.role === UserRole.CLIENT && user.client?.status !== ClientStatus.ACTIVE) {
      throw new UnauthorizedException('Account is not active');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    await this.storeRefreshTokenHash(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        clientId: user.client?.id,
        client: user.client
          ? {
              id: user.client.id,
              companyName: user.client.companyName,
              status: user.client.status,
            }
          : null,
      },
      ...tokens,
    };
  }

  async refresh(refreshDto: RefreshDto) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshDto.refreshToken, {
        secret:
          this.configService.get<string>('JWT_REFRESH_SECRET') ||
          'default-refresh-secret',
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: { client: true },
      });

      if (!user || user.status !== UserStatus.ACTIVE) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // For clients, also check client status
      if (user.role === UserRole.CLIENT && user.client?.status !== ClientStatus.ACTIVE) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      if (!user.refreshTokenHash) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const refreshTokenValid = await argon2.verify(
        user.refreshTokenHash,
        refreshDto.refreshToken,
      );

      if (!refreshTokenValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = await this.generateTokens(
        user.id,
        user.email,
        user.role,
      );

      await this.storeRefreshTokenHash(user.id, tokens.refreshToken);

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          clientId: user.client?.id,
          client: user.client
            ? {
                id: user.client.id,
                companyName: user.client.companyName,
                status: user.client.status,
              }
            : null,
        },
        ...tokens,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshTokenHash: null,
      },
    });

    return {
      message: 'Logged out successfully',
    };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { client: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      clientId: user.client?.id,
      client: user.client
        ? {
            id: user.client.id,
            companyName: user.client.companyName,
            status: user.client.status,
          }
        : null,
    };
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { client: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const data: { name?: string; phone?: string; language?: string; avatar?: string; } = {};

    if (updateProfileDto.name) {
      data.name = updateProfileDto.name;
    }

    if (updateProfileDto.phone !== undefined) {
      data.phone = updateProfileDto.phone;
    }

    if (updateProfileDto.language !== undefined) {
      data.language = updateProfileDto.language;
    }

    if (updateProfileDto.avatar !== undefined) {
      data.avatar = updateProfileDto.avatar;
    }

    if (updateProfileDto.companyName !== undefined) {
      if (user.client) {
        await this.prisma.client.update({
          where: { id: user.client.id },
          data: { companyName: updateProfileDto.companyName },
        });
      } else {
        await this.prisma.client.create({
          data: {
            userId: user.id,
            companyName: updateProfileDto.companyName,
            status: ClientStatus.ACTIVE,
          },
        });
      }
    }

    if (Object.keys(data).length > 0) {
      await this.prisma.user.update({
        where: { id: userId },
        data,
      });
    }

    return this.me(userId);
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const passwordValid = await argon2.verify(
      user.passwordHash,
      changePasswordDto.currentPassword,
    );

    if (!passwordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    if (changePasswordDto.currentPassword === changePasswordDto.newPassword) {
      throw new BadRequestException('New password must be different from the current one');
    }

    const passwordHash = await argon2.hash(changePasswordDto.newPassword);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash,
      },
    });

    return { message: 'Password updated successfully' };
  }

  private async storeRefreshTokenHash(
    userId: string,
    refreshToken: string,
  ) {
    const refreshTokenHash = await argon2.hash(refreshToken);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshTokenHash,
      },
    });
  }

  private async generateTokens(userId: string, email: string, role: UserRole) {
    const payload = { sub: userId, email, role };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret:
        this.configService.get<string>('JWT_ACCESS_SECRET') ||
        'default-secret',
      expiresIn:
        (this.configService.get<string>('JWT_ACCESS_EXPIRES') || '15m') as any,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret:
        this.configService.get<string>('JWT_REFRESH_SECRET') ||
        'default-refresh-secret',
      expiresIn:
        (this.configService.get<string>('JWT_REFRESH_EXPIRES') || '7d') as any,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return success even if user doesn't exist for security
      return {
        message: 'If an account with that email exists, a password reset link has been sent.',
      };
    }

    // Generate a random token
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    // Set token expiration to 1 hour from now
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // Delete any existing reset tokens for this user
    await this.prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    // Create new reset token
    await this.prisma.passwordResetToken.create({
      data: {
        token,
        expiresAt,
        userId: user.id,
      },
    });

    // In a real application, you would send an email here
    // For now, we'll just return the token for testing purposes
    return {
      message: 'If an account with that email exists, a password reset link has been sent.',
      token, // Remove this in production - for testing only
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, password } = resetPasswordDto;

    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    if (resetToken.used) {
      throw new BadRequestException('This reset token has already been used');
    }

    if (resetToken.expiresAt < new Date()) {
      throw new BadRequestException('Reset token has expired');
    }

    // Hash the new password
    const passwordHash = await argon2.hash(password);

    // Update user password
    await this.prisma.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash },
    });

    // Mark token as used
    await this.prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { used: true },
    });

    return {
      message: 'Password has been reset successfully',
    };
  }
}
