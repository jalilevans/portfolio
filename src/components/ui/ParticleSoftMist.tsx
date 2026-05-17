"use client";

import { useEffect, useRef } from "react";

interface MistBlob {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  /** 0 = ink, 1 = primary */
  tint: 0 | 1;
}

const CURSOR_VOID_RADIUS = 160;

function randomSpeed(): number {
  const mag = 0.06 + Math.random() * 0.09;
  return Math.random() < 0.5 ? mag : -mag;
}

function makeBlob(w: number, h: number): MistBlob {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: randomSpeed(),
    vy: randomSpeed(),
    radius: 10 + Math.random() * 6,
    tint: Math.random() < 0.35 ? 1 : 0,
  };
}

export function ParticleSoftMist() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio ?? 1;
    let rafId: number;
    let blobs: MistBlob[] = [];
    const cursor = { x: -9999, y: -9999, active: false };
    const smoothCursor = { x: -9999, y: -9999 };

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx!.scale(dpr, dpr);
      const count = rect.width < 768 ? 70 : 130;
      blobs = Array.from({ length: count }, () => makeBlob(rect.width, rect.height));
    }

    function onMouseMove(e: MouseEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      cursor.x = e.clientX - rect.left;
      cursor.y = e.clientY - rect.top;
      if (!cursor.active) {
        smoothCursor.x = cursor.x;
        smoothCursor.y = cursor.y;
      }
      cursor.active = true;
    }

    function onMouseLeave() {
      cursor.active = false;
    }

    function draw() {
      if (!canvas || !ctx) return;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      if (cursor.active) {
        smoothCursor.x += (cursor.x - smoothCursor.x) * 0.10;
        smoothCursor.y += (cursor.y - smoothCursor.y) * 0.10;
      }

      for (const b of blobs) {
        b.x += b.vx;
        b.y += b.vy;
        if (b.x < -b.radius) b.x += w + b.radius * 2;
        if (b.x > w + b.radius) b.x -= w + b.radius * 2;
        if (b.y < -b.radius) b.y += h + b.radius * 2;
        if (b.y > h + b.radius) b.y -= h + b.radius * 2;

        // Compute opacity — reduce near cursor void
        let alpha = b.tint === 1 ? 0.045 : 0.038;
        if (cursor.active) {
          const dx = smoothCursor.x - b.x;
          const dy = smoothCursor.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CURSOR_VOID_RADIUS + b.radius) {
            const overlap = Math.max(0, 1 - dist / (CURSOR_VOID_RADIUS + b.radius));
            alpha *= 1 - overlap * 0.75;
          }
        }

        if (alpha < 0.003) continue;

        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
        if (b.tint === 1) {
          grad.addColorStop(0, `rgba(108,88,76,${alpha.toFixed(3)})`);
        } else {
          grad.addColorStop(0, `rgba(32,30,30,${alpha.toFixed(3)})`);
        }
        grad.addColorStop(1, "rgba(255,255,255,0)");

        ctx.beginPath();
        ctx.fillStyle = grad;
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Cursor void — a soft clearing circle
      if (cursor.active) {
        const voidGrad = ctx.createRadialGradient(
          smoothCursor.x, smoothCursor.y, 0,
          smoothCursor.x, smoothCursor.y, CURSOR_VOID_RADIUS
        );
        voidGrad.addColorStop(0, "rgba(255,255,255,0.04)");
        voidGrad.addColorStop(0.5, "rgba(255,255,255,0.015)");
        voidGrad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.beginPath();
        ctx.fillStyle = voidGrad;
        ctx.arc(smoothCursor.x, smoothCursor.y, CURSOR_VOID_RADIUS, 0, Math.PI * 2);
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
