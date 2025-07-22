import { useState, useCallback } from 'react';

// Interface định nghĩa các hàm và state trả về từ useLoading
interface UseLoadingReturn {
  isLoading: boolean; // Trạng thái loading hiện tại
  setIsLoading: (loading: boolean) => void; // Set trạng thái loading thủ công
  startLoading: () => void; // Bắt đầu loading (set true)
  stopLoading: () => void; // Kết thúc loading (set false)
  withLoading: <T>(asyncFn: () => Promise<T>) => Promise<T>; // Thực thi async function và tự động quản lý loading
}

/**
 * Custom hook quản lý trạng thái loading (đơn giản)
 * @param initialLoading - Trạng thái loading khởi tạo (mặc định: false)
 * @returns Các hàm quản lý loading
 */
export const useLoading = (initialLoading: boolean = false): UseLoadingReturn => {
  const [isLoading, setIsLoading] = useState(initialLoading); // State loading

  // Hàm bắt đầu loading
  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  // Hàm kết thúc loading
  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  /**
   * Hàm thực thi async function và tự động quản lý loading
   * @param asyncFn - Hàm async trả về Promise<T>
   * @returns Kết quả trả về của asyncFn
   */
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
 * Custom hook quản lý nhiều trạng thái loading theo key (ví dụ: loading cho từng API riêng biệt)
 * @param keys - Mảng các key cần quản lý loading
 * @returns Các hàm và state quản lý loading cho từng key
 */
export const useMultipleLoading = (keys: string[]) => {
  // State lưu trạng thái loading cho từng key
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    keys.reduce((acc, key) => ({ ...acc, [key]: false }), {})
  );

  /**
   * Set trạng thái loading cho một key cụ thể
   * @param key - Tên key
   * @param loading - true/false
   */
  const setLoading = useCallback((key: string, loading: boolean) => {
    setLoadingStates(prev => ({ ...prev, [key]: loading }));
  }, []);

  /**
   * Bắt đầu loading cho một key
   * @param key - Tên key
   */
  const startLoading = useCallback((key: string) => {
    setLoading(key, true);
  }, [setLoading]);

  /**
   * Kết thúc loading cho một key
   * @param key - Tên key
   */
  const stopLoading = useCallback((key: string) => {
    setLoading(key, false);
  }, [setLoading]);

  /**
   * Thực thi async function và tự động quản lý loading cho một key
   * @param key - Tên key
   * @param asyncFn - Hàm async trả về Promise<T>
   * @returns Kết quả trả về của asyncFn
   */
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

  // true nếu có bất kỳ key nào đang loading
  const isAnyLoading = Object.values(loadingStates).some(Boolean);

  /**
   * Kiểm tra trạng thái loading của một key
   * @param key - Tên key
   * @returns true nếu key đó đang loading
   */
  const isLoading = (key: string) => loadingStates[key] || false;

  return {
    loadingStates, // Object trạng thái loading cho từng key
    setLoading,    // Set trạng thái loading cho key
    startLoading,  // Bắt đầu loading cho key
    stopLoading,   // Kết thúc loading cho key
    withLoading,   // Thực thi async function với loading cho key
    isAnyLoading,  // Có bất kỳ key nào đang loading không
    isLoading,     // Kiểm tra loading của một key
  };
}; 