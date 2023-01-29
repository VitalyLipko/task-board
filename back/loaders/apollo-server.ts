import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { json } from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import { useServer } from 'graphql-ws/lib/use/ws';
import { createServer } from 'http';
import { constants } from 'http2';
import { WebSocketServer } from 'ws';

import config from '../config';
import { ContextPayload } from '../models/interfaces/context-payload.interface';
import { resolvers } from '../models/resolvers';
import typeDefs from '../models/schemas/graphql.schema';
import authService from '../services/auth.service';

export default async (): Promise<void> => {
  const app = express();
  const httpServer = createServer(app);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });
  const serverCleanup = useServer(
    { schema, onConnect: authService.checkWSConnection },
    wsServer,
  );

  const server = new ApolloServer<ContextPayload>({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  app.use(
    '/graphql',
    json(),
    cors<cors.CorsRequest>({ origin: true, credentials: true }),
    cookieParser(),
    graphqlUploadExpress({
      maxFileSize: 8000000, // 8MB
    }),
    expressMiddleware(server, {
      context: async ({ req, res }): Promise<ContextPayload> => {
        const result = await authService.createContext(req);
        return { ...result, res };
      },
    }),
  );

  app.use(cookieParser()); // need for REST requests

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

  await new Promise<void>((resolve) =>
    httpServer
      .listen({ port: config.port }, resolve)
      .on('error', (err) => console.log('Error:', err.message)),
  );
  console.log(`🚀 Server ready at ${config.host}:${config.port}/graphql`);
};
