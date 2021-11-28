import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import isEmpty from 'lodash/isEmpty';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { iif, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Task } from '../../../core/graphql/graphql';
import { TasksService } from '../tasks.service';

@Component({
  selector: 'tb-task-drawer',
  templateUrl: './task-drawer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskDrawerComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  task: Task | undefined;

  private unsubscribe = new Subject<void>();

  get disabled(): boolean {
    return this.tbId
      ? this.form?.invalid || isEmpty(this.result)
      : this.form.invalid;
  }

  get result(): Record<string, unknown> | null {
    if (!this.form) {
      return null;
    }

    const result: Record<string, unknown> = {};
    Object.entries(this.form.value).forEach(([key, value]) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (value !== this.task[key]) {
        result[key] = value;
      }
    });

    return result;
  }

  @Input() tbId: string | undefined;

  constructor(
    private tasksService: TasksService,
    private drawerRef: NzDrawerRef<TaskDrawerComponent>,
    private messageService: NzMessageService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    iif(
      () => !!this.tbId,
      this.tasksService.getTaskDrawerData(this.tbId as string),
      of(undefined),
    )
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (task) => {
          this.task = task;
          this.createForm();
          this.cdr.markForCheck();
        },
        (err) => this.messageService.error(err.message),
      );
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onSubmit(): void {
    if (this.tbId) {
      this.drawerRef.close({ ...this.result, id: this.tbId });
    } else {
      const values: Record<string, unknown> = {};
      Object.entries(this.form.value).forEach(([key, value]) => {
        if (value) {
          values[key] = value;
        }
      });
      this.drawerRef.close(values);
    }
  }

  private createForm(): void {
    this.form = new FormGroup({
      title: new FormControl(null, Validators.required),
      description: new FormControl(),
    });

    if (this.task) {
      this.form.setValue({
        title: this.task.title,
        description: this.task.description,
      });
    } else {
      this.form.addControl('assignees', new FormControl());
      this.form.addControl('labels', new FormControl());
    }
  }
}
