import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DeleteOutline, PlusOutline } from '@ant-design/icons-angular/icons';
import { TranslocoModule } from '@ngneat/transloco';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPipesModule } from 'ng-zorro-antd/pipes';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzUploadModule } from 'ng-zorro-antd/upload';

import { AvatarModule } from '../../shared/avatar/avatar.module';
import { PasswordInputModule } from '../../shared/password-input/password-input.module';

import { ChangePasswordModalComponent } from './change-password-modal/change-password-modal.component';
import { ProfileAvatarComponent } from './profile-avatar/profile-avatar.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { ProfileService } from './profile.service';

@NgModule({
  declarations: [
    ProfileComponent,
    ProfileAvatarComponent,
    ChangePasswordModalComponent,
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    NzCardModule,
    TranslocoModule,
    NzSpinModule,
    NzFormModule,
    NzUploadModule,
    ReactiveFormsModule,
    NzPipesModule,
    NzButtonModule,
    AvatarModule,
    NzIconModule.forChild([DeleteOutline, PlusOutline]),
    NzInputModule,
    NzTypographyModule,
    NzSpaceModule,
    NzModalModule,
    PasswordInputModule,
  ],
  providers: [ProfileService],
})
export class ProfileModule {}
