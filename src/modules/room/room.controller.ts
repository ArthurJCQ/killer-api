import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { Serialize } from '../../interceptors/serializer.interceptor';
import { PlayerRole } from '../player/constants';
import { Player } from '../player/decorators/player.decorator';
import { Role } from '../player/decorators/role.decorator';
import { PlayerListDto } from '../player/dtos/player-list.dto';
import { PlayerModel } from '../player/player.model';

import { ROOM } from './constants';
import { RoomDto } from './dtos/room.dto';
import { UpdateRoomDto } from './dtos/update-room.dto';
import { RoomService } from './room.service';

@Controller(ROOM)
export class RoomController {
  constructor(private roomService: RoomService) {}

  @Post()
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
    @Body() room: UpdateRoomDto,
  ): Promise<RoomDto> {
    if (currentPlayer.roomCode !== code) {
      throw new ForbiddenException('This room is not yours');
    }

    return this.roomService.updateRoom(room, code);
  }

  @Get('/:roomCode/players')
  @Serialize(PlayerListDto)
  getAllPlayersInRoom(
    @Param('roomCode') roomCode: string,
  ): Promise<PlayerListDto[]> {
    return this.roomService.getAllPlayersInRoom(roomCode);
  }
}
