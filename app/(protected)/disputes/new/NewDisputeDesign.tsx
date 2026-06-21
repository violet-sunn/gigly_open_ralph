"use client";

// «Открыть спор» rebuilt on the prototype's `disputeNew` (Gigly App.dc.html line 924+): a «← Отмена» link, the amber
// warning banner, then the form — reason chips + description textarea + «Открыть спор» — wired to the (unchanged)
// openDispute action. The shell header supplies the «ОТКРЫТЬ СПОР» title.

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { openDispute } from "@/app/actions/dispute";
import "@/app/_design/tokens.css";

type ActionState = { error?: string } | null;

const REASON_OPTIONS = [
  "Оплата не поступила",
  "Результат не соответствует ТЗ",
  "Заказчик не выходит на связь",
  "Исполнитель не выходит на связь",
  "Просрочен срок выполнения",
  "Другое",
];

export function NewDisputeDesign({ gigId, gigTitle }: { gigId: string; gigTitle: string }) {
  const router = useRouter();
  const [state, action] = useActionState<ActionState, FormData>(openDispute as never, null);
  const [reason, setReason] = useState(REASON_OPTIONS[0]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 640 }}>
      <div
        onClick={() => router.push(`/gigs/${gigId}`)}
        style={{ display: "inline-flex", alignSelf: "flex-start", alignItems: "center", gap: 8, color: "var(--text-3)", fontFamily: "'Handjet',monospace", fontSize: 14, cursor: "pointer", padding: "4px 0" }}
      >
        ← Отмена
      </div>

      <div style={{ borderRadius: 8, background: "linear-gradient(90deg, rgba(245,158,11,0.10), rgba(245,158,11,0.03))", boxShadow: "inset 0 0 0 1px rgba(245,158,11,0.25)", padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 18 }}>⚖️</span>
        <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, lineHeight: "18px", color: "var(--text-2)" }}>
          Спор стоит открывать, когда вы не смогли договориться напрямую по проекту «{gigTitle}». Модератор изучит переписку и критерии приёмки — описывайте факты.
        </span>
      </div>

      <form action={action} style={{ borderRadius: 8, background: "var(--surface-card)", padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
        <input type="hidden" name="gigId" value={gigId} />
        <input type="hidden" name="reason" value={reason} />

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <label style={{ fontFamily: "'Handjet',monospace", fontSize: 14, color: "var(--text-1)" }}>Причина спора</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {REASON_OPTIONS.map((r) => {
              const active = r === reason;
              return (
                <div
                  key={r}
                  onClick={() => setReason(r)}
                  style={{ padding: "7px 14px", borderRadius: 8, cursor: "pointer", fontSize: 13, color: active ? "var(--om-accent, #0088ff)" : "var(--text-3)", background: active ? "rgba(0,136,255,0.12)" : "transparent", boxShadow: `inset 0 0 0 1px ${active ? "rgba(0,136,255,0.5)" : "var(--hairline-08)"}` }}
                >
                  {r}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <label style={{ fontFamily: "'Handjet',monospace", fontSize: 14, color: "var(--text-1)" }}>Опишите проблему</label>
          <textarea
            name="description"
            placeholder="Что произошло, чего вы ожидали и что получили. Сошлитесь на критерии приёмки и переписку…"
            style={{ height: 120, resize: "none", padding: "12px 14px", borderRadius: 8, background: "var(--surface-sunken)", boxShadow: "inset 0 0 0 1px var(--hairline-08)", border: "none", outline: "none", color: "var(--text-1)", fontFamily: "'Manrope',sans-serif", fontSize: 14, lineHeight: "19px" }}
          />
        </div>

        <button type="submit" style={{ height: 46, border: "none", borderRadius: 8, background: "var(--om-accent, #0088ff)", color: "#fff", fontSize: 15, fontWeight: 500, cursor: "pointer" }}>
          Открыть спор
        </button>
        {state?.error && <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 12, color: "#ef4444" }}>{state.error}</span>}
        <span style={{ fontFamily: "'Handjet',monospace", fontSize: 12, textAlign: "center", color: "var(--text-4)" }}>
          Средства по гигу будут заморожены до решения модератора.
        </span>
      </form>
    </div>
  );
}
