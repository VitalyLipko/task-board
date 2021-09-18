import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { User } from '../../core/graphql/graphql';
import { LayoutService } from '../../core/layout/layout.service';

import { UsersService } from './users.service';

@Component({
  selector: 'tb-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent implements OnInit, OnDestroy {
  users: ReadonlyArray<User> = [];
  currentUser: User | undefined;

  private unsubscribe = new Subject<void>();

  constructor(
    private layoutService: LayoutService,
    private cdr: ChangeDetectorRef,
    private usersService: UsersService,
  ) {
    this.layoutService.title = 'Users';
    this.layoutService.pageHeaderExtra = null;
  }

  ngOnInit(): void {
    this.usersService
      .getUsersPageData()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(({ users, user }) => {
        this.users = users;
        this.currentUser = user;
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  trackByFn(_: number, item: User): string {
    return item.id;
  }
}
