import { Injectable } from '@nestjs/common';

import { PlayerModel } from './player.model';
import { PlayerRepository } from './player.repository';

@Injectable()
export class PlayerService {
  constructor(private playerRepo: PlayerRepository) {}

  async createPlayer(name: string): Promise<PlayerModel> {
    return this.playerRepo.createPlayer(name);
  }

  async getPlayerById(id: number): Promise<PlayerModel> {
    return this.playerRepo.getPlayerById(id);
  }
}
