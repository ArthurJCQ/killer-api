import { Test, TestingModule } from '@nestjs/testing';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { PlayerModel } from './model/player.model';

describe('PlayerController', () => {
  let controller: PlayerController;

  beforeEach(async () => {
    const players: PlayerModel[] = [];
    const playerService = {};
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerController],
      providers: [
        {
          provide: PlayerService,
          useValue: playerService,
        },
      ],
    }).compile();

    controller = module.get<PlayerController>(PlayerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
