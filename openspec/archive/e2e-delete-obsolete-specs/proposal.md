# Delete Obsolete-Feature E2E Specs

**Change:** `e2e-delete-obsolete-specs`
**Created:** 2026-06-21
**Plan:** Change #1 of `openspec/planning/e2e-reconciliation.md`

## Why

The protected app + admin console were rebuilt on the `gigly_full_design` prototype markup, and the design reground **intentionally removed three features**. The E2E specs that cover those features now assert DOM, routes, and helpers that no longer exist — they cannot be "rewritten" because there is nothing left to test. They are dead weight that breaks suite collection and hides real signal:

1. **`__tests__/e2e/breadcrumb-navigation.spec.ts`** — breadcrumbs were removed; the shell header (`AppShellDesign`) now supplies the page title. The spec also imports `loginAsSpecialist` / `loginAsClient` / `loginAsAdmin` from `../helpers/auth`, which **do not exist** (auth helpers export only `createTestSession` and `setE2ESession`), so the file is a hard import error that fails collection of the whole suite.
2. **`__tests__/e2e/back-button-navigation.spec.ts`** — the kit `BackButton` («← Back to …») was removed; screens that need "back" now ship their own inline link. The spec also drives stale legacy routes (`/dashboard/profile`, `/dashboard/profile/[id]`, `/dashboard/gigs`, `/dashboard/gigs/examples?from=…`) that the reground replaced.
3. **`__tests__/e2e/shell-cutover.spec.ts`** — its own header states it verifies the old `AppShell` + `SidebarNav` + `Topbar`, which were replaced wholesale by `AppShellDesign`.

The new shell, page-title, and "back" behaviours are covered by the per-screen REWRITE changes (#3–#14) in the reconciliation plan; that coverage is **not** lost by deleting these three. Restoring the suite to a state where it collects cleanly is the precondition for every subsequent reconciliation change.

## What Changes

- **DELETE** the three spec files listed above. **No replacement** — the features are gone by design.
- That is the entire behavioural change: three files removed, nothing added.

## Non-Goals / Constraints

- **E2E specs only.** No change to `app/`, `lib/`, the test harness (`__tests__/helpers/*`), or the unit/integration suite (951/951 — must stay green).
- **Do NOT recreate** these specs or scaffold replacements (per `[[dont-auto-restore-deleted-work]]`). The features were removed deliberately.
- **Out of scope:** the still-present old source files (`app/components/templates/AppShell.tsx`) and legacy lint artifacts that mention "shell-cutover" — those are separate cleanups, not E2E specs.
- The new shell / page-title / inline-back coverage is owned by reconciliation changes #3–#14; this change must not duplicate it.

## Impact

- **Specs:** `testing` — `## REMOVED Requirements` (retires the three E2E coverage requirements).
- **Code:** 3 files deleted under `__tests__/e2e/` (~695 lines removed); zero files added or modified.
- **Suite:** removing the broken `breadcrumb-navigation` import lets `npm run test:e2e` collect again; the remaining 43 specs are untouched.
- **Plan:** ticks `e2e-delete-obsolete-specs` in `openspec/planning/e2e-reconciliation.md` (Status checklist).
