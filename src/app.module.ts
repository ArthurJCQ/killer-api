import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig, databaseConfig } from './app.config';
import { RoomModule } from './modules/room/room.module';
import { PlayerModule } from './modules/player/player.module';
import { MissionModule } from './modules/mission/mission.module';
import { APP_PIPE } from '@nestjs/core';
import { DatabaseModule } from './modules/database/database.module';

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
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
