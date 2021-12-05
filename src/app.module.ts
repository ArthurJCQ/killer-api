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
          connection: {
            database: configService.get<string>('database.pg.database'),
            user: configService.get<string>('database.pg.user'),
            password: configService.get<string>('database.pg.password'),
            host: configService.get<string>('database.pg.host'),
            port: configService.get<string>('database.pg.port'),
          },
        },
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
