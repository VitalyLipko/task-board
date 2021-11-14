import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { Task } from '../../../core/graphql/graphql';

@Component({
  selector: 'tb-task-creation-info',
  template: `
    <span nz-typography class="tb-task-creation-info">
      Created {{ tbTask.created | date }} by
    </span>
    <tb-user-inline-info [tbUser]="tbTask.creator"></tb-user-inline-info>
  `,
  styles: [
    `
      @use 'variables' as *;

      :host {
        margin-right: $indent-xs;
      }

      .tb-task-creation-info {
        font-weight: normal;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCreationInfoComponent {
  @Input() tbTask!: Task;
}
