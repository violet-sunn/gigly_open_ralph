# Implementation Tasks: compose-settings

> **Phase-2 screen composition.** Build the new `/settings` screen, composed from the kit (`AppShell` (layout, in place)
> + language `Select` + notification `Toggle`·list + a DangerAction) over the existing `account-preferences` data layer
> (`lib/preferences.ts` + `app/actions/settings.ts`), reached from the **Topbar gear**. Add the `ToggleList` block
> gap-fill; add a thin `getSettings` aggregator; wire the gear → `/settings`. F5 composition-pure, F3 IA. **F1 is
> component-level** (the library-faithful `Select`/`Toggle` crops) — satisfied by composing the primitives; screen-level
> F1 not run (no full-screen `Настройки` frame). Reuse `updatePreferences`/`deleteAccount` verbatim (no new action).
> Mirror the prior compose-* screens. Friction: medium.

---

## Task 1: [x] `ToggleList` block (composition-gap fill)

**Implementation Notes:**
- Create `app/components/blocks/ToggleList.tsx` (a block — token classes / layout primitives OK; NOT a
  `@composed-screen`): a labelled toggle list, controlled. Props `{ items: { key: string; label: string; checked:
  boolean }[]; onToggle: (key: string) => void }`. One row per item: a label + a `Toggle` (right-aligned). Use the
  `Toggle` primitive + `Stack` (row, justify between). Token-pure. Sketch:
  ```tsx
  import { Toggle } from "@/app/components/primitives";
  import { Panel } from "@/app/components/layout/Panel";
  import { Stack } from "@/app/components/layout/Stack";

  export interface ToggleItem { key: string; label: string; checked: boolean }
  export function ToggleList({ items, onToggle }: { items: ToggleItem[]; onToggle: (key: string) => void }) {
    return (
      <Panel surface={1} radius="lg" padding={6}>
        <Stack gap={4}>
          {items.map((it) => (
            <Stack key={it.key} axis="row" gap={4} align="center" justify="between">
              <span className="text-body font-body text-strong">{it.label}</span>
              <Toggle checked={it.checked} onChange={() => onToggle(it.key)} aria-label={it.label} />
            </Stack>
          ))}
        </Stack>
      </Panel>
    );
  }
  ```
- Add `toggleListFixture` (3 sample rows) to `fixtures.ts`; export `ToggleList` (+ `ToggleItem` type) from
  `app/components/blocks/index.ts`. Optionally add a render assertion to `domain-blocks.test.tsx`.

**Test Plan:**
```bash
test -f app/components/blocks/ToggleList.tsx && grep -qE 'ToggleList' app/components/blocks/index.ts && echo "block + export"
grep -qE 'toggleListFixture' app/components/blocks/fixtures.ts && echo "fixture"
npm run lint:tokens && echo "token-pure"
```
Expected: `ToggleList` token-pure block (labelled rows + `Toggle`) + fixture + barrel export.

---

## Task 2: [x] `getSettings` aggregator mapper (`lib/view-models.ts`)

**Implementation Notes:**
- Add `getSettings(viewer)` (server-only) — a thin aggregator over `lib/preferences` (no re-derivation):
  ```ts
  import { getPreferences, type Preferences } from '@/lib/preferences'

  export interface SettingsData { prefs: Preferences; email: string }

  export async function getSettings(viewer: { userId: string; email: string }): Promise<SettingsData> {
    const prefs = (await getPreferences(viewer.userId)) ?? {
      locale: 'ru', notifyApplications: true, notifyStatusChanges: true, notifyMessages: true,
    }
    return { prefs, email: viewer.email }
  }
  ```
  (`getPreferences` returns the stored prefs; the email comes from the session for the delete-account confirm.
  `import type` the `Preferences` shape.)

**Test Plan:**
```bash
grep -qE 'getSettings' lib/view-models.ts && grep -qE 'getPreferences' lib/view-models.ts && echo "aggregator reuses lib/preferences"
```
Expected: `getSettings(viewer)` → `{ prefs, email }` from `lib/preferences`; contract-typed.

---

## Task 3: [x] `Settings` composed screen (Select + ToggleList + DangerAction)

**Implementation Notes:**
- Create `app/(protected)/settings/Settings.tsx` (`/* @composed-screen */` + `'use client'`). Props = `SettingsData`.
  State: `locale`, the three notification booleans, `localeOpen` (Select), and `confirming` (DangerAction reveal).
  Compose via layout primitives only (no className/style):
  - `Section` «Настройки» wrapping the groups.
  - **Language** — a `Select` over `LOCALES` with display labels («Русский»/«English»), controlled + a hidden
    `name="locale"` input; inside a `Section` «Язык» (sub-heading).
  - **Notifications** — a `ToggleList` of the 3 categories (Отклики / Изменения статуса / Сообщения), controlled, with
    hidden `name="notifyApplications"` / `notifyStatusChanges` / `notifyMessages` inputs carrying `'true'`/`'false'`;
    inside a `Section` «Уведомления». A **Save** `Button` (type=submit) in a `<form action={updatePreferences}>`
    (useActionState); `{state?.success}` → a success `Notice`, `{state?.error}` → an error `Notice`.
  - **DangerAction** — a «Удалить аккаунт» `Button` (variant secondary) that sets `confirming=true`, revealing a
    `Notice` (tone error) warning + an `Input name="confirmEmail"` (placeholder = the email) + a confirm `Button` inside
    a separate `<form action={deleteAccount}>` (useActionState; `{error}` → `Notice`). The action redirects to `/` on
    success.
  - Mirror `DisputeView`'s inline `Select` + hidden-input pattern. No className/style → F5-clean.
- Both `updatePreferences` and `deleteAccount` imported from `@/app/actions/settings` (allowed prefix); no new action.

**Test Plan:**
```bash
grep -qE '@composed-screen' app/\(protected\)/settings/Settings.tsx && echo "composed screen"
grep -qE 'className=|style=' app/\(protected\)/settings/Settings.tsx && echo "CHECK raw styling" || echo "OK no raw styling"
grep -qE 'Select|ToggleList' app/\(protected\)/settings/Settings.tsx && echo "composes Select + ToggleList"
grep -qE 'updatePreferences' app/\(protected\)/settings/Settings.tsx && grep -qE 'deleteAccount' app/\(protected\)/settings/Settings.tsx && echo "reuses kept actions"
npm run lint:composition && echo "F5 green"
```
Expected: F5-pure composition (language Select + notification ToggleList + delete DangerAction) wired to the kept actions.

---

## Task 4: [x] Thin server page

**Implementation Notes:**
- Create `app/(protected)/settings/page.tsx` (server): `getSession` + no-session redirect; call `getSettings({ userId:
  session.userId, email: session.email })`; render `<Settings {...data} />`.

**Test Plan:**
```bash
grep -qE 'getSettings|Settings' app/\(protected\)/settings/page.tsx && grep -qE 'getSession' app/\(protected\)/settings/page.tsx && echo "page composed"
```
Expected: `/settings` renders `Settings` for an authenticated user; redirect preserved.

---

## Task 5: [x] Topbar gear wiring (the entry)

**Implementation Notes:**
- `app/components/blocks/Topbar.tsx`: add an optional `gearHref?: string` prop. When present, wrap the gear `Icon` in a
  Next `<Link href={gearHref}>`; when absent, render the plain `Icon` as today (no behaviour change). Token-pure.
- `app/components/blocks/TopbarLive.tsx`: pass `gearHref="/settings"` to `Topbar`.
- (No sidebar nav item is added — the entry is the gear, per the design.)

**Test Plan:**
```bash
grep -qE 'gearHref' app/components/blocks/Topbar.tsx && echo "gear is linkable"
grep -qE 'gearHref="/settings"|gearHref={"/settings"}' app/components/blocks/TopbarLive.tsx && echo "live topbar wires gear → /settings"
npm run lint:tokens && echo "token-pure"
```
Expected: the Topbar gear links to `/settings` via `TopbarLive`; the block stays presentational (additive prop).

---

## Task 6: [x] `getSettings` unit test + settings E2E + acceptance + fidelity flag

**Implementation Notes:**
- `__tests__/integration/settings-vm.test.ts` (mock `@/lib/prisma`/`next/*`; `createTestUser`): `getSettings` returns
  the user's prefs (defaults — locale `ru`, all toggles on) + the email; after an `updatePreferences` it reflects the
  saved values.
- `__tests__/e2e/compose-settings.spec.ts` (setE2ESession + seed via prisma into `file:./test.db`): the Topbar gear
  links to `/settings`; the screen shows the language Select (RU default) + the three notification toggles; toggling a
  category + Save persists (reflected on reload); «Удалить аккаунт» reveals the email-confirm — a wrong email shows an
  error and keeps the account, the correct email deletes it and redirects to `/`.
- **Keep** the `account-preferences` integration tests (`account-preferences.test.ts`) unchanged — they target
  `lib/preferences` / `app/actions/settings`, preserved.
- Run F5 composition lint, token lint, build, full unit suite, and the E2E. Confirm scope: only `/settings` added + the
  `ToggleList` block + the `getSettings` aggregator + the gear wiring; `lib/preferences` / `app/actions/settings`
  semantics unchanged; no data-model change; no new action; no sidebar nav change. Record the fidelity stance: **F1
  component-level** (library `Select`/`Toggle` crops) satisfied by composing the primitives; **screen-level F1 not run**
  (no full-screen `Настройки` frame).

**Test Plan:**
```bash
grep -qE 'getSettings|Settings' app/\(protected\)/settings/page.tsx && echo "page composed"
npm run clean:test-db && npx vitest run __tests__/integration/settings-vm.test.ts 2>&1 | tail -10
npm run clean:test-db && npx vitest run __tests__/integration/account-preferences.test.ts 2>&1 | tail -8
npx playwright test __tests__/e2e/compose-settings.spec.ts --project=chromium 2>&1 | tail -12
npm run lint:composition && npm run lint:tokens && echo "F5 + tokens green"
npm run build && echo "build passes"
npm run clean:test-db && npm run test:unit && echo "unit suite green"
ls screens/ | grep -iE 'setting|настр' || echo "no Настройки full-screen frame — screen-level F1 not run; F1 is component-level (Select/Toggle library crops)"
```
Expected: `getSettings` unit test passes; the preserved `account-preferences` tests stay green; the E2E covers read/update prefs + delete-account confirm + gear entry; F3 + F5 + build + suite green; component-level F1 recorded.

---

## Summary

Total tasks: 6
Estimated effort: 8–12 hours (friction: medium — a new route + one block gap-fill + a thin aggregator + an interactive
composed screen (Select + ToggleList + reveal-to-confirm DangerAction) + the gear wiring; no new data model, no new
action, `lib/preferences`/`app/actions/settings` reused; no full-screen mock to diff)

**Deliverables:**
- `ToggleList` block (gap fill) + fixture + export.
- `lib/view-models.ts` — `getSettings` aggregator (reuses `getPreferences`), contract-typed.
- `Settings` F5-pure `@composed-screen` (language Select + notification ToggleList + delete DangerAction); thin server page.
- Topbar gear wired → `/settings` (additive `gearHref`).
- `getSettings` unit test + settings E2E (read/update + delete-confirm + gear entry); preserved `account-preferences` tests; F1 component-level (screen-level not run — no frame).

**Critical path:** ToggleList block (1) → getSettings (2) → Settings composition (3) → page (4) → gear wiring (5) → tests + acceptance + fidelity flag (6).

**Dependencies:** compose-shell-cutover (AppShell + Topbar), ui-primitives (Select/Toggle/Input/Button), account-preferences (getPreferences/updatePreferences/deleteAccount) — all complete.

---

## Implementation status (2026-06-17)

**Done + verified (Tasks 1–6):**
- **`ToggleList` block** (`app/components/blocks/ToggleList.tsx`) — labelled toggle rows (label + `Toggle`) from
  `{ items, onToggle }`; token-pure, `toggleListFixture` + barrel export (+ `ToggleItem` type). Render test in
  `domain-blocks.test.tsx` (on/off state + `onToggle` fires).
- **`getSettings` aggregator** (`lib/view-models.ts`) — `{ prefs, email }` reusing `getPreferences` (schema-default
  fallback), the email from the session for the delete confirm. `import type` the `Preferences` shape.
- **`Settings` `@composed-screen`** (`app/(protected)/settings/Settings.tsx`, `'use client'`) — Section «Настройки» with
  a language `Select` (RU default, «Русский»/«English», controlled + hidden `locale`), a `ToggleList` of the 3
  notification categories (controlled + hidden `notify*` inputs `'true'`/`'false'`) saved via `updatePreferences`, and a
  reveal-to-confirm DangerAction («Удалить аккаунт» → email `Input` → `deleteAccount`). F5-pure (no className/style);
  values carried via hidden inputs (the DisputeView pattern). Thin server page wires `getSession` + `getSettings`.
- **Topbar gear wired** — additive optional `gearHref` on the `Topbar` block (gear → `<Link>` when supplied, plain icon
  otherwise); `TopbarLive` passes `gearHref="/settings"`. No sidebar nav change.
- **Tests** — `settings-vm.test.ts` **2/2** (defaults + email; reflects stored changes). `compose-settings.spec.ts`
  **4/4** in a real browser — the gear links to `/settings`; the language Select (RU default) + 3 toggles reflect stored
  prefs; toggling + Save persists (reflected on reload); «Удалить аккаунт» confirms via the account email (wrong →
  rejected/intact, correct → teardown + redirect to `/`).
- **Gates** — `lint:composition` (F5, **15** composed screens; +1) ✓ · `lint:tokens` ✓ · `npm run build` ✓ (`/settings`
  1.57 kB) · `npm run test:unit` **902/903** (the single failure was the known flaky `gig-browse-access` timeout under
  whole-suite DB contention — confirmed green in isolation; not a settings regression) · preserved
  `account-preferences` tests **7/7** ✓.

**Task 6 fidelity — F1 component-level.** There is **no `Настройки` full-screen reference frame** (`ls screens/ |
grep -iE 'setting|настр'` → none). Screen-level F1 ≤1% is **not run**; **F1 holds at the component level** — the screen
composes the library-faithful `Select` + `Toggle` primitives (validated against their library crops in
ui-primitives/the fidelity harness) and the new `ToggleList` only arranges the `Toggle`. F5 + F3 enforced; the missing
full-screen frame is recorded.

**Reconciliation recorded:** the delete-account E2E reloads between the wrong-email and correct-email attempts — after
`updatePreferences`/`deleteAccount` returns `{error}`, `useActionState` re-renders the uncontrolled confirm form, so a
clean reload before the correct-email submit makes the destructive flow deterministic.

**Scope guards (non-goals held):** no data-model change (the `locale` + notification fields exist); `lib/preferences` +
`app/actions/settings` semantics **unchanged** (the `account-preferences` tests stay green); no new server action; no
sidebar nav item (the entry is the gear); the `Topbar` change is additive/opt-in (the block stays presentational, render
tests green).
