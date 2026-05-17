"use client";

import { useEffect, useRef } from "react";

const TRAIL_LENGTH = 28;
const AURA_RADIUS = 22;
const AURA_RING_RADIUS = 38;

interface TrailPoint {
  x: number;
  y: number;
}

export function ParticleCursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio ?? 1;
    let rafId: number;

    // Smooth cursor position (spring-follows actual cursor)
    const actual = { x: -9999, y: -9999 };
    const smooth = { x: -9999, y: -9999 };
    const ring = { x: -9999, y: -9999 };
    let active = false;

    const trail: TrailPoint[] = [];

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx!.scale(dpr, dpr);
    }

    function onMouseMove(e: MouseEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      actual.x = e.clientX - rect.left;
      actual.y = e.clientY - rect.top;
      if (!active) {
        smooth.x = actual.x;
        smooth.y = actual.y;
        ring.x = actual.x;
        ring.y = actual.y;
        active = true;
      }
    }

    function onMouseLeave() {
      active = false;
    }

    function draw() {
      if (!canvas || !ctx) return;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      if (active) {
        // Spring physics: smooth cursor chases actual, ring cursor chases smooth (double lag)
        smooth.x += (actual.x - smooth.x) * 0.18;
        smooth.y += (actual.y - smooth.y) * 0.18;
        ring.x += (smooth.x - ring.x) * 0.10;
        ring.y += (smooth.y - ring.y) * 0.10;

        // Prepend smooth position to trail
        trail.unshift({ x: smooth.x, y: smooth.y });
        if (trail.length > TRAIL_LENGTH) trail.length = TRAIL_LENGTH;

        // Draw trail dots — taper in size and opacity from head to tail
        for (let i = 0; i < trail.length; i++) {
          const t = 1 - i / trail.length;
          const radius = DOT_RADIUS_MAX * t;
          const alpha = t * 0.55;
          ctx.beginPath();
          ctx.fillStyle = `rgba(108,88,76,${alpha.toFixed(3)})`;
          ctx.arc(trail[i].x, trail[i].y, radius, 0, Math.PI * 2);
          ctx.fill();
        }

        // Filled aura circle at smooth cursor — very soft
        ctx.beginPath();
        const grad = ctx.createRadialGradient(smooth.x, smooth.y, 0, smooth.x, smooth.y, AURA_RADIUS);
        grad.addColorStop(0, "rgba(108,88,76,0.18)");
        grad.addColorStop(1, "rgba(108,88,76,0)");
        ctx.fillStyle = grad;
        ctx.arc(smooth.x, smooth.y, AURA_RADIUS, 0, Math.PI * 2);
        ctx.fill();

        // Outer ring at ring cursor (lagged further) — hairline stroke
        ctx.beginPath();
        ctx.strokeStyle = "rgba(108,88,76,0.22)";
        ctx.lineWidth = 1;
        ctx.arc(ring.x, ring.y, AURA_RING_RADIUS, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        // Fade out trail when cursor leaves
        trail.length = Math.max(0, trail.length - 2);
        for (let i = 0; i < trail.length; i++) {
          const t = 1 - i / trail.length;
          const radius = DOT_RADIUS_MAX * t * 0.6;
          const alpha = t * 0.3;
          ctx.beginPath();
          ctx.fillStyle = `rgba(108,88,76,${alpha.toFixed(3)})`;
          ctx.arc(trail[i].x, trail[i].y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      rafId = requestAnimationFrame(draw);
    }

    const section = canvas.parentElement;
    if (section) {
      section.addEventListener("mousemove", onMouseMove);
      section.addEventListener("mouseleave", onMouseLeave);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      if (section) {
        section.removeEventListener("mousemove", onMouseMove);
        section.removeEventListener("mouseleave", onMouseLeave);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}

const DOT_RADIUS_MAX = 4;
