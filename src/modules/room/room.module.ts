import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { DatabaseModule } from '../database/database.module';
import { MissionModule } from '../mission/mission.module';
import { PlayerModule } from '../player/player.module';

import { RoomStatusGuard } from './guards/room-status.guard';
import { PlayerLeftRoomListener } from './listeners/player-left-room.listener';
import { ExtendRoomSessionMiddleware } from './middlewares/extend-room-session.middleware';
import { RoomController } from './room.controller';
import { RoomRepository } from './room.repository';
import { GameStartingService } from './services/game-starting.service';
import { RoomService } from './services/room.service';

@Module({
  imports: [DatabaseModule, PlayerModule, MissionModule],
  providers: [
    RoomService,
    RoomRepository,
    GameStartingService,
    PlayerLeftRoomListener,
    {
      provide: APP_GUARD,
      useClass: RoomStatusGuard,
    },
  ],
  controllers: [RoomController],
  exports: [RoomService],
})
export class RoomModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(ExtendRoomSessionMiddleware).forRoutes('*');
  }
}
