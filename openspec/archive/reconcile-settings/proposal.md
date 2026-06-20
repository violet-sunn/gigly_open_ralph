# reconcile-settings

**Type:** Regular change (UI / screen reconciliation — «Настройки» — **plus** a real session-tracking backend)
**Created:** 2026-06-20
**Plan:** `openspec/planning/full-design-reground.md` — Phase 3 (screen reconciliation, **authored fresh from the
prototype**)
**Capabilities:** `settings` (the screen + preferences) · `authentication` (the new `Session` model + login capture +
terminate)
**Depends on:** `add-light-theme` (archived — the `[data-theme]` switch + `lib/theme.ts` the «Внешний вид» section
keeps), `reconcile-data-model-to-design` (archived — the additive-pref-field pattern). Kit blocks (`SessionRow`,
`ToggleField`, `CheckField`, `Notice`, `SectionHeader`, `Button`) all exist.

## Why

`/settings` (`app/(protected)/settings/Settings.tsx`) is a kit-composed screen built before the real design. The
authoritative source is the **prototype** (`gigly_full_design/Gigly App.dc.html` settings ~L1342–1412; data
~L2087–2098). Reading it directly gives the real structure **and corrects the planning doc's assumption** that "the
design adds Session rows": the prototype settings has **no** session list (sessions appear nowhere in the prototype),
uses inline toggles + button-groups (not the `ToggleField`/`CheckField` kit blocks), and its account action is a
**«Выйти из аккаунта»** logout — not delete-account.

The prototype «Настройки» is four sections:
- **ВНЕШНИЙ ВИД** — **Тема** (Тёмная/Светлая) · **Язык** (Русский/English) · **Валюта** (₽ Рубль / $ Доллар / € Евро).
- **УВЕДОМЛЕНИЯ** — 4 toggles: «Новые отклики» · «Сообщения» · «Смена статуса гига» · «Уведомления об оплатах».
- **ПРИВАТНОСТЬ** — 2 toggles: «Показывать рейтинг в профиле» · «Показывать статус «онлайн»».
- **АККАУНТ** — «Выйти из аккаунта» (logout).

**Two product-owner decisions (confirmed) shape this change beyond a literal reconcile:**
1. **Full prototype parity** — adopt `CheckField`/`ToggleField`, add the ПРИВАТНОСТЬ section + the «оплаты» notification
   toggle + the logout action, and add the new persisted preference fields so they survive a reload (the PRD's "prefs
   persist" gate). Валюта is **display-only RUB** (the product is RUB-only — a functional multi-currency pref would
   contradict the RUB-only principle), rendered to match the prototype but not persisted.
2. **Build real session tracking** — the prototype settings has no session list, but the owner wants the `SessionRow`
   list wired to a **real backend**. So this change adds a `Session` Prisma model, captures device (user-agent) + IP +
   timestamps at login, and adds an **«Активные сессии»** section to /settings (using `SessionRow`) with a per-session
   **terminate** action and a current-session marker. This is a **sanctioned addition beyond the prototype** (driven by
   the owner's decision + the existing kit block), positioned in the account area.

## What

- **Reconcile the screen** (`Settings.tsx`) to the prototype's four sections, composing kit blocks:
  - **ВНЕШНИЙ ВИД** — `CheckField` (or the existing themed `Select`) for **Тема** (kept on the `lib/theme.ts`
    `[data-theme]` + localStorage switch — already wired) and **Язык**; **Валюта** as a display-only `CheckField`
    (₽ Рубль selected, others disabled) — no pref persisted.
  - **УВЕДОМЛЕНИЯ** — 4 `ToggleField` rows bound to `notifyApplications` / `notifyMessages` / `notifyStatusChanges` /
    **`notifyPayments`** (new).
  - **ПРИВАТНОСТЬ** — 2 `ToggleField` rows bound to **`showRatingInProfile`** + **`showOnlineStatus`** (new).
  - **АККАУНТ** — a danger **«Выйти из аккаунта»** button wired to the existing `logoutUser` action; the existing
    delete-account flow is preserved (it is not in the prototype but is real, valuable, and not displaced).
  - **АКТИВНЫЕ СЕССИИ** — a `SessionRow` list (current session marked `active`; others `Default` with a terminate
    action), from the new backend.
- **Extend the preference layer** — add `notifyPayments`, `showRatingInProfile`, `showOnlineStatus` to the `User` model
  (Boolean `@default(true)`), the `Preferences` type, `getPreferences`, and the `updatePreferences` server action
  (partial-safe, like today).
- **Add real session tracking** (`authentication`):
  - New `Session` model (`id`, `userId` FK cascade, `userAgent`, `ipAddress`, `createdAt`, `lastActiveAt`, index on
    `userId`); `User.sessions Session[]`.
  - `createSession` captures the request `user-agent` + IP (`headers()`), creates a `Session` row, and embeds its id as
    `sid` in the JWT. **Backward-compatible:** `getSession` reads `sid` when present but does **not** require a `Session`
    row to validate (existing/sid-less tokens — incl. the test harness's `createTestSession` — keep working). `logoutUser`
    / `destroySession` deletes the current `Session` row.
  - `terminateSession(sessionId)` server action (settings) — deletes a `Session` row **owned by the viewer**; if it is
    the current `sid`, it also clears the cookie and redirects to `/login`.
  - `getActiveSessions(userId, currentSid)` → `SessionRowVM[]`: title = the user-agent parsed to a readable
    «{browser} · {OS}» (a tiny local UA parser, no dependency), description = the relative last-active time, `state` =
    `active` for the current session else `Default`. **Location («Москва») is omitted** — there is no geo backend; not
    fabricated (flagged).
- **VM** — `getSettings(viewer)` returns the extended `prefs` + `email` + `sessions: SessionRowVM[]`.

No screen carries off-token literals (F2) or bespoke markup (F5) — it stays `Template + Blocks + data`. All on-screen
text is Russian, exactly as the prototype shows it.

## Key facts / decisions (derived from the prototype + owner decisions)

- **The prototype settings has NO session list and uses inline toggles/button-groups, not `ToggleField`/`CheckField`.**
  This change *adopts* those kit blocks (kit-consistent) and *adds* a sessions section as a sanctioned, owner-approved
  extension beyond the prototype.
- **Real session tracking is a backend feature** (owner decision): `Session` model + login capture + terminate. Built
  backward-compatibly so the existing auth + test harness keep working.
- **Валюта is display-only RUB** — the product is RUB-only; the selector matches the prototype but persists nothing.
- **Account section keeps delete-account AND adds logout** — logout is the prototype's action; delete-account is an
  existing real flow that is not displaced.
- **Exact labels** (prototype): notifications «Новые отклики» / «Сообщения» / «Смена статуса гига» / «Уведомления об
  оплатах»; privacy «Показывать рейтинг в профиле» / «Показывать статус «онлайн»»; «Выйти из аккаунта».
- **Location is omitted from SessionRow** (no geo backend — not fabricated).
- **F1 baselines on the prototype frame** (`Gigly Развёртка.dc.html` settings); fonts resolved. F1 = structural/overlay
  match; the absolute ≤1% gate is Phase 4 (`refidelity-from-full-design`).

## Scope

- **Reconciled screen:** `app/(protected)/settings/Settings.tsx` + `page.tsx`.
- **Data layer:** `prisma/schema.prisma` (`Session` model + `User.sessions` + 3 pref Booleans); `lib/preferences.ts`
  (`Preferences` + `getPreferences`); `lib/session.ts` (`createSession` capture + `sid`, `getSession` tolerant,
  `destroySession` row delete); `lib/view-models.ts` (`getSettings` + `getActiveSessions`); a small UA-parse helper.
- **Actions:** `app/actions/settings.ts` (`updatePreferences` extended, new `terminateSession`); `app/actions/auth.ts`
  (`logoutUser` already exists — wired to the АККАУНТ button; `createSession` callers unchanged).
- **Blocks:** adopt `ToggleField` / `CheckField` / `SessionRow` (no block changes expected; verify props suffice).
- **Tests:** `__tests__/integration/settings-vm.test.ts` (extended prefs + `getActiveSessions`);
  `__tests__/integration/session-tracking.test.ts` (new — `createSession` creates a row + `sid`; `terminateSession`
  ownership + current-session; `getSession` backward-compatible with sid-less tokens);
  `__tests__/e2e/compose-settings.spec.ts` (the four sections + ToggleField persist-on-reload + the sessions list +
  terminate + logout; keep the delete-account flow).
- **Docs:** the reconciliation note in `docs/DESIGN_SYSTEM_SPEC.md` (the four sections + the sessions extension + Валюта
  display-only); check the Phase-3 item in `full-design-reground.md`.

## Non-goals

- IP→geo location for sessions (no geo backend — location is omitted, flagged).
- Functional multi-currency (RUB-only; Валюта is display-only).
- Per-request `lastActiveAt` write on every authenticated hit — `lastActiveAt` is set at session creation and may be
  refreshed lightly (e.g. on settings load); a throttled global touch is a later refinement (flagged).
- New blocks/primitives (adopts existing `ToggleField`/`CheckField`/`SessionRow`).
- The absolute F1 ≤1% pixel gate (Phase 4).

## References

`gigly_full_design/Gigly App.dc.html` (settings ~L1342–1412; `themeOptions`/`langOptions`/`currencyOptions` L2087–2089;
`notifRows` L2090–2094; `privacyRows` L2096–2098; `doLogout` L2100); `Gigly Развёртка.dc.html` (the F1 frame). The
current `Settings.tsx` + `app/actions/settings.ts` + `lib/preferences.ts` + `lib/session.ts` + `lib/theme.ts` +
`lib/view-models.ts` (`getSettings`); blocks `ToggleField`/`CheckField`/`SessionRow` + their VMs; the existing
`logoutUser` (`app/actions/auth.ts`).
