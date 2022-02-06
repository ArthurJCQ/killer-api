import { missionServiceMock } from '../../mission/__tests__/mocks';
import { RoomStatus } from '../../room/constants';
import { RoomModel } from '../../room/room.model';
import { PlayerRole, PlayerStatus } from '../constants';
import { GetMyPlayerDto } from '../dtos/get-my-player.dto';
import { UpdatePlayerDto } from '../dtos/update-player.dto';
import { PlayerModel } from '../player.model';
import { PlayerRepository } from '../player.repository';
import { PlayerService } from '../player.service';

export const playerServiceMock = (): Partial<PlayerService> => {
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
      name: 'Arty',
      passcode: null,
      roomCode: 'CODE2',
      role: PlayerRole.PLAYER,
      status: PlayerStatus.ALIVE,
    },
    {
      id: 3,
      name: 'John',
      passcode: null,
      roomCode: 'CODE2',
      role: PlayerRole.PLAYER,
      status: PlayerStatus.ALIVE,
    },
    {
      id: 4,
      name: 'John',
      passcode: null,
      roomCode: 'CODE11',
      role: PlayerRole.PLAYER,
      status: PlayerStatus.ALIVE,
    },
    {
      id: 5,
      name: 'John',
      passcode: null,
      roomCode: 'CODE12',
      role: PlayerRole.PLAYER,
      status: PlayerStatus.ALIVE,
    },
    {
      id: 6,
      name: 'John',
      passcode: null,
      roomCode: 'CODE12',
      role: PlayerRole.PLAYER,
      status: PlayerStatus.ALIVE,
    },
  ];

  return {
    async checkAllPlayerInRoomHavePasscode(roomCode: string): Promise<boolean> {
      const players = dummyPlayers.filter(
        (player) => player.roomCode === roomCode,
      );

      const playersWithPasscode = players.filter((player) => player.passcode);

      return Promise.resolve(players.length === playersWithPasscode.length);
    },

    async checkIfEnoughMissionInRoom(roomCode: string): Promise<boolean> {
      const players = dummyPlayers.filter(
        (player) => player.roomCode === roomCode,
      );

      const missionsInRoom = await missionServiceMock().getMissions(roomCode);

      return Promise.resolve(players.length === missionsInRoom.length);
    },
  };
};

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

  const date = new Date();
  const roomDummies: RoomModel[] = [
    {
      code: 'CODE1',
      name: 'Room Name',
      status: RoomStatus.PENDING,
      createdAt: date,
      dateEnd: new Date(date.getDate() + 7),
    },
    {
      code: 'CODE2',
      name: 'Room Name',
      status: RoomStatus.ENDED,
      createdAt: date,
      dateEnd: new Date(date.getDate() + 7),
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
        (player) => roomCode === player.roomCode,
      );

      return Promise.resolve(players);
    },

    async getPlayerRoomStatus(code: string): Promise<RoomStatus> {
      const room = roomDummies.find((room) => code === room.code);

      return Promise.resolve(room?.status);
    },

    deletePlayer(playerId: number): Promise<boolean> {
      dummyPlayers.forEach((player, index) => {
        if (player.id === playerId) {
          dummyPlayers.splice(index, 1);
          return;
        }
      });

      return Promise.resolve(true);
    },

    setMissionIdToPlayers(
      players: Pick<PlayerModel, 'id' | 'missionId'>[],
    ): Promise<void> {
      dummyPlayers.forEach((dummyPlayer) => {
        const { missionId } = players.find(
          (player) => dummyPlayer.id === player.id,
        );

        dummyPlayer.missionId = missionId;
      });

      return Promise.resolve();
    },

    setTargetIdToPlayers(
      players: Pick<PlayerModel, 'id' | 'targetId'>[],
    ): Promise<void> {
      dummyPlayers.forEach((dummyPlayer) => {
        const { targetId } = players.find(
          (player) => dummyPlayer.id === player.id,
        );

        dummyPlayer.targetId = targetId;
      });

      return Promise.resolve();
    },
  };
};
