import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { DatabaseService } from '../../database/database.service';
import { PlayerRepository } from '../player.repository';
import { PlayerService } from '../player.service';

import { playerRepositoryMock } from './mocks';

describe('PlayerService', () => {
  let service: PlayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        PlayerService,
        {
          provide: PlayerRepository,
          useValue: playerRepositoryMock(),
        },
        DatabaseService,
      ],
    }).compile();

    service = module.get(PlayerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const player = await service.createPlayer();
    expect(player).toBeDefined();
  });
});
