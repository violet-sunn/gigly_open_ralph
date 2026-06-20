/* @composed-screen */
"use client";

import { useActionState, useEffect, useState } from "react";
import { Section } from "@/app/components/layout/Section";
import { Stack } from "@/app/components/layout/Stack";
import { Select, Input, Button } from "@/app/components/primitives";
import { ToggleList, Notice } from "@/app/components/blocks";
import { updatePreferences, deleteAccount } from "@/app/actions/settings";
import { applyTheme, getStoredTheme, type Theme } from "@/lib/theme";
import type { SettingsData } from "@/lib/view-models";

type PrefState = { error?: string; success?: boolean } | null;
type DelState = { error?: string } | null;

const LOCALE_OPTIONS = [
  { value: "ru", label: "Русский" },
  { value: "en", label: "English" },
];

const THEME_OPTIONS = [
  { value: "dark", label: "Тёмная" },
  { value: "light", label: "Светлая" },
];

/** Внешний вид — the theme switch (Тёмная / Светлая). Client-only; persists to localStorage via applyTheme.
 *  Initialises to the SSR default (dark) then syncs to the stored choice on mount (no hydration mismatch). */
function AppearanceControl() {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [open, setOpen] = useState(false);
  useEffect(() => setThemeState(getStoredTheme()), []);
  return (
    <Section title="Внешний вид" gap={3}>
      <Select
        options={THEME_OPTIONS}
        value={theme}
        expanded={open}
        onToggle={() => setOpen((o) => !o)}
        onSelect={(v) => {
          const next = (v === "light" ? "light" : "dark") as Theme;
          setThemeState(next);
          applyTheme(next);
          setOpen(false);
        }}
        aria-label="Тема оформления"
      />
    </Section>
  );
}

const NOTIFY_LABELS: Record<string, string> = {
  notifyApplications: "Отклики",
  notifyStatusChanges: "Изменения статуса",
  notifyMessages: "Сообщения",
};

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
 * Settings — the /settings screen, composed purely from the kit (compose-settings, Phase 2). Renders inside the layout's
 * AppShell. A language Select (RU default, over locale) + a notification ToggleList + a delete-account DangerAction,
 * wired to the (unchanged) updatePreferences / deleteAccount. Template + slotted blocks/primitives + data only — no
 * className/style; values carried to the actions via hidden inputs (the DisputeView pattern). F1 is component-level
 * (the library-faithful Select/Toggle); no full-screen Настройки frame.
 */
export function Settings({ prefs, email }: SettingsData) {
  const [state, action] = useActionState<PrefState, FormData>(updatePreferences as never, null);
  const [locale, setLocale] = useState(prefs.locale || "ru");
  const [localeOpen, setLocaleOpen] = useState(false);
  const [notify, setNotify] = useState({
    notifyApplications: prefs.notifyApplications,
    notifyStatusChanges: prefs.notifyStatusChanges,
    notifyMessages: prefs.notifyMessages,
  });

  const toggle = (key: string) =>
    setNotify((n) => ({ ...n, [key]: !n[key as keyof typeof n] }));

  const items = (Object.keys(NOTIFY_LABELS) as (keyof typeof notify)[]).map((key) => ({
    key,
    label: NOTIFY_LABELS[key],
    checked: notify[key],
  }));

  return (
    <Section title="Настройки" gap={6}>
      <form action={action}>
        <Stack gap={6}>
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="notifyApplications" value={String(notify.notifyApplications)} />
          <input type="hidden" name="notifyStatusChanges" value={String(notify.notifyStatusChanges)} />
          <input type="hidden" name="notifyMessages" value={String(notify.notifyMessages)} />

          <Section title="Язык" gap={3}>
            <Select
              options={LOCALE_OPTIONS}
              value={locale}
              expanded={localeOpen}
              onToggle={() => setLocaleOpen((o) => !o)}
              onSelect={(v) => {
                setLocale(v);
                setLocaleOpen(false);
              }}
              aria-label="Язык"
            />
          </Section>

          <Section title="Уведомления" gap={3}>
            <ToggleList items={items} onToggle={toggle} />
          </Section>

          <Button type="submit" variant="primary">
            Сохранить
          </Button>
          {state?.success && <Notice tone="success">Настройки сохранены.</Notice>}
          {state?.error && <Notice tone="error">{state.error}</Notice>}
        </Stack>
      </form>

      <AppearanceControl />

      <DangerAction email={email} />
    </Section>
  );
}
