import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Player = createParamDecorator(
  (data: never, context: ExecutionContext): ParameterDecorator => {
    const request = context.switchToHttp().getRequest();

    return request.currentPlayer;
  },
);
