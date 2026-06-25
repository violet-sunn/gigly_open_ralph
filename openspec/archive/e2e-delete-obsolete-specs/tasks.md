# Tasks — e2e-delete-obsolete-specs

## 1. Confirm the three targets are obsolete (no live consumers)

- [x] Re-confirm `breadcrumb-navigation.spec.ts` imports `loginAs*` from `../helpers/auth` and that those exports do not exist:
  - `grep -n "export .*function loginAs" __tests__/helpers/auth.ts` → **no matches** (only `createTestSession`, `setE2ESession`).
- [x] Confirm no other spec imports/references the three files (they are leaf spec files, not shared helpers):
  - `grep -rn "loginAsSpecialist\|loginAsClient\|loginAsAdmin" __tests__` → matches **only** `breadcrumb-navigation.spec.ts`.
  - No `*.spec.ts` imports `breadcrumb-navigation`, `back-button-navigation`, or `shell-cutover` (E2E specs don't import each other).

**Test plan:** the two greps above produce exactly the stated results — verifies deletion is self-contained.

## 2. Delete the three obsolete spec files

- [x] Delete `__tests__/e2e/breadcrumb-navigation.spec.ts` (breadcrumbs removed; broken `loginAs*` import).
- [x] Delete `__tests__/e2e/back-button-navigation.spec.ts` (kit BackButton + stale `/dashboard/*` legacy routes removed).
- [x] Delete `__tests__/e2e/shell-cutover.spec.ts` (old AppShell/SidebarNav/Topbar replaced by `AppShellDesign`).
- [x] **Do NOT** add replacement files (per `[[dont-auto-restore-deleted-work]]` — features removed by design; new-shell/back coverage belongs to reconciliation changes #3–#14).

**Test plan:** `ls __tests__/e2e/ | grep -E "breadcrumb-navigation|back-button-navigation|shell-cutover"` → **no matches**. The directory drops from 46 to 43 `*.spec.ts` files.

## 3. Verify the suite still collects + the remaining specs are intact

- [x] Run the deterministic collection gate (imports every remaining spec, no server boot, no execution):
  - `npm run test:e2e -- --list`
  - **Assert:** exits 0, lists tests from the 43 remaining specs, and reports **no** missing-file / unresolved-import / module-not-found errors (in particular, the prior `loginAs*` import error is gone).
- [x] Sanity-run one untouched spec end-to-end to prove the harness still boots and the deletions caused no collateral damage:
  - `npm run clean:test-db && npm run test:e2e auth-session` → green (this also reconfirms the unauthenticated→`/login` redirect that `shell-cutover` used to assert is still covered).

**Test plan:** `--list` exits 0 with zero import errors; `auth-session` passes. No `app/`/`lib/`/helper/unit changes were made.

## 4. Update the plan checklist

- [x] Tick `- [x] e2e-delete-obsolete-specs` in `openspec/planning/e2e-reconciliation.md` (Status section) and bump **Progress** to `1/16`.

**Test plan:** the planning doc shows `e2e-delete-obsolete-specs` checked and `Progress: 1/16`.

## Acceptance Criteria (deterministic)

- The three files no longer exist under `__tests__/e2e/`.
- No replacement specs were created.
- `npm run test:e2e -- --list` collects the 43 remaining specs with **no** missing-file/import errors.
- `npm run test:e2e auth-session` (after `clean:test-db`) is green.
- No files outside `__tests__/e2e/` were modified except the planning checklist.
