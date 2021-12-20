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

      const newPlayer = await this.playerRepo.createPlayer(
        player.name,
        roomId,
        PlayerRole.ADMIN,
      );

      this.roomService.updateNbPlayersRoom(room.id);

      return newPlayer;
    }

    const newPlayer = await this.playerRepo.createPlayer(player.name, roomId);

    this.roomService.updateNbPlayersRoom(roomId);

    return newPlayer;
  }

  async getPlayerById(id: number): Promise<PlayerModel> {
    return this.playerRepo.getPlayerById(id);
  }
}
