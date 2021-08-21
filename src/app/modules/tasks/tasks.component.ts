import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ViewChild,
  TemplateRef,
  ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { Task } from '../../core/graphql/graphql';
import { LayoutService } from '../../shared/layout/layout.service';

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

  private unsubscribe = new Subject<void>();
  private parentId!: string;

  @ViewChild('createButtonTemplate')
  private createButtonTemplate!: TemplateRef<void>;

  constructor(
    private tasksService: TasksService,
    private route: ActivatedRoute,
    private layoutService: LayoutService,
    private messageService: NzMessageService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((paramMap) => {
          this.parentId = paramMap.get('projectId') as string;
          return this.tasksService.getProjectPageInfo(this.parentId);
        }),
        takeUntil(this.unsubscribe),
      )
      .subscribe(
        (project) => {
          this.layoutService.title = project.name;
          this.layoutService.pageHeaderExtra = this.createButtonTemplate;

          this.tasks = project.tasks;
          this.cdr.markForCheck();
        },
        (err) => this.messageService.error(err.message),
      );
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onCreate(): void {
    this.tasksService
      .create(this.parentId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({ error: (err) => this.messageService.error(err.message) });
  }

  modeChange(event: boolean): void {
    this.isBoard = event;
  }
}
