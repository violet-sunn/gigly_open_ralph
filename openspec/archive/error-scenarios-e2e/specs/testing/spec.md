# Testing Specification Delta

## ADDED Requirements

### Requirement: E2E Error Scenario Testing

The platform SHALL provide comprehensive end-to-end tests that validate error handling, error message display, and user feedback for common error scenarios across all major workflows.

#### Scenario: Form validation errors are displayed in browser

**Given** a user is on a form page (gig creation, application submission, message sending)
**When** the user submits the form with invalid data (missing required fields, too short/long content, invalid format)
**Then** the browser SHALL display validation error messages
**And** error messages SHALL be visible near the relevant form fields
**And** error messages SHALL be in Russian
**And** error messages SHALL be specific and actionable
**And** the form SHALL NOT submit successfully
**And** no database records SHALL be created

**Acceptance Criteria**:
- Test gig creation with missing title: error message visible, no gig created
- Test gig creation with acceptanceCriteria < 50 chars: error message visible
- Test application with approach < 100 chars: error message visible
- Test application with questions < 50 chars: error message visible
- Test message with empty content: error message visible
- Test registration with invalid email format: error message visible
- All error messages are in Russian
- Error messages appear within 2 seconds of form submission
- Run `npm run test:e2e -- error-scenarios.spec.ts` and verify all pass

#### Scenario: Unauthorized access redirects to login

**Given** a user is not authenticated (no session cookie)
**When** the user attempts to access a protected route (`/dashboard`, `/dashboard/gigs/new`, `/dashboard/gigs/[id]`)
**Then** the browser SHALL redirect to `/login`
**And** the redirect SHALL happen within 2 seconds
**And** the URL SHALL be `/login`
**And** no protected content SHALL be visible

**Acceptance Criteria**:
- Test unauthenticated access to `/dashboard` redirects to `/login`
- Test unauthenticated access to `/dashboard/gigs/new` redirects to `/login`
- Test unauthenticated access to `/dashboard/gigs/[id]` redirects to `/login`
- Test unauthenticated access to `/admin` redirects to `/login`
- Redirects happen automatically without user interaction
- No flash of protected content before redirect
- Run test and verify all redirects work correctly

#### Scenario: Role-based access control errors are displayed

**Given** a user is authenticated with a specific role
**When** the user attempts to access a route or perform an action restricted to a different role
**Then** the browser SHALL display an access denied message or redirect to appropriate page
**And** the error message SHALL be in Russian
**And** the action SHALL NOT be performed
**And** no unauthorized database changes SHALL occur

**Acceptance Criteria**:
- Test SPECIALIST accessing `/dashboard/gigs/new` (CLIENT-only): shows error or redirects
- Test CLIENT attempting to apply to gig: shows error message
- Test non-ADMIN accessing `/admin`: redirects to `/login` or shows access denied
- All error messages are in Russian and clear
- No unauthorized actions succeed
- Run test and verify all role checks work

#### Scenario: Closed gig shows error when applying

**Given** a gig exists with `closedByAdmin = true`
**When** a SPECIALIST attempts to apply to the gig via UI
**Then** the browser SHALL display an error message
**And** the error message SHALL state "This gig has been closed by administrators" (in Russian)
**And** the application form SHALL NOT submit successfully
**And** no application record SHALL be created in the database

**Acceptance Criteria**:
- Create closed gig programmatically (closedByAdmin = true)
- Navigate to gig detail page as authenticated SPECIALIST
- Attempt to submit application form
- Verify error message is displayed: "Этот заказ был закрыт администраторами" or similar
- Verify no application record exists in database
- Test passes consistently
- Run `npm run test:e2e -- error-scenarios.spec.ts` and verify

#### Scenario: Non-OPEN gig shows error when applying

**Given** a gig exists with status IN_PROGRESS, REVIEW, COMPLETED, or PAID
**When** a SPECIALIST attempts to apply to the gig via UI
**Then** the browser SHALL display an error message or hide the application form
**And** the error message SHALL indicate the gig is not accepting applications
**And** no application SHALL be created

**Acceptance Criteria**:
- Test applying to IN_PROGRESS gig: error shown or form hidden
- Test applying to COMPLETED gig: error shown or form hidden
- Test applying to PAID gig: error shown or form hidden
- Error messages are in Russian
- No applications created in database
- Run test and verify all statuses handled correctly

#### Scenario: Submitting work when not assigned shows error

**Given** a gig has status IN_PROGRESS with an assigned specialist
**When** a different SPECIALIST (not assigned) attempts to submit work via UI
**Then** the browser SHALL display an error message
**And** the error message SHALL indicate only the assigned specialist can submit work
**And** the gig status SHALL NOT change to REVIEW
**And** no workSubmittedAt timestamp SHALL be set

**Acceptance Criteria**:
- Create gig with assigned specialist A
- Authenticate as specialist B (different user)
- Navigate to gig detail page
- Attempt to submit work form
- Verify error message displayed in Russian
- Verify gig.status remains IN_PROGRESS
- Verify gig.workSubmittedAt is null
- Run test and verify error handling works

#### Scenario: Approving work when not owner shows error

**Given** a gig has status REVIEW
**When** a CLIENT who is NOT the gig owner attempts to approve work
**Then** the browser SHALL display an error message or the approve button SHALL NOT be visible
**And** the gig status SHALL NOT change to COMPLETED
**And** no completedAt timestamp SHALL be set

**Acceptance Criteria**:
- Create gig owned by client A
- Authenticate as client B (different user)
- Navigate to gig detail page
- Verify approve button is not visible OR clicking it shows error
- Verify gig.status remains REVIEW
- Verify gig.completedAt is null
- Error message (if shown) is in Russian
- Run test and verify ownership check works

#### Scenario: Invalid state transition shows error

**Given** a gig has status OPEN (no assigned specialist)
**When** a CLIENT attempts to mark the gig as paid via UI
**Then** the browser SHALL display an error message or the "Mark as Paid" button SHALL NOT be visible
**And** the error message SHALL indicate the gig must be COMPLETED first
**And** the gig status SHALL NOT change to PAID
**And** no paidAt timestamp SHALL be set

**Acceptance Criteria**:
- Create OPEN gig (no assigned specialist)
- Authenticate as gig owner
- Navigate to gig detail page
- Verify "Mark as Paid" button is not visible (correct behavior)
- If button is visible, clicking it shows error
- Verify gig.status remains OPEN
- Verify gig.paidAt is null
- Run test and verify state transition validation works

#### Scenario: Error messages are clear and helpful

**Given** any error scenario occurs
**When** an error message is displayed to the user
**Then** the error message SHALL be in Russian
**And** the error message SHALL be specific (not generic "An error occurred")
**And** the error message SHALL suggest corrective action when possible
**And** the error message SHALL NOT expose sensitive information (stack traces, database details)
**And** the error message SHALL be displayed in an appropriate UI location (near form field, toast notification, page header)

**Acceptance Criteria**:
- All error messages tested are in Russian
- No generic "Error" or "Something went wrong" messages
- Messages include actionable guidance (e.g., "Fill in all required fields", "This gig is closed")
- No stack traces or internal error details visible
- Error messages appear in consistent UI locations
- Review all error messages in test suite for quality
- Run test and verify all error messages meet quality standards

#### Scenario: Test suite is idempotent and maintainable

**Given** the error scenario test suite exists
**When** the test suite runs multiple times
**Then** all tests SHALL pass consistently
**And** no unique constraint violations SHALL occur
**And** no stale data from previous runs SHALL interfere
**And** test execution SHALL complete in under 60 seconds
**And** tests SHALL follow existing E2E patterns (cleanup hooks, Russian data, shared test.db)

**Acceptance Criteria**:
- Run test suite 10 times consecutively: all runs pass
- No database errors or unique constraint violations
- Tests use unique email addresses (timestamp-based)
- Tests include afterEach cleanup hooks
- Tests use shared test.db (not per-worker isolation)
- Tests use PrismaClient with libSQL adapter
- Total execution time < 60 seconds
- Tests follow patterns from client-journey.spec.ts and specialist-journey.spec.ts
- Run `for i in {1..10}; do npm run test:e2e -- error-scenarios.spec.ts; done` and verify all pass

---

### Requirement: Error Scenario Test Documentation

The platform SHALL document the error scenario E2E test suite in TESTING.md with usage examples and coverage summary.

#### Scenario: Developer reads error scenario test documentation

**Given** a developer wants to understand error scenario testing
**When** they read TESTING.md
**Then** documentation SHALL explain the error-scenarios.spec.ts test suite
**And** documentation SHALL list all error scenarios covered
**And** documentation SHALL provide example command to run the tests
**And** documentation SHALL explain the test structure and patterns used

**Acceptance Criteria**:
- TESTING.md includes section on error scenario E2E tests
- Section lists all 8+ error scenarios covered
- Section includes command: `npm run test:e2e -- error-scenarios.spec.ts`
- Section explains test duration (~30-60 seconds)
- Section references existing E2E patterns
- Documentation is concise (under 200 words)
- Run `grep -A 20 "Error Scenario" TESTING.md` and verify section exists
