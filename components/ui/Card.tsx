"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { cardHover } from "@/components/animations/variants";
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  elevated?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover = true, elevated = false, onClick }: CardProps) {
  if (hover) {
    return (
      <motion.div
        variants={cardHover}
        initial="rest"
        whileHover="hover"
        onClick={onClick}
        className={cn(
          "rounded-2xl border border-white/[0.08] bg-card/80 backdrop-blur-sm shadow-card",
          elevated && "bg-card-elevated",
          onClick && "cursor-pointer",
          className
        )}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-white/[0.08] bg-card/80 backdrop-blur-sm shadow-card",
        elevated && "bg-card-elevated",
        className
      )}
    >
      {children}
    </div>
  );
}
