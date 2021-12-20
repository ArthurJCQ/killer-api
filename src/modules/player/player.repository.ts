import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

import { PlayerModel } from './player.model';

@Injectable()
export class PlayerRepository {
  constructor(readonly db: DatabaseService) {}

  async createPlayer(name: string): Promise<PlayerModel> {
    const player = await this.db.client
      .table<PlayerModel>('player')
      .returning('*')
      .insert<PlayerModel[]>({
        name,
      });

    return player.at(0);
  }

  async getPlayerByPseudo(pseudo: string): Promise<PlayerModel> {
    const players = await this.db
      .client<PlayerModel>('player')
      .where('name', pseudo);

    return players.at(0);
  }

  async getPlayerById(id: number): Promise<PlayerModel> {
    const player = await this.db.client<PlayerModel>('player').where('id', id);

    return player.at(0);
  }
}
