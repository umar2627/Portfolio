"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/components/animations/variants";
import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  stagger?: boolean;
}

export function AnimatedSection({
  children,
  className,
  id,
  stagger = false,
}: AnimatedSectionProps) {
  return (
    <motion.section
      id={id}
      variants={stagger ? staggerContainer : fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className={cn("py-24 lg:py-32", className)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </motion.section>
  );
}
