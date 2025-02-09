import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  
  if (!value) {
    return null;
  }

  const hasUpperCase = /[A-Z]+/.test(value);
  const hasLowerCase = /[a-z]+/.test(value);
  const hasNumeric = /[0-9]+/.test(value);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]+/.test(value);

  const valid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;

  return !valid ? {
    passwordStrength: {
      hasUpperCase,
      hasLowerCase,
      hasNumeric,
      hasSpecialChar
    }
  } : null;
} 