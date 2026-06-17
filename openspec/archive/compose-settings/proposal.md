# Change Proposal: compose-settings

> Phase 2, change 28 of the **UI Redesign Integration** plan (`openspec/planning/ui-redesign-integration.md`). It builds
> the **new `/settings`** screen, composed from the kit — within the `AppShell` the shell-cutover put in the protected
> layout — over the **`account-preferences`** data layer (`lib/preferences.ts` + `app/actions/settings.ts`): a language
> **`Select`** (RU default, over `locale`) + a notification **`Toggle`·list** + a **DangerAction** («Удалить аккаунт» →
> confirm → `deleteAccount`), reached from the **Topbar gear**. Depends on: compose-shell-cutover, ui-primitives,
> account-preferences (all complete). Friction: **medium**.
>
> **Fidelity gate — component-level.** There is **no `Настройки` full-screen reference frame** in `/screens`. Per the
> brief, fidelity here is **component-level**: the `Select` + `Toggle` are the **library-faithful primitives** (already
> validated against their library component crops in ui-primitives / the fidelity harness), so **F1 at the component
> level is satisfied by composing them**. **Screen-level F1 ≤1% is not run** (no full-screen mock) — recorded; **F5
> (composition purity) + F3 (IA: language · notifications · danger) + the functional checks are enforced**.

## Problem Statement

The `account-preferences` Phase-1 change already built the **settings data layer + actions**: `lib/preferences.ts`
(`getPreferences(userId)` → `{ locale, notifyApplications, notifyStatusChanges, notifyMessages }`, plus `LOCALES` +
`isLocale`) and `app/actions/settings.ts` (`updatePreferences` — partial-safe locale + notification updates;
`deleteAccount` — self-only, `confirmEmail`-gated, FK-safe transactional teardown + session destroy). **No screen
consumes any of it** — the data layer and both actions have no UI.

- **No `/settings` route exists** (`app/(protected)/settings/` is absent). A user cannot view or change their language /
  notification preferences, nor delete their account, through the UI.
- **The Topbar gear is a dead icon.** `Topbar` renders `<Icon src={ICON.gear} alt="Настройки" />` but it is **not a
  link** — the design's settings entry point (the gear by the profile/avatar) goes nowhere. This change wires it to
  `/settings`.
- **The `Toggle`·list is a composition gap.** The redesign composition names a notification **Toggle list**; the
  `Toggle` primitive exists but there is **no block that renders a labelled list of toggles**. Composing toggle rows
  with their category labels directly in the screen is impossible under F5 (a composed screen may carry no
  `className`/raw text styling — all text lives in blocks/primitives). So this change adds one gap-fill block,
  `ToggleList`, exactly as `LedgerTable`/`DisputeList`/`StepIndicator` were for prior screens.
- **The danger action must be built from the kit.** `deleteAccount` requires `confirmEmail === session.email` — a
  built-in confirm. The existing `ConfirmDialog` lives in `app/components/ui/` (NOT a kit dir, so a `@composed-screen`
  cannot import it under the composition linter). The «Удалить аккаунт» DangerAction is therefore composed inline from
  kit primitives (`Button` + `Input` + `Notice`): a destructive button reveals a confirm step (type your account email)
  that submits `deleteAccount` — honouring the action's existing contract.

The planning doc maps this exactly: compose `/settings` from `AppShell + Select(language) + Toggle·list(notifications) +
DangerAction(delete)` over `account-preferences`, reached from the profile-card gear; verify read/update prefs +
delete-account confirm + the entry is wired; Fidelity DoD at the **component level** (library component crops, F3, F5)
since there is no full-screen mock. This change adds the screen + one gap-fill block + the gear wiring over the existing
data layer.

## Proposed Solution

Add the `/settings` route as a composition-pure screen, one gap-fill block, the Topbar gear wiring, and verification.
Six deliverable groups:

1. **`ToggleList` block (gap fill)** — `app/components/blocks/ToggleList.tsx` (+ fixture + barrel export): a token-pure
   labelled toggle list — one row per item (`label` + a `Toggle`), controlled via `{ items: { key: string; label:
   string; checked: boolean }[]; onToggle: (key: string) => void }`. Composed from the `Toggle` primitive + layout +
   tokens. (The `Toggle` primitive is library-faithful; the block only arranges labelled rows — component-level F1
   holds.)

2. **`getSettings` mapper (`lib/view-models.ts`, server-only, contract-typed)** — `getSettings(viewer)` → `{ prefs:
   Preferences; email: string }`: reuses `getPreferences(viewer.userId)` (no re-derivation) and includes the viewer's
   email (for the delete-account confirm). `import type` the `Preferences` shape.

3. **`Settings` composed screen (`@composed-screen`, client)** — `app/(protected)/settings/Settings.tsx`: props = the
   prefs + email. Composes via layout primitives only (no `className`/`style`): a `Section` «Настройки» containing — a
   **language `Select`** (`LOCALES` → display labels «Русский»/«English», RU default, controlled + a hidden `locale`
   input), a **`ToggleList`** of the three notification categories (controlled + hidden `notifyApplications` /
   `notifyStatusChanges` / `notifyMessages` inputs carrying `'true'`/`'false'`), a **Save** action wired to the kept
   `updatePreferences` (`useActionState`; `{success}` → confirmation `Notice`, `{error}` → error `Notice`), and a
   **DangerAction** («Удалить аккаунт» → reveal a confirm `Input` (type your email) → a confirm `Button` wired to the
   kept `deleteAccount`). RU copy. Mirrors the `GigDetail`/`DisputeView` inline-client + hidden-input pattern.

4. **Thin server page (`app/(protected)/settings/page.tsx`)** — `getSession` + no-session redirect; `getSettings({
   userId, email })`; render `<Settings prefs={…} email={…} />` (inside the shell).

5. **Topbar gear wiring (the entry)** — make the `Topbar` gear a link to `/settings` (an additive optional `gearHref`
   prop on the `Topbar` block, defaulting to no-link so the block stays presentational; `TopbarLive` passes
   `gearHref="/settings"`). The gear by the profile/avatar becomes the settings entry; the `/settings` route is reachable
   and renders.

6. **Tests + fidelity flag** — unit test for `getSettings` (returns the user's prefs + email; reflects defaults). E2E
   (`compose-settings.spec.ts`): the gear links to `/settings`; the screen shows the language Select (RU default) + the
   three notification toggles reflecting stored prefs; toggling + saving persists via `updatePreferences` (reflected on
   reload); «Удалить аккаунт» reveals the email-confirm and a wrong email is rejected while the correct email deletes the
   account and redirects to `/`. `lint:composition` (F5) on `Settings`; F3 IA. **F1 is component-level** (library
   Select/Toggle crops) — satisfied by composing the primitives; screen-level F1 not run (no full-screen frame) —
   recorded.

This change emits **the `ToggleList` block + the `getSettings` mapper + the `Settings` composition + the new `/settings`
page + the Topbar gear wiring + tests only**. It does **not** add or change a data model, change `updatePreferences` /
`deleteAccount` / `getPreferences` semantics, add any new server action, or change the shell beyond making the gear a
link.

## Constraints

### MUST Requirements
- The `/settings` body MUST be composed from the kit (`Select` + `ToggleList` + the inline DangerAction) inside the
  layout's `AppShell`, as a composition-pure screen (F5): `Settings` MUST carry `@composed-screen`, import only
  kit/`lib`/`react`/`next`/`@/app/actions`, and contain **no** `className`/`style`/raw styled markup.
- The screen MUST bind **real** data via `getSettings` over `lib/preferences` — the language `Select` reflects the
  stored `locale` (RU default) and the `ToggleList` reflects the three stored notification booleans.
- Updating MUST call the **kept** `updatePreferences` action (partial-safe; locale validated against `LOCALES`) and
  reflect the saved state; the language MUST default to RU.
- The DangerAction MUST require typing the account email and call the **kept** `deleteAccount` (which rejects a wrong
  email and, on the correct email, tears down the account + session and redirects to `/`).
- The `ToggleList` block MUST be implemented token-pure (labelled rows + `Toggle`), with a fixture and a barrel export.
- The Topbar **gear MUST link to `/settings`** (the entry), and the `/settings` page MUST render for an authenticated
  user with the no-session redirect preserved.
- `npm run build`, `npm run test:unit`, the settings E2E, `npm run lint:composition`, and `npm run lint:tokens` MUST be
  green; the existing `account-preferences` tests MUST stay green.

### SHOULD Requirements
- `getSettings` SHOULD live in `lib/view-models.ts` (server-only, `import type` the `Preferences` shape) and reuse
  `getPreferences` (no re-derivation).
- `Settings` SHOULD be a client `@composed-screen` (interactive Select/Toggles + the reveal-to-confirm DangerAction),
  mirroring `GigDetail`/`DisputeView`; the `Select`/`Toggle` SHOULD carry their values via hidden inputs so the screen
  stays F5-pure.
- The language `Select` SHOULD present human labels («Русский»/«English») for the `LOCALES` values.

### Non-Goals
- **No data-model change** (the `locale` + notification fields exist); **no `updatePreferences` / `deleteAccount` /
  `getPreferences` semantics change**; **no new server action**; **no sidebar nav item for settings** (the entry is the
  Topbar gear, per the design) and **no other shell change** beyond making the gear a link.
- **Screen-level F1 ≤1% is not run** — there is no full-screen `Настройки` reference frame; **F1 is component-level**
  (the `Select`/`Toggle` library crops, already validated), and the screen is composed from those primitives with F5/F3/
  functional enforced; the missing full-screen frame is recorded.

## Success Criteria

1. `/settings` body composes `Select` (language) + `ToggleList` (notifications) + the inline DangerAction as an F5-pure `@composed-screen`, rendered by a thin server page inside the shell.
2. Real data bound via `getSettings` over `lib/preferences` — language reflects `locale` (RU default), toggles reflect the stored booleans; saving persists via `updatePreferences`.
3. The DangerAction confirms via the account email and deletes via `deleteAccount` (wrong email rejected; correct email → teardown + redirect to `/`).
4. `ToggleList` block implemented token-pure (+ fixture + export); the Topbar gear links to `/settings`; the route renders (redirect preserved).
5. `build`, `test:unit` (existing `account-preferences` tests green), settings E2E, `lint:composition`, `lint:tokens` all green; F1 component-level satisfied (library Select/Toggle), screen-level F1 not run (no full-screen frame) — recorded.

## Affected Areas

- `app/(protected)/settings/page.tsx` (new — thin server page: `getSettings` + `<Settings>`)
- `app/(protected)/settings/Settings.tsx` (new — `@composed-screen`, client: Select + ToggleList + inline DangerAction)
- `app/components/blocks/ToggleList.tsx` (new block) + `app/components/blocks/index.ts` (export) + `fixtures.ts` (fixture)
- `lib/view-models.ts` (new — `getSettings` aggregator over `lib/preferences`, contract-typed)
- `app/components/blocks/Topbar.tsx` (additive optional `gearHref`) + `app/components/blocks/TopbarLive.tsx` (pass `gearHref="/settings"`)
- read-only / reused inputs: `lib/preferences` (`getPreferences`/`LOCALES`), `app/actions/settings` (`updatePreferences`/`deleteAccount`), the primitives (`Select`/`Toggle`/`Input`/`Button`), the `Notice` block, the layout primitives
- `__tests__/e2e/compose-settings.spec.ts` (new) + `__tests__/integration/*` (`getSettings` unit test) + preserved `account-preferences.test.ts`
- `openspec/specs/ui/spec.md` (spec delta — ADDED requirements, folded on archive)
- (NOT modified: data models; `lib/preferences` / `app/actions/settings` semantics; the sidebar nav; the shell beyond the gear link)

## Risks & Mitigations

**Risk**: No full-screen mock — composing "by eye" could drift.
**Mitigation**: Compose strictly from existing system entities (the library-faithful `Select` + `Toggle` + the new token-pure `ToggleList` + `Input`/`Button`/`Notice` + layout primitives). `lint:composition` (F5) + `lint:tokens` (F2) make off-system styling impossible. **F1 is component-level** (the Select/Toggle library crops, already validated); screen-level F1 is explicitly not run (no frame) and recorded — not faked; F3 IA (language · notifications · danger) is the enforced screen bar.

**Risk**: F5 forbids `className`, so a labelled toggle list / Select can't be styled inline in the screen.
**Mitigation**: The labelled toggle rows live in the new `ToggleList` **block** (token-styled there); the language `Select` is a primitive; values are carried to `updatePreferences` via hidden inputs (the `DisputeView` pattern). No raw text/markup in the screen.

**Risk**: The delete flow is destructive; a stray click could delete an account.
**Mitigation**: The DangerAction is **reveal-to-confirm** — «Удалить аккаунт» reveals a confirm step that requires typing the exact account email, and `deleteAccount` re-checks `confirmEmail === session.email` server-side (rejecting a wrong/blank email). The E2E asserts both the wrong-email rejection and the correct-email teardown.

**Risk**: Wiring the gear could regress the shared `Topbar` block used across the shell.
**Mitigation**: The `gearHref` prop is **additive and optional** — absent, the gear renders exactly as today (plain icon, no behaviour change); only `TopbarLive` opts in with `gearHref="/settings"`. The block stays presentational and token-pure; the domain-blocks render tests stay green.
