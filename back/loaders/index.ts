import mongoose from 'mongoose';

import init from '../config/init';

import apolloServerLoader from './apollo-server';
import mongooseLoader from './mongoose';
import redisClient from './redis';

const { connection } = mongoose;

export default async (): Promise<void> => {
  const disconnecting = async () => {
    await connection.close();
    await redisClient.disconnect();
  };

  redisClient.on('error', (err) => console.error('Redis Client error:', err));
  redisClient.once('ready', () => console.log('Redis Client ready'));
  await redisClient.connect();

  connection.on('error', (err) => console.error('MongoDB error:', err));
  connection.once('connected', () => console.log('MongoDB connected'));
  await mongooseLoader();

  process.on('SIGINT', disconnecting).on('SIGTERM', disconnecting);

  await init();
  await apolloServerLoader();
};
