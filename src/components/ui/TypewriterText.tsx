"use client";

import { useEffect, useRef, useState, useCallback, RefObject } from "react";

// ─── Timing constants ──────────────────────────────────────────────────────────
const TYPE_SPEED          = 70;
const DELETE_SPEED        = 16;
const PAUSE_AFTER_TYPED   = 2200;
const PAUSE_BEFORE_NEXT   = 400;
const GLYPHS              = "~*#@!%^&+=?$";
const SCRAMBLE_DURATION   = 80;   // ms total scramble per new character
const SCRAMBLE_TICK       = 18;   // ms between glyph swaps
const COLLAPSE_DURATION   = 50;   // ms implosion animation before char removed
const EXPAND_DURATION     = 130;  // ms scale-in animation for new characters

// ─── Mode type ────────────────────────────────────────────────────────────────
export type TypewriterMode = "classic" | "quantum" | "gravity" | "spacetime";

interface TypewriterTextProps {
  phrases: string[];
}

export function TypewriterText({ phrases }: TypewriterTextProps) {
  const [mode, setMode] = useState<TypewriterMode>("gravity");
  const [chars, setChars] = useState<string[]>([]);
  const [scrambleChar, setScrambleChar] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [collapsingIdx, setCollapsingIdx] = useState<number | null>(null);

  const phraseIndex  = useRef(0);
  const scrambleRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrambleStop = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastCharRef  = useRef<HTMLSpanElement | null>(null);

  // ── Listen for mode changes from dev panel ──────────────────────────────────
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<TypewriterMode>).detail;
      setMode(detail);
    };
    window.addEventListener("typewriter-mode", handler);
    return () => window.removeEventListener("typewriter-mode", handler);
  }, []);

  // ── Scramble helpers ────────────────────────────────────────────────────────
  const stopScramble = useCallback(() => {
    if (scrambleRef.current)  clearInterval(scrambleRef.current);
    if (scrambleStop.current) clearTimeout(scrambleStop.current);
    scrambleRef.current  = null;
    scrambleStop.current = null;
    setScrambleChar(null);
  }, []);

  const startScramble = useCallback((finalChar: string) => {
    stopScramble();
    scrambleRef.current = setInterval(() => {
      setScrambleChar(GLYPHS[Math.floor(Math.random() * GLYPHS.length)]);
    }, SCRAMBLE_TICK);
    scrambleStop.current = setTimeout(() => {
      stopScramble();
      // Lock in the real character — already in `chars`, just clear scramble
    }, SCRAMBLE_DURATION);
  }, [stopScramble]);

  // ── Core typewriter loop ────────────────────────────────────────────────────
  useEffect(() => {
    const current = phrases[phraseIndex.current];
    const displayedText = chars.join("");

    // Pause after fully typed
    if (!isDeleting && displayedText === current) {
      const t = setTimeout(() => setIsDeleting(true), PAUSE_AFTER_TYPED);
      return () => clearTimeout(t);
    }

    // Advance to next phrase after full deletion
    if (isDeleting && chars.length === 0) {
      phraseIndex.current = (phraseIndex.current + 1) % phrases.length;
      const t = setTimeout(() => setIsDeleting(false), PAUSE_BEFORE_NEXT);
      return () => clearTimeout(t);
    }

    // Typing
    if (!isDeleting) {
      const t = setTimeout(() => {
        const nextChar = current[chars.length];
        setChars((prev) => [...prev, nextChar]);

        const useScramble = mode === "quantum" || mode === "spacetime";
        if (useScramble) startScramble(nextChar);
      }, TYPE_SPEED);
      return () => clearTimeout(t);
    }

    // Deleting
    const useCollapse = mode === "gravity" || mode === "spacetime";
    if (useCollapse && collapsingIdx === null) {
      // Flag the last char for collapse animation; removal happens on animationend
      setCollapsingIdx(chars.length - 1);
      return;
    }

    // Plain delete (classic / quantum) or after collapse animation fires
    const t = setTimeout(() => {
      setChars((prev) => prev.slice(0, -1));
      setCollapsingIdx(null);
    }, useCollapse ? COLLAPSE_DURATION : DELETE_SPEED);
    return () => clearTimeout(t);

  }, [chars, isDeleting, mode, phrases, collapsingIdx, startScramble]);

  // ── Fire ripple into the spacetime mesh on each new character ───────────────
  useEffect(() => {
    if (isDeleting || chars.length === 0) return;
    const el = lastCharRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    window.dispatchEvent(
      new CustomEvent("typewriter-ripple", {
        detail: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
      })
    );
  // chars.length is the right dependency — fire once per added character
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chars.length, isDeleting]);

  // ── Cleanup scramble on unmount ─────────────────────────────────────────────
  useEffect(() => () => stopScramble(), [stopScramble]);

  // ── Render ──────────────────────────────────────────────────────────────────
  const useExpand   = mode === "gravity"  || mode === "spacetime";
  const showCaret   = mode === "classic"  || mode === "quantum";

  return (
    <span className="text-primary">
      {chars.map((ch, i) => {
        const isLast     = i === chars.length - 1;
        const isNew      = isLast && !isDeleting;
        const showGlyph  = isNew && scrambleChar !== null;
        const collapsing = i === collapsingIdx;
        const expanding  = isNew && useExpand;

        let charStyle: React.CSSProperties | undefined;
        if (collapsing) {
          charStyle = {
            display: "inline-block",
            animation: `char-collapse ${COLLAPSE_DURATION}ms ease-in forwards`,
          };
        } else if (expanding) {
          charStyle = {
            display: "inline-block",
            animation: `char-expand ${EXPAND_DURATION}ms cubic-bezier(0.4,0,0.2,1) forwards`,
          };
        }

        return (
          <span
            key={i}
            ref={isLast && !isDeleting ? (lastCharRef as RefObject<HTMLSpanElement>) : null}
            style={charStyle}
          >
            {showGlyph ? scrambleChar : ch}
          </span>
        );
      })}

      {/* Classic blinking caret — gravity/spacetime run cursorless */}
      {showCaret && (
        <span
          aria-hidden="true"
          className="inline-block w-[2px] h-[1em] bg-primary align-text-bottom mx-px"
          style={{ animation: "pulse-orb 1s step-start infinite" }}
        />
      )}
    </span>
  );
}
