import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { PlayerLeftRoomEvent } from '../../player/events/player-left-room.event';
import { RoomService } from '../room.service';

@Injectable()
export class PlayerLeftRoomListener {
  constructor(private readonly roomService: RoomService) {}

  @OnEvent('player.left-room')
  async handlePlayerLeft({ player }: PlayerLeftRoomEvent): Promise<void> {
    const playersInRoom = await this.roomService.getAllPlayersInRoom(
      player.roomCode,
    );

    /** If no player in room or if the only player left is the leaving one, delete room */
    if (
      playersInRoom.length === 0 ||
      (playersInRoom.length === 1 && playersInRoom[0].id === player.id)
    ) {
      // Create endpoint
      // this.roomService.deleteRoom(player.roomCode);
    }
  }
}
