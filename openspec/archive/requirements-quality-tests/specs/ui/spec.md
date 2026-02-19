# UI Spec Delta: Requirements Quality Tests

## ADDED Requirements

### Requirement: Example Gig Badge Display Tests
The test suite MUST verify that example gigs display visual indicators on browse and detail pages.

#### Scenario: Example gig displays badge on browse page
- GIVEN a gig with `isExample = true` exists in the database
- WHEN the gig browse page query includes the `isExample` field
- THEN the gig data MUST include `isExample: true`
- AND the UI MUST render an "Example" badge for this gig

#### Scenario: Real gig does not display badge
- GIVEN a gig with `isExample = false` exists in the database
- WHEN the gig browse page query includes the `isExample` field
- THEN the gig data MUST include `isExample: false`
- AND the UI MUST NOT render an "Example" badge for this gig

#### Scenario: Example gig detail page shows banner
- GIVEN a gig with `isExample = true` exists
- WHEN the gig detail page query includes the `isExample` field
- THEN the gig data MUST include `isExample: true`
- AND the UI MUST render an "Example Gig" banner at the top of the page

#### Scenario: Example gig hides apply form for SPECIALIST
- GIVEN an authenticated user with role "SPECIALIST"
- AND a gig with `isExample = true` exists
- WHEN the gig detail page renders
- THEN the apply form MUST NOT be displayed
- AND an informational message MUST be shown instead

**Acceptance Criteria:**
- Tests verify `isExample` field is included in database queries
- Tests verify badge/banner rendering logic (conditional on `isExample === true`)
- Tests verify apply form is hidden for example gigs
- Tests verify informational message is shown for SPECIALIST users
- Tests use database queries to verify data structure, not UI rendering (integration tests, not E2E)

---

### Requirement: Structured Fields Display Tests
The test suite MUST verify that structured fields are displayed on gig detail pages when filled.

#### Scenario: Gig with all structured fields displays them
- GIVEN a gig with non-empty goal, deliverables, and constraints exists
- WHEN the gig detail page query includes these fields
- THEN the gig data MUST include all three fields with their values
- AND the UI MUST display "Additional Requirements" section

#### Scenario: Gig without structured fields hides section
- GIVEN a gig with empty goal, deliverables, and constraints exists
- WHEN the gig detail page query includes these fields
- THEN the gig data MUST include all three fields as empty strings ""
- AND the UI MUST NOT display "Additional Requirements" section (graceful handling)

#### Scenario: Gig with partial structured fields displays only filled ones
- GIVEN a gig with goal filled but deliverables and constraints empty
- WHEN the gig detail page query includes these fields
- THEN the gig data MUST include goal with value and others as empty strings
- AND the UI MUST display only the filled fields

**Acceptance Criteria:**
- Tests verify structured fields are included in gig detail queries
- Tests verify conditional display logic (show section only if fields are filled)
- Tests verify backward compatibility (gigs without structured fields display gracefully)
- Tests use database queries to verify data structure

---

### Requirement: Acceptance Criteria Display Tests
The test suite MUST verify that acceptance criteria is displayed prominently on gig detail pages.

#### Scenario: Acceptance criteria is displayed for all gigs
- GIVEN a gig with acceptanceCriteria exists
- WHEN the gig detail page query includes acceptanceCriteria field
- THEN the gig data MUST include acceptanceCriteria with its value
- AND the UI MUST display "Definition of Done" or "Acceptance Criteria" section

#### Scenario: Acceptance criteria is visible to both CLIENT and SPECIALIST
- GIVEN a gig with acceptanceCriteria exists
- WHEN a CLIENT user views the gig detail page
- THEN acceptanceCriteria MUST be displayed
- WHEN a SPECIALIST user views the gig detail page
- THEN acceptanceCriteria MUST be displayed (same visibility)

**Acceptance Criteria:**
- Tests verify acceptanceCriteria field is included in gig detail queries
- Tests verify field is displayed for all user roles
- Tests verify field is always displayed (not conditional like structured fields)

---

### Requirement: Form Validation Feedback Tests
The test suite MUST verify that gig creation form provides clear validation feedback.

#### Scenario: Missing acceptance criteria shows error
- GIVEN a CLIENT user submits gig form without acceptanceCriteria
- WHEN `createGig` is called
- THEN it MUST return `{ error: 'Title, description, and acceptance criteria are required.' }`

#### Scenario: Short acceptance criteria shows specific error
- GIVEN a CLIENT user submits gig form with acceptanceCriteria < 50 chars
- WHEN `createGig` is called
- THEN it MUST return `{ error: 'Acceptance criteria must be at least 50 characters.' }`

#### Scenario: Valid form shows no errors
- GIVEN a CLIENT user submits gig form with all required fields valid
- WHEN `createGig` is called
- THEN it MUST redirect to `/dashboard` (no error returned)

**Acceptance Criteria:**
- Tests verify exact error messages match spec
- Tests verify error messages are clear and actionable
- Tests verify successful submission returns no error

---

## MODIFIED Requirements

None - these are new test requirements, not modifications to existing functionality.

## REMOVED Requirements

None - no existing tests are being removed.
