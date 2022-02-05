import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { Serialize } from '../../interceptors/serializer.interceptor';
import { PlayerRole } from '../player/constants';
import { Player } from '../player/decorators/player.decorator';
import { Role } from '../player/decorators/role.decorator';
import { PlayerModel } from '../player/player.model';

import { MISSION } from './constants';
import { CreateMissionDto } from './dtos/create-mission.dto';
import { MissionDto } from './dtos/mission.dto';
import { UpdateMissionDto } from './dtos/update-mission.dto';
import { MissionModel } from './mission.model';
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
    return this.missionService.createMission(mission.content, currentPlayer);
  }

  @Get('/player')
  @Role(PlayerRole.PLAYER)
  getMissionsByPlayerId(
    @Player() currentPlayer: PlayerModel,
  ): Promise<MissionModel[]> {
    return this.missionService.getMissionsByPlayerId(currentPlayer.id);
  }

  @Patch('/:id')
  @Role(PlayerRole.PLAYER)
  updateMission(
    @Param('id') id: string,
    @Player() currentPlayer: PlayerModel,
    @Body() updateMission: UpdateMissionDto,
  ): Promise<MissionModel> {
    return this.missionService.updateMission(
      parseInt(id),
      currentPlayer.id,
      updateMission.content,
    );
  }

  @Delete('/:id')
  @Role(PlayerRole.PLAYER)
  @HttpCode(204)
  deleteMission(
    @Param('id') id: string,
    @Player() currentPlayer: PlayerModel,
  ): Promise<void> {
    return this.missionService.deleteMission(currentPlayer.id, parseInt(id));
  }
}
