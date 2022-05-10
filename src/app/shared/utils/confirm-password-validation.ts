import { AbstractControl, ValidationErrors } from '@angular/forms';

export function confirmPasswordValidation(
  control: AbstractControl,
): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (!password || !confirmPassword) {
    return null;
  }

  if (password.value !== confirmPassword.value) {
    confirmPassword.setErrors({ confirmPassword: true });
    return { confirmPassword: true };
  } else {
    confirmPassword.setErrors(null);
    return null;
  }
}
