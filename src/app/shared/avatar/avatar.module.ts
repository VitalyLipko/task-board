import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

import { AvatarComponent } from './avatar/avatar.component';

@NgModule({
  declarations: [AvatarComponent],
  imports: [CommonModule, NzAvatarModule, NzToolTipModule],
  exports: [AvatarComponent],
})
export class AvatarModule {}
