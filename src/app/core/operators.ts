import { ApolloError } from '@apollo/client/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export function errorHandler<T>() {
  return (src: Observable<T>): Observable<T> =>
    src.pipe(
      catchError((error: ApolloError) => {
        const message = error.graphQLErrors.length
          ? error.graphQLErrors[0].message
          : error.networkError?.message;
        return throwError({ message });
      }),
    );
}
