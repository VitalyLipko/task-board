import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import { Project, Task } from '../graphql/graphql';
import { Breadcrumb } from '../interfaces/breadcrumb.interface';

import GetProjectBreadcrumb from './graphql/get-project-breadcrumb.query.graphql';
import GetTaskBreadcrumb from './graphql/get-task-breadcrumb.query.graphql';

@Injectable()
export class BreadcrumbService {
  private readonly _breadcrumb = new BehaviorSubject<Array<Breadcrumb> | null>(
    null,
  );

  readonly breadcrumb$ = this._breadcrumb.asObservable();

  set breadcrumb(value: Array<Breadcrumb>) {
    this._breadcrumb.next(value);
  }

  constructor(
    private router: Router,
    private apollo: Apollo,
    private translocoService: TranslocoService,
    private route: ActivatedRoute,
  ) {
    let breadcrumb: Array<Breadcrumb>;
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        switchMap((event) => {
          const segments = (event as NavigationEnd).urlAfterRedirects.split(
            '/',
          );
          const label = this.translocoService.translate(
            BreadcrumbService.getRootLabelKey(segments[1]),
          );
          breadcrumb = [
            {
              url: '/',
              label,
            },
          ];

          const projectId = this.getId(segments, 'projects');
          const taskId = this.getId(segments, 'tasks');

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

  private getId(
    segments: Array<string>,
    predicate: string,
  ): string | undefined {
    return segments[segments.findIndex((value) => value === predicate) + 1];
  }

  private static getRootLabelKey(segment: string): string {
    switch (segment) {
      case 'projects':
        return 'common.projects';
      case 'users':
        return 'common.users';
      case 'profile':
        return 'profile.profile';
      default:
        return '';
    }
  }

  private getProjectBreadcrumb(id: string): Observable<Breadcrumb> {
    return this.apollo
      .watchQuery<{ project: Project }>({
        query: GetProjectBreadcrumb,
        variables: { id },
      })
      .valueChanges.pipe(
        map(({ data }) => ({
          url: `projects/${data.project.id}`,
          label: data.project.name,
        })),
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
