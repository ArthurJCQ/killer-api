import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

import { MISSION, PLAYER_MISSION } from './constants';
import { MissionModel } from './mission.model';

@Injectable()
export class MissionRepository {
  constructor(private readonly db: DatabaseService) {}

  async create(content: string, playerId: number): Promise<MissionModel> {
    const mission = await this.db
      .client(MISSION)
      .insert<MissionModel[]>({
        content,
      })
      .returning('*');

    await this.db.client(PLAYER_MISSION).insert({
      missionId: mission.at(0).id,
      playerId,
    });

    return mission.at(0);
  }
}
