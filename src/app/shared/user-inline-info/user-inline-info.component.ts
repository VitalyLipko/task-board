import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { User } from '../../core/graphql/graphql';

@Component({
  selector: 'tb-user-inline-info',
  templateUrl: './user-inline-info.component.html',
  styleUrls: ['./user-inline-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserInlineInfoComponent {
  @Input() tbUser!: User;
}
