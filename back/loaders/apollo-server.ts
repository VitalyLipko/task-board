import { ApolloServer } from 'apollo-server-express';
import { Express } from 'express';

import { typeDefs } from '../models/graphql.schema';
import { resolvers } from '../models/resolvers';

export default async (app: Express): Promise<ApolloServer> => {
  const server = new ApolloServer({ typeDefs, resolvers });
  server.applyMiddleware({ app });

  return server;
};
