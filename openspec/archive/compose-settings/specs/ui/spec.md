# UI Specification Delta: compose-settings

This document contains specification changes for the `compose-settings` change — Phase-2 screen composition #11. It
builds the new **`/settings`** screen, composed from the kit (`AppShell` + language `Select` + notification
`Toggle`·list + a DangerAction), inside the `AppShell` the shell-cutover put in the protected layout, over the
**`account-preferences`** data layer (`lib/preferences.ts` + `app/actions/settings.ts`), reached from the **Topbar
gear**. It ships **a new `ToggleList` block + the `getSettings` aggregator mapper + the `Settings` composition + the
`/settings` page + the gear wiring + tests only** — F5 composition-pure, F3 IA (language · notifications · danger). **F1
is component-level** (the library-faithful `Select`/`Toggle` crops); **screen-level F1 is not run** (no full-screen
`Настройки` frame). It does **not** add a data model, change `updatePreferences`/`deleteAccount`/`getPreferences`
semantics, add a new action, add a sidebar nav item, or change the shell beyond making the gear a link.

---

## ADDED Requirements

### Requirement: Settings Composed from Blocks
The `/settings` body MUST be composed from the kit as a composition-pure screen (F5), inside the layout's `AppShell`.

#### Scenario: Settings is a composed screen
- GIVEN `app/(protected)/settings/Settings.tsx`
- WHEN it is inspected
- THEN it MUST carry the `@composed-screen` marker, compose a language `Select` + a notification `ToggleList` + an
  inline DangerAction via layout primitives (Section/Stack), import only kit/`lib`/`react`/`next`/`@/app/actions`, and
  contain **no** `className=` / `style=` / raw styled markup

#### Scenario: The page renders it
- GIVEN `app/(protected)/settings/page.tsx`
- WHEN an authenticated user loads `/settings`
- THEN the page MUST build the data server-side (`getSettings`) and render `<Settings>` (inside the shell); the
  no-session redirect MUST be preserved

**Acceptance Criteria:**
- `Settings` is an F5-pure `@composed-screen` composing `Select` + `ToggleList` + the DangerAction; the page renders it
- No-session redirect preserved

### Requirement: Settings Real Data Binding via getSettings
The screen MUST bind real data through a server-only, contract-typed `getSettings` aggregator over the
`account-preferences` data layer (`lib/preferences`), with no re-derivation.

#### Scenario: Preferences reflect the stored values
- GIVEN `getSettings(viewer)`
- WHEN it runs
- THEN it MUST return `{ prefs, email }` by reusing `getPreferences(viewer.userId)` — the language `Select` reflects the
  stored `locale` (defaulting to RU) and the `ToggleList` reflects the three stored notification booleans
  (`notifyApplications` / `notifyStatusChanges` / `notifyMessages`); the `email` is the viewer's (for the delete confirm)

**Acceptance Criteria:**
- `getSettings` returns `{ prefs, email }` from `lib/preferences`; reflects stored prefs (RU default); contract-typed (`import type`)

### Requirement: Read and Update Preferences
The screen MUST let the user view and change their language + notification preferences via the kept `updatePreferences`
action.

#### Scenario: Update language + notifications
- GIVEN the `/settings` screen bound to the user's prefs
- WHEN the user changes the language `Select` (RU default; over `LOCALES`) and/or toggles a notification category and
  saves
- THEN it MUST submit to `updatePreferences` (locale validated against `LOCALES`; toggles as `'true'`/`'false'`), the
  partial-safe update MUST persist, and the saved state MUST be reflected (a confirmation on success, an error notice on
  failure)

**Acceptance Criteria:**
- Language `Select` (RU default) + notification `ToggleList` bound to the stored prefs; Save → `updatePreferences`; persisted + reflected; invalid locale rejected

### Requirement: Delete-Account DangerAction
The screen MUST present a destructive «Удалить аккаунт» action that confirms via the account email and calls the kept
`deleteAccount`.

#### Scenario: Confirm-to-delete
- GIVEN the `/settings` screen
- WHEN the user activates «Удалить аккаунт»
- THEN it MUST reveal a confirm step requiring the user to type their account email, wired to `deleteAccount`; a wrong
  (or blank) email MUST be rejected with no deletion; the correct email MUST delete the account (FK-safe teardown),
  destroy the session, and redirect to `/`

**Acceptance Criteria:**
- «Удалить аккаунт» reveal-to-confirm over the existing `deleteAccount` (email-gated); wrong email → rejected, no deletion; correct email → teardown + session destroy + redirect to `/`; no new action

### Requirement: ToggleList Block (composition-gap fill) and Gear Entry
The `ToggleList` block MUST be implemented (named by this composition; the `Toggle` primitive exists but no block lists
labelled toggles), and the Topbar gear MUST be the settings entry.

#### Scenario: ToggleList is a token-pure kit block
- GIVEN `app/components/blocks/ToggleList.tsx`
- WHEN inspected
- THEN it MUST render a labelled toggle list from `{ items: { key; label; checked }[]; onToggle }` — one row per item
  (label + a `Toggle`) — be token-pure (the `Toggle` primitive + layout + tokens), have a fixture, and be exported from
  the blocks barrel

#### Scenario: The Topbar gear links to /settings
- GIVEN the Topbar (the profile/avatar gear)
- WHEN the live topbar renders
- THEN the gear MUST be a link to `/settings` (an additive `gearHref` on the `Topbar` block; `TopbarLive` passes
  `/settings`); when no `gearHref` is supplied the gear MUST render unchanged (plain icon)

**Acceptance Criteria:**
- `ToggleList` token-pure block (labelled rows + `Toggle`) + fixture + barrel export; `lint:tokens` passes
- The Topbar gear links to `/settings` (additive, opt-in); the route is reachable

### Requirement: Settings Verification and Component-Level Fidelity
The change MUST pass F3 + F5 + the functional/E2E suite; F1 is component-level (no full-screen frame).

#### Scenario: Buildable + functional verification (enforced)
- GIVEN the change
- WHEN `lint:composition` (F5), `lint:tokens`, `npm run build`, `npm run test:unit`, the `getSettings` unit test, and
  the settings E2E run
- THEN they MUST pass — the body is composition-pure, the IA matches the intended composition (language · notifications ·
  danger) (F3), read/update prefs + delete-account confirm + the gear entry work, and the existing `account-preferences`
  tests stay green

#### Scenario: F1 component-level
- GIVEN there is no `Настройки` full-screen reference frame in `/screens`
- WHEN fidelity is considered
- THEN screen-level F1 ≤1% MUST NOT be run (no reference); **F1 at the component level MUST hold** — the screen composes
  the library-faithful `Select` + `Toggle` primitives (validated against their library component crops in
  ui-primitives / the fidelity harness), and the new `ToggleList` only arranges the `Toggle`; F5 stays enforced and the
  missing full-screen frame MUST be recorded

**Acceptance Criteria:**
- F5 + F3 + `build` + `test:unit` + `getSettings` unit test + settings E2E green; existing `account-preferences` tests green
- F1 component-level satisfied (library `Select`/`Toggle`); screen-level F1 not run (no full-screen `Настройки` frame); composed from the kit; F5 still enforced

---

## Test Plan

This change ships a block + an aggregator mapper + a composition + a new page + the gear wiring + tests. Validation is
by deterministic commands. Commands assume the repo root.

### Composition + block + mapper + gear
```bash
grep -qE '@composed-screen' app/\(protected\)/settings/Settings.tsx && echo "Settings composed screen (F5 marker)"
grep -qE 'className=|style=' app/\(protected\)/settings/Settings.tsx && echo "CHECK raw styling" || echo "OK no raw styling"
test -f app/components/blocks/ToggleList.tsx && grep -qE 'ToggleList' app/components/blocks/index.ts && echo "ToggleList block + export"
grep -qE 'getSettings' lib/view-models.ts && grep -qE 'getPreferences' lib/view-models.ts && echo "getSettings reuses lib/preferences"
grep -qE 'Select|ToggleList' app/\(protected\)/settings/Settings.tsx && echo "composes Select + ToggleList"
grep -qE 'updatePreferences' app/\(protected\)/settings/Settings.tsx && grep -qE 'deleteAccount' app/\(protected\)/settings/Settings.tsx && echo "reuses kept actions"
grep -qE 'gearHref' app/components/blocks/Topbar.tsx && grep -qE '/settings' app/components/blocks/TopbarLive.tsx && echo "gear → /settings"
```

### F5 composition + token lints
```bash
npm run lint:composition && npm run lint:tokens && echo "F5 composition + token-purity green"
```

### Mapper unit test + build + suite (incl. preserved account-preferences)
```bash
npm run clean:test-db && npx vitest run __tests__/integration/settings-vm.test.ts 2>&1 | tail -10
npm run clean:test-db && npx vitest run __tests__/integration/account-preferences.test.ts 2>&1 | tail -8
npm run build && echo "build passes"
npm run clean:test-db && npm run test:unit && echo "unit suite green"
```

### Settings E2E (gear entry + read/update prefs + delete-account confirm)
```bash
npx playwright test __tests__/e2e/compose-settings.spec.ts --project=chromium 2>&1 | tail -12
```

### F1 (component-level; no full-screen frame)
```bash
ls screens/ | grep -iE 'setting|настр' || echo "no Настройки full-screen frame — screen-level F1 not run; F1 is component-level (Select/Toggle library crops)"
```

### Manual review
1. Confirm `Settings` is an F5-pure `@composed-screen` (Select + ToggleList + DangerAction via layout primitives; no className/style) rendered by the page inside the shell.
2. Confirm `getSettings` reflects the stored prefs (RU default) by reusing `getPreferences`; Save persists via `updatePreferences`.
3. Confirm the DangerAction confirms via the account email and deletes via `deleteAccount` (wrong email rejected; correct email → teardown + redirect to `/`); the Topbar gear links to `/settings`.
4. Confirm no data-model / `lib/preferences` / `app/actions/settings` / sidebar-nav change, and that screen-level F1 is not run (no full-screen frame) while component-level F1 holds.
