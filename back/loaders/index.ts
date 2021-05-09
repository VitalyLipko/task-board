import { ApolloServer } from 'apollo-server-express';
import { Express } from 'express';

import config from '../config';

import mongooseLoader from './mongoose';
import apolloServerLoader from './apollo-server';
import redisLoader from './redis';

export default async (app: Express): Promise<ApolloServer> => {
  const redisConnection = await redisLoader();

  redisConnection.on('error', (err) => console.error(err));
  redisConnection.once('ready', () => console.log('Redis server ready'));

  const mongoConnection = await mongooseLoader();

  mongoConnection.on('error', (err) => console.error('connection error:', err));
  mongoConnection.once('open', () =>
    console.log(`database: ${config.port} connected`),
  );

  const apolloConnection = await apolloServerLoader(app);

  return apolloConnection;
};
