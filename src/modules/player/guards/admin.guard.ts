import { CanActivate, ExecutionContext } from '@nestjs/common';
import { PlayerService } from '../player.service';
import { PlayerRole } from '../model/player.model';

export class AdminGuard implements CanActivate {
  constructor(private playerService: PlayerService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // TODO Won't work for now : Add user and roomId to the request first
    const { playerId, roomId } = context.switchToHttp().getRequest();

    if (!roomId || !playerId) {
      return false;
    }

    const user = await this.playerService.getPlayerById(playerId);

    return user.id === roomId && user.role === PlayerRole.ADMIN;
  }
}
