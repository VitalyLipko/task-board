import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import cloneDeep from 'lodash/cloneDeep';
import { Observable, Subject } from 'rxjs';
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
  board$: Observable<Board> | undefined;

  private unsubscribe = new Subject<void>();

  constructor(
    private tasksService: TasksService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.board$ = this.route.paramMap.pipe(
      switchMap((paramMap) =>
        this.tasksService.getBoard(paramMap.get('projectId') as string),
      ),
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  trackByFn(index: number, item: Label | Task | Column): string | number {
    return 'id' in item ? item.id : index;
  }

  handleDrop(
    evt: CdkDragDrop<Column>,
    labelId: string,
    parentId: string,
  ): void {
    const { previousContainer, container, item, previousIndex, currentIndex } =
      cloneDeep(evt);
    if (previousContainer === container) {
      return;
    }
    transferArrayItem(
      previousContainer.data.items,
      container.data.items,
      previousIndex,
      currentIndex,
    );

    const task: Task = item.data;
    const newLabels: Array<string> = task.labels
      .filter(({ id }) => id !== previousContainer.data.label.id)
      .map(({ id }) => id);
    newLabels.push(labelId);

    this.tasksService
      .updateLabels(task.id, newLabels, [
        { query: GetBoard, variables: { parentId } },
      ])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe();
  }
}
