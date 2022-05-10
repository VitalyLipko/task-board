import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NzSizeLDSType } from 'ng-zorro-antd/core/types';

@Component({
  selector: 'tb-password-input',
  templateUrl: './password-input.component.html',
  styles: [
    `
      .tb-password-input-icon {
        cursor: pointer;
      }
    `,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordInputComponent),
      multi: true,
    },
  ],
})
export class PasswordInputComponent implements ControlValueAccessor {
  passwordVisible = false;
  value: string | undefined;

  private onChange!: (value: string) => void;
  private onTouched!: () => void;

  @Input() tbId!: string;
  @Input() tbPlaceholder!: string;
  @Input() tbPrefixIcon: string | undefined;
  @Input() tbSize: NzSizeLDSType = 'default';
  @Input() tbAutoComplete = 'off';

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  handleValueChange(value: string): void {
    this.value = value;
    this.onChange(this.value);
    this.onTouched();
  }

  handleVisibleChange(): void {
    this.passwordVisible = !this.passwordVisible;
  }
}
