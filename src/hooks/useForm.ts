import { useState, useCallback, useRef } from 'react';

// Định nghĩa rule cho từng trường form
interface ValidationRule {
  required?: boolean; // Trường bắt buộc
  minLength?: number; // Độ dài tối thiểu
  maxLength?: number; // Độ dài tối đa
  pattern?: RegExp;   // Regex kiểm tra định dạng
  custom?: (value: any) => string | null; // Hàm custom validate, trả về string nếu lỗi, null nếu hợp lệ
}

// Định nghĩa rules cho toàn bộ form
interface ValidationRules {
  [key: string]: ValidationRule;
}

// State tổng thể của form
interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isDirty: boolean;
}

// Kiểu trả về của useForm
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
 * Custom hook quản lý form với validation
 * @param initialValues - Giá trị khởi tạo của form
 * @param validationRules - Rule validate cho từng trường
 * @returns Các hàm và state quản lý form
 */
export const useForm = <T extends Record<string, any>>(
  initialValues: T,
  validationRules: ValidationRules = {}
): UseFormReturn<T> => {
  const [values, setValues] = useState<T>(initialValues); // State giá trị form
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({}); // State lỗi
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({}); // State đã chạm vào trường nào
  const initialValuesRef = useRef<T>(initialValues); // Lưu lại initialValues để reset

  // Kiểm tra form có thay đổi không (dirty)
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValuesRef.current);

  // Kiểm tra form có hợp lệ không (không có lỗi)
  const isValid = Object.keys(errors).length === 0;

  /**
   * Validate một trường cụ thể
   * @param field - Tên trường
   * @returns true nếu hợp lệ, false nếu có lỗi
   */
  const validateField = useCallback((field: keyof T): boolean => {
    const value = values[field];
    const rules = validationRules[field as string];
    
    if (!rules) return true;

    let error: string | null = null;

    // Kiểm tra required
    if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      error = 'This field is required';
    }
    // Kiểm tra minLength
    else if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
      error = `Minimum length is ${rules.minLength} characters`;
    }
    // Kiểm tra maxLength
    else if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
      error = `Maximum length is ${rules.maxLength} characters`;
    }
    // Kiểm tra pattern
    else if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
      error = 'Invalid format';
    }
    // Custom validate
    else if (rules.custom) {
      error = rules.custom(value);
    }

    setErrors(prev => ({
      ...prev,
      [field]: error || undefined,
    }));

    return !error;
  }, [values, validationRules]);

  /**
   * Validate toàn bộ form
   * @returns true nếu toàn bộ form hợp lệ
   */
  const validateForm = useCallback((): boolean => {
    const fieldsToValidate = Object.keys(validationRules) as (keyof T)[];
    const validationResults = fieldsToValidate.map(field => validateField(field));
    return validationResults.every(result => result);
  }, [validationRules, validateField]);

  /**
   * Set giá trị cho một trường
   * @param field - Tên trường
   * @param value - Giá trị mới
   */
  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    // Xoá lỗi khi user bắt đầu nhập lại
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  /**
   * Set nhiều giá trị cùng lúc
   * @param newValues - Object chứa các trường cần set
   */
  const setValuesHandler = useCallback((newValues: Partial<T>) => {
    setValues(prev => ({ ...prev, ...newValues }));
  }, []);

  /**
   * Set lỗi cho một trường
   * @param field - Tên trường
   * @param error - Thông báo lỗi
   */
  const setError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  /**
   * Set trạng thái touched cho một trường
   * @param field - Tên trường
   * @param touched - true/false
   */
  const setTouchedHandler = useCallback((field: keyof T, touched: boolean) => {
    setTouched(prev => ({ ...prev, [field]: touched }));
  }, []);

  /**
   * Reset form về giá trị khởi tạo
   */
  const reset = useCallback(() => {
    setValues(initialValuesRef.current);
    setErrors({});
    setTouched({});
  }, []);

  /**
   * Reset chỉ lỗi (giữ nguyên giá trị)
   */
  const resetErrors = useCallback(() => {
    setErrors({});
  }, []);

  /**
   * Hàm xử lý khi thay đổi giá trị trường (dùng cho onChange)
   * @param field - Tên trường
   * @returns Hàm nhận value mới
   */
  const handleChange = useCallback((field: keyof T) => (value: any) => {
    setValue(field, value);
  }, [setValue]);

  /**
   * Hàm xử lý khi blur khỏi trường (dùng cho onBlur)
   * @param field - Tên trường
   * @returns Hàm không tham số
   */
  const handleBlur = useCallback((field: keyof T) => () => {
    setTouchedHandler(field, true);
    validateField(field);
  }, [setTouchedHandler, validateField]);

  // Trả về các state và hàm quản lý form
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
 * Hook quản lý submit form (có trạng thái isSubmitting)
 * @param form - useForm return
 * @param onSubmit - Hàm xử lý submit
 */
export const useFormSubmit = <T extends Record<string, any>>(
  form: UseFormReturn<T>,
  onSubmit: (values: T) => Promise<void> | void
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Hàm submit form, tự validate trước khi gọi onSubmit
   * @returns true nếu submit thành công, false nếu lỗi
   */
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
 * Một số rule validate phổ biến dùng sẵn
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
  // Rule xác nhận password, truyền vào tên trường password để so sánh
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