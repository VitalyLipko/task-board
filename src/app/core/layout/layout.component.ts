import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { User } from '../graphql/graphql';
import { AuthService } from '../services/auth.service';
import { BreadcrumbService } from '../services/breadcrumb.service';

import { LayoutService } from './layout.service';

@Component({
  selector: 'tb-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class LayoutComponent implements OnInit, OnDestroy {
  siderCollapsed = false;
  user: User | undefined;

  private unsubscribe = new Subject<void>();

  constructor(
    public layoutService: LayoutService,
    private authService: AuthService,
    private location: Location,
    public breadcrumbService: BreadcrumbService,
    private cdr: ChangeDetectorRef,
    private messageService: NzMessageService,
  ) {}

  ngOnInit(): void {
    this.layoutService
      .getCurrentUser()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (user) => {
          this.user = user;
          this.cdr.markForCheck();
        },
        error: (err) => this.messageService.error(err.message),
      });
  }

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
