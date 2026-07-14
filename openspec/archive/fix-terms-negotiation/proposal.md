# Fix Terms Negotiation (wire the «Мои условия» counter-terms flow)

**Change:** `fix-terms-negotiation`
**Created:** 2026-07-14
**Status:** IMPLEMENTED (2026-07-14) — verified via integration (terms-negotiation 17/17 incl. 6 new lifecycle/VM tests; withdraw-with-counter cross-cutting 1/1; gig/application suite 84/84) + live E2E (terms-negotiation.spec.ts 4/4 + application-withdrawal 4/4). Includes a follow-up fix: the re-apply form is pre-filled with the preserved counter so a blank re-submit no longer silently drops the specialist's terms (surfaced by the withdraw-with-counter cross-cutting check).
**Planning:** `openspec/planning/prod-feedback-fixes.md` (Change 2)

## Why

Stress-testing surfaced that the «Мои условия» counter-terms tab on the gig detail is **dead**: switching «Условия {компания} ↔ Мои условия» appears to do nothing on every real (non-example) gig. Investigation shows the data model and backend are **already fully wired** — the failure is a missing UI path plus a counterparty-visibility gap, not a missing feature:

- **Model:** counter-terms live on the `Application` row — `proposedBudget Int?` (kopecks) and `proposedDeadlineDays Int?`. There is **no separate `Proposal` model**.
- **Backend already works:** `applyToGig` accepts, validates, and persists `proposedBudget`/`proposedDeadlineDays` (`gig.ts:174–190, 234–235, 277–278`); `acceptApplication` **already reconciles** the accepted application's proposed terms onto the gig — `gig.budget` + recomputed 10% `serviceFee`/`totalAmount` and `gig.deadlineDays` (`gig.ts:370–404`); the gig-detail VM's «Мои условия» tab reads `myApp?.proposedBudget ?? gig.budget` (`view-models.ts:673–694`).
- **Root cause #1 — no way to propose:** the apply form (`GigDetail.tsx` `ApplyBlock`) renders only approach/questions/effort — it has **no budget/срок inputs**. So `proposedBudget`/`proposedDeadlineDays` are always `null`, «Мои условия» always equals «Условия {компания}», and the tab toggle looks like a no-op.
- **Root cause #2 — client can't see the counter:** the applicants VM `ApplicantCardVM` (`view-models.ts:541–557`, rendered by `applications/ApplicationsDesign.tsx`) omits the proposed terms, so a client accepts **blind** to any counter — even though accepting silently adopts it.
- **Root cause #3 — owner no-op tab:** a CLIENT viewing their own gig sees a «Мои условия» tab identical to «Условия {компания}» (they have no `myApp`), which reads as broken.

**Decision (confirmed with user):** keep the existing **one-way** model — a specialist proposes a counter once (at apply time), the client sees it and accepting adopts it. No client counter-back, no new negotiation model (project.md: «❌ Not a bidding platform (fixed-price gigs)»). Re-proposing is done only via the existing **withdraw → re-apply** flow (reactivation overwrites the proposed terms), and this change MUST verify that path is correct across every lifecycle stage. The owner's redundant 2nd tab is hidden.

## What Changes

1. **Apply form gets proposed-terms inputs.** `ApplyBlock` renders optional «Ваш бюджет, ₽» and «Ваш срок, дней» inputs, wired to the already-supported `applyToGig` fields (`proposedBudget` roubles→kopecks, `proposedDeadlineDays` 1–365). Empty = no counter (unchanged behaviour). Client-side validation mirrors the server so the user is not bounced after submit.
2. **Counter surfaced to the client.** `ApplicantCardVM` + the applicants screen show each applicant's proposed budget/срок next to the gig's, with a clear «предложил свои условия» marker, so the client sees the counter **before** accepting. Accepting continues to adopt it (already coded).
3. **Terms tabs made meaningful.** For a SPECIALIST: «Мои условия» shows their submitted counter distinctly from «Условия {компания}», and a clear "no counter" state when they proposed nothing. For a CLIENT owner: the 2nd tab is **hidden** (single terms panel).
4. **Lifecycle integrity (explicit).** Verify proposed terms persist/overwrite correctly through apply → withdraw (preserved on the row) → re-apply reactivation (overwritten by the new submission, or cleared if omitted) → 2nd/final withdraw, never bleed across gigs/specialists, and that accept-adopts + auto-reject still hold. This dovetails with the just-shipped `fix-application-lifecycle` reactivation path.

## Non-goals / Constraints

- **No new model, no schema change.** Reuse `Application.proposedBudget`/`proposedDeadlineDays`. Keep the 10% fee recompute on accept.
- **No client counter-back / no negotiation thread** (out of scope; against the fixed-price positioning). Client action stays accept/reject.
- **No standalone «update terms» action** — re-proposing is via withdraw → re-apply only.
- No redesign: reuse the existing `GigDetail.tsx` terms panel + apply form markup, tokens, and the applicants screen.
- Example gigs remain non-apply-able (no terms UI there).

## Verification

Verified live (not only tests) on a normal gig: a specialist opens a gig, enters a counter budget/срок in the apply form, submits; «Мои условия» now differs from «Условия {компания}» and the toggle visibly swaps values; the client opens the applicants list and sees the specialist's counter; the client accepts and the gig's effective terms (budget, fee, total, срок) update to the proposed values; a specialist who proposes nothing sees «Мои условия» == gig terms with a clear note; a CLIENT owner sees no 2nd tab. Lifecycle: withdraw → re-apply with different terms overwrites the counter; re-apply with no terms clears it; state never bleeds across gigs/specialists.
