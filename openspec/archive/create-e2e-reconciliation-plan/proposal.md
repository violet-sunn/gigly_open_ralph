# Proposal: Create E2E Reconciliation Planning Document

## Change Name
`create-e2e-reconciliation-plan`

## Type
Planning Document Creation

## Problem Statement

The whole user-facing app + admin console were rebuilt directly on the `gigly_full_design` prototype's own inline-styled markup + `app/_design` tokens/fonts (14 routes + the app shell `AppShellDesign` + the admin shell), wired to the unchanged data layer. The 16 dead kit screen files were deleted, the F2/F5 purity lints were retired, `tsc --noEmit` has zero errors in `app/`/`lib/`, and the unit/integration suite is **951/951 green**.

The one remaining gap is the **E2E (Playwright) suite** (`npm run test:e2e`, separate from vitest). Most of its ~45 specs assert the **old kit DOM/labels** and now diverge from the rebuilt markup (e.g. «Откликнуться»→«Отправить заявку», «Отправить работу»→«Сдать работу на проверку», the removed gig-detail chat box, dropped breadcrumbs/back-buttons, the old `AppShell`/`SidebarNav`/`Topbar`). A subset tests features that were **intentionally removed** (breadcrumb-navigation, back-button-navigation, the old shell-cutover). A few cross-cutting specs (auth, registration, csrf, gig-browse-access, theme, accessibility) likely pass or need only light selector tweaks. The design-system fidelity specs (`fidelity`, `fidelity-gate`) reference the now-retired purity/golden gates and need re-evaluation.

This is a **pleiad of mostly-independent, per-screen tasks — not one task** — and it is dominated by the slow Playwright server-boot cycle, so it benefits from an explicit triage + ordered, parallelizable change list rather than ad-hoc fixing.

## Why This Planning Document is Needed

Reconciling the E2E suite spans every rebuilt screen + several cross-cutting concerns, and the right disposition differs per spec (rewrite vs delete vs leave). Without a triage-first plan:
- specs that test **removed features** get "fixed" instead of deleted (wasted effort, false coverage);
- per-screen DOM deltas (the exact new labels/selectors) get rediscovered repeatedly;
- the slow Playwright cycle gets spent on re-running the whole suite instead of targeted spec runs;
- it's unclear what "done" means (which specs must be green vs legitimately removed).

A planning document makes the disposition of all ~45 specs explicit, groups the rewrites into per-screen `/ralphy-plan` changes with the concrete label/selector deltas, and defines a deterministic acceptance (the Playwright suite green, with obsolete specs deleted under documented rationale). It protects the completed reground (see `gigly_full_design` reground; the live SoT is [[gig-detail-rebuilt-on-design-code]]) by restoring the regression gate the UI rebuild outdated.

## Scope

This planning document change will:

1. **Analyze the current E2E suite** — enumerate every `__tests__/e2e/*.spec.ts` (~45 files), and read the shared harness (`__tests__/helpers/auth.ts` — `setE2ESession`; the Playwright `webServer` env incl. `DISABLE_RATE_LIMIT`; `file:./test.db` seeding).

2. **Triage every spec** into one of four buckets:
   - **PASS-AS-IS** — DOM-agnostic / backend / unaffected (re-verify only).
   - **REWRITE-TO-NEW-DOM** — tests a rebuilt screen; update labels/selectors/structure.
   - **DELETE-OBSOLETE-FEATURE** — tests an intentionally-removed feature (breadcrumbs, back-buttons, old shell), delete with rationale.
   - **RE-EVALUATE-FIDELITY** — design-system gate specs tied to the retired F2/F5/golden gates.

3. **Capture per-screen DOM deltas** — the exact old→new label/selector changes for each rebuilt screen (gig-detail, dashboards, my-gigs, browse, applications, create-gig, chats, finances, settings, profile, disputes ×4, admin console), grounded in the new `*Design.tsx` components.

4. **Group into executable changes** — one `/ralphy-plan` change per rebuilt screen (or small cluster), one change for the obsolete-feature deletions, one for the fidelity re-evaluation; ordered so independent rewrites can run in parallel and shared-helper work (if any) comes first.

5. **Define acceptance** — each change's test plan = the specific spec(s) green under `npm run test:e2e`; final state = the whole Playwright suite green (or specs deleted with documented rationale).

## Deliverable

A planning document at `openspec/planning/e2e-reconciliation.md` containing:
- Problem + Why This Matters
- Scope (affected specs, the four-bucket triage table for all ~45 specs, dependencies, risks)
- Changes (ordered, copy-pasteable `/ralphy-plan` commands — one per screen/cluster — each with requirements + the concrete label/selector deltas + a test plan naming the spec(s))
- Status checklist + progress

## Constraints

- MUST NOT change `app/` or `lib/` behavior, re-introduce the kit, or modify the unit/integration suite (it is 951/951 green and must stay so).
- MUST reuse the existing E2E harness (`setE2ESession`, the seeded `file:./test.db`, the `DISABLE_RATE_LIMIT` webServer env).
- Triage MUST be grounded in the actual spec files + the shipped `*Design.tsx` markup — no invented selectors.
- Deletions are allowed ONLY for specs covering intentionally-removed features, each with a one-line rationale.

## Success Criteria

- Planning document follows `openspec/specs/planning/spec.md` format (Problem / Why This Matters / Scope / Changes / Status).
- All ~45 E2E specs are triaged into the four buckets.
- The Changes section provides ordered, copy-pasteable `/ralphy-plan` commands with concrete per-screen DOM deltas + per-spec test plans.
- The acceptance for the whole initiative is deterministic: `npm run test:e2e` green (obsolete specs deleted with rationale).
- Dependencies, risks (slow Playwright cycle, test-db pollution), and the four-bucket dispositions are documented.
