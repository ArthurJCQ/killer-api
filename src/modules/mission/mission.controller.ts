import { Body, Controller, Post, Session } from '@nestjs/common';

import { Serialize } from '../../interceptors/serializer.interceptor';
import { PlayerRole } from '../player/constants';
import { Role } from '../player/decorators/role.decorator';

import { MISSION } from './constants';
import { CreateMissionDto } from './dtos/create-mission.dto';
import { MissionDto } from './dtos/mission.dto';
import { MissionService } from './mission.service';

@Controller(MISSION)
@Serialize(MissionDto)
export class MissionController {
  constructor(private missionService: MissionService) {}

  @Post()
  @Role(PlayerRole.PLAYER)
  async createMission(
    @Body() mission: CreateMissionDto,
    @Session() session,
  ): Promise<MissionDto> {
    return this.missionService.createMission(mission.content, session.playerId);
  }
}
