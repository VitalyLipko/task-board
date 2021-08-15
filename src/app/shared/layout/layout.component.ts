import { Component, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuthService } from '../../core/services/auth.service';

import { LayoutService } from './layout.service';

@Component({
  selector: 'tb-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent implements OnDestroy {
  private unsubscribe = new Subject<void>();

  constructor(
    public layoutService: LayoutService,
    private authService: AuthService,
  ) {}

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  logout(): void {
    this.authService.logout().pipe(takeUntil(this.unsubscribe)).subscribe();
  }
}
