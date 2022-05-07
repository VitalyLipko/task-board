import { FormGroup } from '@angular/forms';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';

export type FormType = 'create' | 'edit';
export abstract class FormAbstractClass {
  form!: FormGroup;
  initialValues: Record<string, unknown> = {};
  type: FormType = 'create';

  get hasChanges(): boolean {
    if (this.type === 'create') {
      return !isEmpty(this.form.value);
    }
    return !isEqual(this.form.value, this.initialValues);
  }

  get canSubmit(): boolean {
    if (this.type === 'create') {
      return this.form.valid || false;
    }
    return (this.hasChanges && this.form.valid) || false;
  }

  get changedValue(): Record<string, unknown> {
    return Object.entries(this.form.value).reduce((acc, [key, value]) => {
      if (!isEqual(value, this.initialValues[key])) {
        return { ...acc, [key]: value };
      }
      return acc;
    }, {});
  }
}
