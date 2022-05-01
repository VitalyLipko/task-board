import { ChangeDetectorRef, Injector } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { NzUploadFile } from 'ng-zorro-antd/upload';

import { File } from '../../core/graphql/graphql';

export abstract class UploadAbstractClass implements ControlValueAccessor {
  value: File | NzUploadFile | null = null;
  imageUrl: string | null = null;

  protected onChange!: (value: NzUploadFile | null) => void;
  protected onTouched!: () => void;

  private readonly cdr = this.injector.get(ChangeDetectorRef);

  protected constructor(protected injector: Injector) {}

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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.imageUrl = this.value ? URL.createObjectURL(this.value) : null;

    this.onChange(this.value);
    this.onTouched();
    return false;
  }

  handleDelete(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.handleValueChange(null);
  }
}
