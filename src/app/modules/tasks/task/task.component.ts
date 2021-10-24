import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import isEqual from 'lodash/isEqual';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { Task } from '../../../core/graphql/graphql';
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
  dropdownActions: Array<DropdownAction> = [
    {
      name: 'edit',
      label: 'Edit',
      action: this.handleEdit.bind(this),
    },
  ];
  assignees!: Array<string>;
  labels!: Array<string>;

  private unsubscribe = new Subject<void>();
  private initialAssignees!: Array<string>;
  private initialLabels!: Array<string>;

  constructor(
    private route: ActivatedRoute,
    private tasksService: TasksService,
    private layoutService: LayoutService,
    private messageService: NzMessageService,
    private cdr: ChangeDetectorRef,
  ) {
    this.layoutService.pageHeaderExtra = null;
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) =>
          this.tasksService.getTask(params.get('taskId') as string),
        ),
        takeUntil(this.unsubscribe),
      )
      .subscribe(
        (task) => {
          this.task = task;
          this.assignees = this.task.assignees.map(({ id }) => id);
          this.labels = this.task.labels.map(({ id }) => id);
          this.initialAssignees = [...this.assignees];
          this.initialLabels = [...this.labels];
          this.layoutService.title = this.task.title;
          this.cdr.markForCheck();
        },
        (err) => this.messageService.error(err.message),
      );
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
}
