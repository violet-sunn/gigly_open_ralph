# Gig — Spec Deltas (withdrawn-status-truthfulness)

## MODIFIED Requirements

### Requirement: Gig Detail Application UI States
The gig detail screen MUST render an unambiguous application affordance for a viewing SPECIALIST across the apply, reversible-withdrawn, final-withdrawn, example, and disabled-submit states, and MUST gate the final withdrawal behind a confirmation dialog. For the reversible-withdrawn state, the screen MUST also present a per-viewer withdrawn signal that is visually distinct from the gig's derived stage badge, so the viewer's own status is never conflated with the gig-level «На рассмотрении».

#### Scenario: Reversible-withdrawn shows a per-viewer withdrawn signal plus the apply form
- GIVEN the viewing specialist's own application status is `WITHDRAWN`
- WHEN the gig detail renders
- THEN it MUST show a clear per-viewer signal that this specialist withdrew their application (e.g. «Вы отозвали отклик»)
- AND it MUST present the re-apply affordance (the apply form), re-application allowed
- AND this per-viewer signal MUST be visually distinct from the gig's derived stage badge (which may read «На рассмотрении» when the OPEN gig has other applicants)
- AND it MUST NOT read as the bare gig-level «На рассмотрении» state with no viewer-specific context

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

#### Scenario: Re-applying from the withdrawn state returns to the pending state
- GIVEN the viewing specialist's own application status is `WITHDRAWN` and the per-viewer withdrawn signal is shown
- WHEN the specialist re-submits the apply form
- THEN the application MUST reactivate to `PENDING` (per Apply to Gig)
- AND the gig detail MUST no longer show the «Вы отозвали отклик» signal, presenting the applied/«На рассмотрении» state instead

## ADDED Requirements

### Requirement: Specialist Dashboard Archived-Card Status Labels
The specialist dashboard («Мои гиги») Archive tab MUST label each terminal application state truthfully rather than collapsing all terminal states into a single «Отклонён» badge. A withdrawn application MUST NOT read as rejected.

#### Scenario: Withdrawn application reads «Отозвано»
- GIVEN a SPECIALIST has an application with status `WITHDRAWN`
- WHEN the specialist dashboard archived card renders
- THEN the card status MUST read «Отозвано»
- AND it MUST NOT read «Отклонён»

#### Scenario: Finally-withdrawn application reads «Отозвано (окончательно)»
- GIVEN a SPECIALIST has an application with status `WITHDRAWN_FINAL`
- WHEN the specialist dashboard archived card renders
- THEN the card status MUST read «Отозвано (окончательно)»
- AND it MUST NOT read «Отклонён»

#### Scenario: Rejected application still reads «Отклонён»
- GIVEN a SPECIALIST has an application with status `REJECTED`
- WHEN the specialist dashboard archived card renders
- THEN the card status MUST read «Отклонён» (red tone), unchanged from prior behaviour

#### Scenario: All terminal states remain in the Archive tab
- GIVEN a SPECIALIST has archived applications in mixed terminal states (`REJECTED`, `WITHDRAWN`, `WITHDRAWN_FINAL`)
- WHEN the dashboard renders
- THEN every such application MUST still appear under the Archive tab (no card is dropped)
- AND each MUST carry its own truthful status label per the scenarios above
