import express from 'express';

import config from './config';
import loaders from './loaders';

async function startServer(): Promise<void> {
  const app = express();
  const server = await loaders(app);

  app
    .listen({ port: config.port }, () =>
      console.log(
        `🚀 Server ready at http://localhost:${config.port}${server.graphqlPath}`,
      ),
    )
    .on('error', (err) => console.log('Error:', err.message));
}

startServer();
