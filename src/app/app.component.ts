import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tb-root',
  template: `
    <router-outlet></router-outlet>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
