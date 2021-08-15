import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MutationLoginArgs } from '../graphql/graphql';
import { errorHandler } from '../operators';

import Login from './operations/login.mutation.graphql';
import Logout from './operations/logout.mutation.graphql';

@Injectable()
export class AuthService {
  constructor(private apollo: Apollo, private router: Router) {}

  login(variables: MutationLoginArgs): Observable<string | undefined> {
    return this.apollo
      .mutate<{ login: string }, MutationLoginArgs>({
        mutation: Login,
        variables,
      })
      .pipe(
        errorHandler(),
        map(({ data }) => {
          if (data?.login) {
            this.router.navigate(['projects']);
          }

          return data?.login;
        }),
      );
  }

  logout(): Observable<boolean> {
    return this.apollo.mutate<{ logout: boolean }>({ mutation: Logout }).pipe(
      errorHandler(),
      map(({ data }) => {
        if (data?.logout) {
          this.apollo.client
            .clearStore()
            .then(() => this.router.navigate(['login']));
        }

        return data?.logout || false;
      }),
    );
  }
}
