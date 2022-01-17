import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';
import { PLAYER, PlayerRole } from '../player/constants';
import { PlayerModel } from '../player/player.model';

import { ROOM } from './constants';
import { UpdateRoomDto } from './dtos/update-room.dto';
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
          .update({ roomCode, role: PlayerRole.ADMIN });

        return room;
      });
    } catch (error) {
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

  async updateRoom(
    { name, status, dateEnd }: UpdateRoomDto,
    code: string,
  ): Promise<RoomModel> {
    const [room] = await this.db
      .client<RoomModel>(ROOM)
      .where({ code })
      .update({
        name,
        status,
        dateEnd,
      })
      .returning('*');

    return room;
  }
}
