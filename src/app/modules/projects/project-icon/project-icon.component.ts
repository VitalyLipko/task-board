import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NzUploadFile } from 'ng-zorro-antd/upload';

import { File } from '../../../core/graphql/graphql';

@Component({
  selector: 'tb-project-icon',
  templateUrl: './project-icon.component.html',
  styleUrls: ['./project-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProjectIconComponent),
      multi: true,
    },
  ],
})
export class ProjectIconComponent implements ControlValueAccessor {
  value: File | NzUploadFile | null = null;
  imageUrl: string | null = null;

  private onChange!: (value: NzUploadFile | null) => void;
  private onTouched!: () => void;

  constructor(private cdr: ChangeDetectorRef) {}

  writeValue(value: File | null): void {
    this.value = value;
    this.imageUrl = value?.url || null;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: NzUploadFile | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  handleValueChange(file: NzUploadFile | null): boolean {
    this.value = file;
    if (this.imageUrl) {
      URL.revokeObjectURL(this.imageUrl);
    }
    this.imageUrl = this.value ? URL.createObjectURL(this.value) : null;

    this.onChange(this.value);
    this.onTouched();
    return false;
  }

  handleDelete(event: MouseEvent): void {
    event.preventDefault();
    this.handleValueChange(null);
  }
}
