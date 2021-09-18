import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'tb-application',
  template: `
    <tb-layout>
      <router-outlet></router-outlet>
    </tb-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationComponent {}
