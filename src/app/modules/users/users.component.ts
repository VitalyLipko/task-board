import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
  ViewChild,
  TemplateRef,
  AfterViewInit,
} from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { User } from '../../core/graphql/graphql';
import { LayoutService } from '../../core/layout/layout.service';
import { DropdownAction } from '../../shared/dropdown-actions/dropdown-action.interface';

import { UsersService } from './users.service';

@Component({
  selector: 'tb-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent implements OnInit, OnDestroy, AfterViewInit {
  users: ReadonlyArray<User> = [];
  currentUser: User | undefined;
  dropdownActions: Array<DropdownAction<User>> = [
    {
      name: 'edit',
      label: 'Edit',
      action: this.handleEdit.bind(this),
    },
    {
      name: 'delete',
      label: 'Delete',
      action: this.handleDelete.bind(this),
      danger: true,
      hide: this.hideActionHandler.bind(this),
    },
  ];

  private unsubscribe = new Subject<void>();

  @ViewChild('createButtonTemplate')
  private createButtonTemplate!: TemplateRef<void>;

  constructor(
    private layoutService: LayoutService,
    private cdr: ChangeDetectorRef,
    private usersService: UsersService,
    private messageService: NzMessageService,
  ) {}

  ngOnInit(): void {
    this.usersService
      .getUsersPageData()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        ({ users, user }) => {
          this.users = users;
          this.currentUser = user;
          this.cdr.markForCheck();
        },
        (err) => this.messageService.error(err.message),
      );
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngAfterViewInit(): void {
    this.layoutService.title = 'Users';
    this.layoutService.pageHeaderExtra = this.createButtonTemplate;
  }

  trackByFn(_: number, item: User): string {
    return item.id;
  }

  handleCreate(): void {
    this.usersService
      .create()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({ error: (err) => this.messageService.error(err.message) });
  }

  handleEdit(user: User | undefined): void {
    if (user) {
      this.usersService
        .edit(user.id)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe({ error: (err) => this.messageService.error(err.message) });
    }
  }

  handleDelete(user: User | undefined): void {
    if (user) {
      this.usersService
        .delete(user)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe({ error: (err) => this.messageService.error(err.message) });
    }
  }

  hideActionHandler(user: User | undefined): boolean {
    return user?.id === this.currentUser?.id;
  }
}
