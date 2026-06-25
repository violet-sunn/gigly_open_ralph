# Tasks: Create E2E Reconciliation Planning Document

> **Status: ✅ ALL TASKS COMPLETE (2026-06-21).** Deliverable: `openspec/planning/e2e-reconciliation.md` — validated against `openspec/specs/planning/spec.md` (all 5 sections present; all 46 E2E specs triaged into the 4 buckets with no gaps; 16 ordered, copy-pasteable `/ralphy-plan` changes each with a `npm run test:e2e` test plan; deterministic acceptance = whole Playwright suite green). Tasks 1–2 (inventory + triage) grounded in `page.goto` routes + the changed-label footprint; Task 3 (DOM deltas) grounded in the shipped `*Design.tsx`; Tasks 4–6 (group/write/validate) done.

## Task 1: Analyze the current E2E suite + harness

**Implementation Notes:**
- Enumerate every `__tests__/e2e/*.spec.ts` (~45 files) and, for each, capture WHAT it exercises (route(s), role(s), the key DOM assertions: `getByRole`/`getByText`/labels/selectors).
- Read the shared harness: `__tests__/helpers/auth.ts` (`setE2ESession`, `createTestSession`), the Playwright config `webServer` (the `DISABLE_RATE_LIMIT` env, `file:./test.db`, `npm run dev`), and the seeding pattern (direct Prisma into `file:./test.db`).
- Note the known operational facts: Playwright is slow (server-boot per run; prefer `-g`/per-file runs); repeated runs can pollute the test DB (`npm run clean:test-db`).
- Cross-reference the shipped design components (the `app/(protected)/**/*Design.tsx`, `app/admin/AdminConsoleDesign.tsx`, `app/_design/AppShellDesign.tsx`) so the analysis reflects the REAL new markup.

**Test Plan:**
- A complete inventory: every spec file listed with its target route(s)/role(s) + its primary DOM assertions.
- The harness capabilities documented (auth helper, seeding, rate-limit bypass).

---

## Task 2: Triage every spec into four buckets

**Implementation Notes:**
- Classify each of the ~45 specs into exactly one bucket:
  - **PASS-AS-IS** — DOM-agnostic / backend / auth / access-control specs unaffected by the UI rebuild (re-verify only). Candidates: `csrf-protection`, `gig-browse-access`, `login-role-param`, `auth-session`, parts of `registration`.
  - **REWRITE-TO-NEW-DOM** — tests a rebuilt screen; needs label/selector/structure updates. Candidates: `compose-gig-detail-apply`, `compose-client-dashboard`, `compose-specialist-dashboard`, `compose-my-gigs`, `compose-gig-search`, `build-applications-screen`, `compose-create-gig`, `compose-chats`, `compose-finances`, `compose-settings`, `compose-profile`, `compose-disputes`, `reconcile-disputes-flow`, `compose-admin-dashboard`, `admin-moderation`, `admin-pagination`, `application-withdrawal`, `messaging-flow-e2e`, `client-journey`, `specialist-journey`, `confirmation-dialogs`, `empty-states`, `error-scenarios`, `loading-states`, `keyboard-navigation`, `mobile-responsive`, `theme-switch`, `theme-coverage`, `accessibility-audit`, `gig-pagination`, `register-page-redesign`, `compose-auth-onboarding`, `compose-onboarding`, `auth-flow`, `auth-landing`, `auth-navigation`.
  - **DELETE-OBSOLETE-FEATURE** — tests an intentionally-removed feature. Candidates: `breadcrumb-navigation`, `back-button-navigation`, `shell-cutover` (old AppShell/SidebarNav/Topbar). Each deletion gets a one-line rationale.
  - **RE-EVALUATE-FIDELITY** — tied to the retired F2/F5/golden gates. Candidates: `fidelity`, `fidelity-gate`.
- The candidate lists above are STARTING POINTS — confirm each by reading the spec, not by name. A spec may split (some tests pass-as-is, some rewrite).

**Test Plan:**
- A four-column triage table covering ALL ~45 specs (no spec left unclassified).
- Each DELETE row carries a one-line rationale (which removed feature it covered).

---

## Task 3: Capture per-screen DOM deltas

**Implementation Notes:**
- For each rebuilt screen, record the concrete old→new assertion deltas the rewrites need, e.g.:
  - gig-detail: «Откликнуться»→«Отправить заявку», «Отправить работу»→«Сдать работу на проверку», «Отозвать отклик»→«Отозвать заявку», NO «Сообщения» chat box / no `textbox name="Сообщение"`, no breadcrumb, «Смотреть отклики (N)» kept, new «Вернуть на доработку».
  - dashboards/my-gigs/browse: the design GigCard markup, the tab chips, «Создать гиг»/«Найти новый гиг» panels, the shell header «{TITLE}» replaces in-screen titles.
  - applications/create-gig/chats/finances/settings/profile/disputes/admin: their new headings, field labels, button labels, and removed chrome.
- Ground every delta in the shipped `*Design.tsx`; cite the source label so the rewrite is mechanical.
- Note shell-level deltas that affect MANY specs: the page title now lives in the shell header («ПРОЕКТ»/«МОИ ГИГИ»/…), profile/role live in the sidebar (not a topbar), search lives in the header (`?search=`).

**Test Plan:**
- A per-screen delta list (old selector/label → new) for every REWRITE-bucket screen.
- Shell-wide deltas captured once (reused across specs).

---

## Task 4: Group the work into executable `/ralphy-plan` changes

**Implementation Notes:**
- Produce one `/ralphy-plan` change per rebuilt screen (or tight cluster, e.g. dashboards together, disputes ×4 together), plus:
  - one change for the obsolete-feature deletions,
  - one change for the fidelity re-evaluation,
  - (if Task 3 finds shared-helper needs) a first change for any E2E-helper/selector groundwork.
- Order by dependency: helper groundwork (if any) first; independent per-screen rewrites can run in parallel; obsolete deletions any time.
- Each command MUST be copy-pasteable and include: the spec(s) it covers, the concrete DOM deltas to apply, the reused harness (`setE2ESession`, seeded `test.db`, `DISABLE_RATE_LIMIT`), and a test plan = the named spec(s) green via `npm run test:e2e <file>` (or `-g`).

**Test Plan:**
- An ordered change list where every REWRITE/DELETE/RE-EVALUATE spec from Task 2 is covered by exactly one change.
- Each command is self-contained (a reviewer could run it without re-deriving the deltas).

---

## Task 5: Create the planning document with ralphy-plan commands

**Implementation Notes:**
- Create `openspec/planning/e2e-reconciliation.md` following `openspec/specs/planning/spec.md`:
  - **Problem** (2-5 sentences) — the E2E suite diverged from the reground.
  - **Why This Matters** (2-5 sentences) — restores the regression gate the UI rebuild outdated; reference project.md / the reground.
  - **Scope** — the four-bucket triage table (all ~45 specs), shell-wide deltas, dependencies, risks (slow Playwright cycle, test-db pollution).
  - **Changes** — the ordered `/ralphy-plan` commands from Task 4, each with requirements + DOM deltas + per-spec test plan.
  - **Status** — `PLANNED`, creation date `2026-06-21`, a checkbox per change, `Progress: 0/N`.
- Filename is kebab-case, no dates/versions (`e2e-reconciliation.md`).

**Test Plan:**
- The document exists at `openspec/planning/e2e-reconciliation.md` with all five required sections.
- Every `/ralphy-plan` command is copy-pasteable; changes are dependency-ordered.

---

## Task 6: Validate the planning document

**Implementation Notes:**
- Check the document against every scenario in `openspec/specs/planning/spec.md` (required sections; Problem 2-5 sentences w/o impl detail; Why references goals; Scope lists systems+deps+risks; Changes are executable+ordered; Status has state+date+checkboxes).
- Confirm ALL ~45 specs appear in the triage and each REWRITE/DELETE/RE-EVALUATE spec maps to exactly one change.
- Confirm acceptance is deterministic: the whole `npm run test:e2e` suite green (or specs deleted with rationale).

**Test Plan:**
- Checklist validation against the planning-spec scenarios (all satisfied).
- No spec unclassified; no change without a test plan; ready for the user to execute the listed `/ralphy-plan` commands.
