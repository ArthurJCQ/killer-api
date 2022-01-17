import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import randomstring from 'randomstring';

import { PlayerModel } from '../player/player.model';

import { RoomStatus } from './constants';
import { UpdateRoomDto } from './dtos/update-room.dto';
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

    return this.roomRepo.createRoom(newRoomCode, name, id);
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

  async updateRoom(room: UpdateRoomDto, code: string): Promise<RoomModel> {
    const existingRoom = await this.roomRepo.getRoomByCode(code);

    if (!existingRoom) {
      throw new NotFoundException('No room found with this code');
    }

    if (existingRoom.status === RoomStatus.ENDED) {
      throw new BadRequestException('Can not update ended room');
    }

    return this.roomRepo.updateRoom(room, code);
  }
}
