import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckOutline } from '@ant-design/icons-angular/icons';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

import { AvatarModule } from '../../shared/avatar/avatar.module';
import { DropdownActionsModule } from '../../shared/dropdown-actions/dropdown-actions.module';
import { UserInlineInfoModule } from '../../shared/user-inline-info/user-inline-info.module';

import { AssigneesSelectComponent } from './assignees-select/assignees-select.component';
import { AssigneesComponent } from './assignees/assignees.component';
import { TaskDrawerComponent } from './task-drawer/task-drawer.component';
import { TaskComponent } from './task/task.component';
import { TasksListComponent } from './tasks-list/tasks-list.component';
import { TasksRoutingModule } from './tasks-routing.module';
import { TasksComponent } from './tasks.component';
import { TasksService } from './tasks.service';

@NgModule({
  declarations: [
    TasksComponent,
    TasksListComponent,
    TaskComponent,
    TaskDrawerComponent,
    AssigneesSelectComponent,
    AssigneesComponent,
  ],
  imports: [
    CommonModule,
    TasksRoutingModule,
    NzButtonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzMessageModule,
    NzSwitchModule,
    FormsModule,
    NzSpinModule,
    NzEmptyModule,
    NzListModule,
    NzCardModule,
    NzAvatarModule,
    NzDrawerModule,
    DropdownActionsModule,
    NzSelectModule,
    NzTypographyModule,
    AvatarModule,
    NzDropDownModule,
    NzIconModule.forRoot([CheckOutline]),
    NzTagModule,
    UserInlineInfoModule,
  ],
  providers: [TasksService],
})
export class TasksModule {}
