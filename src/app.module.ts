import * as path from 'path';

import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import cookieSession from 'cookie-session';
import { I18nJsonParser, I18nModule } from 'nestjs-i18n';

import { appConfig, databaseConfig, mercureConfig } from './app.config';
import { HttpExceptionFilter } from './exceptions/http-exception.filter';
import { DatabaseModule } from './modules/database/database.module';
import { MissionModule } from './modules/mission/mission.module';
import { PlayerModule } from './modules/player/player.module';
import { RoomModule } from './modules/room/room.module';
import { SseModule } from './modules/sse/sse.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, databaseConfig, mercureConfig],
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
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      parser: I18nJsonParser,
      parserOptions: {
        path: path.join(__dirname, '..', '/i18n/'),
      },
    }),
    SseModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
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
