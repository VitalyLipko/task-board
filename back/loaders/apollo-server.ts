import { ApolloServer } from 'apollo-server-express';
import { Express } from 'express';

import typeDefs from '../models/graphql.schema';
import { resolvers } from '../models/resolvers';
import AuthService from '../services/auth.service';

const authServer = new AuthService();

export default async (app: Express): Promise<ApolloServer> => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => authServer.getAuthUser(req),
  });

  await server.start();

  server.applyMiddleware({ app });

  return server;
};
