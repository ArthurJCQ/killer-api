import { Injectable } from '@nestjs/common';
import randomstring from 'randomstring';

import { RoomModel } from './room.model';
import { RoomRepository } from './room.repository';

@Injectable()
export class RoomService {
  constructor(private roomRepo: RoomRepository) {}

  async createRoom(): Promise<RoomModel> {
    const roomCode = await this.generateRoomCode();

    return this.roomRepo.createRoom(roomCode);
  }

  async generateRoomCode(): Promise<string> {
    const roomCode = randomstring.generate({
      length: 5,
      capitalization: 'uppercase',
    });

    const existingRoom = await this.roomRepo.getRoomByCode(roomCode);

    if (existingRoom) {
      return this.generateRoomCode();
    }

    return roomCode;
  }
}
