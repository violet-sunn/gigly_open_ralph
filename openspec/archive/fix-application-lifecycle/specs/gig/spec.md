# Gig — Application Lifecycle (delta)

Spec deltas for `fix-application-lifecycle`. Introduces the **one-free-withdrawal-per-gig** rule modeled with an explicit status (`WITHDRAWN` reversible, `WITHDRAWN_FINAL` permanent) plus a persistent server-authoritative flag `Application.freeWithdrawalUsed`, a mandatory confirmation dialog for the final withdrawal, atomic state transitions, and legible example-gig / disabled-submit states. Stored `status` values stay English; «Отозвано» is the display label for both withdrawn states.

## MODIFIED Requirements

### Requirement: Apply to Gig Server Action
The system MUST provide an `applyToGig` server action that creates an application with structured fields for technical approach, clarifying questions, and optional estimated effort. A specialist has at most one application row per gig (`@@unique([gigId, specialistId])`). Re-application is gated by **status**: a `WITHDRAWN` (reversible) application MUST be reactivated on re-apply; a `WITHDRAWN_FINAL` application MUST block re-application. Example gigs (`isExample`) MUST NOT accept applications. The reactivation MUST be performed atomically against the current status.

All previously specified scenarios remain in force EXCEPT «Duplicate application», replaced below; these scenarios are added/replaced:

#### Scenario: Duplicate active application is rejected
- GIVEN a SPECIALIST has an application to a gig with status `PENDING` or `ACCEPTED`
- WHEN `applyToGig` is called for the same gig
- THEN it MUST return an error stating the specialist has already applied
- AND no additional Application record MUST be created

#### Scenario: Re-applying after a reversible withdrawal reactivates the application
- GIVEN a SPECIALIST has an application to an OPEN gig with status `WITHDRAWN` and `freeWithdrawalUsed = true`
- WHEN `applyToGig` is called with valid approach and questions
- THEN the existing row MUST be updated in place (no new row) to `status: 'PENDING'` with the newly submitted fields
- AND `freeWithdrawalUsed` MUST be preserved (stays `true`)
- AND an owner `APPLICATION` notification MUST be created

#### Scenario: Re-applying after a final withdrawal is rejected
- GIVEN a SPECIALIST has an application to a gig with status `WITHDRAWN_FINAL`
- WHEN `applyToGig` is called for that gig
- THEN it MUST return an error stating the specialist has finally withdrawn and can no longer apply to this gig
- AND no record MUST be created or modified
- AND this MUST hold even when the call bypasses any client-side dialog (server-authoritative)

#### Scenario: Applying to an example gig is rejected
- GIVEN a gig with `isExample = true`
- WHEN `applyToGig` is called
- THEN it MUST return an error indicating the gig is a demonstration gig and applications are not accepted
- AND no Application record MUST be created or modified

## ADDED Requirements

### Requirement: Withdraw Application Server Action
The system MUST provide a `withdrawApplication` server action that lets a specialist withdraw their own `PENDING` application, preserving the row. The first withdrawal per gig is reversible (`WITHDRAWN`); the second is final (`WITHDRAWN_FINAL`). The transition MUST be atomic.

#### Scenario: First withdrawal is reversible
- GIVEN an authenticated SPECIALIST who owns a `PENDING` application with `freeWithdrawalUsed = false`
- WHEN `withdrawApplication` is called for that application
- THEN the status MUST be set to `WITHDRAWN` and `freeWithdrawalUsed` MUST be set to `true`
- AND the row MUST be preserved (not deleted)
- AND the specialist MUST be able to re-apply (reactivation per Apply to Gig)

#### Scenario: Second withdrawal is final
- GIVEN a SPECIALIST who re-applied after a first withdrawal (status `PENDING`, `freeWithdrawalUsed = true`)
- WHEN `withdrawApplication` is called again
- THEN the status MUST be set to `WITHDRAWN_FINAL`
- AND the application MUST be permanently withdrawn (re-apply rejected per Apply to Gig)

#### Scenario: Transition is atomic and guarded by current status
- GIVEN concurrent or repeated `withdrawApplication` calls for the same application
- WHEN they execute
- THEN the check-and-update MUST be atomic (transaction or a conditional update guarded by the current `PENDING` status)
- AND the application MUST NOT double-transition or land in an inconsistent state

#### Scenario: Cannot withdraw a non-pending or example application
- GIVEN an application that is not `PENDING`, or belongs to an `isExample` gig, or is not owned by the caller
- WHEN `withdrawApplication` is called
- THEN it MUST return a clear error and MUST NOT change any record

### Requirement: Withdrawal State Integrity
The one-free-withdrawal rule MUST be enforced with server-authoritative row state that cannot be reset or spoofed by the client and never bleeds across gigs or users.

#### Scenario: State is persisted per application row, server-side only
- GIVEN the withdrawal state for a `(gig, specialist)` pair
- WHEN it is read or updated
- THEN `status` and `freeWithdrawalUsed` MUST be stored on the `Application` row that is unique per `(gigId, specialistId)`
- AND they MUST NOT be derived from session, cookie, or any client-supplied value

#### Scenario: State survives session changes and is scoped
- GIVEN a specialist has withdrawn once from gig A (`WITHDRAWN`, `freeWithdrawalUsed = true`)
- WHEN the specialist logs out and back in, or refreshes the session
- THEN gig A's state MUST be unchanged
- AND the state for a different gig B, or for a different specialist on gig A, MUST be independent

#### Scenario: No client-accessible reset path
- GIVEN a specialist wants to reset their withdrawal state on a gig
- WHEN they use any specialist-facing action
- THEN there MUST be no action that deletes or resets a single application row (only the delete-account flow removes applications)

### Requirement: Gig Detail Application UI States
The gig detail screen MUST render an unambiguous application affordance for a viewing SPECIALIST across the apply, reversible-withdrawn, final-withdrawn, example, and disabled-submit states, and MUST gate the final withdrawal behind a confirmation dialog.

#### Scenario: Reversible-withdrawn shows the apply form again
- GIVEN the specialist's application status is `WITHDRAWN`
- WHEN the gig detail renders
- THEN it MUST present the apply form (re-apply allowed), not the «На рассмотрении» state

#### Scenario: Final-withdrawn keeps the gig visible with a marker
- GIVEN the specialist's application status is `WITHDRAWN_FINAL`
- WHEN the gig detail renders
- THEN the gig MUST remain visible (not removed from the feed)
- AND it MUST show a «Отозвано» marker with text that re-application is unavailable
- AND the apply control MUST be disabled/absent

#### Scenario: Final withdrawal requires confirmation
- GIVEN the specialist has an active `PENDING` application with `freeWithdrawalUsed = true` (the next withdrawal would be final)
- WHEN the specialist activates the withdraw control
- THEN a confirmation dialog MUST appear warning that re-application will no longer be possible
- AND it MUST offer a confirm action and a dismiss action («Не отменять»)
- AND `withdrawApplication` MUST run ONLY if confirm is chosen; dismiss MUST leave the application `PENDING`

#### Scenario: First withdrawal does not require the final-warning dialog
- GIVEN the specialist has an active `PENDING` application with `freeWithdrawalUsed = false`
- WHEN the specialist activates the withdraw control
- THEN the final-warning dialog MUST NOT be required (a light confirm or immediate withdrawal is acceptable, since it is reversible)

#### Scenario: Example gig shows a demonstration notice
- GIVEN a SPECIALIST opens a gig with `isExample = true`
- WHEN the gig detail renders
- THEN it MUST show a notice that the gig is a demonstration and does not accept applications, with a link to `/gigs`
- AND it MUST NOT render an apply form or a phantom apply button

#### Scenario: Disabled submit surfaces the unmet minimum
- GIVEN a SPECIALIST is filling the apply form on an OPEN, non-example gig
- AND the approach is shorter than 100 characters OR the questions are shorter than 50 characters
- WHEN the form renders
- THEN «Отправить заявку» MUST be visibly disabled
- AND the live requirement hint MUST emphasize the unmet rule(s) with current counts
- AND once both minimums are met, the emphasis MUST clear and the button MUST enable and submit
