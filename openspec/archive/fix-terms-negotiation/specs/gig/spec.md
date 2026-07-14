# Gig — Terms Negotiation (delta)

Spec deltas for `fix-terms-negotiation`. Wires the existing (already-persisted) specialist counter-terms into the UI: an apply-form input path, counterparty (client) visibility on the applicants screen, meaningful gig-detail terms tabs, and verified lifecycle integrity. **No new model, no schema change** — counter-terms remain `Application.proposedBudget` (kopecks) / `proposedDeadlineDays`. The backend action behavior (`applyToGig` persisting proposals, `acceptApplication` adopting them) is already specified under the canonical "Apply With Proposed Terms" and "Accept Application Reconciles Proposed Terms" requirements and is unchanged; this delta adds the UI/VM surface and the lifecycle guarantees.

## ADDED Requirements

### Requirement: Apply Form Proposed-Terms Inputs
The gig-detail apply form MUST let a SPECIALIST optionally propose their own budget and deadline, wired to the existing `applyToGig` `proposedBudget`/`proposedDeadlineDays` fields. Both inputs are optional; leaving them empty MUST submit no counter (the gig's terms stand). Client-side validation MUST mirror the server rules so a valid form is not rejected after submit.

#### Scenario: Apply form renders optional budget and deadline inputs
- GIVEN a SPECIALIST viewing an OPEN, non-example gig they can apply to
- WHEN the apply form renders
- THEN it MUST include an optional budget input (roubles) and an optional deadline input (days), labelled as the specialist's own proposed terms
- AND both MUST be clearly marked optional (empty = accept the gig's terms)

#### Scenario: Submitting a counter persists proposed terms
- GIVEN a SPECIALIST fills a valid approach and questions AND enters a budget of `120000` ₽ and a deadline of `21` days
- WHEN they submit the apply form
- THEN the created application MUST persist `proposedBudget = 12000000` (kopecks) and `proposedDeadlineDays = 21`
- AND the action MUST redirect to the gig detail

#### Scenario: Empty proposed terms submit no counter
- GIVEN a SPECIALIST submits a valid application leaving both proposed-terms inputs empty
- WHEN the application is created
- THEN `proposedBudget` and `proposedDeadlineDays` MUST be `null` (no counter) and the gig's terms MUST be unchanged

#### Scenario: Invalid proposed terms are surfaced before/at submit
- GIVEN a SPECIALIST enters a non-positive budget OR a deadline outside 1–365
- WHEN they attempt to submit
- THEN the form MUST NOT create an application with those values
- AND the unmet rule MUST be communicated (client-side hint and/or the server error `Предложенный бюджет должен быть положительным числом в рублях.` / `Предложенный срок должен быть целым числом дней от 1 до 365.`)

### Requirement: Counter-Terms Visible to the Client
The client-facing applicants view MUST surface each applicant's proposed budget/deadline (when present) alongside the gig's own terms, so the client can see a counter before accepting. The applicant VM MUST expose the proposed values (or a null/absent marker) — it MUST NOT hide a counter the client is about to adopt.

#### Scenario: Applicant VM exposes proposed terms
- GIVEN an application with `proposedBudget` and/or `proposedDeadlineDays` set
- WHEN the applicants view-model (`ApplicantCardVM` via `getGigApplications`) is built
- THEN each applicant entry MUST carry the proposed budget (formatted ₽) and proposed deadline when present, and a clear "no counter" state when both are `null`

#### Scenario: The applicants screen shows the counter and the gig's terms
- GIVEN a CLIENT owner opens the applicants screen for a gig that has an applicant with a counter
- WHEN the applicant card renders
- THEN it MUST show the applicant's proposed budget/срок marked as their proposal, distinguishable from the gig's own budget/срок
- AND an applicant with no counter MUST NOT show a phantom or misleading proposed value

#### Scenario: Accepting an applicant with a counter adopts their terms
- GIVEN a CLIENT owner accepts an applicant whose `proposedBudget`/`proposedDeadlineDays` differ from the gig's
- WHEN `acceptApplication` runs
- THEN the gig's effective terms MUST update to the proposed values (budget + recomputed 10% `serviceFee`/`totalAmount`, and `deadlineDays`), consistent with the existing "Accept Application Reconciles Proposed Terms" requirement
- AND the gig detail MUST then display those adopted terms as the current terms

### Requirement: Gig-Detail Terms Tabs Reflect the Counter
The gig-detail terms panel MUST present the two-tab layout meaningfully per viewer. For a SPECIALIST, «Мои условия» MUST reflect their own submitted counter distinctly from «Условия {компания}», with an explicit state when they proposed nothing. For a CLIENT owner, the second («Мои условия») tab MUST be hidden — owners do not counter their own gig.

#### Scenario: Specialist with a counter sees differing tabs
- GIVEN a SPECIALIST whose application has a counter (proposed budget/срок differ from the gig's)
- WHEN the gig detail renders
- THEN «Условия {компания}» MUST show the gig's budget/срок and «Мои условия» MUST show the proposed budget/срок
- AND switching tabs MUST visibly change the displayed values (not a no-op)

#### Scenario: Specialist without a counter sees a clear no-counter state
- GIVEN a SPECIALIST who applied without proposing terms (or has not applied)
- WHEN they open «Мои условия»
- THEN it MUST make clear no counter was proposed (e.g. a note that their terms match the client's / that they can propose terms when applying), rather than silently showing identical numbers with no explanation

#### Scenario: Client owner does not see a redundant second tab
- GIVEN a CLIENT who owns the gig views the gig detail
- WHEN the terms panel renders
- THEN the «Мои условия» tab MUST NOT be shown; a single terms panel (the gig's current terms) MUST be presented
- AND no tab control that toggles between two identical panels MUST be rendered for the owner

### Requirement: Proposed Terms Across the Application Lifecycle
Proposed terms MUST persist and overwrite correctly across the full application lifecycle and MUST NOT bleed between gigs or specialists. This complements `fix-application-lifecycle`: reactivation on re-apply overwrites the proposed terms with the new submission (or clears them when omitted).

#### Scenario: Withdrawal preserves the proposed terms on the row
- GIVEN a PENDING application with a counter that is withdrawn (reversible `WITHDRAWN`)
- WHEN the withdrawal completes
- THEN the row MUST retain its `proposedBudget`/`proposedDeadlineDays` (the row is preserved, not deleted)

#### Scenario: Re-apply overwrites the counter with the new submission
- GIVEN a `WITHDRAWN` application (with an old counter) that is re-applied via `applyToGig`
- WHEN the new submission includes different proposed terms
- THEN the reactivated (`PENDING`) row MUST reflect the NEW proposed terms
- AND WHEN the new submission omits proposed terms, the reactivated row's `proposedBudget`/`proposedDeadlineDays` MUST be `null` (the counter is cleared, not stale-retained)

#### Scenario: Proposed terms are scoped per application row
- GIVEN specialist A has a counter on gig X and specialist B applies to gig X, and specialist A also applies to gig Y
- WHEN their applications are read
- THEN each `(gig, specialist)` application's proposed terms MUST be independent — a counter on one MUST NOT appear on another gig or another specialist's application

#### Scenario: Reject/withdraw leave the gig's terms unchanged
- GIVEN a gig whose applicant has a counter
- WHEN that application is rejected, or withdrawn, or auto-rejected because another applicant was accepted
- THEN the gig's own terms MUST change ONLY as a result of the accepted application (per reconciliation) — a non-accepted counter MUST NOT alter the gig's terms

#### Scenario: The re-apply form is pre-filled with the preserved counter
- GIVEN a specialist reversibly withdrew (`WITHDRAWN`) an application that carried a counter, and the gig detail shows the re-apply form again
- WHEN the form renders
- THEN the budget/срок inputs MUST be pre-filled with the preserved counter (roubles/days) so the «Мои условия» tab and the form agree
- AND re-submitting without changing them MUST re-send the same counter (it MUST NOT be silently dropped to the client's terms)
- AND clearing an input and re-submitting MUST clear that side of the counter (an explicit, not accidental, action)

#### Scenario: Both sides reflect a withdrawal made on a specialist's own terms
- GIVEN a specialist applied with a counter and then withdrew (first, reversible)
- WHEN the client opens the applicants screen and the specialist opens the gig detail / their dashboard
- THEN the client MUST see the application as «Отозвано» with no accept/reject affordance (the counter may still be shown), the specialist's gig detail MUST offer the apply form again (re-apply allowed), and the withdrawn application MUST appear in the specialist's dashboard archive — with the one-free-withdrawal flag consumed so the next withdrawal is final
