"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Base velocity used to restore speed after gravity interaction */
  bvx: number;
  bvy: number;
}

const EDGE_THRESHOLD = 140;
const CURSOR_EDGE_THRESHOLD = 180;
const GRAVITY_RADIUS = 160;
const GRAVITY_STRENGTH = 0.008;
const DOT_RADIUS = 2;
const DOT_COLOR = "rgba(32,30,30,0.25)";
const EDGE_COLOR = "rgba(32,30,30,0.10)";
const CURSOR_EDGE_COLOR = "rgba(108,88,76,0.30)";

function randomSpeed(): number {
  const mag = 0.2 + Math.random() * 0.2;
  return Math.random() < 0.5 ? mag : -mag;
}

function initParticles(count: number, w: number, h: number): Particle[] {
  return Array.from({ length: count }, () => {
    const vx = randomSpeed();
    const vy = randomSpeed();
    return { x: Math.random() * w, y: Math.random() * h, vx, vy, bvx: vx, bvy: vy };
  });
}

export function ParticleConstellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio ?? 1;
    let rafId: number;
    let particles: Particle[] = [];
    const cursor = { x: -9999, y: -9999, active: false };

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx!.scale(dpr, dpr);

      const count = rect.width < 768 ? 40 : 70;
      particles = initParticles(count, rect.width, rect.height);
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
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        if (cursor.active) {
          const dx = cursor.x - p.x;
          const dy = cursor.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < GRAVITY_RADIUS && dist > 0) {
            p.vx += (dx / dist) * GRAVITY_STRENGTH;
            p.vy += (dy / dist) * GRAVITY_STRENGTH;
          }
        }

        // Gradually restore base velocity to prevent runaway acceleration
        p.vx += (p.bvx - p.vx) * 0.01;
        p.vy += (p.bvy - p.vy) * 0.01;

        p.x += p.vx;
        p.y += p.vy;

        // Wrap at edges
        if (p.x < 0) p.x += w;
        if (p.x > w) p.x -= w;
        if (p.y < 0) p.y += h;
        if (p.y > h) p.y -= h;
      }

      // Particle-to-particle edges
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < EDGE_THRESHOLD) {
            const alpha = (1 - dist / EDGE_THRESHOLD) * 0.12;
            ctx.beginPath();
            ctx.strokeStyle = EDGE_COLOR.replace("0.10", alpha.toFixed(3));
            ctx.lineWidth = 0.8;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Cursor-to-particle edges
      if (cursor.active) {
        for (const p of particles) {
          const dx = cursor.x - p.x;
          const dy = cursor.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CURSOR_EDGE_THRESHOLD) {
            const alpha = (1 - dist / CURSOR_EDGE_THRESHOLD) * 0.35;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(108,88,76,${alpha.toFixed(3)})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(cursor.x, cursor.y);
            ctx.stroke();
          }
        }
      }

      // Particle dots
      ctx.fillStyle = DOT_COLOR;
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, DOT_RADIUS, 0, Math.PI * 2);
        ctx.fill();
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
