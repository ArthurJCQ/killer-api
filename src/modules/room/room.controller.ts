import { Controller, Get, Param, Post } from '@nestjs/common';

import { Serialize } from '../../interceptors/serializer.interceptor';
import { PlayerRole } from '../player/constants';
import { Player } from '../player/decorators/player.decorator';
import { Role } from '../player/decorators/role.decorator';
import { PlayerModel } from '../player/player.model';

import { ROOM } from './constants';
import { RoomDto } from './dtos/room.dto';
import { RoomService } from './room.service';

@Controller(ROOM)
@Serialize(RoomDto)
export class RoomController {
  constructor(private roomService: RoomService) {}

  @Post()
  @Role(PlayerRole.ADMIN)
  async createRoom(@Player() currentPlayer: PlayerModel): Promise<RoomDto> {
    return this.roomService.createRoom(currentPlayer);
  }

  @Get('/:code')
  async getRoom(@Param('code') code: string): Promise<RoomDto> {
    return this.roomService.getRoomByCode(code);
  }
}
