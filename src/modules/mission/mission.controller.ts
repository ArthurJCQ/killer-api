import { Body, Controller, Post } from '@nestjs/common';

import { Serialize } from '../../interceptors/serializer.interceptor';
import { PlayerRole } from '../player/constants';
import { Player } from '../player/decorators/player.decorator';
import { Role } from '../player/decorators/role.decorator';
import { PlayerModel } from '../player/player.model';

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
  createMission(
    @Body() mission: CreateMissionDto,
    @Player() currentPlayer: PlayerModel,
  ): Promise<MissionDto> {
    return this.missionService.createMission(
      mission.content,
      currentPlayer.roomCode,
    );
  }
}
