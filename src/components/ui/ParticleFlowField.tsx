"use client";

import { useEffect, useRef } from "react";

interface FlowParticle {
  x: number;
  y: number;
  age: number;
  maxAge: number;
  speed: number;
}

const PARTICLE_COUNT_DESKTOP = 180;
const PARTICLE_COUNT_MOBILE = 80;
const CURSOR_WARP_RADIUS = 200;
const CURSOR_WARP_STRENGTH = 1.8;

/**
 * Smooth noise via layered sine/cosine — approximates a Perlin-like flow field
 * without a third-party library. Returns an angle in radians.
 */
function flowAngle(x: number, y: number, t: number): number {
  const scale = 0.004;
  return (
    Math.sin(x * scale + t * 0.3) * Math.PI +
    Math.cos(y * scale * 1.3 + t * 0.2) * Math.PI +
    Math.sin((x + y) * scale * 0.7 + t * 0.15) * Math.PI * 0.5
  );
}

function makeParticle(w: number, h: number): FlowParticle {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    age: Math.floor(Math.random() * 120),
    maxAge: 80 + Math.floor(Math.random() * 120),
    speed: 0.6 + Math.random() * 0.8,
  };
}

export function ParticleFlowField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio ?? 1;
    let rafId: number;
    let particles: FlowParticle[] = [];
    let w = 0;
    let h = 0;
    let frame = 0;
    const cursor = { x: -9999, y: -9999, active: false };

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx!.scale(dpr, dpr);
      const count = w < 768 ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;
      particles = Array.from({ length: count }, () => makeParticle(w, h));
    }

    function onMouseMove(e: MouseEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      cursor.x = e.clientX - rect.left;
      cursor.y = e.clientY - rect.top;
      cursor.active = true;
    }

    function onMouseLeave() {
      cursor.active = false;
      cursor.x = -9999;
      cursor.y = -9999;
    }

    function draw() {
      if (!canvas || !ctx) return;

      // Motion blur: semi-transparent clear instead of full clear
      ctx.fillStyle = "rgba(255,255,255,0.18)";
      ctx.fillRect(0, 0, w, h);

      const t = frame * 0.004;

      for (const p of particles) {
        p.age++;
        if (p.age > p.maxAge) {
          Object.assign(p, makeParticle(w, h));
          p.age = 0;
          continue;
        }

        let angle = flowAngle(p.x, p.y, t);

        // Cursor warps the flow field locally — bends flow toward cursor tangent
        if (cursor.active) {
          const dx = cursor.x - p.x;
          const dy = cursor.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CURSOR_WARP_RADIUS && dist > 0) {
            // Tangent angle (perpendicular to cursor direction) creates a swirl
            const tangentAngle = Math.atan2(dy, dx) + Math.PI / 2;
            const warpFactor = (1 - dist / CURSOR_WARP_RADIUS) * CURSOR_WARP_STRENGTH;
            angle = angle * (1 - warpFactor * 0.6) + tangentAngle * warpFactor * 0.6;
          }
        }

        const prevX = p.x;
        const prevY = p.y;
        p.x += Math.cos(angle) * p.speed;
        p.y += Math.sin(angle) * p.speed;

        // Wrap
        if (p.x < 0) p.x += w;
        if (p.x > w) p.x -= w;
        if (p.y < 0) p.y += h;
        if (p.y > h) p.y -= h;

        // Life progress: fade in then fade out
        const lifeT = p.age / p.maxAge;
        const lifeCurve = lifeT < 0.15
          ? lifeT / 0.15
          : lifeT > 0.75
            ? 1 - (lifeT - 0.75) / 0.25
            : 1;

        // Cursor proximity boost
        let proximityBoost = 0;
        if (cursor.active) {
          const dx = cursor.x - p.x;
          const dy = cursor.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CURSOR_WARP_RADIUS) {
            proximityBoost = (1 - dist / CURSOR_WARP_RADIUS) * 0.25;
          }
        }

        const alpha = (lifeCurve * 0.18 + proximityBoost).toFixed(3);

        // Draw a short line segment from previous to current position
        if (Math.abs(prevX - p.x) < 20 && Math.abs(prevY - p.y) < 20) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(108,88,76,${alpha})`;
          ctx.lineWidth = 0.9;
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }
      }

      frame++;
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
