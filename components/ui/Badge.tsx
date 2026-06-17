import { cn } from "@/lib/utils/cn";
import { getTechColors } from "@/lib/utils/techColors";

interface BadgeProps {
  children: string;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  const colors = getTechColors(children);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        colors.bg,
        colors.text,
        colors.border,
        className
      )}
    >
      {children}
    </span>
  );
}
