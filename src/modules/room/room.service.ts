import { Injectable } from '@nestjs/common';
import randomstring from 'randomstring';

import { PlayerService } from '../player/player.service';

import { RoomModel } from './room.model';
import { RoomRepository } from './room.repository';

@Injectable()
export class RoomService {
  constructor(
    private roomRepo: RoomRepository,
    private playerService: PlayerService,
  ) {}

  async createRoom(playerId: number, playerName: string): Promise<RoomModel> {
    const roomCode = await this.generateRoomCode();

    const room = await this.roomRepo.createRoom(roomCode, playerName);

    await this.playerService.setRoomToPlayer(playerId, room.id);

    return room;
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
