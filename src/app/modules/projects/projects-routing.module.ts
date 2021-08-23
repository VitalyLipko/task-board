import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProjectsListComponent } from './projects-list/projects-list.component';
import { ProjectsComponent } from './projects.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectsComponent,
    children: [
      {
        path: '',
        component: ProjectsListComponent,
      },
      {
        path: ':projectId',
        children: [
          {
            path: 'tasks',
            loadChildren: () =>
              import('../tasks/tasks.module').then((m) => m.TasksModule),
          },
          {
            path: '**',
            redirectTo: 'tasks',
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectsRoutingModule {}
