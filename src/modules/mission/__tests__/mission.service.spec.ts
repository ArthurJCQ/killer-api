import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { DatabaseService } from '../../database/database.service';
import { MissionRepository } from '../mission.repository';
import { MissionService } from '../mission.service';

describe('MissionService', () => {
  let service: MissionService;
  let missionRepo: MissionRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MissionService, MissionRepository],
    })
      .useMocker((token) => {
        if (token === DatabaseService) {
          return {};
        }
      })
      .compile();

    service = module.get<MissionService>(MissionService);
    missionRepo = module.get<MissionRepository>(MissionRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a mission', async () => {
    const expectedMission = {
      id: 1,
      content: 'Mission',
    };

    const createMissionSpy = jest
      .spyOn(missionRepo, 'create')
      .mockReturnValue(Promise.resolve(expectedMission));

    const mission = await service.createMission('Mission', {
      id: 1,
      roomCode: 'CODE1',
    });

    expect(createMissionSpy).toHaveBeenCalledWith('Mission', 'CODE1', 1);
    expect(mission).toBeDefined();
    expect(mission).toEqual(expectedMission);
  });

  it('should get all missions of a specific player', async () => {
    const expectedMissions = [
      {
        id: 1,
        content: 'Mission',
      },
      {
        id: 1,
        content: 'Mission',
      },
    ];

    const missionByPlayerSpy = jest
      .spyOn(missionRepo, 'getMissionsByPlayerId')
      .mockReturnValue(Promise.resolve(expectedMissions));

    const missions = await service.getMissionsByPlayerId(1);

    expect(missionByPlayerSpy).toHaveBeenCalledWith(1);
    expect(missions).toBeDefined();
    expect(missions).toEqual(expectedMissions);
  });

  it('should update a mission', async () => {
    const updatedMission = {
      id: 1,
      content: 'Updated content',
    };

    const checkMissionSpy = jest
      .spyOn(service, 'checkMissionBelongToPlayer')
      .mockImplementation();
    const updateMissionSpy = jest
      .spyOn(missionRepo, 'updateMission')
      .mockReturnValue(Promise.resolve(updatedMission));

    const mission = await service.updateMission(1, 1, 'Updated content');

    expect(checkMissionSpy).toHaveBeenCalledWith(1, 1);
    expect(updateMissionSpy).toHaveBeenCalledWith(1, 'Updated content');
    expect(mission).toEqual(updatedMission);
  });

  it('should not update a mission if not belong to player', async () => {
    const checkMissionSpy = jest
      .spyOn(service, 'checkMissionBelongToPlayer')
      .mockRejectedValue(new NotFoundException());
    const updateMissionSpy = jest.spyOn(missionRepo, 'updateMission');

    await expect(
      service.updateMission(1, 2, 'Updated content'),
    ).rejects.toThrowError(NotFoundException);
    expect(checkMissionSpy).toHaveBeenCalledWith(1, 2);
    expect(updateMissionSpy).not.toHaveBeenCalled();
  });

  it('should delete mission', async () => {
    const checkMissionSpy = jest
      .spyOn(service, 'checkMissionBelongToPlayer')
      .mockImplementation();
    const deleteMissionSpy = jest
      .spyOn(missionRepo, 'deleteMission')
      .mockImplementation();

    await service.deleteMission(1, 1);

    expect(checkMissionSpy).toHaveBeenCalledWith(1, 1);
    expect(deleteMissionSpy).toHaveBeenCalledWith(1);
  });

  it('should not delete a mission if not belong to player', async () => {
    const checkMissionSpy = jest
      .spyOn(service, 'checkMissionBelongToPlayer')
      .mockRejectedValue(new NotFoundException());
    const deleteMissionSpy = jest.spyOn(missionRepo, 'deleteMission');

    await expect(service.deleteMission(2, 1)).rejects.toThrowError(
      NotFoundException,
    );
    expect(checkMissionSpy).toHaveBeenCalledWith(1, 2);
    expect(deleteMissionSpy).not.toHaveBeenCalled();
  });
});
