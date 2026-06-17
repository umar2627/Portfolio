"use client";

import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { cn } from "@/lib/utils/cn";

interface LoadingOverlayProps {
  show: boolean;
  message?: string;
  className?: string;
  fullScreen?: boolean;
}

export function LoadingOverlay({
  show,
  message,
  className,
  fullScreen = false,
}: LoadingOverlayProps) {
  if (!show) return null;

  return (
    <div
      className={cn(
        "z-50 flex items-center justify-center bg-primary/60 backdrop-blur-sm",
        fullScreen ? "fixed inset-0" : "absolute inset-0 rounded-[inherit]",
        className
      )}
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-3">
        <LoadingSpinner size="lg" />
        {message ? (
          <p className="text-sm font-medium text-text-secondary">{message}</p>
        ) : null}
      </div>
    </div>
  );
}
