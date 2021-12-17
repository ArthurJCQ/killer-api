import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { PlayerService } from './player.service';
import { PlayerDto } from './dtos/player.dto';
import { AdminGuard } from './guards/admin.guard';
import { Serialize } from '../../interceptors/serializer.interceptor';
import { PLAYER } from '../../../knex/constants';

@Controller(PLAYER)
@Serialize(PlayerDto)
export class PlayerController {
  constructor(private playerService: PlayerService) {}

  @Post()
  async createPlayer(@Body() player: CreatePlayerDto): Promise<PlayerDto> {
    if (!player.roomId) {
      //TODO create a room first, and give the roomId to the following new player
    }

    //TODO ajouter le roomId précédemment créé ou récupérer dans le Body dans le createPlayer()
    return this.playerService.createPlayer();
  }

  @Post()
  @UseGuards(AdminGuard)
  somePrivateFunction() {
    return 'this route is reserved for room admins';
  }
}
