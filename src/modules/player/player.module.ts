import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { DatabaseModule } from '../database/database.module';
import { MissionModule } from '../mission/mission.module';

import { PlayerRoleGuard } from './guards/player-role.guard';
import { CurrentPlayerMiddleware } from './middlewares/current-player.middleware';
import { PlayerController } from './player.controller';
import { PlayerRepository } from './player.repository';
import { PlayerKilledService } from './services/player-killed.service';
import { PlayerService } from './services/player.service';

@Module({
  imports: [DatabaseModule, MissionModule],
  providers: [
    PlayerService,
    PlayerRepository,
    PlayerKilledService,
    {
      provide: APP_GUARD,
      useClass: PlayerRoleGuard,
    },
  ],
  controllers: [PlayerController],
  exports: [PlayerService, PlayerKilledService],
})
export class PlayerModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CurrentPlayerMiddleware).forRoutes('*');
  }
}
