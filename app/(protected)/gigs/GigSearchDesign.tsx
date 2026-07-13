"use client";

// Gig browse/search rebuilt on the prototype's «ПОИСК ГИГОВ» block (Gigly App.dc.html line 238+): «Найдено {count}» +
// a 2-col grid of FULL design GigCards + the centred empty state. The filter row (category / budget / sort / rating)
// lives in the SHARED SHELL HEADER beside the search field (the prototype's data-dc-tpl="51" cluster), not here — the
// shell owns the URL-param wiring so the filters sit to the right of the search on every list screen. This screen only
// reads those params (to preserve them on the card links + the reset button).

import { useRouter, useSearchParams } from "next/navigation";
import { GigCard } from "@/app/_design/GigCard";
import type { GigSearchData } from "@/lib/view-models";
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

export function GigSearchDesign({ data }: { data: GigSearchData }) {
  const router = useRouter();
  const params = useSearchParams();
  const cards = data.gigCards;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Найдено (the filter chips are in the shell header) */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <h2 style={h2}>Найдено</h2>
        <span style={countBadge}>{data.count}</span>
      </div>

      {cards.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {cards.map((vm) => (
            <GigCard key={vm.id} vm={vm} full href={`/gigs/${vm.id}?from=browse&${params?.toString() ?? ""}`} />
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
