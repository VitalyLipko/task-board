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

interface AssigneesOption {
  label: string;
  value: string;
  description: string;
}

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
  value: Array<string> = [];
  options: Array<AssigneesOption> | undefined;
  loading = false;

  private onChange!: (value: Array<string>) => void;
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

  writeValue(value: Array<string>): void {
    this.value = value;
  }

  registerOnChange(fn: (value: Array<string>) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  handleValueChange(value: Array<string>): void {
    this.value = value;
    this.onChange(this.value);
    this.onTouched();
  }

  handleOpenChange(value: boolean): void {
    if (value) {
      this.getAvailableUsers()
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((res) => {
          this.options = res.map((user) => ({
            label: user.fullName,
            value: user.id,
            description: user.username,
          }));
          this.loading = false;
          this.cdr.markForCheck();
        });
    }
  }

  hasSelected(value: string): boolean {
    return this.value.includes(value);
  }

  handleClick(value: string): void {
    if (!this.tbInline) {
      return;
    }

    this.handleValueChange(
      this.hasSelected(value)
        ? this.value.filter((item) => item !== value)
        : [...this.value, value],
    );
  }

  trackByFn(_: number, item: AssigneesOption): string {
    return item.value;
  }

  private getAvailableUsers(): Observable<Array<User>> {
    return this.apollo
      .query<{ users: Array<User> }>({ query: GetAvailableUsers })
      .pipe(map(({ data }) => data.users));
  }
}
