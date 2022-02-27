import { ApolloError } from '@apollo/client/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export function errorHandler<T>() {
  return (src: Observable<T>): Observable<T> =>
    src.pipe(
      catchError((error: ApolloError | Error) => {
        let message: string | undefined;
        if (error instanceof ApolloError) {
          message = error.graphQLErrors.length
            ? error.graphQLErrors[0].message
            : error.networkError?.message;
        } else {
          message = error.message;
        }

        return throwError(() => ({ message }));
      }),
    );
}
