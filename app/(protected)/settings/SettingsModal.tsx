"use client";

// transport-settings — the «Настройки» popup (Figma node 3121:2609). Query-param driven: open when `?settings=1` is on
// the URL (added by the shell gear), overlaying the current page. Backdrop / X / Esc close it (strip the param). Lazily
// loads its data via the `loadSettings` server action; the body is the shared 6-section `SettingsPanel`.

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { loadSettings } from "@/app/actions/settings";
import type { SettingsData } from "@/lib/view-models";
import { SettingsPanel } from "./SettingsPanel";
import "@/app/_design/tokens.css";

const MONO = "'Handjet',monospace";

export function SettingsModal() {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const params = useSearchParams();
  const open = params?.get("settings") === "1";

  const [data, setData] = useState<SettingsData | null>(null);

  const close = () => {
    const p = new URLSearchParams(params?.toString() ?? "");
    p.delete("settings");
    const qs = p.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  // Lazy-load on open; clear on close so the next open re-fetches fresh data.
  useEffect(() => {
    let alive = true;
    if (open) {
      loadSettings().then((d) => { if (alive) setData(d); });
    } else {
      setData(null);
    }
    return () => { alive = false; };
  }, [open]);

  // Esc closes.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, pathname, params]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Настройки"
      onClick={close}
      style={{ position: "fixed", inset: 0, zIndex: 60, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, boxSizing: "border-box" }}
    >
      {/* contained popup window — fixed header + an internal scroll area for the section list (never runs off-screen) */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 900, maxHeight: "calc(100vh - 48px)", display: "flex", flexDirection: "column", background: "var(--surface-app)", borderRadius: 12, boxShadow: "0 24px 80px rgba(0,0,0,0.55), inset 0 0 0 1px var(--hairline-10)", overflow: "hidden" }}
      >
        {/* header — «Настройки» + section counter «6» + X-close (pinned; the body below scrolls) */}
        <div style={{ flex: "none", display: "flex", alignItems: "center", gap: 16, padding: "20px 24px", background: "var(--surface-secondary)", boxShadow: "inset 4px 0 0 0 var(--om-accent)", borderBottom: "1px solid var(--hairline-08)" }}>
          <h1 style={{ margin: 0, fontFamily: "'Manrope',sans-serif", fontWeight: 600, fontSize: 28, color: "var(--text-1)" }}>Настройки</h1>
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", minWidth: 24, height: 24, padding: "0 6px", borderRadius: 4, background: "var(--om-accent)", color: "#fff", fontFamily: MONO, fontSize: 14 }}>6</span>
          <div style={{ flex: 1 }} />
          <button type="button" onClick={close} aria-label="Закрыть" style={{ width: 40, height: 40, flex: "none", borderRadius: 4, border: "none", background: "transparent", color: "var(--text-3)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CloseIcon />
          </button>
        </div>

        {/* scrollable body — a tidy inset, rounded scrollbar tinted like the section cards */}
        <style>{`
          .gigly-modal-scroll::-webkit-scrollbar { width: 12px; }
          .gigly-modal-scroll::-webkit-scrollbar-track { background: transparent; }
          .gigly-modal-scroll::-webkit-scrollbar-thumb {
            background: var(--surface-card);
            border-radius: 999px;
            border: 3px solid transparent;
            background-clip: padding-box;
          }
          .gigly-modal-scroll::-webkit-scrollbar-thumb:hover { background: var(--surface-secondary); background-clip: padding-box; }
        `}</style>
        <div
          className="gigly-modal-scroll"
          style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: 24, scrollbarWidth: "thin", scrollbarColor: "var(--surface-card) transparent" }}
        >
          {data ? (
            <SettingsPanel {...data} />
          ) : (
            <div style={{ padding: 48, textAlign: "center", fontFamily: "'Manrope',sans-serif", fontSize: 14, color: "var(--text-3)" }}>Загрузка…</div>
          )}
        </div>
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
    </svg>
  );
}
