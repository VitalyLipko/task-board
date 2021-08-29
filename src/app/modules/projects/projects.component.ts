import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tb-projects',
  template: `
    <tb-layout>
      <router-outlet></router-outlet>
    </tb-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent {}
