"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Base outward angle from center (radians) — used when respawning */
  angle: number;
  radius: number;
  baseAlpha: number;
  speed: number;
  /** 0 = ink, 1 = warm primary tint */
  tint: 0 | 1;
}

const GRAVITY_RADIUS = 185;
const GRAVITY_STRENGTH = 0.006;
const SPAWN_SCATTER = 80; // px around center to respawn within

function makeLayer(): { speed: number; radius: number; baseAlpha: number } {
  const r = Math.random();
  if (r < 0.60) {
    return { speed: 0.10 + Math.random() * 0.12, radius: 0.5,  baseAlpha: 0.07 + Math.random() * 0.07 };
  } else if (r < 0.85) {
    return { speed: 0.22 + Math.random() * 0.20, radius: 1.0,  baseAlpha: 0.14 + Math.random() * 0.10 };
  } else {
    return { speed: 0.42 + Math.random() * 0.32, radius: 1.5 + Math.random() * 0.7, baseAlpha: 0.22 + Math.random() * 0.12 };
  }
}

/** Place a star at a random position in the canvas, velocity pointing outward from center */
function initStar(w: number, h: number): Star {
  const cx = w / 2;
  const cy = h / 2;
  const x = Math.random() * w;
  const y = Math.random() * h;
  const dx = x - cx || 0.01;
  const dy = y - cy || 0.01;
  const angle = Math.atan2(dy, dx);
  const { speed, radius, baseAlpha } = makeLayer();
  return {
    x, y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    angle,
    speed,
    radius,
    baseAlpha,
    tint: Math.random() < 0.07 ? 1 : 0,
  };
}

/** Spawn a star near center with a fresh outward angle — called when a star exits the canvas */
function respawnStar(w: number, h: number, star: Star): void {
  const cx = w / 2;
  const cy = h / 2;
  const angle = Math.random() * Math.PI * 2;
  const spawnR = Math.random() * SPAWN_SCATTER;
  star.x = cx + Math.cos(angle) * spawnR;
  star.y = cy + Math.sin(angle) * spawnR;
  const { speed, radius, baseAlpha } = makeLayer();
  star.angle = angle;
  star.speed = speed;
  star.radius = radius;
  star.baseAlpha = baseAlpha;
  star.vx = Math.cos(angle) * speed;
  star.vy = Math.sin(angle) * speed;
  star.tint = Math.random() < 0.07 ? 1 : 0;
}

export function ParticleStarfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio ?? 1;
    let rafId: number;
    let stars: Star[] = [];
    let w = 0;
    let h = 0;
    const cursor = { x: -9999, y: -9999, active: false };

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx!.scale(dpr, dpr);
      const count = w < 768 ? 150 : 300;
      stars = Array.from({ length: count }, () => initStar(w, h));
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
      ctx.clearRect(0, 0, w, h);

      for (const s of stars) {
        // Gravity — only acts on stars within GRAVITY_RADIUS
        let gravityBoost = 0;
        if (cursor.active) {
          const dx = cursor.x - s.x;
          const dy = cursor.y - s.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < GRAVITY_RADIUS && dist > 0) {
            const pull = (1 - dist / GRAVITY_RADIUS) * GRAVITY_STRENGTH;
            s.vx += (dx / dist) * pull;
            s.vy += (dy / dist) * pull;
            gravityBoost = (1 - dist / GRAVITY_RADIUS) * 0.18;
          }
        }

        // Clamp speed — let gravity bend trajectory but don't let stars accelerate indefinitely
        const spd = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
        const maxSpd = s.speed * 3.5;
        if (spd > maxSpd) {
          s.vx = (s.vx / spd) * maxSpd;
          s.vy = (s.vy / spd) * maxSpd;
        }

        s.x += s.vx;
        s.y += s.vy;

        // Respawn stars that have drifted off canvas
        const margin = 4;
        if (s.x < -margin || s.x > w + margin || s.y < -margin || s.y > h + margin) {
          respawnStar(w, h, s);
        }

        // Distance from center — stars near center are dimmer (just entering frame)
        const cx = w / 2;
        const cy = h / 2;
        const distFromCenter = Math.sqrt((s.x - cx) ** 2 + (s.y - cy) ** 2);
        const maxDist = Math.sqrt(cx * cx + cy * cy);
        const depthFade = Math.min(1, distFromCenter / (maxDist * 0.25));

        const alpha = (s.baseAlpha + gravityBoost) * depthFade;
        if (alpha < 0.01) continue;

        ctx.beginPath();
        if (s.tint === 1) {
          ctx.fillStyle = `rgba(108,88,76,${alpha.toFixed(3)})`;
        } else {
          ctx.fillStyle = `rgba(32,30,30,${alpha.toFixed(3)})`;
        }
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
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
