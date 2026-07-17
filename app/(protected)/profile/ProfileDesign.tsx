"use client";

// «Профиль» rebuilt on the prototype's profile blocks (Gigly App.dc.html line 309+ specialist, 407+ company): the ID
// card (avatar + name + role + verified/since OR company реквизиты) then, for a SPECIALIST, the 2-col BLOCK — Стек,
// Опыт (bio + experience), Избранные категории, Реализованные проекты (design GigCards). Owner edit pencils open the
// prototype's in-place edit modals (bio / cats / stack / company requisites), wired to updateProfile +
// setFavoriteCategories — there is no standalone edit screen. The shell header supplies the «ПРОФИЛЬ» title.

import { useState, useEffect, useActionState } from "react";
import { useRouter } from "next/navigation";
import type { ProfileData } from "@/lib/view-models";
import { INN_LENGTH_PERSON, KPP_LENGTH } from "@/lib/requisites";
import { updateProfile } from "@/app/actions/profile";
import { setFavoriteCategories } from "@/app/actions/category";
import { GigCard } from "@/app/_design/GigCard";
import { CAT_RGB, PatchIcon, tagRgb } from "@/app/_design/util";
import "@/app/_design/tokens.css";

const card: React.CSSProperties = { borderRadius: 8, background: "var(--surface-card)", padding: 20, display: "flex", flexDirection: "column", gap: 16 };
const blockH2: React.CSSProperties = { fontFamily: "'Handjet',monospace", fontWeight: 600, fontSize: 22, color: "var(--text-1)" };
const nameStyle: React.CSSProperties = { fontFamily: "'Manrope',sans-serif", fontWeight: 500, fontSize: 32, lineHeight: "36px", color: "var(--text-1)" };
const roleTagStyle: React.CSSProperties = { alignSelf: "flex-start", fontFamily: "'Handjet',monospace", fontSize: 16, background: "#fff", color: "#0066cc", padding: "1px 6px", whiteSpace: "nowrap" };
const sinceStyle: React.CSSProperties = { fontFamily: "'Handjet',monospace", fontSize: 13, color: "#9fa0a4" };

// ---- edit modals (transported from the prototype's profile overlays) -------------------------------------------
const overlay: React.CSSProperties = { position: "fixed", inset: 0, zIndex: 95, background: "rgba(1,3,14,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 };
const cardOf = (w: number): React.CSSProperties => ({ width: w, maxWidth: "100%", borderRadius: 14, background: "var(--surface-card)", boxShadow: "inset 0 0 0 1px var(--hairline-10), 0 20px 60px rgba(0,0,0,0.6)", padding: 24, display: "flex", flexDirection: "column", gap: 16, boxSizing: "border-box" });
const modalTitle: React.CSSProperties = { margin: 0, fontFamily: "'Handjet',monospace", fontWeight: 600, fontSize: 22, color: "var(--text-1)" };
const fieldInput: React.CSSProperties = { height: 44, padding: "0 14px", borderRadius: 8, background: "var(--surface-sunken)", boxShadow: "inset 0 0 0 1px var(--hairline-08)", border: "none", outline: "none", color: "var(--text-1)", fontFamily: "'Manrope',sans-serif", fontSize: 14, width: "100%", boxSizing: "border-box" };
const textareaStyle: React.CSSProperties = { height: 160, resize: "none", padding: 14, borderRadius: 8, background: "var(--surface-sunken)", boxShadow: "inset 0 0 0 1px var(--hairline-08)", border: "none", outline: "none", color: "var(--text-1)", fontFamily: "'Manrope',sans-serif", fontSize: 14, lineHeight: "20px", width: "100%", boxSizing: "border-box" };
const saveBtn: React.CSSProperties = { height: 44, border: "none", borderRadius: 8, background: "var(--om-accent, #0088ff)", color: "#fff", fontSize: 15, fontWeight: 500, cursor: "pointer" };
const fieldLabel: React.CSSProperties = { fontFamily: "'Handjet',monospace", fontSize: 13, color: "var(--text-4)" };
const errStyle: React.CSSProperties = { fontFamily: "'Manrope',sans-serif", fontSize: 12, color: "#ef4444" };

function PencilGlyph({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
    </svg>
  );
}

// Owner-only edit affordance. A LABELED button (pencil + «Редактировать») — never a bare icon — so it
// unmistakably means «edit», not «save» (Спец #9), and reads consistently on both roles (Заказчик #1).
// Persisting happens only via the modal's explicit «Сохранить». `onClick` is undefined for non-owners
// (open() returns undefined) → the button is omitted entirely.
function EditButton({ onClick, label = "Редактировать" }: { onClick?: () => void; label?: string }) {
  if (!onClick) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        height: 30,
        padding: "0 12px",
        border: "none",
        borderRadius: 8,
        background: "var(--hairline-08)",
        boxShadow: "inset 0 0 0 1px var(--hairline-10)",
        color: "var(--text-2)",
        fontFamily: "'Handjet',monospace",
        fontSize: 15,
        lineHeight: 1,
        cursor: "pointer",
        whiteSpace: "nowrap",
        flex: "none",
      }}
    >
      <PencilGlyph size={13} />
      {label}
    </button>
  );
}

const LEVEL_LABEL: Record<string, string> = { MIDDLE: "Middle+", SENIOR: "Senior" };

function GlobeIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855A8 8 0 0 0 5.145 4H7.5zM4.09 4a9.3 9.3 0 0 1 .64-1.539 7 7 0 0 1 .597-.933A7.03 7.03 0 0 0 2.255 4zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a7 7 0 0 0-.656 2.5zM4.847 5a18 18 0 0 0-.338 2.5H7.5V5zM8.5 5v2.5h2.99a18 18 0 0 0-.338-2.5zM4.51 8.5a18 18 0 0 0 .337 2.5H7.5V8.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5zM5.145 12q.208.58.468 1.068c.552 1.035 1.218 1.65 1.887 1.855V12zm.182 2.472a7 7 0 0 1-.597-.933A9.3 9.3 0 0 1 4.09 12H2.255a7 7 0 0 0 3.072 2.472M3.82 11a13.7 13.7 0 0 1-.312-2.5h-1.49c.062.89.291 1.733.656 2.5zm6.853 3.472A7 7 0 0 0 13.745 12H11.91a9.3 9.3 0 0 1-.64 1.539 7 7 0 0 1-.597.933M8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855q.26-.487.468-1.068zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-1.49a13.7 13.7 0 0 1-.312 2.5m2.802-3.5a7 7 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7 7 0 0 0-3.072-2.472q.317.435.597.933M10.855 4a8 8 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4z" />
    </svg>
  );
}

function ModalHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <h2 style={modalTitle}>{title}</h2>
      <span onClick={onClose} style={{ color: "var(--text-4)", cursor: "pointer", fontSize: 14 }}>✕</span>
    </div>
  );
}

// Round-trip every field the action's full-record upsert touches EXCEPT the ones this modal edits, so a save doesn't
// blank the siblings. `noRedirect` keeps updateProfile in-place (the modal refreshes + closes client-side instead).
function HiddenFields({ fields, omit }: { fields: Record<string, string>; omit: string[] }) {
  return (
    <>
      {Object.entries(fields)
        .filter(([k]) => !omit.includes(k))
        .map(([k, v]) => (
          <input key={k} type="hidden" name={k} value={v} />
        ))}
      <input type="hidden" name="noRedirect" value="true" />
    </>
  );
}

function BioModal({ fields, onClose }: { fields: Record<string, string>; onClose: () => void }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(updateProfile, null);
  // Спец #15 — the onboarding grade (Middle+/Senior) is settable here, alongside the «Опыт» description.
  const [level, setLevel] = useState<string>(fields.experienceLevel ?? "");
  useEffect(() => {
    if (state?.success) {
      onClose();
      router.refresh();
    }
  }, [state, onClose, router]);
  return (
    <div style={overlay} onClick={onClose}>
      <form action={action} onClick={(e) => e.stopPropagation()} style={cardOf(520)}>
        <ModalHeader title="Опыт и уровень" onClose={onClose} />
        <HiddenFields fields={fields} omit={["bio", "experienceLevel"]} />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={fieldLabel}>Уровень</span>
          <input type="hidden" name="experienceLevel" value={level} />
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { value: "", label: "Не указан" },
              { value: "MIDDLE", label: "Middle+" },
              { value: "SENIOR", label: "Senior" },
            ].map((opt) => {
              const on = level === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setLevel(opt.value)}
                  aria-pressed={on}
                  style={{
                    flex: 1,
                    height: 40,
                    borderRadius: 8,
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "'Manrope',sans-serif",
                    fontSize: 14,
                    color: on ? "#fff" : "var(--text-2)",
                    background: on ? "var(--om-accent, #0088ff)" : "var(--surface-sunken)",
                    boxShadow: on ? "none" : "inset 0 0 0 1px var(--hairline-08)",
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={fieldLabel}>Описание</span>
          <textarea name="bio" defaultValue={fields.bio ?? ""} placeholder="Расскажите о специализации и опыте…" style={textareaStyle} />
        </div>
        {state?.error && <span style={errStyle}>{state.error}</span>}
        <button type="submit" disabled={pending} style={saveBtn}>Сохранить</button>
      </form>
    </div>
  );
}

function StackModal({ fields, onClose }: { fields: Record<string, string>; onClose: () => void }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(updateProfile, null);
  const [tags, setTags] = useState<string[]>(() => (fields.techStack ?? "").split(",").map((t) => t.trim()).filter(Boolean));
  const [draft, setDraft] = useState("");
  useEffect(() => {
    if (state?.success) {
      onClose();
      router.refresh();
    }
  }, [state, onClose, router]);
  const add = () => {
    const t = draft.trim();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setDraft("");
  };
  return (
    <div style={overlay} onClick={onClose}>
      <form action={action} onClick={(e) => e.stopPropagation()} style={cardOf(460)}>
        <ModalHeader title="Редактировать стек" onClose={onClose} />
        <HiddenFields fields={fields} omit={["techStack"]} />
        <input type="hidden" name="techStack" value={tags.join(",")} />
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add();
              }
            }}
            placeholder="Добавить технологию и Enter"
            style={{ ...fieldInput, flex: 1, minWidth: 0 }}
          />
          <button type="button" onClick={add} style={{ flex: "0 0 auto", height: 44, padding: "0 18px", border: "none", borderRadius: 8, background: "var(--om-accent, #0088ff)", color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
            Добавить
          </button>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {tags.map((t, i) => {
            const rgb = tagRgb(t);
            return (
              <span key={i} onClick={() => setTags(tags.filter((_, j) => j !== i))} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: `rgb(${rgb})`, background: `rgba(${rgb},0.12)`, borderRadius: 6, padding: "5px 12px", cursor: "pointer" }}>
                {t}
                <span style={{ color: "var(--text-4)" }}>✕</span>
              </span>
            );
          })}
        </div>
        {state?.error && <span style={errStyle}>{state.error}</span>}
        <button type="submit" disabled={pending} style={saveBtn}>Сохранить</button>
      </form>
    </div>
  );
}

function CatsModal({ categories, onClose }: { categories: { slug: string; label: string; favorite: boolean }[]; onClose: () => void }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(setFavoriteCategories, null);
  const [sel, setSel] = useState<Set<string>>(() => new Set(categories.filter((c) => c.favorite).map((c) => c.slug)));
  useEffect(() => {
    if (state?.success) {
      onClose();
      router.refresh();
    }
  }, [state, onClose, router]);
  const toggle = (slug: string) =>
    setSel((prev) => {
      const n = new Set(prev);
      if (n.has(slug)) n.delete(slug);
      else n.add(slug);
      return n;
    });
  return (
    <div style={overlay} onClick={onClose}>
      <form action={action} onClick={(e) => e.stopPropagation()} style={cardOf(460)}>
        <ModalHeader title="Избранные категории" onClose={onClose} />
        <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, color: "var(--text-4)" }}>Выберите направления, в которых работаете.</span>
        {[...sel].map((s) => (
          <input key={s} type="hidden" name="categories" value={s} />
        ))}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {categories.map((c) => {
            const rgb = CAT_RGB[c.slug] ?? "0,136,255";
            const on = sel.has(c.slug);
            return (
              <div key={c.slug} onClick={() => toggle(c.slug)} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: on ? 600 : 400, color: on ? `rgb(${rgb})` : "var(--text-3)", background: on ? `rgba(${rgb},0.18)` : "transparent", boxShadow: on ? "none" : "inset 0 0 0 1px var(--hairline-10)" }}>
                {on && <span aria-hidden style={{ fontSize: 12, lineHeight: 1 }}>✓</span>}
                {c.label}
              </div>
            );
          })}
        </div>
        {state?.error && <span style={errStyle}>{state.error}</span>}
        <button type="submit" disabled={pending} style={saveBtn}>Сохранить</button>
      </form>
    </div>
  );
}

function CompanyModal({ fields, onClose }: { fields: Record<string, string>; onClose: () => void }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(updateProfile, null);
  // Controlled inputs so a REJECTED submit keeps what the user typed. React 19 resets uncontrolled <form> fields once
  // the Server Action resolves, which wiped every field — not just the offending one — and sent the user back to the
  // stored values with only an error to show for it (same defect fixed for the login form in Гигли баги #3). This modal
  // only started rejecting when ИНН/КПП validation landed, so the reset was unreachable before.
  const [companyName, setCompanyName] = useState(fields.companyName ?? "");
  const [inn, setInn] = useState(fields.inn ?? "");
  const [kpp, setKpp] = useState(fields.kpp ?? "");
  const [about, setAbout] = useState(fields.about ?? "");
  useEffect(() => {
    if (state?.success) {
      onClose();
      router.refresh();
    }
  }, [state, onClose, router]);
  return (
    <div style={overlay} onClick={onClose}>
      <form action={action} onClick={(e) => e.stopPropagation()} style={cardOf(520)}>
        <ModalHeader title="Редактировать реквизиты" onClose={onClose} />
        <HiddenFields fields={fields} omit={["companyName", "inn", "kpp", "about"]} />
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={fieldLabel}>Название компании</span>
          <input
            name="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            style={fieldInput}
          />
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {/* inputMode/maxLength make garbage hard to type (numeric keypad on mobile, no over-long paste); updateProfile
              re-checks server-side via lib/requisites.ts, which is the actual authority. */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={fieldLabel}>ИНН</span>
            <input
              name="inn"
              value={inn}
              onChange={(e) => setInn(e.target.value)}
              inputMode="numeric"
              maxLength={INN_LENGTH_PERSON}
              placeholder="10 или 12 цифр"
              style={fieldInput}
            />
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={fieldLabel}>КПП</span>
            <input
              name="kpp"
              value={kpp}
              onChange={(e) => setKpp(e.target.value)}
              inputMode="numeric"
              maxLength={KPP_LENGTH}
              placeholder="9 цифр"
              style={fieldInput}
            />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={fieldLabel}>О компании</span>
          <textarea
            name="about"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Коротко о компании и задачах…"
            style={textareaStyle}
          />
        </div>
        {state?.error && <span style={errStyle}>{state.error}</span>}
        <button type="submit" disabled={pending} style={saveBtn}>Сохранить</button>
      </form>
    </div>
  );
}

type ModalKey = "bio" | "cats" | "stack" | "company";

export function ProfileDesign({ data }: { data: ProfileData }) {
  const [modal, setModal] = useState<ModalKey | null>(null);
  const owner = data.isOwner;
  const fields = data.editFields ?? {};
  const open = (k: ModalKey) => (owner ? () => setModal(k) : undefined);
  const h = data.header;
  const initials = h.name.split(/\s+/).map((w) => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() || "?";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {/* ID card */}
      <div style={{ display: "flex", gap: 24 }}>
        <div style={{ width: 196, flex: "none", borderRadius: 12, background: "radial-gradient(330px 1175px at 0% 100%, rgba(0,136,255,0.21) 0%, rgba(255,255,255,0) 100%), var(--hairline-05)", boxShadow: "inset 0 0 0 1px var(--hairline-10)", display: "flex", flexDirection: "column", gap: 18, padding: 24, boxSizing: "border-box" }}>
          <div
            style={{
              width: 148,
              height: 170,
              borderRadius: 12,
              background: h.avatar ? `url(${h.avatar}) center/cover no-repeat` : "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Handjet',monospace",
              fontWeight: 700,
              fontSize: 64,
              color: "#0a0a0a",
            }}
          >
            {!h.avatar && initials}
          </div>
          {/* Real presence (Спец #16): getProfile sets header.online = showOnlineStatus && lastSeenAt fresh. */}
          <div style={{ display: "inline-flex", alignSelf: "flex-start", alignItems: "center", gap: 6, padding: "3px 12px", borderRadius: 666, background: "var(--hairline-05)" }}>
            <span style={{ width: 6, height: 6, flex: "none", borderRadius: "50%", background: h.online ? "#22c55e" : "#9fa0a4" }} />
            <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: h.online ? "#22c55e" : "#9fa0a4" }}>{h.online ? "онлайн" : "offline"}</span>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0, display: "flex", gap: 24, alignItems: "stretch", padding: "12px 0" }}>
          {data.role === "SPECIALIST" ? (
            // Specialist: name+roleTag pinned top, verified+since pushed to the bottom (no name pencil — name/level
            // are onboarding-time fields not exposed for inline editing; the card edits are Стек/Опыт/Категории).
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 24, padding: 12 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <span style={nameStyle}>{h.name}</span>
                <span style={roleTagStyle}>{h.roleTag}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {h.verified && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "var(--om-accent, #0088ff)", display: "flex", flex: "none" }}>
                      <PatchIcon size={16} />
                    </span>
                    <span style={sinceStyle}>Номер телефона верифицирован</span>
                  </div>
                )}
                {h.timezone && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "var(--text-3)", display: "flex", flex: "none" }}>
                      <GlobeIcon size={16} />
                    </span>
                    <span style={sinceStyle}>{h.timezone}</span>
                  </div>
                )}
                <span style={sinceStyle}>На платформе с {h.memberSince}</span>
              </div>
            </div>
          ) : (
            // Company: name + role tag + an obvious «Редактировать» button (Заказчик #1) + the «О компании» paragraph.
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 12, padding: 12 }}>
              <span style={nameStyle}>{h.name}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <span style={roleTagStyle}>{h.roleTag}</span>
                <EditButton onClick={open("company")} />
              </div>
              {h.timezone && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "var(--text-3)", display: "flex", flex: "none" }}>
                    <GlobeIcon size={16} />
                  </span>
                  <span style={sinceStyle}>{h.timezone}</span>
                </div>
              )}
              {data.company?.about && (
                <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 14, lineHeight: "19px", color: "var(--text-3)", maxWidth: 420 }}>{data.company.about}</span>
              )}
            </div>
          )}

          {data.role === "SPECIALIST" ? (
            <div style={{ flex: 1, borderRadius: 12, background: "radial-gradient(380px 475px at 50% 50%, rgba(0,136,255,0.3) 0%, rgba(255,255,255,0) 100%), var(--hairline-05)", boxShadow: "inset 0 0 0 1px var(--hairline-10)", display: "flex", flexDirection: "column", gap: 12, justifyContent: "center", alignItems: "center", padding: 24, textAlign: "center" }}>
              <span style={{ fontFamily: "'Handjet',monospace", fontWeight: 600, fontSize: 22, color: "var(--text-1)" }}>Здесь будет ваша статистика</span>
              <span style={{ fontFamily: "'Handjet',monospace", fontSize: 14, color: "#7b8995" }}>Окно находится на стадии разработки</span>
            </div>
          ) : (
            <div style={{ flex: 1, borderRadius: 12, background: "var(--surface-card)", boxShadow: "inset 0 0 0 1px var(--hairline-10)", display: "flex", flexDirection: "column", gap: 16, justifyContent: "center", padding: 24 }}>
              <span style={{ fontFamily: "'Handjet',monospace", fontSize: 13, color: "var(--text-4)" }}>Реквизиты</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontFamily: "'Handjet',monospace", fontSize: 12, color: "var(--text-4)" }}>ИНН</span>
                <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 500, fontSize: 18, color: "var(--text-1)" }}>{data.company?.inn || "—"}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontFamily: "'Handjet',monospace", fontSize: 12, color: "var(--text-4)" }}>КПП</span>
                <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 500, fontSize: 18, color: "var(--text-1)" }}>{data.company?.kpp || "—"}</span>
              </div>
              <span style={{ fontFamily: "'Handjet',monospace", fontSize: 11, color: "var(--text-4)" }}>Проверка ИНН/КПП — на этапе пострелиза (MVP).</span>
            </div>
          )}
        </div>
      </div>

      {/* BLOCK — specialist only */}
      {data.role === "SPECIALIST" && data.stack && data.categories && data.experience && (
        <div style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={card}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={blockH2}>Стек</span>
                <EditButton onClick={open("stack")} />
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {data.stack.tags.length > 0 ? (
                  data.stack.tags.map((t, i) => {
                    const rgb = tagRgb(t.label);
                    return (
                      <span key={i} style={{ fontSize: 13, color: `rgb(${rgb})`, background: `rgba(${rgb},0.12)`, borderRadius: 6, padding: "5px 12px" }}>{t.label}</span>
                    );
                  })
                ) : (
                  <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, color: "var(--text-4)" }}>Стек не указан.</span>
                )}
              </div>
            </div>

            <div style={card}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                  <span style={blockH2}>Опыт</span>
                  {/* Спец #15 — the onboarding level, displayed explicitly (not just as the roleTag fallback). */}
                  {data.experienceLevel && LEVEL_LABEL[data.experienceLevel] && (
                    <span style={{ flex: "none", fontFamily: "'Handjet',monospace", fontSize: 14, color: "var(--om-accent, #0088ff)", background: "rgba(0,136,255,0.12)", borderRadius: 6, padding: "3px 10px" }}>
                      {LEVEL_LABEL[data.experienceLevel]}
                    </span>
                  )}
                </div>
                <EditButton onClick={open("bio")} />
              </div>
              {data.experience.bio && (
                <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 14, lineHeight: "18px", color: "var(--text-3)", whiteSpace: "pre-line" }}>{data.experience.bio}</span>
              )}
              {data.experience.entries.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {data.experience.entries.map((e, i) => (
                    <div key={i} style={{ borderRadius: 12, boxShadow: "inset 0 0 0 1px var(--hairline-12)", padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                        <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 500, fontSize: 16, color: "var(--text-1)" }}>{e.company}</span>
                        <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 12, color: "var(--text-3)", flex: "none" }}>{e.period}</span>
                      </div>
                      {e.title && <span style={{ fontFamily: "'Handjet',monospace", fontSize: 14, color: "#4ea3ff" }}>{e.title}</span>}
                      {e.description && <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 14, lineHeight: "18px", color: "var(--text-3)" }}>{e.description}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={card}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={blockH2}>Избранные категории</span>
                <EditButton onClick={open("cats")} />
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {data.categories.categories.filter((c) => c.favorite).length > 0 ? (
                  data.categories.categories
                    .filter((c) => c.favorite)
                    .map((c) => (
                      <span key={c.slug} style={{ fontSize: 14, color: `rgb(${CAT_RGB[c.slug] ?? "0,136,255"})` }}>[ {c.label} ]</span>
                    ))
                ) : (
                  <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, color: "var(--text-4)" }}>Категории не выбраны.</span>
                )}
              </div>
            </div>

            <div style={card}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={blockH2}>Реализованные проекты</span>
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", minWidth: 22, height: 22, padding: "0 7px", borderRadius: 6, background: "var(--om-accent, #0088ff)", color: "#fff", fontFamily: "'Handjet',monospace", fontWeight: 700, fontSize: 14 }}>
                  {data.realized.length}
                </span>
              </div>
              {data.realized.length > 0 ? (
                data.realized.map((g) => <GigCard key={g.id} vm={g} full />)
              ) : (
                <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, color: "var(--text-4)" }}>Пока нет завершённых проектов.</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* edit modals (owner only) */}
      {modal === "bio" && <BioModal fields={fields} onClose={() => setModal(null)} />}
      {modal === "stack" && <StackModal fields={fields} onClose={() => setModal(null)} />}
      {modal === "cats" && data.categories && <CatsModal categories={data.categories.categories} onClose={() => setModal(null)} />}
      {modal === "company" && <CompanyModal fields={fields} onClose={() => setModal(null)} />}
    </div>
  );
}
