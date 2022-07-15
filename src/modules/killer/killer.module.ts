import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { DatabaseModule } from '../database/database.module';

import { MissionController } from './controllers/mission.controller';
import { PlayerController } from './controllers/player.controller';
import { RoomController } from './controllers/room.controller';
import { PlayerRoleGuard } from './guards/player-role.guard';
import { RoomStatusGuard } from './guards/room-status.guard';
import { CurrentPlayerMiddleware } from './middlewares/current-player.middleware';
import { ExtendRoomSessionMiddleware } from './middlewares/extend-room-session.middleware';
import { MissionRepository } from './repositories/mission.repository';
import { PlayerRepository } from './repositories/player.repository';
import { RoomRepository } from './repositories/room.repository';
import { GameStartingService } from './services/game-starting.service';
import { MissionService } from './services/mission.service';
import { PlayerKilledService } from './services/player-killed.service';
import { PlayerLeaveRoomService } from './services/player-leave-room.service';
import { PlayerService } from './services/player.service';
import { RoomService } from './services/room.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    MissionService,
    MissionRepository,
    PlayerService,
    PlayerRepository,
    PlayerKilledService,
    RoomService,
    RoomRepository,
    GameStartingService,
    PlayerLeaveRoomService,
    {
      provide: APP_GUARD,
      useClass: PlayerRoleGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoomStatusGuard,
    },
  ],
  controllers: [MissionController, PlayerController, RoomController],
  exports: [],
})
export class KillerModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(CurrentPlayerMiddleware, ExtendRoomSessionMiddleware)
      .forRoutes('*');
  }
}
