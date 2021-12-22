import { Test, TestingModule } from '@nestjs/testing';

import { roomServiceMock } from '../../room/__tests__/mocks';
import { RoomService } from '../../room/room.service';
import { PlayerRepository } from '../player.repository';
import { PlayerService } from '../player.service';

import { playerRepositoryMock } from './mocks';

describe('PlayerService', () => {
  let service: PlayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerService,
        {
          provide: PlayerRepository,
          useValue: playerRepositoryMock(),
        },
        {
          provide: RoomService,
          useValue: roomServiceMock(),
        },
      ],
    }).compile();

    service = module.get(PlayerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a player', async () => {
    const player = await service.createPlayer({
      name: 'John',
    });
    expect(player).toBeDefined();
    expect(player.name).toEqual('John');
  });
});
