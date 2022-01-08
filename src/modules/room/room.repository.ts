import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';
import { PLAYER } from '../player/constants';
import { PlayerModel } from '../player/player.model';

import { ROOM } from './constants';
import { RoomModel } from './room.model';

@Injectable()
export class RoomRepository {
  constructor(private db: DatabaseService) {}

  async createRoom(roomCode: string, playerName: string): Promise<RoomModel> {
    const [room] = await this.db
      .client<RoomModel>(ROOM)
      .returning('*')
      .insert<RoomModel[]>({
        code: roomCode,
        name: `${playerName}'s room`,
      });

    return room;
  }

  async getRoomByCode(roomCode: string): Promise<RoomModel> {
    const [room] = await this.db
      .client<RoomModel>(ROOM)
      .returning('*')
      .where({ code: roomCode });

    return room;
  }

  setRoomToPlayer(playerId: number, roomCode: string): void {
    this.db
      .client<PlayerModel>(PLAYER)
      .where('id', playerId)
      .update('roomCode', roomCode);
  }
}
