# Gig — Spec Delta (apply-terms-lock)

> This change fixes a **violation of an existing requirement**, it does not invent one. The canonical
> "Gig-Detail Terms Tabs Reflect the Counter" (`openspec/specs/gig/spec.md:1199`) already demands that «Мои условия»
> reflect the specialist's counter *distinctly*, with an explicit state when nothing was proposed. The VM's
> `?? gig.budget` fallback breaks that. The MODIFIED version below tightens the wording so the defect cannot
> re-enter: it is not enough to *explain* the identical numbers — the numbers themselves MUST NOT be the client's.

## MODIFIED Requirements

### Requirement: Gig-Detail Terms Tabs Reflect the Counter
The gig-detail terms panel MUST present the two-tab layout meaningfully per viewer. For a SPECIALIST, «Мои условия» MUST reflect **their own** terms — a submitted counter, or the counter they are currently composing in the apply form — distinctly from «Условия {компания}», and MUST show an explicit "not proposed" state rather than the gig's own figures when no counter exists. The «Условия {компания}» tab MUST remain the fixed, read-only reference (the gig's own budget/срок). For a CLIENT owner, the second («Мои условия») tab MUST be hidden — owners do not counter their own gig.

#### Scenario: Specialist with a counter sees differing tabs
- GIVEN a SPECIALIST whose application has a counter (proposed budget/срок differ from the gig's)
- WHEN the gig detail renders
- THEN «Условия {компания}» MUST show the gig's budget/срок and «Мои условия» MUST show the proposed budget/срок
- AND switching tabs MUST visibly change the displayed values (not a no-op)

#### Scenario: Without a counter, «Мои условия» MUST NOT display the client's figures
- GIVEN a SPECIALIST who has not proposed terms (has not applied, or applied without a counter)
- WHEN they open «Мои условия»
- THEN the budget/срок rows MUST render an explicit not-proposed state (e.g. «— не предложено»)
- AND they MUST NOT render the gig's own budget/срок values, which would make the tab indistinguishable from «Условия {компания}»
- AND an accompanying note MUST explain that the client's terms apply («действуют условия заказчика»)
- AND this MUST hold per field: proposing only a budget MUST show the proposed budget AND a not-proposed срок — a half-counter MUST NOT be completed with the gig's value

#### Scenario: The tab reflects terms being typed in the apply form
- GIVEN a SPECIALIST on an OPEN gig with the apply form visible
- WHEN they type a budget and/or срок into the «Мои условия» inputs of the apply form
- THEN the «Мои условия» tab MUST reflect those values immediately, before submission
- AND clearing an input MUST return that field to the not-proposed state
- AND this MUST NOT alter what is submitted: the values still reach `applyToGig` as the optional `proposedBudget`/`proposedDeadlineDays`, and empty still means "apply on the client's terms"

#### Scenario: The client tab stays a fixed reference
- GIVEN any SPECIALIST viewer, with or without a counter, typing or not
- WHEN «Условия {компания}» is selected
- THEN it MUST always show the gig's own budget/срок unchanged
- AND it MUST contain no inputs — it is a reference, not an editable copy

#### Scenario: Client owner does not see a redundant second tab
- GIVEN a CLIENT who owns the gig views the gig detail
- WHEN the terms panel renders
- THEN the «Мои условия» tab MUST NOT be shown; a single terms panel (the gig's current terms) MUST be presented
- AND no tab control that toggles between two identical panels MUST be rendered for the owner

**Acceptance Criteria:**
- The gig-detail VM (`lib/view-models.ts`) builds the proposed-terms figures from the viewer's application **only** — no `?? gig.budget` / `?? gig.deadlineDays` fallback
- `ConditionsTermsVM.budget` / `.deadline` admit an absent state (null) so "not proposed" is representable rather than approximated
- The apply form's proposed budget/срок state is readable by the terms panel (both already render inside `GigDetail`), so the tab can reflect in-progress input
- `applyToGig` is unchanged; the counter remains optional and empty still submits no counter
- The re-apply pre-fill specified in "Proposed Terms Across the Application Lifecycle" (`:1243-1248`) is **unchanged** — this change MUST NOT clear the pre-filled counter
