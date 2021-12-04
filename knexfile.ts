// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const { DB_NAME, DB_HOST, DB_USER, DB_PASSWORD, DB_PORT } = process.env;

module.exports = {
  development: {
    client: 'pg',
    version: '13',
    connection: {
      database: DB_NAME,
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      port: DB_PORT,
    },
  },
  production: {
    client: 'pg',
    version: '13',
    connection: {
      database: DB_NAME,
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      port: DB_PORT,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
};
