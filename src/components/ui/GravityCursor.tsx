"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const INTERACTIVE = 'a, button, [role="button"], input, select, textarea, label, [tabindex]';

const LERP_POS  = 0.12;
const LERP_MISC = 0.18;

const DOT_SIZE   = 10;
const RING_IDLE  = 30;
const RING_HOVER = 18;

const OPACITY_IDLE  = 0.6;
const OPACITY_HOVER = 0.9;
const OPACITY_PRESS = 1.0;

export function GravityCursor() {
  const [mounted, setMounted] = useState(false);
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Touch-only devices have no cursor — skip entirely
    if (window.matchMedia("(pointer: coarse)").matches) return;

    setMounted(true);

    const exact  = { x: -300, y: -300 };
    const smooth = { x: -300, y: -300 };

    let ringSize   = RING_IDLE;
    let opacityVal = 0;
    let isHovered  = false;
    let isPressed  = false;
    let isVisible  = false;
    let rafId: number;

    function onMouseMove(e: MouseEvent) {
      exact.x = e.clientX;
      exact.y = e.clientY;
      isVisible = true;
    }

    function onMouseOver(e: MouseEvent) {
      isHovered = !!(e.target as Element).closest(INTERACTIVE);
    }

    function onMouseDown() { isPressed = true; }
    function onMouseUp()   { isPressed = false; }

    // Hide when pointer leaves the document
    function onDocLeave(e: MouseEvent) {
      if (!e.relatedTarget) isVisible = false;
    }
    function onDocEnter() { isVisible = true; }

    function tick() {
      smooth.x += (exact.x - smooth.x) * LERP_POS;
      smooth.y += (exact.y - smooth.y) * LERP_POS;

      ringSize += ((isHovered ? RING_HOVER : RING_IDLE) - ringSize) * LERP_MISC;

      const targetOpacity = !isVisible
        ? 0
        : isPressed
        ? OPACITY_PRESS
        : isHovered
        ? OPACITY_HOVER
        : OPACITY_IDLE;
      opacityVal += (targetOpacity - opacityVal) * LERP_MISC;

      if (dotRef.current) {
        const half = DOT_SIZE / 2;
        dotRef.current.style.transform = `translate(${exact.x - half}px, ${exact.y - half}px)`;
        dotRef.current.style.opacity   = String(opacityVal);
      }

      if (ringRef.current) {
        const half = ringSize / 2;
        ringRef.current.style.transform = `translate(${smooth.x - half}px, ${smooth.y - half}px)`;
        ringRef.current.style.width     = `${ringSize}px`;
        ringRef.current.style.height    = `${ringSize}px`;
        ringRef.current.style.opacity   = String(opacityVal);
      }

      rafId = requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove",  onMouseMove);
    window.addEventListener("mouseover",  onMouseOver);
    window.addEventListener("mousedown",  onMouseDown);
    window.addEventListener("mouseup",    onMouseUp);
    document.addEventListener("mouseleave", onDocLeave);
    document.addEventListener("mouseenter", onDocEnter);

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove",  onMouseMove);
      window.removeEventListener("mouseover",  onMouseOver);
      window.removeEventListener("mousedown",  onMouseDown);
      window.removeEventListener("mouseup",    onMouseUp);
      document.removeEventListener("mouseleave", onDocLeave);
      document.removeEventListener("mouseenter", onDocEnter);
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9999 }}
      aria-hidden="true"
    >
      {/* Dot — tracks the true cursor position with zero lag */}
      <div
        ref={dotRef}
        className="absolute rounded-full bg-primary"
        style={{
          width:  DOT_SIZE,
          height: DOT_SIZE,
          top:    0,
          left:   0,
          willChange: "transform, opacity",
        }}
      />

      {/* Ring — spring-follows the cursor; contracts on interactive hover */}
      <div
        ref={ringRef}
        className="absolute rounded-full border border-primary"
        style={{
          top:    0,
          left:   0,
          willChange: "transform, width, height, opacity",
        }}
      />
    </div>,
    document.body
  );
}
