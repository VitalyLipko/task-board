import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { Task, TaskStatusEnum } from '../../core/graphql/graphql';
import { LayoutService } from '../../core/layout/layout.service';
import { ProjectsService } from '../projects/projects.service';

import { TasksService } from './tasks.service';

@Component({
  selector: 'tb-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksComponent implements OnInit, OnDestroy {
  tasks: Array<Task> | undefined;
  isBoard = false;
  isClosedTasks = false;
  readonly boardBodyStyle: Record<string, unknown> = {
    display: 'flex',
    overflow: 'auto',
  };

  private unsubscribe = new Subject<void>();
  private parentId!: string;
  private tasksStatus: TaskStatusEnum | null = null;

  @ViewChild('createButtonTemplate')
  private createButtonTemplate!: TemplateRef<void>;

  get tasksStatusEnum(): typeof TaskStatusEnum {
    return TaskStatusEnum;
  }

  constructor(
    private tasksService: TasksService,
    private route: ActivatedRoute,
    private layoutService: LayoutService,
    private messageService: NzMessageService,
    private cdr: ChangeDetectorRef,
    private projectsService: ProjectsService,
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(
        switchMap((paramMap) => {
          this.parentId = this.route.snapshot.paramMap.get(
            'projectId',
          ) as string;
          this.tasksStatus = paramMap.get('status') as TaskStatusEnum;
          return this.tasksService.getProjectPageInfo(
            this.parentId,
            this.tasksStatus,
          );
        }),
        takeUntil(this.unsubscribe),
      )
      .subscribe({
        next: (project) => {
          this.layoutService.title = project.name;
          this.layoutService.pageHeaderExtra = this.createButtonTemplate;

          this.tasks = project.tasks;
          this.isClosedTasks = this.tasksStatus === TaskStatusEnum.Closed;
          this.cdr.markForCheck();
        },
        error: (err) => this.messageService.error(err.message),
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  handleCreateTask(): void {
    this.tasksService
      .create(this.parentId, this.tasksStatus)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({ error: (err) => this.messageService.error(err.message) });
  }

  modeChange(event: boolean): void {
    this.isBoard = event;
  }

  handleEditProject(): void {
    this.projectsService
      .edit(this.parentId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({ error: (err) => this.messageService.error(err.message) });
  }
}
