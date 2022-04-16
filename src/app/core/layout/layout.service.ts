import { Injectable, TemplateRef } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../graphql/graphql';
import { errorHandler } from '../operators';

import GetCurrentUser from './get-current-user.query.graphql';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  private readonly _pageHeaderExtra =
    new BehaviorSubject<TemplateRef<void> | null>(null);
  private readonly _title = new BehaviorSubject<string | null>(null);

  readonly pageHeaderExtra$ = this._pageHeaderExtra.asObservable();
  readonly title$ = this._title.asObservable();

  set pageHeaderExtra(value: TemplateRef<void> | null) {
    this._pageHeaderExtra.next(value);
  }

  set title(value: string) {
    this._title.next(value);
  }

  constructor(private apollo: Apollo) {}

  getCurrentUser(): Observable<User> {
    return this.apollo
      .watchQuery<{ user: User }>({ query: GetCurrentUser })
      .valueChanges.pipe(
        errorHandler(),
        map(({ data }) => data.user),
      );
  }
}
