import { Injectable } from '@nestjs/common';
import { PlayerModel } from '../model/player.model';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class PlayerRepository {
  constructor(readonly db: DatabaseService) {}

  async createPlayer(name: string, passcode: number): Promise<PlayerModel> {
    return this.db.client.table<PlayerModel>('player').returning('*').insert({
      name,
      passcode,
    });
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
