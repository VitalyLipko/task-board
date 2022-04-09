import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import isEqual from 'lodash/isEqual';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { Label, Task, TaskStatusEnum } from '../../../core/graphql/graphql';
import { LayoutService } from '../../../core/layout/layout.service';
import { DropdownAction } from '../../../shared/dropdown-actions/dropdown-action.interface';
import { TasksService } from '../tasks.service';

@Component({
  selector: 'tb-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TaskComponent implements OnInit, OnDestroy {
  task!: Task;
  parentId!: string;
  dropdownActions: Array<DropdownAction<Task>> = [
    {
      name: 'edit',
      label: this.translocoService.translate('common.edit'),
      action: this.handleEdit.bind(this),
    },
    {
      name: 'open',
      label: this.translocoService.translate('task.open'),
      action: this.handleOpen.bind(this),
      hide: (task) =>
        !task ||
        [TaskStatusEnum.Open, TaskStatusEnum.Deleted].includes(task.status),
    },
    {
      name: 'close',
      label: this.translocoService.translate('task.close'),
      action: this.handleClose.bind(this),
      hide: (task) =>
        !task ||
        [TaskStatusEnum.Closed, TaskStatusEnum.Deleted].includes(task.status),
    },
    {
      name: 'delete',
      label: this.translocoService.translate('common.delete'),
      action: this.handleDelete.bind(this),
      danger: true,
    },
  ];
  assignees!: Array<string>;
  labels!: Array<string>;

  private unsubscribe = new Subject<void>();
  private initialAssignees!: Array<string>;
  private initialLabels!: Array<string>;

  get color(): string | undefined {
    switch (this.task.status) {
      case TaskStatusEnum.Open:
        return 'green';
      case TaskStatusEnum.Closed:
        return 'red';
      default:
        return undefined;
    }
  }

  get title(): string | null {
    switch (this.task.status) {
      case TaskStatusEnum.Open:
        return this.translocoService.translate('task.open');
      case TaskStatusEnum.Closed:
        return this.translocoService.translate('task.closed');
      default:
        return null;
    }
  }

  constructor(
    private route: ActivatedRoute,
    private tasksService: TasksService,
    private layoutService: LayoutService,
    private messageService: NzMessageService,
    private cdr: ChangeDetectorRef,
    private translocoService: TranslocoService,
  ) {
    this.layoutService.pageHeaderExtra = null;
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          this.parentId = params.get('taskId') as string;
          return this.tasksService.getTask(this.parentId);
        }),
        takeUntil(this.unsubscribe),
      )
      .subscribe({
        next: (task) => {
          this.task = task;
          this.assignees = this.task.assignees.map(({ id }) => id);
          this.labels = this.task.labels.map(({ id }) => id);
          this.initialAssignees = [...this.assignees];
          this.initialLabels = [...this.labels];
          this.layoutService.title = this.task.title;
          this.cdr.markForCheck();
        },
        error: (err) => this.messageService.error(err.message),
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  handleEdit(): void {
    this.tasksService
      .edit(this.task.id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({ error: (err) => this.messageService.error(err.message) });
  }

  handleAssigneesChange(value: boolean): void {
    if (
      !value &&
      !isEqual(this.assignees.sort(), this.initialAssignees.sort())
    ) {
      this.tasksService
        .updateAssignees(this.task.id, this.assignees)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe({ error: (err) => this.messageService.error(err.message) });
    }
  }

  handleLabelsChange(value: boolean): void {
    if (!value && !isEqual(this.labels.sort(), this.initialLabels.sort())) {
      this.tasksService
        .updateLabels(this.task.id, this.labels)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe({ error: (err) => this.messageService.error(err.message) });
    }
  }

  trackByFn(_: number, item: Label): string {
    return item.id;
  }

  handleClose(): void {
    this.tasksService
      .changeStatus(this.task.id, TaskStatusEnum.Closed)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({ error: (err) => this.messageService.error(err.message) });
  }

  handleOpen(): void {
    this.tasksService
      .changeStatus(this.task.id, TaskStatusEnum.Open)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({ error: (err) => this.messageService.error(err.message) });
  }

  handleDelete(): void {
    this.tasksService
      .deleteTask(this.task)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        error: (err) => this.messageService.error(err.message),
      });
  }
}
