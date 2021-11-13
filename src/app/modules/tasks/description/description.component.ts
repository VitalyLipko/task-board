import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  forwardRef,
  OnDestroy,
  Input,
  ViewEncapsulation,
  ChangeDetectorRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';

@Component({
  selector: 'tb-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DescriptionComponent),
      multi: true,
    },
  ],
})
export class DescriptionComponent
  implements ControlValueAccessor, OnInit, OnDestroy
{
  value: string | null = null;
  editor: Editor | undefined;

  private onChange!: (value: string | null) => void;
  private onTouched!: () => void;

  @Input() tbReadOnly = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (!this.tbReadOnly) {
      this.editor = new Editor({
        extensions: [StarterKit],
      });
    }
  }

  ngOnDestroy(): void {
    if (this.editor) {
      this.editor.destroy();
    }
  }

  writeValue(value: string | null): void {
    this.value = value;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  handleValueChange(value: string): void {
    this.value = this.editor && this.editor.getCharacterCount() ? value : null;
    this.onChange(this.value);
    this.onTouched();
  }
}
