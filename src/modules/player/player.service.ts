import { Injectable } from '@nestjs/common';

import { RoomService } from '../room/room.service';

import { PlayerRole } from './constants';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { PlayerModel } from './player.model';
import { PlayerRepository } from './player.repository';

@Injectable()
export class PlayerService {
  constructor(
    private playerRepo: PlayerRepository,
    private roomService: RoomService,
  ) {}

  async createPlayer(player: CreatePlayerDto): Promise<PlayerModel> {
    let roomId = player.roomId;

    if (!roomId) {
      const room = await this.roomService.createRoom();
      roomId = room.id;

      return this.playerRepo.createPlayer(
        player.name,
        roomId,
        PlayerRole.ADMIN,
      );
    }

    return this.playerRepo.createPlayer(player.name, roomId);
  }

  async getPlayerById(id: number): Promise<PlayerModel> {
    return this.playerRepo.getPlayerById(id);
  }
}
