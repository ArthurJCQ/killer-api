import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';
import { PLAYER } from '../player/constants';

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

  async getMissionsByPlayer(playerId: number): Promise<MissionModel[]> {
    return this.db
      .client<MissionModel>(MISSION)
      .join(PLAYER, `${MISSION}.id`, `${PLAYER}.missionId`)
      .where(`${PLAYER}.id`, playerId)
      .returning(`${MISSION}.*`);
  }

  async getAllMissionsInRoom(roomCode: string): Promise<MissionModel[]> {
    return this.db
      .client<MissionModel>(MISSION)
      .join(PLAYER_MISSION, `${MISSION}.id`, `${PLAYER_MISSION}.missionId`)
      .where(`${PLAYER_MISSION}.roomCode`, roomCode)
      .returning(`${MISSION}.*`);
  }
}
