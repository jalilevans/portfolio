"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface FadeInViewProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function FadeInView({ children, delay = 0, className }: FadeInViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
