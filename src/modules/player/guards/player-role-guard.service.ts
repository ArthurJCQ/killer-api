import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
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

    return this.matchRole(request.currentPlayer?.role, routeRole);
  }

  matchRole(playerRole: PlayerRole, routeRole: PlayerRole): boolean {
    if (!routeRole) return true;

    return (
      routeRole && (playerRole === PlayerRole.ADMIN || playerRole === routeRole)
    );
  }
}
