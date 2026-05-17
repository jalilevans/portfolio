"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { AboutScrollPhase } from "@/content/about";

const THRESHOLDS = [0, 0.25, 0.5, 0.75, 1] as const;

interface AboutScrollMediaProps {
  phases: AboutScrollPhase[];
  bioPanel: ReactNode;
  buildPanel: ReactNode;
}

function pickActivePhase(ratios: number[]): number | null {
  const maxR = Math.max(...ratios);
  if (maxR <= 0) return null;
  for (let i = 0; i < ratios.length; i++) {
    if (ratios[i] === maxR) return i;
  }
  return null;
}

export function AboutScrollMedia({
  phases,
  bioPanel,
  buildPanel,
}: AboutScrollMediaProps) {
  const panelCount = phases.length;
  const ref0 = useRef<HTMLDivElement>(null);
  const ref1 = useRef<HTMLDivElement>(null);
  const panelRefs = [ref0, ref1];

  const ratiosRef = useRef<number[]>(
    Array.from({ length: panelCount }, () => 0),
  );
  const rafId = useRef<number | null>(null);
  const [active, setActive] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const flushRatios = useCallback(() => {
    rafId.current = null;
    const next = pickActivePhase(ratiosRef.current);
    if (next !== null) setActive(next);
  }, []);

  const scheduleFlush = useCallback(() => {
    if (rafId.current !== null) return;
    rafId.current = requestAnimationFrame(flushRatios);
  }, [flushRatios]);

  useEffect(() => {
    ratiosRef.current = Array.from({ length: panelCount }, () => 0);
  }, [panelCount]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          const idx = Number.parseInt(el.dataset.phase ?? "0", 10);
          if (idx >= 0 && idx < panelCount) {
            ratiosRef.current[idx] = entry.intersectionRatio;
          }
        }
        scheduleFlush();
      },
      { threshold: [...THRESHOLDS] },
    );

    for (let i = 0; i < panelCount; i++) {
      const el = panelRefs[i]?.current;
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [panelCount, scheduleFlush]);

  useEffect(
    () => () => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    },
    [],
  );

  const transitionClass = reduceMotion
    ? "transition-none"
    : "transition-opacity duration-500 ease-out";

  const frameClass =
    "relative aspect-3/4 w-[min(100%,280px)] overflow-hidden rounded-[16px] sm:w-[min(100%,320px)] md:w-full";

  return (
    <div className="grid grid-cols-1 items-start gap-x-14 md:grid-cols-[minmax(0,680px)_minmax(0,1fr)]">
      <div className="order-2 min-w-0 space-y-32 md:space-y-44 md:order-1 md:pt-[30vh] md:pb-[30vh]">
        <div ref={ref0} data-phase="0">
          {bioPanel}
        </div>
        <div ref={ref1} data-phase="1">
          {buildPanel}
        </div>
      </div>

      <div className="order-1 mb-8 flex w-full min-w-0 justify-center md:order-2 md:mb-0 md:block md:sticky md:top-8 md:self-start">
        <div className="about-media-entrance flex w-full justify-center md:justify-end">
          <div className={frameClass}>
            {phases.map((phase, i) => (
              <Image
                key={phase.image}
                src={phase.image}
                alt={i === active ? phase.alt : ""}
                width={800}
                height={1066}
                sizes="(max-width: 767px) min(100vw - 48px, 320px), (max-width: 1440px) 42vw, 720px"
                className={`absolute inset-0 h-full w-full object-cover ${transitionClass} ${
                  i === active ? "opacity-100" : "opacity-0"
                }`}
                aria-hidden={i !== active}
                unoptimized={phase.image.startsWith("/")}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
