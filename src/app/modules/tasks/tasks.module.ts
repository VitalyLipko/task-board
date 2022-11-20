import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  CheckOutline,
  BoldOutline,
  ItalicOutline,
  StrikethroughOutline,
} from '@ant-design/icons-angular/icons';
import { TranslocoModule } from '@ngneat/transloco';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzPipesModule } from 'ng-zorro-antd/pipes';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NgxTiptapModule } from 'ngx-tiptap';

import { AvatarModule } from '../../shared/avatar/avatar.module';
import { DropdownActionsModule } from '../../shared/dropdown-actions/dropdown-actions.module';
import { LabelModule } from '../../shared/label/label.module';
import { UserInlineInfoModule } from '../../shared/user-inline-info/user-inline-info.module';

import { AssigneesSelectComponent } from './assignees-select/assignees-select.component';
import { AssigneesComponent } from './assignees/assignees.component';
import { CommentComponent } from './comment/comment.component';
import { CommentsComponent } from './comments/comments.component';
import { DescriptionEditorToolbarComponent } from './description-editor-toolbar/description-editor-toolbar.component';
import { DescriptionComponent } from './description/description.component';
import { HistoryEntryIconPipe } from './history-entry-icon.pipe';
import { HistoryEntryComponent } from './history-entry/history-entry.component';
import { HistoryComponent } from './history/history.component';
import { LabelsSelectComponent } from './labels-select/labels-select.component';
import { TaskBoardComponent } from './task-board/task-board.component';
import { TaskCreationInfoComponent } from './task-creation-info/task-creation-info.component';
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
    DescriptionComponent,
    DescriptionEditorToolbarComponent,
    LabelsSelectComponent,
    TaskCreationInfoComponent,
    TaskBoardComponent,
    CommentsComponent,
    CommentComponent,
    HistoryComponent,
    HistoryEntryIconPipe,
    HistoryEntryComponent,
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
    NzIconModule.forChild([
      CheckOutline,
      BoldOutline,
      ItalicOutline,
      StrikethroughOutline,
    ]),
    NzTagModule,
    UserInlineInfoModule,
    NgxTiptapModule,
    NzToolTipModule,
    LabelModule,
    NzPipesModule,
    DragDropModule,
    TranslocoModule,
    NzTabsModule,
    NzCommentModule,
    NzCollapseModule,
    NzBadgeModule,
    NzRadioModule,
    NzTimelineModule,
  ],
  providers: [TasksService, DatePipe],
})
export class TasksModule {}
