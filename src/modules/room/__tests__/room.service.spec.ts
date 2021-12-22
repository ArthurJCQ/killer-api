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
    const room = await service.createRoom();
    expect(room).toBeDefined();
    expect(room.code).toHaveLength(5);
  });
});
