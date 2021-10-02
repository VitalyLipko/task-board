import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { NzSizeLDSType } from 'ng-zorro-antd/core/types';

@Component({
  selector: 'tb-avatar',
  template: `
    <nz-avatar [nzText]="text" [ngStyle]="style" [nzSize]="tbSize"></nz-avatar>
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

  get style(): Record<string, string> {
    let hash = 0;
    for (let i = 0; i < this.tbFullName.length; i++) {
      hash = this.tbFullName.charCodeAt(i) + ((hash << 5) - hash);
    }

    return { 'background-color': `hsl(${hash % 360}, 40%, 80%)` };
  }
}
