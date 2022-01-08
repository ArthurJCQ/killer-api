import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { RoomStatus } from '../room/constants';
import { RoomService } from '../room/room.service';

import { PlayerRole } from './constants';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { GetMyPlayerDto } from './dtos/get-my-player.dto';
import { UpdatePlayerDto } from './dtos/update-player.dto';
import { PlayerModel } from './player.model';
import { PlayerRepository } from './player.repository';

@Injectable()
export class PlayerService {
  constructor(
    private playerRepo: PlayerRepository,
    private roomService: RoomService,
  ) {}

  async createPlayer({
    name,
    roomCode,
  }: CreatePlayerDto): Promise<PlayerModel> {
    if (roomCode) {
      const room = await this.roomService.getRoomByCode(roomCode);

      if (room.status !== RoomStatus.PENDING) {
        throw new BadRequestException(
          'You can only create player in Pending Status Room',
        );
      }

      const existingPlayer = await this.playerRepo.getPlayerByNameInRoom(
        roomCode,
        name,
      );

      if (existingPlayer) {
        throw new BadRequestException(
          'Player with this pseudo already exists in this room',
        );
      }
    }

    const playerRole = roomCode ? PlayerRole.PLAYER : PlayerRole.ADMIN;

    return this.playerRepo.createPlayer(name, playerRole, roomCode);
  }

  async getMyPlayer({
    name,
    passcode,
    roomCode,
  }: GetMyPlayerDto): Promise<PlayerModel> {
    const player = await this.playerRepo.getMyPlayer(name, passcode, roomCode);

    if (!player) {
      throw new NotFoundException('Player not found');
    }

    return player;
  }

  async getPlayerById(id: number): Promise<PlayerModel> {
    return this.playerRepo.getPlayerById(id);
  }

  async updatePlayer({
    id,
    passcode,
    name,
  }: UpdatePlayerDto): Promise<PlayerModel> {
    const player = await this.playerRepo.getPlayerById(id);

    if (!player) {
      throw new NotFoundException('No player found to update');
    }

    return this.playerRepo.updatePlayer(id, name, passcode);
  }
}
