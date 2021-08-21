import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ModalOptions, NzModalService } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import { CreateTaskInput, Project, Task } from '../../core/graphql/graphql';
import { errorHandler } from '../../core/operators';

import CreateTask from './operations/create-task.mutation.graphql';
import GetProjectPageInfo from './operations/get-project-page-info.graphql';
import { TaskModalComponent } from './task-modal/task-modal.component';

@Injectable()
export class TasksService {
  constructor(
    private apollo: Apollo,
    private modalService: NzModalService,
    private messageService: NzMessageService,
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

  create(parentId: string): Observable<void> {
    const options: ModalOptions<TaskModalComponent, CreateTaskInput> = {
      nzTitle: 'Create task',
      nzMaskClosable: false,
      nzContent: TaskModalComponent,
      nzFooter: [
        {
          label: 'Cancel',
          onClick(contentComponentInstance?: TaskModalComponent) {
            contentComponentInstance?.modalRef.close();
          },
        },
        {
          label: 'Create',
          type: 'primary',
          disabled: (contentComponentInstance) =>
            !!contentComponentInstance?.form.invalid,
          onClick(contentComponentInstance?: TaskModalComponent) {
            contentComponentInstance?.modalRef.close(
              contentComponentInstance?.form.value,
            );
          },
        },
      ],
    };

    return this.modalService
      .create(options)
      .afterClose.asObservable()
      .pipe(
        filter((res) => !!res),
        switchMap((task) =>
          this.apollo.mutate<{ createTask: Task }, { task: CreateTaskInput }>({
            mutation: CreateTask,
            variables: { task: { ...task, parentId } },
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
}
