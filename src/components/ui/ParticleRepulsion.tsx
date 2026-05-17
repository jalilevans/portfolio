"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  bvx: number;
  bvy: number;
}

const REPULSION_RADIUS = 110;
const REPULSION_STRENGTH = 2.8;
const DOT_RADIUS = 2;

function randomSpeed(): number {
  const mag = 0.15 + Math.random() * 0.25;
  return Math.random() < 0.5 ? mag : -mag;
}

function initParticles(count: number, w: number, h: number): Particle[] {
  return Array.from({ length: count }, () => {
    const vx = randomSpeed();
    const vy = randomSpeed();
    return { x: Math.random() * w, y: Math.random() * h, vx, vy, bvx: vx, bvy: vy };
  });
}

export function ParticleRepulsion() {
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
      const count = rect.width < 768 ? 45 : 75;
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
          const dx = p.x - cursor.x;
          const dy = p.y - cursor.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < REPULSION_RADIUS && dist > 0) {
            const force = (1 - dist / REPULSION_RADIUS) * REPULSION_STRENGTH;
            p.vx += (dx / dist) * force * 0.04;
            p.vy += (dy / dist) * force * 0.04;
          }
        }

        // Spring back toward base velocity
        p.vx += (p.bvx - p.vx) * 0.04;
        p.vy += (p.bvy - p.vy) * 0.04;

        // Clamp velocity so particles don't fly off
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const maxSpeed = 4;
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed;
          p.vy = (p.vy / speed) * maxSpeed;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x += w;
        if (p.x > w) p.x -= w;
        if (p.y < 0) p.y += h;
        if (p.y > h) p.y -= h;
      }

      // Draw particles with a subtle cursor-proximity glow
      for (const p of particles) {
        let alpha = 0.22;
        if (cursor.active) {
          const dx = p.x - cursor.x;
          const dy = p.y - cursor.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < REPULSION_RADIUS) {
            alpha = 0.22 + (1 - dist / REPULSION_RADIUS) * 0.35;
          }
        }
        ctx.beginPath();
        ctx.fillStyle = `rgba(108,88,76,${alpha.toFixed(3)})`;
        ctx.arc(p.x, p.y, DOT_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }

      // Cursor void ring — shows the repulsion radius as a very faint circle
      if (cursor.active) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(108,88,76,0.08)";
        ctx.lineWidth = 1;
        ctx.arc(cursor.x, cursor.y, REPULSION_RADIUS, 0, Math.PI * 2);
        ctx.stroke();
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
