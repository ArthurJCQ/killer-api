import { Injectable } from '@nestjs/common';
import randomstring from 'randomstring';

import { RoomModel } from './room.model';
import { RoomRepository } from './room.repository';

@Injectable()
export class RoomService {
  constructor(private roomRepo: RoomRepository) {}

  async createRoom(): Promise<RoomModel> {
    const roomCode = randomstring.generate({
      length: 5,
      capitalization: 'uppercase',
    });

    return this.roomRepo.createRoom(roomCode);
  }

  async updateNbPlayersRoom(roomId: number): Promise<number> {
    return this.roomRepo.updateNbPlayers(roomId);
  }
}
