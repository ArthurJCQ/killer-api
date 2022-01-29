import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { DatabaseModule } from '../database/database.module';
import { MissionModule } from '../mission/mission.module';

import { PlayerRoleGuard } from './guards/player-role-guard.service';
import { GameStartingListener } from './listeners/game-starting.listener';
import { PlayerKilledListener } from './listeners/player-killed.listener';
import { CurrentPlayerMiddleware } from './middlewares/current-player.middleware';
import { PlayerController } from './player.controller';
import { PlayerRepository } from './player.repository';
import { PlayerService } from './player.service';

@Module({
  imports: [DatabaseModule, MissionModule],
  providers: [
    PlayerService,
    PlayerRepository,
    {
      provide: APP_GUARD,
      useClass: PlayerRoleGuard,
    },
    PlayerKilledListener,
    GameStartingListener,
  ],
  controllers: [PlayerController],
  exports: [PlayerService],
})
export class PlayerModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CurrentPlayerMiddleware).forRoutes('*');
  }
}
