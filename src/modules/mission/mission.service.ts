import { Injectable, NotFoundException } from '@nestjs/common';

import { PlayerModel } from '../player/player.model';

import { MissionModel } from './mission.model';
import { MissionRepository } from './mission.repository';

@Injectable()
export class MissionService {
  constructor(private missionRepo: MissionRepository) {}

  createMission(
    content: string,
    { id: playerId, roomCode }: Partial<PlayerModel>,
  ): Promise<MissionModel> {
    return this.missionRepo.create(content, roomCode, playerId);
  }

  getMissions(roomCode?: string): Promise<MissionModel[]> {
    return this.missionRepo.getMissions(roomCode);
  }

  getMissionsByPlayer(player: PlayerModel): Promise<MissionModel[]> {
    return this.missionRepo.getMissionsByPlayerId(player);
  }

  countAllMissionsInRoom(player: PlayerModel): Promise<number> {
    return this.missionRepo.countAllMissionsInRoom(player);
  }

  async updateMission(
    missionId: number,
    player: PlayerModel,
    updateMissionContent: string,
  ): Promise<MissionModel> {
    await this.checkMissionBelongToPlayer(missionId, player);

    return this.missionRepo.updateMission(missionId, updateMissionContent);
  }

  async deleteMission(player: PlayerModel, missionId): Promise<void> {
    await this.checkMissionBelongToPlayer(missionId, player);

    return this.missionRepo.deleteMission(missionId);
  }

  async checkMissionBelongToPlayer(
    missionId: number,
    player: PlayerModel,
  ): Promise<void> {
    const playerMissions = await this.getMissionsByPlayer(player);

    const mission = playerMissions.find(
      (playerMission) => playerMission?.id === missionId,
    );

    if (!mission) {
      throw new NotFoundException({ key: 'player.MISSION.NOT_FOUND' });
    }
  }

  async clearPlayerMissions(player: PlayerModel): Promise<void> {
    return this.missionRepo.clearPlayerMissions(player);
  }
}
