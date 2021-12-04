import { Module } from '@nestjs/common';
import { KnexModule } from 'nest-knexjs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfig, databaseConfig } from './app.config';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
