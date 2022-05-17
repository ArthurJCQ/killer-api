import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { Serialize } from '../../interceptors/serializer.interceptor';
import { PlayerRole } from '../player/constants';
import { Player } from '../player/decorators/player.decorator';
import { Role } from '../player/decorators/role.decorator';
import { PlayerListDto } from '../player/dtos/player-list.dto';
import { PlayerModel } from '../player/player.model';
import { MercureEvent } from '../sse/models/mercure-event';

import { ROOM } from './constants';
import { RoomDto } from './dtos/room.dto';
import { UpdateRoomDto } from './dtos/update-room.dto';
import { RoomService } from './room.service';

@Controller(ROOM)
export class RoomController {
  constructor(
    private roomService: RoomService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Post()
  @Role(PlayerRole.PLAYER)
  @Serialize(RoomDto)
  async createRoom(@Player() currentPlayer: PlayerModel): Promise<RoomDto> {
    return this.roomService.createRoom(currentPlayer);
  }

  @Get('/:code')
  @Serialize(RoomDto)
  async getRoom(@Param('code') code: string): Promise<RoomDto> {
    return this.roomService.getRoomByCode(code);
  }

  @Put('/:code')
  @Role(PlayerRole.ADMIN)
  @Serialize(RoomDto)
  async updateRoom(
    @Player() currentPlayer: PlayerModel,
    @Param('code') code: string,
    @Body() roomData: UpdateRoomDto,
  ): Promise<RoomDto> {
    if (currentPlayer.roomCode !== code) {
      throw new ForbiddenException({ key: 'room.FORBIDDEN' });
    }

    const room = await this.roomService.updateRoom(roomData, code);

    this.eventEmitter.emit(
      'push.mercure',
      new MercureEvent(`room/${code}`, JSON.stringify(room)),
    );

    return room;
  }

  @Get('/:roomCode/players')
  @Serialize(PlayerListDto)
  getAllPlayersInRoom(
    @Param('roomCode') roomCode: string,
  ): Promise<PlayerListDto[]> {
    return this.roomService.getAllPlayersInRoom(roomCode);
  }

  @Post('/:roomCode/kick/player/:playerId')
  @Serialize(PlayerListDto)
  @Role(PlayerRole.ADMIN)
  kickPlayerFromRoom(
    @Param('roomCode') roomCode: string,
    @Param('playerId') playerId: number,
    @Player() currentPlayer: PlayerModel,
  ): Promise<PlayerListDto[]> {
    if (currentPlayer.roomCode !== roomCode) {
      throw new ForbiddenException({ key: 'room.FORBIDDEN' });
    }

    return this.roomService.kickPlayerFromRoom(roomCode, playerId);
  }
}
