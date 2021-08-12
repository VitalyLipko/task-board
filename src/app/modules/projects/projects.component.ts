import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tb-projects',
  templateUrl: './projects.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent {}
