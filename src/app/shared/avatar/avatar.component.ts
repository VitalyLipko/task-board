import {
  Component,
  ChangeDetectionStrategy,
  Input,
  HostBinding,
} from '@angular/core';
import { NzSizeLDSType } from 'ng-zorro-antd/core/types';

import { fullNameToInitials } from '../utils/fullname-to-initials';
import { stringToColor } from '../utils/string-to-color';

@Component({
  selector: 'tb-avatar',
  template: `
    <nz-avatar
      [nzText]="text"
      [nzSize]="tbSize"
      [nzSrc]="tbUrl ? $any(tbUrl | nzSanitizer: 'url') : null"
      [style.backgroundColor]="backgroundColor"
      [style.fontSize]="fontSize"
      nz-tooltip
      [nzTooltipTitle]="tbFullName"
      [nzTooltipTrigger]="tbShowTooltip ? 'hover' : null"
    ></nz-avatar>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {
  @HostBinding('style.cursor') get cursor(): string {
    return this.tbShowTooltip || this.tbClickable ? 'pointer' : 'default';
  }

  @Input() tbFullName!: string;
  @Input() tbSize: NzSizeLDSType | number = 'default';
  @Input() tbShowTooltip = true;
  @Input() tbClickable = false;
  @Input() tbUrl: string | undefined;

  get text(): string {
    return fullNameToInitials(this.tbFullName);
  }

  get backgroundColor(): string {
    return stringToColor(this.tbFullName);
  }

  get fontSize(): string | null {
    return typeof this.tbSize === 'number'
      ? `${Math.floor(this.tbSize / 3)}px`
      : null;
  }
}
