# Task board

## Introduction

It is a task management application developed on [MEAN](<https://en.wikipedia.org/wiki/MEAN_(solution_stack)>) stack.

There are next features:

- [GraphQL](https://graphql.org)-designed API;
- Authorization (via JWT) and authentication;
- User and profile management;
- Project management;
- Task management;
- Kanban board;
- Comments.

## Requirements

Install [Node.js](https://nodejs.org/en/), [MongoDB](https://www.mongodb.com/) and [Redis](https://redis.io) client (used as storage for expired tokens).

Create `.env` file in root directory with next fields:

`HOST` - host for backend server;  
`PORT` - port for backend server;  
`DATABASE_URI` - uri for database instance;  
`TOKEN_SECRET` - JWT secret key;  
`TOKEN_EXPIRE_TIME` - JWT expiration time (in seconds);  
`APP_DATA_PATH` - path to application data;  
`FILE_STORAGE_PATH` - path to file storage (`${APP_DATA_PATH}/path/to/file/storage`).

## Scripts

- `start:back:dev` - start backend development server;
- `start:front` - start frontend server;
- `graphql-codegen` - fetch GraphQL schema and generate clients files.
