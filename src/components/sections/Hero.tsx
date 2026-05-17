"use client";

import { motion } from "framer-motion";
import { TypewriterText } from "@/components/ui/TypewriterText";
import { ParticleSpacetimeMesh } from "@/components/ui/ParticleSpacetimeMesh";

const HERO_PHRASES = ["prototype with real code.", 
                      "define product strategy.", 
                      "get ideas funded.",
                      "uplevel UI quality."];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
      delay,
    },
  }),
};

export default function Hero() {
  return (
    <section className="relative overflow-hidden w-full bg-canvas pt-44 md:pt-56 lg:pt-64 pb-60 md:pb-72 lg:pb-80">
      <ParticleSpacetimeMesh />

      <div className="relative max-w-[1440px] mx-auto px-6">
        <motion.p
            className="text-[18px] font-normal leading-[1.19] tracking-[0.231px] text-ink-muted-48 mb-4"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
          >
            Senior Product Designer · Meta, Facebook Stories
          </motion.p>
          <motion.h1
            className="font-display text-[34px] md:text-[48px] font-normal leading-[1.07] tracking-[-0.28px] text-ink max-w-[680px] mb-4"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.1}
          >
            I&apos;m a design generalist who can{" "}
            <span className="relative inline-block">
              <span className="invisible" aria-hidden="true">prototype with real code.</span>
              <span className="absolute left-0 top-0 w-full">
                <TypewriterText phrases={HERO_PHRASES} />
              </span>
            </span>
          </motion.h1>
          <motion.p
            className="text-[18px] font-normal leading-[1.47] tracking-[-0.374px] text-ink-muted-80 max-w-[540px] mb-8"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.2}
          >
            5 years at Meta across craft, growth, and product strategy. I prototype in SwiftUI, React, and Next.js, and run workshops teaching designers to prototype with AI. Before Meta, I co-founded a startup. Looking for an early-stage company where design shapes strategy.
          </motion.p>
          <motion.div
            className="flex items-center gap-4 flex-wrap -ml-[4px]"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.3}
          >
            <a
              href="#work"
              className="inline-block bg-primary text-white text-[17px] font-normal leading-[1.47] tracking-[-0.374px] rounded-full px-[22px] py-[11px] hover:bg-primary-focus transition-colors active:scale-95"
            >
              View Work
            </a>
            <a
              href="#contact"
              className="inline-block border border-primary text-primary text-[17px] font-normal leading-[1.47] tracking-[-0.374px] rounded-full px-[22px] py-[11px] hover:bg-primary/5 transition-colors active:scale-95"
            >
              Get in Touch
            </a>
          </motion.div>
      </div>

    </section>
  );
}
