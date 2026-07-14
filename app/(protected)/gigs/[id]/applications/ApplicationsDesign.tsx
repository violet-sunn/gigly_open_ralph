"use client";

// «Отклики» rebuilt on the prototype's `applications` block (Gigly App.dc.html line 1116+): a «← Назад к проекту»
// link, the «Отклики» count + «на проект «{title}»», a derived assigned banner, and the applicant cards (avatar +
// name/verify/level + rating + status, stack tags, Подход / Уточняющие вопросы / Оценка, + Принять/Отклонить on
// pending applicants). Owner-gated by the page; the (unchanged) accept/reject actions are wired via useActionState.

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { acceptApplication, rejectApplication } from "@/app/actions/gig";
import type { GigApplicationsData } from "@/lib/view-models";
import { avatarColor, PatchIcon, STATUS_RGB } from "@/app/_design/util";
import "@/app/_design/tokens.css";

type ActionState = { error?: string } | null;
function useAction(fn: unknown) {
  return useActionState<ActionState, FormData>(fn as never, null);
}

function AcceptReject({ applicationId }: { applicationId: string }) {
  const [aState, aAction] = useAction(acceptApplication);
  const [rState, rAction] = useAction(rejectApplication);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 2 }}>
      <div style={{ display: "flex", gap: 10 }}>
        <form action={aAction} style={{ flex: 1 }}>
          <input type="hidden" name="applicationId" value={applicationId} />
          <button
            type="submit"
            style={{ width: "100%", height: 42, border: "none", borderRadius: 8, background: "var(--om-accent, #0088ff)", color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer" }}
          >
            Принять
          </button>
        </form>
        <form action={rAction}>
          <input type="hidden" name="applicationId" value={applicationId} />
          <button
            type="submit"
            style={{ height: 42, padding: "0 24px", border: "none", borderRadius: 8, background: "var(--surface-secondary)", color: "var(--text-2)", fontSize: 14, cursor: "pointer" }}
          >
            Отклонить
          </button>
        </form>
      </div>
      {(aState?.error || rState?.error) && (
        <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 12, color: "#ef4444" }}>{aState?.error || rState?.error}</span>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ fontFamily: "'Handjet',monospace", fontSize: 12, color: "var(--text-4)" }}>{label}</span>
      <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 14, lineHeight: "19px", color: "var(--text-2)" }}>{value}</span>
    </div>
  );
}

export function ApplicationsDesign({ data }: { data: GigApplicationsData }) {
  const router = useRouter();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 860 }}>
      <div
        onClick={() => router.push(`/gigs/${data.gigId}`)}
        style={{ display: "inline-flex", alignSelf: "flex-start", alignItems: "center", gap: 8, color: "var(--text-3)", fontFamily: "'Handjet',monospace", fontSize: 14, cursor: "pointer", padding: "4px 0" }}
      >
        ← Назад к проекту
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h2 style={{ margin: 0, fontFamily: "'Handjet',monospace", fontWeight: 600, fontSize: 24, color: "var(--text-1)", whiteSpace: "nowrap" }}>Отклики</h2>
          <span
            style={{ display: "flex", alignItems: "center", justifyContent: "center", minWidth: 24, height: 24, padding: "0 7px", borderRadius: 6, background: "var(--om-accent, #0088ff)", color: "#fff", fontFamily: "'Handjet',monospace", fontWeight: 700, fontSize: 15 }}
          >
            {data.count}
          </span>
        </div>
        <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, color: "var(--text-4)" }}>на проект «{data.title}»</span>
      </div>

      {data.assignedName && (
        <div style={{ borderRadius: 8, background: "rgba(16,185,129,0.1)", boxShadow: "inset 0 0 0 1px rgba(16,185,129,0.4)", padding: "14px 18px", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: "#34c759", fontSize: 16 }}>✓</span>
          <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 14, color: "var(--text-2)" }}>
            Назначен <b style={{ color: "var(--text-1)" }}>{data.assignedName}</b> — гиг переходит «В работу». Остальные отклики отклонены автоматически.
          </span>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {data.applicants.length > 0 ? (
          data.applicants.map((a) => {
            // A fresh application reads «Новый отклик» in accent blue (the reference); accepted/rejected keep their tone colour.
            const statusColor = a.pending ? "var(--om-accent, #0088ff)" : `rgb(${STATUS_RGB[a.status.tone] ?? "138,143,153"})`;
            const statusLabel = a.pending ? "Новый отклик" : a.status.label;
            const dim = data.assignedName && a.status.tone === "rejected" ? 0.55 : 1;
            return (
              <div
                key={a.id}
                style={{ borderRadius: 12, background: "var(--surface-card)", boxShadow: "inset 0 0 0 1px var(--hairline-08)", padding: 20, display: "flex", flexDirection: "column", gap: 14, opacity: dim }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{ width: 36, height: 36, flex: "none", borderRadius: "50%", background: avatarColor(a.name), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff" }}
                  >
                    {a.name.slice(0, 1)}
                  </span>
                  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text-1)", flex: "none" }}>{a.name}</span>
                      {a.verified && (
                        <span style={{ color: "var(--om-accent, #0088ff)", display: "flex", flex: "none" }}>
                          <PatchIcon size={16} />
                        </span>
                      )}
                      {a.level && (
                        <span style={{ fontFamily: "'Handjet',monospace", fontSize: 12, color: "#4ea3ff", flex: "none", whiteSpace: "nowrap" }}>[{a.level}]</span>
                      )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ color: "var(--text-5)", fontSize: 11, letterSpacing: 1 }}>★★★★★</span>
                      <span style={{ color: "var(--text-4)", fontSize: 11 }}>{a.rating.count}</span>
                    </div>
                  </div>
                  <div style={{ flex: 1 }} />
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, flex: "none", fontFamily: "'Handjet',monospace", fontSize: 12, color: statusColor }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: statusColor }} />
                    {statusLabel}
                  </span>
                </div>

                {a.tags.length > 0 && (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {a.tags.map((tg, i) => (
                      <span key={i} style={{ fontSize: 12, color: "#4ea3ff", background: "rgba(0,136,255,0.1)", borderRadius: 6, padding: "3px 8px" }}>{tg}</span>
                    ))}
                  </div>
                )}

                {a.approach && <Field label="Подход" value={a.approach} />}
                {a.questions && <Field label="Уточняющие вопросы" value={a.questions} />}
                {a.estimate && <Field label="Оценка трудозатрат" value={a.estimate} />}

                {(a.proposedBudget || a.proposedDeadline) && (
                  <div style={{ borderRadius: 8, background: "rgba(0,136,255,0.08)", boxShadow: "inset 0 0 0 1px rgba(0,136,255,0.3)", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
                    <span style={{ fontFamily: "'Handjet',monospace", fontWeight: 600, fontSize: 13, color: "#4ea3ff" }}>Предложил свои условия</span>
                    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <span style={{ fontFamily: "'Handjet',monospace", fontSize: 11, color: "var(--text-4)" }}>Бюджет</span>
                        <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 14, color: "var(--text-1)" }}>{a.proposedBudget ?? data.gigBudget}</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <span style={{ fontFamily: "'Handjet',monospace", fontSize: 11, color: "var(--text-4)" }}>Срок</span>
                        <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 14, color: "var(--text-1)" }}>{a.proposedDeadline ?? data.gigDeadline}</span>
                      </div>
                    </div>
                    <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 12, lineHeight: "16px", color: "var(--text-4)" }}>
                      Условия проекта: {data.gigBudget} · {data.gigDeadline}.{a.pending ? " При принятии предложенные условия станут условиями проекта." : ""}
                    </span>
                  </div>
                )}

                {a.pending && !data.assignedName && <AcceptReject applicationId={a.id} />}
              </div>
            );
          })
        ) : (
          <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 14, color: "var(--text-3)" }}>Откликов пока нет.</span>
        )}
      </div>
    </div>
  );
}
