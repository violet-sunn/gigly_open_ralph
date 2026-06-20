# Tasks — reconcile-settings

Reconcile `/settings` (`Settings.tsx`) to the **`gigly_full_design` prototype** «Настройки» (four sections: ВНЕШНИЙ ВИД ·
УВЕДОМЛЕНИЯ · ПРИВАТНОСТЬ · АККАУНТ) adopting `CheckField`/`ToggleField`, **plus** a real session-tracking backend
(`Session` model + login capture + terminate) feeding an «Активные сессии» `SessionRow` list. Friction: **high**
(schema + auth-core changes alongside the screen re-lay; preserve backward-compat + every existing flow).

## 1. Schema — Session model + new preference fields
- [x] `prisma/schema.prisma`: add `model Session { id, userId (FK cascade), userAgent, ipAddress, createdAt,
      lastActiveAt @default(now()), @@index([userId]) }` + `User.sessions Session[]`. Add `User.notifyPayments`,
      `User.showRatingInProfile`, `User.showOnlineStatus` — Boolean `@default(true)`. Apply via `prisma db push`
      (SQLite, no migration files — repo pattern) and regenerate the client.
- **Test:** `npx prisma generate` + build typechecks; the new fields/model are queryable.

## 2. Auth — capture sessions, stay backward-compatible
- [x] `lib/session.ts`: `createSession(userId,email,role)` reads `headers()` (`user-agent`, `x-forwarded-for`/IP),
      creates a `Session` row, and embeds its id as `sid` in the JWT. `getSession` reads `sid` when present but does
      **NOT** require a `Session` row (sid-less/row-less tokens — incl. the test harness — keep validating).
      `destroySession` deletes the current `sid` row (best-effort) before clearing the cookie.
- **Test:** `session-tracking.test.ts` — `createSession` creates a row + the JWT carries `sid`; a sid-less token still
  authenticates via `getSession`; `destroySession` deletes the current row.

## 3. Session VM + terminate action + UA parser
- [x] Add a tiny `lib/user-agent.ts` parser (no dependency): UA string → «{browser} · {OS}» (Chrome/Firefox/Safari/Edge
      × Windows/macOS/Linux/iOS/Android; unknown → «Браузер · Устройство»). `lib/view-models.ts`:
      `getActiveSessions(userId, currentSid)` → `SessionRowVM[]` (title = parsed UA, description = relative last-active,
      `state` = `active` for `currentSid` else `Default`; **no location**). `app/actions/settings.ts`:
      `terminateSession(sessionId)` — delete only if `session.userId === viewer.userId`; if it is the current `sid`, also
      `destroySession()` + redirect `/login`.
- **Test:** `session-tracking.test.ts` — `terminateSession` deletes own non-current session (stays logged in); rejects
  another user's session; `getActiveSessions` marks the current session `active` and parses the UA; no location field.

## 4. Preferences — extend the type, getter, and update action
- [x] `lib/preferences.ts`: `Preferences` += `notifyPayments`, `showRatingInProfile`, `showOnlineStatus`;
      `getPreferences` selects them. `app/actions/settings.ts` `updatePreferences`: parse + persist the three new toggles
      (partial-safe, `asBool` like today). `lib/view-models.ts` `getSettings(viewer)`: return the extended `prefs` +
      `email` + `sessions: getActiveSessions(...)`.
- **Test:** `settings-vm.test.ts` — defaults true for the 3 new prefs; an update to one persists while others are
  preserved; `getSettings` includes `sessions`.

## 5. Re-compose the screen (Settings.tsx)
- [x] Re-lay `Settings.tsx` to the four sections, each a `SectionHeader` + kit blocks:
      **ВНЕШНИЙ ВИД** — `CheckField` Тема (kept on `lib/theme.ts` `applyTheme`/localStorage) + `CheckField` Язык +
      display-only Валюта (`CheckField` with ₽ Рубль selected, others disabled, no persist);
      **УВЕДОМЛЕНИЯ** — 4 `ToggleField` («Новые отклики»/«Сообщения»/«Смена статуса гига»/«Уведомления об оплатах») in
      the `updatePreferences` form;
      **ПРИВАТНОСТЬ** — 2 `ToggleField` («Показывать рейтинг в профиле»/«Показывать статус «онлайн»»);
      **АККАУНТ** — danger «Выйти из аккаунта» (`logoutUser`) + the preserved delete-account flow;
      **АКТИВНЫЕ СЕССИИ** — the `SessionRow` list (terminate on non-current rows). Template + blocks + data only — no
      className/style/hex. All form wiring (the `updatePreferences` server action, hidden inputs, the delete-account
      reveal-confirm) preserved verbatim where unchanged.
- **Test:** E2E — the four sections + the sessions list render; the labels match the prototype.

## 6. Token-purity + composition-purity (F2 / F5)
- [x] No `className=`/`style=`/hex literals in `Settings.tsx` beyond layout-primitive props; all sections compose from
      kit blocks + layout + tokens.
- **Test:** `lint:composition` PASS (`Settings` F5-pure); `lint:tokens` PASS (no new literal).

## 7. Record the reconciliation decision
- [x] `docs/DESIGN_SYSTEM_SPEC.md` §10.x: the four prototype sections + the **sessions extension** (not in the
      prototype — an owner-approved real-backend addition) + Валюта display-only + location omitted + the «Выйти из
      аккаунта» logout (delete-account preserved). Check the Phase-3 item in `full-design-reground.md`.
- **Test:** the note records the structure + the prototype-vs-extension provenance.

## 8. Update / add tests
- [x] `settings-vm.test.ts`: extended prefs (defaults + persistence) + `getSettings.sessions`.
- [x] `session-tracking.test.ts` (new): creation + `sid`; backward-compat (sid-less token authenticates); terminate
      ownership + current-session self-logout; `getActiveSessions` shape + UA parse + no location.
- [x] `compose-settings.spec.ts`: assert the four sections + a `ToggleField` toggle persists on reload + the sessions
      list (current marked, terminate on another) + «Выйти из аккаунта»; keep the delete-account flow tests.
- **Test:** all updated/added specs pass.

## 9. Quality gates (run, assert green)
- [x] `npm run validate:tokens` + `npm run lint:tokens` — PASS.
- [x] `npm run lint:composition` — PASS.
- [x] `npm run build` — PASS (`/settings`).
- [x] `npm run clean:test-db && npm run test:unit` — green (incl. `settings-vm` + `session-tracking`; verify the existing
      auth tests still pass — backward-compat).
- [x] `compose-settings` E2E green (four sections + persist + sessions + terminate + logout + delete-account).
- **Acceptance (Fidelity DoD):** F2 token-pure, F1 structural/overlay match to the prototype «Настройки», F3 flow parity
  (prefs persist + theme switch + logout + delete-account + session terminate), F5 composition-pure. F1 ≤1% deferred to
  Phase 4.

## 10. Planning-status (Phase 3)
- [x] Check `reconcile-settings` in `full-design-reground.md` Phase 3.
- **Test:** the Phase-3 item reads `[x]`.
