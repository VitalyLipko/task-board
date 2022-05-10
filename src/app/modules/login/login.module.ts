import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { UserOutline } from '@ant-design/icons-angular/icons';
import { TranslocoModule } from '@ngneat/transloco';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

import { PasswordInputModule } from '../../shared/password-input/password-input.module';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoginRoutingModule,
    NzCardModule,
    NzFormModule,
    NzInputModule,
    NzIconModule.forChild([UserOutline]),
    NzGridModule,
    NzButtonModule,
    NzMessageModule,
    NzTypographyModule,
    TranslocoModule,
    PasswordInputModule,
  ],
})
export class LoginModule {}
