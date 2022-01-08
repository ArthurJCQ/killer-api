import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import randomstring from 'randomstring';

import { PlayerModel } from '../player/player.model';

import { RoomModel } from './room.model';
import { RoomRepository } from './room.repository';

@Injectable()
export class RoomService {
  constructor(private roomRepo: RoomRepository) {}

  async createRoom({
    id,
    name,
    roomCode,
  }: Pick<PlayerModel, 'id' | 'name' | 'roomCode'>): Promise<RoomModel> {
    if (roomCode) {
      throw new BadRequestException('Player is already in a room');
    }

    const newRoomCode = await this.generateRoomCode();

    const room = await this.roomRepo.createRoom(newRoomCode, name);

    this.roomRepo.setRoomToPlayer(id, room.code);

    return room;
  }

  async getRoomByCode(code: string): Promise<RoomModel> {
    const room = await this.roomRepo.getRoomByCode(code);

    if (!room) {
      throw new NotFoundException('Room not found');
    }

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
