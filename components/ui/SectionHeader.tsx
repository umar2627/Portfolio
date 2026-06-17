"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/components/animations/variants";
import { cn } from "@/lib/utils/cn";

interface SectionHeaderProps {
  label: string;
  title: string;
  gradientWord?: string;
  description?: string;
  breadcrumb?: string;
  className?: string;
}

export function SectionHeader({
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
      {label && (
        <p className="font-mono text-xs uppercase tracking-widest text-accent-purple">
          {label}
        </p>
      )}
      {breadcrumb && (
        <p className="font-mono text-sm text-text-muted">{breadcrumb}</p>
      )}
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
