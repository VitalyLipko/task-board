import { NgModule } from '@angular/core';
import { ApolloClientOptions, split, InMemoryCache } from '@apollo/client/core';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';

import { environment } from '../../../environments/environment';

import { typePolicies } from './typePolicies';

@NgModule({
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink): ApolloClientOptions<unknown> => {
        const http = httpLink.create({
          uri: environment.GRAPHQL_URI,
          withCredentials: true,
        });
        const ws = new WebSocketLink({
          uri: environment.WS_URI,
          options: {
            reconnect: true,
          },
        });
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
