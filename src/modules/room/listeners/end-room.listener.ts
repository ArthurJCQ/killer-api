import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { RoomStatus } from '../constants';
import { RoomService } from '../services/room.service';

@Injectable()
export class EndRoomListener {
  private readonly logger = new Logger();

  constructor(private readonly roomService: RoomService) {}

  @OnEvent('room.end')
  async handleEndRoom(roomCode: string): Promise<void> {
    this.logger.log(`Room ${roomCode} is automatically ending`);

    await this.roomService.updateRoom({ status: RoomStatus.ENDED }, roomCode);
  }
}
