"use client";

// Shared admin row vocabulary transported from the prototype's moderation console (dashboard.admin): the card frame,
// section heading, list-row frame, small action button, the colour avatar, and the status dot. Reused by the console
// AND the /admin/users · /admin/gigs tables so all three share one row look (the tables have no own reference screen —
// their target IS these rows).

import { avatarColor } from "@/app/_design/util";
import "@/app/_design/tokens.css";

export const cardBase: React.CSSProperties = { borderRadius: 12, background: "var(--surface-card)", boxShadow: "inset 0 0 0 1px var(--hairline-08)", padding: 20, display: "flex", flexDirection: "column", gap: 14 };
export const h2: React.CSSProperties = { margin: 0, fontFamily: "'Handjet',monospace", fontWeight: 600, fontSize: 22, color: "var(--text-1)" };
export const rowBase: React.CSSProperties = { display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 8, background: "var(--surface-sunken)", boxShadow: "inset 0 0 0 1px var(--hairline-06)" };
export const smallBtn = (bg: string, color: string): React.CSSProperties => ({ flex: "none", height: 32, padding: "0 14px", border: "none", borderRadius: 7, background: bg, color, fontSize: 12, cursor: "pointer" });

export function StatusDot({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, flex: "none", fontFamily: "'Handjet',monospace", fontSize: 12, color }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: color }} />
      {label}
    </span>
  );
}

export function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  return (
    <span style={{ width: size, height: size, flex: "none", borderRadius: "50%", background: avatarColor(name || "?"), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>
      {(name || "?").slice(0, 1).toUpperCase()}
    </span>
  );
}

/** Native token-styled filter dropdown — replaces the kit `Select` on the admin tables (URL-driven). */
export function FilterSelect({
  value,
  options,
  onChange,
  ariaLabel,
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
  ariaLabel: string;
}) {
  return (
    <select
      aria-label={ariaLabel}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ height: 38, padding: "0 14px", borderRadius: 8, background: "var(--surface-sunken)", boxShadow: "inset 0 0 0 1px var(--hairline-08)", border: "none", outline: "none", color: "var(--text-1)", fontFamily: "'Manrope',sans-serif", fontSize: 13, cursor: "pointer" }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} style={{ background: "var(--surface-card)", color: "var(--text-1)" }}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
