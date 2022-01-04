import { RoomStatus } from '../constants';
import { RoomModel } from '../room.model';
import { RoomRepository } from '../room.repository';
import { RoomService } from '../room.service';

export const roomServiceMock = (): Omit<RoomService, 'roomRepo'> => {
  const roomDummies: RoomModel[] = [];

  return {
    async createRoom(): Promise<RoomModel> {
      const date = new Date();

      const room = {
        id: roomDummies.length,
        name: 'TestRoom',
        code: 'X22XR',
        status: RoomStatus.PENDING,
        createdAt: date,
        dateEnd: new Date(date.getDate() + 30),
      };

      roomDummies.push(room);

      return Promise.resolve(room);
    },
  };
};

export const roomRepositoryMock = (): Omit<RoomRepository, 'db'> => {
  const roomDummies: RoomModel[] = [];

  return {
    async createRoom(roomCode: string): Promise<RoomModel> {
      const date = new Date();

      const room = {
        id: roomDummies.length,
        name: 'TestRoom',
        code: roomCode,
        status: RoomStatus.PENDING,
        createdAt: date,
        dateEnd: new Date(date.getDate() + 30),
      };

      roomDummies.push(room);

      return Promise.resolve(room);
    },
  };
};