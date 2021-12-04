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
      useFactory: (configService: ConfigService) => {
        const sqliteConnection = {
          filename: configService.get<string>('database.sqlite.filename'),
        };
        const pgConnection = {
          database: configService.get<string>('database.pg.database'),
          user: configService.get<string>('database.pg.user'),
          password: configService.get<string>('database.pg.password'),
          host: configService.get<string>('database.pg.host'),
          port: configService.get<string>('database.pg.port'),
        };

        return {
          config: {
            client: configService.get<string>('database.client'),
            useNullAsDefault: true,
            connection:
              configService.get<string>('client') === 'sqlite3'
                ? sqliteConnection
                : pgConnection,
          },
        };
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
