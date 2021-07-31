/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import IsLoggedIn from './is-logged-in.query.graphql';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private apollo: Apollo, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.apollo
      .query<{ isLoggedIn: boolean }>({
        query: IsLoggedIn,
        fetchPolicy: 'network-only',
      })
      .pipe(
        map(({ data }) => {
          if (route.data.loginPage) {
            if (data.isLoggedIn) {
              this.router.navigate([]);
              return false;
            }
            return true;
          }

          if (data.isLoggedIn) {
            return true;
          }

          this.router.navigate(['login']);
          return false;
        }),
      );
  }
}
