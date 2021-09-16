<p align="center">
  <a href="https://bossabox.com/" target="blank"><img src="https://bossabox.com/img/logo__bossabox_full.svg" width="320" alt="Nest Logo" /></a>
</p>

# [Bossabox Networking](https://bossabox.com/)

### Prerequisites

- [Docker](https://www.docker.com/)
- [Node](https://nodejs.org/en/)
- [NPM](https://www.npmjs.com/)

Also, you're gonna need to run the following command:

```bash
npm install -g typescript serverless @nestjs/cli
```

### Serverless Run

```bash
$ sls offline start
```

### Docker Compose Run

```bash
$ docker-compose up
```

### Local Run

```bash
# first of all
$ npm install

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

### Migrations

```bash
# run migrations
$ npm run migration:run

# create migration
$ npm run migration:create
```

### Swagger

- To access the routes documentation, enter the address: http://localhost:3000/doc/
