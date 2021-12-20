import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

import { PLAYER, PlayerRole } from './constants';
import { PlayerModel } from './player.model';

@Injectable()
export class PlayerRepository {
  constructor(readonly db: DatabaseService) {}

  async createPlayer(
    name: string,
    roomId: number,
    role: PlayerRole = PlayerRole.PLAYER,
  ): Promise<PlayerModel> {
    const player = await this.db.client
      .table<PlayerModel>(PLAYER)
      .returning('*')
      .insert<PlayerModel[]>({
        name,
        roomId,
        role,
      });

    return player.at(0);
  }

  async getPlayerByPseudo(pseudo: string): Promise<PlayerModel> {
    const players = await this.db
      .client<PlayerModel>(PLAYER)
      .where('name', pseudo);

    return players.at(0);
  }

  async getPlayerById(id: number): Promise<PlayerModel> {
    const player = await this.db.client<PlayerModel>(PLAYER).where('id', id);

    return player.at(0);
  }
}
