import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import cloneDeep from 'lodash/cloneDeep';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { Board, Column, Label, Task } from '../../../core/graphql/graphql';
import GetBoard from '../graphql/get-board.query.graphql';
import { TasksService } from '../tasks.service';

@Component({
  selector: 'tb-task-board',
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TaskBoardComponent implements OnInit, OnDestroy {
  board: Board | undefined;

  private unsubscribe = new Subject<void>();

  constructor(
    private tasksService: TasksService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((paramMap) =>
          this.tasksService.getBoard(paramMap.get('projectId') as string),
        ),
        takeUntil(this.unsubscribe),
      )
      .subscribe((board) => {
        this.board = cloneDeep(board);
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  trackByFn(index: number, item: Label | Task | Column): string | number {
    return 'id' in item ? item.id : index;
  }

  handleDrop(event: CdkDragDrop<Column>, labelId: string): void {
    if (event.previousContainer === event.container) {
      return;
    }
    transferArrayItem(
      event.previousContainer.data.items,
      event.container.data.items,
      event.previousIndex,
      event.currentIndex,
    );

    const task: Task = event.item.data;
    const newLabels: Array<string> = task.labels
      .filter(({ id }) => id !== event.previousContainer.data.label.id)
      .map(({ id }) => id);
    newLabels.push(labelId);

    this.tasksService
      .updateLabels(task.id, newLabels, [
        { query: GetBoard, variables: { parentId: this.board?.parentId } },
      ])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe();
  }
}
