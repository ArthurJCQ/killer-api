import { BadRequestException, NotFoundException } from '@nestjs/common';
import randomstring from 'randomstring';

import { playerServiceMock } from '../../player/__tests__/mocks';
import { PlayerRole, PlayerStatus } from '../../player/constants';
import { PlayerModel } from '../../player/player.model';
import { RoomStatus } from '../constants';
import { UpdateRoomDto } from '../dtos/update-room.dto';
import { RoomModel } from '../room.model';
import { RoomRepository } from '../room.repository';
import { RoomService } from '../room.service';

export const roomServiceMock = (): Omit<RoomService, 'roomRepo'> => {
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
  const playerDummies: PlayerModel[] = [
    {
      id: 1,
      name: 'Arty',
      passcode: '1234',
      roomCode: 'CODE1',
      role: PlayerRole.PLAYER,
      status: PlayerStatus.ALIVE,
    },
  ];

  return {
    async createRoom({
      id,
      name,
    }: Pick<PlayerModel, 'id' | 'name' | 'roomCode'>): Promise<RoomModel> {
      const date = new Date();

      const roomCode = this.generateRoomCode();

      const room = {
        code: roomCode,
        name: `${name}'s room`,
        status: RoomStatus.PENDING,
        createdAt: date,
        dateEnd: new Date(date.getDate() + 30),
      };

      const player = playerDummies.find((player) => player.id === id);

      player.roomCode = roomCode;

      roomDummies.push(room);

      return Promise.resolve(room);
    },

    async generateRoomCode(): Promise<string> {
      const code = randomstring.generate({
        length: 5,
        capitalization: 'uppercase',
      });

      const room = await this.getRoomByCode(code);

      if (room) {
        return this.generateRoomCode();
      }
    },

    async getRoomByCode(code: string): Promise<RoomModel> {
      const room = roomDummies.find((room) => room.code === code);

      if (!room) {
        throw new NotFoundException({ key: 'room.NOT_FOUND' });
      }

      return Promise.resolve(room);
    },

    async updateRoom(
      { name, status, dateEnd }: UpdateRoomDto,
      code: string,
    ): Promise<RoomModel> {
      const room = roomDummies.find((room) => room.code === code);

      if (!room) {
        throw new NotFoundException({ key: 'room.NOT_FOUND' });
      }

      if (room.status === RoomStatus.ENDED) {
        throw new BadRequestException({
          key: 'room.WRONG_STATUS.ALREADY_ENDED',
        });
      }

      if (name) {
        room.name = name;
      }

      if (status) {
        room.status = status;
      }

      if (dateEnd) {
        room.dateEnd = dateEnd;
      }

      return Promise.resolve(room);
    },

    async canStartGame(code: string): Promise<boolean> {
      const enoughMissions =
        await playerServiceMock().checkIfEnoughMissionInRoom(code);
      const playersHavePasscode =
        await playerServiceMock().checkAllPlayerInRoomHavePasscode(code);

      return Promise.resolve(enoughMissions && playersHavePasscode);
    },

    async getAllPlayersInRoom(code: string): Promise<PlayerModel[]> {
      const room = roomDummies.find((room) => room.code === code);

      if (!room) {
        throw new NotFoundException({ key: 'room.NOT_FOUND' });
      }

      return playerServiceMock().getAllPlayersInRoom(code);
    },
  };
};

export const roomRepositoryMock = (): Omit<RoomRepository, 'db'> => {
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
      code: 'CODE11',
      name: 'Room Name',
      status: RoomStatus.PENDING,
      createdAt: date,
      dateEnd: new Date(date.getDate() + 7),
    },
    {
      code: 'CODE12',
      name: 'Room Name',
      status: RoomStatus.PENDING,
      createdAt: date,
      dateEnd: new Date(date.getDate() + 7),
    },
    {
      code: 'CODE3',
      name: 'Room Name',
      status: RoomStatus.IN_GAME,
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
    async createRoom(roomCode: string): Promise<RoomModel> {
      const date = new Date();

      const room = {
        code: roomCode,
        name: 'TestRoom',
        status: RoomStatus.PENDING,
        createdAt: date,
        dateEnd: new Date(date.getDate() + 30),
      };

      roomDummies.push(room);

      return Promise.resolve(room);
    },

    async getRoomByCode(roomCode: string): Promise<RoomModel> {
      const room = roomDummies.find((room) => room.code === roomCode);

      return Promise.resolve(room);
    },

    async updateRoom(
      { name, status, dateEnd }: UpdateRoomDto,
      code: string,
    ): Promise<RoomModel> {
      const room = roomDummies.find((room) => room.code === code);

      if (name) {
        room.name = name;
      }

      if (status) {
        room.status = status;
      }

      if (dateEnd) {
        room.dateEnd = dateEnd;
      }

      return Promise.resolve(room);
    },
  };
};
