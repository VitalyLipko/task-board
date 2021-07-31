import { ApolloServer } from 'apollo-server-express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { Express } from 'express';

import { ContextPayload } from '../models/context-payload.interface';
import typeDefs from '../models/graphql.schema';
import { resolvers } from '../models/resolvers';
import AuthService from '../services/auth.service';

const authServer = new AuthService();

export default async (app: Express): Promise<ApolloServer> => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req, res }): Promise<ContextPayload> => {
      const result = await authServer.createContext(req);
      return { ...result, res };
    },
  });

  await server.start();

  app.use(cors({ origin: true, credentials: true }));
  app.use(cookieParser());

  server.applyMiddleware({
    app,
    cors: false,
  });

  return server;
};
