import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ApplicationComponent } from './application.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/login/login.module').then((m) => m.LoginModule),
    data: {
      loginPage: true,
    },
  },
  {
    path: '',
    component: ApplicationComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'projects',
        loadChildren: () =>
          import('./modules/projects/projects.module').then(
            (m) => m.ProjectsModule,
          ),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./modules/users/users.module').then((m) => m.UsersModule),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./modules/profile/profile.module').then(
            (m) => m.ProfileModule,
          ),
      },
      {
        path: '**',
        redirectTo: 'projects',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'projects',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
