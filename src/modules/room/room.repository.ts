import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';
import { PLAYER } from '../player/constants';
import { PlayerModel } from '../player/player.model';

import { ROOM } from './constants';
import { RoomModel } from './room.model';

@Injectable()
export class RoomRepository {
  constructor(private db: DatabaseService) {}

  async createRoom(
    roomCode: string,
    playerName: string,
    playerId: number,
  ): Promise<RoomModel> {
    try {
      return this.db.client.transaction(async (trx) => {
        const [room] = await trx<RoomModel>(ROOM)
          .returning('*')
          .insert<RoomModel[]>({
            code: roomCode,
            name: `${playerName}'s room`,
          });

        await trx<PlayerModel>(PLAYER)
          .where('id', playerId)
          .update('roomCodee', roomCode);

        return room;
      });
    } catch (error) {
      console.log('ERROR');
      throw new Error(`Something went wrong : ${error}. Rollback DB.`);
    }
  }

  async getRoomByCode(roomCode: string): Promise<RoomModel> {
    const [room] = await this.db
      .client<RoomModel>(ROOM)
      .returning('*')
      .where({ code: roomCode });

    return room;
  }
}
