# Gig Spec Delta: Requirements Quality Tests

## ADDED Requirements

### Requirement: Example Gig Application Tests
The test suite MUST verify that specialists cannot apply to example gigs.

#### Scenario: Application to example gig is rejected
- GIVEN an authenticated user with role "SPECIALIST"
- AND a gig with `isExample = true` exists in the database
- WHEN `applyToGig` is called with the example gig's ID
- THEN it MUST return `{ error: 'This is an example gig for demonstration purposes. You cannot apply to example gigs.' }`
- AND no Application record MUST be created in the database

#### Scenario: Application to real gig succeeds
- GIVEN an authenticated user with role "SPECIALIST"
- AND a gig with `isExample = false` exists in the database
- WHEN `applyToGig` is called with valid application data
- THEN the application MUST be created successfully
- AND the Application record MUST be persisted in the database

#### Scenario: Example gig check happens before other validations
- GIVEN an authenticated user with role "SPECIALIST"
- AND a gig with `isExample = true` exists
- WHEN `applyToGig` is called with invalid data (e.g., missing required fields)
- THEN it MUST return the example gig error message
- AND it MUST NOT return validation errors for missing fields

**Acceptance Criteria:**
- Test file `__tests__/integration/example-gigs.test.ts` exists
- Tests use `withTestTransaction` for isolation
- Tests use `createTestGig` factory with `isExample: true`
- Tests verify exact error message matches spec
- Tests verify no Application records created
- Tests verify real gigs (isExample: false) work normally

---

### Requirement: Structured Fields Storage Tests
The test suite MUST verify that optional structured fields (goal, deliverables, constraints) are saved correctly.

#### Scenario: Gig created with all structured fields
- GIVEN an authenticated user with role "CLIENT"
- WHEN `createGig` is called with goal, deliverables, and constraints provided
- THEN a Gig record MUST be created
- AND `goal` field MUST contain the provided value (trimmed)
- AND `deliverables` field MUST contain the provided value (trimmed)
- AND `constraints` field MUST contain the provided value (trimmed)

#### Scenario: Gig created without optional fields
- GIVEN an authenticated user with role "CLIENT"
- WHEN `createGig` is called with only required fields (no goal, deliverables, or constraints)
- THEN a Gig record MUST be created successfully
- AND `goal` field MUST be empty string ""
- AND `deliverables` field MUST be empty string ""
- AND `constraints` field MUST be empty string ""

#### Scenario: Structured fields are trimmed
- GIVEN an authenticated user with role "CLIENT"
- WHEN `createGig` is called with goal, deliverables, or constraints containing leading/trailing whitespace
- THEN all three fields MUST be trimmed before storage
- AND whitespace-only values MUST be stored as empty string ""

#### Scenario: Structured fields have no minimum length
- GIVEN an authenticated user with role "CLIENT"
- WHEN `createGig` is called with a goal of only 5 characters
- THEN the gig MUST be created successfully
- AND no validation error MUST be returned

**Acceptance Criteria:**
- Test file `__tests__/integration/structured-fields.test.ts` exists
- Tests verify all three fields (goal, deliverables, constraints) are saved
- Tests verify empty values default to empty string ""
- Tests verify whitespace trimming behavior
- Tests verify no minimum length validation for optional fields
- Tests use `createTestUser` factory for CLIENT users

---

### Requirement: Acceptance Criteria Validation Tests
The test suite MUST verify that acceptance criteria field meets minimum length requirement.

#### Scenario: Acceptance criteria meets minimum length
- GIVEN an authenticated user with role "CLIENT"
- WHEN `createGig` is called with acceptanceCriteria of exactly 50 characters
- THEN the gig MUST be created successfully
- AND `acceptanceCriteria` field MUST contain the provided value (trimmed)

#### Scenario: Acceptance criteria too short
- GIVEN an authenticated user with role "CLIENT"
- WHEN `createGig` is called with acceptanceCriteria shorter than 50 characters (after trimming)
- THEN it MUST return `{ error: 'Acceptance criteria must be at least 50 characters.' }`
- AND no Gig record MUST be created

#### Scenario: Whitespace-only acceptance criteria is rejected
- GIVEN an authenticated user with role "CLIENT"
- WHEN `createGig` is called with acceptanceCriteria containing only whitespace
- THEN it MUST return `{ error: 'Title, description, and acceptance criteria are required.' }`
- AND no Gig record MUST be created

#### Scenario: Acceptance criteria is trimmed before validation
- GIVEN an authenticated user with role "CLIENT"
- WHEN `createGig` is called with acceptanceCriteria of "   50 chars   " (50 chars excluding whitespace)
- THEN the gig MUST be created successfully
- AND `acceptanceCriteria` field MUST contain the trimmed value (no leading/trailing whitespace)

#### Scenario: Long acceptance criteria is accepted
- GIVEN an authenticated user with role "CLIENT"
- WHEN `createGig` is called with acceptanceCriteria of 500 characters
- THEN the gig MUST be created successfully
- AND `acceptanceCriteria` field MUST contain the full value

**Acceptance Criteria:**
- Tests added to existing `__tests__/integration/gig-creation.test.ts` file
- Tests verify 50-character minimum (after trimming)
- Tests verify whitespace-only values are rejected
- Tests verify trimming happens before validation
- Tests verify long values are accepted
- Tests verify exact error messages match spec

---

## MODIFIED Requirements

None - these are new test requirements, not modifications to existing functionality.

## REMOVED Requirements

None - no existing tests are being removed.
