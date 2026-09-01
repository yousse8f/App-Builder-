import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import * as crypto from 'crypto';

@Injectable()
export class HmacAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const signature = request.headers['x-signature'] as string;
    const timestamp = request.headers['x-timestamp'] as string;
    const apiKey = request.headers['x-api-key'] as string;

    if (!signature || !timestamp || !apiKey) {
      throw new UnauthorizedException(
        'Missing required authentication headers',
      );
    }

    // Check timestamp to prevent replay attacks (5 minutes tolerance)
    const currentTime = Math.floor(Date.now() / 1000);
    const requestTime = parseInt(timestamp, 10);

    if (Math.abs(currentTime - requestTime) > 300) {
      throw new UnauthorizedException(
        'Request timestamp is too old or in the future',
      );
    }

    // Get the API secret from environment or database
    const apiSecret = process.env.HMAC_API_SECRET;
    if (!apiSecret) {
      throw new UnauthorizedException('API secret not configured');
    }

    // Verify API key
    const validApiKey = process.env.HMAC_API_KEY;
    if (apiKey !== validApiKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    // Recreate the signature
    const method = request.method;
    const path = request.url;
    const body = JSON.stringify(request.body) || '';

    const payload = `${timestamp}${method}${path}${body}`;
    const expectedSignature = crypto
      .createHmac('sha256', apiSecret)
      .update(payload)
      .digest('hex');

    // Use constant-time comparison to prevent timing attacks
    if (
      !crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature),
      )
    ) {
      throw new UnauthorizedException('Invalid signature');
    }

    return true;
  }
}
