import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';

import { PlayerController } from '../player.controller';
import { PlayerService } from '../player.service';

describe('PlayerController', () => {
  let controller: PlayerController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [PlayerController],
      providers: [
        {
          provide: PlayerService,
          useValue: {},
        },
        EventEmitter2,
      ],
    }).compile();

    controller = module.get(PlayerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
