# Change Proposal: prove-extensibility-admin

> Phase 2, change 29 (the **final** change) of the **UI Redesign Integration** plan
> (`openspec/planning/ui-redesign-integration.md`). It is the **GENERATIVITY ACCEPTANCE**: rebuild the admin moderation
> screens — **`/admin`, `/admin/users`, `/admin/gigs`**, which have **no reference mock** — **purely from the kit**,
> proving the design system is *generative* (it can express a screen it was never designed for) and that its
> **extensibility process** works (a genuine gap is added on-system and logged back to the spec, not hacked). Depends on:
> the full Phase 0 kit (AppShell + blocks + primitives + the generativity gate). Friction: **medium–high**.
>
> **The discipline.** Compose the admin screens from `AppShell` + existing blocks/primitives with **ZERO bespoke
> styling and ZERO off-system values**. Where the kit genuinely cannot express something, that is a **SYSTEM gap**: it
> is added to the Phase-0 kit **on-system** (token-pure, from primitives) and **logged to
> `docs/DESIGN_SYSTEM_SPEC.md`** — never patched with one-off styling in the screen. This change discovers **exactly one**
> such gap — a generic **`DataTable`** block (the admin lists are tabular; the marketplace never needed one) — adds it
> to the kit, logs it, and composes everything else from the existing vocabulary.

## Problem Statement

The admin moderation screens are the last **pre-redesign, off-system** surface and the only screens with **no
reference mock** — which is precisely why they are the generativity acceptance test:

- **`/admin`, `/admin/users`, `/admin/gigs` are bespoke and off-system.** They render raw `<table className="… divide-
  gray-700">`, hardcoded colour literals (`bg-blue-500/10 text-blue-500`, `bg-error-500/10 text-error-400`,
  `bg-success-500/10`), `shadow-md`, `max-w-7xl`, ad-hoc stat cards and pill badges, and a separate mobile card view —
  none of it from the token system or the kit. They are exactly the legacy the redesign exists to replace.
- **The admin layout bypasses the shell.** `app/admin/layout.tsx` renders the legacy `MainNav` (the pre-redesign nav
  the shell-cutover replaced elsewhere), not the `AppShell` + `SidebarNav`/`Topbar` every other Phase-2 screen sits in.
- **The kit has no way to express a data table.** The marketplace screens are cards/panels/lists; the kit's tables are
  *specific* (`LedgerTable` = finances, `DisputeList` = disputes). The admin users/gigs lists are **generic tabular
  records** (columns + rows + per-row actions) — an abstraction the system was never asked for. This is the **one real
  SYSTEM gap** the proof surfaces.
- **The generativity gate is a scaffold awaiting this proof.** `scripts/design-system/validate-generativity.js` today
  asserts a single novel kit-only probe (`app/workbench/screens/GenerativityProbe.tsx`) composes with zero off-system
  values; its own comment says it "is the scaffold `prove-extensibility-admin` (#29) extends to the admin proof." This
  change extends the gate to the *real* admin screens.

The planning doc maps this exactly: the admin gap (no mock) is **repurposed as the generativity proof** — rebuild admin
from the kit only; ZERO new tokens/primitives/blocks and ZERO bespoke styling, and if any is needed it is a SYSTEM gap
added to Phase 0 and noted; preserve all admin behavior; the generativity check asserts zero off-system values; existing
admin tests stay green; any system additions are logged back to `DESIGN_SYSTEM_SPEC`.

## Proposed Solution

Rebuild the three admin screens as composition-pure `@composed-screen`s from the kit, add the **one** discovered gap
on-system + log it, recompose the admin shell, extend the generativity gate, and preserve all behavior. Seven
deliverable groups:

1. **`DataTable` block — the discovered SYSTEM gap (added on-system + logged)** —
   `app/components/blocks/DataTable.tsx` (+ fixture + barrel export + workbench registry entry): a generic, token-pure
   data table — a semantic `<table>` (`<thead>`/`<tbody>`/`<tr>`/`<td>`, token classes only) with `{ columns: string[];
   rows: { id: string; cells: ReactNode[] }[] }` and an **empty state** — so cells slot existing primitives/blocks
   (`StatusBadge`, `Tag`) and inline action forms. **No new token, no new primitive, no bespoke value** — composed from
   tokens + layout. The addition is **logged to `docs/DESIGN_SYSTEM_SPEC.md` §3.2** (the block vocabulary grows by one,
   via the documented process) and recorded in the spec delta — this *is* the extensibility proof.

2. **Admin shell cutover** — `app/admin/layout.tsx` recomposed to use `AppShell` + an admin `SidebarNav` + `TopbarLive`
   (replacing `MainNav`), preserving the `getSession` guard. An admin nav set (Dashboard · Users · Gigs) is added to
   `lib/nav.ts` (nav **data**, not a kit/system addition); `markActive` highlights the active admin route.

3. **Admin view-model mappers (`lib/view-models.ts`, server-only)** — `getAdminDashboard()` → the four platform counts
   (users / gigs / suspended / closed) as a `StatPanelVM`; `getAdminUsers(opts)` and `getAdminGigs(opts)` → the
   paginated, filtered rows + total count (reusing the **existing** query/pagination/filter logic verbatim — same
   `where`, `skip`/`take`, `PAGE_SIZE`, validation). Return typed row **data**; the screen renders the cells.

4. **Three composed admin screens (`@composed-screen`, client where actions are wired)** — `AdminDashboard` (`StatPanel`
   + nav links), `AdminUsers` (a kit filter + `DataTable` of users with `StatusBadge`/`Tag` cells + inline
   suspend/unsuspend forms + pagination + empty state), `AdminGigs` (same with the close form). All composed via layout
   primitives + existing blocks/primitives + the new `DataTable` — **no `className`/`style`/raw markup or off-token
   literal**. The moderation action forms (`suspendUser`/`unsuspendUser`/`closeGig`) and the filters are **inlined**
   (imported from `@/app/actions/moderation`; URL-param navigation) — the `GigDetail`/`DisputeView` pattern — since the
   legacy `app/admin/*Form`/`*Filters` islands are not kit-importable. Thin pages preserve the **ADMIN-only** guard +
   the invalid/over-range page redirects.

5. **Generativity gate extended to the admin proof** — `scripts/design-system/validate-generativity.js` extended so the
   **admin screens** (not just the probe) are asserted to be `@composed-screen`s, and the gate runs the composition +
   token-purity lints (which scan them) — i.e. the admin screens assemble with **zero off-system values**. A planted
   off-token/off-system value in any admin screen fails the gate.

6. **Behavior preservation + tests** — all admin behavior preserved: ADMIN-only access (non-admins → `/dashboard`),
   role/status/closed filtering, pagination (30/page, invalid/over-range redirects), suspend/unsuspend/close +
   moderation logging, empty states. The existing admin **integration** tests (`admin-authorization`,
   `admin-*-pagination`, `moderation-*`) stay green (they target actions/queries, unchanged). The admin **E2E**
   (`admin-moderation`, `admin-pagination`) is updated where it asserts the old markup — the `DataTable` renders
   semantic `<tr>` rows and the action buttons keep their labels, so `tr:has-text(...)` / `button:has-text("Suspend"|
   "Close")` selectors are preserved; headings/containers that changed are updated.

7. **Spec log + acceptance** — log the `DataTable` addition to `docs/DESIGN_SYSTEM_SPEC.md` §3.2 (+ a "system additions
   from the generativity proof" note), and record the proof in the UI spec delta. Run `lint:generativity`,
   `lint:composition`, `lint:tokens`, build, the unit suite, and the admin E2E green.

This change emits **the `DataTable` block (the one logged system addition) + the admin shell cutover + the admin mappers
+ the three composed admin screens + the inlined moderation/filter wiring + the generativity-gate extension + the spec
log + tests only**. It does **not** change any data model, the moderation actions' semantics, the query/pagination/
filter logic, or the rest of the shell; and it adds **no new token or primitive** and **no bespoke styling**.

## Constraints

### MUST Requirements
- The three admin screens MUST be composition-pure `@composed-screen`s assembled **only** from `AppShell` + existing
  blocks/primitives + the **one** newly-added `DataTable` block — each MUST carry `@composed-screen`, import only
  kit/`lib`/`react`/`next`/`@/app/actions`, and contain **no** `className`/`style`/raw styled markup and **no** off-token
  literal (hex/rgb/raw px).
- **ZERO new tokens and ZERO new primitives** MUST be introduced, and **ZERO bespoke styling**. The **only** system
  addition permitted is the generic `DataTable` block, which MUST itself be token-pure (no new token/primitive/literal)
  and MUST be **logged to `docs/DESIGN_SYSTEM_SPEC.md`**; any further gap discovered MUST likewise be added on-system and
  logged — never patched in a screen.
- All admin **behavior** MUST be preserved: ADMIN-only access guard (non-admin → `/dashboard`); role/status/closed
  filtering; pagination (30/page, invalid/over-range page redirects); suspend / unsuspend / close with moderation
  logging; empty states.
- The admin shell MUST be the `AppShell` (+ admin `SidebarNav`/`Topbar`), replacing `MainNav`; the active admin nav item
  MUST highlight.
- The **generativity gate** (`lint:generativity`) MUST assert the admin screens are `@composed-screen`s that assemble
  with **zero off-system values** (composition + token-purity lints pass over them).
- `npm run build`, `npm run test:unit`, the admin E2E, `npm run lint:generativity`, `npm run lint:composition`, and
  `npm run lint:tokens` MUST be green; the existing admin **integration** tests MUST stay green.

### SHOULD Requirements
- The admin mappers SHOULD live in `lib/view-models.ts` (server-only) and **reuse the existing** query/pagination/filter
  logic (no re-derivation, same `where`/`skip`/`take`/`PAGE_SIZE`).
- The `DataTable` SHOULD render a **semantic** `<table>` (so `<tr>`-based E2E selectors and accessibility are preserved)
  and SHOULD expose an empty state; status/role SHOULD reuse `StatusBadge`/`Tag` (no new badge).
- The moderation action forms + filters SHOULD be **inlined** in the composed screens (the `GigDetail`/`DisputeView`
  pattern), reusing the kept `suspendUser`/`unsuspendUser`/`closeGig` (no new action).

### Non-Goals
- **No data-model change**; **no moderation-action semantics change**; **no query/pagination/filter logic change** (the
  mappers reuse it); **no new token or primitive**; **no bespoke styling**; **no new block beyond the one logged
  `DataTable`**.
- **No full-screen fidelity (F1) is run** — admin has **no reference mock** (that is the point); the proof is
  **generativity** (kit-only assembly, zero off-system values) + F5 + F3 + behavior preservation, not pixel fidelity.

## Success Criteria

1. `/admin`, `/admin/users`, `/admin/gigs` are F5-pure `@composed-screen`s assembled only from `AppShell` + existing blocks/primitives + the one new `DataTable`; thin pages preserve the ADMIN guard + redirects.
2. Exactly one system addition (`DataTable`), token-pure (no new token/primitive/literal), logged to `docs/DESIGN_SYSTEM_SPEC.md`; zero bespoke styling anywhere in the admin screens.
3. All admin behavior preserved: access guard, filtering, pagination, suspend/unsuspend/close + logging, empty states — existing admin integration tests green.
4. The admin shell is `AppShell` (+ admin nav, active item highlighted), replacing `MainNav`.
5. `lint:generativity` (admin screens = kit-only, zero off-system), `lint:composition`, `lint:tokens`, `build`, `test:unit`, and the admin E2E all green.

## Affected Areas

- `app/components/blocks/DataTable.tsx` (new — the one logged system addition) + `app/components/blocks/index.ts` (export) + `fixtures.ts` (fixture) + `app/workbench/registry.tsx` (catalogue) + `__tests__/unit/components/domain-blocks.test.tsx` (render test)
- `docs/DESIGN_SYSTEM_SPEC.md` (§3.2 — log the `DataTable` addition + the generativity-proof note)
- `app/admin/layout.tsx` (recomposed — `AppShell` + admin `SidebarNav`/`TopbarLive`, replacing `MainNav`) + `lib/nav.ts` (admin nav set)
- `app/admin/page.tsx` + `app/admin/AdminDashboard.tsx` (new composed screen); `app/admin/users/page.tsx` + `AdminUsers.tsx`; `app/admin/gigs/page.tsx` + `AdminGigs.tsx` (composed screens; inline moderation/filter wiring)
- `lib/view-models.ts` (new — `getAdminDashboard` / `getAdminUsers` / `getAdminGigs`, reusing the existing query logic)
- `scripts/design-system/validate-generativity.js` (extended to the admin proof)
- `__tests__/e2e/admin-moderation.spec.ts` + `admin-pagination.spec.ts` (updated to the kit markup) + the new render test; preserved admin integration tests
- `openspec/specs/ui/spec.md` (spec delta — ADDED requirements + the logged system addition, folded on archive)
- (removable once unused: `app/admin/**/*Form.tsx`, `*Filters.tsx` legacy islands — superseded by the inline wiring; the legacy `MainNav` stays if still referenced elsewhere)
- (NOT modified: data models; moderation-action / query / pagination semantics; tokens; primitives; the protected shell)

## Risks & Mitigations

**Risk**: The "zero additions" ideal vs. a real gap — adding `DataTable` could look like scope creep or like cheating the proof.
**Mitigation**: The proof's contract is explicit: a genuine gap is *expected* and is added **on-system + logged**, which is itself the extensibility demonstration. The addition is constrained — **exactly one** generic, token-pure block (no new token/primitive/literal), reused across users + gigs (not per-screen hacks), catalogued in the workbench, and recorded in `DESIGN_SYSTEM_SPEC.md`. The generativity gate then proves the screens (including the new block's use) carry **zero off-system values**.

**Risk**: F5 forbids `className`, so tabular rows with status badges + per-row actions can't be styled in the screen.
**Mitigation**: All table chrome lives in the `DataTable` **block** (token-styled there); the screen passes `cells` as existing primitives/blocks (`StatusBadge`/`Tag`/plain text) and inline `<form action={…moderation}>` (Button only) — no raw text/markup in the screen, mirroring `GigDetail`/`DisputeView`.

**Risk**: Recomposing the pages could regress admin behavior (auth, filters, pagination, moderation).
**Mitigation**: The mappers **reuse the existing** `where`/`skip`/`take`/`PAGE_SIZE`/validation verbatim and the screens reuse the **kept** moderation actions; the page guards + redirects are preserved. The existing admin **integration** tests (actions/queries) stay green unchanged; the admin **E2E** is updated to the kit markup while the semantic `<tr>` rows + preserved button labels keep most selectors working.

**Risk**: Updating the admin E2E could mask a real behavior break.
**Mitigation**: The integration tests (unchanged) independently assert moderation + pagination + authorization behavior at the action/query layer; the E2E updates are limited to markup selectors (table container, headings) while the behavioral assertions (suspend → suspended, close → closed, non-admin → redirect) are preserved.
