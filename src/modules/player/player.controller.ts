import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Post,
  Put,
  Res,
  Session,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Response } from 'express';

import { Serialize } from '../../interceptors/serializer.interceptor';
import { MercureEvent } from '../sse/models/mercure-event';

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
  private readonly logger = new Logger();

  constructor(
    private playerService: PlayerService,
    private eventEmitter: EventEmitter2,
    private configService: ConfigService,
  ) {}

  @Post()
  async createPlayer(
    @Body() player: CreatePlayerDto,
    @Session() session,
  ): Promise<PlayerDto> {
    const newPlayer = await this.playerService.createPlayer(player);

    this.eventEmitter.emit(
      'push.mercure',
      new MercureEvent(`room/${newPlayer.roomCode}`, JSON.stringify(newPlayer)),
    );

    session.playerId = newPlayer.id;

    return newPlayer;
  }

  @Put()
  @Role(PlayerRole.PLAYER)
  async updatePlayer(
    @Body() player: UpdatePlayerDto,
    @Session() session,
  ): Promise<PlayerDto> {
    return this.playerService.updatePlayer(player, session.playerId);
  }

  @Post('/login')
  async login(
    @Body() myPlayer: GetMyPlayerDto,
    @Session() session,
  ): Promise<PlayerDto> {
    const player = await this.playerService.login(myPlayer);

    session.playerId = player.id;

    return player;
  }

  @Get('/me')
  @Role(PlayerRole.PLAYER)
  me(
    @Player() player: PlayerModel,
    @Res({ passthrough: true }) response: Response,
  ): PlayerDto {
    this.logger.debug(
      `cookieDomain : ${this.configService.get('app.cookieDomain')}`,
    );

    response.cookie(
      'mercureAuthorization',
      this.configService.get('mercure.subscriberToken'),
      { domain: this.configService.get('app.cookieDomain') },
    );

    return player;
  }

  @Delete()
  @HttpCode(204)
  @Role(PlayerRole.PLAYER)
  async quitRoom(@Session() session): Promise<void> {
    session.playerId = null;

    await this.playerService.deletePlayer(session.playerId);
  }
}
