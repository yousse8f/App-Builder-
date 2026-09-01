import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_ACCESS_SECRET') || 'default-secret',
    });
  }

  async validate(payload: { sub: string; email: string; role: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: { client: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('User account is not active');
    }

    // For CLIENT role, ensure they have an active client
    if (user.role === 'CLIENT') {
      if (!user.client) {
        throw new UnauthorizedException(
          'Client profile not found. Please contact support.',
        );
      }
      if (user.client.status !== 'ACTIVE') {
        throw new UnauthorizedException('Client account is not active');
      }
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      client: user.client,
    };
  }
}
