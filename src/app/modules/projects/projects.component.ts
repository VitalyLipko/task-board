import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tb-projects',
  template: `
    <router-outlet></router-outlet>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent {}
