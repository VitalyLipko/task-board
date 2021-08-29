import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import { Project, Task } from '../graphql/graphql';
import { Breadcrumb } from '../interfaces/breadcrumb.interface';

import GetProjectBreadcrumb from './operations/get-project-breadcrumb.query.graphql';
import GetTaskBreadcrumb from './operations/get-task-breadcrumb.query.graphql';

@Injectable()
export class BreadcrumbService {
  private readonly _breadcrumb = new BehaviorSubject<Array<Breadcrumb> | null>(
    null,
  );

  readonly breadcrumb$ = this._breadcrumb.asObservable();

  set breadcrumb(value: Array<Breadcrumb>) {
    this._breadcrumb.next(value);
  }

  constructor(private router: Router, private apollo: Apollo) {
    let breadcrumb: Array<Breadcrumb>;
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        switchMap((event) => {
          breadcrumb = [
            {
              url: '/',
              label: 'Projects',
            },
          ];
          const segments = (event as NavigationEnd).urlAfterRedirects.split(
            '/',
          );
          const projectId =
            segments[segments.findIndex((value) => value === 'projects') + 1];
          const taskId =
            segments[segments.findIndex((value) => value === 'tasks') + 1];

          return combineLatest([
            projectId ? this.getProjectBreadcrumb(projectId) : of(null),
            taskId ? this.getTaskBreadcrumb(taskId) : of(null),
          ]);
        }),
        map((items) => {
          items.forEach((item) => {
            if (item) {
              const existingItemIndex = breadcrumb.findIndex(
                ({ url }) => url === item.url,
              );
              if (existingItemIndex === -1) {
                breadcrumb.push(item);
              } else {
                breadcrumb[existingItemIndex] = item;
              }
            }
          });

          return breadcrumb;
        }),
      )
      .subscribe((res) => (this.breadcrumb = res));
  }

  private getProjectBreadcrumb(id: string): Observable<Breadcrumb> {
    return this.apollo
      .watchQuery<{ project: Project }>({
        query: GetProjectBreadcrumb,
        variables: { id },
      })
      .valueChanges.pipe(
        map(({ data }) => ({ url: data.project.id, label: data.project.name })),
      );
  }

  private getTaskBreadcrumb(id: string): Observable<Breadcrumb> {
    return this.apollo
      .watchQuery<{ task: Task }>({
        query: GetTaskBreadcrumb,
        variables: { id },
      })
      .valueChanges.pipe(
        map(({ data }) => ({ url: data.task.id, label: data.task.title })),
      );
  }
}
