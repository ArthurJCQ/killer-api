import { Test, TestingModule } from '@nestjs/testing';

import { MissionRepository } from '../mission.repository';
import { MissionService } from '../mission.service';

import { missionRepositoryMock } from './mocks';

describe('MissionService', () => {
  let service: MissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MissionService,
        {
          provide: MissionRepository,
          useValue: missionRepositoryMock(),
        },
      ],
    }).compile();

    service = module.get<MissionService>(MissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a mission', async () => {
    const mission = await service.createMission('Mission', 1);

    expect(mission).toBeDefined();
    expect(mission.content).toEqual('Mission');
    expect(mission.authorId).toEqual(1);
  });
});
