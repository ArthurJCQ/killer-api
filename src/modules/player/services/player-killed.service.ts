import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';

import { MercureEventType } from '../../sse/models/mercure-event-types';
import { PlayerModel } from '../player.model';

import { PlayerService } from './player.service';

@Injectable()
export class PlayerKilledService {
  private readonly logger = new Logger();

  constructor(
    @Inject(forwardRef(() => PlayerService))
    private readonly playerService: PlayerService,
  ) {}

  async handlePlayerKilled(player: PlayerModel): Promise<void> {
    const { id } = await this.playerService.getPlayerByTargetId(player.id);

    await this.giveKillerVictimTargetAndMission(
      id,
      player.targetId,
      player.missionId,
    );
    await this.cleanTargetAndMissionFromVictim(player.id);

    await this.playerService.checkPlayersToEndRoom(player.roomCode);

    this.logger.log(
      `Player ${player.id} killed, mission and target dispatched`,
    );
  }

  private async giveKillerVictimTargetAndMission(
    killerId: number,
    targetId: number,
    missionId: number,
  ): Promise<void> {
    await this.playerService.updatePlayer(
      { targetId, missionId },
      killerId,
      MercureEventType.NO_EVENT,
    );
  }

  private async cleanTargetAndMissionFromVictim(
    playerId: number,
  ): Promise<void> {
    await this.playerService.updatePlayer(
      { targetId: null, missionId: null },
      playerId,
      MercureEventType.NO_EVENT,
    );
  }
}
