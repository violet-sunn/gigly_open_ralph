# Gig — Spec Delta (gig-validation-ssot)

## MODIFIED Requirements

### Requirement: Create Gig Server Action
The system MUST provide a `createGig` server action that creates a gig for the authenticated CLIENT user. Validation MUST be **server-authoritative** (the source of truth for field minimums, independent of any client-side gating) and all validation error messages MUST be in **Russian**. The required content fields are `title`, `description` (≥ 20 chars, trimmed), `acceptanceCriteria` (≥ 50 chars, trimmed), `goal` (non-empty, trimmed), `deliverables` (non-empty, trimmed), and a positive `budget`. Only `constraints` remains optional.

#### Scenario: Successful gig creation
- GIVEN an authenticated user with role "CLIENT"
- WHEN `createGig` is called with a valid title, description (≥20 chars), acceptanceCriteria (≥50 chars), goal (non-empty), deliverables (non-empty), budget (in roubles), tags, AND optional constraints
- THEN a Gig record MUST be created with:
  - `budget` = input budget converted to kopecks (× 100)
  - `serviceFee` = budget × 0.10
  - `totalAmount` = budget + serviceFee
  - `status` = "OPEN"
  - `clientId` = session userId
  - `acceptanceCriteria`, `goal`, `deliverables` = inputs (trimmed)
  - `constraints` = input constraints (trimmed) or empty string if not provided
- AND the action MUST redirect to `/dashboard`

#### Scenario: Non-CLIENT user attempts gig creation
- GIVEN an authenticated user with role "SPECIALIST"
- WHEN `createGig` is called
- THEN it MUST return an error `{ error: <Russian message that only clients can create gigs> }`
- AND no Gig record MUST be created

#### Scenario: Unauthenticated user attempts gig creation
- GIVEN no valid session
- WHEN `createGig` is called
- THEN it MUST redirect to `/login`

#### Scenario: Missing required fields
- GIVEN a CLIENT user submits a gig form with empty title, description, or acceptanceCriteria
- WHEN `createGig` is called
- THEN it MUST return an error `{ error: <Russian message naming the missing required fields> }`
- AND no Gig record MUST be created

#### Scenario: Description too short
- GIVEN a CLIENT user submits a gig form with description shorter than 20 characters (after trimming)
- WHEN `createGig` is called
- THEN it MUST return an error `{ error: <Russian message stating the description minimum of 20 characters> }`
- AND no Gig record MUST be created

#### Scenario: Acceptance criteria too short
- GIVEN a CLIENT user submits a gig form with acceptanceCriteria shorter than 50 characters (after trimming)
- WHEN `createGig` is called
- THEN it MUST return an error `{ error: <Russian message stating the criteria minimum of 50 characters> }`
- AND no Gig record MUST be created

#### Scenario: Missing goal
- GIVEN a CLIENT user submits a gig form with an empty goal (after trimming)
- WHEN `createGig` is called
- THEN it MUST return an error `{ error: <Russian message that the goal is required> }`
- AND no Gig record MUST be created

#### Scenario: Missing deliverables
- GIVEN a CLIENT user submits a gig form with empty deliverables (after trimming)
- WHEN `createGig` is called
- THEN it MUST return an error `{ error: <Russian message that the expected result / deliverables are required> }`
- AND no Gig record MUST be created

#### Scenario: Invalid budget
- GIVEN a CLIENT user submits a gig form with budget <= 0 or non-numeric
- WHEN `createGig` is called
- THEN it MUST return an error `{ error: <Russian message that budget must be a positive number> }`

#### Scenario: Constraints remain optional
- GIVEN a CLIENT user submits an otherwise-valid gig with no constraints
- WHEN `createGig` is called
- THEN a Gig record MUST be created successfully
- AND `constraints` MUST default to empty string ("")

#### Scenario: Fields are trimmed
- GIVEN a CLIENT user provides description, criteria, goal, deliverables, or constraints with leading/trailing whitespace
- WHEN `createGig` is called
- THEN each field MUST be trimmed before validation and storage
- AND whitespace-only values MUST be treated as empty for the required-field and minimum-length checks

**Acceptance Criteria:**
- `createGig` is exported from `app/actions/gig.ts` with `'use server'`
- All field minimums are enforced inside the shared `parseGigForm` validator (see the SSOT requirement below), not in the UI
- Signature is `(prevState: { error?: string } | null, formData: FormData)` (useActionState-compatible)
- description minimum length: 20 characters (after trimming); acceptanceCriteria minimum length: 50 characters (after trimming)
- `goal` and `deliverables` are required (non-empty after trimming); `constraints` is optional and defaults to ""
- All validation error messages are in Russian
- Budget input is in roubles (user-facing), stored in kopecks (DB); service fee is 10% of budget
- On success: redirects to `/dashboard`; on failure: returns `{ error: string }`

### Requirement: Update Gig Server Action
The system MUST provide an `updateGig` server action that lets the **owning CLIENT** edit an `OPEN` gig's fields with the **same server-authoritative validation gates as `createGig`** (via the shared `parseGigForm`), recomputing the fee when the budget changes. Editing MUST be permitted **only while the gig is `OPEN`** (not `IN_PROGRESS`/`REVIEW`/`COMPLETED`/`PAID`, not `closedByAdmin`, not `isExample`). Because it shares `parseGigForm`, `updateGig` MUST enforce the same minimums as create — an edit MUST NOT be able to persist values that creation would reject.

#### Scenario: Successful edit
- GIVEN the owning CLIENT of an `OPEN` gig
- WHEN `updateGig` is called with a valid `gigId` and valid `title`, `description` (≥20 chars), `acceptanceCriteria` (≥50 chars), `goal` (non-empty), `deliverables` (non-empty), `budget` (roubles), and optional `constraints`, `deadlineDays`, `stageCount`, `category`, `tags`
- THEN the gig's editable fields MUST be updated and the fee recomputed if the budget changed
- AND the action MUST redirect to `/gigs/{gigId}`

#### Scenario: Edit cannot bypass the description minimum
- GIVEN the owning CLIENT of an `OPEN` gig
- WHEN `updateGig` is called with a description shorter than 20 characters (after trimming)
- THEN it MUST return an error `{ error: <Russian message stating the description minimum> }`
- AND the gig MUST NOT be modified

#### Scenario: Edit cannot bypass the criteria minimum
- GIVEN the owning CLIENT of an `OPEN` gig
- WHEN `updateGig` is called with acceptanceCriteria shorter than 50 characters (after trimming)
- THEN it MUST return an error `{ error: <Russian message stating the criteria minimum> }`
- AND the gig MUST NOT be modified

#### Scenario: Edit cannot bypass required goal / deliverables
- GIVEN the owning CLIENT of an `OPEN` gig
- WHEN `updateGig` is called with an empty goal or empty deliverables (after trimming)
- THEN it MUST return an error `{ error: <Russian message that the field is required> }`
- AND the gig MUST NOT be modified

#### Scenario: Non-owner or non-OPEN edit is rejected
- GIVEN a non-owner, or the gig is not `OPEN` (IN_PROGRESS/REVIEW/COMPLETED/PAID/closedByAdmin/isExample)
- WHEN `updateGig` is called
- THEN it MUST return the appropriate Russian error and MUST NOT modify the gig

**Acceptance Criteria:**
- `updateGig` is exported from `app/actions/gig.ts` with `'use server'` and calls the same `parseGigForm` as `createGig`
- The minimum-length and required-field gates are identical to create (no leniency on the edit path)
- No column, lifecycle transition, ownership, or assignment field is editable through this action

## ADDED Requirements

### Requirement: Shared Server-Authoritative Gig Validator (parseGigForm SSOT)
The system MUST enforce all gig field minimums inside a single shared validator, `parseGigForm` in `app/actions/gig.ts`, which is the **single source of truth** used by both `createGig` and `updateGig`. Client-side gating (readiness checklist, disabled buttons, counters) MUST be a mirror of these rules and MUST NOT be the only place a rule is enforced.

#### Scenario: All minimums live in one validator
- GIVEN the gig create and edit flows
- WHEN either `createGig` or `updateGig` validates input
- THEN both MUST delegate field validation to `parseGigForm`
- AND `parseGigForm` MUST enforce: title non-empty; description ≥ 20 chars (trimmed); acceptanceCriteria ≥ 50 chars (trimmed); goal non-empty (trimmed); deliverables non-empty (trimmed); budget > 0; deadline (when provided) an integer 1–365; stageCount (when provided) an integer 1–50
- AND every rejection MUST carry a Russian error message

#### Scenario: Client gating cannot be the sole enforcement
- GIVEN a request that bypasses the client UI (e.g. a direct server-action invocation) with a sub-minimum description or missing goal/deliverables
- WHEN `createGig` or `updateGig` runs
- THEN the server MUST reject it via `parseGigForm`, independent of any client checklist
