import { Injectable } from '@nestjs/common';

import { MissionModel } from './mission.model';
import { MissionRepository } from './mission.repository';

@Injectable()
export class MissionService {
  constructor(private missionRepo: MissionRepository) {}

  createMission(content: string, playerId: number): Promise<MissionModel> {
    return this.missionRepo.create(content, playerId);
  }

  getMissions(playerId: number): Promise<MissionModel[]> {
    return this.missionRepo.getMissionsByPlayer(playerId);
  }

  getAllMissionsInRoom(roomCode: string): Promise<MissionModel[]> {
    return this.missionRepo.getAllMissionsInRoom(roomCode);
  }
}
