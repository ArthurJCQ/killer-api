import { Injectable } from '@nestjs/common';
import adjectives from 'adjectives';
import { PlayerRepository } from './repository/player.repository';
import { PlayerModel } from './model/player.model';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const getRandomFruitsName = require('random-fruits-name');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const adjectives = require('adjectives');

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
}
