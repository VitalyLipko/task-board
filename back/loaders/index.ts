import { ApolloServer } from 'apollo-server-express';
import { Express } from 'express';

import mongooseLoader from './mongoose';
import apolloServerLoader from './apollo-server';
import config from '../config';

export default async (app: Express): Promise<ApolloServer> => {
  const mongoConnection = await mongooseLoader();

  mongoConnection.on('error', console.error.bind(console, 'connection error:'));
  mongoConnection.once('open', function () {
    console.log(`database: ${config.port} connected`);
  });

  const apolloConnection = await apolloServerLoader(app);

  return apolloConnection;
};
