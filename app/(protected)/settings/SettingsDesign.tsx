"use client";

// «Настройки» rebuilt on the prototype's settings modal (Gigly App.dc.html line 1342+) — rendered here as a centered
// page card (the app uses a /settings route, not a modal). Sections: ВНЕШНИЙ ВИД (Тема → real theme via lib/theme,
// Язык, Валюта), УВЕДОМЛЕНИЯ + ПРИВАТНОСТЬ (toggles → updatePreferences), АКТИВНЫЕ СЕССИИ (the real session backend),
// АККАУНТ (logout + reveal-to-confirm delete). The shell header supplies the «НАСТРОЙКИ» title.

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { updatePreferences, deleteAccount, terminateSession } from "@/app/actions/settings";
import { logoutUser } from "@/app/actions/auth";
import { applyTheme, getStoredTheme, type Theme } from "@/lib/theme";
import type { SettingsData } from "@/lib/view-models";
import "@/app/_design/tokens.css";

type PrefState = { error?: string; success?: boolean } | null;
type DelState = { error?: string } | null;

const THEME_OPTIONS = [{ key: "dark", label: "Тёмная" }, { key: "light", label: "Светлая" }];
const LOCALE_OPTIONS = [{ key: "ru", label: "Русский" }, { key: "en", label: "English" }];
const CURRENCY_OPTIONS = [{ key: "rub", label: "₽ Рубль" }, { key: "usd", label: "$ Доллар" }, { key: "eur", label: "€ Евро" }];
const NOTIFY_FIELDS = [
  { key: "notifyApplications", label: "Новые отклики" },
  { key: "notifyMessages", label: "Сообщения" },
  { key: "notifyStatusChanges", label: "Смена статуса гига" },
  { key: "notifyPayments", label: "Уведомления об оплатах" },
] as const;
const PRIVACY_FIELDS = [
  { key: "showRatingInProfile", label: "Показывать рейтинг в профиле" },
  { key: "showOnlineStatus", label: "Показывать статус «онлайн»" },
] as const;

const sectionLabel: React.CSSProperties = { fontFamily: "'Handjet',monospace", fontSize: 13, color: "var(--text-4)", letterSpacing: "0.5px" };
const rowText: React.CSSProperties = { fontFamily: "'Manrope',sans-serif", fontSize: 14, color: "var(--text-2)" };

function Segmented({ options, value, onPick }: { options: readonly { key: string; label: string }[]; value: string; onPick?: (k: string) => void }) {
  return (
    <div style={{ display: "flex", gap: 4, padding: 4, borderRadius: 9, background: "var(--surface-sunken)", boxShadow: "inset 0 0 0 1px var(--hairline-06)" }}>
      {options.map((o) => {
        const active = o.key === value;
        return (
          <div
            key={o.key}
            onClick={() => onPick?.(o.key)}
            style={{ padding: "7px 16px", borderRadius: 6, cursor: onPick ? "pointer" : "default", fontSize: 13, background: active ? "rgba(255,255,255,0.06)" : "transparent", color: active ? "var(--text-1)" : "var(--text-3)" }}
          >
            {o.label}
          </div>
        );
      })}
    </div>
  );
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <div
      onClick={onToggle}
      style={{ width: 40, height: 22, flex: "none", borderRadius: 11, background: on ? "var(--om-accent, #0088ff)" : "#2a2e37", position: "relative", cursor: "pointer", transition: "background .15s" }}
    >
      <div style={{ position: "absolute", top: 2, left: on ? 20 : 2, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left .15s" }} />
    </div>
  );
}

function DangerAction({ email }: { email: string }) {
  const [state, action] = useActionState<DelState, FormData>(deleteAccount as never, null);
  const [confirming, setConfirming] = useState(false);
  if (!confirming)
    return (
      <button type="button" onClick={() => setConfirming(true)} style={{ height: 42, border: "none", borderRadius: 8, background: "var(--surface-secondary)", color: "var(--text-2)", fontSize: 14, cursor: "pointer" }}>
        Удалить аккаунт
      </button>
    );
  return (
    <form action={action} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, lineHeight: "18px", color: "#ef4444" }}>
        Это действие необратимо. Введите вашу почту ({email}), чтобы подтвердить.
      </span>
      <input
        name="confirmEmail"
        type="email"
        placeholder={email}
        autoComplete="off"
        style={{ height: 44, padding: "0 14px", borderRadius: 8, background: "var(--surface-sunken)", boxShadow: "inset 0 0 0 1px var(--hairline-08)", border: "none", outline: "none", color: "var(--text-1)", fontFamily: "'Manrope',sans-serif", fontSize: 14 }}
      />
      <button type="submit" style={{ height: 42, border: "none", borderRadius: 8, background: "#ef4444", color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
        Подтвердить удаление
      </button>
      {state?.error && <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 12, color: "#ef4444" }}>{state.error}</span>}
    </form>
  );
}

export function SettingsDesign({ prefs, email, sessions }: SettingsData) {
  const router = useRouter();
  const [state, action] = useActionState<PrefState, FormData>(updatePreferences as never, null);

  const [theme, setThemeState] = useState<Theme>("dark");
  useEffect(() => setThemeState(getStoredTheme()), []);
  const [locale, setLocale] = useState(prefs.locale || "ru");
  const [notify, setNotify] = useState({
    notifyApplications: prefs.notifyApplications,
    notifyMessages: prefs.notifyMessages,
    notifyStatusChanges: prefs.notifyStatusChanges,
    notifyPayments: prefs.notifyPayments,
  });
  const [privacy, setPrivacy] = useState({ showRatingInProfile: prefs.showRatingInProfile, showOnlineStatus: prefs.showOnlineStatus });

  const pickTheme = (key: string) => {
    const next = (key === "light" ? "light" : "dark") as Theme;
    setThemeState(next);
    applyTheme(next);
  };

  return (
    <div style={{ maxWidth: 520, width: "100%", margin: "0 auto", borderRadius: 14, background: "var(--surface-card)", boxShadow: "inset 0 0 0 1px var(--hairline-10)", padding: 24, display: "flex", flexDirection: "column", gap: 22 }}>
      {/* ВНЕШНИЙ ВИД */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <span style={sectionLabel}>ВНЕШНИЙ ВИД</span>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <span style={rowText}>Тема</span>
          <Segmented options={THEME_OPTIONS} value={theme} onPick={pickTheme} />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <span style={rowText}>Язык</span>
          <Segmented options={LOCALE_OPTIONS} value={locale} onPick={setLocale} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={rowText}>Валюта</span>
          <div style={{ display: "flex", gap: 8 }}>
            {CURRENCY_OPTIONS.map((o) => {
              const active = o.key === "rub";
              return (
                <div key={o.key} style={{ flex: 1, textAlign: "center", padding: "9px 0", borderRadius: 8, fontSize: 13, background: active ? "rgba(0,136,255,0.12)" : "transparent", boxShadow: `inset 0 0 0 1px ${active ? "rgba(0,136,255,0.4)" : "var(--hairline-08)"}`, color: active ? "var(--om-accent, #0088ff)" : "var(--text-3)" }}>
                  {o.label}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* УВЕДОМЛЕНИЯ + ПРИВАТНОСТЬ (form) */}
      <form action={action} style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <input type="hidden" name="locale" value={locale} />
        {NOTIFY_FIELDS.map((f) => (
          <input key={f.key} type="hidden" name={f.key} value={String(notify[f.key])} />
        ))}
        {PRIVACY_FIELDS.map((f) => (
          <input key={f.key} type="hidden" name={f.key} value={String(privacy[f.key])} />
        ))}

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ ...sectionLabel, paddingBottom: 6 }}>УВЕДОМЛЕНИЯ</span>
          {NOTIFY_FIELDS.map((f) => (
            <div key={f.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 0", borderBottom: "1px solid var(--hairline-06)" }}>
              <span style={rowText}>{f.label}</span>
              <Toggle on={notify[f.key]} onToggle={() => setNotify((n) => ({ ...n, [f.key]: !n[f.key] }))} />
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ ...sectionLabel, paddingBottom: 6 }}>ПРИВАТНОСТЬ</span>
          {PRIVACY_FIELDS.map((f) => (
            <div key={f.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 0", borderBottom: "1px solid var(--hairline-06)" }}>
              <span style={rowText}>{f.label}</span>
              <Toggle on={privacy[f.key]} onToggle={() => setPrivacy((p) => ({ ...p, [f.key]: !p[f.key] }))} />
            </div>
          ))}
        </div>

        <button type="submit" style={{ height: 44, border: "none", borderRadius: 8, background: "var(--om-accent, #0088ff)", color: "#fff", fontSize: 15, fontWeight: 500, cursor: "pointer" }}>
          Сохранить
        </button>
        {state?.success && <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, color: "#34c759" }}>Настройки сохранены.</span>}
        {state?.error && <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, color: "#ef4444" }}>{state.error}</span>}
      </form>

      {/* АКТИВНЫЕ СЕССИИ */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <span style={sectionLabel}>АКТИВНЫЕ СЕССИИ</span>
        {sessions.length > 0 ? (
          sessions.map((s) => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "11px 0", borderBottom: "1px solid var(--hairline-06)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
                <span style={rowText}>{s.title}</span>
                <span style={{ fontFamily: "'Handjet',monospace", fontSize: 12, color: "var(--text-4)" }}>{s.description}</span>
              </div>
              {s.state === "active" ? (
                <span style={{ fontFamily: "'Handjet',monospace", fontSize: 12, color: "#34c759", flex: "none" }}>текущая</span>
              ) : (
                <button
                  type="button"
                  onClick={async () => {
                    if (s.id) await terminateSession(s.id);
                    router.refresh();
                  }}
                  style={{ flex: "none", height: 32, padding: "0 14px", border: "none", borderRadius: 8, background: "var(--surface-secondary)", color: "var(--text-2)", fontSize: 13, cursor: "pointer" }}
                >
                  Завершить
                </button>
              )}
            </div>
          ))
        ) : (
          <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, color: "var(--text-3)" }}>Нет активных сессий.</span>
        )}
      </div>

      {/* АККАУНТ */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <span style={sectionLabel}>АККАУНТ</span>
        <form action={logoutUser}>
          <button type="submit" style={{ width: "100%", height: 42, border: "none", borderRadius: 8, background: "rgba(239,68,68,0.12)", boxShadow: "inset 0 0 0 1px rgba(239,68,68,0.4)", color: "#ef4444", fontSize: 14, cursor: "pointer" }}>
            Выйти из аккаунта
          </button>
        </form>
        <DangerAction email={email} />
      </div>
    </div>
  );
}
