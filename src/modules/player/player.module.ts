import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { DatabaseModule } from '../database/database.module';
import { RoomModule } from '../room/room.module';

import { PlayerRoleGuard } from './guards/player-role-guard.service';
import { CurrentPlayerMiddleware } from './middlewares/current-player.middleware';
import { PlayerController } from './player.controller';
import { PlayerRepository } from './player.repository';
import { PlayerService } from './player.service';

@Module({
  imports: [DatabaseModule, RoomModule],
  providers: [
    PlayerService,
    PlayerRepository,
    {
      provide: APP_GUARD,
      useClass: PlayerRoleGuard,
    },
  ],
  controllers: [PlayerController],
})
export class PlayerModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CurrentPlayerMiddleware).forRoutes('*');
  }
}
