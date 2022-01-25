import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

import { MISSION, MISSION_ROOM } from './constants';
import { MissionModel } from './mission.model';

@Injectable()
export class MissionRepository {
  constructor(private readonly db: DatabaseService) {}

  async create(content: string, roomCode: string): Promise<MissionModel> {
    try {
      return this.db.client.transaction(async (trx) => {
        const [mission] = await trx(MISSION)
          .insert<MissionModel[]>({
            content,
          })
          .returning('*');

        await trx(MISSION_ROOM).insert({
          missionId: mission.id,
          roomCode,
        });

        return mission;
      });
    } catch (error) {
      throw new Error(`Something went wrong : ${error}. Rollback DB.`);
    }
  }

  async getMissions(roomCode?: string): Promise<MissionModel[]> {
    const query = this.db.client<MissionModel>(MISSION);

    if (roomCode) {
      query
        .select(`${MISSION}.id`)
        .join(MISSION_ROOM, `${MISSION}.id`, `${MISSION_ROOM}.missionId`)
        .where(`${MISSION_ROOM}.roomCode`, roomCode)
        .groupBy(`${MISSION}.id`);
    }

    return query;
  }
}
