import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  UserOutline,
  ArrowLeftOutline,
  AppstoreOutline,
} from '@ant-design/icons-angular/icons';
import { TranslocoModule } from '@ngneat/transloco';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

import { AvatarModule } from '../../shared/avatar/avatar.module';

import { LayoutComponent } from './layout.component';

@NgModule({
  declarations: [LayoutComponent],
  imports: [
    CommonModule,
    NzLayoutModule,
    NzTypographyModule,
    NzGridModule,
    NzPageHeaderModule,
    NzButtonModule,
    NzIconModule.forChild([UserOutline, ArrowLeftOutline, AppstoreOutline]),
    NzDropDownModule,
    NzBreadCrumbModule,
    RouterModule,
    TranslocoModule,
    AvatarModule,
    NzMessageModule,
  ],
  exports: [LayoutComponent],
})
export class LayoutModule {}
