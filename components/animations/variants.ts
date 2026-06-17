import type { Variants } from "framer-motion";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export const cardHover: Variants = {
  rest: { y: 0, boxShadow: "0 1px 0 0 rgba(255,255,255,0.05) inset" },
  hover: {
    y: -4,
    boxShadow: "0 0 20px rgba(147, 51, 234, 0.15), 0 1px 0 0 rgba(255,255,255,0.08) inset",
    transition: { duration: 0.25, ease: "easeOut" as const },
  },
};
