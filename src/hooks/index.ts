// File index.ts này dùng để export tất cả các custom hook từ một entry point duy nhất
// Giúp import gọn hơn ở các nơi khác trong project
// Ví dụ: import { useLoading, useApi } from '@/hooks'

// Export tất cả các hook (export * để lấy cả type, interface nếu có)
export * from './useLoading';
export * from './useApi';
export * from './useForm';
export * from './usePagination';

// Re-export các hook phổ biến để import trực tiếp (giúp IDE suggest tốt hơn)
export { useLoading, useMultipleLoading } from './useLoading';
export { useApi, useApiWithRetry, useOptimisticUpdate } from './useApi';
export { useForm, useFormSubmit, validationRules } from './useForm';
export { usePagination, useInfinitePagination, useCursorPagination } from './usePagination';