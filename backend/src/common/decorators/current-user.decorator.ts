import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!data) {
      return user;
    }

    // Handle nested property access like 'client.id'
    // Return null if any intermediate property is undefined
    return data.split('.').reduce((obj, key) => obj?.[key], user) || null;
  },
);
