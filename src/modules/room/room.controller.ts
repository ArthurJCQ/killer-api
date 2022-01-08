import { Controller, HttpException, HttpStatus, Post } from '@nestjs/common';

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
  async creatRoom(@Player() currentPlayer: PlayerModel): Promise<RoomDto> {
    if (currentPlayer.roomId) {
      throw new HttpException(
        'Player is already in a room',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.roomService.createRoom(currentPlayer.id, currentPlayer.name);
  }
}
