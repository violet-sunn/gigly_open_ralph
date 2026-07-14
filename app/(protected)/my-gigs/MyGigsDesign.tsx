"use client";

// «Мои гиги» rebuilt on the prototype's «МОИ ГИГИ» block (Gigly App.dc.html line 272+): the status tabs + a 2-col
// grid of FULL design GigCards + the centred empty state. Tab filtering is client-side over the MyGigCard tabKey.
// The shell header supplies the «МОИ ГИГИ» title, so no in-content title here.

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import type { GigCardVM } from "@/app/components/blocks/view-models";
import { GigCard } from "@/app/_design/GigCard";
import { applyGigFilters } from "@/app/_design/util";
import { useIsNarrow } from "@/app/_design/useIsNarrow";
import "@/app/_design/tokens.css";

type Card = GigCardVM & { tabKey: string };

export function MyGigsDesign({
  gigCards,
  tabs,
}: {
  gigCards: Card[];
  tabs: { value: string; label: string; count?: number }[];
}) {
  const [tab, setTab] = useState("all");
  const params = useSearchParams();
  const isNarrow = useIsNarrow(); // phone-width reflow (Гигли баги #5): single-column card grid at <1024px
  const tabbed = tab === "all" ? gigCards : gigCards.filter((g) => g.tabKey === tab);
  const feed = applyGigFilters(tabbed, params); // header chips (category/budget/rating/sort) filter this feed too

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {tabs.map((t) => {
          const active = tab === t.value;
          return (
            <div
              key={t.value}
              onClick={() => setTab(t.value)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                height: 36,
                padding: "0 14px",
                borderRadius: 8,
                cursor: "pointer",
                background: active ? "var(--surface-secondary)" : "transparent",
                boxShadow: active ? "inset 0 0 0 1px var(--hairline-08)" : "inset 0 0 0 1px transparent",
              }}
            >
              <span style={{ fontSize: 14, color: active ? "var(--switch-active-fg, var(--text-1))" : "var(--text-3)" }}>{t.label}</span>
              <span style={{ fontFamily: "'Handjet',monospace", fontSize: 14, color: active ? "var(--om-accent, #0088ff)" : "var(--text-4)" }}>{t.count ?? 0}</span>
            </div>
          );
        })}
      </div>

      {feed.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: isNarrow ? "minmax(0, 1fr)" : "1fr 1fr", gap: isNarrow ? 12 : 24 }}>
          {feed.map((g) => (
            <GigCard key={g.id} vm={g} full />
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
          <div style={{ width: 420, maxWidth: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, textAlign: "center" }}>
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
                <path d="M5 10.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z" />
                <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm0 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3z" />
              </svg>
            </div>
            <h2 style={{ margin: 0, fontFamily: "'Handjet',monospace", fontWeight: 600, fontSize: 22, color: "var(--text-1)" }}>Здесь пока пусто</h2>
            <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 14, lineHeight: "20px", color: "var(--text-3)" }}>
              Гигов с таким статусом нет. Они появятся здесь, когда изменится статус работ.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
