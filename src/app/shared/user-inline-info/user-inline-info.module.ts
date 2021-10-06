import { NgModule } from '@angular/core';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

import { AvatarModule } from '../avatar/avatar.module';

import { UserInlineInfoComponent } from './user-inline-info.component';

@NgModule({
  declarations: [UserInlineInfoComponent],
  imports: [NzTypographyModule, NzPopoverModule, AvatarModule, NzGridModule],
  exports: [UserInlineInfoComponent],
})
export class UserInlineInfoModule {}
