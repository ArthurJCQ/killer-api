import { Test, TestingModule } from '@nestjs/testing';
import { PlayerService } from './player.service';
import { PlayerRepository } from './repository/player.repository';
import { DatabaseService } from '../database/database.service';
import { PlayerModel, PlayerRole, PlayerStatus } from './model/player.model';
import { ConfigModule } from '@nestjs/config';

describe('PlayerService', () => {
  let service: PlayerService;

  beforeEach(async () => {
    const players: PlayerModel[] = [];
    const playerRepositoryMock = {
      createPlayer: (name: string, passcode: number) => {
        const player = {
          id: Math.floor(Math.random() * 999999),
          name,
          passcode,
          status: PlayerStatus.ALIVE,
          role: PlayerRole.PLAYER,
          roomId: 1,
        };
        players.push(player);
        return Promise.resolve(player);
      },
      getPlayerByPseudo: (name: string) => {
        const user = players.find((player) => player.name === name);
        return Promise.resolve(user);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        PlayerService,
        {
          provide: PlayerRepository,
          useValue: playerRepositoryMock,
        },
        DatabaseService,
      ],
    }).compile();

    service = module.get<PlayerService>(PlayerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const player = await service.createPlayer();
    expect(player).toBeDefined();
  });
});
