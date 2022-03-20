import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';

import { Label, Task, TaskStatusEnum } from '../../../core/graphql/graphql';

@Component({
  selector: 'tb-tasks-list',
  templateUrl: './tasks-list.component.html',
  styles: [
    `
      .tb-tasks-list-item-title {
        & > .ant-list-item-meta-title {
          display: flex;
          justify-content: space-between;
        }

        & a:not(:hover) {
          color: unset;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TasksListComponent {
  get taskStatus(): typeof TaskStatusEnum {
    return TaskStatusEnum;
  }

  @Input() tbTasks!: ReadonlyArray<Task>;
  @Input() tbSkipTagClosed = false;

  trackByFn(_: number, item: Task | Label): string {
    return item.id;
  }
}
