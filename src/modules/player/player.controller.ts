import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Put,
  Session,
} from '@nestjs/common';

import { Serialize } from '../../interceptors/serializer.interceptor';

import { PLAYER, PlayerRole } from './constants';
import { Player } from './decorators/player.decorator';
import { Role } from './decorators/role.decorator';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { GetMyPlayerDto } from './dtos/get-my-player.dto';
import { PlayerDto } from './dtos/player.dto';
import { UpdatePlayerDto } from './dtos/update-player.dto';
import { PlayerModel } from './player.model';
import { PlayerService } from './player.service';

@Controller(PLAYER)
@Serialize(PlayerDto)
export class PlayerController {
  constructor(private playerService: PlayerService) {}

  @Post()
  async createPlayer(
    @Body() player: CreatePlayerDto,
    @Session() session,
  ): Promise<PlayerDto> {
    const newPlayer = await this.playerService.createPlayer(player);

    session.playerId = newPlayer.id;

    return newPlayer;
  }

  @Put('/update')
  @Role(PlayerRole.PLAYER)
  async updatePlayer(
    @Body() player: UpdatePlayerDto,
    @Session() session,
  ): Promise<PlayerDto> {
    if (session.playerId !== player.id) {
      throw new ForbiddenException('You can not update data of this user');
    }

    if (!player.name && !player.passcode) {
      throw new BadRequestException('There is no update data');
    }

    return this.playerService.updatePlayer(player);
  }

  @Post('/my-player')
  async getMyPlayer(
    @Body() myPlayer: GetMyPlayerDto,
    @Session() session,
  ): Promise<PlayerDto> {
    const player = await this.playerService.getMyPlayer(myPlayer);

    session.playerId = player.id;

    return player;
  }

  @Get('/me')
  @Role(PlayerRole.PLAYER)
  me(@Player() player: PlayerModel): PlayerDto {
    return player;
  }
}
