import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';

import { User } from '../../../core/graphql/graphql';

@Component({
  selector: 'tb-assignees',
  template: `
    <div *ngIf="tbAssignees.length; else emptyTemplate">
      <tb-avatar
        *ngFor="let assignee of tbAssignees; trackBy: trackByFn"
        [tbFullName]="assignee.fullName"
        class="tb-assignees-avatar"
      ></tb-avatar>
    </div>
    <ng-template #emptyTemplate>No assignees</ng-template>
  `,
  styles: [
    `
      @use 'variables' as *;

      tb-avatar.tb-assignees-avatar {
        .ant-avatar {
          box-shadow: 0 0 0 2px white;
        }

        &:not(:last-of-type) {
          margin-right: -1 * $indent-xs;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AssigneesComponent {
  @Input() tbAssignees!: Array<User>;

  trackByFn(_: number, item: User): string {
    return item.id;
  }
}
