"use client";

import { FiStar } from "react-icons/fi";
import { cn } from "@/lib/utils/cn";

interface StarRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizes = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-6 w-6" };

export function StarRating({
  rating,
  onChange,
  readonly = false,
  size = "md",
}: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={cn(
            "transition-colors",
            readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
          )}
        >
          <FiStar
            className={cn(
              sizes[size],
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-text-muted"
            )}
          />
        </button>
      ))}
    </div>
  );
}
