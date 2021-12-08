import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  env: process.env.NODE_ENV,
}));

export const databaseConfig = registerAs('database', () => ({
  url: process.env.DATABASE_URL,
}));
