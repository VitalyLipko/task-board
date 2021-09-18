import { Location } from '@angular/common';
import { Component, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import { BreadcrumbService } from '../services/breadcrumb.service';

import { LayoutService } from './layout.service';

@Component({
  selector: 'tb-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent implements OnDestroy {
  siderCollapsed = false;

  private unsubscribe = new Subject<void>();

  constructor(
    public layoutService: LayoutService,
    private authService: AuthService,
    private location: Location,
    public breadcrumbService: BreadcrumbService,
  ) {}

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  logout(): void {
    this.authService.logout().pipe(takeUntil(this.unsubscribe)).subscribe();
  }

  onBack(): void {
    this.location.back();
  }
}
