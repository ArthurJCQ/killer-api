import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';
import { PLAYER } from '../player/constants';
import { PlayerModel } from '../player/player.model';

import { ROOM } from './constants';
import { RoomModel } from './room.model';

@Injectable()
export class RoomRepository {
  constructor(private db: DatabaseService) {}

  async createRoom(roomCode: string): Promise<RoomModel> {
    const room = await this.db
      .client<RoomModel>(ROOM)
      .returning('*')
      .insert<RoomModel[]>({
        code: roomCode,
      });

    return room.at(0);
  }

  async updateNbPlayers(roomId: number): Promise<number> {
    const nbPlayers = await this.db
      .client<PlayerModel>(PLAYER)
      .count()
      .returning('count')
      .where({ roomId });

    const room = await this.db
      .client<RoomModel>(ROOM)
      .update<RoomModel[]>({
        nbPlayer: nbPlayers.at(0).count,
      })
      .where({ id: roomId })
      .returning('nbPlayer');

    return room.at(0);
  }
}
