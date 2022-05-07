import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { PlayerService } from '../player.service';

@Injectable()
export class CurrentPlayerMiddleware implements NestMiddleware {
  constructor(private playerService: PlayerService) {}

  async use(req: Request, _: Response, next: NextFunction): Promise<void> {
    const { playerId } = req.session;

    if (playerId) {
      try {
        req.currentPlayer = await this.playerService.getPlayerById(playerId);
      } catch (exception) {
        req.session.playerId = null;
      }
    }

    next();
  }
}
