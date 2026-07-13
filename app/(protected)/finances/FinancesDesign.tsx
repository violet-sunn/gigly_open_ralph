// «Финансы» rebuilt on the prototype's `finance` block (Gigly App.dc.html line 1079+): the stat tiles + the «Операции»
// ledger (avatar + title + party·date + amount + status). Read-only (logical amounts — no real payments). Server
// component; the shell header supplies the «ФИНАНСЫ» title.

import type { FinancesData } from "@/lib/view-models";
import { avatarColor, STATUS_RGB, STATUS_LABEL_RU } from "@/app/_design/util";
import "@/app/_design/tokens.css";

export function FinancesDesign({ stats, ledger }: FinancesData) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", gap: 16 }}>
        {stats.stats.map((s, i) => (
          <div key={i} style={{ flex: 1, borderRadius: 12, background: "var(--surface-card)", boxShadow: "inset 0 0 0 1px var(--hairline-08)", padding: 20, display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontFamily: "'Handjet',monospace", fontSize: 14, color: "var(--text-3)" }}>{s.label}</span>
            <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 600, fontSize: 28, color: "var(--text-1)" }}>{s.value}</span>
            {s.caption && <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 12, color: "var(--text-4)" }}>{s.caption}</span>}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h2 style={{ margin: 0, fontFamily: "'Handjet',monospace", fontWeight: 600, fontSize: 24, color: "var(--text-1)", whiteSpace: "nowrap" }}>Операции</h2>
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", minWidth: 24, height: 24, padding: "0 7px", borderRadius: 6, background: "var(--om-accent, #0088ff)", color: "#fff", fontFamily: "'Handjet',monospace", fontWeight: 700, fontSize: 15 }}>
            {ledger.entries.length}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {ledger.entries.length > 0 ? (
            ledger.entries.map((t, i) => {
              const statusColor = `rgb(${t.statusColor ?? STATUS_RGB[t.status] ?? "138,143,153"})`;
              const statusLabel = t.statusLabel ?? STATUS_LABEL_RU[t.status] ?? t.status;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", borderRadius: 10, background: "var(--surface-card)", boxShadow: "inset 0 0 0 1px var(--hairline-06)" }}>
                  <span style={{ width: 36, height: 36, flex: "none", borderRadius: "50%", background: avatarColor(t.subtitle || t.label), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff" }}>
                    {(t.subtitle || t.label).slice(0, 1)}
                  </span>
                  <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
                    <span style={{ fontSize: 14, color: "var(--text-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.label}</span>
                    <span style={{ fontFamily: "'Handjet',monospace", fontSize: 12, color: "var(--text-4)" }}>
                      {t.subtitle ? `${t.subtitle} · ` : ""}{new Date(t.date).toLocaleDateString("ru-RU")}
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flex: "none" }}>
                    <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 600, fontSize: 16, color: "var(--text-1)" }}>{t.amount}</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "'Handjet',monospace", fontSize: 12, color: statusColor }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: statusColor }} />
                      {statusLabel}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 14, color: "var(--text-3)" }}>Операций пока нет.</span>
          )}
        </div>
      </div>
    </div>
  );
}
