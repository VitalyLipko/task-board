import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

import { LabelComponent } from './label.component';

@NgModule({
  declarations: [LabelComponent],
  imports: [NzTagModule, CommonModule, NzTypographyModule],
  exports: [LabelComponent],
})
export class LabelModule {}
