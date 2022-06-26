import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

import { PlayerKilledEvent } from '../../player/events/player-killed.event';
import { PlayerLeftRoomEvent } from '../../player/events/player-left-room.event';
import { RoomService } from '../room.service';

@Injectable()
export class PlayerLeftRoomListener {
  private readonly logger = new Logger();

  constructor(
    private readonly roomService: RoomService,
    private eventEmitter: EventEmitter2,
  ) {}

  @OnEvent('player.left-room')
  async handlePlayerLeft({ player }: PlayerLeftRoomEvent): Promise<void> {
    const playersInRoom = await this.roomService.getAllPlayersInRoom(
      player.roomCode,
    );

    /** If no player in room or if the only player left is the leaving one, delete room */
    if (
      !playersInRoom.length ||
      (playersInRoom.length === 1 && playersInRoom[0].id === player.id)
    ) {
      this.logger.log(`Deleting room ${player.roomCode} because it's empty`);

      return this.roomService.deleteRoom(player.roomCode);
    }

    // Player leaving room is considered as killed to keep game playable
    if (player.targetId && player.missionId) {
      this.eventEmitter.emit(
        'player.killed',
        new PlayerKilledEvent(
          player.id,
          player.targetId,
          player.missionId,
          player.roomCode,
        ),
      );
    }
  }
}
