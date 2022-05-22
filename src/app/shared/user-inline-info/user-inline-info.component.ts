import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

import { User } from '../../core/graphql/graphql';

@Component({
  selector: 'tb-user-inline-info',
  templateUrl: './user-inline-info.component.html',
  styleUrls: ['./user-inline-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserInlineInfoComponent {
  @Input() tbUser!: User;

  get fullName(): string {
    const { trashed, profile } = this.tbUser;
    return trashed
      ? this.translocoService.translate('common.deleted_user', {
          user: profile.fullName,
        })
      : profile.fullName;
  }

  constructor(private translocoService: TranslocoService) {}
}
