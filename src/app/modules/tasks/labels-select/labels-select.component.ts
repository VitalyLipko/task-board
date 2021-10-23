import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  forwardRef,
  Input,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { Label } from '../../../core/graphql/graphql';
import { errorHandler } from '../../../core/operators';
import GetAvailableLabels from '../graphql/get-available-labels.query.graphql';

@Component({
  selector: 'tb-labels-select',
  templateUrl: './labels-select.component.html',
  styleUrls: ['./labels-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LabelsSelectComponent),
      multi: true,
    },
  ],
})
export class LabelsSelectComponent
  implements ControlValueAccessor, OnInit, OnDestroy
{
  value: Array<string> = [];
  labels: Array<Label> | undefined;
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
      this.getAvailableLabels()
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((res) => {
          this.labels = res;
          this.loading = false;
          this.cdr.markForCheck();
        });
    }
  }

  trackByFn(_: number, item: Label): string {
    return item.id;
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

  private getAvailableLabels(): Observable<Array<Label>> {
    return this.apollo
      .query<{ labels: Array<Label> }>({
        query: GetAvailableLabels,
      })
      .pipe(
        errorHandler(),
        map(({ data }) => data.labels),
      );
  }
}
