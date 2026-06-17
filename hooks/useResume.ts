"use client";

import { useCallback, useRef, useState } from "react";
import { openResume } from "@/lib/utils/resume";

export function useResume() {
  const [isLoading, setIsLoading] = useState(false);
  const loadingRef = useRef(false);

  const handleOpenResume = useCallback(async (fileName?: string) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setIsLoading(true);
    try {
      await openResume(fileName);
    } finally {
      loadingRef.current = false;
      setIsLoading(false);
    }
  }, []);

  return { isLoading, openResume: handleOpenResume };
}
