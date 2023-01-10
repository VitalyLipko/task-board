import { FormControl, FormGroup } from '@angular/forms';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';

export type FormType = 'create' | 'edit';
export type ControlsType<T> = {
  [K in keyof T]: FormControl<T[K]>;
};

export abstract class FormAbstractClass<T extends Record<string, unknown>> {
  form!: FormGroup<ControlsType<T>>;
  initialValues: Partial<T> = {};
  type: FormType = 'create';

  get hasChanges(): boolean {
    if (this.type === 'create') {
      return !isEmpty(this.form.value);
    }
    return !isEqual(this.form?.value, this.initialValues);
  }

  get canSubmit(): boolean {
    if (this.type === 'create') {
      return this.form?.valid;
    }
    return this.hasChanges && this.form?.valid;
  }

  get changedValue(): Partial<T> {
    return Object.entries(this.form.value).reduce((acc, [key, value]) => {
      if (!isEqual(value, this.initialValues[key])) {
        return { ...acc, [key]: value };
      }
      return acc;
    }, {});
  }
}
