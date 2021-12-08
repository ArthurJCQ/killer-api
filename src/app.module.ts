import { Module } from '@nestjs/common';
import { KnexModule } from 'nest-knexjs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfig, databaseConfig } from './app.config';
import { PlayerService } from './modules/player/player.service';
import { MissionService } from './modules/mission/mission.service';
import { RoomService } from './modules/room/room.service';
import { RoomModule } from './modules/room/room.module';
import { PlayerModule } from './modules/player/player.module';
import { MissionModule } from './modules/mission/mission.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, databaseConfig],
      isGlobal: true,
    }),
    KnexModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        config: {
          client: 'pg',
          useNullAsDefault: true,
          connection: configService.get<string>('database.pg.url')},
      }),
    }),
    RoomModule,
    PlayerModule,
    MissionModule,
  ],
  controllers: [],
  providers: [PlayerService, MissionService, RoomService],
})
export class AppModule {}
