import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './models/graphql.schema';
import { resolvers } from './models/resolvers';
import mongoose from 'mongoose';
import { environment } from './config/environment';

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });
const db = mongoose.connection;

mongoose.connect(environment.db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

server.applyMiddleware({ app });
app.listen({ port: environment.port }, () =>
  console.log(
    `🚀 Server ready at http://localhost:${environment.port}${server.graphqlPath}`,
  ),
);

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log(`database: ${environment.db} connected`);
});
