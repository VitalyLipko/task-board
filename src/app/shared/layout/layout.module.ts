import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
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
  ],
  exports: [LayoutComponent],
  providers: [LayoutService],
})
export class LayoutModule {}
