import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { DatabaseService } from '../../database/database.service';
import { PlayerRole, PlayerStatus } from '../../player/constants';
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
      .mockResolvedValue(expectedMission);

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

    const player = {
      id: 1,
      name: 'Arty',
      roomCode: 'CODE1',
      status: PlayerStatus.ALIVE,
      role: PlayerRole.PLAYER,
    };

    const missionByPlayerSpy = jest
      .spyOn(missionRepo, 'getMissionsByPlayerId')
      .mockResolvedValue(expectedMissions);

    const missions = await service.getMissionsByPlayer(player);

    expect(missionByPlayerSpy).toHaveBeenCalledWith(player);
    expect(missions).toBeDefined();
    expect(missions).toEqual(expectedMissions);
  });

  it('should get all missions of a room', async () => {
    const player = {
      id: 1,
      name: 'Arty',
      roomCode: 'CODE1',
      status: PlayerStatus.ALIVE,
      role: PlayerRole.PLAYER,
    };

    const countAllMissionsInRoom = jest
      .spyOn(missionRepo, 'countAllMissionsInRoom')
      .mockResolvedValue(2);

    const count = await service.countAllMissionsInRoom(player);

    expect(countAllMissionsInRoom).toHaveBeenCalledWith(player);
    expect(count).toEqual(2);
  });

  it('should update a mission', async () => {
    const updatedMission = {
      id: 1,
      content: 'Updated content',
    };

    const player = {
      id: 1,
      name: 'Arty',
      roomCode: 'CODE1',
      status: PlayerStatus.ALIVE,
      role: PlayerRole.PLAYER,
    };

    const checkMissionSpy = jest
      .spyOn(service, 'checkMissionBelongToPlayer')
      .mockImplementation();
    const updateMissionSpy = jest
      .spyOn(missionRepo, 'updateMission')
      .mockResolvedValue(updatedMission);

    const mission = await service.updateMission(1, player, 'Updated content');

    expect(checkMissionSpy).toHaveBeenCalledWith(1, player);
    expect(updateMissionSpy).toHaveBeenCalledWith(1, 'Updated content');
    expect(mission).toEqual(updatedMission);
  });

  it('should not update a mission if not belong to player', async () => {
    const player = {
      id: 2,
      name: 'Arty',
      roomCode: 'CODE1',
      status: PlayerStatus.ALIVE,
      role: PlayerRole.PLAYER,
    };

    const checkMissionSpy = jest
      .spyOn(service, 'checkMissionBelongToPlayer')
      .mockRejectedValue(new NotFoundException());
    const updateMissionSpy = jest.spyOn(missionRepo, 'updateMission');

    await expect(
      service.updateMission(1, player, 'Updated content'),
    ).rejects.toThrowError(NotFoundException);
    expect(checkMissionSpy).toHaveBeenCalledWith(1, player);
    expect(updateMissionSpy).not.toHaveBeenCalled();
  });

  it('should delete mission', async () => {
    const player = {
      id: 1,
      name: 'Arty',
      roomCode: 'CODE1',
      status: PlayerStatus.ALIVE,
      role: PlayerRole.PLAYER,
    };

    const checkMissionSpy = jest
      .spyOn(service, 'checkMissionBelongToPlayer')
      .mockImplementation();
    const deleteMissionSpy = jest
      .spyOn(missionRepo, 'deleteMission')
      .mockImplementation();

    await service.deleteMission(player, 1);

    expect(checkMissionSpy).toHaveBeenCalledWith(1, player);
    expect(deleteMissionSpy).toHaveBeenCalledWith(1);
  });

  it('should not delete a mission if not belong to player', async () => {
    const player = {
      id: 1,
      name: 'Arty',
      roomCode: 'CODE1',
      status: PlayerStatus.ALIVE,
      role: PlayerRole.PLAYER,
    };

    const checkMissionSpy = jest
      .spyOn(service, 'checkMissionBelongToPlayer')
      .mockRejectedValue(new NotFoundException());
    const deleteMissionSpy = jest.spyOn(missionRepo, 'deleteMission');

    await expect(service.deleteMission(player, 1)).rejects.toThrowError(
      NotFoundException,
    );
    expect(checkMissionSpy).toHaveBeenCalledWith(1, player);
    expect(deleteMissionSpy).not.toHaveBeenCalled();
  });
});
