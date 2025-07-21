import { useState, useCallback, useRef } from 'react';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

interface ValidationRules {
  [key: string]: ValidationRule;
}

interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isDirty: boolean;
}

interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isDirty: boolean;
  setValue: (field: keyof T, value: any) => void;
  setValues: (values: Partial<T>) => void;
  setError: (field: keyof T, error: string) => void;
  setTouched: (field: keyof T, touched: boolean) => void;
  validateField: (field: keyof T) => boolean;
  validateForm: () => boolean;
  reset: () => void;
  resetErrors: () => void;
  handleChange: (field: keyof T) => (value: any) => void;
  handleBlur: (field: keyof T) => () => void;
}

/**
 * Custom hook for form management with validation
 * @param initialValues - Initial form values
 * @param validationRules - Validation rules for each field
 * @returns Form state management functions
 */
export const useForm = <T extends Record<string, any>>(
  initialValues: T,
  validationRules: ValidationRules = {}
): UseFormReturn<T> => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const initialValuesRef = useRef<T>(initialValues);

  // Check if form is dirty (has changes)
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValuesRef.current);

  // Check if form is valid (no errors)
  const isValid = Object.keys(errors).length === 0;

  // Validate a single field
  const validateField = useCallback((field: keyof T): boolean => {
    const value = values[field];
    const rules = validationRules[field as string];
    
    if (!rules) return true;

    let error: string | null = null;

    // Required validation
    if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      error = 'This field is required';
    }
    // Min length validation
    else if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
      error = `Minimum length is ${rules.minLength} characters`;
    }
    // Max length validation
    else if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
      error = `Maximum length is ${rules.maxLength} characters`;
    }
    // Pattern validation
    else if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
      error = 'Invalid format';
    }
    // Custom validation
    else if (rules.custom) {
      error = rules.custom(value);
    }

    setErrors(prev => ({
      ...prev,
      [field]: error || undefined,
    }));

    return !error;
  }, [values, validationRules]);

  // Validate entire form
  const validateForm = useCallback((): boolean => {
    const fieldsToValidate = Object.keys(validationRules) as (keyof T)[];
    const validationResults = fieldsToValidate.map(field => validateField(field));
    return validationResults.every(result => result);
  }, [validationRules, validateField]);

  // Set a single field value
  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  // Set multiple field values
  const setValuesHandler = useCallback((newValues: Partial<T>) => {
    setValues(prev => ({ ...prev, ...newValues }));
  }, []);

  // Set field error
  const setError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  // Set field touched state
  const setTouchedHandler = useCallback((field: keyof T, touched: boolean) => {
    setTouched(prev => ({ ...prev, [field]: touched }));
  }, []);

  // Reset form to initial values
  const reset = useCallback(() => {
    setValues(initialValuesRef.current);
    setErrors({});
    setTouched({});
  }, []);

  // Reset only errors
  const resetErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Handle field change
  const handleChange = useCallback((field: keyof T) => (value: any) => {
    setValue(field, value);
  }, [setValue]);

  // Handle field blur
  const handleBlur = useCallback((field: keyof T) => () => {
    setTouchedHandler(field, true);
    validateField(field);
  }, [setTouchedHandler, validateField]);

  return {
    values,
    errors,
    touched,
    isValid,
    isDirty,
    setValue,
    setValues: setValuesHandler,
    setError,
    setTouched: setTouchedHandler,
    validateField,
    validateForm,
    reset,
    resetErrors,
    handleChange,
    handleBlur,
  };
};

/**
 * Hook for managing form submission
 */
export const useFormSubmit = <T extends Record<string, any>>(
  form: UseFormReturn<T>,
  onSubmit: (values: T) => Promise<void> | void
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!form.validateForm()) {
      return false;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(form.values);
      return true;
    } catch (error) {
      console.error('Form submission error:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [form, onSubmit]);

  return {
    isSubmitting,
    handleSubmit,
  };
};

/**
 * Predefined validation rules
 */
export const validationRules = {
  required: { required: true },
  email: { 
    required: true, 
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value: string) => {
      if (!value) return 'Email is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Please enter a valid email address';
      }
      return null;
    }
  },
  password: { 
    required: true, 
    minLength: 1,
    custom: (value: string) => {
      if (!value) return 'Password is required';
      if (value.length < 1) return 'Password must be at least 1 characters';
      return null;
    }
  },
  confirmPassword: (passwordField: string) => ({
    required: true,
    custom: (value: string, allValues?: any) => {
      if (!value) return 'Please confirm your password';
      if (allValues && value !== allValues[passwordField]) {
        return 'Passwords do not match';
      }
      return null;
    }
  }),
} as const; 