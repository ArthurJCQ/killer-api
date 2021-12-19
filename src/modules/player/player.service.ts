import { Injectable } from '@nestjs/common';

import { PlayerModel } from './player.model';
import { PlayerRepository } from './player.repository';

@Injectable()
export class PlayerService {
  constructor(private playerRepo: PlayerRepository) {}

  async createPlayer(name: string): Promise<PlayerModel> {
    const passcode = this.generatePassCode();

    return this.playerRepo.createPlayer(name, passcode);
  }

  async getPlayerById(id: number): Promise<PlayerModel> {
    return this.playerRepo.getPlayerById(id);
  }

  private generatePassCode(): number {
    const passcode = Math.floor(1000 + Math.random() * 9000);

    if (0 === passcode) {
      return this.generatePassCode();
    }

    return passcode;
  }
}
