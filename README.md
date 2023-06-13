# LP API
- Arithmetic Calculator API.

## Requirements

- Node v18.16.0
- Npm v9.6.6
- Docker

## Stack
- NestJS
- Typescript
- Jest
- PostgreSQL
- Knex(using just for seeds because TypeORM doesn't support that yet) and TypeORM

## Installation

```bash
$ npm install
```

## Running the app

```bash
# Start Local DB
$ npm run docker:up

# Run Migrations
$ npm run typeorm:run-migrations

# Run Seeds
$ npm run seed:run

# Start Local Server
$ npm run start:dev

# Stop DB
$ npm run docker:down
```

## Test

```bash
# Run Tests
$ npm run test

# Run Test Coverage
$ npm run test:cov
```

## Endpoint

-   POST   /auth - Used to authenticate a User
-   GET    /users/balance - Used to get current User Balance
-   POST   /operations - Used to create a new Operation
-   GET    /records - Used to query Records
-   DELETE /records/:id - Used to soft delete a Record

## TODO
-   Improve Code Coverage
-   Improve Docker Support