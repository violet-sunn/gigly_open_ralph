"use client";

// Dispute detail rebuilt on the prototype's `disputeDetail` (Gigly App.dc.html line 860+) + the admin `disputeResolve`
// (line 951+) — combined per the app's single /disputes/[id] route: the header card (gig · reason · opener · status ·
// amount · resolution), the «Ход рассмотрения» timeline, evidence chips, and — for an ADMIN on an OPEN dispute — the
// «Решение модератора» panel (3 verdicts → the existing resolveDispute). The participant reply composer is omitted
// (no backend action yet — known gap). The shell header supplies the «СПОР» title.

import { useActionState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { resolveDispute } from "@/app/actions/dispute";
import type { DisputeDetailVM } from "@/app/components/blocks/view-models";
import { avatarColor, STATUS_RGB, disputeLabel } from "@/app/_design/util";
import "@/app/_design/tokens.css";

const ROLE: Record<string, { label: string; color: string }> = {
  specialist: { label: "Специалист", color: "#4ea3ff" },
  company: { label: "Заказчик", color: "#34c759" },
  moderator: { label: "Модератор", color: "#f59e0b" },
};

function ResolveBtn({ disputeId, verdict, resolution, label, bg, ring, color }: { disputeId: string; verdict: string; resolution: string; label: string; bg: string; ring?: string; color: string }) {
  const [, action] = useActionState(resolveDispute as never, null);
  return (
    <form action={action} style={{ flex: 1, minWidth: 200 }}>
      <input type="hidden" name="disputeId" value={disputeId} />
      <input type="hidden" name="status" value="RESOLVED" />
      <input type="hidden" name="verdict" value={verdict} />
      <input type="hidden" name="resolution" value={resolution} />
      <button type="submit" style={{ width: "100%", height: 46, border: "none", borderRadius: 8, background: bg, boxShadow: ring ? `inset 0 0 0 1px ${ring}` : "none", color, fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
        {label}
      </button>
    </form>
  );
}

export function DisputeDetailDesign({ dispute, isAdmin }: { dispute: DisputeDetailVM; isAdmin: boolean }) {
  const router = useRouter();
  const params = useSearchParams();
  // Back target: honour the `from` entry point (the admin disputes list / console / participant list), validated as an
  // internal path; otherwise fall back per role. The label follows the destination.
  const fromParam = params.get("from");
  const from = fromParam && fromParam.startsWith("/") && !fromParam.startsWith("//") ? fromParam : null;
  const backHref = from || (isAdmin ? "/admin" : "/disputes");
  const backLabel = backHref === "/admin" ? "Назад к модерации" : "Назад к спорам";
  const statusColor = `rgb(${STATUS_RGB[dispute.status] ?? "138,143,153"})`;
  const isResolved = dispute.status !== "open";
  const canResolve = isAdmin && dispute.status === "open";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 860 }}>
      <div
        onClick={() => router.push(backHref)}
        style={{ display: "inline-flex", alignSelf: "flex-start", alignItems: "center", gap: 8, color: "var(--text-3)", fontFamily: "'Handjet',monospace", fontSize: 14, cursor: "pointer", padding: "4px 0" }}
      >
        ← {backLabel}
      </div>

      {/* header card */}
      <div style={{ borderRadius: 12, background: "var(--surface-card)", boxShadow: "inset 0 0 0 1px var(--hairline-08)", padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {/* The title used to be plain text — the screen described a dispute you could not investigate. It now opens
                the gig, which is where the requirements, the terms and (for a moderator) the chat live. */}
            <h2 style={{ margin: 0, fontFamily: "'Handjet',monospace", fontWeight: 600, fontSize: 22, color: "var(--text-1)" }}>
              {dispute.gigId ? (
                <Link href={`/gigs/${dispute.gigId}`} title="Открыть гиг" style={{ color: "inherit", textDecoration: "underline", textDecorationColor: "var(--hairline-12)" }}>
                  {dispute.gig}
                </Link>
              ) : (
                dispute.gig
              )}
            </h2>
            <span style={{ fontFamily: "'Handjet',monospace", fontSize: 13, color: "var(--text-4)" }}>Причина: {dispute.reason} · открыл: {(dispute.openerRole && ROLE[dispute.openerRole]?.label) || dispute.opener}</span>
          </div>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, flex: "none", fontFamily: "'Handjet',monospace", fontSize: 13, color: statusColor }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: statusColor }} />
            {disputeLabel(dispute.status)}
          </span>
        </div>
        <div style={{ display: "flex", gap: 48 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontFamily: "'Handjet',monospace", fontSize: 12, color: "var(--text-4)" }}>Сумма по гигу</span>
            <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 600, fontSize: 16, color: "var(--text-1)" }}>{dispute.amount}</span>
          </div>
          {dispute.counterparty && (
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontFamily: "'Handjet',monospace", fontSize: 12, color: "var(--text-4)" }}>Контрагент</span>
              <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 600, fontSize: 16, color: "var(--text-1)" }}>{dispute.counterparty}</span>
            </div>
          )}
        </div>
        {isResolved && dispute.resolution && (
          <div style={{ borderRadius: 8, background: "rgba(16,185,129,0.12)", boxShadow: "inset 0 0 0 1px rgba(16,185,129,0.4)", padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "#34c759" }}>✓</span>
            <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, color: "var(--text-2)" }}>{dispute.resolution}</span>
          </div>
        )}
      </div>

      {/* timeline */}
      {dispute.timeline.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <span style={{ fontFamily: "'Handjet',monospace", fontSize: 14, color: "var(--text-3)" }}>Ход рассмотрения</span>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {dispute.timeline.map((t, i) => {
              const role = ROLE[t.authorRole] ?? ROLE.specialist;
              const name = t.authorName || role.label;
              return (
                <div key={i} style={{ display: "flex", gap: 12 }}>
                  <span style={{ width: 34, height: 34, flex: "none", borderRadius: "50%", background: avatarColor(name), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>
                    {name.slice(0, 1)}
                  </span>
                  <div style={{ flex: 1, borderRadius: 10, background: "var(--surface-card)", boxShadow: "inset 0 0 0 1px var(--hairline-06)", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 5 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)" }}>{name}</span>
                      <span style={{ fontFamily: "'Handjet',monospace", fontSize: 11, color: role.color, background: "rgba(255,255,255,0.04)", borderRadius: 5, padding: "2px 7px" }}>{role.label}</span>
                      <span style={{ flex: 1 }} />
                      {t.at && <span style={{ fontFamily: "'Handjet',monospace", fontSize: 11, color: "var(--text-4)" }}>{t.at}</span>}
                    </div>
                    <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 14, lineHeight: "19px", color: "var(--text-2)" }}>{t.text}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* evidence */}
      {dispute.evidence.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ fontFamily: "'Handjet',monospace", fontSize: 14, color: "var(--text-3)" }}>Доказательства</span>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {dispute.evidence.map((e, i) => (
              <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'Manrope',sans-serif", fontSize: 13, color: "#4ea3ff", background: "rgba(0,136,255,0.08)", boxShadow: "inset 0 0 0 1px rgba(0,136,255,0.2)", borderRadius: 8, padding: "8px 12px" }}>📎 {e}</span>
            ))}
          </div>
        </div>
      )}

      {/* admin resolve panel */}
      {canResolve && (
        <div style={{ borderRadius: 12, background: "var(--surface-sunken)", boxShadow: "inset 0 0 0 1px var(--border-strong)", padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          <h3 style={{ margin: 0, fontFamily: "'Handjet',monospace", fontWeight: 600, fontSize: 18, color: "var(--text-1)" }}>Решение модератора</h3>
          <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, color: "var(--text-3)" }}>Выберите исход. Средства будут распределены автоматически, обе стороны получат уведомление.</span>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <ResolveBtn disputeId={dispute.id} verdict="specialist" resolution="Спор разрешён в пользу специалиста." label="В пользу специалиста" bg="rgba(0,136,255,0.14)" ring="rgba(0,136,255,0.5)" color="#4ea3ff" />
            <ResolveBtn disputeId={dispute.id} verdict="company" resolution="Спор разрешён в пользу заказчика." label="В пользу заказчика" bg="rgba(52,199,89,0.12)" ring="rgba(52,199,89,0.5)" color="#34c759" />
            <ResolveBtn disputeId={dispute.id} verdict="split_50" resolution="Частичный возврат 50%." label="Частичный возврат 50%" bg="var(--surface-secondary)" color="var(--text-2)" />
          </div>
        </div>
      )}
    </div>
  );
}
