import { Body, Controller, Post, Session, UseGuards } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { PlayerService } from './player.service';
import { PlayerDto } from './dtos/player.dto';
import { AdminGuard } from './guards/admin.guard';
import { Serialize } from '../../interceptors/serializer.interceptor';
import { PLAYER } from './constants';
import { Player } from './decorators/player.decorator';
import { PlayerModel } from './player.model';

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

  @Post('test-private')
  @UseGuards(AdminGuard)
  somePrivateFunction(@Player() player: PlayerModel) {
    console.log(player);
    return 'this route is reserved for room admins';
  }
}
