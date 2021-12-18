import { CanActivate, ExecutionContext } from '@nestjs/common';

import { PlayerRole } from '../constants';

export class AdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    return request.currentPlayer?.role === PlayerRole.ADMIN;
  }
}
