import { Injectable } from '@nestjs/common';
import adjectives from 'adjectives';
import getRandomFruitsName from 'random-fruits-name';

import { PlayerModel } from './player.model';
import { PlayerRepository } from './player.repository';

@Injectable()
export class PlayerService {
  constructor(private playerRepo: PlayerRepository) {}

  async createPlayer(): Promise<PlayerModel> {
    const { name, passcode } = await this.generateNewUsersInfo();

    return this.playerRepo.createPlayer(name, passcode);
  }

  private async generateNewUsersInfo(): Promise<
    Pick<PlayerModel, 'name' | 'passcode'>
  > {
    const randomAdjective =
      adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomFruit = getRandomFruitsName('en', { maxWords: 1 });

    const name = `${
      randomAdjective.charAt(0).toUpperCase() + randomAdjective.slice(1)
    } ${randomFruit}`;

    const alreadyExistingPlayer = await this.playerRepo.getPlayerByPseudo(name);

    const passcode = Math.floor(1000 + Math.random() * 9000);

    if (alreadyExistingPlayer || 0 === passcode) {
      return this.generateNewUsersInfo();
    }

    return { name, passcode };
  }

  async getPlayerById(id: number): Promise<PlayerModel> {
    return this.playerRepo.getPlayerById(id);
  }
}
