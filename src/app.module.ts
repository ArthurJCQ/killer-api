import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import cookieSession from 'cookie-session';

import { appConfig, databaseConfig } from './app.config';
import { DatabaseModule } from './modules/database/database.module';
import { MissionModule } from './modules/mission/mission.module';
import { PlayerModule } from './modules/player/player.module';
import { RoomModule } from './modules/room/room.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, databaseConfig],
      isGlobal: true,
    }),
    RoomModule,
    PlayerModule,
    MissionModule,
    DatabaseModule,
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
    }),
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule implements NestModule {
  constructor(readonly configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(
        cookieSession({
          keys: [this.configService.get<string>('app.cookieSessionKey')],
        }),
      )
      .forRoutes('*');
  }
}
