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

import { Task, UpdateTaskInput } from '../../../core/graphql/graphql';
import { TasksService } from '../tasks.service';

@Component({
  selector: 'tb-task-drawer',
  templateUrl: './task-drawer.component.html',
  styleUrls: ['./task-drawer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskDrawerComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  task: Task | undefined;

  private unsubscribe = new Subject<void>();

  @Input() tbId: string | undefined;

  get disabled(): boolean {
    return this.tbId
      ? this.task?.title === this.form.get('title')?.value
      : this.form.invalid;
  }

  constructor(
    private tasksService: TasksService,
    private drawerRef: NzDrawerRef<TaskDrawerComponent, UpdateTaskInput>,
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
    this.drawerRef.close({
      ...this.form.value,
      ...(this.tbId && { id: this.tbId }),
    });
  }

  private createForm(): void {
    this.form = new FormGroup({
      title: new FormControl(null, Validators.required),
    });

    if (this.task) {
      this.form.setValue({ title: this.task.title });
    } else {
      this.form.addControl('assignees', new FormControl());
    }
  }
}
