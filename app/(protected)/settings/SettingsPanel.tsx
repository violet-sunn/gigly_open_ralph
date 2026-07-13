"use client";

// transport-settings — the «Настройки» popup body (Figma node 3121:2609) rebuilt 1:1 on app/_design/tokens.css. Six
// section cards: Учетные данные · Платежные данные · Уведомления · Безопасность · Язык и регион · Удалить аккаунт.
// EVERY control is either WIRED (mutates state on interaction + autosaves) or GRAYED+inert (muted, pointer-events:none,
// no handler) — never a dead look-alike. Reused by both the /settings route (SettingsDesign) and the modal (SettingsModal).

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  updatePreferences,
  updateAccountName,
  updateTimezone,
  terminateSession,
  terminateInactiveSessions,
  deleteAccount,
} from "@/app/actions/settings";
import { TIMEZONES, timezoneLabel } from "@/lib/profiles";
import type { SettingsData } from "@/lib/view-models";
import "@/app/_design/tokens.css";

const MONO = "'Handjet',monospace";
const SANS = "'Manrope',sans-serif";

const CURRENCIES = [
  { key: "rub", label: "₽  — RUB" },
  { key: "usd", label: "$  — USD" },
  { key: "eur", label: "€  — EUR" },
] as const;

const LOCALES = [
  { key: "ru", label: "Русский" },
  { key: "en", label: "English" },
] as const;

// 5 notification rows (Figma order) → preference fields. `wired` = there is a real notification source that the bell
// shows, so the toggle gates it (display-time, app/actions/notification.ts). The other two have no event source yet, so
// they render grayed/inert (a toggle for them would gate nothing).
const NOTIFY_ROWS = [
  { key: "notifyPlatformNews", label: "Новости и обновления платформы", wired: false },
  { key: "notifyNewGigs", label: "Новые гиги по вашему стеку", wired: false },
  { key: "notifyApplications", label: "Отклики на заявки", wired: true },
  { key: "notifyMessages", label: "Новые сообщения в чатах", wired: true },
  { key: "notifyStatusChanges", label: "Изменение статуса гига", wired: true },
] as const;

/* ── shared styles ── */
const card: React.CSSProperties = {
  borderRadius: 12,
  background: "var(--surface-card)",
  boxShadow: "inset 0 0 0 1px var(--hairline-08)",
  padding: 24,
  display: "flex",
  flexDirection: "column",
  gap: 18,
};
const sectionTitle: React.CSSProperties = { margin: 0, fontFamily: SANS, fontWeight: 600, fontSize: 18, color: "var(--text-1)" };
const subTitle: React.CSSProperties = { fontFamily: SANS, fontWeight: 600, fontSize: 14, color: "var(--text-2)" };
const fieldLabel: React.CSSProperties = { fontFamily: MONO, fontSize: 13, color: "var(--text-1)", padding: "0 4px" };
const rowText: React.CSSProperties = { fontFamily: SANS, fontSize: 14, color: "var(--text-2)" };
const inputBase: React.CSSProperties = {
  height: 44,
  padding: "0 14px",
  borderRadius: 6,
  background: "var(--surface-sunken)",
  boxShadow: "inset 0 0 0 1px var(--hairline-08)",
  border: "none",
  outline: "none",
  color: "var(--text-1)",
  fontFamily: SANS,
  fontSize: 14,
  width: "100%",
  boxSizing: "border-box",
};
// GRAYED + inert: a control that is present 1:1 but explicitly cannot be used (no backend wired).
const inert: React.CSSProperties = { opacity: 0.45, pointerEvents: "none", cursor: "not-allowed", userSelect: "none" };

/* ── small primitives ── */
function SectionCard({ icon, title, children }: { icon?: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section style={card} data-section={title}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {icon && <span style={{ color: "var(--text-3)", display: "flex" }}>{icon}</span>}
        <h2 style={sectionTitle}>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Switch({ on, onToggle, label, disabled }: { on: boolean; onToggle?: () => void; label: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      onClick={disabled ? undefined : onToggle}
      style={{
        width: 44,
        height: 26,
        flex: "none",
        borderRadius: 13,
        border: "none",
        background: on ? "var(--om-accent)" : "#2a2e37",
        position: "relative",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background .15s",
        ...(disabled ? { opacity: 0.45 } : {}),
      }}
    >
      <span style={{ position: "absolute", top: 3, left: on ? 21 : 3, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left .15s" }} />
    </button>
  );
}

function ToggleRow({ label, on, onToggle, disabled }: { label: string; on: boolean; onToggle?: () => void; disabled?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, height: 52, padding: "0 12px", borderRadius: 4 }}>
      <span style={{ ...rowText, flex: 1, minWidth: 0 }}>{label}</span>
      <Switch on={on} onToggle={onToggle} label={label} disabled={disabled} />
    </div>
  );
}

function StyledSelect({
  label,
  value,
  options,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  options: readonly { value: string; label: string }[];
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span style={subTitle}>{label}</span>
      <div
        aria-disabled={disabled || undefined}
        style={{ position: "relative", display: "flex", alignItems: "center", height: 44, padding: "0 14px", borderRadius: 8, background: "var(--surface-sunken)", boxShadow: "inset 0 0 0 1px var(--hairline-08)", ...(disabled ? inert : {}) }}
      >
        <span style={{ flex: 1, fontFamily: SANS, fontSize: 14, color: "var(--text-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {options.find((o) => o.value === value)?.label ?? value}
        </span>
        <ChevronDown />
        {!disabled && (
          <select
            aria-label={label}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer", border: "none", appearance: "none", WebkitAppearance: "none" }}
          >
            {options.map((o) => (
              <option key={o.value} value={o.value} style={{ background: "var(--surface-card)", color: "var(--text-1)" }}>
                {o.label}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}

/* ── the panel ── */
export function SettingsPanel({ prefs, email, sessions: initialSessions, timezone: initialTz, name: initialName }: SettingsData) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // local, optimistic state so wired controls visibly change on click, then autosave.
  // currency + locale are persisted but NOT user-editable in the MVP (the controls render grayed/inert) — read-only here.
  const [currency] = useState(prefs.currency || "rub");
  const [locale] = useState(prefs.locale || "ru");
  const [timezone, setTimezone] = useState(initialTz || "");
  // Notification toggles: the 3 with a real bell source (applications / messages / status changes) gate that source live
  // (see app/actions/notification.ts); the 2 sourceless ones render grayed/inert (a toggle would gate nothing).
  const [notify, setNotify] = useState<Record<string, boolean>>({
    notifyPlatformNews: prefs.notifyPlatformNews,
    notifyNewGigs: prefs.notifyNewGigs,
    notifyApplications: prefs.notifyApplications,
    notifyMessages: prefs.notifyMessages,
    notifyStatusChanges: prefs.notifyStatusChanges,
  });
  const [name, setName] = useState(initialName || "");
  const [sessions, setSessions] = useState(initialSessions);

  // auto-clear the «Сохранено» badge.
  useEffect(() => {
    if (status !== "saved") return;
    const t = setTimeout(() => setStatus("idle"), 1500);
    return () => clearTimeout(t);
  }, [status]);

  // Run a save and surface its outcome (errors are no longer swallowed — they show «Не удалось сохранить»).
  const run = async (fn: () => Promise<{ error?: string } | void>) => {
    setStatus("saving");
    try {
      const r = await fn();
      if (r && "error" in r && r.error) {
        setStatus("error");
        return;
      }
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  };
  const fdOf = (field: string, value: string) => {
    const f = new FormData();
    f.set(field, value);
    return f;
  };

  const onToggle = (key: string) => {
    const next = !notify[key];
    setNotify((n) => ({ ...n, [key]: next }));
    run(() => updatePreferences(null, fdOf(key, String(next))));
  };
  const onTimezone = (tz: string) => {
    setTimezone(tz);
    // refresh server components so the profile (which reads the same profile.timezone) reflects the change.
    run(async () => {
      const r = await updateTimezone(null, fdOf("timezone", tz));
      router.refresh();
      return r;
    });
  };
  const saveName = () =>
    run(async () => {
      const r = await updateAccountName(null, fdOf("name", name));
      router.refresh();
      return r;
    });
  const onTerminate = (id?: string) => {
    if (!id) return;
    run(async () => {
      await terminateSession(id);
      setSessions((rows) => rows.filter((r) => r.id !== id));
    });
  };
  const onTerminateAll = () =>
    run(async () => {
      await terminateInactiveSessions();
      setSessions((rows) => rows.filter((r) => r.state === "active"));
    });

  const tzOptions = TIMEZONES.map((tz) => ({ value: tz, label: timezoneLabel(tz) }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, position: "relative" }}>
      {status !== "idle" && (
        <span
          role="status"
          style={{ position: "sticky", top: 0, zIndex: 2, alignSelf: "flex-end", fontFamily: MONO, fontSize: 12, color: status === "error" ? "#ef4444" : status === "saved" ? "#34c759" : "var(--text-3)" }}
        >
          {status === "saving" ? "Сохранение…" : status === "error" ? "Не удалось сохранить" : "Сохранено"}
        </span>
      )}

      {/* 1 — Учетные данные */}
      <SectionCard icon={<PersonIcon />} title="Учетные данные">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={subTitle}>Фото профиля</span>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 52, height: 52, flex: "none", borderRadius: "50%", background: "var(--surface-secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18, color: "var(--text-3)" }}>
              {(name || email).slice(0, 1).toUpperCase()}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 8, ...inert }} aria-disabled>
              <span style={{ display: "flex", alignItems: "center", gap: 8, height: 40, padding: "0 16px", borderRadius: 8, boxShadow: "inset 0 0 0 1px var(--border-strong, #5a6070)", fontFamily: MONO, fontSize: 13, color: "var(--text-1)" }}>
                Загрузить фото <DownloadIcon />
              </span>
              <span style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4, background: "var(--surface-secondary)", color: "var(--text-3)" }}>
                <TrashIcon />
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span style={subTitle}>Данные аккаунта</span>

          {/* Имя — WIRED */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={fieldLabel}>Имя</span>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                aria-label="Имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Фамилия Имя"
                style={inputBase}
              />
              <button
                type="button"
                onClick={saveName}
                aria-label="Сохранить имя"
                style={{ width: 44, height: 44, flex: "none", borderRadius: 6, border: "none", background: "var(--om-accent)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <PencilIcon />
              </button>
            </div>
          </div>

          {/* Email — GRAYED */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={fieldLabel}>Email</span>
            <input aria-label="Email" value={email} disabled readOnly style={{ ...inputBase, ...inert }} />
          </div>

          {/* Password — GRAYED */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={fieldLabel}>Password</span>
            <input aria-label="Password" value="••••••••••••" disabled readOnly style={{ ...inputBase, ...inert }} />
          </div>
        </div>
      </SectionCard>

      {/* 2 — Платежные данные */}
      <SectionCard icon={<CardIcon />} title="Платежные данные">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={subTitle}>Валюта получения выплат</span>
          {/* GRAYED/INERT — выбор валюты вне MVP (приложение пока считает только в ₽) */}
          <div role="radiogroup" aria-label="Валюта получения выплат" aria-disabled style={{ display: "flex", flexDirection: "column", ...inert }}>
            {CURRENCIES.map((c) => {
              const active = c.key === currency;
              return (
                <div
                  key={c.key}
                  role="radio"
                  aria-checked={active}
                  aria-label={c.key.toUpperCase()}
                  style={{ display: "flex", alignItems: "center", gap: 10, minHeight: 40, padding: "0 12px", textAlign: "left" }}
                >
                  <span style={{ width: 16, height: 16, flex: "none", borderRadius: "50%", boxShadow: `inset 0 0 0 ${active ? 5 : 1.5}px ${active ? "var(--om-accent)" : "var(--text-4)"}` }} />
                  <span style={{ fontFamily: SANS, fontSize: 14, color: active ? "var(--text-1)" : "var(--text-3)" }}>{c.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </SectionCard>

      {/* 3 — Уведомления */}
      <SectionCard icon={<BellIcon />} title="Уведомления">
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={subTitle}>Уведомления в приложении</span>
          {/* The 3 wired rows gate the bell live; the 2 sourceless rows (platform news / new gigs) are grayed/inert. */}
          {NOTIFY_ROWS.map((r) => (
            <ToggleRow
              key={r.key}
              label={r.label}
              on={notify[r.key]}
              onToggle={r.wired ? () => onToggle(r.key) : undefined}
              disabled={!r.wired}
            />
          ))}
        </div>
      </SectionCard>

      {/* 4 — Безопасность */}
      <SectionCard icon={<ShieldIcon />} title="Безопасность">
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={subTitle}>Аутентификация</span>
          {/* Двухфакторность — GRAYED (not wired) */}
          <ToggleRow label="Двухфакторность" on={false} disabled />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={subTitle}>Активные сессии</span>
          {sessions.length > 0 ? (
            sessions.map((s) => {
              const isCurrent = s.state === "active";
              return (
                <div key={s.id} data-session-row style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 64, padding: "0 12px", borderRadius: 4, boxShadow: `inset 0 0 0 1px ${isCurrent ? "var(--om-accent)" : "var(--hairline-10)"}`, background: "var(--surface-app)" }}>
                  <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ fontFamily: SANS, fontSize: 14, color: "var(--text-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.title}</span>
                    <span style={{ fontFamily: SANS, fontSize: 12, color: "var(--text-3)" }}>{s.description}</span>
                  </div>
                  {isCurrent ? (
                    <span style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 8px", borderRadius: 6666, background: "rgba(59,130,246,0.5)", fontFamily: MONO, fontWeight: 500, fontSize: 13, color: "#fff" }}>Текущий</span>
                  ) : (
                    <button type="button" aria-label="Завершить сеанс" onClick={() => onTerminate(s.id)} style={{ width: 40, height: 40, flex: "none", borderRadius: 4, border: "none", background: "var(--surface-secondary)", color: "var(--text-3)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <TrashIcon />
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <span style={{ fontFamily: SANS, fontSize: 13, color: "var(--text-3)" }}>Нет активных сессий.</span>
          )}
          <button type="button" onClick={onTerminateAll} style={{ alignSelf: "flex-start", padding: "4px 8px", background: "none", border: "none", fontFamily: MONO, fontWeight: 500, fontSize: 13, color: "var(--om-accent)", cursor: "pointer" }}>
            Завершить все неактивные сеансы
          </button>
        </div>
      </SectionCard>

      {/* 5 — Язык и регион */}
      <SectionCard icon={<GlobeIcon />} title="Язык и регион">
        {/* Язык интерфейса — GRAYED/INERT (вне MVP: интерфейс пока только на русском) */}
        <StyledSelect label="Язык интерфейса" value={locale} options={LOCALES.map((l) => ({ value: l.key, label: l.label }))} onChange={() => {}} disabled />
        <StyledSelect label="Часовой пояс" value={timezone} options={[{ value: "", label: "Выберите из списка" }, ...tzOptions]} onChange={onTimezone} />
      </SectionCard>

      {/* 6 — Удалить аккаунт */}
      <SectionCard title="Удалить аккаунт">
        <DangerAction email={email} />
      </SectionCard>
    </div>
  );
}

/* «Удалить аккаунт навсегда» → reveal email-confirm → deleteAccount (WIRED). */
function DangerAction({ email }: { email: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startDel] = useTransition();

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        style={{ alignSelf: "center", display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 8, border: "none", background: "none", fontFamily: MONO, fontWeight: 500, fontSize: 13, color: "#ef4444", cursor: "pointer" }}
      >
        Удалить аккаунт навсегда <TrashIcon />
      </button>
    );
  }
  return (
    <form
      action={(fd) =>
        startDel(async () => {
          const res = await deleteAccount(null, fd);
          if (res?.error) setError(res.error);
          else router.push("/");
        })
      }
      style={{ display: "flex", flexDirection: "column", gap: 10 }}
    >
      <span style={{ fontFamily: SANS, fontSize: 13, lineHeight: "18px", color: "#ef4444" }}>
        Это действие необратимо. Введите вашу почту ({email}), чтобы подтвердить.
      </span>
      <input name="confirmEmail" type="email" placeholder={email} autoComplete="off" style={inputBase} />
      <button type="submit" style={{ height: 44, border: "none", borderRadius: 8, background: "#ef4444", color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
        Подтвердить удаление
      </button>
      {error && <span style={{ fontFamily: SANS, fontSize: 12, color: "#ef4444" }}>{error}</span>}
    </form>
  );
}

/* ── inline icons (bootstrap-style, matching the Figma section/control glyphs) ── */
function PersonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
      <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0M1 8a7 7 0 0 1 14 0c0 1.97-.81 3.75-2.12 5.02A6.97 6.97 0 0 0 8 11a6.97 6.97 0 0 0-4.88 2.02A6.98 6.98 0 0 1 1 8" />
    </svg>
  );
}
function CardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z" />
    </svg>
  );
}
function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.92 7.1 3.42a2 2 0 0 0-.24.78l-.34 3.6A3 3 0 0 1 4 10.6V12h8v-1.4a3 3 0 0 1-2.52-2.8l-.34-3.6a2 2 0 0 0-.24-.78zm0-1.92a1.5 1.5 0 0 1 1.5 1.5q1.8.4 2.34 3.07l.34 3.6a2 2 0 0 0 1.7 1.78A1 1 0 0 1 13 13H3a1 1 0 0 1-.18-1.95 2 2 0 0 0 1.7-1.78l.34-3.6Q5.7 1.9 6.5 1.5A1.5 1.5 0 0 1 8 0" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.8 11.8 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7 7 0 0 0 1.048-.625 11.8 11.8 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.54 1.54 0 0 0-1.044-1.263 63 63 0 0 0-2.887-.87C9.843.266 8.69 0 8 0m0 5a1.5 1.5 0 0 1 .5 2.915l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99A1.5 1.5 0 0 1 8 5" />
    </svg>
  );
}
function GlobeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.92C6.2 1.45 5.2 3.4 5.04 5.5H7.5zM4.04 5.5C4.2 3.18 4.99 1.17 6.13 0a8 8 0 0 0-4.4 5.5zM1.5 6.5A6.5 6.5 0 0 0 1.02 8h2.49q.045-1.78.36-3.5H1.84a6.5 6.5 0 0 0-.34 2m6 0H4.5q-.05.92-.05 1.5h3.05zm1 0v1.5h3.05q-.005-.58-.05-1.5zm4.49 0a6.5 6.5 0 0 0-.34-2H10.13q.315 1.72.36 3.5h2.49a6.5 6.5 0 0 0-.49-1.5M8.5 5.5h2.46C10.8 3.4 9.8 1.45 8.5 1.08zm0 4v4.42c1.3-.37 2.3-2.32 2.46-4.42zM7.5 14V9.5H5.04c.16 2.1 1.16 4.05 2.46 4.42m-1.37-.08C4.99 12.83 4.2 10.82 4.04 8.5H1.73a8 8 0 0 0 4.4 5.42m3.74 0a8 8 0 0 0 4.4-5.42H11.96c-.16 2.32-.95 4.33-2.09 5.42" />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M5.5 5.5a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
    </svg>
  );
}
function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
      <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
    </svg>
  );
}
function PencilIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
    </svg>
  );
}
function ChevronDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: "var(--text-4)", flex: "none" }}>
      <path d="M4 6l4 4 4-4" />
    </svg>
  );
}
