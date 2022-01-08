import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

import { PLAYER, PlayerRole } from './constants';
import { PlayerModel } from './player.model';

@Injectable()
export class PlayerRepository {
  constructor(readonly db: DatabaseService) {}

  async createPlayer(
    name: string,
    role: PlayerRole = PlayerRole.PLAYER,
    roomId?: number,
  ): Promise<PlayerModel> {
    const [player] = await this.db
      .client<PlayerModel>(PLAYER)
      .returning('*')
      .insert<PlayerModel[]>({
        name,
        role,
        roomId,
      });

    return player;
  }

  async updatePlayer(
    id: number,
    name?: string,
    passcode?: number,
  ): Promise<PlayerModel> {
    const [player] = await this.db
      .client<PlayerModel>(PLAYER)
      .where({
        id,
      })
      .update({
        name,
        passcode,
      })
      .returning('*');

    return player;
  }

  async setRoomToPlayer(
    playerId: number,
    roomId: number,
  ): Promise<PlayerModel> {
    const [player] = await this.db
      .client<PlayerModel>(PLAYER)
      .where('id', playerId)
      .update('roomId', roomId)
      .returning('*');

    return player;
  }

  async getMyPlayer(
    name: string,
    passcode: number,
    roomId: number,
  ): Promise<PlayerModel> {
    const [player] = await this.db
      .client<PlayerModel>(PLAYER)
      .where({
        name,
        passcode,
        roomId,
      })
      .returning('*');

    return player;
  }

  async getPlayerByNameInRoom(
    roomId: number,
    name: string,
  ): Promise<PlayerModel> {
    const [player] = await this.db.client<PlayerModel>(PLAYER).where({
      name,
      roomId,
    });

    return player;
  }

  async getPlayerById(id: number): Promise<PlayerModel> {
    const [player] = await this.db.client<PlayerModel>(PLAYER).where('id', id);

    return player;
  }

  async getNbPlayersByRoomId(roomId: number): Promise<number> {
    const [nbPlayers] = await this.db
      .client<PlayerModel>(PLAYER)
      .count()
      .returning('count')
      .where({ roomId });

    return nbPlayers.count;
  }
}
