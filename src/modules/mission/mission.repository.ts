import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

import { MISSION } from './constants';
import { MissionModel } from './mission.model';

@Injectable()
export class MissionRepository {
  constructor(private readonly db: DatabaseService) {}

  async create(content: string): Promise<MissionModel> {
    const mission = await this.db
      .client(MISSION)
      .insert<MissionModel[]>({
        content,
      })
      .returning('*');

    return mission.at(0);
  }
}
