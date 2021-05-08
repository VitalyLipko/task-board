import express from 'express';

import loaders from './loaders';
import config from './config';
import init from './config/init';

async function startServer() {
  const app = express();
  const server = await loaders(app);

  app.listen({ port: config.port }, () =>
    init().then(() =>
      console.log(
        `🚀 Server ready at http://localhost:${config.port}${server.graphqlPath}`,
      ),
    ),
  );
}

startServer();
