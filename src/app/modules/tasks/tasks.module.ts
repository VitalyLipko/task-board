import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MoreOutline } from '@ant-design/icons-angular/icons';
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
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSwitchModule } from 'ng-zorro-antd/switch';

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
    NzIconModule.forChild([MoreOutline]),
    NzDropDownModule,
    NzDrawerModule,
  ],
  providers: [TasksService],
})
export class TasksModule {}
