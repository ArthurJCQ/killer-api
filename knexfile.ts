// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

module.exports = {
  client: 'pg',
  version: '13',
  connection: process.env.DATABASE_URL,
  useNullAsDefault: true,
  migrations: {
    tableName: 'knex_migrations',
    directory: './knex/migrations',
  },
};
