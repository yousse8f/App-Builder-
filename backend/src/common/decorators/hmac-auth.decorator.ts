import { SetMetadata } from '@nestjs/common';

export const HMAC_AUTH_KEY = 'hmacAuth';
export const HmacAuth = () => SetMetadata(HMAC_AUTH_KEY, true);