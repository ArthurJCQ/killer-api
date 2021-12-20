import { PlayerModel } from './modules/player/player.model';

interface Class {
  new (...args: unknown[]): unknown;
}

declare global {
  namespace Express {
    interface Request {
      currentPlayer?: PlayerModel;
      session?: {
        playerId?: number;
      };
    }
  }
}
