# UI — Spec Delta (gig-validation-ssot)

> Reconciliation note: these ADDED requirements govern the **re-grounded** gig create/edit screens
> (`CreateGigDesign.tsx` / `EditGigDesign.tsx`, `gigly_full_design` skin). They supersede the
> pre-reground, English-format character-counter scenarios under the existing "Gig Creation Form"
> requirement (e.g. `"X / 50 characters (minimum)"`, `text-red-600`/`text-gray-600`, `app/gigs/new/page.tsx`),
> which described the old kit. The archive step MUST reconcile the counter scenarios in "Gig Creation Form"
> to the localized behavior below.

## ADDED Requirements

### Requirement: Localized Live Character Counters on Gig Create/Edit
The re-grounded gig create and edit forms MUST render a live, **Russian-localized** character counter on the description and acceptance-criteria fields (and on any field with a maximum), so the user always sees their progress against the minimum/maximum. The counter component (`character-counter.tsx`) MUST be rendered (it currently exists but is unused) and its text MUST be Russian.

#### Scenario: Description counter shows progress to the minimum
- GIVEN a CLIENT user typing in the description field on `/gigs/new` (or the edit form)
- WHEN the value is shorter than 20 characters (trimmed)
- THEN a live counter MUST display the current count against the 20-character minimum, in Russian (e.g. «12 / 20 символов»)
- AND the counter MUST update on every keystroke
- AND the counter MUST visually signal "not yet met" (e.g. a warning color) until the minimum is reached

#### Scenario: Criteria counter shows progress to the minimum
- GIVEN a CLIENT user editing acceptance criteria
- WHEN the combined committed criteria text is shorter than 50 characters (trimmed)
- THEN a live counter MUST display the current count against the 50-character minimum, in Russian (e.g. «34 / 50 символов»)
- AND it MUST update as criteria are added or removed

#### Scenario: Counter is accessible
- GIVEN a screen-reader user on the form
- WHEN a counter updates
- THEN the counter element MUST have `aria-live="polite"` and a descriptive Russian `aria-label` or visible text

#### Scenario: Counter does not replace server validation
- GIVEN a submission with a sub-minimum field
- WHEN the form is submitted
- THEN the server MUST still reject it (the counter is advisory only, not a substitute for `parseGigForm`)

### Requirement: Legible "Why Submit Is Disabled" Guidance
The re-grounded gig create/edit form MUST tell the user **why** the submit control is unavailable and **what remains**, rather than showing a bare disabled button with a vague hint. The guidance MUST be in Russian and name the specific unmet requirement(s) and the shortfall.

#### Scenario: Short description explains the shortfall
- GIVEN a CLIENT user whose description is 12 characters (below the 20 minimum) and all else valid
- WHEN they view the submit area
- THEN the button MUST be disabled AND a Russian message MUST state the unmet requirement and remaining amount (e.g. «Описание: ещё 8 символов»)
- AND once the description reaches 20 characters, the message MUST clear and the button MUST enable

#### Scenario: Multiple unmet requirements are surfaced
- GIVEN a CLIENT user with more than one unmet requirement (e.g. empty goal AND short criteria)
- WHEN they view the readiness area
- THEN the guidance MUST make clear which requirements are still unmet (not merely the first), so the user can complete the brief

### Requirement: Custom Acceptance Criteria Always Count
The re-grounded gig create/edit form MUST ensure that acceptance criteria the user **types themselves** count toward readiness and are persisted, not only criteria picked from suggested chips. Pending text in the custom-criteria input MUST NOT be silently dropped.

#### Scenario: Typed-but-not-committed criteria still count on submit
- GIVEN a CLIENT user who typed a custom criterion into the criteria input but did not press Enter or «Добавить»
- WHEN they submit the form
- THEN the pending input text MUST be auto-committed into the criteria set before validation
- AND if the resulting combined criteria are ≥ 50 characters, the gig MUST be creatable (the readiness check MUST NOT stay unmet solely because the text was uncommitted)

#### Scenario: A hint prompts committing custom criteria
- GIVEN a CLIENT user with non-empty text in the custom-criteria input that has not been added
- WHEN they view the criteria field
- THEN a Russian hint MUST prompt them to add it (e.g. «нажмите Добавить»), so the commit step is discoverable

#### Scenario: Custom-only criteria can satisfy the minimum
- GIVEN a CLIENT user who adds only their own custom criteria (no suggested chips) totalling ≥ 50 characters
- WHEN they submit
- THEN the criteria readiness MUST be satisfied and the gig MUST be creatable

### Requirement: Edit Form Readiness Parity
The gig **edit** form (`EditGigDesign.tsx`) MUST present the same readiness affordances (localized counters, why-disabled guidance, custom-criteria handling) as the create form, so a user cannot edit a gig into a state that creation would reject and always sees the same feedback.

#### Scenario: Edit form mirrors create readiness
- GIVEN the owning CLIENT editing an `OPEN` gig
- WHEN a field is below its minimum (e.g. description < 20, criteria < 50, empty goal/deliverables)
- THEN the edit form MUST show the same localized counter + why-disabled guidance as create
- AND submitting anyway MUST be rejected by the server (`updateGig` → `parseGigForm`)
