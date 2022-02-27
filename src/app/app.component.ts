import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tb-root',
  template: `
    <router-outlet></router-outlet>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnDestroy {
  private readonly defaultLang = 'en';
  private unsubscribe = new Subject<void>();

  constructor(private translocoService: TranslocoService) {
    this.translocoService
      .load(this.defaultLang)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
