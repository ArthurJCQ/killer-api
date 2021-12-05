// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const { DB_NAME, DB_HOST, DB_USER, DB_PASSWORD, DB_PORT } = process.env;

module.exports = {
  client: 'pg',
  version: '13',
  connection: {
    database: DB_NAME,
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: parseInt(DB_PORT, 10),
  },
  useNullAsDefault: true,
  migrations: {
    tableName: 'knex_migrations',
    directory: './knex/migrations',
  },
};
