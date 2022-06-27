import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { RoomStatus } from '../constants';
import { RoomService } from '../services/room.service';

@Injectable()
export class RoomStatusGuard implements CanActivate {
  constructor(private reflector: Reflector, private roomService: RoomService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const routeRoomStatus = this.reflector.get<RoomStatus>(
      'roomStatus',
      context.getHandler(),
    );

    if (!routeRoomStatus) return true;

    if (!request.currentPlayer) {
      throw new ForbiddenException({ key: 'player.FORBIDDEN.NO_USER_SESSION' });
    }

    const playerRoom = await this.roomService.getRoomByCode(
      request.currentPlayer.roomCode,
    );

    if (playerRoom.status !== routeRoomStatus) {
      throw new ForbiddenException({
        key: 'room.WRONG_STATUS.MISMATCH',
        args: { current: playerRoom.status, expected: routeRoomStatus },
      });
    }

    return true;
  }
}
