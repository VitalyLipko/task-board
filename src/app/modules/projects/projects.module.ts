import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { LayoutModule } from '../../shared/layout/layout.module';

import { ProjectCardComponent } from './project-card/project-card.component';
import { ProjectModalComponent } from './project-modal/project-modal.component';
import { ProjectsListComponent } from './projects-list/projects-list.component';
import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './projects.component';
import { ProjectsService } from './projects.service';

@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectCardComponent,
    ProjectsListComponent,
    ProjectModalComponent,
  ],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    LayoutModule,
    NzSpinModule,
    NzCardModule,
    NzEmptyModule,
    NzButtonModule,
    NzModalModule,
    NzMessageModule,
    NzGridModule,
    ReactiveFormsModule,
    NzInputModule,
    NzFormModule,
  ],
  providers: [ProjectsService],
})
export class ProjectsModule {}
