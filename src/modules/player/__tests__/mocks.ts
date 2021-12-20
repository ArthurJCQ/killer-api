import { PlayerRole, PlayerStatus } from '../constants';
import { PlayerModel } from '../player.model';
import { PlayerRepository } from '../player.repository';

export const playerRepositoryMock = (): Omit<PlayerRepository, 'db'> => {
  const dummyPlayers: PlayerModel[] = [];

  return {
    createPlayer: (name: string): Promise<PlayerModel> => {
      const player = {
        id: Math.floor(Math.random() * 999999),
        name,
        status: PlayerStatus.ALIVE,
        role: PlayerRole.PLAYER,
        roomId: 1,
      };

      dummyPlayers.push(player);

      return Promise.resolve(player);
    },

    getPlayerByPseudo: (name: string): Promise<PlayerModel> => {
      const player = dummyPlayers.find(
        ({ name: playerName }) => playerName === name,
      );

      return Promise.resolve(player);
    },

    getPlayerById: (id: number): Promise<PlayerModel> => {
      const player = dummyPlayers.find(({ id: playerId }) => playerId === id);

      return Promise.resolve(player);
    },
  };
};
