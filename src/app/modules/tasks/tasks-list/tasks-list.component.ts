import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { Task } from '../../../core/graphql/graphql';

@Component({
  selector: 'tb-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksListComponent {
  @Input() tbTasks!: ReadonlyArray<Task>;

  trackByFn(_: number, item: Task): string {
    return item.id;
  }
}
