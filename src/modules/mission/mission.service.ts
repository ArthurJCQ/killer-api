import { Injectable } from '@nestjs/common';

import { MissionModel } from './mission.model';
import { MissionRepository } from './mission.repository';

@Injectable()
export class MissionService {
  constructor(private missionRepo: MissionRepository) {}

  async createMission(
    content: string,
    playerId: number,
  ): Promise<MissionModel> {
    return this.missionRepo.create(content, playerId);
  }
}
