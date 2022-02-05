import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { DatabaseModule } from '../database/database.module';
import { PlayerModule } from '../player/player.module';

import { RoomStatusGuard } from './guards/room-status.guard';
import { RoomController } from './room.controller';
import { RoomRepository } from './room.repository';
import { RoomService } from './room.service';

@Module({
  imports: [DatabaseModule, PlayerModule],
  providers: [
    RoomService,
    RoomRepository,
    {
      provide: APP_GUARD,
      useClass: RoomStatusGuard,
    },
  ],
  controllers: [RoomController],
  exports: [RoomService],
})
export class RoomModule {}
