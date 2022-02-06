import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PlayerRole } from '../constants';

@Injectable()
export class PlayerRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const routeRole = this.reflector.get<PlayerRole>(
      'role',
      context.getHandler(),
    );

    if (!routeRole) return true;

    if (!request.currentPlayer) {
      throw new ForbiddenException('Forbidden: There is no player in session');
    }

    return this.matchRole(request.currentPlayer.role, routeRole);
  }

  matchRole(playerRole?: PlayerRole, routeRole?: PlayerRole): boolean {
    switch (playerRole) {
      case PlayerRole.ADMIN:
        return true;
      default:
        return playerRole === routeRole;
    }
  }
}
