import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

import { MISSION, PLAYER_MISSION } from './constants';
import { MissionModel } from './mission.model';

@Injectable()
export class MissionRepository {
  constructor(private readonly db: DatabaseService) {}

  async create(content: string, playerId: number): Promise<MissionModel> {
    try {
      return this.db.client.transaction(async (trx) => {
        const [mission] = await trx(MISSION)
          .insert<MissionModel[]>({
            content,
          })
          .returning('*');

        await trx(PLAYER_MISSION).insert({
          missionId: mission.id,
          playerId,
        });

        return mission;
      });
    } catch (error) {
      throw new Error(`Something went wrong : ${error}. Rollback DB.`);
    }
  }
}
