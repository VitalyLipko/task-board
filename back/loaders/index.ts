import mongoose from 'mongoose';

import init from '../config/init';

import apolloServerLoader from './apollo-server';
import mongooseLoader from './mongoose';
import redisClient from './redis';

const { connection } = mongoose;

export default async (): Promise<void> => {
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
  await apolloServerLoader();
};
