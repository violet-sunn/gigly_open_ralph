// Reusable GigCard rebuilt DIRECTLY on the prototype's own «Gig Card.dc.html» markup (inline styles ported verbatim).
// Compact (full=false) for the dashboard/my-gigs feeds; full=true adds the Фикс.цена/Срок footer + «К проекту» for
// the search results. The whole card links to the gig detail. Wired to the (extended) GigCardVM.

import Link from "next/link";
import type { GigCardVM } from "@/app/components/blocks/view-models";
import { avatarColor, PatchIcon, STATUS_RGB, STATUS_LABEL_RU, CAT_RGB, CAT_LABEL } from "./util";
import "./tokens.css";

export function GigCard({ vm, full = false, href }: { vm: GigCardVM; full?: boolean; href?: string }) {
  const rgb = STATUS_RGB[vm.status] ?? "255,255,255";
  const statusDot = `rgb(${rgb})`;
  const radial = `radial-gradient(120% 100% at 50% 0%, rgba(${rgb},0.22) 0%, rgba(${rgb},0.05) 45%, rgba(${rgb},0) 100%), var(--surface-card)`;
  const borderColor = `rgba(${rgb},0.3)`;
  const catRgb = CAT_RGB[vm.category] ?? "0,136,255";
  const company = vm.company ?? vm.clientName ?? "—";

  return (
    <Link href={href ?? `/gigs/${vm.id}`} style={{ textDecoration: "none", display: "block" }}>
      <div style={{ borderRadius: 16, background: radial, boxShadow: `inset 0 0 0 1px ${borderColor}`, display: "flex", flexDirection: "column" }}>
        {/* status + time */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: "none" }}>
            <span style={{ width: 8, height: 8, flex: "none", borderRadius: "50%", background: statusDot }} />
            <span style={{ fontFamily: "'Handjet',monospace", fontSize: 15, color: statusDot, whiteSpace: "nowrap" }}>
              {STATUS_LABEL_RU[vm.status] ?? vm.status}
            </span>
          </div>
          {vm.postedAt && (
            <span style={{ fontFamily: "'Handjet',monospace", fontSize: 12, color: "var(--text-3)", flex: "none", whiteSpace: "nowrap" }}>
              {vm.postedAt}
            </span>
          )}
        </div>

        {/* inner card */}
        <div
          style={{
            borderRadius: 16,
            background: "var(--surface-card)",
            boxShadow: "inset 0 0 0 1px var(--hairline-08), inset 0 1px 0 var(--hairline-06)",
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
              <span
                style={{
                  width: 22,
                  height: 22,
                  flex: "none",
                  borderRadius: "50%",
                  background: avatarColor(company),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {company.slice(0, 1)}
              </span>
              <span style={{ fontSize: 13, color: "var(--text-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {company}
              </span>
              {vm.rating.verified && (
                <span style={{ color: "var(--om-accent, #0088ff)", display: "flex", flex: "none" }}>
                  <PatchIcon size={16} />
                </span>
              )}
              <span style={{ color: "var(--text-5)", fontSize: 11, letterSpacing: 1, flex: "none" }}>★★★★★</span>
              <span style={{ color: "var(--text-4)", fontSize: 11, flex: "none" }}>{vm.rating.count}</span>
            </div>
            <span
              style={{
                flex: "none",
                fontSize: 12,
                color: `rgb(${catRgb})`,
                border: `1px solid rgba(${catRgb},0.45)`,
                borderRadius: 6,
                padding: "2px 8px",
              }}
            >
              {CAT_LABEL[vm.category] ?? vm.category}
            </span>
          </div>

          <span style={{ fontWeight: 600, fontSize: 17, lineHeight: "21px", color: "var(--text-1)" }}>{vm.title}</span>

          {vm.tags.length > 0 && (
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {vm.tags.map((t, i) => (
                <span key={i} style={{ fontSize: 12, color: "var(--accent-ink, #4ea3ff)", background: "rgba(0,136,255,0.1)", borderRadius: 6, padding: "3px 8px" }}>
                  {t}
                </span>
              ))}
            </div>
          )}

          {vm.description && (
            <span
              style={{
                fontSize: 14,
                lineHeight: "18px",
                color: "var(--text-3)",
                opacity: 0.85,
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                overflow: "hidden",
              }}
            >
              {vm.description}
            </span>
          )}

          {vm.timeline && (
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 2 }}>
              <span style={{ fontFamily: "'Handjet',monospace", fontSize: 12, color: "var(--text-3)" }}>{vm.timeline.start}</span>
              <div style={{ flex: 1, height: 4, borderRadius: 3, background: "rgba(159,160,164,0.4)", overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 3, background: "var(--text-3)", width: vm.timeline.progress }} />
              </div>
              <span style={{ fontFamily: "'Handjet',monospace", fontSize: 12, color: "var(--text-3)" }}>{vm.timeline.end}</span>
            </div>
          )}
        </div>

        {/* full footer (search results) */}
        {full && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16, padding: "14px 20px" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 11, letterSpacing: "0.2px", color: "var(--text-3)" }}>Фикс. цена</span>
              <span style={{ fontWeight: 600, fontSize: 15, color: "var(--text-1)" }}>{vm.budget}</span>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 11, letterSpacing: "0.2px", color: "var(--text-3)" }}>Срок выполнения</span>
              <span style={{ fontWeight: 600, fontSize: 15, color: "var(--text-1)" }}>{vm.deadlineDays} дней</span>
            </div>
            <span
              style={{
                flex: "none",
                height: 40,
                padding: "0 22px",
                borderRadius: 8,
                background: "var(--om-accent, #0088ff)",
                color: "#fff",
                fontSize: 14,
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              К проекту
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
