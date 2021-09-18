import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../../core/graphql/graphql';
import { errorHandler } from '../../core/operators';

import GetUsersPageData from './graphql/get-users-page-data.query.graphql';

@Injectable()
export class UsersService {
  constructor(private apollo: Apollo) {}

  getUsersPageData(): Observable<{ users: Array<User>; user: User }> {
    return this.apollo
      .watchQuery<{ users: Array<User>; user: User }>({
        query: GetUsersPageData,
      })
      .valueChanges.pipe(
        errorHandler(),
        map(({ data }) => data),
      );
  }
}
