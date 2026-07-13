// «Требует внимания» card rebuilt on the prototype's AttentionCard (design-system/source/AttentionCard.jsx): a
// type-coloured left bar + radial wash, a marker column (emoji) + title/date header, and the embedded gig card (the
// clickable part → gig detail). Notification-TYPE accents (distinct from gig status).

import Link from "next/link";
import type { AttentionCardVM } from "@/app/components/blocks/view-models";
import { GigCard } from "./GigCard";
import "./tokens.css";

const TYPE_RGB: Record<string, string> = {
  "status-change": "124,58,237",
  accepted: "16,185,129",
  rejected: "239,68,68",
  payment: "0,200,179",
  message: "0,136,255",
  deadline: "255,141,40",
};

export function AttentionCardDesign({ vm }: { vm: AttentionCardVM }) {
  const rgb = TYPE_RGB[vm.type] ?? "0,136,255";
  return (
    <div
      style={{
        width: 280,
        flex: "none",
        borderRadius: 12,
        overflow: "hidden",
        background: `radial-gradient(474px 1231px at 0% 100%, rgba(${rgb},0.21) 0%, rgba(255,255,255,0) 100%), linear-gradient(rgba(255,255,255,0.05),rgba(255,255,255,0.05))`,
        boxShadow: `inset 0 0 0 1px var(--hairline-10), inset 4px 0 0 0 rgb(${rgb})`,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: "0 0 12px 0",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", alignItems: "stretch" }}>
        <div
          style={{
            width: 34,
            flex: "none",
            background: `rgb(${rgb})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 6,
          }}
        >
          <span style={{ fontSize: 22, lineHeight: 1 }}>{vm.marker}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 12, padding: 12 }}>
          <span
            style={{
              flex: 1,
              minWidth: 0,
              fontFamily: "'Handjet',monospace",
              fontWeight: 600,
              fontSize: 16,
              lineHeight: "20px",
              color: "var(--text-1)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {vm.title}
          </span>
          <span style={{ fontFamily: "'Handjet',monospace", fontSize: 12, color: "var(--text-4)", flex: "none" }}>{vm.date}</span>
        </div>
      </div>
      <div style={{ padding: "0 12px 0 16px", display: "flex", flexDirection: "column", gap: 12 }}>
        {vm.embed.kind === "gig" ? (
          <>
            <GigCard vm={vm.embed.gig} />
            <Link
              href={`/gigs/${vm.embed.gig.id}`}
              style={{
                height: 40,
                borderRadius: 8,
                background: "var(--om-accent, #0088ff)",
                color: "#fff",
                fontSize: 14,
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
              }}
            >
              {vm.cta}
            </Link>
          </>
        ) : (
          <div
            style={{
              borderRadius: 12,
              background: "var(--surface-card)",
              boxShadow: "inset 0 0 0 1px var(--hairline-08)",
              padding: 14,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)" }}>{vm.embed.name}</span>
            <span style={{ fontSize: 13, color: "var(--text-3)" }}>{vm.embed.preview}</span>
          </div>
        )}
      </div>
    </div>
  );
}
