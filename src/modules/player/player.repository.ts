import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

import { PLAYER } from './constants';
import { GetMyPlayerDto } from './dtos/get-my-player.dto';
import { UpdatePlayerDto } from './dtos/update-player.dto';
import { PlayerModel } from './player.model';

@Injectable()
export class PlayerRepository {
  constructor(readonly db: DatabaseService) {}

  async createPlayer(name: string, roomCode?: string): Promise<PlayerModel> {
    const [player] = await this.db
      .client<PlayerModel>(PLAYER)
      .returning('*')
      .insert<PlayerModel[]>({
        name,
        roomCode,
      });

    return player;
  }

  async updatePlayer(
    { name, passcode, status }: UpdatePlayerDto,
    id: number,
  ): Promise<PlayerModel> {
    const [player] = await this.db
      .client<PlayerModel>(PLAYER)
      .where({
        id,
      })
      .update({
        name,
        passcode,
        status,
      })
      .returning('*');

    return player;
  }

  async getPlayer({
    name,
    passcode,
    roomCode,
  }: GetMyPlayerDto): Promise<PlayerModel> {
    const [player] = await this.db
      .client<PlayerModel>(PLAYER)
      .where({
        name,
        passcode,
        roomCode,
      })
      .returning('*');

    return player;
  }

  async getPlayerByNameInRoom(
    roomCode: string,
    name: string,
  ): Promise<PlayerModel> {
    const [player] = await this.db.client<PlayerModel>(PLAYER).where({
      name,
      roomCode,
    });

    return player;
  }

  async getPlayerById(id: number): Promise<PlayerModel> {
    const [player] = await this.db.client<PlayerModel>(PLAYER).where('id', id);

    return player;
  }

  async getNbPlayersByRoomCode(roomCode: string): Promise<number> {
    const [nbPlayers] = await this.db
      .client<PlayerModel>(PLAYER)
      .count()
      .returning('count')
      .where({ roomCode });

    return nbPlayers.count;
  }

  getAllPlayersInRoom(roomCode: string): Promise<PlayerModel[]> {
    return this.db
      .client<PlayerModel>(PLAYER)
      .where({ roomCode })
      .returning('*');
  }
}
