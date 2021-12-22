import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { RoomModule } from '../room/room.module';

import { CurrentPlayerMiddleware } from './middlewares/current-player.middleware';
import { PlayerController } from './player.controller';
import { PlayerRepository } from './player.repository';
import { PlayerService } from './player.service';

@Module({
  imports: [DatabaseModule, RoomModule],
  providers: [PlayerService, PlayerRepository],
  controllers: [PlayerController],
})
export class PlayerModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CurrentPlayerMiddleware).forRoutes('*');
  }
}
