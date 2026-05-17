"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import Badge from "@/components/ui/Badge";

interface ProjectCardTagRowProps {
  tags: string[];
}

function parseGapPx(gap: string): number {
  if (!gap || gap === "normal") return 0;
  const parts = gap.split(/\s+/);
  let max = 0;
  for (const part of parts) {
    const n = parseFloat(part);
    if (!Number.isNaN(n)) max = Math.max(max, n);
  }
  return max;
}

export function ProjectCardTagRow({ tags }: ProjectCardTagRowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(tags.length);
  const tagsKey = tags.join("\0");

  const measure = useCallback(() => {
    const container = containerRef.current;
    const measureRow = measureRef.current;
    if (!container || !measureRow) return;

    const maxW = container.clientWidth;
    const children = measureRow.children;
    if (maxW <= 0 || children.length === 0) {
      setVisibleCount(0);
      return;
    }

    const gapPx = parseGapPx(getComputedStyle(measureRow).gap);

    let used = 0;
    let count = 0;
    for (let i = 0; i < children.length; i++) {
      const w = (children[i] as HTMLElement).offsetWidth;
      const next = used + (count > 0 ? gapPx : 0) + w;
      if (next > maxW + 0.5) break;
      used = next;
      count++;
    }
    setVisibleCount(count);
  }, []);

  useLayoutEffect(() => {
    measure();
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure, tagsKey]);

  const visible = tags.slice(0, visibleCount);

  return (
    <div ref={containerRef} className="relative min-w-0 w-full">
      <div className="flex flex-nowrap gap-2">
        {visible.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
      <div
        ref={measureRef}
        className="pointer-events-none absolute left-0 top-0 -z-10 flex w-max flex-nowrap gap-2 opacity-0"
        aria-hidden
      >
        {tags.map((tag, i) => (
          <Badge key={`${i}-${tag}`}>{tag}</Badge>
        ))}
      </div>
    </div>
  );
}
