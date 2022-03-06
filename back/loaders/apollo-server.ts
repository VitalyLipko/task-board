import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { graphqlUploadExpress } from 'graphql-upload';
import { createServer } from 'http';
import { constants } from 'http2';

import config from '../config';
import { ContextPayload } from '../models/interfaces/context-payload.interface';
import { resolvers } from '../models/resolvers';
import typeDefs from '../models/schemas/graphql.schema';
import authService from '../services/auth.service';

export default async (): Promise<void> => {
  const app = express();
  const httpServer = createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req, res }): Promise<ContextPayload> => {
      const result = await authService.createContext(req);
      return { ...result, res };
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    cors({ origin: true, credentials: true }),
    cookieParser(),
    graphqlUploadExpress({
      maxFileSize: 8000000, // 8MB
    }),
  );

  app.get('/api/v1/file-storage/:fileId', async (req, res) => {
    const path = `${config.fileStoragePath}/${req.params.fileId}`;
    const result = await authService.createContext(req);

    if (authService.isLoggedIn(result)) {
      res.sendFile(path, (err) => {
        if (err && err.message.startsWith('ENOENT')) {
          res
            .status(constants.HTTP_STATUS_NOT_FOUND)
            .send({ error: 'Not found' });
        } else if (err) {
          console.log('Send file error:', err.message);
          res
            .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
            .send({ error: 'Something went wrong' });
        }
      });
    } else {
      res
        .status(constants.HTTP_STATUS_UNAUTHORIZED)
        .send({ error: 'Not authorized' });
    }
  });

  server.applyMiddleware({
    app,
    cors: false,
  });

  await new Promise<void>(() =>
    httpServer
      .listen({ port: config.port }, () =>
        console.log(
          `🚀 Server ready at ${config.host}:${config.port}${server.graphqlPath}`,
        ),
      )
      .on('error', (err) => console.log('Error:', err.message)),
  );
};
