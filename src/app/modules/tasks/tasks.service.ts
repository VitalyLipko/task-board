import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { InternalRefetchQueriesInclude } from '@apollo/client/core';
import { TranslocoService } from '@ngneat/transloco';
import { Apollo } from 'apollo-angular';
import { NzDrawerOptions, NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable, tap } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import {
  Board,
  Comment,
  CreateCommentInput,
  CreateTaskInput,
  HistoryEntry,
  Project,
  SubscriptionCommentCreatedArgs,
  Task,
  TaskStatusEnum,
  UpdateTaskInput,
} from '../../core/graphql/graphql';
import { errorHandler } from '../../core/operators';

import ChangeTaskStatus from './graphql/change-task-status.mutation.graphql';
import CommentCreated from './graphql/comment-created.subscription.graphql';
import CreateComment from './graphql/create-comment.mutation.graphql';
import CreateTask from './graphql/create-task.mutation.graphql';
import GetBoard from './graphql/get-board.query.graphql';
import GetComments from './graphql/get-comments.query.graphql';
import GetHistoryEntries from './graphql/get-history-entries.query.graphql';
import GetProjectPageInfo from './graphql/get-project-page-info.query.graphql';
import GetTaskDrawerData from './graphql/get-task-drawer-data.query.graphql';
import GetTask from './graphql/get-task.query.graphql';
import HistoryEntryAdded from './graphql/history-entry-added.subscription.graphql';
import UpdateTask from './graphql/update-task.mutation.graphql';
import { TaskDrawerComponent } from './task-drawer/task-drawer.component';

@Injectable()
export class TasksService {
  private readonly translations = {
    createTask: this.translocoService.translate('task.create_task'),
    taskCreated: this.translocoService.translate('task.task_created'),
    editTask: this.translocoService.translate('task.edit_task'),
    taskUpdated: this.translocoService.translate('task.task_updated'),
    delete: this.translocoService.translate('common.delete'),
    taskDeleted: this.translocoService.translate('task.task_deleted'),
  };
  constructor(
    private apollo: Apollo,
    private messageService: NzMessageService,
    private drawerService: NzDrawerService,
    private modalService: NzModalService,
    private router: Router,
    private translocoService: TranslocoService,
  ) {}

  getProjectPageInfo(
    id: string,
    tasksStatus: TaskStatusEnum | null,
  ): Observable<Project> {
    return this.apollo
      .watchQuery<{ project: Project }>({
        query: GetProjectPageInfo,
        variables: { id, ...(tasksStatus && { tasksStatus }) },
        fetchPolicy: 'network-only',
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

  create(
    parentId: string,
    tasksStatus: TaskStatusEnum | null,
  ): Observable<void> {
    const options: NzDrawerOptions<TaskDrawerComponent> = {
      nzTitle: this.translations.createTask,
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
            refetchQueries: [
              {
                query: GetProjectPageInfo,
                variables: {
                  id: parentId,
                  ...(tasksStatus && { tasksStatus }),
                },
              },
            ],
          }),
        ),
        errorHandler(),
        map(() => {
          this.messageService.success(this.translations.taskCreated);
        }),
      );
  }

  edit(id: string): Observable<void> {
    const options: NzDrawerOptions<TaskDrawerComponent> = {
      nzTitle: this.translations.editTask,
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
        this.messageService.success(this.translations.taskUpdated);
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

  updateLabels(
    id: string,
    labels: Array<string>,
    refetchQueries?: InternalRefetchQueriesInclude,
  ): Observable<Task | undefined> {
    return this.apollo
      .mutate<{ updateTask: Task }, { task: UpdateTaskInput }>({
        mutation: UpdateTask,
        variables: { task: { id, labels } },
        refetchQueries,
      })
      .pipe(
        errorHandler(),
        map(({ data }) => data?.updateTask),
      );
  }

  getBoard(parentId: string): Observable<Board> {
    return this.apollo
      .watchQuery<{ board: Board }>({
        query: GetBoard,
        variables: { parentId },
        fetchPolicy: 'network-only',
      })
      .valueChanges.pipe(
        errorHandler(),
        map(({ data }) => data.board),
      );
  }

  changeStatus(
    id: string,
    value: TaskStatusEnum,
  ): Observable<boolean | undefined> {
    return this.apollo
      .mutate<{ changeTaskStatus: boolean }>({
        mutation: ChangeTaskStatus,
        variables: { id, value },
        refetchQueries: [{ query: GetTask, variables: { id } }],
      })
      .pipe(
        errorHandler(),
        map(({ data }) => {
          const message = this.translocoService.translate(
            'task.status_changed',
            { status: value === TaskStatusEnum.Open ? 'open' : 'close' },
          );
          this.messageService.success(message);
          return data?.changeTaskStatus;
        }),
      );
  }

  deleteTask({ id, title, parentId }: Task): Observable<boolean | undefined> {
    return this.modalService
      .confirm({
        nzTitle: this.translocoService.translate('common.delete_entity', {
          entity: title,
        }),
        nzMaskClosable: false,
        nzOkDanger: true,
        nzOkText: this.translations.delete,
        nzOnOk: () => true,
      })
      .afterClose.asObservable()
      .pipe(
        filter(Boolean),
        switchMap(() =>
          this.apollo.mutate<{ changeTaskStatus: boolean }>({
            mutation: ChangeTaskStatus,
            variables: { id, value: TaskStatusEnum.Deleted },
          }),
        ),
        errorHandler(),
        map(({ data }) => data?.changeTaskStatus),
        tap((res) => {
          if (res) {
            this.messageService.success(this.translations.taskDeleted);
            this.router.navigate([`/projects/${parentId}`]);
          }
        }),
      );
  }

  getComments(parentId: string): Observable<Array<Comment>> {
    return this.apollo
      .query<{ comments: Array<Comment> }>({
        query: GetComments,
        variables: { parentId },
        fetchPolicy: 'no-cache',
      })
      .pipe(
        errorHandler(),
        map(({ data }) => data.comments),
      );
  }

  createComment(comment: CreateCommentInput): Observable<Comment | undefined> {
    return this.apollo
      .mutate<{ createComment: Comment }>({
        mutation: CreateComment,
        variables: { comment },
      })
      .pipe(
        errorHandler(),
        map(({ data }) => data?.createComment),
      );
  }

  commentCreated(parentId: string): Observable<Comment> {
    return this.apollo
      .subscribe<{ commentCreated: Comment }, SubscriptionCommentCreatedArgs>({
        query: CommentCreated,
        variables: { parentId },
      })
      .pipe(
        errorHandler(),
        map(({ data }) => data?.commentCreated),
        filter(Boolean),
      );
  }

  getHistoryEntries(parentId: string): Observable<Array<HistoryEntry>> {
    return this.apollo
      .query<{ historyEntries: Array<HistoryEntry> }>({
        query: GetHistoryEntries,
        variables: { parentId },
        fetchPolicy: 'no-cache',
      })
      .pipe(
        errorHandler(),
        map(({ data }) => data.historyEntries),
      );
  }

  historyEntryAdded(parentId: string): Observable<HistoryEntry> {
    return this.apollo
      .subscribe<
        { historyEntryAdded: HistoryEntry },
        SubscriptionCommentCreatedArgs
      >({
        query: HistoryEntryAdded,
        variables: { parentId },
      })
      .pipe(
        errorHandler(),
        map(({ data }) => data?.historyEntryAdded),
        filter(Boolean),
      );
  }
}
