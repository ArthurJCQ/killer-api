import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { PlayerService } from '../services/player.service';
import { RoomService } from '../services/room.service';

@Injectable()
export class ExtendRoomSessionMiddleware implements NestMiddleware {
  constructor(
    private readonly roomService: RoomService,
    private readonly playerService: PlayerService,
  ) {}

  async use(req: Request, _: Response, next: NextFunction): Promise<void> {
    const { playerId } = req.session;

    if (playerId) {
      try {
        const { roomCode } = await this.playerService.getPlayerById(playerId);
        const { dateEnd } = await this.roomService.getRoomByCode(roomCode);

        if (new Date() < dateEnd) {
          // Only changes every minute so that it's not sent with every request.
          req.session.refreshTime = Math.floor(Date.now() / 60e3);
        }
      } catch (exception) {
        req.session.refreshTime = null;
      }
    }

    next();
  }
}
