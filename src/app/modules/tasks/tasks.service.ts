import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { NzDrawerOptions, NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import {
  CreateTaskInput,
  Project,
  Task,
  UpdateTaskInput,
} from '../../core/graphql/graphql';
import { errorHandler } from '../../core/operators';

import CreateTask from './graphql/create-task.mutation.graphql';
import GetProjectPageInfo from './graphql/get-project-page-info.graphql';
import GetTaskDrawerData from './graphql/get-task-drawer-data.query.graphql';
import GetTask from './graphql/get-task.query.graphql';
import UpdateTask from './graphql/update-task.mutation.graphql';
import { TaskDrawerComponent } from './task-drawer/task-drawer.component';

@Injectable()
export class TasksService {
  constructor(
    private apollo: Apollo,
    private messageService: NzMessageService,
    private drawerService: NzDrawerService,
  ) {}

  getProjectPageInfo(id: string): Observable<Project> {
    return this.apollo
      .watchQuery<{ project: Project }>({
        query: GetProjectPageInfo,
        variables: { id },
      })
      .valueChanges.pipe(
        errorHandler(),
        map(({ data }) => data.project),
      );
  }

  getTask(id: string): Observable<Task> {
    return this.apollo
      .watchQuery<{ task: Task }>({
        query: GetTask,
        variables: { id },
      })
      .valueChanges.pipe(
        errorHandler(),
        map(({ data }) => data.task),
      );
  }

  getTaskDrawerData(id: string): Observable<Task> {
    return this.apollo
      .query<{ task: Task }>({
        query: GetTaskDrawerData,
        variables: { id },
        fetchPolicy: 'network-only',
      })
      .pipe(
        errorHandler(),
        map(({ data }) => data.task),
      );
  }

  create(parentId: string): Observable<void> {
    const options: NzDrawerOptions<TaskDrawerComponent> = {
      nzTitle: 'Create task',
      nzMaskClosable: false,
      nzContent: TaskDrawerComponent,
      nzWidth: 500,
    };

    return this.drawerService
      .create<TaskDrawerComponent, unknown, CreateTaskInput>(options)
      .afterClose.pipe(
        filter((res) => !!res),
        switchMap((task) =>
          this.apollo.mutate<{ createTask: Task }, { task: CreateTaskInput }>({
            mutation: CreateTask,
            variables: {
              task: {
                ...task,
                parentId,
                ...(task.assignees?.length && { assignees: task.assignees }),
              },
            },
            update(cache, { data }) {
              const newTask = data?.createTask;
              const existingProjectInfo = cache.readQuery<{
                project: Project;
              }>({
                query: GetProjectPageInfo,
                variables: { id: parentId },
              });

              if (newTask && existingProjectInfo) {
                const tasks = [
                  ...existingProjectInfo.project.tasks,
                  newTask,
                ].sort((a, b) => a.title.localeCompare(b.title));
                cache.writeQuery<{ project: Project }>({
                  query: GetProjectPageInfo,
                  variables: { id: parentId },
                  data: { project: { ...existingProjectInfo.project, tasks } },
                });
              }
            },
          }),
        ),
        errorHandler(),
        map(() => {
          this.messageService.success('Task created');
        }),
      );
  }

  edit(id: string): Observable<void> {
    const options: NzDrawerOptions<TaskDrawerComponent> = {
      nzTitle: 'Edit task',
      nzContent: TaskDrawerComponent,
      nzContentParams: { tbId: id },
      nzMaskClosable: false,
      nzWidth: 500,
    };

    return this.drawerService.create(options).afterClose.pipe(
      filter((res) => !!res),
      switchMap((task) =>
        this.apollo.mutate<{ updateTask: Task }, { task: UpdateTaskInput }>({
          mutation: UpdateTask,
          variables: { task },
        }),
      ),
      errorHandler(),
      map(() => {
        this.messageService.success('Task updated');
      }),
    );
  }

  updateAssignees(
    id: string,
    assignees: Array<string>,
  ): Observable<Task | undefined> {
    return this.apollo
      .mutate<{ updateTask: Task }, { task: UpdateTaskInput }>({
        mutation: UpdateTask,
        variables: { task: { id, assignees } },
      })
      .pipe(
        errorHandler(),
        map(({ data }) => data?.updateTask),
      );
  }
}
