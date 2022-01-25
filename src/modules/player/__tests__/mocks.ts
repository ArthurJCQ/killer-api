import { PlayerRole, PlayerStatus } from '../constants';
import { GetMyPlayerDto } from '../dtos/get-my-player.dto';
import { UpdatePlayerDto } from '../dtos/update-player.dto';
import { PlayerModel } from '../player.model';
import { PlayerRepository } from '../player.repository';

export const playerRepositoryMock = (): Omit<PlayerRepository, 'db'> => {
  const dummyPlayers: PlayerModel[] = [
    {
      id: 1,
      name: 'Arty',
      passcode: '1234',
      roomCode: 'CODE1',
      role: PlayerRole.PLAYER,
      status: PlayerStatus.ALIVE,
      missionId: 1,
    },
    {
      id: 2,
      name: 'John',
      passcode: null,
      roomCode: 'CODE2',
      role: PlayerRole.PLAYER,
      status: PlayerStatus.ALIVE,
    },
    {
      id: 3,
      name: 'Doe',
      passcode: null,
      roomCode: 'CODE2',
      role: PlayerRole.PLAYER,
      status: PlayerStatus.ALIVE,
    },
  ];

  return {
    createPlayer: (name: string, roomCode?: string): Promise<PlayerModel> => {
      const player = {
        id: Math.floor(Math.random() * 999999),
        name,
        status: PlayerStatus.ALIVE,
        role: PlayerRole.PLAYER,
        roomCode,
      };

      dummyPlayers.push(player);

      return Promise.resolve(player);
    },

    getPlayerByNameInRoom: (
      roomCode: string,
      name: string,
    ): Promise<PlayerModel> => {
      const player = dummyPlayers.find(
        (player) => player.name === name && player.roomCode === roomCode,
      );

      return Promise.resolve(player);
    },

    getPlayerById: (id: number): Promise<PlayerModel> => {
      const player = dummyPlayers.find(({ id: playerId }) => playerId === id);

      return Promise.resolve(player);
    },

    async getNbPlayersByRoomCode(roomCode: string): Promise<number> {
      const playersRoom = dummyPlayers.filter(
        (player) => player.roomCode === roomCode,
      );

      return Promise.resolve(playersRoom.length);
    },

    async updatePlayer(
      { name, passcode, status }: UpdatePlayerDto,
      id: number,
    ): Promise<PlayerModel> {
      const player = dummyPlayers.find((player) => player.id === id);

      if (name) {
        player.name = name;
      }

      if (passcode) {
        player.passcode = passcode;
      }

      if (status) {
        player.status = status;
      }

      return Promise.resolve(player);
    },

    async getPlayer({
      name,
      passcode,
      roomCode,
    }: GetMyPlayerDto): Promise<PlayerModel> {
      const player = dummyPlayers.find(
        (player) =>
          player.name === name &&
          player.passcode === passcode &&
          player.roomCode === roomCode,
      );

      return Promise.resolve(player);
    },

    getAllPlayersInRoom(roomCode: string): Promise<PlayerModel[]> {
      const players = dummyPlayers.filter(
        (player) => player.roomCode === roomCode,
      );

      return Promise.resolve(players);
    },
  };
};
