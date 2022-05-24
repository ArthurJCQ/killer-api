import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';
import { PLAYER } from '../player/constants';
import { PlayerModel } from '../player/player.model';

import { MISSION, MISSION_ROOM } from './constants';
import { MissionRoomModel } from './mission-room.model';
import { MissionModel } from './mission.model';

@Injectable()
export class MissionRepository {
  constructor(private readonly db: DatabaseService) {}

  async create(
    content: string,
    roomCode: string,
    playerId: number,
  ): Promise<MissionModel> {
    try {
      return this.db.client.transaction(async (trx) => {
        const [mission] = await trx<MissionModel>(MISSION)
          .insert<MissionModel[]>({
            content,
          })
          .returning('*');

        await trx<MissionRoomModel>(MISSION_ROOM).insert({
          missionId: mission.id,
          authorId: playerId,
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

  getMissionsByPlayerId(player: PlayerModel): Promise<MissionModel[]> {
    return this.db
      .client<MissionModel>(MISSION)
      .select(`${MISSION}.id`, `${MISSION}.content`)
      .join(MISSION_ROOM, `${MISSION}.id`, `${MISSION_ROOM}.missionId`)
      .join(PLAYER, `${MISSION_ROOM}.authorId`, `${PLAYER}.id`)
      .where(`${PLAYER}.id`, player.id)
      .andWhere(`${MISSION_ROOM}.roomCode`, player.roomCode);
  }

  async countAllMissionsInRoom(player: PlayerModel): Promise<number> {
    const [nbMissions] = await this.db
      .client<MissionModel>(MISSION)
      .count()
      .join(MISSION_ROOM, `${MISSION}.id`, `${MISSION_ROOM}.missionId`)
      .where(`${MISSION_ROOM}.roomCode`, player.roomCode)
      .returning('count');

    return nbMissions.count;
  }

  async updateMission(
    missionId: number,
    content: string,
  ): Promise<MissionModel> {
    const [mission] = await this.db
      .client<MissionModel>(MISSION)
      .where('id', missionId)
      .update({ content })
      .returning('*');

    return mission;
  }

  deleteMission(id): Promise<void> {
    return this.db.client.transaction(async (trx) => {
      await trx<MissionRoomModel>(MISSION_ROOM)
        .where({
          missionId: id,
        })
        .del();

      await trx<MissionModel>(MISSION).where({ id }).del();
    });
  }

  clearPlayerMissions(player: PlayerModel): Promise<void> {
    return this.db.client.transaction(async (trx) => {
      await trx<MissionModel>(MISSION)
        .join(MISSION_ROOM, `${MISSION}.id`, `${MISSION_ROOM}.missionId`)
        .join(PLAYER, `${MISSION_ROOM}.authorId`, `${PLAYER}.id`)
        .where(`${PLAYER}.id`, player.id)
        .andWhere(`${MISSION_ROOM}.roomCode`, player.roomCode)
        .del();

      await trx<MissionRoomModel>(MISSION_ROOM)
        .join(PLAYER, `${MISSION_ROOM}.authorId`, `${PLAYER}.id`)
        .where(`${PLAYER}.id`, player.id)
        .andWhere(`${MISSION_ROOM}.roomCode`, player.roomCode)
        .del();
    });
  }
}
