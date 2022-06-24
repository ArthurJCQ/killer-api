import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

import { MercureEvent } from '../../sse/models/mercure-event';
import { MercureEventType } from '../../sse/models/mercure-event-types';
import { PlayerKilledEvent } from '../events/player-killed.event';
import { PlayerService } from '../player.service';

@Injectable()
export class PlayerKilledListener {
  constructor(
    private playerService: PlayerService,
    private eventEmitter: EventEmitter2,
  ) {}

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

    this.eventEmitter.emit(
      'push.mercure',
      new MercureEvent(
        `room/${playerKilledEvent.roomCode}`,
        null,
        MercureEventType.PLAYER_KILLED,
      ),
    );
  }

  private giveKillerVictimTargetAndMission(
    killerId: number,
    targetId: number,
    missionId: number,
  ): void {
    this.playerService.updatePlayer({ targetId, missionId }, killerId);
  }

  private cleanTargetAndMissionFromVictim(playerId: number): void {
    this.playerService.updatePlayer(
      { targetId: null, missionId: null },
      playerId,
    );
  }
}
