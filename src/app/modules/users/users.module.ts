import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

import { LayoutModule } from '../../core/layout/layout.module';
import { DropdownActionsModule } from '../../shared/dropdown-actions/dropdown-actions.module';
import { PasswordInputModule } from '../../shared/password-input/password-input.module';

import { UserModalComponent } from './user-modal/user-modal.component';
import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { UsersService } from './users.service';

@NgModule({
  declarations: [UsersComponent, UserModalComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    LayoutModule,
    NzTableModule,
    NzTypographyModule,
    DropdownActionsModule,
    NzButtonModule,
    ReactiveFormsModule,
    NzModalModule,
    NzMessageModule,
    NzFormModule,
    NzSpinModule,
    NzInputModule,
    TranslocoModule,
    PasswordInputModule,
  ],
  providers: [UsersService],
})
export class UsersModule {}
