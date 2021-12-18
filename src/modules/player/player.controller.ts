import { Body, Controller, Post, Session } from '@nestjs/common';

import { Serialize } from '../../interceptors/serializer.interceptor';

import { PLAYER } from './constants';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { PlayerDto } from './dtos/player.dto';
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
    if (!player.roomId) {
      //TODO create a room first, and give the roomId to the following new player
    }

    //TODO ajouter le roomId précédemment créé ou récupérer dans le Body dans le createPlayer()

    const newPlayer = await this.playerService.createPlayer();

    session.playerId = newPlayer.id;

    return newPlayer;
  }
}
