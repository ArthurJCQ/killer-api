import { config } from 'dotenv';

config();

const {
  DATABASE_URL,
  DATABASE_NAME,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_HOST,
  DATABASE_PORT,
} = process.env;

module.exports = {
  development: {
    client: 'pg',
    version: '13',
    connection: {
      host: DATABASE_HOST,
      user: DATABASE_USER,
      password: DATABASE_PASSWORD,
      database: DATABASE_NAME,
      port: parseInt(DATABASE_PORT, 10),
    },
    useNullAsDefault: true,
    migrations: {
      tableName: 'knex_migrations',
      directory: './knex/migrations',
    },
    seeds: {
      directory: './knex/seeds',
    },
  },
  production: {
    client: 'pg',
    version: '13',
    connection: DATABASE_URL,
    useNullAsDefault: true,
    migrations: {
      tableName: 'knex_migrations',
      directory: './knex/migrations',
    },
  },
};
