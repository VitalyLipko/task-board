import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';

import { AvatarComponent } from './avatar/avatar.component';

@NgModule({
  declarations: [AvatarComponent],
  imports: [CommonModule, NzAvatarModule],
  exports: [AvatarComponent],
})
export class AvatarModule {}
