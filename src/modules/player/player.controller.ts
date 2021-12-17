import { Body, Controller, Post } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { PlayerService } from './player.service';
import { PlayerDto } from './dtos/player.dto';
import { Serialize } from '../../interceptors/serializer.interceptor';
import { PLAYER } from '../../../knex/constants';

@Controller(PLAYER)
@Serialize(PlayerDto)
export class PlayerController {
  constructor(private playerService: PlayerService) {}

  @Post()
  async createPlayer(@Body() player: CreatePlayerDto): Promise<PlayerDto> {
    const newPlayer = await this.playerService.createPlayer();

    if (!player.roomId) {
      //TODO create a room with newPlayer.id as room.ownerId
    }

    return newPlayer;
  }
}
