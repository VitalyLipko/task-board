import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { Label, Task } from '../../../core/graphql/graphql';

@Component({
  selector: 'tb-tasks-list',
  templateUrl: './tasks-list.component.html',
  styles: [
    `
      .tb-tasks-list-item-title {
        max-width: 100%;

        & > a:not(:hover) {
          color: unset;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksListComponent {
  @Input() tbTasks!: ReadonlyArray<Task>;

  trackByFn(_: number, item: Task | Label): string {
    return item.id;
  }
}
