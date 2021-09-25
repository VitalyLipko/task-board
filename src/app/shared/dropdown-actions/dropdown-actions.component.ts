import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { DropdownAction } from './dropdown-action.interface';

@Component({
  selector: 'tb-dropdown-actions',
  templateUrl: './dropdown-actions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownActionsComponent<T = unknown> {
  @Input() tbActions!: Array<DropdownAction<T>>;
  @Input() tbContext: T | undefined;
}
