import { ApolloServer } from 'apollo-server-express';
import { Express } from 'express';

import config from '../config';
import init from '../config/init';

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
    console.log(`Database: ${config.port} connected`),
  );

  await init();

  const apolloConnection = await apolloServerLoader(app);

  console.log('Apollo server started');

  return apolloConnection;
};
