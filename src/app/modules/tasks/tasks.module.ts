import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSwitchModule } from 'ng-zorro-antd/switch';

import { TaskModalComponent } from './task-modal/task-modal.component';
import { TasksListComponent } from './tasks-list/tasks-list.component';
import { TasksRoutingModule } from './tasks-routing.module';
import { TasksComponent } from './tasks.component';
import { TasksService } from './tasks.service';

@NgModule({
  declarations: [TasksComponent, TaskModalComponent, TasksListComponent],
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
  ],
  providers: [TasksService],
})
export class TasksModule {}
