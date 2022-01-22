import { BadRequestException, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';

import { playerServiceMock } from '../../player/__tests__/mocks';
import { PlayerService } from '../../player/player.service';
import { RoomStatus } from '../constants';
import { RoomRepository } from '../room.repository';
import { RoomService } from '../room.service';

import { roomRepositoryMock } from './mocks';

describe('RoomService', () => {
  let service: RoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomService,
        {
          provide: RoomRepository,
          useValue: roomRepositoryMock(),
        },
        {
          provide: PlayerService,
          useValue: playerServiceMock(),
        },
        {
          provide: EventEmitter2,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<RoomService>(RoomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a room', async () => {
    const room = await service.createRoom({
      id: 1,
      name: 'Arty',
      roomCode: '',
    });
    expect(room).toBeDefined();
    expect(room.code).toHaveLength(5);
  });

  it('should not create room for player already in a room', async () => {
    await expect(
      service.createRoom({
        id: 1,
        name: 'Arty',
        roomCode: 'CODE1',
      }),
    ).rejects.toThrowError(BadRequestException);
  });

  it('should get a room', async () => {
    const room = await service.getRoomByCode('CODE1');
    expect(room).toBeDefined();
    expect(room.code).toHaveLength(5);
  });

  it('should not get unexisting room', async () => {
    await expect(service.getRoomByCode('CODE3')).rejects.toThrowError(
      NotFoundException,
    );
  });

  it('should start a game', async () => {
    const room = await service.updateRoom(
      { status: RoomStatus.IN_GAME },
      'CODE1',
    );

    expect(room).toBeDefined();
    expect(room.status).toEqual(RoomStatus.IN_GAME);
  });

  it('should prevent from update an ended game', async () => {
    await expect(
      service.updateRoom({ status: RoomStatus.IN_GAME }, 'CODE2'),
    ).rejects.toThrowError(BadRequestException);
  });
});
