/* @composed-screen */
"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Section } from "@/app/components/layout/Section";
import { Stack } from "@/app/components/layout/Stack";
import { Input, Button } from "@/app/components/primitives";
import { CheckField, ToggleField, SessionRow, Notice } from "@/app/components/blocks";
import { updatePreferences, deleteAccount, terminateSession } from "@/app/actions/settings";
import { logoutUser } from "@/app/actions/auth";
import { applyTheme, getStoredTheme, type Theme } from "@/lib/theme";
import type { SettingsData } from "@/lib/view-models";

type PrefState = { error?: string; success?: boolean } | null;
type DelState = { error?: string } | null;

const THEME_OPTIONS = [
  { key: "dark", label: "Тёмная" },
  { key: "light", label: "Светлая" },
];
const LOCALE_OPTIONS = [
  { key: "ru", label: "Русский" },
  { key: "en", label: "English" },
];
// Валюта is display-only — the product is RUB-only (no functional multi-currency pref).
const CURRENCY_OPTIONS = [
  { key: "rub", label: "₽ Рубль" },
  { key: "usd", label: "$ Доллар" },
  { key: "eur", label: "€ Евро" },
];

// Prototype УВЕДОМЛЕНИЯ rows (notifRows) and ПРИВАТНОСТЬ rows (privacyRows) → persisted preference keys.
const NOTIFY_FIELDS: { key: "notifyApplications" | "notifyMessages" | "notifyStatusChanges" | "notifyPayments"; label: string }[] = [
  { key: "notifyApplications", label: "Новые отклики" },
  { key: "notifyMessages", label: "Сообщения" },
  { key: "notifyStatusChanges", label: "Смена статуса гига" },
  { key: "notifyPayments", label: "Уведомления об оплатах" },
];
const PRIVACY_FIELDS: { key: "showRatingInProfile" | "showOnlineStatus"; label: string }[] = [
  { key: "showRatingInProfile", label: "Показывать рейтинг в профиле" },
  { key: "showOnlineStatus", label: "Показывать статус «онлайн»" },
];

/** «Удалить аккаунт» — reveal-to-confirm over the EXISTING deleteAccount (email-gated; no new action). */
function DangerAction({ email }: { email: string }) {
  const [state, action] = useActionState<DelState, FormData>(deleteAccount as never, null);
  const [confirming, setConfirming] = useState(false);
  return (
    <Section title="Удаление аккаунта" gap={4}>
      {!confirming ? (
        <Button type="button" variant="secondary" onClick={() => setConfirming(true)}>
          Удалить аккаунт
        </Button>
      ) : (
        <Stack gap={3}>
          <Notice tone="error">
            Это действие необратимо. Введите вашу почту ({email}), чтобы подтвердить удаление.
          </Notice>
          <form action={action}>
            <Stack gap={3}>
              <Input name="confirmEmail" type="email" placeholder={email} autoComplete="off" />
              <Button type="submit" variant="primary">
                Подтвердить удаление
              </Button>
              {state?.error && <Notice tone="error">{state.error}</Notice>}
            </Stack>
          </form>
        </Stack>
      )}
    </Section>
  );
}

/**
 * Settings — the /settings «Настройки» screen, composed purely from the kit (reconcile-settings, Phase 3; reconciled to
 * the gigly_full_design prototype). Renders inside the layout's AppShell. Four sections: ВНЕШНИЙ ВИД (Тема via
 * applyTheme/localStorage + Язык, CheckField; Валюта display-only ₽), УВЕДОМЛЕНИЯ + ПРИВАТНОСТЬ (ToggleField rows,
 * persisted via updatePreferences), АККАУНТ («Выйти из аккаунта» logout + the preserved delete-account), and АКТИВНЫЕ
 * СЕССИИ (SessionRow list, terminate on non-current). Template + slotted blocks + data only — no className/style; the
 * prefs ride to updatePreferences via hidden inputs (the DisputeView pattern).
 */
export function Settings({ prefs, email, sessions }: SettingsData) {
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
  const [privacy, setPrivacy] = useState({
    showRatingInProfile: prefs.showRatingInProfile,
    showOnlineStatus: prefs.showOnlineStatus,
  });

  const pickTheme = (key: string) => {
    const next = (key === "light" ? "light" : "dark") as Theme;
    setThemeState(next);
    applyTheme(next);
  };

  return (
    <Section title="Настройки" gap={6}>
      {/* ВНЕШНИЙ ВИД — Тема (client/localStorage) + Язык (persisted) + Валюта (display-only) */}
      <Section title="Внешний вид" gap={4}>
        <Section title="Тема" gap={2}>
          <CheckField vm={{ options: THEME_OPTIONS, value: theme }} onChange={pickTheme} />
        </Section>
        <Section title="Язык" gap={2}>
          <CheckField vm={{ options: LOCALE_OPTIONS, value: locale }} onChange={setLocale} />
        </Section>
        <Section title="Валюта" gap={2}>
          <CheckField vm={{ options: CURRENCY_OPTIONS, value: "rub" }} />
        </Section>
      </Section>

      {/* УВЕДОМЛЕНИЯ + ПРИВАТНОСТЬ — persisted via updatePreferences */}
      <form action={action}>
        <Stack gap={6}>
          <input type="hidden" name="locale" value={locale} />
          {NOTIFY_FIELDS.map((f) => (
            <input key={f.key} type="hidden" name={f.key} value={String(notify[f.key])} />
          ))}
          {PRIVACY_FIELDS.map((f) => (
            <input key={f.key} type="hidden" name={f.key} value={String(privacy[f.key])} />
          ))}

          <Section title="Уведомления" gap={2}>
            {NOTIFY_FIELDS.map((f) => (
              <ToggleField
                key={f.key}
                vm={{ title: f.label, checked: notify[f.key] }}
                onChange={() => setNotify((n) => ({ ...n, [f.key]: !n[f.key] }))}
              />
            ))}
          </Section>

          <Section title="Приватность" gap={2}>
            {PRIVACY_FIELDS.map((f) => (
              <ToggleField
                key={f.key}
                vm={{ title: f.label, checked: privacy[f.key] }}
                onChange={() => setPrivacy((p) => ({ ...p, [f.key]: !p[f.key] }))}
              />
            ))}
          </Section>

          <Button type="submit" variant="primary">
            Сохранить
          </Button>
          {state?.success && <Notice tone="success">Настройки сохранены.</Notice>}
          {state?.error && <Notice tone="error">{state.error}</Notice>}
        </Stack>
      </form>

      {/* АКТИВНЫЕ СЕССИИ — the real session-tracking backend (current marked, terminate on others) */}
      <Section title="Активные сессии" gap={3}>
        {sessions.length > 0 ? (
          sessions.map((s) => (
            <SessionRow
              key={s.id}
              vm={s}
              onRemove={async () => {
                if (s.id) await terminateSession(s.id);
                router.refresh();
              }}
            />
          ))
        ) : (
          <Notice tone="muted">Нет активных сессий.</Notice>
        )}
      </Section>

      {/* АККАУНТ — «Выйти из аккаунта» (logout) + the preserved delete-account flow */}
      <Section title="Аккаунт" gap={4}>
        <form action={logoutUser}>
          <Button type="submit" variant="danger">
            Выйти из аккаунта
          </Button>
        </form>
        <DangerAction email={email} />
      </Section>
    </Section>
  );
}
