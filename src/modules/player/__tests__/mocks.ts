import { PlayerRole, PlayerStatus } from '../constants';
import { PlayerModel } from '../player.model';

export const playerRepositoryMock = () => {
  const dummyPlayers: PlayerModel[] = [];

  return {
    createPlayer: (name: string, passcode: number): Promise<PlayerModel> => {
      const player = {
        id: Math.floor(Math.random() * 999999),
        name,
        passcode,
        status: PlayerStatus.ALIVE,
        role: PlayerRole.PLAYER,
        roomId: 1,
      };

      dummyPlayers.push(player);

      return Promise.resolve(player);
    },

    getPlayerByPseudo: (name: string): Promise<PlayerModel> => {
      const user = dummyPlayers.find((player) => player.name === name);
      return Promise.resolve(user);
    },
  };
};
