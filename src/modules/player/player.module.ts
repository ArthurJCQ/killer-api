import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { PlayerRepository } from './player.repository';
import { DatabaseModule } from '../database/database.module';
import { CurrentPlayerMiddleware } from './middlewares/current-player.middleware';

@Module({
  imports: [DatabaseModule],
  providers: [PlayerService, PlayerRepository],
  controllers: [PlayerController],
})
export class PlayerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentPlayerMiddleware).forRoutes('*');
  }
}
