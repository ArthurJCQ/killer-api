import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

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
});
