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
import { EventEmitter2 } from '@nestjs/event-emitter';

import { Serialize } from '../../interceptors/serializer.interceptor';
import { PlayerRole } from '../player/constants';
import { Player } from '../player/decorators/player.decorator';
import { Role } from '../player/decorators/role.decorator';
import { PlayerModel } from '../player/player.model';
import { RoomStatus } from '../room/constants';
import { Status } from '../room/decorators/status.decorator';
import { MercureEvent } from '../sse/models/mercure-event';

import { MISSION } from './constants';
import { CreateMissionDto } from './dtos/create-mission.dto';
import { MissionDto } from './dtos/mission.dto';
import { UpdateMissionDto } from './dtos/update-mission.dto';
import { MissionModel } from './mission.model';
import { MissionService } from './mission.service';

@Controller(MISSION)
@Serialize(MissionDto)
export class MissionController {
  constructor(
    private missionService: MissionService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Post()
  @Role(PlayerRole.PLAYER)
  @Status(RoomStatus.PENDING)
  async createMission(
    @Body() mission: CreateMissionDto,
    @Player() currentPlayer: PlayerModel,
  ): Promise<MissionDto> {
    const newMission = await this.missionService.createMission(
      mission.content,
      currentPlayer,
    );

    this.eventEmitter.emit(
      'push.mercure',
      new MercureEvent(
        `room/${currentPlayer.roomCode}/mission/${newMission.id}`,
        JSON.stringify(newMission.id),
      ),
    );

    return newMission;
  }

  @Get('/player')
  @Role(PlayerRole.PLAYER)
  getMissionsByPlayerId(
    @Player() currentPlayer: PlayerModel,
  ): Promise<MissionModel[]> {
    return this.missionService.getMissionsByPlayer(currentPlayer);
  }

  @Get('/room')
  @Role(PlayerRole.PLAYER)
  countAllMissionsInRoom(
    @Player() currentPlayer: PlayerModel,
  ): Promise<number> {
    return this.missionService.countAllMissionsInRoom(currentPlayer);
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
      currentPlayer,
      updateMission.content,
    );
  }

  @Delete('/:id')
  @Role(PlayerRole.PLAYER)
  @HttpCode(204)
  async deleteMission(
    @Param('id') id: string,
    @Player() currentPlayer: PlayerModel,
  ): Promise<void> {
    await this.missionService.deleteMission(currentPlayer, parseInt(id));

    this.eventEmitter.emit(
      'push.mercure',
      new MercureEvent(
        `room/${currentPlayer.roomCode}/mission/${id}`,
        JSON.stringify(id),
      ),
    );
  }

  @Get()
  @Role(PlayerRole.PLAYER)
  getPlayerMission(
    @Player() currentPlayer: PlayerModel,
  ): Promise<MissionModel> {
    return this.missionService.getPlayerMission(currentPlayer);
  }
}
