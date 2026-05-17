"use client";

import { useEffect, useRef } from "react";

const CELL = 24;          // grid cell size in px
const G = 2000;           // gravitational strength
const SOFTENING = 220;    // prevents singularity at cursor (px)
const MAX_PULL = 55;      // caps displacement so grid doesn't collapse (px)
const WAVE_AMP = 1.8;     // ambient undulation amplitude (px)

// ─── Character-typed ripple constants ────────────────────────────────────────
const RIPPLE_SPEED    = 300;   // px/s — how fast the ring expands
const RIPPLE_DECAY    = 5.5;   // exponential decay rate (gone ~550ms after birth)
const RIPPLE_SIGMA    = 26;    // px — gaussian ring width
const RIPPLE_STRENGTH = 16;    // px — max outward push at wave front
const RIPPLE_MAX_AGE  = 700;   // ms — prune older than this

interface Ripple {
  x: number;   // canvas-local px
  y: number;   // canvas-local px (before parallax adjustment)
  born: number; // performance.now() timestamp
}

export function ParticleSpacetimeMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio ?? 1;
    let rafId: number;
    let w = 0, h = 0;
    let cols = 0, rows = 0;
    let frame = 0;

    // Actual cursor position
    const cursor = { x: 0, y: 0 };
    // Spring-smoothed cursor position — drives the gravity well
    const smooth = { x: 0, y: 0 };
    // Gravity intensity: 0 = none, 1 = full — lerped on enter/leave
    let gravityTarget = 0;
    let gravityActual = 0;
    // Scroll-based parallax — grid moves at 30% of scroll speed relative to section top
    let scrollY = 0;
    let sectionOffsetTop = 0;
    // Current parallax offset, kept in sync each frame so displaced() can read it
    let currentParallaxOffset = 0;

    // Active ripples from typed characters
    const ripples: Ripple[] = [];

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx!.scale(dpr, dpr);
      cols = Math.ceil(w / CELL) + 2;
      rows = Math.ceil(h / CELL) + 10;
      smooth.x = w / 2;
      smooth.y = h / 2;
      cursor.x = w / 2;
      cursor.y = h / 2;
      // Cache section's absolute top so parallax is relative to section entry
      sectionOffsetTop = rect.top + window.scrollY;
    }

    function onMouseMove(e: MouseEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      cursor.x = e.clientX - rect.left;
      cursor.y = e.clientY - rect.top;
      gravityTarget = 1;
    }

    function onMouseLeave() {
      gravityTarget = 0;
    }

    function onScroll() {
      scrollY = window.scrollY;
    }

    function onTypewriterRipple(e: Event) {
      if (!canvas) return;
      const { x: vx, y: vy } = (e as CustomEvent<{ x: number; y: number }>).detail;
      const rect = canvas.getBoundingClientRect();
      ripples.push({
        x: vx - rect.left,
        y: vy - rect.top,
        born: performance.now(),
      });
    }

    /**
     * Returns the displaced (x, y) for a grid node at column gx, row gy.
     * Rest position starts at -CELL so the grid covers edges.
     * `now` is performance.now() sampled once per frame.
     */
    function displaced(gx: number, gy: number, t: number, now: number): [number, number] {
      const rx = (gx - 1) * CELL;
      const ry = (gy - 1) * CELL;

      // Ambient undulation — a gentle standing wave
      const nx = Math.sin(gx * 0.38 + t * 0.45) * Math.cos(gy * 0.31 - t * 0.3) * WAVE_AMP;
      const ny = Math.cos(gx * 0.27 - t * 0.35) * Math.sin(gy * 0.42 + t * 0.25) * WAVE_AMP;

      let dx = 0, dy = 0;

      // Cursor gravity pull
      if (gravityActual > 0.005) {
        const diffX = smooth.x - rx;
        const diffY = (smooth.y - currentParallaxOffset) - ry;
        const dist = Math.sqrt(diffX * diffX + diffY * diffY);

        if (dist > 0.5) {
          const rawMag = G / (dist + SOFTENING);
          const mag = Math.min(rawMag, MAX_PULL) * gravityActual;
          dx += (diffX / dist) * mag;
          dy += (diffY / dist) * mag;
        }
      }

      // Typewriter character ripples — outward expanding wave rings
      for (let i = 0; i < ripples.length; i++) {
        const r = ripples[i];
        const age = (now - r.born) / 1000; // seconds
        const decay = Math.exp(-age * RIPPLE_DECAY);
        if (decay < 0.005) continue;

        // Vector from ripple center to grid node (outward direction)
        const diffX = rx - r.x;
        const diffY = ry - (r.y - currentParallaxOffset);
        const dist = Math.sqrt(diffX * diffX + diffY * diffY);
        if (dist < 0.5) continue;

        // Gaussian ring that expands outward at RIPPLE_SPEED
        const waveRadius = age * RIPPLE_SPEED;
        const distFromFront = dist - waveRadius;
        const waveFront = Math.exp(-(distFromFront * distFromFront) / (2 * RIPPLE_SIGMA * RIPPLE_SIGMA));

        const mag = RIPPLE_STRENGTH * decay * waveFront;
        dx += (diffX / dist) * mag;
        dy += (diffY / dist) * mag;
      }

      return [rx + dx + nx, ry + dy + ny];
    }

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, w, h);

      // Spring-follow cursor
      smooth.x += (cursor.x - smooth.x) * 0.10;
      smooth.y += (cursor.y - smooth.y) * 0.10;

      // Gravity fade in/out
      gravityActual += (gravityTarget - gravityActual) * 0.07;

      // Parallax — Lenis already smooths window.scrollY, so no second lerp needed
      const parallaxOffset = (scrollY - sectionOffsetTop) * 0.3;
      currentParallaxOffset = parallaxOffset;

      const now = performance.now();

      // Prune expired ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        if (now - ripples[i].born > RIPPLE_MAX_AGE) ripples.splice(i, 1);
      }

      const t = frame * 0.014;
      const baseAlpha = 0.09 + gravityActual * 0.05;
      ctx.lineWidth = 0.9;

      ctx.save();
      ctx.translate(0, parallaxOffset);

      // Draw a dot at every displaced grid node
      for (let gy = 0; gy <= rows; gy++) {
        for (let gx = 0; gx <= cols; gx++) {
          const [x, y] = displaced(gx, gy, t, now);

          let alpha = baseAlpha;

          // Proximity boost — dots near cursor get slightly brighter
          if (gravityActual > 0.01) {
            const restX = (gx - 1) * CELL;
            const restY = (gy - 1) * CELL;
            const ddx = smooth.x - restX;
            const ddy = (smooth.y - currentParallaxOffset) - restY;
            const dist = Math.sqrt(ddx * ddx + ddy * ddy);
            if (dist < CELL * 5) {
              alpha += (1 - dist / (CELL * 5)) * 0.12 * gravityActual;
            }
          }

          // Brightness boost — dots on the ripple wave front glow briefly
          for (let i = 0; i < ripples.length; i++) {
            const r = ripples[i];
            const age = (now - r.born) / 1000;
            const decay = Math.exp(-age * RIPPLE_DECAY);
            if (decay < 0.005) continue;
            const restX = (gx - 1) * CELL;
            const restY = (gy - 1) * CELL;
            const ddx = restX - r.x;
            const ddy = restY - (r.y - currentParallaxOffset);
            const dist = Math.sqrt(ddx * ddx + ddy * ddy);
            const waveRadius = age * RIPPLE_SPEED;
            const distFromFront = dist - waveRadius;
            const waveFront = Math.exp(-(distFromFront * distFromFront) / (2 * RIPPLE_SIGMA * RIPPLE_SIGMA));
            alpha += decay * waveFront * 0.18;
          }

          ctx!.beginPath();
          ctx!.fillStyle = `rgba(108,88,76,${Math.min(alpha, 0.9).toFixed(3)})`;
          ctx!.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx!.fill();
        }
      }

      ctx.restore();

      frame++;
      rafId = requestAnimationFrame(draw);
    }

    const section = canvas.parentElement;
    if (section) {
      section.addEventListener("mousemove", onMouseMove);
      section.addEventListener("mouseleave", onMouseLeave);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("typewriter-ripple", onTypewriterRipple);
    scrollY = window.scrollY;

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("typewriter-ripple", onTypewriterRipple);
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
