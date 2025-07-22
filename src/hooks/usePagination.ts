import { useState, useCallback, useMemo } from 'react';

// Định nghĩa state cho phân trang cơ bản
interface PaginationState {
  currentPage: number;      // Trang hiện tại
  pageSize: number;         // Số item/trang
  totalItems: number;       // Tổng số item
  totalPages: number;       // Tổng số trang
  hasNextPage: boolean;     // Có trang tiếp theo không
  hasPrevPage: boolean;     // Có trang trước không
}

// Kiểu trả về của hook usePagination
interface UsePaginationReturn extends PaginationState {
  goToPage: (page: number) => void;         // Chuyển đến trang bất kỳ
  nextPage: () => void;                     // Trang tiếp theo
  prevPage: () => void;                     // Trang trước
  goToFirstPage: () => void;                // Trang đầu tiên
  goToLastPage: () => void;                 // Trang cuối cùng
  setPageSize: (size: number) => void;      // Đổi page size
  setTotalItems: (total: number) => void;   // Đặt lại tổng số item
  reset: () => void;                        // Reset về trạng thái ban đầu
  getPageInfo: () => {                      // Lấy thông tin index của trang hiện tại
    startIndex: number;
    endIndex: number;
    itemsOnCurrentPage: number;
  };
}

/**
 * Custom hook quản lý phân trang cơ bản (page-based)
 * @param initialPage - Trang bắt đầu (default: 1)
 * @param initialPageSize - Số item/trang (default: 10)
 * @param initialTotalItems - Tổng số item ban đầu (default: 0)
 * @returns Các state và hàm điều khiển phân trang
 */
export const usePagination = (
  initialPage: number = 1,
  initialPageSize: number = 10,
  initialTotalItems: number = 0
): UsePaginationReturn => {
  const [currentPage, setCurrentPage] = useState(initialPage);           // State trang hiện tại
  const [pageSize, setPageSize] = useState(initialPageSize);             // State page size
  const [totalItems, setTotalItems] = useState(initialTotalItems);       // State tổng số item

  // Tính tổng số trang dựa vào tổng item và page size
  const totalPages = useMemo(() => Math.ceil(totalItems / pageSize), [totalItems, pageSize]);
  // Có trang tiếp theo không
  const hasNextPage = useMemo(() => currentPage < totalPages, [currentPage, totalPages]);
  // Có trang trước không
  const hasPrevPage = useMemo(() => currentPage > 1, [currentPage]);

  // Chuyển đến trang bất kỳ (nếu hợp lệ)
  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  // Chuyển đến trang tiếp theo
  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  }, [hasNextPage]);

  // Chuyển đến trang trước
  const prevPage = useCallback(() => {
    if (hasPrevPage) {
      setCurrentPage(prev => prev - 1);
    }
  }, [hasPrevPage]);

  // Về trang đầu tiên
  const goToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  // Về trang cuối cùng
  const goToLastPage = useCallback(() => {
    setCurrentPage(totalPages);
  }, [totalPages]);

  // Đổi page size và reset về trang đầu
  const setPageSizeHandler = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset về trang đầu khi đổi page size
  }, []);

  // Đặt lại tổng số item, tự động điều chỉnh currentPage nếu cần
  const setTotalItemsHandler = useCallback((total: number) => {
    setTotalItems(total);
    // Nếu currentPage vượt quá tổng số trang mới thì điều chỉnh lại
    if (currentPage > Math.ceil(total / pageSize)) {
      setCurrentPage(Math.ceil(total / pageSize) || 1);
    }
  }, [currentPage, pageSize]);

  // Reset về trạng thái ban đầu
  const reset = useCallback(() => {
    setCurrentPage(initialPage);
    setPageSize(initialPageSize);
    setTotalItems(initialTotalItems);
  }, [initialPage, initialPageSize, initialTotalItems]);

  // Lấy thông tin index của trang hiện tại (start, end, số item)
  const getPageInfo = useCallback(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);
    const itemsOnCurrentPage = endIndex - startIndex;

    return {
      startIndex,
      endIndex,
      itemsOnCurrentPage,
    };
  }, [currentPage, pageSize, totalItems]);

  return {
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    hasNextPage,
    hasPrevPage,
    goToPage,
    nextPage,
    prevPage,
    goToFirstPage,
    goToLastPage,
    setPageSize: setPageSizeHandler,
    setTotalItems: setTotalItemsHandler,
    reset,
    getPageInfo,
  };
};

/**
 * Hook quản lý phân trang kiểu infinite scroll (tải thêm)
 * @template T - Kiểu dữ liệu item
 * @param initialPageSize - Số item/trang (default: 10)
 * @returns State và hàm điều khiển infinite scroll
 */
export const useInfinitePagination = <T>(
  initialPageSize: number = 10
) => {
  const [items, setItems] = useState<T[]>([]);           // Danh sách item đã tải
  const [currentPage, setCurrentPage] = useState(1);      // Trang hiện tại
  const [hasMore, setHasMore] = useState(true);           // Còn dữ liệu để tải không
  const [isLoading, setIsLoading] = useState(false);      // Đang tải trang đầu
  const [isLoadingMore, setIsLoadingMore] = useState(false); // Đang tải thêm

  /**
   * Hàm tải thêm dữ liệu (load more)
   * @param loadFunction - Hàm async nhận (page, pageSize) trả về { data, hasMore, totalItems? }
   */
  const loadMore = useCallback(async (
    loadFunction: (page: number, pageSize: number) => Promise<{
      data: T[];
      hasMore: boolean;
      totalItems?: number;
    }>
  ) => {
    if (isLoading || isLoadingMore || !hasMore) return;

    try {
      if (currentPage === 1) {
        setIsLoading(true); // Trang đầu
      } else {
        setIsLoadingMore(true); // Tải thêm
      }

      const result = await loadFunction(currentPage, initialPageSize);
      
      if (currentPage === 1) {
        setItems(result.data); // Trang đầu: replace
      } else {
        setItems(prev => [...prev, ...result.data]); // Tải thêm: nối vào
      }
      
      setHasMore(result.hasMore);
      setCurrentPage(prev => prev + 1);
    } catch (error) {
      console.error('Error loading more items:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [currentPage, hasMore, isLoading, isLoadingMore, initialPageSize]);

  /**
   * Làm mới danh sách (refresh lại từ đầu)
   * @param loadFunction - Hàm async như loadMore
   */
  const refresh = useCallback(async (
    loadFunction: (page: number, pageSize: number) => Promise<{
      data: T[];
      hasMore: boolean;
      totalItems?: number;
    }>
  ) => {
    setCurrentPage(1);
    setHasMore(true);
    setItems([]);
    await loadMore(loadFunction);
  }, [loadMore]);

  /**
   * Reset toàn bộ state về ban đầu
   */
  const reset = useCallback(() => {
    setItems([]);
    setCurrentPage(1);
    setHasMore(true);
    setIsLoading(false);
    setIsLoadingMore(false);
  }, []);

  return {
    items,
    currentPage,
    hasMore,
    isLoading,
    isLoadingMore,
    loadMore,
    refresh,
    reset,
  };
};

/**
 * Hook quản lý phân trang kiểu cursor (cursor-based)
 * @template T - Kiểu dữ liệu item
 * @param initialPageSize - Số item/trang (default: 10)
 * @returns State và hàm điều khiển cursor pagination
 */
export const useCursorPagination = <T>(
  initialPageSize: number = 10
) => {
  const [items, setItems] = useState<T[]>([]);                   // Danh sách item đã tải
  const [nextCursor, setNextCursor] = useState<string | null>(null); // Cursor tiếp theo
  const [hasMore, setHasMore] = useState(true);                  // Còn dữ liệu để tải không
  const [isLoading, setIsLoading] = useState(false);             // Đang tải trang đầu
  const [isLoadingMore, setIsLoadingMore] = useState(false);     // Đang tải thêm

  /**
   * Hàm tải thêm dữ liệu theo cursor
   * @param loadFunction - Hàm async nhận (cursor, pageSize) trả về { data, nextCursor, hasMore }
   */
  const loadMore = useCallback(async (
    loadFunction: (cursor: string | null, pageSize: number) => Promise<{
      data: T[];
      nextCursor: string | null;
      hasMore: boolean;
    }>
  ) => {
    if (isLoading || isLoadingMore || !hasMore) return;

    try {
      if (!nextCursor) {
        setIsLoading(true); // Trang đầu
      } else {
        setIsLoadingMore(true); // Tải thêm
      }

      const result = await loadFunction(nextCursor, initialPageSize);
      
      if (!nextCursor) {
        setItems(result.data); // Trang đầu: replace
      } else {
        setItems(prev => [...prev, ...result.data]); // Tải thêm: nối vào
      }
      
      setNextCursor(result.nextCursor);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error('Error loading more items:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [nextCursor, hasMore, isLoading, isLoadingMore, initialPageSize]);

  /**
   * Làm mới danh sách (refresh lại từ đầu)
   * @param loadFunction - Hàm async như loadMore
   */
  const refresh = useCallback(async (
    loadFunction: (cursor: string | null, pageSize: number) => Promise<{
      data: T[];
      nextCursor: string | null;
      hasMore: boolean;
    }>
  ) => {
    setNextCursor(null);
    setHasMore(true);
    setItems([]);
    await loadMore(loadFunction);
  }, [loadMore]);

  /**
   * Reset toàn bộ state về ban đầu
   */
  const reset = useCallback(() => {
    setItems([]);
    setNextCursor(null);
    setHasMore(true);
    setIsLoading(false);
    setIsLoadingMore(false);
  }, []);

  return {
    items,
    nextCursor,
    hasMore,
    isLoading,
    isLoadingMore,
    loadMore,
    refresh,
    reset,
  };
}; 