import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

import { ROOM } from './constants';
import { RoomModel } from './room.model';

@Injectable()
export class RoomRepository {
  constructor(private db: DatabaseService) {}

  async createRoom(roomCode: string): Promise<RoomModel> {
    const [room] = await this.db
      .client<RoomModel>(ROOM)
      .returning('*')
      .insert<RoomModel[]>({
        id: 5,
        code: roomCode,
      });

    return room;
  }

  async getRoomByCode(roomCode: string): Promise<string> | undefined {
    const [room] = await this.db
      .client<RoomModel>(ROOM)
      .returning('code')
      .where({ code: roomCode });

    return room;
  }
}
