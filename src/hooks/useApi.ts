import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useLoading } from './useLoading';

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

interface UseApiReturn<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  execute: (apiCall: () => Promise<T>) => Promise<ApiResponse<T>>;
  reset: () => void;
}

/**
 * Custom hook for managing API calls with error handling
 * @param showErrorAlert - Whether to show error alerts (default: true)
 * @returns API state management functions
 */
export const useApi = <T = any>(showErrorAlert: boolean = true): UseApiReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { isLoading, withLoading } = useLoading();

  const execute = useCallback(async (apiCall: () => Promise<T>): Promise<ApiResponse<T>> => {
    try {
      setError(null);
      const result = await withLoading(apiCall);
      setData(result);
      return { data: result, error: null, success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      
      if (showErrorAlert) {
        Alert.alert('Error', errorMessage);
      }
      
      return { data: null, error: errorMessage, success: false };
    }
  }, [withLoading, showErrorAlert]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return {
    data,
    error,
    isLoading,
    execute,
    reset,
  };
};

/**
 * Hook for managing API calls with retry functionality
 */
export const useApiWithRetry = <T = any>(
  maxRetries: number = 3,
  retryDelay: number = 1000
) => {
  const [retryCount, setRetryCount] = useState(0);
  const apiHook = useApi<T>(false);

  const executeWithRetry = useCallback(async (
    apiCall: () => Promise<T>,
    onError?: (error: string, retryCount: number) => void
  ) => {
    let lastError: string | null = null;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        setRetryCount(attempt);
        const result = await apiHook.execute(apiCall);
        
        if (result.success) {
          return result;
        }
        
        lastError = result.error;
        
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
        }
      } catch (err) {
        lastError = err instanceof Error ? err.message : 'An unexpected error occurred';
        
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
        }
      }
    }
    
    if (onError && lastError) {
      onError(lastError, retryCount);
    }
    
    return { data: null, error: lastError, success: false };
  }, [apiHook, maxRetries, retryDelay, retryCount]);

  return {
    ...apiHook,
    retryCount,
    executeWithRetry,
  };
};

/**
 * Hook for managing optimistic updates
 */
export const useOptimisticUpdate = <T = any>() => {
  const [optimisticData, setOptimisticData] = useState<T | null>(null);
  const apiHook = useApi<T>(false);

  const executeOptimistic = useCallback(async (
    apiCall: () => Promise<T>,
    optimisticUpdate: T,
    rollbackOnError: boolean = true
  ) => {
    // Set optimistic data immediately
    setOptimisticData(optimisticUpdate);
    
    try {
      const result = await apiHook.execute(apiCall);
      
      if (result.success) {
        setOptimisticData(null);
        return result;
      } else {
        if (rollbackOnError) {
          setOptimisticData(null);
        }
        return result;
      }
    } catch (err) {
      if (rollbackOnError) {
        setOptimisticData(null);
      }
      throw err;
    }
  }, [apiHook]);

  return {
    ...apiHook,
    optimisticData,
    executeOptimistic,
    clearOptimistic: () => setOptimisticData(null),
  };
}; 