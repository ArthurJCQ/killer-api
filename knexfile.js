// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
var _a = process.env, DATABASE_URL = _a.DATABASE_URL, DATABASE_NAME = _a.DATABASE_NAME, DATABASE_USER = _a.DATABASE_USER, DATABASE_PASSWORD = _a.DATABASE_PASSWORD, DATABASE_HOST = _a.DATABASE_HOST, DATABASE_PORT = _a.DATABASE_PORT;
module.exports = {
    development: {
        client: 'pg',
        version: '13',
        connection: {
            host: DATABASE_HOST,
            user: DATABASE_USER,
            password: DATABASE_PASSWORD,
            database: DATABASE_NAME,
            port: parseInt(DATABASE_PORT, 10)
        },
        useNullAsDefault: true,
        migrations: {
            tableName: 'knex_migrations',
            directory: './knex/migrations'
        }
    },
    production: {
        client: 'pg',
        version: '13',
        connection: DATABASE_URL
    }
};
