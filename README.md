## Description

Killer Api.

[Nest](https://github.com/nestjs/nest) framework is used in this project.

## Installation

```bash
$ yarn
```

Then create a local .env file : 

```bash
$ cp .env.dist .env
```

This .env file is git ignored, fill it with your real local secrets.

This project use a PostgreSQL DB. If you prefer, you can run it inside a container with

```bash
$ docker-compose up -d
```

Then run knex migrations (install knex CLI before perform these actions) :

```bash
$ knex migrate:latest
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

See more on [https://knexjs.org/](Knex)

## License

Nest is [MIT licensed](LICENSE).
