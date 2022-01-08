import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { PlayerRole } from './constants';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { GetMyPlayerDto } from './dtos/get-my-player.dto';
import { UpdatePlayerDto } from './dtos/update-player.dto';
import { PlayerModel } from './player.model';
import { PlayerRepository } from './player.repository';

@Injectable()
export class PlayerService {
  constructor(private playerRepo: PlayerRepository) {}

  async createPlayer(player: CreatePlayerDto): Promise<PlayerModel> {
    if (player.roomId) {
      const existingPlayer = await this.playerRepo.getPlayerByNameInRoom(
        player.roomId,
        player.name,
      );

      if (existingPlayer) {
        throw new HttpException(
          'Player with this pseudo already exists in this room',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const playerRole = player.roomId ? PlayerRole.PLAYER : PlayerRole.ADMIN;

    return this.playerRepo.createPlayer(player.name, playerRole, player.roomId);
  }

  async getMyPlayer(getMyPlayer: GetMyPlayerDto): Promise<PlayerModel> {
    const player = await this.playerRepo.getMyPlayer(
      getMyPlayer.name,
      getMyPlayer.passcode,
      getMyPlayer.roomId,
    );

    if (!player) {
      throw new HttpException('Player not found', HttpStatus.NOT_FOUND);
    }

    return player;
  }

  async setRoomToPlayer(
    playerId: number,
    roomId: number,
  ): Promise<PlayerModel> {
    return this.playerRepo.setRoomToPlayer(playerId, roomId);
  }

  async getPlayerById(id: number): Promise<PlayerModel> {
    return this.playerRepo.getPlayerById(id);
  }

  async updatePlayer(player: UpdatePlayerDto): Promise<PlayerModel> {
    return this.playerRepo.updatePlayer(
      player.id,
      player.name,
      player.passcode,
    );
  }
}
