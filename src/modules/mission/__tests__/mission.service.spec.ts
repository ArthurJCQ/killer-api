import { NotFoundException } from '@nestjs/common';
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
    const mission = await service.createMission('Mission', {
      id: 1,
      roomCode: 'CODE1',
    });

    expect(mission).toBeDefined();
    expect(mission.content).toEqual('Mission');
  });

  it('should get all missions of a specific player', async () => {
    const missions = await service.getMissionsByPlayerId(1);

    expect(missions).toBeDefined();
    expect(missions).toHaveLength(2);
  });

  it('should update a mission', async () => {
    const mission = await service.updateMission(1, 1, 'Updated content');

    expect(mission).toBeDefined();
    expect(mission.content).toEqual('Updated content');
  });

  it('should not update a mission if not belong to player', async () => {
    await expect(
      service.updateMission(1, 2, 'Updated content'),
    ).rejects.toThrowError(NotFoundException);
  });

  it('should delete mission', async () => {
    await service.deleteMission(1, 1);

    const missions = await service.getMissionsByPlayerId(1);
    const deletedMission = await missions.find((mission) => mission?.id === 1);

    expect(deletedMission).toBeUndefined();
  });

  it('should not delete a mission if not belong to player', async () => {
    await expect(service.deleteMission(2, 1)).rejects.toThrowError(
      NotFoundException,
    );
  });
});
