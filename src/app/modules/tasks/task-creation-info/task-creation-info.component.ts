import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { Task } from '../../../core/graphql/graphql';

@Component({
  selector: 'tb-task-creation-info',
  template: `
    <ng-container *transloco="let t">
      <span nz-typography class="tb-task-creation-info">
        {{ t('task.created_by', { date: tbTask.created | date }) }}
      </span>
      <tb-user-inline-info [tbUser]="tbTask.creator"></tb-user-inline-info>
    </ng-container>
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
