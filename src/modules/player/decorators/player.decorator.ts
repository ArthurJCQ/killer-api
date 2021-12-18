import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Player = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    return request.currentPlayer;
  },
);
