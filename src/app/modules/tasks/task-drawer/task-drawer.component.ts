import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { iif, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Task } from '../../../core/graphql/graphql';
import { FormAbstractClass } from '../../../shared/abstract-classes/form.abstract-class';
import { TasksService } from '../tasks.service';

@Component({
  selector: 'tb-task-drawer',
  templateUrl: './task-drawer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskDrawerComponent
  extends FormAbstractClass
  implements OnInit, OnDestroy
{
  task: Task | undefined;

  private unsubscribe = new Subject<void>();

  @Input() tbId: string | undefined;

  constructor(
    private tasksService: TasksService,
    private drawerRef: NzDrawerRef<TaskDrawerComponent>,
    private messageService: NzMessageService,
    private cdr: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.tbId) {
      this.type = 'edit';
    }
    iif(
      () => !!this.tbId,
      this.tasksService.getTaskDrawerData(this.tbId as string),
      of(undefined),
    )
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (task) => {
          this.task = task;
          this.createForm();
          this.cdr.markForCheck();
        },
        error: (err) => this.messageService.error(err.message),
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onSubmit(): void {
    if (this.tbId) {
      this.drawerRef.close({ ...this.changedValue, id: this.tbId });
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
      this.initialValues = { ...this.form.value };
    } else {
      this.form.addControl('assignees', new FormControl());
      this.form.addControl('labels', new FormControl());
    }
  }
}
