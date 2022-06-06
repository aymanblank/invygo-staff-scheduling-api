# invygo-staff-scheduling-api
Staff Scheduling application

## 😎 Introducing The Project
A TypeScript express node server that serves as a staff scheduking API

## 🤔 Prerequisite
- Docker
- MySQL Database (or you can just use docker instead --explained-later)
- NPM
- YARN

## 🚀 Quick Start

## Dev Mode
#### 1) Install the node dependances

```bash
$ yarn install
```
#### 2) Run MySQL database

Simply, run the MYSQL in docker using the following command:
```bash
$ docker run -p 3306:3306 --name mysql --platform linux/x86_64 -e "MYSQL_ROOT_PASSWORD=password" -e "MYSQL_DATABASE=invygo" mysql:5.7
```
OR if you want to connect to your own MySQL DB:

Make sure to update the environment variables in the `.env.development.local` file so it points to the correct database `DB_HOST:DB_PORT`

And also update the following to match your setup `DB_USER = root`, `DB_PASSWORD = password`

Make sure to create an empty database called `invygo`.

#### 3) Run Migration script
```bash
$ yarn localDBmigration
```

Now your database is ready to go

#### 4) Run The API
```bash
$ yarn dev
```

## Prod Mode

#### Run within a dockerized container

Run the following command to run the dockerized container
```bash
$ docker-compose up -d
```

## 🌐 The API :: Postman

After you run the api in DEV/PROD mode the server will start listening at `http://localhost:3000`

You can find all the details for the api in the `postman` folder

- Run Postamn
- import `Invygo.postman_collection.json` into your Postman.
- import `Invygo Env.postman_environment.json` into your Postman.
- Enjoy


## 📗 Swagger :: API Document

Start your app in development mode and navigate to `http://localhost:3000/api-docs`


## 🗂 Code Structure

```bash
│
├── /.vscode
│   └── settings.json
│
├── /src
│   ├── /api
│   │   ├── /controllers
│   │   │   ├── auth.controller.ts
│   │   │   ├── index.controller.ts
│   │   │   ├── index.ts
│   │   │   ├── user.controller.ts
│   │   │   └── schedule.controller.ts
│   │   │
│   │   │── /dtos
│   │   │   ├── user.dto.ts
│   │   │   ├── schedule.dto.ts
│   │   │   └── index.ts
│   │   │
│   │   │── /exceptions
│   │   │   ├── index.ts
│   │   │   └── HttpException.ts
│   │   │
│   │   │── /middlewares
│   │   │   ├── access.middleware.ts
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   ├── index.ts
│   │   │   └── validation.middleware.ts
│   │   │
│   │   │── /routes
│   │   │   ├── auth.route.ts
│   │   │   ├── index.route.ts
│   │   │   ├── index.ts
│   │   │   ├── schedule.route.ts
│   │   │   └── user.route.ts
│   │   │
│   │   │── /services
│   │   │   ├── auth.service.ts
│   │   │   ├── index.ts
│   │   │   ├── schedule.service.ts
│   │   │   └── user.service.ts
│   │
│   ├── /data
│   │   ├── /databases
│   │   │   ├── mysql.ts
│   │   │   └── indexts
│   │   │
│   │   ├── /entities
│   │   │   ├── permission.entity.ts
│   │   │   ├── role.entity.ts
│   │   │   ├── schedule.entity.ts
│   │   │   ├── user.entity.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── /migrations
│   │   │  ├── .gitkeep
│   │   │  └── 1656619200000-InitialMigration.migration.ts
│   │   │
│   │   ├── /repositories
│   │   │   ├── roles.repository.ts
│   │   │   ├── schedules.repository.ts
│   │   │   ├── users.repository.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── /seeders
│   │   │   ├── index.ts
│   │   │   └── initial.seed.ts
│   │
│   │
│   ├── /config
│   │   └── index.ts
│   │
│   ├── /interfaces
│   │   ├── auth.interface.ts
│   │   ├── index.ts
│   │   ├── permissions.interface.ts
│   │   ├── roles.interface.ts
│   │   ├── routes.interface.ts
│   │   ├── schedules.interface.ts
│   │   └── users.interface.ts
│   │
│   ├── /tests
│   │   ├── auth.test.ts
│   │   ├── fixtures.ts
│   │   ├── schedule.test.ts
│   │   └── users.test.ts
│   │
│   ├── /utils
│   │   ├── logger.ts
│   │   ├── util.ts
│   │   └── vaildateEnv.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── .dockerignore
├── .editorconfig
├── .env.development.local
├── .env.production.local
├── .env.test.local
├── .eslintignore
├── .eslintrc
├── .gitignore
├── .huskyrc
├── .nvmrc
├── .prettierrc
├── .swcrc
├── docker-compose.yml
├── docker-entrypoint.sh
├── Dockerfile
├── ecosystem.config.js
├── jest.config.js
├── LICENSE
├── Makefile
├── nginx.conf
├── nodemon.json
├── package.json
├── swagger.yaml
├── tsconfig.json
└── yarn.lock
```

