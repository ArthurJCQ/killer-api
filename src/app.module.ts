import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfig, databaseConfig } from './app.config';
import { RoomModule } from './modules/room/room.module';
import { PlayerModule } from './modules/player/player.module';
import { MissionModule } from './modules/mission/mission.module';
import { APP_PIPE } from '@nestjs/core';
import { DatabaseModule } from './modules/database/database.module';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session');

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

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: [this.configService.get<string>('app.cookieSessionKey')],
        }),
      )
      .forRoutes('*');
  }
}
