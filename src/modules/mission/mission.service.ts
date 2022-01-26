import { Injectable } from '@nestjs/common';

import { MissionModel } from './mission.model';
import { MissionRepository } from './mission.repository';

@Injectable()
export class MissionService {
  constructor(private missionRepo: MissionRepository) {}

  createMission(content: string, roomCode: string): Promise<MissionModel> {
    return this.missionRepo.create(content, roomCode);
  }

  getMissions(roomCode?: string): Promise<MissionModel[]> {
    return this.missionRepo.getMissions(roomCode);
  }
}
