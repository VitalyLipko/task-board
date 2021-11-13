import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { NzSizeLDSType } from 'ng-zorro-antd/core/types';

import { stringToColor } from '../../utils/string-to-color';

@Component({
  selector: 'tb-avatar',
  template: `
    <nz-avatar
      [nzText]="text"
      [nzSize]="tbSize"
      [style.backgroundColor]="backgroundColor"
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
  @Input() tbFullName!: string;
  @Input() tbSize: NzSizeLDSType | number = 'default';

  get text(): string {
    const [firstName, lastName] = this.tbFullName.split(' ');

    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  }

  get backgroundColor(): string {
    return stringToColor(this.tbFullName);
  }
}
