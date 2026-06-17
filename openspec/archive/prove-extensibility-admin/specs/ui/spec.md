# UI Specification Delta: prove-extensibility-admin

This document contains specification changes for the `prove-extensibility-admin` change — Phase-2 change #29 (the
**final** change), the **GENERATIVITY ACCEPTANCE**. It rebuilds the admin moderation screens (`/admin`, `/admin/users`,
`/admin/gigs` — which have **no reference mock**) **purely from the kit** (`AppShell` + existing blocks/primitives),
proving the design system is generative and that its extensibility process works. It ships **one logged system addition
(a generic `DataTable` block) + the admin shell cutover + the admin view-model mappers + the three composed admin
screens + the generativity-gate extension + the spec log + tests only** — with **ZERO new tokens/primitives and ZERO
bespoke styling**. The single discovered gap (`DataTable`) is added **on-system** (token-pure) and **logged to
`docs/DESIGN_SYSTEM_SPEC.md`**. All admin behavior is preserved; the moderation actions + query/pagination/filter logic
are reused verbatim. **No full-screen F1 is run** (admin has no mock); the proof is generativity + F5 + F3 + behavior.

---

## ADDED Requirements

### Requirement: Admin Screens Composed Purely from the Kit
The admin screens (`/admin`, `/admin/users`, `/admin/gigs`) MUST each be a composition-pure `@composed-screen` assembled
**only** from `AppShell` + existing blocks/primitives + the one newly-added `DataTable` block — with **no** bespoke
styling and **no** off-system value.

#### Scenario: Each admin screen is a composed screen
- GIVEN `app/admin/AdminDashboard.tsx`, `app/admin/users/AdminUsers.tsx`, `app/admin/gigs/AdminGigs.tsx`
- WHEN they are inspected
- THEN each MUST carry the `@composed-screen` marker, import only kit/`lib`/`react`/`next`/`@/app/actions`, compose
  existing blocks/primitives + the `DataTable`, and contain **no** `className=`/`style=`/raw styled markup and **no**
  off-token literal (hex/rgb/raw px)

#### Scenario: The admin shell is the AppShell
- GIVEN `app/admin/layout.tsx`
- WHEN an admin loads any `/admin*` route
- THEN the layout MUST render `AppShell` (+ an admin `SidebarNav`/`Topbar`), replacing the legacy `MainNav`, preserving
  the `getSession` + ADMIN guard, with the active admin nav item highlighted

**Acceptance Criteria:**
- `/admin`, `/admin/users`, `/admin/gigs` are F5-pure `@composed-screen`s composed only from `AppShell` + existing kit + the one new `DataTable`; no className/style/hex
- The admin layout is the `AppShell` (+ admin nav, active item), replacing `MainNav`

### Requirement: One Logged System Addition (DataTable), Zero Bespoke Styling
The change MUST introduce **ZERO new tokens and ZERO new primitives** and **ZERO bespoke styling**. The **only**
permitted system addition is a generic, token-pure `DataTable` block, which MUST be logged to the design-system spec.

#### Scenario: DataTable is a token-pure generic block
- GIVEN `app/components/blocks/DataTable.tsx`
- WHEN inspected
- THEN it MUST render a generic, **semantic** table (`<table>`/`<tr>`/`<td>`) from `{ columns: string[]; rows: { id;
  cells: ReactNode[] }[]; empty? }` with an **empty state** — be token-pure (tokens + layout primitives; **no** new
  token/primitive and **no** off-token literal), have a fixture, and be exported from the blocks barrel

#### Scenario: The addition is logged to DESIGN_SYSTEM_SPEC
- GIVEN `docs/DESIGN_SYSTEM_SPEC.md`
- WHEN inspected after the change
- THEN §3.2 MUST list `DataTable` and MUST record that it was added **on-system** as the one gap surfaced by the
  generativity proof (`prove-extensibility-admin`) — no new token/primitive/literal

#### Scenario: No other off-system addition
- GIVEN the change
- WHEN the admin screens + the `DataTable` are linted
- THEN `lint:tokens` MUST pass with **no new off-token literal**, and no new token or primitive MUST be introduced
  (the only added file under blocks/primitives is `DataTable`)

**Acceptance Criteria:**
- Exactly one system addition (`DataTable`), token-pure (no new token/primitive/literal) + fixture + barrel export + logged to `DESIGN_SYSTEM_SPEC.md` §3.2
- Zero bespoke styling and zero new tokens/primitives across the admin screens; `lint:tokens` passes

### Requirement: Admin Behavior Preserved
The change MUST preserve all admin behavior, reusing the moderation actions and the query/pagination/filter logic.

#### Scenario: Access control
- GIVEN a non-admin user
- WHEN they load `/admin`, `/admin/users`, or `/admin/gigs`
- THEN they MUST be redirected to `/dashboard` (the ADMIN guard is preserved)

#### Scenario: Filtering, pagination, and moderation
- GIVEN an ADMIN on `/admin/users` or `/admin/gigs`
- WHEN they filter (role/status/closed) and page (30/page)
- THEN the filtered, paginated rows MUST render (invalid/over-range page → the existing redirects), reusing the existing
  `where`/`skip`/`take` logic
- AND WHEN they suspend / unsuspend a user or close a gig
- THEN the kept `suspendUser`/`unsuspendUser`/`closeGig` actions MUST run (with moderation logging), and the row state
  MUST update; empty states MUST render when there are no rows

**Acceptance Criteria:**
- Non-admin → `/dashboard`; role/status/closed filtering + pagination (30/page, invalid/over-range redirects) preserved
- Suspend/unsuspend/close via the kept actions (+ logging); empty states preserved; existing admin integration tests green

### Requirement: Generativity Gate Extended to the Admin Proof
The generativity gate MUST assert the admin screens assemble from the kit with zero off-system values.

#### Scenario: lint:generativity covers the admin screens
- GIVEN `scripts/design-system/validate-generativity.js`
- WHEN `npm run lint:generativity` runs
- THEN it MUST assert the admin screens (`AdminDashboard`/`AdminUsers`/`AdminGigs`) exist and are `@composed-screen`s,
  and MUST run the composition + token-purity lints over them — passing only when they carry **zero off-system values**
  (a planted off-system value in any admin screen MUST fail the gate)

**Acceptance Criteria:**
- `lint:generativity` asserts the admin screens are kit-only composed screens with zero off-system values; the existing probe check is retained

### Requirement: Generativity Acceptance Verification
The change MUST pass the generativity gate + F5 + F3 + the functional/E2E suite; no full-screen F1 is run (no mock).

#### Scenario: Buildable + functional verification (enforced)
- GIVEN the change
- WHEN `lint:generativity`, `lint:composition` (F5), `lint:tokens`, `npm run build`, `npm run test:unit`, and the admin
  E2E run
- THEN they MUST pass — the admin screens are composition-pure and assemble from the kit with zero off-system values,
  the IA matches the intended composition (stats / users-table / gigs-table) (F3), all admin behavior is preserved, and
  the existing admin integration tests stay green

#### Scenario: No mock → no F1
- GIVEN the admin screens have no reference frame in `/screens`
- WHEN fidelity is considered
- THEN full-screen F1 MUST NOT be run; the acceptance is **generativity** (kit-only assembly, zero off-system values) +
  F5 + F3 + behavior preservation, and the one system addition MUST be logged

**Acceptance Criteria:**
- `lint:generativity` + F5 + F3 + `build` + `test:unit` + admin E2E green; existing admin integration tests green
- No full-screen F1 (no mock); the proof is generativity + behavior preservation; the `DataTable` addition logged

---

## Test Plan

This change ships one logged block + the shell cutover + the mappers + three composed screens + the gate extension +
the spec log + tests. Validation is by deterministic commands. Commands assume the repo root.

### Composition + the one logged addition
```bash
for f in app/admin/AdminDashboard.tsx app/admin/users/AdminUsers.tsx app/admin/gigs/AdminGigs.tsx; do
  grep -qE '@composed-screen' "$f" && echo "$f composed"
  grep -qE 'className=|style=|#[0-9a-fA-F]{3,6}' "$f" && echo "  CHECK off-system in $f" || echo "  OK $f"
done
test -f app/components/blocks/DataTable.tsx && grep -qE 'DataTable' app/components/blocks/index.ts && echo "DataTable block + export"
grep -qE 'DataTable' docs/DESIGN_SYSTEM_SPEC.md && echo "DataTable logged in DESIGN_SYSTEM_SPEC"
grep -qE 'AppShell' app/admin/layout.tsx && echo "admin shell = AppShell"
```

### Generativity + F5 + token lints
```bash
npm run lint:generativity && npm run lint:composition && npm run lint:tokens && echo "generativity + F5 + tokens green"
```

### Behavior preservation (admin integration, unchanged) + build + suite
```bash
npm run clean:test-db && npx vitest run __tests__/integration/admin-authorization.test.ts __tests__/integration/moderation-integration.test.ts __tests__/integration/moderation-logging.test.ts __tests__/integration/admin-users-pagination.test.ts __tests__/integration/admin-gigs-pagination.test.ts 2>&1 | tail -10
npm run build && echo "build passes"
npm run clean:test-db && npm run test:unit && echo "unit suite green"
```

### Admin E2E (kit markup; behavior preserved)
```bash
npx playwright test __tests__/e2e/admin-moderation.spec.ts __tests__/e2e/admin-pagination.spec.ts --project=chromium 2>&1 | tail -12
```

### No mock → no F1
```bash
ls screens/ | grep -iE 'admin' || echo "no admin reference frame — no full-screen F1; the proof is generativity + behavior"
```

### Manual review
1. Confirm the three admin screens are F5-pure `@composed-screen`s composed only from `AppShell` + existing kit + the one `DataTable`; no className/style/hex.
2. Confirm exactly one system addition (`DataTable`), token-pure and logged to `DESIGN_SYSTEM_SPEC.md`; zero bespoke styling; zero new tokens/primitives.
3. Confirm all admin behavior is preserved (guard, filters, pagination, suspend/unsuspend/close + logging, empty states) and the admin integration tests stay green.
4. Confirm `lint:generativity` covers the admin screens (zero off-system values) and that no full-screen F1 is run (no mock).
