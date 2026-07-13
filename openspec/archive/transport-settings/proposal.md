# transport-settings

**Reference:** Figma `Gigly (Claude)` file `gl9wHy8VGJQTmNuQZNukqg`, node **`3121:2609`** ("pop-up/settings") — the settings popup. Fetched via the Figma MCP (`get_design_context`); screenshot captured to `design-reference/screens/settings.popup.png` for the record. This is the **deferred settings work** from `openspec/planning/transport-design-from-prototype.md` (Decision 1 left `/settings` as-is); we now bring it to the design.

## Why

The live `/settings` route was built before this design existed and diverges from it on both structure and content. The Figma popup is a single scrollable **modal** titled «Настройки» (a «6» section-counter + X-close) stacking **6 titled section cards**:

1. **Учетные данные** — profile photo (upload / remove), Имя, Email, Password
2. **Платежные данные** — «Валюта получения выплат» (₽ RUB · $ USD · € EUR)
3. **Уведомления** — «Email-уведомления»: 5 toggles
4. **Безопасность** — «Двухфакторность» toggle · «Активные сессии» · «Завершить все неактивные сеансы»
5. **Язык и регион** — «Язык интерфейса» + «Часовой пояс» dropdowns
6. **Удалить аккаунт** — «Удалить аккаунт навсегда»

The built screen instead has ВНЕШНИЙ ВИД / УВЕДОМЛЕНИЯ / ПРИВАТНОСТЬ / СЕССИИ / АККАУНТ and renders as a full route page, not the popup. This change transports the real design and wires its functionality.

## What

**Presentation — a true modal popup, 1:1 faithful (owner decision).** Build the design's actual overlay **exactly as drawn** — every element present: a backdrop + centred card (≤900px) with the sticky «Настройки» header (blue left-border accent, the «6» counter, X-close), all 6 section cards with their section icons (person-circle · credit-card · bell · shield-lock · globe2), the avatar + «Загрузить фото»/trash buttons, the input fields with their edit/clear affordances, the toggles, the currency radios, the session rows with the «Текущий» badge, and the dropdown chevrons. Opened from the shell gear/«Настройки». Implement it **query-param-driven and server-rendered** (`?settings=1` in the `(protected)` layout) so it overlays the current page, is deep-linkable, and keeps SSR data — X-close / backdrop / Esc return via the param. Extract the 6-section body into a presentational **`SettingsPanel`** reused by both the modal and the existing `/settings` route (kept as a deep-link + no-JS fallback rendering the same panel).

**Functionality — every control is EITHER live-and-wired OR grayed-and-inert (owner decision).** No control is a dead look-alike and none fabricates a backend. **Wired controls genuinely change appearance on interaction** (toggles flip, the selected currency/language/timezone updates live) and persist where a field exists. **Non-wired controls are rendered grayed/disabled** (muted `text/disabled` color, reduced opacity, `cursor: not-allowed`, `pointer-events: none`, no handlers) so they visibly cannot be toggled or edited.

| Section | Control | Treatment |
|---|---|---|
| Учетные данные | Имя | **WIRED** → `updateProfile` (`displayName`); edits + saves |
| | Email · Password · avatar «Загрузить фото»/remove | **GRAYED/INERT** — present 1:1 but muted + non-interactive (no change/verify/storage backend) |
| Платежные данные | Currency ₽ / $ / € | **WIRED** → new `UserPreferences.currency`; selection changes live + persists |
| Уведомления | 5 email toggles | **WIRED** → `updatePreferences`; flip live + persist (3 existing + 2 new fields `notifyPlatformNews`, `notifyNewGigs`) |
| Безопасность | Двухфакторность | **GRAYED/INERT** — explicitly NOT wired for now (no `twoFactorEnabled` field added); rendered muted + non-interactive |
| | Активные сессии | **WIRED** → `terminateSession` per row; «Текущий» badge for the active session; the region shown on each row is the user's real timezone («Часовой пояс»), so it tracks that changeable setting |
| | Завершить все неактивные сеансы | **WIRED** → new action `terminateInactiveSessions` (deletes all sessions except current `sid`) |
| Язык и регион | Язык интерфейса | **WIRED** → `updatePreferences` (`locale`); dropdown changes live + persists |
| | Часовой пояс | **WIRED** → `updateProfile` (`timezone`) — a personal preference stored on the profile (the SAME value the profile page shows; changing it here updates the profile); dropdown changes live + persists. **`lib/profiles.TIMEZONES` is expanded** to all 11 Russian zones (already present) **+ popular Russian-IT relocation hubs** (Tbilisi, Yerevan, Almaty, Belgrade, Istanbul, Dubai, Cyprus, Lisbon, Bangkok/Phuket, Bali, Tashkent, Bishkek, Buenos Aires) **+ major world hubs** (LA/SF, New York, Chicago, London, Berlin/Paris, Mumbai, Shanghai/Beijing, Singapore, Tokyo, Sydney, São Paulo) with Russian `(GMT±N) City` labels |
| Удалить аккаунт | Удалить аккаунт навсегда | **WIRED** → `deleteAccount` (email-confirm gate kept) |
| (header/АккаунТ) | Выйти | **WIRED** → `logoutUser` |

**Schema migration (cheap, additive):** add `currency String @default("rub")`, `notifyPlatformNews Boolean @default(true)`, `notifyNewGigs Boolean @default(true)`. (No `twoFactorEnabled` — 2FA is grayed.) `timezone`/`avatarUrl`/`displayName` already exist on the profile models.

## Constraints / Non-goals

- **Render on the app's existing token vocabulary**, not the Figma file's raw fonts. This newer Figma uses Golos Text / SF Compact tokens, but every transported screen renders on `app/_design/tokens.css` with Handjet/Manrope. Settings MUST stay visually coherent with the rest of the app — map the Figma's structure/content/spacing to existing tokens; do NOT introduce Golos Text or Tailwind. (Adopting the new type system globally is a separate initiative.)
- **Every control is live-or-gray, never a dead look-alike.** Wired controls must actually mutate visible state on interaction (a toggle visibly flips; the chosen currency/language/timezone updates immediately) and persist where backed. Non-wired controls (2FA, email, password, avatar upload) render 1:1 but **grayed and inert** — muted `text/disabled`, reduced opacity, `cursor: not-allowed`, `pointer-events: none`, no submit/handler — so the user can see they cannot be changed.
- **No fabricated data or features.** The region text on session rows is the user's real **timezone** («Часовой пояс»), so it's faithful and changeable — not invented per-session geolocation. "Currency/language/timezone change" means the **control's own state changes and the preference persists** — it does NOT mean app-wide currency reformatting or full UI re-translation (that consuming work is a separate future initiative; the stored preference is the seam).
- **2FA is explicitly NOT wired in this change** (owner decision) — rendered grayed/inert; no `twoFactorEnabled` field, no challenge flow.
- **Deferred (heavy, out of scope):** avatar-upload storage, email change + re-verification, password change, real 2FA — all rendered as grayed/inert controls.
- **Keep filenames & wiring stable:** preserve `app/actions/settings.ts` semantics (extend, don't rewrite), `terminateSession`, `deleteAccount`, `getSettings`. The `/settings` route + `compose-settings.spec.ts` + `settings-vm.test.ts` must stay green (updated only where markup/sections changed).
- Desktop-only; both themes via the existing `data-theme` token layer.

## Impact

- **New:** `app/(protected)/settings/SettingsPanel.tsx` (presentational 6-section body), `SettingsModal` wiring in the `(protected)` layout (query-param overlay), `terminateInactiveSessions` action, shell gear → `?settings=1` trigger.
- **Modified:** `prisma/schema.prisma` (+migration: `currency` + 2 toggle fields), `app/actions/settings.ts` (`updatePreferences` extended), `app/actions/profile.ts` reused, `lib/view-models.ts` (`SettingsData` + `Preferences` gain `currency`/`notifyPlatformNews`/`notifyNewGigs`), `lib/profiles.ts` (`TIMEZONES` expanded with relocation hubs + a Russian label map — **also widens the onboarding step-3 timezone select**, since it shares this list; `isTimezone`/`updateProfile` validation auto-covers the additions), `app/(protected)/settings/SettingsDesign.tsx` → becomes/wraps `SettingsPanel`, `app/_design/AppShellDesign.tsx` (gear trigger).
- **Tests:** extend `settings-vm` (new fields) + `compose-settings` (6 sections, modal open/close, new toggles, currency, terminate-all, timezone/language wiring); build green.
