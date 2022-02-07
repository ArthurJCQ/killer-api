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

  getMissionsByPlayerId(playerId: number): Promise<MissionModel[]> {
    return this.missionRepo.getMissionsByPlayerId(playerId);
  }

  async updateMission(
    missionId: number,
    playerId: number,
    updateMissionContent: string,
  ): Promise<MissionModel> {
    await this.checkMissionBelongToPlayer(missionId, playerId);

    return this.missionRepo.updateMission(missionId, updateMissionContent);
  }

  async deleteMission(playerId: number, missionId): Promise<void> {
    await this.checkMissionBelongToPlayer(missionId, playerId);

    return this.missionRepo.deleteMission(missionId);
  }

  private async checkMissionBelongToPlayer(
    missionId: number,
    playerId: number,
  ): Promise<void> {
    const playerMissions = await this.getMissionsByPlayerId(playerId);

    const mission = playerMissions.find(
      (playerMission) => playerMission?.id === missionId,
    );

    if (!mission) {
      throw new NotFoundException(
        'No mission with this id has been found for this player',
      );
    }
  }
}
