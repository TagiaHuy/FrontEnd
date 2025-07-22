import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useLoading } from './useLoading';

// Định nghĩa kiểu trả về của API
interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

// Kiểu trả về của hook useApi
interface UseApiReturn<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  execute: (apiCall: () => Promise<T>) => Promise<ApiResponse<T>>;
  reset: () => void;
}

/**
 * Custom hook cho việc gọi API, quản lý trạng thái loading, error, data
 * @param showErrorAlert - Có hiển thị Alert khi lỗi không (mặc định: true)
 * @returns Các state và hàm quản lý API
 */
export const useApi = <T = any>(showErrorAlert: boolean = true): UseApiReturn<T> => {
  const [data, setData] = useState<T | null>(null); // State lưu data trả về từ API
  const [error, setError] = useState<string | null>(null); // State lưu error message
  const { isLoading, withLoading } = useLoading(); // State loading dùng chung

  /**
   * Hàm thực thi API call, tự động quản lý loading, error, data
   * @param apiCall - Hàm async trả về Promise<T>
   * @returns ApiResponse<T>
   */
  const execute = useCallback(async (apiCall: () => Promise<T>): Promise<ApiResponse<T>> => {
    try {
      setError(null); // Reset error trước khi gọi API
      const result = await withLoading(apiCall); // Gọi API và quản lý loading
      setData(result); // Lưu data trả về
      return { data: result, error: null, success: true };
    } catch (err) {
      // Xử lý lỗi
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);

      // Hiển thị Alert nếu được yêu cầu
      if (showErrorAlert) {
        Alert.alert('Error', errorMessage);
      }

      return { data: null, error: errorMessage, success: false };
    }
  }, [withLoading, showErrorAlert]);

  /**
   * Hàm reset lại state data và error
   */
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
 * Hook mở rộng useApi, cho phép retry khi gọi API thất bại
 * @param maxRetries - Số lần retry tối đa (mặc định: 3)
 * @param retryDelay - Thời gian chờ giữa các lần retry (ms, mặc định: 1000)
 */
export const useApiWithRetry = <T = any>(
  maxRetries: number = 3,
  retryDelay: number = 1000
) => {
  const [retryCount, setRetryCount] = useState(0); // Số lần đã retry
  const apiHook = useApi<T>(false); // Không hiện alert ở đây, tự xử lý

  /**
   * Hàm thực thi API call với retry, tự động retry khi lỗi
   * @param apiCall - Hàm async trả về Promise<T>
   * @param onError - Callback khi retry thất bại hết
   */
  const executeWithRetry = useCallback(async (
    apiCall: () => Promise<T>,
    onError?: (error: string, retryCount: number) => void
  ) => {
    let lastError: string | null = null;

    // Lặp để retry tối đa maxRetries lần
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        setRetryCount(attempt);
        const result = await apiHook.execute(apiCall);

        if (result.success) {
          return result; // Thành công thì trả về luôn
        }

        lastError = result.error;

        // Nếu chưa hết số lần retry thì chờ rồi thử lại
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

    // Nếu vẫn lỗi sau khi retry, gọi callback onError nếu có
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
 * Hook hỗ trợ optimistic update (cập nhật lạc quan)
 * Cho phép cập nhật UI trước khi API thành công, rollback nếu lỗi
 */
export const useOptimisticUpdate = <T = any>() => {
  const [optimisticData, setOptimisticData] = useState<T | null>(null); // State lưu data lạc quan
  const apiHook = useApi<T>(false); // Không hiện alert ở đây

  /**
   * Hàm thực thi optimistic update
   * @param apiCall - Hàm async gọi API
   * @param optimisticUpdate - Data lạc quan sẽ set ngay cho UI
   * @param rollbackOnError - Có rollback nếu lỗi không (mặc định: true)
   */
  const executeOptimistic = useCallback(async (
    apiCall: () => Promise<T>,
    optimisticUpdate: T,
    rollbackOnError: boolean = true
  ) => {
    // Set optimistic data ngay lập tức
    setOptimisticData(optimisticUpdate);

    try {
      const result = await apiHook.execute(apiCall);

      if (result.success) {
        setOptimisticData(null); // Xoá optimistic data nếu thành công
        return result;
      } else {
        if (rollbackOnError) {
          setOptimisticData(null); // Rollback nếu lỗi
        }
        return result;
      }
    } catch (err) {
      if (rollbackOnError) {
        setOptimisticData(null); // Rollback nếu lỗi
      }
      throw err;
    }
  }, [apiHook]);

  return {
    ...apiHook,
    optimisticData,
    executeOptimistic,
    clearOptimistic: () => setOptimisticData(null), // Hàm xoá optimistic data thủ công
  };
};