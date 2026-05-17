"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** 0 = far, 1 = mid, 2 = near */
  layer: 0 | 1 | 2;
}

const LAYERS = [
  { radius: 0.8, alpha: 0.07, speedMin: 0.05, speedMax: 0.10, parallax: 2, countDesktop: 200, countMobile: 100 },
  { radius: 1.5, alpha: 0.13, speedMin: 0.15, speedMax: 0.25, parallax: 5, countDesktop: 80,  countMobile: 40  },
  { radius: 2.5, alpha: 0.22, speedMin: 0.30, speedMax: 0.50, parallax: 9, countDesktop: 25,  countMobile: 12  },
] as const;

function randomSpeed(min: number, max: number): number {
  const mag = min + Math.random() * (max - min);
  return Math.random() < 0.5 ? mag : -mag;
}

function initParticles(w: number, h: number, mobile: boolean): Particle[] {
  const result: Particle[] = [];
  for (let li = 0; li < LAYERS.length; li++) {
    const L = LAYERS[li];
    const count = mobile ? L.countMobile : L.countDesktop;
    for (let i = 0; i < count; i++) {
      result.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: randomSpeed(L.speedMin, L.speedMax),
        vy: randomSpeed(L.speedMin, L.speedMax),
        layer: li as 0 | 1 | 2,
      });
    }
  }
  return result;
}

export function ParticleLayeredDepth() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio ?? 1;
    let rafId: number;
    let particles: Particle[] = [];

    // Smooth cursor offset for parallax
    const cursor = { x: 0, y: 0 };
    const smoothCursor = { x: 0, y: 0 };
    let centerX = 0;
    let centerY = 0;

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx!.scale(dpr, dpr);
      centerX = rect.width / 2;
      centerY = rect.height / 2;
      cursor.x = centerX;
      cursor.y = centerY;
      smoothCursor.x = centerX;
      smoothCursor.y = centerY;
      particles = initParticles(rect.width, rect.height, rect.width < 768);
    }

    function onMouseMove(e: MouseEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      cursor.x = e.clientX - rect.left;
      cursor.y = e.clientY - rect.top;
    }

    function draw() {
      if (!canvas || !ctx) return;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      // Spring toward actual cursor
      smoothCursor.x += (cursor.x - smoothCursor.x) * 0.06;
      smoothCursor.y += (cursor.y - smoothCursor.y) * 0.06;

      // Offset from center, normalized to [-1, 1]
      const offsetX = (smoothCursor.x - centerX) / centerX;
      const offsetY = (smoothCursor.y - centerY) / centerY;

      for (const p of particles) {
        const L = LAYERS[p.layer];

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x += w;
        if (p.x > w) p.x -= w;
        if (p.y < 0) p.y += h;
        if (p.y > h) p.y -= h;

        // Parallax shift: near layer moves most
        const px = p.x + offsetX * L.parallax;
        const py = p.y + offsetY * L.parallax;

        ctx.beginPath();
        ctx.fillStyle = `rgba(32,30,30,${L.alpha})`;
        ctx.arc(px, py, L.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    }

    const section = canvas.parentElement;
    if (section) {
      section.addEventListener("mousemove", onMouseMove);
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
