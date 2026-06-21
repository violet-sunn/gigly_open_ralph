"use client";

// «Создать гиг» rebuilt on the prototype's `createGig` block (Gigly App.dc.html line 644+): the guided-brief form
// (Что нужно сделать? / Как поймём, что готово? / Что важно учесть? / Условия) + the right panel («Готовность брифа»
// live checklist + the fee «Сводка»). Controlled fields drive the live readiness AND submit via the (unchanged)
// createGig action (which redirects to /gigs/new/success). Category/criteria/tags ride via hidden inputs.

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { createGig } from "@/app/actions/gig";
import { CAT_RGB } from "@/app/_design/util";
import "@/app/_design/tokens.css";

type ActionState = { error?: string } | null;

const CRITERIA_SUGGESTIONS = ["Есть тесты", "Передача исходников", "Документация"];
const rub = (n: number) => `${new Intl.NumberFormat("ru-RU").format(n)} ₽`;

const card: React.CSSProperties = { borderRadius: 8, background: "var(--surface-card)", padding: 20, display: "flex", flexDirection: "column", gap: 16 };
const h2: React.CSSProperties = { margin: 0, fontFamily: "'Handjet',monospace", fontWeight: 600, fontSize: 22, color: "var(--text-1)" };
const sub: React.CSSProperties = { fontFamily: "'Manrope',sans-serif", fontSize: 13, color: "var(--text-4)" };
const label: React.CSSProperties = { fontFamily: "'Handjet',monospace", fontSize: 14, color: "var(--text-1)" };
const field: React.CSSProperties = {
  padding: "0 14px",
  borderRadius: 8,
  background: "var(--surface-sunken)",
  boxShadow: "inset 0 0 0 1px var(--hairline-08)",
  border: "none",
  outline: "none",
  color: "var(--text-1)",
  fontFamily: "'Manrope',sans-serif",
  fontSize: 14,
};
const inputStyle: React.CSSProperties = { ...field, height: 46 };
const areaStyle: React.CSSProperties = { ...field, resize: "none", padding: "12px 14px", lineHeight: "19px" };

export function CreateGigDesign({ categoryOptions }: { categoryOptions: { key: string; label: string }[] }) {
  const router = useRouter();
  const [state, action] = useActionState<ActionState, FormData>(createGig as never, null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [deliverables, setDeliverables] = useState("");
  const [constraints, setConstraints] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [criteria, setCriteria] = useState<string[]>([]);
  const [critInput, setCritInput] = useState("");

  const budgetNum = Number(budget) || 0;
  const fee = budgetNum > 0 ? Math.floor(budgetNum * 0.1) : 0;

  const addCrit = (t: string) => {
    const v = t.trim();
    if (v) setCriteria((c) => (c.includes(v) ? c : [...c, v]));
  };
  const addTag = (t: string) => {
    const v = t.trim();
    if (v) setTags((c) => (c.includes(v) ? c : [...c, v]));
  };

  // 7-point «Готовность брифа» checklist (mirrors the prototype).
  const checks = [
    { label: "Название", done: title.trim() !== "" },
    { label: "Категория", done: category !== "" },
    { label: "Описание", done: description.trim().length >= 20 },
    { label: "Цель", done: goal.trim() !== "" },
    { label: "Ожидаемый результат", done: deliverables.trim() !== "" },
    { label: "Критерии приёмки", done: criteria.length > 0 },
    { label: "Бюджет и срок", done: budgetNum > 0 && deadline.trim() !== "" },
  ];
  const done = checks.filter((c) => c.done).length;
  const pct = Math.round((done / checks.length) * 100);
  const scoreColor = done >= 6 ? "#34c759" : done >= 4 ? "var(--om-accent, #0088ff)" : "#f59e0b";
  const firstGap = checks.find((c) => !c.done);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div
        onClick={() => router.push("/my-gigs")}
        style={{ display: "inline-flex", alignSelf: "flex-start", alignItems: "center", gap: 8, color: "var(--text-3)", fontFamily: "'Handjet',monospace", fontSize: 14, cursor: "pointer", padding: "4px 0" }}
      >
        ← Назад к гигам
      </div>

      <div
        style={{
          borderRadius: 8,
          background: "linear-gradient(90deg, rgba(0,136,255,0.10), rgba(0,136,255,0.03))",
          boxShadow: "inset 0 0 0 1px rgba(0,136,255,0.25)",
          padding: "14px 18px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, lineHeight: "18px", color: "var(--text-2)" }}>
          Чем понятнее бриф — тем точнее отклики и меньше споров. Отвечайте простыми словами, без жаргона: панель «Готовность брифа» справа подскажет, чего не хватает.
        </span>
      </div>

      <form action={action} style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        <input type="hidden" name="category" value={category} />
        <input type="hidden" name="acceptanceCriteria" value={criteria.join("\n")} />
        <input type="hidden" name="tags" value={tags.join(",")} />

        {/* ФОРМА */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 12 }}>
          {/* 1. Что нужно сделать */}
          <div style={card}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <h2 style={h2}>Что нужно сделать?</h2>
              <span style={sub}>Опишите задачу так, как объяснили бы коллеге — простыми словами.</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={label}>Название гига</label>
              <input name="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Напр.: Исправить утечку памяти в Node.js" style={inputStyle} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={label}>Категория</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {categoryOptions.map((ct) => {
                  const rgb = CAT_RGB[ct.key] ?? "0,136,255";
                  const active = category === ct.key;
                  return (
                    <div
                      key={ct.key}
                      onClick={() => setCategory(active ? "" : ct.key)}
                      style={{
                        padding: "7px 14px",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontSize: 14,
                        color: `rgb(${rgb})`,
                        background: active ? `rgba(${rgb},0.16)` : "transparent",
                        boxShadow: `inset 0 0 0 1px rgba(${rgb},${active ? 0.7 : 0.35})`,
                      }}
                    >
                      {ct.label}
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={label}>Описание — что есть сейчас и что болит</label>
              <textarea
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Контекст и текущее состояние: какой стек, что сломано или чего не хватает…"
                style={{ ...areaStyle, height: 96 }}
              />
            </div>
          </div>

          {/* 2. Как поймём, что готово */}
          <div style={{ ...card, boxShadow: "inset 0 0 0 1px rgba(0,136,255,0.25)" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <h2 style={h2}>Как поймём, что готово?</h2>
                <span style={{ fontFamily: "'Handjet',monospace", fontSize: 11, color: "var(--om-accent, #0088ff)", background: "rgba(0,136,255,0.12)", borderRadius: 5, padding: "3px 8px" }}>
                  сердце брифа
                </span>
              </div>
              <span style={sub}>Сформулируйте результат как факты. По этим пунктам вы примете работу — это снижает споры и правки.</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={label}>Зачем это нужно — цель</label>
              <input name="goal" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="Результат для бизнеса, а не «как». Напр.: дашборд грузится быстро при росте данных" style={inputStyle} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={label}>Что заказчик получит на выходе</label>
              <textarea name="deliverables" value={deliverables} onChange={(e) => setDeliverables(e.target.value)} placeholder="Осязаемый результат: PR в репозиторий, рабочее демо, краткая инструкция…" style={{ ...areaStyle, height: 72 }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <label style={label}>Критерии приёмки — «Готово, когда…»</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  value={critInput}
                  onChange={(e) => setCritInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCrit(critInput);
                      setCritInput("");
                    }
                  }}
                  placeholder="…например: память не растёт при 500 подключениях за 6 часов"
                  style={{ ...inputStyle, flex: 1, minWidth: 0, height: 44 }}
                />
                <button
                  type="button"
                  onClick={() => {
                    addCrit(critInput);
                    setCritInput("");
                  }}
                  style={{ flex: "none", height: 44, padding: "0 18px", border: "none", borderRadius: 8, background: "var(--om-accent, #0088ff)", color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer" }}
                >
                  Добавить
                </button>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {CRITERIA_SUGGESTIONS.map((s) => (
                  <span
                    key={s}
                    onClick={() => addCrit(s)}
                    style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: "'Manrope',sans-serif", fontSize: 12, color: "var(--text-3)", background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px var(--hairline-06)", borderRadius: 6, padding: "5px 10px", cursor: "pointer" }}
                  >
                    + {s}
                  </span>
                ))}
              </div>
              {criteria.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {criteria.map((c, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", borderRadius: 8, background: "var(--surface-sunken)", boxShadow: "inset 0 0 0 1px var(--hairline-06)" }}>
                      <span style={{ color: "#34c759", fontSize: 13, lineHeight: "18px", flex: "none" }}>✓</span>
                      <span style={{ flex: 1, fontFamily: "'Manrope',sans-serif", fontSize: 13, lineHeight: "18px", color: "var(--text-2)" }}>Готово, когда {c}</span>
                      <span onClick={() => setCriteria((arr) => arr.filter((_, idx) => idx !== i))} style={{ color: "var(--text-4)", cursor: "pointer", flex: "none" }}>✕</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 3. Что важно учесть */}
          <div style={card}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <h2 style={h2}>Что важно учесть?</h2>
              <span style={sub}>Рамки, в которых работаем — чтобы не было сюрпризов.</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={label}>Ограничения <span style={{ color: "var(--text-4)" }}>(необязательно)</span></label>
              <textarea name="constraints" value={constraints} onChange={(e) => setConstraints(e.target.value)} placeholder="Технологии, окружение, доступы, чего делать нельзя…" style={{ ...areaStyle, height: 72 }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={label}>Стек и теги</label>
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag(tagInput);
                    setTagInput("");
                  }
                }}
                placeholder="Введите тег и нажмите Enter (напр.: Node.js)"
                style={inputStyle}
              />
              {tags.length > 0 && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {tags.map((tg) => (
                    <span
                      key={tg}
                      onClick={() => setTags((arr) => arr.filter((t) => t !== tg))}
                      style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#4ea3ff", background: "rgba(0,136,255,0.1)", borderRadius: 6, padding: "4px 10px", cursor: "pointer" }}
                    >
                      {tg} <span style={{ color: "var(--text-4)" }}>✕</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 4. Условия */}
          <div style={card}>
            <h2 style={h2}>Условия</h2>
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={label}>Бюджет, ₽</label>
                <input name="budget" type="number" min="1" step="1" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="150 000" style={inputStyle} />
                <span style={{ fontFamily: "'Handjet',monospace", fontSize: 12, color: "var(--text-4)" }}>Специалист получит эту сумму полностью.</span>
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={label}>Срок, дней</label>
                <input name="deadlineDays" type="number" min="1" step="1" value={deadline} onChange={(e) => setDeadline(e.target.value)} placeholder="Напр.: 14" style={inputStyle} />
              </div>
            </div>
          </div>
        </div>

        {/* ПРАВАЯ ПАНЕЛЬ */}
        <div style={{ width: 380, flex: "none", display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Готовность брифа */}
          <div style={{ borderRadius: 12, background: "var(--surface-sunken)", boxShadow: "inset 0 0 0 1px var(--border-strong)", padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
            <h2 style={h2}>Готовность брифа</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "'Handjet',monospace", fontSize: 14, color: "var(--text-3)" }}>Заполнено</span>
                <span style={{ fontFamily: "'Handjet',monospace", fontWeight: 700, fontSize: 14, color: scoreColor }}>{done} / {checks.length}</span>
              </div>
              <div style={{ height: 6, borderRadius: 6, background: "var(--hairline-08)", overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 6, background: scoreColor, width: `${pct}%` }} />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {checks.map((r) => (
                <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 18, flex: "none", textAlign: "center", fontSize: 13, color: r.done ? "#34c759" : "var(--text-5)" }}>{r.done ? "✓" : "○"}</span>
                  <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, color: r.done ? "var(--text-2)" : "var(--text-4)" }}>{r.label}</span>
                </div>
              ))}
            </div>
            <div style={{ borderRadius: 8, background: "rgba(0,136,255,0.06)", boxShadow: "inset 0 0 0 1px rgba(0,136,255,0.2)", padding: 12, display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontFamily: "'Handjet',monospace", fontWeight: 600, fontSize: 13, color: "var(--om-accent, #0088ff)" }}>
                {firstGap ? "Следующий шаг" : "Бриф готов к публикации"}
              </span>
              <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 12, lineHeight: "16px", color: "var(--text-3)" }}>
                {firstGap ? `Добавьте: ${firstGap.label.toLowerCase()}.` : "Все ключевые поля заполнены — можно публиковать."}
              </span>
            </div>
          </div>

          {/* Сводка (комиссия) */}
          <div style={{ borderRadius: 12, background: "var(--surface-sunken)", boxShadow: "inset 0 0 0 1px var(--border-strong)", padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "'Handjet',monospace", fontSize: 14, color: "var(--text-3)" }}>
                <span>Бюджет</span>
                <span style={{ color: "var(--text-1)" }}>{budgetNum > 0 ? rub(budgetNum) : "—"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "'Handjet',monospace", fontSize: 14, color: "var(--text-3)" }}>
                <span>Сервисный сбор (10%)</span>
                <span style={{ color: "var(--text-1)" }}>{rub(fee)}</span>
              </div>
              <div style={{ height: 1, background: "var(--hairline-08)" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "'Manrope',sans-serif", fontWeight: 600, fontSize: 16, color: "var(--text-1)" }}>
                <span>Итого к оплате</span>
                <span style={{ color: "var(--om-accent, #0088ff)" }}>{rub(budgetNum + fee)}</span>
              </div>
            </div>
            <button type="submit" style={{ height: 46, border: "none", borderRadius: 8, background: "var(--om-accent, #0088ff)", color: "#fff", fontSize: 15, fontWeight: 500, cursor: "pointer" }}>
              Опубликовать гиг
            </button>
            {state?.error && <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 12, color: "#ef4444" }}>{state.error}</span>}
            <span style={{ fontFamily: "'Handjet',monospace", fontSize: 12, textAlign: "center", color: "var(--text-4)" }}>
              Сбор 10% — за нахождение специалиста и сопровождение сделки.
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}
