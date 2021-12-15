import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import knex, { Knex } from 'knex';

@Injectable()
export class DatabaseService {
  client: Knex;

  constructor(readonly configService: ConfigService) {
    this.client = knex({
      client: 'pg',
      version: '13',
      connection: configService.get<string>('database.url'),
    });
  }
}
