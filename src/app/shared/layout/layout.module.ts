import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UserOutline } from '@ant-design/icons-angular/icons';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

import { LayoutComponent } from './layout.component';
import { LayoutService } from './layout.service';

@NgModule({
  declarations: [LayoutComponent],
  imports: [
    CommonModule,
    NzLayoutModule,
    NzTypographyModule,
    NzGridModule,
    NzPageHeaderModule,
    NzButtonModule,
    NzAvatarModule,
    NzIconModule.forChild([UserOutline]),
    NzDropDownModule,
  ],
  exports: [LayoutComponent],
  providers: [LayoutService],
})
export class LayoutModule {}
