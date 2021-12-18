import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import knex, { Knex } from 'knex';

@Injectable()
export class DatabaseService {
  client: Knex;

  constructor(readonly configService: ConfigService) {
    const isProdEnv = 'production' === configService.get<string>('app.env');

    this.client = knex({
      client: 'pg',
      version: '13',
      connection: isProdEnv
        ? configService.get<string>('database.url')
        : {
            host: configService.get<string>('database.host'),
            user: configService.get<string>('database.user'),
            password: configService.get<string>('database.password'),
            database: configService.get<string>('database.name'),
            port: parseInt(configService.get<string>('database.port'), 10),
          },
    });
  }
}
