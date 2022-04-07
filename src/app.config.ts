import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  env: process.env.NODE_ENV,
  host: process.env.PORT
    ? `${process.env.HOST}:${process.env.PORT}`
    : process.env.HOST,
  port: process.env.PORT,
  cookieSessionKey: process.env.COOKIE_SESSION_KEY,
}));

export const databaseConfig = registerAs('database', () => ({
  url: process.env.DATABASE_URL,
  name: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST,
  password: process.env.DATABASE_PASSWORD,
  user: process.env.DATABASE_USER,
  port: process.env.DATABASE_PORT,
}));

export const mercureConfig = registerAs('mercure', () => ({
  host: process.env.MERCURE_HOST,
  publisherToken: process.env.MERCURE_PUBLISHER_JWT,
  subscriberToken: process.env.MERCURE_SUBSCRIBER_JWT,
}));
