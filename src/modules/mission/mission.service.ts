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
    const canDeleteMission = await this.isMissionBelongToPlayer(
      missionId,
      player,
    );

    if (!canDeleteMission) {
      throw new NotFoundException({ key: 'player.MISSION.NOT_FOUND' });
    }

    return this.missionRepo.updateMission(missionId, updateMissionContent);
  }

  async deleteMission(player: PlayerModel, missionId): Promise<void> {
    const canDeleteMission = await this.isMissionBelongToPlayer(
      missionId,
      player,
    );

    if (!canDeleteMission) {
      throw new NotFoundException({ key: 'player.MISSION.NOT_FOUND' });
    }

    return this.missionRepo.deleteMission(missionId);
  }

  async isMissionBelongToPlayer(
    missionId: number,
    player: PlayerModel,
  ): Promise<boolean> {
    const playerMissions = await this.getMissionsByPlayer(player);

    return !!playerMissions.find(
      (playerMission) => playerMission?.id === missionId,
    );
  }

  async clearPlayerMissions(player: PlayerModel): Promise<void> {
    return this.missionRepo.clearPlayerMissions(player);
  }

  async getPlayerMission(player: PlayerModel): Promise<MissionModel> {
    const mission = this.missionRepo.getPlayerMission(player);

    if (!mission) {
      throw new NotFoundException({ key: 'mission.NOT_FOUND' });
    }

    return mission;
  }
}
