"use client";

import { useCallback, useRef, useState } from "react";

export function useApiLoading() {
  const [isLoading, setIsLoading] = useState(false);
  const countRef = useRef(0);

  const startLoading = useCallback(() => {
    countRef.current += 1;
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    countRef.current = Math.max(0, countRef.current - 1);
    setIsLoading(countRef.current > 0);
  }, []);

  const withLoading = useCallback(
    async <T>(fn: () => Promise<T>): Promise<T> => {
      startLoading();
      try {
        return await fn();
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading]
  );

  return { isLoading, withLoading, startLoading, stopLoading };
}
