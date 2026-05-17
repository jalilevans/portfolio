"use client";

import { useState, useCallback } from "react";

interface ColorToken {
  cssVar: string;
  label: string;
  value: string;
}

interface ColorGroup {
  name: string;
  tokens: ColorToken[];
}

const INITIAL_GROUPS: ColorGroup[] = [
  {
    name: "Brand & Accent",
    tokens: [
      { cssVar: "--color-primary", label: "Primary", value: "#0066cc" },
      { cssVar: "--color-primary-focus", label: "Primary Focus", value: "#0071e3" },
      { cssVar: "--color-primary-on-dark", label: "Primary on Dark", value: "#2997ff" },
    ],
  },
  {
    name: "Ink / Text",
    tokens: [
      { cssVar: "--color-ink", label: "Ink", value: "#1d1d1f" },
      { cssVar: "--color-ink-muted-80", label: "Ink Muted 80", value: "#333333" },
      { cssVar: "--color-ink-muted-48", label: "Ink Muted 48", value: "#7a7a7a" },
      { cssVar: "--color-body-muted", label: "Body Muted", value: "#cccccc" },
    ],
  },
  {
    name: "Surfaces",
    tokens: [
      { cssVar: "--color-canvas", label: "Canvas", value: "#ffffff" },
      { cssVar: "--color-canvas-parchment", label: "Canvas Parchment", value: "#f5f5f7" },
      { cssVar: "--color-surface-pearl", label: "Surface Pearl", value: "#fafafc" },
      { cssVar: "--color-surface-tile-1", label: "Tile 1", value: "#272729" },
      { cssVar: "--color-surface-tile-2", label: "Tile 2", value: "#2a2a2c" },
      { cssVar: "--color-surface-tile-3", label: "Tile 3", value: "#252527" },
      { cssVar: "--color-surface-black", label: "Surface Black", value: "#000000" },
      { cssVar: "--color-surface-chip-translucent", label: "Chip Translucent", value: "#d2d2d7" },
    ],
  },
  {
    name: "Hairlines",
    tokens: [
      { cssVar: "--color-hairline", label: "Hairline", value: "#e0e0e0" },
      { cssVar: "--color-divider-soft", label: "Divider Soft", value: "#f0f0f0" },
    ],
  },
  {
    name: "Semantic",
    tokens: [
      { cssVar: "--color-background", label: "Background", value: "#ffffff" },
      { cssVar: "--color-foreground", label: "Foreground", value: "#1d1d1f" },
    ],
  },
];

function flattenGroups(groups: ColorGroup[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const group of groups) {
    for (const token of group.tokens) {
      map[token.cssVar] = token.value;
    }
  }
  return map;
}

function isValidHex(value: string): boolean {
  return /^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(value);
}

function normalizeHex(value: string): string {
  const raw = value.startsWith("#") ? value : `#${value}`;
  if (isValidHex(raw)) return raw.toLowerCase();
  return value;
}

export function ThemeEditor() {
  const [open, setOpen] = useState(false);
  const [groups, setGroups] = useState<ColorGroup[]>(INITIAL_GROUPS);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "ok" | "err">("idle");

  const updateToken = useCallback(
    (cssVar: string, rawValue: string) => {
      setGroups((prev) =>
        prev.map((group) => ({
          ...group,
          tokens: group.tokens.map((token) =>
            token.cssVar === cssVar ? { ...token, value: rawValue } : token
          ),
        }))
      );

      const hex = normalizeHex(rawValue);
      if (isValidHex(hex)) {
        document.documentElement.style.setProperty(cssVar, hex);
      }
    },
    []
  );

  const handleHexInput = useCallback(
    (cssVar: string, raw: string) => {
      const normalized = raw.startsWith("#") ? raw : `#${raw}`;
      updateToken(cssVar, normalized);
    },
    [updateToken]
  );

  const handleSave = useCallback(async () => {
    setSaving(true);
    setSaveStatus("idle");

    const colors: Record<string, string> = {};
    for (const group of groups) {
      for (const token of group.tokens) {
        const hex = normalizeHex(token.value);
        if (isValidHex(hex)) {
          colors[token.cssVar] = hex;
        }
      }
    }

    try {
      const res = await fetch("/api/dev/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ colors }),
      });
      setSaveStatus(res.ok ? "ok" : "err");
    } catch {
      setSaveStatus("err");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveStatus("idle"), 2500);
    }
  }, [groups]);

  const handleReset = useCallback(() => {
    const defaults = flattenGroups(INITIAL_GROUPS);
    for (const [cssVar, hex] of Object.entries(defaults)) {
      document.documentElement.style.removeProperty(cssVar);
    }
    setGroups(INITIAL_GROUPS);
  }, []);

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        title="Theme Editor"
        className="fixed bottom-5 right-5 z-9999 w-10 h-10 rounded-full bg-[#1d1d1f] text-white shadow-lg flex items-center justify-center text-base hover:bg-[#333] transition-colors"
        aria-label="Toggle Theme Editor"
      >
        {open ? "✕" : "🎨"}
      </button>

      {/* Panel */}
      {open && (
        <div
          className="fixed bottom-[72px] right-5 z-9998 w-80 max-h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          style={{ background: "#1d1d1f", color: "#f5f5f7" }}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between shrink-0">
            <span className="text-sm font-semibold tracking-tight">Theme Editor</span>
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="text-xs text-white/50 hover:text-white/80 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Scrollable color groups */}
          <div className="overflow-y-auto flex-1 px-4 py-3 space-y-5">
            {groups.map((group) => (
              <div key={group.name}>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-2">
                  {group.name}
                </p>
                <div className="space-y-1.5">
                  {group.tokens.map((token) => (
                    <ColorRow
                      key={token.cssVar}
                      token={token}
                      onChange={handleHexInput}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer / Save */}
          <div className="px-4 py-3 border-t border-white/10 shrink-0">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full rounded-full py-2 text-sm font-medium transition-colors disabled:opacity-50"
              style={{
                background: saveStatus === "ok" ? "#30d158" : saveStatus === "err" ? "#ff453a" : "#0066cc",
                color: "#ffffff",
              }}
            >
              {saving
                ? "Saving…"
                : saveStatus === "ok"
                ? "Saved!"
                : saveStatus === "err"
                ? "Error — try again"
                : "Save to files"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

interface ColorRowProps {
  token: ColorToken;
  onChange: (cssVar: string, value: string) => void;
}

function ColorRow({ token, onChange }: ColorRowProps) {
  const hex = normalizeHex(token.value);
  const valid = isValidHex(hex);

  return (
    <div className="flex items-center gap-2">
      {/* Native color picker — swatch */}
      <label className="shrink-0 relative cursor-pointer">
        <input
          type="color"
          value={valid ? hex : "#000000"}
          onChange={(e) => onChange(token.cssVar, e.target.value)}
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
        />
        <span
          className="block w-6 h-6 rounded-md border border-white/20 shadow-sm"
          style={{ background: valid ? hex : "#000" }}
        />
      </label>

      {/* Label */}
      <span className="flex-1 text-xs text-white/70 truncate">{token.label}</span>

      {/* Hex text input */}
      <input
        type="text"
        value={token.value}
        onChange={(e) => onChange(token.cssVar, e.target.value)}
        maxLength={9}
        spellCheck={false}
        className="w-18 text-xs font-mono rounded-md px-2 py-1 outline-none transition-colors"
        style={{
          background: valid ? "rgba(255,255,255,0.08)" : "rgba(255,69,58,0.25)",
          color: valid ? "#f5f5f7" : "#ff6b6b",
          border: "1px solid rgba(255,255,255,0.12)",
        }}
      />
    </div>
  );
}
