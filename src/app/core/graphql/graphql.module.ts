import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';

@NgModule({
  imports: [HttpClientModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink): ApolloClientOptions<unknown> => ({
        cache: new InMemoryCache(),
        link: httpLink.create({
          uri: 'http://localhost:8000/graphql',
        }),
      }),
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
