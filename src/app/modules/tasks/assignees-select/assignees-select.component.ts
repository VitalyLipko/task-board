import {
  Component,
  ChangeDetectionStrategy,
  forwardRef,
  OnDestroy,
  ChangeDetectorRef,
  Input,
  OnInit,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { User } from '../../../core/graphql/graphql';
import GetAvailableUsers from '../graphql/get-available-users.query.graphql';

@Component({
  selector: 'tb-assignees-select',
  templateUrl: './assignees-select.component.html',
  styleUrls: ['./assignees-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AssigneesSelectComponent),
      multi: true,
    },
  ],
})
export class AssigneesSelectComponent
  implements ControlValueAccessor, OnInit, OnDestroy
{
  value: Array<User> = [];
  users: Array<User> | undefined;
  loading = false;

  private onChange!: (value: Array<User>) => void;
  private onTouched!: () => void;
  private unsubscribe = new Subject<void>();

  @Input() tbInline = false;

  constructor(private apollo: Apollo, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (this.tbInline) {
      this.handleOpenChange(true);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  writeValue(value: Array<User>): void {
    this.value = value;
    if (this.value && this.tbInline) {
      this.updateUsers(true);
    }
  }

  registerOnChange(fn: (value: Array<User>) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  handleValueChange(value: Array<User>): void {
    this.value = value;
    this.onChange(this.value);
    this.onTouched();
  }

  handleOpenChange(value: boolean): void {
    if (value) {
      this.getAvailableUsers()
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((res) => {
          this.users = res;
          if (this.tbInline) {
            this.updateUsers();
          }
          this.loading = false;
          this.cdr.markForCheck();
        });
    }
  }

  hasSelected(value: string): boolean {
    return !!this.value.find(({ id }) => id == value);
  }

  handleClick(value: User): void {
    if (!this.tbInline) {
      return;
    }
    const newValue = this.hasSelected(value.id)
      ? this.value.filter(({ id }) => id !== value.id)
      : [...this.value, value];
    this.handleValueChange(newValue);
  }

  trackByFn(_: number, item: User): string {
    return item.id;
  }

  private getAvailableUsers(): Observable<Array<User>> {
    return this.apollo
      .query<{ users: Array<User> }>({ query: GetAvailableUsers })
      .pipe(map(({ data }) => data.users));
  }

  private updateUsers(filter = false): void {
    this.value.forEach((user) => {
      if (this.users && !this.users.find(({ id }) => id === user.id)) {
        this.users = [...this.users, user];
      }
    });
    if (filter && this.users) {
      this.users = this.users.filter(({ trashed }) => !trashed);
    }
  }
}
