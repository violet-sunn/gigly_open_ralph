"use client";

// Gig browse/search rebuilt on the prototype's «ПОИСК ГИГОВ» block (Gigly App.dc.html line 238+): a filter row +
// «Найдено {count}» + a 2-col grid of FULL design GigCards + the centred empty state. Filters are URL params (so
// pagination preserves them); the page owns the query + PaginationControls. The shell header supplies the title.

import { useRouter, useSearchParams } from "next/navigation";
import { GigCard } from "@/app/_design/GigCard";
import type { GigSearchData } from "@/lib/view-models";
import type { SelectOption } from "@/app/components/primitives";
import "@/app/_design/tokens.css";

const h2: React.CSSProperties = {
  margin: 0,
  fontFamily: "'Handjet',monospace",
  fontWeight: 600,
  fontSize: 26,
  color: "var(--text-1)",
  whiteSpace: "nowrap",
  flex: "none",
};
const countBadge: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: 24,
  height: 24,
  padding: "0 7px",
  borderRadius: 6,
  background: "var(--om-accent, #0088ff)",
  color: "#fff",
  fontFamily: "'Handjet',monospace",
  fontWeight: 700,
  fontSize: 15,
};

function DSelect({ value, onChange, options, ariaLabel }: { value: string; onChange: (v: string) => void; options: SelectOption[]; ariaLabel: string }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={ariaLabel}
      style={{
        height: 48,
        padding: "0 14px",
        borderRadius: 8,
        background: "var(--surface-sunken)",
        color: "var(--text-1)",
        border: "none",
        boxShadow: "inset 0 0 0 1px var(--hairline-08)",
        fontFamily: "'Handjet',monospace",
        fontSize: 15,
        outline: "none",
        cursor: "pointer",
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} style={{ background: "var(--surface-card)", color: "var(--text-1)" }}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function GigSearchDesign({
  data,
  categoryOptions,
  sortOptions,
  ratingOptions,
}: {
  data: GigSearchData;
  categoryOptions: SelectOption[];
  sortOptions: SelectOption[];
  ratingOptions: SelectOption[];
}) {
  const router = useRouter();
  const params = useSearchParams();

  const nav = (mut: (p: URLSearchParams) => void) => {
    const p = new URLSearchParams(params.toString());
    mut(p);
    p.delete("page");
    router.push(`/gigs?${p.toString()}`);
  };
  const set = (key: string, value: string, clearWhen?: string) =>
    nav((p) => (value && value !== clearWhen ? p.set(key, value) : p.delete(key)));

  const cards = data.gigCards;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* filter row (text search lives in the shell header → ?search=; these refine it) */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <DSelect ariaLabel="Категория" value={params.get("category") ?? ""} onChange={(c) => set("category", c)} options={categoryOptions} />
        <DSelect ariaLabel="Сортировка" value={params.get("sort") ?? "newest"} onChange={(s) => set("sort", s, "newest")} options={sortOptions} />
        <DSelect ariaLabel="Минимальный рейтинг" value={params.get("minRating") ?? ""} onChange={(r) => set("minRating", r)} options={ratingOptions} />
      </div>

      {/* Найдено */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <h2 style={h2}>Найдено</h2>
        <span style={countBadge}>{data.count}</span>
      </div>

      {cards.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {cards.map((vm) => (
            <GigCard key={vm.id} vm={vm} full href={`/gigs/${vm.id}?from=browse&${params.toString()}`} />
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 340 }}>
          <div style={{ width: 420, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, textAlign: "center" }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "var(--hairline-05)",
                boxShadow: "inset 0 0 0 1px var(--hairline-10)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-3)",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
              </svg>
            </div>
            <h2 style={{ margin: 0, fontFamily: "'Handjet',monospace", fontWeight: 600, fontSize: 22, color: "var(--text-1)" }}>Ничего не нашлось</h2>
            <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 14, lineHeight: "20px", color: "var(--text-3)" }}>
              По вашему запросу нет гигов. Попробуйте изменить формулировку или сбросить фильтры.
            </span>
            <button
              type="button"
              onClick={() => router.push("/gigs")}
              style={{ height: 42, padding: "0 22px", border: "none", borderRadius: 8, background: "var(--om-accent, #0088ff)", color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer" }}
            >
              Сбросить фильтры
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
