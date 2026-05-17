"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { timeline } from "@/content/about";

export function ExperienceExpandableWithDraw() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const ref = useRef<HTMLOListElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <ol ref={ref}>
      {timeline.map((entry, i) => {
        const isOpen = openIdx === i;

        return (
          <li key={entry.year} className="flex gap-4">
            {/* Connector column */}
            <div className="relative w-2.5 shrink-0">
              {/* Line drawing in from above */}
              {i > 0 && (
                <motion.div
                  className="absolute left-1/2 -translate-x-1/2 top-0 w-px origin-top bg-white/25"
                  initial={{ height: 0 }}
                  animate={inView ? { height: 27 } : { height: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: i * 0.2,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                />
              )}

              {/* Dot */}
              <motion.span
                className="absolute top-[22px] left-0 h-2.5 w-2.5 rounded-full bg-primary-on-dark z-10"
                initial={{ scale: 0, opacity: 0 }}
                animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                transition={{
                  duration: 0.3,
                  delay: i * 0.2 + 0.12,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
              />

              {/* Line drawing downward */}
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 top-[27px] bottom-0 w-px origin-top bg-white/25"
                initial={{ scaleY: 0 }}
                animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.2 + 0.2,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              />
            </div>

            {/* Card */}
            <motion.div
              className={`flex-1 ${i < timeline.length - 1 ? "pb-4" : ""}`}
              initial={{ opacity: 0, x: 12 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 12 }}
              transition={{
                duration: 0.4,
                delay: i * 0.2 + 0.08,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : i)}
                className="w-full text-left rounded-[18px] border border-white/10 bg-white/5 p-5 transition-colors hover:bg-white/10 focus-visible:outline-none"
                aria-expanded={isOpen}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="mb-1 text-[16px] font-normal leading-[1.29] tracking-[-0.224px] text-white/40">
                      {entry.year}
                    </p>
                    <p className="text-[18px] font-semibold leading-[1.24] tracking-[-0.374px] text-white">
                      {entry.title}
                    </p>
                  </div>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                    className="mt-1 shrink-0 text-white/30 text-[20px] leading-none"
                    aria-hidden
                  >
                    +
                  </motion.span>
                </div>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="detail"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="mt-3 text-[16px] font-normal leading-[1.47] tracking-[-0.374px] text-white/60">
                        {entry.detail}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          </li>
        );
      })}
    </ol>
  );
}
