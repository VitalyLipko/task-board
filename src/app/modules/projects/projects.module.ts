import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { InboxOutline, DeleteOutline } from '@ant-design/icons-angular/icons';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPipesModule } from 'ng-zorro-antd/pipes';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzUploadModule } from 'ng-zorro-antd/upload';

import { ProjectCardComponent } from './project-card/project-card.component';
import { ProjectIconComponent } from './project-icon/project-icon.component';
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
    ProjectIconComponent,
  ],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
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
    NzUploadModule,
    NzIconModule.forChild([InboxOutline, DeleteOutline]),
    NzPipesModule,
    NzTypographyModule,
    NzToolTipModule,
  ],
  providers: [ProjectsService],
})
export class ProjectsModule {}
