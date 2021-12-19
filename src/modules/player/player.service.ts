import { Injectable } from '@nestjs/common';

import { PlayerModel } from './player.model';
import { PlayerRepository } from './player.repository';

@Injectable()
export class PlayerService {
  constructor(private playerRepo: PlayerRepository) {}

  async createPlayer(name: string): Promise<PlayerModel> {
    const passcode = Math.floor(1000 + Math.random() * 9000);

    return this.playerRepo.createPlayer(name, passcode);
  }

  async getPlayerById(id: number): Promise<PlayerModel> {
    return this.playerRepo.getPlayerById(id);
  }
}
