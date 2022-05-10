import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';

import { PasswordInputComponent } from './password-input.component';

@NgModule({
  declarations: [PasswordInputComponent],
  imports: [NzInputModule, NzIconModule, FormsModule],
  exports: [PasswordInputComponent],
})
export class PasswordInputModule {}
