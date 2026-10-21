// Interface fragments for the landing page: cropped pieces of the real product, built on the same markup
// conventions as app/_design/GigCard.tsx (inline styles on the design tokens), with sample content. Each root
// carries `data-ui`, so the page around them is held to the poster rules while the product keeps its own.
// All names, titles and figures here are SAMPLE content (see the report), never real customers.

import type { CSSProperties, ReactNode } from "react";
import { STATUS_RGB, CAT_RGB, avatarColor } from "./util";

const MONO = "'Handjet',monospace";
const TEXT = "'Manrope',sans-serif";

const SAMPLE_GIG = {
  company: "ТехКорп",
  category: "backend",
  categoryLabel: "Backend",
  title: "Миграция платежей на новый API",
  tags: ["Node.js", "PostgreSQL"],
  budget: "150 000 ₽",
  deadline: "14 дней",
  specialist: "Алексей И.",
};

const CRITERIA = [
  "Все платежи проходят через API v2",
  "Старый API отключён без простоя",
  "Тесты зелёные, покрытие от 80%",
  "Документация обновлена",
];

function Card({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      data-ui
      style={{
        borderRadius: 16,
        background: "var(--surface-card)",
        boxShadow: "inset 0 0 0 1px var(--hairline-08), inset 0 1px 0 var(--hairline-06)",
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        fontFamily: TEXT,
        color: "var(--text-1)",
        fontSize: 13,
        lineHeight: "17px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

const label: CSSProperties = { fontSize: 12, color: "var(--text-3)" };
const field: CSSProperties = {
  borderRadius: 8,
  background: "var(--surface-sunken)",
  boxShadow: "inset 0 0 0 1px var(--hairline-10)",
  padding: "8px 10px",
  fontSize: 13,
  lineHeight: "17px",
  color: "var(--text-2)",
};

/** A checklist row. `on` rows carry the tick that animates in with the chapter (`.tick .mark`, landing.css). */
function Check({ text, on, k }: { text: string; on: boolean; k: number }) {
  return (
    <div className="tick" style={{ display: "flex", gap: 8, alignItems: "flex-start", "--k": k } as CSSProperties}>
      <span
        style={{
          width: 16,
          height: 16,
          flex: "none",
          borderRadius: 4,
          marginTop: 1,
          background: on ? "var(--om-accent,#0088ff)" : "transparent",
          boxShadow: on ? "none" : "inset 0 0 0 1px var(--border-strong)",
          display: "grid",
          placeItems: "center",
        }}
        aria-hidden="true"
      >
        {on && (
          <svg className="mark" width="10" height="8" viewBox="0 0 10 8" fill="none" style={{ display: "block" }}>
            <path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span style={{ color: on ? "var(--text-3)" : "var(--text-1)", textDecoration: on ? "line-through" : "none" }}>{text}</span>
    </div>
  );
}

/** Acceptance criteria as the client writes them on create-gig. */
export function CriteriaFragment() {
  return (
    <Card>
      <span style={{ fontWeight: 600 }}>Критерии приёмки</span>
      <span style={label}>Обязательно, минимум один пункт</span>
      {CRITERIA.map((c, i) => (
        <Check key={c} text={c} on={false} k={i} />
      ))}
      <span style={{ ...field, color: "var(--text-3)", textAlign: "center" }}>+ Добавить пункт</span>
    </Card>
  );
}

/** The application form: approach, questions, estimate. No cover letter. */
export function ApplyFragment() {
  return (
    <Card>
      <span style={{ fontWeight: 600 }}>Отклик на гиг</span>
      <span style={label}>Подход</span>
      <div style={field}>Сначала адаптер к v2 за фича-флагом, затем перевод платежей по 10% в день. Старый API выключаем после недели без ошибок.</div>
      <span style={label}>Вопросы к постановке</span>
      <div style={field}>Есть ли окно простоя для переключения?</div>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={label}>Срок, дней</span>
          <div style={{ ...field, width: 64, textAlign: "center", fontFamily: MONO, fontSize: 16, color: "var(--text-1)" }}>12</div>
        </div>
        <span
          style={{
            marginLeft: "auto",
            height: 36,
            padding: "0 14px",
            borderRadius: 8,
            background: "var(--om-accent,#0088ff)",
            color: "#fff",
            fontSize: 13,
            fontWeight: 500,
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          Откликнуться
        </span>
      </div>
    </Card>
  );
}

const APPLICANTS = [
  { name: "Алексей И.", meta: "Senior · 12 дней", state: "accepted" },
  { name: "Мария С.", meta: "Senior · 10 дней", state: "rejected" },
  { name: "Дмитрий К.", meta: "Middle+ · 15 дней", state: "rejected" },
  { name: "Игорь В.", meta: "Senior · 9 дней", state: "rejected" },
] as const;

/** The client's applicant list after one application is accepted: the rest close automatically. */
export function ApplicantsFragment() {
  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontWeight: 600 }}>Отклики</span>
        <span style={{ fontFamily: MONO, fontSize: 15, color: "var(--text-3)" }}>4</span>
      </div>
      {APPLICANTS.map((a) => {
        const accepted = a.state === "accepted";
        const rgb = accepted ? STATUS_RGB.completed : STATUS_RGB.rejected;
        return (
          <div key={a.name} style={{ display: "flex", alignItems: "center", gap: 8, opacity: accepted ? 1 : 0.6 }}>
            <span
              style={{
                width: 26,
                height: 26,
                flex: "none",
                borderRadius: "50%",
                background: avatarColor(a.name),
                display: "grid",
                placeItems: "center",
                fontSize: 11,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {a.name.slice(0, 1)}
            </span>
            <div style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }}>
              <span style={{ fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.name}</span>
              <span style={{ fontSize: 11, color: "var(--text-3)", lineHeight: "14px" }}>{a.meta}</span>
            </div>
            <span style={{ fontFamily: MONO, fontSize: 14, color: `rgb(${rgb})`, whiteSpace: "nowrap" }}>{accepted ? "Принят" : "Отклонён"}</span>
          </div>
        );
      })}
    </Card>
  );
}

type Stage = "open" | "in-progress" | "verification" | "paid";

const STAGE: Record<Stage, { label: string; rgb: string; posted: string }> = {
  open: { label: "Открыт", rgb: STATUS_RGB.open, posted: "2 ч. назад" },
  "in-progress": { label: "В работе", rgb: STATUS_RGB["in-progress"], posted: "3 дня назад" },
  verification: { label: "На проверке", rgb: STATUS_RGB.verification, posted: "12 дней назад" },
  paid: { label: "Оплачен", rgb: STATUS_RGB.completed, posted: "16 дней назад" },
};

/** The product's gig card (app/_design/GigCard.tsx, compact), one stage further along each time. */
export function GigCardFragment({ stage }: { stage: Stage }) {
  const s = STAGE[stage];
  const dot = `rgb(${s.rgb})`;
  const g = SAMPLE_GIG;
  const catRgb = CAT_RGB[g.category] ?? "0,136,255";
  const ticked = stage === "verification" ? 2 : stage === "paid" ? 4 : 0;

  return (
    <div
      data-ui
      className="card"
      style={{
        borderRadius: 16,
        // the product card's own status glow (gigly_full_design «Gig Card»), kept inside the fragment
        background: `radial-gradient(120% 100% at 50% 0%, rgba(${s.rgb},0.22) 0%, rgba(${s.rgb},0.05) 45%, rgba(${s.rgb},0) 100%), var(--surface-card)`, // taste-skill-ignore
        boxShadow: `inset 0 0 0 1px rgba(${s.rgb},0.3)`,
        display: "flex",
        flexDirection: "column",
        fontFamily: TEXT,
        color: "var(--text-1)",
        fontSize: 13,
        lineHeight: "17px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: dot }} />
          <span style={{ fontFamily: MONO, fontSize: 15, color: dot, whiteSpace: "nowrap" }}>{s.label}</span>
        </div>
        <span style={{ fontFamily: MONO, fontSize: 12, color: "var(--text-3)", whiteSpace: "nowrap" }}>{s.posted}</span>
      </div>

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
                background: avatarColor(g.company),
                display: "grid",
                placeItems: "center",
                fontSize: 11,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {g.company.slice(0, 1)}
            </span>
            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{g.company}</span>
          </div>
          <span style={{ flex: "none", fontSize: 12, color: `rgb(${catRgb})`, border: `1px solid rgba(${catRgb},0.45)`, borderRadius: 6, padding: "2px 8px" }}>
            {g.categoryLabel}
          </span>
        </div>

        <span style={{ fontWeight: 600, fontSize: 17, lineHeight: "21px" }}>{g.title}</span>

        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {g.tags.map((t) => (
            <span key={t} style={{ fontSize: 12, color: "var(--accent-ink,#4ea3ff)", background: "rgba(0,136,255,0.1)", borderRadius: 6, padding: "3px 8px" }}>
              {t}
            </span>
          ))}
        </div>

        {stage === "open" && (
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 2 }}>
            <span>
              <span style={label}>Фикс. цена</span>
              <br />
              <span style={{ fontWeight: 600, fontSize: 15 }}>{g.budget}</span>
            </span>
            <span>
              <span style={label}>Срок</span>
              <br />
              <span style={{ fontWeight: 600, fontSize: 15 }}>{g.deadline}</span>
            </span>
            <span style={{ alignSelf: "flex-end", fontFamily: MONO, fontSize: 14, color: "var(--text-3)" }}>3 отклика</span>
          </div>
        )}

        {stage === "in-progress" && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 22, height: 22, borderRadius: "50%", background: avatarColor(g.specialist), display: "grid", placeItems: "center", fontSize: 11, fontWeight: 700, color: "#fff" }}>
                {g.specialist.slice(0, 1)}
              </span>
              <span>
                <span style={label}>Исполнитель </span>
                <span style={{ fontWeight: 600 }}>{g.specialist}</span>
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 2 }}>
              <span style={{ fontFamily: MONO, fontSize: 12, color: "var(--text-3)" }}>21 окт</span>
              <div style={{ flex: 1, height: 4, borderRadius: 3, background: "rgba(159,160,164,0.4)", overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 3, background: "var(--text-3)", width: "36%" }} />
              </div>
              <span style={{ fontFamily: MONO, fontSize: 12, color: "var(--text-3)" }}>4 ноя</span>
            </div>
          </>
        )}

        {(stage === "verification" || stage === "paid") && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 2 }}>
            <span style={label}>Критерии приёмки · {ticked} из {CRITERIA.length}</span>
            {CRITERIA.map((c, i) => (
              <Check key={c} text={c} on={i < ticked} k={i} />
            ))}
          </div>
        )}

        {stage === "paid" && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 2 }}>
            <span style={label}>Оценка 5,0</span>
            <span style={{ fontFamily: MONO, fontSize: 18, color: `rgb(${STATUS_RGB.completed})` }}>{g.budget} выплачено</span>
          </div>
        )}
      </div>
    </div>
  );
}
