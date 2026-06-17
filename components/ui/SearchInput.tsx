"use client";

import { FiSearch } from "react-icons/fi";
import { cn } from "@/lib/utils/cn";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search projects...",
  className,
}: SearchInputProps) {
  return (
    <div className={cn("relative", className)}>
      <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-white/[0.08] bg-card/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-text-muted outline-none transition-colors focus:border-accent-purple/50 focus:ring-1 focus:ring-accent-purple/30"
      />
    </div>
  );
}
