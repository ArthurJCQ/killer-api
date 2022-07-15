import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { Serialize } from '../../../interceptors/serializer.interceptor';
import { PlayerRole, ROOM } from '../constants';
import { Player } from '../decorators/player.decorator';
import { Role } from '../decorators/role.decorator';
import { PatchRoomPlayerDto } from '../dtos/patch-room-player.dto';
import { PlayerListDto } from '../dtos/player-list.dto';
import { RoomDto } from '../dtos/room.dto';
import { UpdateRoomDto } from '../dtos/update-room.dto';
import { PlayerModel } from '../models/player.model';
import { RoomService } from '../services/room.service';

@Controller(ROOM)
export class RoomController {
  constructor(private roomService: RoomService) {}

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

  @Patch('/:code')
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

    return this.roomService.updateRoom(roomData, code);
  }

  @Get('/:roomCode/players')
  @Serialize(PlayerListDto)
  getAllPlayersInRoom(
    @Param('roomCode') roomCode: string,
  ): Promise<PlayerListDto[]> {
    return this.roomService.getAllPlayersInRoom(roomCode);
  }

  @Patch('/:roomCode/player/:playerId/admin')
  @Serialize(PlayerListDto)
  @Role(PlayerRole.ADMIN)
  async patchRoomPlayerAdmin(
    @Param('roomCode') roomCode: string,
    @Param('playerId') playerId: string,
    @Body() patchRoomPlayer: PatchRoomPlayerDto,
    @Player() currentPlayer: PlayerModel,
  ): Promise<PlayerListDto[]> {
    const parsedPlayerId = parseInt(playerId);

    const adminIsInPlayerRoom = await this.roomService.isPlayerInRoom(
      currentPlayer.roomCode,
      parsedPlayerId,
    );

    /**
     * Check if player to update is in the same room as admin
     * Check if roomCode in URL belongs to admin
     * Check if admin is self updating (forbidden on this route. Use player patch)
     */
    if (
      currentPlayer.roomCode !== roomCode ||
      !adminIsInPlayerRoom ||
      currentPlayer.id === parsedPlayerId
    ) {
      throw new ForbiddenException({ key: 'room.FORBIDDEN' });
    }

    await this.roomService.patchRoomPlayerAdmin(
      patchRoomPlayer,
      parsedPlayerId,
    );

    return this.roomService.getAllPlayersInRoom(roomCode);
  }

  @Delete('/:roomCode')
  @Role(PlayerRole.ADMIN)
  deleteRoom(@Param('roomCode') roomCode: string): Promise<void> {
    return this.roomService.deleteRoom(roomCode);
  }
}
