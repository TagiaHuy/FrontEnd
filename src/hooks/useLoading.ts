import { useState, useCallback } from 'react';

interface UseLoadingReturn {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  startLoading: () => void;
  stopLoading: () => void;
  withLoading: <T>(asyncFn: () => Promise<T>) => Promise<T>;
}

/**
 * Custom hook for managing loading states
 * @param initialLoading - Initial loading state (default: false)
 * @returns Loading state management functions
 */
export const useLoading = (initialLoading: boolean = false): UseLoadingReturn => {
  const [isLoading, setIsLoading] = useState(initialLoading);

  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const withLoading = useCallback(async <T>(asyncFn: () => Promise<T>): Promise<T> => {
    try {
      startLoading();
      const result = await asyncFn();
      return result;
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  return {
    isLoading,
    setIsLoading,
    startLoading,
    stopLoading,
    withLoading,
  };
};

/**
 * Hook for managing multiple loading states
 */
export const useMultipleLoading = (keys: string[]) => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    keys.reduce((acc, key) => ({ ...acc, [key]: false }), {})
  );

  const setLoading = useCallback((key: string, loading: boolean) => {
    setLoadingStates(prev => ({ ...prev, [key]: loading }));
  }, []);

  const startLoading = useCallback((key: string) => {
    setLoading(key, true);
  }, [setLoading]);

  const stopLoading = useCallback((key: string) => {
    setLoading(key, false);
  }, [setLoading]);

  const withLoading = useCallback(async <T>(
    key: string, 
    asyncFn: () => Promise<T>
  ): Promise<T> => {
    try {
      startLoading(key);
      const result = await asyncFn();
      return result;
    } finally {
      stopLoading(key);
    }
  }, [startLoading, stopLoading]);

  const isAnyLoading = Object.values(loadingStates).some(Boolean);
  const isLoading = (key: string) => loadingStates[key] || false;

  return {
    loadingStates,
    setLoading,
    startLoading,
    stopLoading,
    withLoading,
    isAnyLoading,
    isLoading,
  };
}; 