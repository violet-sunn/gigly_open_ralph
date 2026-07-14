"use client";

// gig-detail, rebuilt DIRECTLY on the gigly_full_design prototype's own markup (Gigly App.dc.html, the `gigDetail`
// route) — inline styles ported verbatim so the design's `var(--surface-card)` / `font-family:'Handjet'` resolve
// exactly (tokens + fonts loaded from app/_design/tokens.css). The `{{ }}` bindings are replaced with the real
// getGigDetail view-model; `<sc-if>`/`<sc-for>` with React conditionals/maps; the prototype's button handlers with the
// (unchanged) server actions. NOT a @composed-screen — this is the design's concrete code brought to life, not a kit
// re-derivation; the F2/F5 purity gates do not apply to it (they are being retired as the rebuild rolls out).

import { useActionState, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/app/_design/ConfirmDialog";
import {
  applyToGig,
  withdrawApplication,
  submitWork,
  approveWork,
  requestRevision,
  markAsPaid,
} from "@/app/actions/gig";
import type { GigDetailData } from "@/lib/view-models";
import "../../../_design/tokens.css";

// ── prototype helpers (ported verbatim from Gigly App.dc.html) ──────────────
// Deterministic avatar colour from a name (avatarColor()).
function avatarColor(name: string): string {
  const colors = ["#e23744", "#f59e0b", "#22c55e", "#06b6d4", "#8b5cf6", "#0088ff", "#ec4899"];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return colors[h % colors.length];
}

// Status tone → dot/label colour (the prototype STATUS map's rgb values).
const STAGE_COLOR: Record<string, string> = {
  open: "rgb(255,255,255)",
  review: "rgb(245,158,11)",
  "in-progress": "rgb(59,130,246)",
  verification: "rgb(139,92,246)",
  completed: "rgb(16,185,129)",
  rejected: "rgb(239,68,68)",
};

// The prototype's verify seal (IconBootstrapOutlineLogosPatch → Bootstrap patch-check-fill), tinted by parent colour.
function PatchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708z" />
    </svg>
  );
}

type ActionState = { error?: string } | null;
function useAction(fn: unknown) {
  return useActionState<ActionState, FormData>(fn as never, null);
}

const COMPANY_DESC =
  "Проверенный заказчик на платформе Gigly. Чёткие требования и быстрая обратная связь.";

export function GigDetail({ data }: { data: GigDetailData }) {
  const router = useRouter();
  const [tab, setTab] = useState<"client" | "proposed">("client");

  const isCompany = !!data.conditions.fee; // owner view → fee breakdown
  const company = data.bio.name;
  // Terms tabs (fix-terms-negotiation): owners don't counter their own gig → hide «Мои условия» and show a single
  // (gig) terms panel. A specialist keeps both tabs; «Мои условия» reflects their counter (or a no-counter note).
  const showTermsTabs = !data.isOwner;
  const effectiveTab = showTermsTabs ? tab : "client";
  const viewerHasCounter = !!data.viewerApplication?.hasCounter;
  const term = effectiveTab === "client" ? data.conditions.client : data.conditions.proposed;

  // Статус row colour/label (PAID shown as the prototype's teal «Оплачен»).
  const paid = data.status === "PAID";
  const stageLabel = paid ? "Оплачен" : data.conditions.status.label;
  const stageColor = paid ? "rgb(0,200,179)" : STAGE_COLOR[data.conditions.status.tone] ?? "rgb(138,143,153)";

  // ── role / lifecycle state (maps the prototype's show* flags) ─────────────
  const va = data.viewerApplication;
  const closed = data.closedByAdmin;
  // Example gigs are a non-apply-able showcase — a viewing specialist gets a clear demo notice instead of a
  // phantom form (Спец #6). Owner/assigned specialists keep their normal rails.
  const showExampleNotice = !closed && data.isExample && data.isSpecialistViewer && !data.isOwner && !data.isAssignedSpecialist;
  // WITHDRAWN_FINAL — gig STAYS VISIBLE with an «Отозвано» marker; re-apply is permanently unavailable.
  const showFinalWithdrawn = !closed && !data.isExample && va?.status === "WITHDRAWN_FINAL";
  // WITHDRAWN (reversible) — a per-viewer «Вы отозвали отклик» signal shown ABOVE the re-apply form, so the viewer's
  // own state is unambiguous and never conflated with the gig's derived «На рассмотрении» badge
  // (withdrawn-status-truthfulness #1). The re-apply form itself still renders via showApply/notApplied below.
  const showWithdrawn = !closed && !data.isExample && va?.status === "WITHDRAWN";
  const showApply = !closed && !data.isExample && (data.lifecycle.canApply || va?.status === "PENDING");
  const notApplied = data.lifecycle.canApply && va?.status !== "PENDING";
  const applied = va?.status === "PENDING";
  const showApplicants = !closed && data.isOwner && data.status === "OPEN";
  // gig-editing-with-notification: the owner can edit an OPEN gig (fix a typo / adjust terms). Once a specialist is
  // assigned (IN_PROGRESS) or the gig is closed/example, terms lock → no edit control.
  const canEdit = !closed && data.isOwner && data.status === "OPEN" && !data.isExample;
  const showCompanyWaiting = !closed && data.isOwner && data.status === "IN_PROGRESS";
  const showApprove = !closed && data.lifecycle.canApprove;
  const showSubmit = !closed && data.lifecycle.canSubmit;
  const showSpecWaiting = !closed && data.isAssignedSpecialist && data.status === "REVIEW";
  const showMarkPaid = !closed && data.lifecycle.canPay;
  const showCompletedSpec = !closed && data.isAssignedSpecialist && data.status === "COMPLETED";
  const showPaid = !closed && paid;
  const showDone = closed;
  // Dispute link only while the work is live (в работе / на проверке) — matches the prototype's
  // `showDisputeLink: !isAdmin && (gigInProgress || gigReview)`; not merely "assigned" (which lingers into
  // completed/paid and over-showed the link there).
  const showDisputeLink =
    !closed &&
    (data.isOwner || data.isAssignedSpecialist) &&
    data.messaging.assigned &&
    !data.isExample &&
    (data.status === "IN_PROGRESS" || data.status === "REVIEW");

  // Chat entry point (chat-on-acceptance) — same window as the dispute link: the two participants can open the
  // gig's thread while the engagement is live (в работе / на проверке). Label by role.
  const showChatEntry =
    !closed &&
    (data.isOwner || data.isAssignedSpecialist) &&
    data.messaging.assigned &&
    !data.isExample &&
    (data.status === "IN_PROGRESS" || data.status === "REVIEW");
  const chatEntryLabel = data.isAssignedSpecialist ? "Написать заказчику" : "Написать исполнителю";

  return (
    <div style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
      {/* ЛЕВАЯ КОЛОНКА */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 6 }}>
        <div
          onClick={() => router.push("/gigs")}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-1)"; e.currentTarget.style.background = "var(--hairline-05)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-3)"; e.currentTarget.style.background = "transparent"; }}
          style={{
            display: "inline-flex",
            alignSelf: "flex-start",
            alignItems: "center",
            gap: 8,
            color: "var(--text-3)",
            fontFamily: "'Handjet',monospace",
            fontSize: 16,
            cursor: "pointer",
            padding: "8px 12px",
            marginLeft: -12,
            minHeight: 36,
            borderRadius: 8,
            transition: "color 0.12s, background 0.12s",
          }}
        >
          ← Назад к гигам
        </div>

        {/* gig-editing-with-notification: obvious owner «Редактировать» control (a clear button, not a subtle pencil) —
            only while the gig is OPEN. Routes to the owner-guarded edit screen. */}
        {canEdit && (
          <button
            type="button"
            onClick={() => router.push(`/gigs/${data.gigId}/edit`)}
            style={{
              alignSelf: "flex-start",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              height: 40,
              padding: "0 18px",
              border: "none",
              borderRadius: 8,
              background: "rgba(0,136,255,0.12)",
              boxShadow: "inset 0 0 0 1px rgba(0,136,255,0.35)",
              color: "var(--om-accent, #0088ff)",
              fontFamily: "'Handjet',monospace",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            ✎ Редактировать
          </button>
        )}

        {/* main */}
        <div
          style={{
            borderRadius: 8,
            background: "var(--surface-card)",
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <h1
              style={{
                margin: 0,
                fontFamily: "'IBM Plex Sans',sans-serif",
                fontWeight: 500,
                fontSize: 22,
                lineHeight: "28px",
                color: "var(--text-1)",
              }}
            >
              {data.header.title}
            </h1>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {data.header.tags.map((tg, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 12,
                    color: "#4ea3ff",
                    background: "rgba(0,136,255,0.1)",
                    borderRadius: 6,
                    padding: "3px 8px",
                  }}
                >
                  {tg}
                </span>
              ))}
            </div>
          </div>
          <span
            style={{
              fontFamily: "'Manrope',sans-serif",
              fontSize: 14,
              lineHeight: "20px",
              color: "var(--text-3)",
            }}
          >
            {data.header.description}
          </span>
        </div>

        {/* технические требования */}
        {data.requirements.length > 0 && (
          <div
            style={{
              borderRadius: 8,
              background: "var(--surface-card)",
              padding: 20,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h2
                style={{
                  margin: 0,
                  fontFamily: "'Handjet',monospace",
                  fontWeight: 600,
                  fontSize: 22,
                  color: "var(--text-1)",
                  whiteSpace: "nowrap",
                }}
              >
                Технические требования
              </h2>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: 22,
                  height: 22,
                  padding: "0 7px",
                  borderRadius: 6,
                  background: "var(--om-accent, #0088ff)",
                  color: "#fff",
                  fontFamily: "'Handjet',monospace",
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                {data.requirements.length}
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {data.requirements.map((r, i) => (
                <div
                  key={i}
                  style={{
                    borderRadius: 8,
                    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.14)",
                    padding: 14,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    minHeight: 108,
                    boxSizing: "border-box",
                  }}
                >
                  <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 500, fontSize: 16, color: "var(--text-1)" }}>
                    {r.title}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Manrope',sans-serif",
                      fontSize: 14,
                      lineHeight: "18px",
                      color: "var(--text-3)",
                    }}
                  >
                    {r.body}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* критерии успеха */}
        {data.criteria.items.length > 0 && (
          <div
            style={{
              borderRadius: 8,
              background: "var(--surface-card)",
              padding: 20,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h2
                style={{
                  margin: 0,
                  fontFamily: "'Handjet',monospace",
                  fontWeight: 600,
                  fontSize: 22,
                  color: "var(--text-1)",
                  whiteSpace: "nowrap",
                }}
              >
                Критерии успеха
              </h2>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: 22,
                  height: 22,
                  padding: "0 7px",
                  borderRadius: 6,
                  background: "var(--om-accent, #0088ff)",
                  color: "#fff",
                  fontFamily: "'Handjet',monospace",
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                {data.criteria.items.length}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {data.criteria.items.map((c, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    borderRadius: 8,
                    overflow: "hidden",
                    boxShadow: "inset 0 0 0 1px var(--om-accent, #0088ff)",
                  }}
                >
                  <div
                    style={{
                      width: 26,
                      flex: "none",
                      background: "var(--om-accent, #0088ff)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "'Handjet',monospace",
                      fontWeight: 700,
                      fontSize: 16,
                      color: "var(--surface-app)",
                    }}
                  >
                    {i + 1}
                  </div>
                  <div style={{ flex: 1, padding: "12px 16px", display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 500, fontSize: 15, color: "var(--text-1)" }}>
                      {c.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ПРАВАЯ КОЛОНКА: УСЛОВИЯ */}
      <div style={{ width: 440, flex: "none", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* bio заказчика */}
        <div
          style={{
            borderRadius: 12,
            background: "var(--surface-deep)",
            boxShadow: "inset 0 0 0 1px var(--border-strong)",
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                width: 28,
                height: 28,
                flex: "none",
                borderRadius: "50%",
                background: avatarColor(company),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {company.slice(0, 1)}
            </span>
            <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text-1)" }}>{company}</span>
            {data.bio.verified && (
              <span style={{ color: "var(--om-accent, #0088ff)", display: "flex" }}>
                <PatchIcon />
              </span>
            )}
            <span style={{ color: "var(--text-5)", fontSize: 12, letterSpacing: 1 }}>★★★★★</span>
            <span style={{ color: "var(--text-4)", fontSize: 12 }}>{data.bio.rating?.count ?? 0}</span>
          </div>
          <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, lineHeight: "18px", color: "var(--text-3)" }}>
            {COMPANY_DESC}
          </span>
        </div>

        {/* условия + заявка */}
        <div
          style={{
            borderRadius: 12,
            background: "var(--surface-sunken)",
            boxShadow: "inset 0 0 0 1px var(--border-strong)",
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {showTermsTabs && (
            <div style={{ display: "flex", gap: 6, padding: 3, borderRadius: 6, background: "var(--surface-app)" }}>
              <div
                onClick={() => setTab("client")}
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: "6px 0",
                  borderRadius: 4,
                  background: tab === "client" ? "rgba(255,255,255,0.18)" : "transparent",
                  fontFamily: "'Handjet',monospace",
                  fontWeight: 600,
                  fontSize: 13,
                  color: tab === "client" ? "var(--text-1)" : "var(--text-3)",
                  cursor: "pointer",
                }}
              >
                Условия {company}
              </div>
              <div
                onClick={() => setTab("proposed")}
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: "6px 0",
                  borderRadius: 4,
                  background: tab === "proposed" ? "rgba(255,255,255,0.18)" : "transparent",
                  fontFamily: "'Handjet',monospace",
                  fontWeight: 600,
                  fontSize: 13,
                  color: tab === "proposed" ? "var(--text-1)" : "var(--text-3)",
                  cursor: "pointer",
                }}
              >
                Мои условия
              </div>
            </div>
          )}

          {showTermsTabs && effectiveTab === "proposed" && !viewerHasCounter && (
            <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 12, lineHeight: "16px", color: "var(--text-4)" }}>
              {data.viewerApplication
                ? "Вы не предложили свои условия — действуют условия заказчика."
                : "Предложите свои условия в форме отклика ниже — иначе действуют условия заказчика."}
            </span>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: "'Handjet',monospace", fontSize: 13, color: "var(--text-4)" }}>Статус</span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "'Handjet',monospace",
                fontSize: 13,
                color: stageColor,
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: stageColor }} />
              {stageLabel}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontFamily: "'Handjet',monospace", fontWeight: 600, fontSize: 14, color: "var(--text-1)" }}>
              Срок выполнения
            </span>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 600, fontSize: 30, color: "var(--text-1)" }}>
                {term.deadline}
              </span>
              <span style={{ fontFamily: "'Handjet',monospace", fontSize: 14, color: "#9fa0a4" }}>
                [{data.conditions.deadlineNote}]
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontFamily: "'Handjet',monospace", fontWeight: 600, fontSize: 14, color: "var(--text-1)" }}>
              Бюджет проекта
            </span>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 600, fontSize: 30, color: "var(--text-1)" }}>
                {term.budget}
              </span>
              <span style={{ fontFamily: "'Handjet',monospace", fontSize: 14, color: "#9fa0a4" }}>
                {data.conditions.budgetNote}
              </span>
            </div>
            {isCompany && data.conditions.fee && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  marginTop: 6,
                  paddingTop: 10,
                  borderTop: "1px solid var(--hairline-08)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontFamily: "'Handjet',monospace",
                    fontSize: 13,
                    color: "var(--text-3)",
                  }}
                >
                  <span>Сервисный сбор (10%)</span>
                  <span>{data.conditions.fee.service}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontFamily: "'Handjet',monospace",
                    fontSize: 14,
                    color: "var(--text-1)",
                  }}
                >
                  <span>Итого к оплате</span>
                  <span>{data.conditions.fee.total}</span>
                </div>
              </div>
            )}
          </div>

          {/* ── role action rail ─────────────────────────────────────────── */}
          {/* Reversible-withdrawn per-viewer signal (withdrawn-status-truthfulness #1): a blue «Вы отозвали отклик»
              notice ABOVE the re-apply form. Distinct from the gig's derived «На рассмотрении» stage badge, so the
              viewer's OWN state is unambiguous. Re-apply availability keyed off lifecycle.canApply (gig still OPEN). */}
          {showWithdrawn && (
            <div style={noticeBox("rgba(0,136,255,0.08)", "rgba(0,136,255,0.35)")}>
              <span style={{ fontFamily: "'Handjet',monospace", fontWeight: 600, fontSize: 13, color: "#4ea3ff" }}>
                Вы отозвали отклик
              </span>
              <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 12, lineHeight: "16px", color: "var(--text-3)" }}>
                {data.lifecycle.canApply
                  ? "Вы можете откликнуться снова — заполните форму ниже."
                  : "Этот гиг больше не принимает отклики."}
              </span>
            </div>
          )}

          {showApply && (
            <ApplyBlock
              gigId={data.gigId}
              notApplied={notApplied}
              applied={applied}
              applicationId={va?.id}
              withdrawalIsFinal={!!va?.freeWithdrawalUsed}
              initialBudget={va?.proposedBudgetRub != null ? String(va.proposedBudgetRub) : ""}
              initialDeadline={va?.proposedDeadlineDays != null ? String(va.proposedDeadlineDays) : ""}
            />
          )}

          {showExampleNotice && (
            <div style={noticeBox("rgba(0,136,255,0.08)", "rgba(0,136,255,0.35)")}>
              <span style={{ fontFamily: "'Handjet',monospace", fontWeight: 600, fontSize: 13, color: "#4ea3ff" }}>
                Демонстрационный гиг
              </span>
              <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 12, lineHeight: "16px", color: "var(--text-3)" }}>
                Это пример для витрины — отклик недоступен. Реальные гиги ищите в поиске.
              </span>
              <button
                onClick={() => router.push("/gigs")}
                style={{ ...primaryBtn("var(--om-accent, #0088ff)"), height: 40, marginTop: 6 }}
              >
                Перейти к поиску гигов
              </button>
            </div>
          )}

          {showFinalWithdrawn && (
            <div style={noticeBox("rgba(239,68,68,0.10)", "rgba(239,68,68,0.4)")}>
              <span style={{ fontFamily: "'Handjet',monospace", fontWeight: 600, fontSize: 13, color: "#ef4444" }}>
                Отозвано
              </span>
              <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 12, lineHeight: "16px", color: "var(--text-3)" }}>
                Вы окончательно отозвали отклик на этот гиг — повторный отклик недоступен.
              </span>
            </div>
          )}

          {showApplicants && (
            <button
              onClick={() => router.push(`/gigs/${data.gigId}/applications`)}
              style={primaryBtn("var(--om-accent, #0088ff)")}
            >
              Смотреть отклики ({data.applications.length})
            </button>
          )}

          {showSubmit && <GigActionButton gigId={data.gigId} action={submitWork} label="Сдать работу на проверку" />}

          {showCompanyWaiting && (
            <div style={noticeBox("rgba(255,255,255,0.04)", "var(--hairline-08)")}>
              <span style={{ fontFamily: "'Handjet',monospace", fontWeight: 600, fontSize: 13, color: "#3b82f6" }}>
                Специалист в работе
              </span>
              <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 12, lineHeight: "16px", color: "var(--text-3)" }}>
                Дождитесь, когда работа будет сдана на проверку.
              </span>
            </div>
          )}

          {showApprove && <ApproveBlock gigId={data.gigId} />}

          {showSpecWaiting && (
            <div style={noticeBox("rgba(139,92,246,0.08)", "rgba(139,92,246,0.3)")}>
              <span style={{ fontFamily: "'Handjet',monospace", fontWeight: 600, fontSize: 13, color: "#8b5cf6" }}>
                Работа на проверке
              </span>
              <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 12, lineHeight: "16px", color: "var(--text-3)" }}>
                Заказчик проверяет результат. Скоро будет решение.
              </span>
            </div>
          )}

          {showMarkPaid && <MarkPaidBlock gigId={data.gigId} />}

          {showCompletedSpec && (
            <div style={noticeBox("rgba(16,185,129,0.12)", "rgba(16,185,129,0.4)")}>
              <span style={{ fontFamily: "'Handjet',monospace", fontWeight: 600, fontSize: 13, color: "#34c759" }}>
                Работа принята
              </span>
              <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 12, lineHeight: "16px", color: "var(--text-3)" }}>
                Заказчик подтверждает оплату. Статус обновится автоматически.
              </span>
            </div>
          )}

          {showPaid && (
            <div
              style={{
                ...noticeBox("rgba(0,200,179,0.12)", "rgba(0,200,179,0.45)"),
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ color: "#00c8b3", fontSize: 16 }}>₽</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontFamily: "'Handjet',monospace", fontWeight: 600, fontSize: 13, color: "#00c8b3" }}>
                  Гиг оплачен
                </span>
                <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 12, color: "var(--text-3)" }}>
                  Сделка завершена полностью.
                </span>
              </div>
            </div>
          )}

          {showDone && (
            <div
              style={{
                ...noticeBox("rgba(239,68,68,0.12)", "rgba(239,68,68,0.4)"),
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ color: "#ef4444", fontSize: 16 }}>✕</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontFamily: "'Handjet',monospace", fontWeight: 600, fontSize: 13, color: "#ef4444" }}>
                  Гиг отклонён
                </span>
                <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 12, color: "var(--text-3)" }}>
                  Сделка закрыта без оплаты.
                </span>
              </div>
            </div>
          )}

          {showChatEntry && (
            <button
              type="button"
              onClick={() => router.push(`/chats?gig=${data.gigId}`)}
              style={{ ...primaryBtn("#0088FF"), alignSelf: "flex-start", padding: "0 20px", display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              <span aria-hidden>💬</span> {chatEntryLabel}
            </button>
          )}

          {showDisputeLink && (
            <div
              onClick={() => router.push(`/disputes/new?gig=${data.gigId}`)}
              style={{
                display: "inline-flex",
                alignSelf: "flex-start",
                alignItems: "center",
                gap: 7,
                fontFamily: "'Handjet',monospace",
                fontSize: 13,
                color: "var(--text-3)",
                cursor: "pointer",
                paddingTop: 2,
              }}
            >
              <span style={{ color: "#f59e0b" }}>⚖</span> Возникли разногласия? Открыть спор
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── shared inline-style builders (the prototype's repeated button/notice idioms) ──
function primaryBtn(bg: string): React.CSSProperties {
  return {
    height: 44,
    border: "none",
    borderRadius: 8,
    background: bg,
    color: "#fff",
    fontSize: 15,
    fontWeight: 500,
    cursor: "pointer",
  };
}
function noticeBox(bg: string, ring: string): React.CSSProperties {
  return {
    borderRadius: 8,
    background: bg,
    boxShadow: `inset 0 0 0 1px ${ring}`,
    padding: 14,
    display: "flex",
    flexDirection: "column",
    gap: 4,
  };
}
const fieldStyle: React.CSSProperties = {
  borderRadius: 8,
  background: "var(--hairline-05)",
  boxShadow: "inset 0 0 0 1px var(--hairline-08)",
  border: "none",
  outline: "none",
  padding: 12,
  color: "var(--text-1)",
  fontFamily: "'Manrope',sans-serif",
  fontSize: 13,
  lineHeight: "18px",
};
const labelStyle: React.CSSProperties = {
  fontFamily: "'Handjet',monospace",
  fontSize: 13,
  color: "var(--text-1)",
};
function errLine(error?: string) {
  if (!error) return null;
  return (
    <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 12, color: "#ef4444" }}>{error}</span>
  );
}

// SPECIALIST «Ваш отклик» — live-validated apply form (prototype applyBtnBg/applyHint), or the applied state.
function ApplyBlock({
  gigId,
  notApplied,
  applied,
  applicationId,
  withdrawalIsFinal,
  initialBudget = "",
  initialDeadline = "",
}: {
  gigId: string;
  notApplied: boolean;
  applied: boolean;
  applicationId?: string;
  withdrawalIsFinal: boolean;
  initialBudget?: string;
  initialDeadline?: string;
}) {
  const [approach, setApproach] = useState("");
  const [questions, setQuestions] = useState("");
  const [estimate, setEstimate] = useState("");
  // Optional counter-terms (fix-terms-negotiation) — wired to applyToGig's proposedBudget (roubles)/proposedDeadlineDays.
  // Pre-filled from the preserved counter when re-applying after a withdrawal, so «Мои условия» and the form agree
  // (avoids silently dropping the counter on a blank re-submit).
  const [propBudget, setPropBudget] = useState(initialBudget);
  const [propDeadline, setPropDeadline] = useState(initialDeadline);
  const [applyState, applyAction] = useAction(applyToGig);
  const [withdrawStateRaw, withdrawAction] = useAction(withdrawApplication);
  const withdrawState = withdrawStateRaw;
  // The 2nd withdrawal is final (freeWithdrawalUsed already true) → gate it behind ConfirmDialog; the 1st is
  // reversible → submit immediately. Server enforces finality regardless (dialog is UX only).
  const withdrawFormRef = useRef<HTMLFormElement>(null);
  const [confirmFinal, setConfirmFinal] = useState(false);

  // Mirror the server thresholds in applyToGig (approach ≥ 100, questions ≥ 50) so the button gates before submit
  // instead of the server bouncing the user after a click.
  const APPROACH_MIN = 100;
  const QUESTIONS_MIN = 50;
  const aLen = approach.trim().length;
  const qLen = questions.trim().length;
  const baseValid = aLen >= APPROACH_MIN && qLen >= QUESTIONS_MIN;
  // Proposed terms are OPTIONAL — empty is valid. When present, mirror the server rules (budget > 0; срок integer 1–365)
  // so an invalid counter is caught before submit instead of the server bouncing the user.
  const budgetOk = propBudget.trim() === "" || Number(propBudget) > 0;
  const deadlineNum = Number(propDeadline);
  const deadlineOk =
    propDeadline.trim() === "" || (Number.isInteger(deadlineNum) && deadlineNum >= 1 && deadlineNum <= 365);
  const proposedOk = budgetOk && deadlineOk;
  const valid = baseValid && proposedOk;
  const applyBtnBg = valid ? "var(--om-accent, #0088ff)" : "var(--surface-secondary)";
  const applyHint = valid
    ? "Нажимая кнопку, вы соглашаетесь с правилами платформы"
    : !baseValid
      ? `Подход — минимум ${APPROACH_MIN} симв. (${aLen}/${APPROACH_MIN}), вопросы — минимум ${QUESTIONS_MIN} (${qLen}/${QUESTIONS_MIN})`
      : !budgetOk
        ? "Бюджет должен быть положительным числом в рублях (или оставьте поле пустым)"
        : "Срок должен быть целым числом дней от 1 до 365 (или оставьте поле пустым)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontFamily: "'Handjet',monospace", fontWeight: 600, fontSize: 16, color: "var(--text-1)" }}>
          Ваш отклик
        </span>
        <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 12, color: "var(--text-4)" }}>
          Покажите подход и задайте вопросы — это ценят больше общих фраз.
        </span>
      </div>

      {notApplied && (
        <form action={applyAction} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input type="hidden" name="gigId" value={gigId} />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={labelStyle}>Как буду решать — подход</label>
            <textarea
              name="approach"
              value={approach}
              onChange={(e) => setApproach(e.target.value)}
              placeholder="Коротко о технике: что сделаю, какими инструментами, в каком порядке…"
              style={{ ...fieldStyle, height: 96, resize: "none" }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={labelStyle}>Уточняющие вопросы</label>
            <textarea
              name="questions"
              value={questions}
              onChange={(e) => setQuestions(e.target.value)}
              placeholder="Что нужно прояснить, чтобы попасть в результат с первого раза…"
              style={{ ...fieldStyle, height: 72, resize: "none" }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={labelStyle}>
              Оценка трудозатрат <span style={{ color: "var(--text-4)" }}>(необязательно)</span>
            </label>
            <input
              name="estimatedEffort"
              value={estimate}
              onChange={(e) => setEstimate(e.target.value)}
              placeholder="Напр.: ~3 дня, из них 1 на профилирование"
              style={{ ...fieldStyle, height: 42, padding: "0 12px", lineHeight: "normal" }}
            />
          </div>

          {/* Мои условия — optional counter-terms; empty = accept the client's terms. */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={labelStyle}>
              Мои условия <span style={{ color: "var(--text-4)" }}>(необязательно)</span>
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                name="proposedBudget"
                value={propBudget}
                onChange={(e) => setPropBudget(e.target.value)}
                inputMode="numeric"
                placeholder="Ваш бюджет, ₽"
                style={{
                  ...fieldStyle,
                  flex: 1,
                  minWidth: 0,
                  height: 42,
                  padding: "0 12px",
                  lineHeight: "normal",
                  boxShadow: budgetOk ? fieldStyle.boxShadow : "inset 0 0 0 1px rgba(245,158,11,0.6)",
                }}
              />
              <input
                name="proposedDeadlineDays"
                value={propDeadline}
                onChange={(e) => setPropDeadline(e.target.value)}
                inputMode="numeric"
                placeholder="Срок, дней"
                style={{
                  ...fieldStyle,
                  width: 120,
                  flex: "none",
                  height: 42,
                  padding: "0 12px",
                  lineHeight: "normal",
                  boxShadow: deadlineOk ? fieldStyle.boxShadow : "inset 0 0 0 1px rgba(245,158,11,0.6)",
                }}
              />
            </div>
            <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 11, color: "var(--text-4)" }}>
              Оставьте пустым, чтобы принять условия заказчика.
            </span>
          </div>
          <button
            type="submit"
            disabled={!valid}
            style={{
              ...primaryBtn(applyBtnBg),
              cursor: valid ? "pointer" : "not-allowed",
              color: valid ? "#fff" : "var(--text-4)",
              opacity: valid ? 1 : 0.85,
              boxShadow: valid ? "none" : "inset 0 0 0 1px var(--hairline-10)",
            }}
          >
            Отправить заявку
          </button>
          {errLine(applyState?.error)}
          <span
            style={{
              fontFamily: "'Handjet',monospace",
              fontSize: 12,
              textAlign: "center",
              fontWeight: valid ? 400 : 600,
              color: valid ? "#9fa0a4" : "#f59e0b",
            }}
          >
            {applyHint}
          </span>
        </form>
      )}

      {applied && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div
            style={{
              height: 44,
              borderRadius: 8,
              background: "rgba(16,185,129,0.15)",
              boxShadow: "inset 0 0 0 1px rgba(16,185,129,0.5)",
              color: "#34c759",
              fontSize: 15,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            Заявка отправлена ✓
          </div>
          <form ref={withdrawFormRef} action={withdrawAction}>
            <input type="hidden" name="applicationId" value={applicationId} />
            <button
              type={withdrawalIsFinal ? "button" : "submit"}
              onClick={withdrawalIsFinal ? () => setConfirmFinal(true) : undefined}
              style={{
                width: "100%",
                height: 40,
                border: "none",
                borderRadius: 8,
                background: "transparent",
                boxShadow: "inset 0 0 0 1px rgba(239,68,68,0.4)",
                color: "#ef4444",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Отозвать заявку
            </button>
          </form>
          {withdrawalIsFinal && (
            <span style={{ fontFamily: "'Handjet',monospace", fontSize: 12, textAlign: "center", color: "#f59e0b" }}>
              Это ваш второй отзыв — он будет окончательным.
            </span>
          )}
          {errLine(withdrawState?.error)}
          {confirmFinal && (
            <ConfirmDialog
              title="Отозвать окончательно?"
              body="Если отменить отклик сейчас, повторно откликнуться на этот гиг будет нельзя. Гиг останется виден с пометкой «Отозвано»."
              confirmLabel="Отозвать окончательно"
              cancelLabel="Не отменять"
              danger
              onCancel={() => setConfirmFinal(false)}
              onConfirm={() => {
                setConfirmFinal(false);
                withdrawFormRef.current?.requestSubmit();
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

// Owner approve state: «Принять работу» (approveWork) + «Вернуть на доработку» (requestRevision).
function ApproveBlock({ gigId }: { gigId: string }) {
  const [approveState, approveAction] = useAction(approveWork);
  const [returnState, returnAction] = useAction(requestRevision);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, lineHeight: "18px", color: "var(--text-3)" }}>
        Специалист сдал работу. Проверьте результат по критериям приёмки.
      </span>
      <form action={approveAction}>
        <input type="hidden" name="gigId" value={gigId} />
        <button type="submit" style={{ ...primaryBtn("var(--om-accent, #0088ff)"), width: "100%" }}>
          Принять работу
        </button>
      </form>
      <form action={returnAction}>
        <input type="hidden" name="gigId" value={gigId} />
        <button
          type="submit"
          style={{
            width: "100%",
            height: 42,
            border: "none",
            borderRadius: 8,
            background: "var(--surface-secondary)",
            color: "var(--text-2)",
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          Вернуть на доработку
        </button>
      </form>
      {errLine(approveState?.error || returnState?.error)}
    </div>
  );
}

// Owner pay state: accepted notice + «Отметить как оплаченный» (markAsPaid) + MVP note.
function MarkPaidBlock({ gigId }: { gigId: string }) {
  const [state, action] = useAction(markAsPaid);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div
        style={{
          borderRadius: 8,
          background: "rgba(16,185,129,0.12)",
          boxShadow: "inset 0 0 0 1px rgba(16,185,129,0.4)",
          padding: 14,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span style={{ color: "#34c759", fontSize: 16 }}>✓</span>
        <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, color: "var(--text-2)" }}>
          Работа принята. Осталось подтвердить оплату специалисту.
        </span>
      </div>
      <form action={action}>
        <input type="hidden" name="gigId" value={gigId} />
        <button
          type="submit"
          style={{
            width: "100%",
            height: 44,
            border: "none",
            borderRadius: 8,
            background: "#00c8b3",
            color: "#01130f",
            fontSize: 15,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Отметить как оплаченный
        </button>
      </form>
      {errLine(state?.error)}
      <span style={{ fontFamily: "'Handjet',monospace", fontSize: 12, textAlign: "center", color: "var(--text-4)" }}>
        Логический статус оплаты — без реальной транзакции (MVP).
      </span>
    </div>
  );
}

// Single-button gig action (submit-work) — hidden gigId + full-width primary.
function GigActionButton({ gigId, action: act, label }: { gigId: string; action: unknown; label: string }) {
  const [state, action] = useAction(act);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, lineHeight: "18px", color: "var(--text-3)" }}>
        Вы назначены на задачу. Когда закончите — сдайте работу на проверку заказчику.
      </span>
      <form action={action}>
        <input type="hidden" name="gigId" value={gigId} />
        <button type="submit" style={{ ...primaryBtn("var(--om-accent, #0088ff)"), width: "100%" }}>
          {label}
        </button>
      </form>
      {errLine(state?.error)}
    </div>
  );
}
