"use client";

import { useCallback, useEffect, useState } from "react";
import {
  FONT_PRESETS,
  getFontPresetById,
  googleFontStylesheetUrl,
  livePreviewFontStack,
  type FontPreset,
} from "@/lib/dev/fontPresets";

const LINK_ID = "dev-font-playground-stylesheet";

function ensureStylesheet(href: string) {
  let link = document.getElementById(LINK_ID) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.id = LINK_ID;
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }
  link.href = href;
}

function clearPreview() {
  document.getElementById(LINK_ID)?.remove();
  document.documentElement.style.removeProperty("--font-display");
  document.documentElement.style.removeProperty("--font-body");
  document.documentElement.style.removeProperty("--font-sans");
}

function applyPreview(preset: FontPreset) {
  ensureStylesheet(googleFontStylesheetUrl(preset));
  const stack = livePreviewFontStack(preset);
  document.documentElement.style.setProperty("--font-display", stack);
  document.documentElement.style.setProperty("--font-body", stack);
  document.documentElement.style.setProperty("--font-sans", stack);
}

export function FontEditor() {
  const [open, setOpen] = useState(false);
  const [presetList, setPresetList] = useState<{ id: string; label: string }[]>(
    () => FONT_PRESETS.map((p) => ({ id: p.id, label: p.label }))
  );
  const [savedPresetId, setSavedPresetId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "ok" | "err">("idle");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/dev/font");
        const data = (await res.json()) as {
          presetId: string | null;
          presets?: { id: string; label: string }[];
        };
        if (cancelled) return;
        if (Array.isArray(data.presets) && data.presets.length > 0) {
          setPresetList(data.presets);
        }
        const id = data.presetId ?? FONT_PRESETS[0]?.id ?? "inter";
        setSavedPresetId(id);
        setSelectedId(id);
      } catch {
        if (!cancelled) {
          const fallback = FONT_PRESETS[0]?.id ?? "inter";
          setSavedPresetId(fallback);
          setSelectedId(fallback);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      clearPreview();
    };
  }, []);

  useEffect(() => {
    if (!selectedId || savedPresetId === null) return;
    if (selectedId === savedPresetId) {
      clearPreview();
      return;
    }
    const preset = getFontPresetById(selectedId);
    if (preset) applyPreview(preset);
  }, [selectedId, savedPresetId]);

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const handleReset = useCallback(() => {
    if (savedPresetId) setSelectedId(savedPresetId);
  }, [savedPresetId]);

  const handleSave = useCallback(async () => {
    if (!selectedId) return;
    setSaving(true);
    setSaveStatus("idle");
    try {
      const res = await fetch("/api/dev/font", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ presetId: selectedId }),
      });
      if (res.ok) {
        setSavedPresetId(selectedId);
        clearPreview();
        setSaveStatus("ok");
      } else {
        setSaveStatus("err");
      }
    } catch {
      setSaveStatus("err");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveStatus("idle"), 2500);
    }
  }, [selectedId]);

  const dirty = selectedId !== null && savedPresetId !== null && selectedId !== savedPresetId;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title="Font playground"
        className="fixed bottom-5 right-18 z-9999 w-10 h-10 rounded-full bg-[#1d1d1f] text-white shadow-lg flex items-center justify-center text-sm font-semibold hover:bg-[#333] transition-colors"
        aria-label="Toggle font playground"
      >
        {open ? "✕" : "Aa"}
      </button>

      {open && (
        <div
          className="fixed bottom-[72px] right-18 z-9998 w-80 max-h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          style={{ background: "#1d1d1f", color: "#f5f5f7" }}
        >
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between shrink-0">
            <span className="text-sm font-semibold tracking-tight">Font playground</span>
            <button
              type="button"
              onClick={handleReset}
              disabled={!dirty}
              className="text-xs text-white/50 hover:text-white/80 transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              Revert
            </button>
          </div>

          <p className="px-4 pt-3 text-[10px] font-semibold uppercase tracking-widest text-white/40">
            Google Fonts (saved to layout.tsx)
          </p>

          <div className="overflow-y-auto flex-1 px-4 py-3 space-y-1">
            {presetList.map((p) => {
              const active = p.id === selectedId;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelect(p.id)}
                  className={`w-full text-left rounded-lg px-3 py-2 text-sm transition-colors ${
                    active ? "bg-white/15 text-white" : "bg-white/5 text-white/80 hover:bg-white/10"
                  }`}
                  style={{
                    fontFamily: getFontPresetById(p.id)
                      ? livePreviewFontStack(getFontPresetById(p.id)!)
                      : undefined,
                  }}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          <div className="px-4 py-3 border-t border-white/10 shrink-0">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !dirty}
              className="w-full rounded-full py-2 text-sm font-medium transition-colors disabled:opacity-50"
              style={{
                background:
                  saveStatus === "ok"
                    ? "#30d158"
                    : saveStatus === "err"
                      ? "#ff453a"
                      : "#0066cc",
                color: "#ffffff",
              }}
            >
              {saving
                ? "Saving…"
                : saveStatus === "ok"
                  ? "Saved!"
                  : saveStatus === "err"
                    ? "Error — try again"
                    : dirty
                      ? "Save to layout.tsx"
                      : "No changes"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
