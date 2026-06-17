"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface FilterPillProps {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}

export function FilterPill({ label, count, active, onClick }: FilterPillProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200",
        active
          ? "border-accent-purple/50 bg-accent-purple/10 text-white"
          : "border-white/[0.08] bg-transparent text-text-secondary hover:border-white/20 hover:text-white"
      )}
    >
      {label}
      {count !== undefined && (
        <span
          className={cn(
            "rounded-full px-1.5 py-0.5 text-xs",
            active ? "bg-accent-purple/20" : "bg-white/5"
          )}
        >
          {count}
        </span>
      )}
    </motion.button>
  );
}
