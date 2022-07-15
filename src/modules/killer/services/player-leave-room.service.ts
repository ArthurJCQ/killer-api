import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';

import { PlayerModel } from '../models/player.model';

import { PlayerKilledService } from './player-killed.service';
import { RoomService } from './room.service';

@Injectable()
export class PlayerLeaveRoomService {
  private readonly logger = new Logger();

  constructor(
    @Inject(forwardRef(() => RoomService))
    private readonly roomService: RoomService,
    private readonly playerKilledService: PlayerKilledService,
  ) {}

  async handlePlayerLeft(player: PlayerModel): Promise<void> {
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

    /** Player leaving room is considered as killed to keep game playable */
    if (player.targetId && player.missionId) {
      await this.playerKilledService.handlePlayerKilled(player);
    }
  }
}
