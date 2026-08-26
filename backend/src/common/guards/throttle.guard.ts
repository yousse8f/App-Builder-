import { Injectable } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler';

@Injectable()
export class ThrottlerGuardCustom extends ThrottlerGuard {
  protected getThrottlerException(): ThrottlerException {
    return new ThrottlerException('Too many requests. Please try again later.');
  }
}