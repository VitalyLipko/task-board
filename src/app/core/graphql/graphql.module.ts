import { NgModule } from '@angular/core';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';

import { typePolicies } from './typePolicies';

@NgModule({
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink): ApolloClientOptions<unknown> => ({
        cache: new InMemoryCache({ typePolicies }),
        link: httpLink.create({
          uri: 'http://localhost:8000/graphql',
          withCredentials: true,
        }),
      }),
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
