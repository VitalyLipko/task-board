import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MoreOutline } from '@ant-design/icons-angular/icons';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { DropdownActionsComponent } from './dropdown-actions.component';

@NgModule({
  declarations: [DropdownActionsComponent],
  imports: [
    CommonModule,
    NzButtonModule,
    NzDropDownModule,
    NzIconModule.forChild([MoreOutline]),
  ],
  exports: [DropdownActionsComponent],
})
export class DropdownActionsModule {}
