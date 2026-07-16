# UI — Spec Delta (raise-service-fee-and-reconcile-create-gig)

> Two things: (1) the service fee rises to **17.5%**, so every fee mention in the UI spec moves off 10%/20%; and
> (2) the stale create-gig requirements are reconciled to the shipped guided brief. The fee rate itself is owned by
> the gig spec's "Service Fee Rate Is a Single Source of Truth"; the UI requirements below just render «17,5%» and the
> derived figures.

## MODIFIED Requirements

### Requirement: Gig Creation Form
The system MUST provide a form at `/gigs/new` for CLIENT users to create gigs. The live screen is the re-grounded `CreateGigDesign.tsx` on the `gigly_full_design` skin, governed in detail by «Gig Creation Screen Is the Guided Brief» and its companion requirements; this requirement fixes the field, validation, fee, and access contract. All on-screen text MUST be Russian.

> Reconciled here. The previous version described the pre-reground English kit form and was wrong on three shipped
> facts: it listed `goal`/`deliverables` as optional (they are **required** — C1), quoted the service fee as **20%**
> (now **17.5%**), and specced "X / 1000 characters" kit counters that do not exist. Those scenarios are corrected or
> removed below; the counter behaviour is owned by «Localized Live Character Counters on Gig Create/Edit», the fee rate
> by the gig spec «Service Fee Rate Is a Single Source of Truth», and the validation by «Create Gig Server Action» /
> «Shared Server-Authoritative Gig Validator (parseGigForm SSOT)».

#### Scenario: Form renders for CLIENT user
- GIVEN an authenticated user with role "CLIENT"
- WHEN they navigate to `/gigs/new`
- THEN the page MUST display the guided-brief form containing, at minimum:
  - Title input (required)
  - Category selector (required)
  - Description textarea (required, ≥20 characters)
  - Acceptance-criteria editor (required, ≥50 characters combined)
  - Goal textarea (**required**)
  - Deliverables textarea (**required**)
  - Constraints textarea (optional)
  - Budget input (required, in roubles)
  - Deadline input (required)
  - Tags input (optional)
  - A live fee preview showing budget, service fee (**17,5%**), and total
  - A publish action

#### Scenario: Goal and deliverables are required
- GIVEN a CLIENT on the gig creation form
- WHEN the page renders
- THEN `goal` and `deliverables` MUST be required — the server's `parseGigForm` rejects them empty (see the gig spec «Create Gig Server Action» / «Shared Server-Authoritative Gig Validator»)
- AND `constraints` MUST remain optional
- AND the readiness checklist MUST reflect goal and deliverables as required checks
- AND the form MUST NOT present them under an "optional" grouping

#### Scenario: Live fee calculation preview is 17.5%
- GIVEN a CLIENT on the gig creation form
- WHEN they enter a budget (e.g. 100000)
- THEN the form MUST display live: Бюджет «100 000 ₽», Сервисный сбор (17,5%) «17 500 ₽», Итого «117 500 ₽»
- AND the fee MUST equal `floor(budget × SERVICE_FEE_RATE)` (0.175), matching the value the server persists
- AND the preview MUST NOT quote a 10% or 20% fee

#### Scenario: Character counters are Russian and token-based
- GIVEN a CLIENT typing in the description or acceptance-criteria fields
- WHEN a counter renders
- THEN it MUST show progress to the minimum in Russian (per «Localized Live Character Counters on Gig Create/Edit»)
- AND the form MUST NOT render the pre-reground kit counters («X / 1000 characters», `text-gray-600` / `text-orange-600`) on goal / deliverables / constraints — that behaviour does not exist on the live screen

#### Scenario: Validation is server-authoritative
- GIVEN a submission that fails a rule (short description, empty goal or deliverables, short criteria, non-positive budget, or out-of-range deadline)
- WHEN it is submitted
- THEN the server action MUST reject it and the error MUST be displayed inline
- AND the client readiness checklist MUST mirror — never replace — `parseGigForm`

#### Scenario: Non-CLIENT user visits gig creation page
- GIVEN an authenticated user with role "SPECIALIST"
- WHEN they navigate to `/gigs/new`
- THEN they MUST be redirected to `/dashboard`

#### Scenario: Unauthenticated user visits gig creation page
- GIVEN no valid session
- WHEN a user navigates to `/gigs/new`
- THEN they MUST be redirected to `/login` (handled by existing middleware)

**Acceptance Criteria:**
- The live form is the re-grounded `CreateGigDesign.tsx` on the `gigly_full_design` skin, wired to `createGig` via `useActionState`
- `goal` and `deliverables` are required; `constraints` optional — consistent with the gig spec
- Service fee is 17.5% everywhere it appears; no "10%" or "20%" remains in this requirement
- Counter behaviour defers to «Localized Live Character Counters on Gig Create/Edit»; no "X / 1000 characters" kit counters
- Access-control and server-authoritative-validation scenarios are preserved

### Requirement: Live Fee Panel
The right panel MUST render a **«Сводка (комиссия)»** fee panel showing **Бюджет**, **Сервисный сбор (17,5%)**, and **Итого к оплате** (budget + 17.5%), computed **live** from the budget input using the same rate the server applies (`SERVICE_FEE_RATE = 0.175`), plus the «Опубликовать гиг» action.

#### Scenario: The fee updates live and matches the server
- GIVEN a budget entered in roubles
- WHEN it changes
- THEN the panel MUST show Сервисный сбор = `floor(budget × 0.175)` and Итого = budget + fee
- AND the percent label MUST read «17,5%», sourced from `SERVICE_FEE_PCT_LABEL`
- AND on publish the created gig's `serviceFee` / `totalAmount` MUST equal those figures

## REMOVED Requirements

### Requirement: Gig Creation Form Visual Sections
**Removed. Note: this requirement name is defined TWICE in the canonical spec — the archive step MUST delete BOTH blocks.**

- **Instance A** (the gray-kit form): English "Basic Information / Requirements & Success Criteria / Budget & Details" sections, `bg-gray-50` / `border-gray-200`, an examples link "💡 View example gigs for inspiration" (`text-indigo-600`) pointing at `/gigs`, and `goal`/`deliverables` as optional textareas.
- **Instance B** (the navy token-migration duplicate): the same requirement title re-defined with `bg-surface-level-1` / `bg-navy-800` styling, the route `/dashboard/gigs/new`, and English "Posting…".

Both describe skins that no longer exist. The live `/gigs/new` is the inline-styled `gigly_full_design` guided brief, whose sections, styling, fee panel, readiness meter, and criteria editor are fully owned by «Gig Creation Screen Is the Guided Brief», «Readiness Meter», «Live Fee Panel», «"Готово, когда…" Criteria Editor», and «Create Gig Reconciled To Reference». Removing Instance B also resolves the duplicate-name invalidity.
