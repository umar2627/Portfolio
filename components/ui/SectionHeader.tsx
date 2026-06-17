"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/components/animations/variants";
import { cn } from "@/lib/utils/cn";

interface SectionHeaderProps {
  number: string;
  label: string;
  title: string;
  gradientWord?: string;
  description?: string;
  breadcrumb?: string;
  className?: string;
}

export function SectionHeader({
  number,
  label,
  title,
  gradientWord,
  description,
  breadcrumb,
  className,
}: SectionHeaderProps) {
  const renderTitle = () => {
    if (!gradientWord) {
      return <span>{title}</span>;
    }
    const parts = title.split(gradientWord);
    return (
      <>
        {parts[0]}
        <span className="bg-gradient-primary bg-clip-text text-transparent">
          {gradientWord}
        </span>
        {parts[1]}
      </>
    );
  };

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={cn("space-y-4", className)}
    >
      {breadcrumb && (
        <p className="font-mono text-sm text-text-muted">{breadcrumb}</p>
      )}
      <span className="inline-flex items-center rounded-full border border-white/[0.08] bg-white/5 px-3 py-1 font-mono text-xs uppercase tracking-widest text-text-secondary">
        {number} {label}
      </span>
      <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
        {renderTitle()}
      </h2>
      {description && (
        <p className="max-w-2xl text-base leading-relaxed text-text-secondary">
          {description}
        </p>
      )}
    </motion.div>
  );
}
