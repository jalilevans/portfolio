"use client";

import { useState } from "react";
import type { TypewriterMode } from "@/components/ui/TypewriterText";

interface ModeCard {
  id: TypewriterMode;
  label: string;
  description: string;
  preview: string;
}

const MODES: ModeCard[] = [
  {
    id: "classic",
    label: "Classic",
    description: "Plain type / delete, blinking bar cursor.",
    preview: "Hello_",
  },
  {
    id: "quantum",
    label: "Quantum",
    description: "Each new character scrambles through random glyphs before locking.",
    preview: "He#@o●",
  },
  {
    id: "gravity",
    label: "Gravity",
    description: "Pulsing orb cursor. Deleted characters implode to a point.",
    preview: "Hello●",
  },
  {
    id: "spacetime",
    label: "Spacetime",
    description: "Scramble on type + implosion on delete + orb cursor.",
    preview: "H#@%o●",
  },
];

export function TypewriterEditor() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<TypewriterMode>("classic");

  function selectMode(mode: TypewriterMode) {
    setActive(mode);
    window.dispatchEvent(new CustomEvent("typewriter-mode", { detail: mode }));
  }

  return (
    <>
      {/* Toggle button — sits above ThemeEditor (bottom-[132px]) */}
      <button
        onClick={() => setOpen((v) => !v)}
        title="Typewriter Effect"
          className="fixed bottom-[132px] right-5 z-9999 w-10 h-10 rounded-full bg-[#1d1d1f] text-white shadow-lg flex items-center justify-center text-base hover:bg-[#333] transition-colors"
        aria-label="Toggle Typewriter Mode Editor"
      >
        {open ? "✕" : "✦"}
      </button>

      {/* Panel */}
      {open && (
        <div
          className="fixed bottom-[180px] right-5 z-9998 w-72 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          style={{ background: "#1d1d1f", color: "#f5f5f7" }}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-white/10 shrink-0">
            <span className="text-sm font-semibold tracking-tight">Typewriter Effect</span>
          </div>

          {/* Mode cards */}
          <div className="p-3 space-y-2">
            {MODES.map((m) => {
              const isActive = active === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => selectMode(m.id)}
                  className="w-full text-left rounded-xl px-3 py-2.5 transition-colors"
                  style={{
                    background: isActive ? "rgba(108,88,76,0.25)" : "rgba(255,255,255,0.05)",
                    border: `1px solid ${isActive ? "#6c584c" : "rgba(255,255,255,0.08)"}`,
                  }}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-semibold" style={{ color: isActive ? "#a98467" : "#f5f5f7" }}>
                      {m.label}
                    </span>
                    <span
                      className="font-mono text-[10px]"
                      style={{ color: isActive ? "#a98467" : "rgba(255,255,255,0.3)" }}
                    >
                      {m.preview}
                    </span>
                  </div>
                  <p className="text-[10px] leading-snug" style={{ color: "rgba(255,255,255,0.45)" }}>
                    {m.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Footer hint */}
          <div className="px-4 pb-3 pt-1">
            <p className="text-[9px] text-white/25 leading-snug">
              Changes apply live — scroll to the hero to preview.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
