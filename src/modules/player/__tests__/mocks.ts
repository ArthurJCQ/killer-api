import { PlayerRole, PlayerStatus } from '../constants';
import { PlayerModel } from '../player.model';
import { PlayerRepository } from '../player.repository';

export const playerRepositoryMock = (): Omit<PlayerRepository, 'db'> => {
  const dummyPlayers: PlayerModel[] = [];

  return {
    createPlayer: (
      name: string,
      role: PlayerRole = PlayerRole.PLAYER,
      roomId?: number,
    ): Promise<PlayerModel> => {
      const player = {
        id: Math.floor(Math.random() * 999999),
        name,
        status: PlayerStatus.ALIVE,
        role,
        roomId,
      };

      dummyPlayers.push(player);

      return Promise.resolve(player);
    },

    getPlayerByNameInRoom: (roomId: number, name: string): Promise<PlayerModel> => {
      const player = dummyPlayers.find(
        (player) => player.name === name && player.roomId === roomId,
      );

      return Promise.resolve(player);
    },

    getPlayerById: (id: number): Promise<PlayerModel> => {
      const player = dummyPlayers.find(({ id: playerId }) => playerId === id);

      return Promise.resolve(player);
    },

    async getNbPlayersByRoomId(roomId: number): Promise<number> {
      const playersRoom = dummyPlayers.filter(
        (player) => player.roomId === roomId,
      );

      return Promise.resolve(playersRoom.length);
    },

    async setRoomToPlayer(
      playerId: number,
      roomId: number,
    ): Promise<PlayerModel> {
      const player = dummyPlayers.find((player) => player.id === playerId);

      player.roomId = roomId;

      return Promise.resolve(player);
    },

    async updatePlayer(
      id: number,
      name?: string,
      passcode?: number,
    ): Promise<PlayerModel> {
      const player = dummyPlayers.find((player) => player.id === id);

      if (name) {
        player.name = name;
      }

      if (passcode) {
        player.passcode = passcode;
      }

      return Promise.resolve(player);
    },

    async getMyPlayer(
      name: string,
      passcode: number,
      roomId: number,
    ): Promise<PlayerModel> {
      const player = dummyPlayers.find(
        (player) =>
          player.name === name &&
          player.passcode === passcode &&
          player.roomId === roomId,
      );

      return Promise.resolve(player);
    },
  };
};
