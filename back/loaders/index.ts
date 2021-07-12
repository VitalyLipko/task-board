import { ApolloServer } from 'apollo-server-express';
import { Express } from 'express';
import mongoose from 'mongoose';

import init from '../config/init';

import apolloServerLoader from './apollo-server';
import mongooseLoader from './mongoose';
import redisLoader from './redis';

const { connection } = mongoose;

export default async (app: Express): Promise<ApolloServer> => {
  const redisConnection = await redisLoader();

  redisConnection.on('error', (err) => console.error(err));
  redisConnection.once('ready', () => console.log('Redis server ready'));

  connection.on('error', (err) =>
    console.error('MongoDB connection error:', err),
  );
  connection.once('connected', () => console.log('MongoDB connected'));

  await mongooseLoader();

  process
    .on('SIGINT', () => connection.close())
    .on('SIGTERM', () => connection.close());

  await init();

  const apolloConnection = await apolloServerLoader(app);

  console.log('Apollo server started');

  return apolloConnection;
};
