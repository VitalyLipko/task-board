import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UpdateProfileInput, User } from '../../core/graphql/graphql';
import { errorHandler } from '../../core/operators';

import GetProfile from './graphql/get-profile.query.graphql';
import UpdateProfile from './graphql/update-profile.mutation.graphql';

@Injectable()
export class ProfileService {
  constructor(private apollo: Apollo) {}

  getProfile(): Observable<User> {
    return this.apollo
      .watchQuery<{ user: User }>({ query: GetProfile })
      .valueChanges.pipe(
        errorHandler(),
        map(({ data }) => data.user),
      );
  }

  updateProfile(user: UpdateProfileInput): Observable<User | undefined> {
    return this.apollo
      .mutate<{ user: User }>({
        mutation: UpdateProfile,
        variables: { user },
        context: {
          useMultipart: true,
        },
      })
      .pipe(
        errorHandler(),
        map(({ data }) => data?.user),
      );
  }
}
