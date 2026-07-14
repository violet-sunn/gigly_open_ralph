# Tasks — fix-terms-negotiation

Ordered checklist. Each task lists implementation notes and a test plan. Reuse the already-wired backend (`applyToGig` persists proposals; `acceptApplication` adopts them) — this change is UI/VM wiring + counterparty visibility + lifecycle verification. **No schema change.** Verify live (Task 7).

## 1. Reproduce and pin the dead feature
- [x] Reproduce on a normal gig: switch «Условия {компания} ↔ Мои условия» → nothing changes; confirm the apply form has no budget/срок inputs; confirm the client's applicants screen shows no counter; confirm a CLIENT owner sees a redundant 2nd tab.
- **Test plan:** capture current (wrong) behaviour in a scratch note. Confirm via code that `applyToGig`/`acceptApplication` already handle proposed terms (so the gap is UI/VM only). No assertion yet.

## 2. Apply form: proposed-terms inputs (Спец side)
- [x] In `app/(protected)/gigs/[id]/GigDetail.tsx` `ApplyBlock`, add two optional inputs — «Ваш бюджет, ₽» (`name="proposedBudget"`, roubles) and «Ваш срок, дней» (`name="proposedDeadlineDays"`, integer) — inside the existing apply `<form action={applyAction}>`. Mark both optional. Do NOT change the existing approach/questions/effort gating.
- [x] Mirror the server rules client-side for a legible hint (budget > 0; deadline integer 1–365) — but the submit gate stays driven by approach≥100 / questions≥50 (proposed terms are optional and empty is valid).
- [x] Names/units MUST match `applyToGig`: `proposedBudget` in **roubles** (server does `Math.round(r*100)` → kopecks), `proposedDeadlineDays` 1–365. No action change needed.
- **Implementation note:** the reactivation path in `applyToGig` (fix-application-lifecycle) already writes `proposedBudget`/`proposedDeadlineDays` from the form on re-apply — so wiring the inputs also fixes re-proposing for free. Verify in Task 6.
- **Test plan:** integration — `applyToGig` with `proposedBudget=120000`, `proposedDeadlineDays=21` persists `12000000`/`21`; empty inputs → `null`/`null`; invalid budget/deadline → error, no application. (Most already covered by the archived "Apply With Proposed Terms" tests — extend/keep green.)

## 3. Terms tabs: meaningful per viewer (gig detail)
- [x] In `GigDetail.tsx`, hide the «Мои условия» tab (and the tab toggle) for a CLIENT **owner** (`data.isOwner`) — render a single terms panel (the gig's current terms). Keep both tabs for a SPECIALIST viewer.
- [x] For a SPECIALIST on «Мои условия»: when they have a counter, show the proposed срок/бюджет (already read by the VM via `proposedBudget ?? gig.budget`); when they have **no** counter (or have not applied), show a clear note that no counter was proposed / their terms match the client's (avoid silently identical numbers).
- [x] Expose whatever the VM needs to distinguish "has counter" from "fallback" — e.g. surface `viewerApplication.proposedBudget`/`proposedDeadlineDays` (or a boolean `hasCounter`) from `getGigDetail` so the UI can render the no-counter note without guessing from equality.
- **Test plan:** integration (VM) — for a specialist with a counter, `getGigDetail` reports differing proposed vs client terms + `hasCounter=true`; without a counter, `hasCounter=false` and proposed falls back to client terms; for an owner, the VM/flagging supports hiding the 2nd tab. E2E in Task 7.

## 4. Surface the counter to the client (applicants screen)
- [x] In `lib/view-models.ts` extend `ApplicantCardVM` + `getGigApplications` (line ~541) to include the applicant's `proposedBudget` (formatted ₽) and `proposedDeadlineDays` when present, plus a null/absent marker.
- [x] In `app/(protected)/gigs/[id]/applications/ApplicationsDesign.tsx`, render each applicant's proposed budget/срок marked as **their** proposal, distinguishable from the gig's terms; applicants with no counter show no phantom value.
- [x] Keep the accept action unchanged (it already adopts the counter). Optionally show, near the Accept button, that accepting will adopt the proposed terms.
- **Test plan:** integration — `getGigApplications` returns proposed budget/срок for a countered applicant and a clear absent state otherwise; `acceptApplication` on a countered applicant sets `gig.budget` + 10% `serviceFee`/`totalAmount` + `deadlineDays` (existing "Accept Reconciles" tests stay green).

## 5. Effective-terms display after accept
- [x] Confirm the gig-detail current-terms panel (and conditions/header) reflect the **adopted** terms after accept (they read from `gig.*`, which reconciliation updates) — no code change expected; add coverage.
- **Test plan:** integration — after accepting a countered applicant, `getGigDetail` header/conditions/terms show the proposed budget/срок as the gig's current terms; the fee breakdown (owner) uses the recomputed `serviceFee`/`totalAmount`.

## 6. Lifecycle integrity (explicit — user-requested extra care)
- [x] Verify proposed terms across every stage, dovetailing with `fix-application-lifecycle`:
  - apply with counter → PENDING carries the counter;
  - withdraw (reversible `WITHDRAWN`) → row **preserves** the counter;
  - re-apply with **different** terms → reactivated PENDING reflects the **new** counter (overwrite);
  - re-apply with **no** terms → reactivated PENDING has `proposedBudget`/`proposedDeadlineDays` = `null` (cleared, not stale);
  - 2nd/final withdraw (`WITHDRAWN_FINAL`) → row preserved, no re-apply;
  - scoping — a counter on `(A, gigX)` MUST NOT appear on `(B, gigX)` or `(A, gigY)`;
  - reject / auto-reject-on-accept → the gig's terms change ONLY from the accepted application.
- **Implementation note:** the reactivation `updateMany` in `applyToGig` sets `proposedBudget`/`proposedDeadlineDays` from the new submission — confirm it writes `null` when the fields are omitted (not "leave as-is"), so a cleared counter really clears.
- **Test plan:** integration — a dedicated `terms-negotiation-lifecycle` spec covering each bullet; assert exact `proposedBudget`/`proposedDeadlineDays` at each transition and that the gig's terms only move on accept.

## 7. E2E + live verification
- [x] E2E (`__tests__/e2e/`): on a normal gig — specialist enters a counter budget/срок → submits → «Мои условия» differs from «Условия {компания}» and the toggle visibly swaps values; a client opens the applicants screen and sees the specialist's counter; client accepts → gig detail shows the adopted terms; a specialist who proposes nothing sees the no-counter note; a CLIENT owner sees no 2nd tab.
- [x] E2E lifecycle: withdraw → re-apply with different terms → «Мои условия» reflects the new counter; re-apply with no terms → counter cleared. (Kill any stale `:3000` dev server first so Playwright spawns fresh code.)
- [x] **Live check (required):** full walkthrough of the Verification section in `proposal.md` on a real user-created gig; confirm nothing is a no-op.
- **Test plan:** touched integration + E2E green; live walkthrough matches; `openspec` spec validation (every Requirement has ≥1 Scenario).

**Progress:** 7/7 tasks completed
