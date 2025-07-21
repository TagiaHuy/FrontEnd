import { useState, useCallback, useMemo } from 'react';

interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface UsePaginationReturn extends PaginationState {
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  setPageSize: (size: number) => void;
  setTotalItems: (total: number) => void;
  reset: () => void;
  getPageInfo: () => {
    startIndex: number;
    endIndex: number;
    itemsOnCurrentPage: number;
  };
}

/**
 * Custom hook for managing pagination state
 * @param initialPage - Initial page number (default: 1)
 * @param initialPageSize - Initial page size (default: 10)
 * @param initialTotalItems - Initial total items count (default: 0)
 * @returns Pagination state management functions
 */
export const usePagination = (
  initialPage: number = 1,
  initialPageSize: number = 10,
  initialTotalItems: number = 0
): UsePaginationReturn => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalItems, setTotalItems] = useState(initialTotalItems);

  // Calculate derived values
  const totalPages = useMemo(() => Math.ceil(totalItems / pageSize), [totalItems, pageSize]);
  const hasNextPage = useMemo(() => currentPage < totalPages, [currentPage, totalPages]);
  const hasPrevPage = useMemo(() => currentPage > 1, [currentPage]);

  // Navigation functions
  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  }, [hasNextPage]);

  const prevPage = useCallback(() => {
    if (hasPrevPage) {
      setCurrentPage(prev => prev - 1);
    }
  }, [hasPrevPage]);

  const goToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const goToLastPage = useCallback(() => {
    setCurrentPage(totalPages);
  }, [totalPages]);

  const setPageSizeHandler = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  }, []);

  const setTotalItemsHandler = useCallback((total: number) => {
    setTotalItems(total);
    // Adjust current page if it exceeds total pages
    if (currentPage > Math.ceil(total / pageSize)) {
      setCurrentPage(Math.ceil(total / pageSize) || 1);
    }
  }, [currentPage, pageSize]);

  const reset = useCallback(() => {
    setCurrentPage(initialPage);
    setPageSize(initialPageSize);
    setTotalItems(initialTotalItems);
  }, [initialPage, initialPageSize, initialTotalItems]);

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
 * Hook for managing infinite scroll pagination
 */
export const useInfinitePagination = <T>(
  initialPageSize: number = 10
) => {
  const [items, setItems] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

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
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      const result = await loadFunction(currentPage, initialPageSize);
      
      if (currentPage === 1) {
        setItems(result.data);
      } else {
        setItems(prev => [...prev, ...result.data]);
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
 * Hook for managing cursor-based pagination
 */
export const useCursorPagination = <T>(
  initialPageSize: number = 10
) => {
  const [items, setItems] = useState<T[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

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
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      const result = await loadFunction(nextCursor, initialPageSize);
      
      if (!nextCursor) {
        setItems(result.data);
      } else {
        setItems(prev => [...prev, ...result.data]);
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