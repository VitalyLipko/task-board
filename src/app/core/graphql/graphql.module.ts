import { NgModule } from '@angular/core';
import { ApolloClientOptions, split, InMemoryCache } from '@apollo/client/core';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { extractFiles } from 'extract-files';
import { createClient } from 'graphql-ws';

import { environment } from '../../../environments/environment';

import { typePolicies } from './typePolicies';

@NgModule({
  imports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink): ApolloClientOptions<unknown> => {
        const http = httpLink.create({
          uri: environment.GRAPHQL_URI,
          withCredentials: true,
          extractFiles,
        });
        const ws = new GraphQLWsLink(
          createClient({
            url: environment.WS_URI,
            lazy: true,
            shouldRetry: () => true,
          }),
        );
        const link = split(
          ({ query }) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const { kind, operation } = getMainDefinition(query);
            return (
              kind === 'OperationDefinition' && operation === 'subscription'
            );
          },
          ws,
          http,
        );

        return {
          cache: new InMemoryCache({ typePolicies }),
          link,
        };
      },
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
