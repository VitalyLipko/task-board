import { ApolloServer } from 'apollo-server-express';
import { Express } from 'express';
import mongoose from 'mongoose';

import init from '../config/init';

import apolloServerLoader from './apollo-server';
import mongooseLoader from './mongoose';
import redisClient from './redis';

const { connection } = mongoose;

export default async (app: Express): Promise<ApolloServer> => {
  redisClient.on('error', (err) => console.error(err));
  redisClient.once('ready', () => console.log('Redis server ready'));

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
