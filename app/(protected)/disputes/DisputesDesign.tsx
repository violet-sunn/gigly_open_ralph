"use client";

// «Споры» list rebuilt on the prototype's `disputes` block (Gigly App.dc.html line 819+): the header + intro + the
// dispute rows (avatar + gig title + reason·opener·created + amount + status) or the centred empty state. Rows open
// the dispute detail. The shell header supplies the «СПОРЫ» title.

import { useRouter } from "next/navigation";
import type { DisputesData } from "@/lib/view-models";
import { avatarColor, STATUS_RGB, STATUS_LABEL_RU } from "@/app/_design/util";
import "@/app/_design/tokens.css";

export function DisputesDesign({ disputes }: DisputesData) {
  const router = useRouter();
  const list = disputes.disputes;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 880 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <h2 style={{ margin: 0, fontFamily: "'Handjet',monospace", fontWeight: 600, fontSize: 24, color: "var(--text-1)", whiteSpace: "nowrap" }}>Споры</h2>
        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", minWidth: 24, height: 24, padding: "0 7px", borderRadius: 6, background: "var(--om-accent, #0088ff)", color: "#fff", fontFamily: "'Handjet',monospace", fontWeight: 700, fontSize: 15 }}>
          {list.length}
        </span>
      </div>
      <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, lineHeight: "18px", color: "var(--text-4)", maxWidth: 560 }}>
        Разногласия по гигу рассматривает модератор Gigly. Вся переписка и договорённости хранятся на платформе — спор решается по фактам, средства по гигу заморожены до решения.
      </span>

      {list.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {list.map((d) => {
            const statusColor = `rgb(${STATUS_RGB[d.status] ?? "138,143,153"})`;
            return (
              <div
                key={d.id}
                onClick={() => router.push(`/disputes/${d.id}`)}
                style={{ borderRadius: 12, background: "var(--surface-card)", boxShadow: "inset 0 0 0 1px var(--hairline-08)", padding: "18px 20px", display: "flex", alignItems: "center", gap: 16, cursor: "pointer" }}
              >
                <span style={{ width: 40, height: 40, flex: "none", borderRadius: "50%", background: avatarColor(d.gig), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#fff" }}>
                  {d.gig.slice(0, 1)}
                </span>
                <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontSize: 15, color: "var(--text-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.gig}</span>
                  <span style={{ fontFamily: "'Handjet',monospace", fontSize: 12, color: "var(--text-4)" }}>
                    {[d.reason, d.opener, d.created].filter(Boolean).join(" · ")}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flex: "none" }}>
                  {d.amount && <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 600, fontSize: 14, color: "var(--text-1)" }}>{d.amount}</span>}
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "'Handjet',monospace", fontSize: 12, color: statusColor }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: statusColor }} />
                    {STATUS_LABEL_RU[d.status] ?? d.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 340 }}>
          <div style={{ width: 440, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--hairline-05)", boxShadow: "inset 0 0 0 1px var(--hairline-10)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-3)" }}>
              <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56" />
              </svg>
            </div>
            <h2 style={{ margin: 0, fontFamily: "'Handjet',monospace", fontWeight: 600, fontSize: 24, color: "var(--text-1)" }}>Открытых споров нет</h2>
            <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 14, lineHeight: "20px", color: "var(--text-3)" }}>
              Если по гигу возникнут разногласия — откройте спор на странице проекта, и его рассмотрит модератор.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
