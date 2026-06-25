# Tasks — e2e-reevaluate-fidelity

## 1. Re-confirm the situation (the specs pass but test the wrong surface)

- [x] Confirm both specs currently resolve (this is a *relevance* fix, not a broken-import fix):
  - `ls app/workbench/page.tsx scripts/design-system/fidelity-diff.js` → both exist (the `/workbench` catalog + diff engine survived the reground).
  - `ls docs/design-system/fidelity/golden/*.png` → 16 goldens present (gate has baselines).
- [x] Confirm the retired-gate facts the rewrite relies on:
  - `grep -nE "\"lint:(tokens|composition)\"" package.json` → **no matches** (already removed).
  - `grep -nE "lint:tokens|lint:composition" __tests__/e2e/fidelity.spec.ts __tests__/e2e/fidelity-gate.spec.ts` → **no matches** (specs never referenced them — the PRD's "no removed-script reference" is already satisfied in code).
  - `grep -rn "fidelity-gate" package.json` → matches **only** `test:fidelity` and `test:fidelity:update` (the scripts to repoint).
- [x] Confirm the rewrite target loads the token SSOT:
  - `grep -rn "_design/tokens.css" app/(protected)/dashboard/DashboardDesign.tsx` → `import "@/app/_design/tokens.css"` present (so `/dashboard` is a valid token-render route; `/settings` or `/profile` are lighter fallbacks).

**Test plan:** the greps produce exactly the stated results — verifies the decision's premises before editing.

## 2. Remove the golden gate + repoint its npm scripts

- [x] Delete `__tests__/e2e/fidelity-gate.spec.ts` (the ≤1% golden gate over the superseded kit `/workbench` catalog).
- [x] Remove the now-dangling `test:fidelity` and `test:fidelity:update` scripts from `package.json` (both invoke `playwright test fidelity-gate`, which no longer exists). Leave `fidelity`, `lint:generativity`, `lint:contrast`, and `validate:tokens` untouched (still valid — `fidelity-diff.js` survives for the `--selfcheck` path).
- [x] Add a canonical **`ui`** spec delta (`specs/ui/spec.md`, `## REMOVED Requirements`) retiring `F1 ≤1% Visual-Fidelity Gate (Golden-Image Regression)`, which mandated the removed `npm run test:fidelity`. *(Discovered during implement — the proposal's original "no canonical requirement" framing covered only the `testing` spec. The canonical `openspec/specs/ui/spec.md` edit is applied at archive.)*
- [x] **Do NOT** delete `app/workbench/*` or `scripts/design-system/fidelity-diff.js` (out of scope — see Non-Goals). *(Note: `app/workbench/registry.tsx:35` has a now-stale comment mentioning `npm run test:fidelity` — cosmetic only, left in place as the workbench is out of scope.)*
- [ ] *(Optional — intentionally NOT done; left in place)* the orphaned `docs/design-system/fidelity/golden/*.png` + `docs/design-system/fidelity/out/gate/` may be deleted later — not required for acceptance, kept to keep this change tight.

**Test plan:** `ls __tests__/e2e/fidelity-gate.spec.ts` → not found; `grep -n "fidelity-gate" package.json` → **no matches**; `npm run test:fidelity` is gone (errors as an unknown script, not a "no tests found" run).

## 3. Rewrite `fidelity.spec.ts` as a design-token render check

- [x] Replace the body of `__tests__/e2e/fidelity.spec.ts` with a deterministic, screenshot-free spec:
  - Import `{ test, expect }` from `@playwright/test` and `{ setE2ESession }` from `../helpers/auth`. **No** import of `scripts/design-system/fidelity-diff.js`; **no** `page.goto("/workbench…")`.
  - Seed the minimal data the chosen route needs via the existing Prisma harness (`file:./test.db`), `setE2ESession(page, { id, email, role })`, then `page.goto('/dashboard')` (or `/settings`) and `waitForLoadState`.
  - **Dark (default):** assert `getComputedStyle(document.documentElement).getPropertyValue('--surface-card').trim()` === `#0e101a` (and at least one more, e.g. `--text-1` === `#ffffff`).
  - **Light override:** `document.documentElement.setAttribute('data-theme','light')`, then assert `--surface-card` === `#ffffff` **and** `--accent-ink` === `#0a66c2` (light values that exist **only** in `tokens.css`'s `html[data-theme="light"]` block — the discriminating proof that file rendered).
  - Update the file header comment to describe the new purpose (design-token render fidelity); remove all references to "Phase 2 / ≤1% / reference frames / workbench".
- [x] Keep the filename `fidelity.spec.ts` (preserves plan traceability — triage row #31 / Status checklist).
- [x] Assert `:root` custom properties only — **not** per-screen elements/colours (keeps the spec stable across the per-screen REWRITE changes #3–#14).

**Test plan:** `npx playwright test __tests__/e2e/fidelity.spec.ts` (after `npm run clean:test-db`) → green. The spec contains no `fidelity-diff`, no `/workbench`, no `lint:` reference.

## 4. Verify the suite still collects and nothing dangles

- [x] `npm run test:e2e -- --list` → exits 0, lists the rewritten `fidelity.spec.ts`, lists **no** `fidelity-gate` tests, and reports no missing-file / unresolved-import errors.
- [x] `grep -rn "fidelity-gate" __tests__ package.json` → **no matches** anywhere (no dangling references).
- [x] Sanity: `git status` shows only `__tests__/e2e/fidelity*.spec.ts`, `package.json`, the planning doc, and the `openspec/changes/e2e-reevaluate-fidelity/` artifacts changed — no `app/`/`lib/`/helper edits.

**Test plan:** `--list` is clean; the `fidelity-gate` grep is empty; targeted `fidelity.spec.ts` run is green.

## 5. Update the plan checklist

- [x] Tick `- [x] e2e-reevaluate-fidelity` in `openspec/planning/e2e-reconciliation.md` (Status section) and bump **Progress** to `2/16`.

**Test plan:** the planning doc shows `e2e-reevaluate-fidelity` checked and `Progress: 2/16`.

## Acceptance Criteria (deterministic)

- `__tests__/e2e/fidelity-gate.spec.ts` no longer exists; its `test:fidelity` + `test:fidelity:update` scripts are removed from `package.json`.
- `__tests__/e2e/fidelity.spec.ts` exists, imports **no** `fidelity-diff.js`, navigates to **no** `/workbench` route, and references **no** removed lint script or deleted kit component.
- The rewritten `fidelity.spec.ts` asserts `app/_design/tokens.css` resolves on a rebuilt design route in **both** the default (dark) and `data-theme="light"` states, and passes: `npx playwright test __tests__/e2e/fidelity.spec.ts` → green.
- `npm run test:e2e -- --list` collects with no import errors; `grep -rn "fidelity-gate" __tests__ package.json` → no matches.
- The canonical `ui` `F1 ≤1% Visual-Fidelity Gate` requirement is retired via a `specs/ui/spec.md` `REMOVED` delta (applied to `openspec/specs/ui/spec.md` at archive).
- No `app/`, `lib/`, helper, or unit/integration-test files were modified; working-tree changes are confined to `__tests__/e2e/`, `package.json`, the planning checklist, and this change's own artifacts.
