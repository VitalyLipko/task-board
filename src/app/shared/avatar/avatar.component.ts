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
      [style.backgroundColor]="backgroundColor"
      nz-tooltip
      [nzTooltipTitle]="tbShowTooltip ? tbFullName : null"
    ></nz-avatar>
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {
  @HostBinding('style.cursor') get cursor(): string {
    return this.tbShowTooltip ? 'pointer' : 'default';
  }

  @Input() tbFullName!: string;
  @Input() tbSize: NzSizeLDSType | number = 'default';
  @Input() tbShowTooltip = true;

  get text(): string {
    return fullNameToInitials(this.tbFullName);
  }

  get backgroundColor(): string {
    return stringToColor(this.tbFullName);
  }
}
