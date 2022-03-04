## Description

Killer Api.

[Nest](https://github.com/nestjs/nest) framework is used in this project.

## Installation

Install global Nest CLI if not already done :

```bash
$ npm install -g @nestjs/cli
```

Then install dependencies :

```bash
$ yarn
```

Then create a local .env file : 

```bash
$ cp .env.dist .env
```

This .env file is git ignored, fill it with your real local secrets.

This project use a PostgreSQL DB and Mercure on a caddy server. If you prefer, you can run them inside containers with

```bash
$ docker-compose up -d
```

Then run knex migrations (install knex CLI before perform these actions) :

```bash
$ knex migrate:latest
```

To load fixtures from seeds files :

```bash
$ knex seed:run
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## About Knex

Knex is a SQL query builder.

You can download is CLI to perform some actions :

```bash
$ npm install knex -g
```

You can create migrations files that you have to fill :
```bash
$ knex migrate:make migration_name
```

Run migrations in database :

```bash
$ knex migrate:latest
```

Create seed file :

```bash
$ knex seed:make seed_name
```

See more on [Knex](https://knexjs.org/)

## Mercure without docker

Start by downloading mercure release archive on [Mercure Github](https://github.com/dunglas/mercure/releases).

Then unzip it in a directory of your choice.

Then you can launch a mercure instance (running in a caddy server) with the follozing command, using the mercure executable you've just extracted :

```bash
$ MERCURE_PUBLISHER_JWT_KEY='killer-mercure-publisher' \
  MERCURE_SUBSCRIBER_JWT_KEY='killer-mercure-subscriber' \
  ./mercure run -config Caddyfile.dev
```
 It automatically runs mercure on port 80. If you get an error such as `forbidden` on this port, just add `SERVER_NAME` as environment variable in your command, and set it to a free port that you are allowed to use :


```bash
$ MERCURE_PUBLISHER_JWT_KEY='killer-mercure-publisher' \
  MERCURE_SUBSCRIBER_JWT_KEY='killer-mercure-subscriber' \
  SERVER_NAME=:2015 \
  ./mercure run -config Caddyfile.dev
```

Now that Mercure is running, you can subscribe to it.

Subscriptions to Mercure are performed with eventSource, and detailed in [this article](https://blog.eleven-labs.com/fr/a-la-decouverte-de-mercure/).

## License

Nest is [MIT licensed](LICENSE).
