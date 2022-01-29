import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { PlayerKilledEvent } from '../events/player-killed-event';
import { PlayerService } from '../player.service';

@Injectable()
export class PlayerKilledListener {
  constructor(private playerService: PlayerService) {}

  @OnEvent('player.killed')
  async handlePlayerKilled(
    playerKilledEvent: PlayerKilledEvent,
  ): Promise<void> {
    const { id } = await this.playerService.getPlayerByTargetId(
      playerKilledEvent.playerId,
    );

    await this.giveKillerVictimTargetAndMission(
      id,
      playerKilledEvent.targetId,
      playerKilledEvent.missionId,
    );
    await this.cleanTargetAndMissionFromVictim(playerKilledEvent.playerId);
  }

  private giveKillerVictimTargetAndMission(
    killerId: number,
    newTargetId: number,
    newMissionId: number,
  ): void {
    if (newTargetId && newMissionId) {
      this.playerService.updatePlayer(
        { targetId: newTargetId, missionId: newMissionId },
        killerId,
      );
    }
  }

  private cleanTargetAndMissionFromVictim(playerId: number): void {
    this.playerService.updatePlayer(
      { targetId: null, missionId: null },
      playerId,
    );
  }
}
