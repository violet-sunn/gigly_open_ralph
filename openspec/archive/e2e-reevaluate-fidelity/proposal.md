# Re-evaluate the Design-System Fidelity E2E Gates

**Change:** `e2e-reevaluate-fidelity`
**Created:** 2026-06-21
**Plan:** Change #2 of `openspec/planning/e2e-reconciliation.md`

## Why

Two E2E specs encode the **retired design-system fidelity apparatus** from the kit era:

1. **`__tests__/e2e/fidelity-gate.spec.ts`** — a self-referential **≤1% golden-image gate**: for every `/workbench/*` surface (tokens/primitives/blocks/templates/layout/screens/generativity) in **both** themes at 1440px, it screenshots the live render and diffs it (`scripts/design-system/fidelity-diff.js`) vs a committed golden under `docs/design-system/fidelity/golden/`, failing on > 1% drift.
2. **`__tests__/e2e/fidelity.spec.ts`** — a **capture/smoke** spec that renders the same `/workbench/*` surfaces, diffs the composed-screen surface vs a *lossy* reference frame (`docs/design-system/reference-renders/frames/specialist-dashboard.lossy.jpg`), and asserts only `typeof ratio === "number"` (explicitly informational; "≤1% deferred to Phase 2").

**Both specs currently still pass** — `app/workbench/*` (all 8 surfaces), `fidelity-diff.js`, and the 16 goldens all survived the reground, so this is **not** a broken-import case like change #1. It is a **relevance** case:

- The `/workbench` catalog renders the **legacy kit** design system. The shipped app no longer derives from the kit — every protected screen was rebuilt on the `gigly_full_design` prototype's own inline-styled markup + the token bridge `app/_design/tokens.css` (imported by 14 rebuilt components: `DashboardDesign`, `GigSearchDesign`, `GigDetail`, `SettingsDesign`, `ProfileDesign`, `MyGigsDesign`, `FinancesDesign`, the disputes trio, `ChatsDesign`, `CreateGigDesign`, `ApplicationsDesign`, `AdminConsoleDesign`). The fidelity gate therefore protects a surface the product **no longer ships from** — a museum.
- These specs are the **visual arm of the retired F2/F5 gates**. The token/composition lint gates (`lint:tokens`, `lint:composition`) were already removed from `package.json` during the reconciliation baseline cleanup; the golden gate is the same apparatus by another name.
- The goldens are, by the spec's own header, **"environment-pinned to the project's Playwright Chromium"** — they flake across OS / Chromium / font-rendering differences. Keeping a ≤1% gate over a non-shipped surface is pure maintenance tax with **zero product-regression protection**, and it re-introduces exactly the "red CI that hides real regressions in the noise" failure the reconciliation plan exists to prevent.

Neither fidelity behaviour is a canonical **testing** requirement (`openspec/specs/testing/spec.md`) — like change #1's targets, they exist only as E2E implementation files. **However** (discovered during implementation), the canonical **`ui`** spec *does* carry a requirement that mandates the gate — `### Requirement: F1 ≤1% Visual-Fidelity Gate (Golden-Image Regression)` (which mandates `npm run test:fidelity`). Removing the gate retires that requirement too, so this change ships a `ui` spec delta in addition to the `testing` delta (see Impact). The sibling `ui` requirements *Human F1 Reference* and *Generativity Re-Proven* are left intact — their mechanisms (`app/workbench/registry.tsx`, `npm run lint:generativity`) still exist.

## Decision (per spec)

| Spec | Verdict | Rationale |
|------|---------|-----------|
| `fidelity-gate.spec.ts` | **REMOVE** | A ≤1% golden gate over the superseded kit `/workbench` catalog; brittle env-pinned goldens; the visual arm of the retired F2/F5 apparatus. No product-protection upside. |
| `fidelity.spec.ts` | **REWRITE** | Repurpose the lighter capture spec into a deterministic assertion that the **shipped** design-token layer (`app/_design/tokens.css`) actually renders — keeping one *meaningful* "fidelity" check aligned to the reground. |

This satisfies the PRD: the rewritten `fidelity.spec.ts` passes under `npm run test:e2e`, `fidelity-gate.spec.ts` is removed with a one-line commit rationale, and **neither** chosen spec references a deleted kit component or a removed lint script (the rewrite drops the `fidelity-diff.js` import and the `/workbench` navigation entirely).

### What the rewritten `fidelity.spec.ts` asserts

A fast, screenshot-free, flake-free check that the design-token SSOT resolves in the browser:

- Authenticate via `setE2ESession` and navigate to a rebuilt design route that imports `app/_design/tokens.css` (default: `/dashboard` → `DashboardDesign`).
- **Dark (default):** `getComputedStyle(:root)` resolves the design tokens to their committed values (e.g. `--surface-card: #0e101a`, `--text-1: #ffffff`, `--accent-ink: #4ea3ff`).
- **Light override:** after `document.documentElement.setAttribute('data-theme','light')`, the tokens resolve to the light values that live **only** in `tokens.css`'s `html[data-theme="light"]` block (e.g. `--surface-card: #ffffff`, `--accent-ink: #0a66c2`, `--surface-app: #f4f5f7`) — proving that file (not just `globals.css`) loaded and cascaded.

The assertions read `:root` custom properties, **not** per-screen markup, so the spec stays stable while the per-screen REWRITE changes (#3–#14) churn those very screens.

## Rejected alternatives

- **KEEP both as-is** — they pass today, but they gate the legacy kit catalog, not the shipped design. The golden gate's env-pinned brittleness imports CI flake for no product coverage. Rejected.
- **REMOVE both** — leaves the reground's design-token SSOT (`app/_design/tokens.css`) with **no** E2E assertion that it loads and resolves; the per-screen specs assert visible labels, not computed token values. Keeping one focused token-render check fills a real gap cheaply. Rejected.
- **Rename `fidelity.spec.ts` → `design-tokens.spec.ts`** — clearer name, but breaks traceability with the plan's triage row #31 ("fidelity") and the Status checklist. "Design-token fidelity" still fits the filename. Rejected (keep the name).

## What Changes

- **DELETE** `__tests__/e2e/fidelity-gate.spec.ts` (rationale in the commit message). No replacement.
- **REWRITE** `__tests__/e2e/fidelity.spec.ts` (same filename) to the design-token render check above — dropping the `fidelity-diff.js` import, the `/workbench` captures, and the lossy-frame diff.
- **REMOVE** the now-dangling `test:fidelity` and `test:fidelity:update` scripts from `package.json` (they invoke `playwright test fidelity-gate`, which no longer exists). *(Small, explicit, reversible scope extension — see Non-Goals.)*

## Non-Goals / Constraints

- **Do NOT delete `app/workbench/*`** — the dev-only design-system catalog may still be useful; removing it is a separate decision and out of scope here.
- **Do NOT delete `scripts/design-system/fidelity-diff.js`** — it is still used by the standalone `fidelity` npm script (`… --selfcheck && npm run lint:generativity`), which stays valid (both `fidelity-diff.js` and `lint:generativity` remain).
- **Optional cleanup (not required):** the orphaned goldens (`docs/design-system/fidelity/golden/*.png`, 16 files) and gate artifacts (`docs/design-system/fidelity/out/gate/`) may be deleted, but acceptance does **not** depend on it — they are harmless committed PNGs.
- **Scope:** `__tests__/e2e/*.spec.ts` + the two dangling `package.json` scripts only. No change to `app/`/`lib/` behaviour, the test harness (`__tests__/helpers/*`), or the unit/integration suite (951/951 — must stay green; Playwright transpiles, does not typecheck).
- **Do NOT couple the rewritten spec to per-screen markup** — it runs before changes #3–#14 rewrite those screens; assert `:root` tokens, not screen elements/colours.

## Impact

- **Specs (`testing`):** `## REMOVED Requirements` (retires the two E2E-only fidelity coverages) + `## ADDED Requirements` (the design-token render coverage).
- **Specs (`ui`):** `## REMOVED Requirements` retires `F1 ≤1% Visual-Fidelity Gate (Golden-Image Regression)` (it mandated the now-removed `npm run test:fidelity`). The sibling `ui` requirements *Human F1 Reference* and *Generativity Re-Proven* are left intact (their mechanisms — `app/workbench/registry.tsx`, `npm run lint:generativity` — still exist). Applied to the canonical `openspec/specs/ui/spec.md` at archive.
- **Code:** 1 file deleted + 1 file rewritten under `__tests__/e2e/`; 2 scripts removed from `package.json`. Zero `app/`/`lib/`/helper changes.
- **Suite:** `playwright test fidelity-gate` then matches **no** tests; `playwright test fidelity.spec.ts` runs the rewritten spec green. Remaining specs untouched.
- **Plan:** ticks `e2e-reevaluate-fidelity` in `openspec/planning/e2e-reconciliation.md` and bumps **Progress** to `2/16`.
