import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';
import { ROOM, RoomStatus } from '../room/constants';
import { RoomModel } from '../room/room.model';

import { PLAYER } from './constants';
import { GetMyPlayerDto } from './dtos/get-my-player.dto';
import { PlayerModel } from './player.model';

@Injectable()
export class PlayerRepository {
  constructor(readonly db: DatabaseService) {}

  async createPlayer(name: string, roomCode?: string): Promise<PlayerModel> {
    const [player] = await this.db
      .client<PlayerModel>(PLAYER)
      .returning('*')
      .insert<PlayerModel[]>({
        name,
        roomCode,
      });

    return player;
  }

  async updatePlayer(
    { name, passcode, status, missionId }: Partial<PlayerModel>,
    id: number,
  ): Promise<PlayerModel> {
    const [player] = await this.db
      .client<PlayerModel>(PLAYER)
      .where({
        id,
      })
      .update({
        name,
        passcode,
        status,
        missionId,
      })
      .returning('*');

    return player;
  }

  async getPlayer({
    name,
    passcode,
    roomCode,
  }: GetMyPlayerDto): Promise<PlayerModel> {
    const [player] = await this.db
      .client<PlayerModel>(PLAYER)
      .where({
        name,
        passcode,
        roomCode,
      })
      .returning('*');

    return player;
  }

  async getPlayerByNameInRoom(
    roomCode: string,
    name: string,
  ): Promise<PlayerModel> {
    const [player] = await this.db.client<PlayerModel>(PLAYER).where({
      name,
      roomCode,
    });

    return player;
  }

  async getPlayerById(id: number): Promise<PlayerModel> {
    const [player] = await this.db.client<PlayerModel>(PLAYER).where('id', id);

    return player;
  }

  async getNbPlayersByRoomCode(roomCode: string): Promise<number> {
    const [nbPlayers] = await this.db
      .client<PlayerModel>(PLAYER)
      .count()
      .returning('count')
      .where({ roomCode });

    return nbPlayers.count;
  }

  async getPlayerRoomStatus(code: string): Promise<RoomStatus> {
    const [roomStatus] = await this.db
      .client<PlayerModel>(PLAYER)
      .select(`${ROOM}.status`)
      .select(`${ROOM}.status`)
      .join(ROOM, `${PLAYER}.roomCode`, `${ROOM}.code`)
      .where(`${ROOM}.code`, code);

    return roomStatus;
  }

  getAllPlayersInRoom(roomCode: string): Promise<PlayerModel[]> {
    return this.db
      .client<PlayerModel>(PLAYER)
      .where({ roomCode })
      .returning('*');
  }

  setMissionIdToPlayers(
    players: Pick<PlayerModel, 'id' | 'missionId'>[],
  ): Promise<void> {
    try {
      return this.db.client.transaction(async (trx) => {
        for (const key of Object.keys(players)) {
          await trx<PlayerModel>(PLAYER)
            .update({ missionId: players[key].missionId })
            .where('id', players[key].id);
        }
      });
    } catch (error) {
      throw new Error(`Error while dispatching missions : ${error}`);
    }
  }

  setTargetIdToPlayers(
    players: Pick<PlayerModel, 'id' | 'targetId'>[],
  ): Promise<void> {
    try {
      return this.db.client.transaction(async (trx) => {
        for (const key of Object.keys(players)) {
          await trx<PlayerModel>(PLAYER)
            .update({ targetId: players[key].targetId })
            .where('id', players[key].id);
        }
      });
    } catch (error) {
      throw new Error(`Error while dispatching targets : ${error}`);
    }
  }
}
