export function validateEmail(email: string): string | undefined {
  if (!email) return 'Email is required';
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    return 'Invalid email address';
  }
}

export function validatePassword(password: string): string | undefined {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
}

export function validateRequired(value: string, fieldName = 'This field'): string | undefined {
  if (!value || !value.trim()) return `${fieldName} is required`;
}

export function validateMinLength(
  value: string,
  min: number,
  fieldName = 'This field'
): string | undefined {
  if (value == null) return undefined;
  if (value.length < min) return `${fieldName} must be at least ${min} characters`;
}

export function validateMaxLength(
  value: string,
  max: number,
  fieldName = 'This field'
): string | undefined {
  if (value == null) return undefined;
  if (value.length > max) return `${fieldName} must be at most ${max} characters`;
}
