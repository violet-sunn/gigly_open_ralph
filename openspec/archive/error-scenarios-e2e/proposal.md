# Change Proposal: Error Scenarios E2E Testing

## Change ID
`error-scenarios-e2e`

## Problem Statement

While Gigly has comprehensive E2E tests for happy-path user journeys (client-journey, specialist-journey, admin-moderation), there is **no systematic E2E testing of error scenarios and edge cases**. This creates risks:

1. **User Experience Gaps**: Error messages may not be displayed properly in the browser, even if server-side validation works
2. **Security Vulnerabilities**: Unauthorized access attempts may not redirect correctly or may expose sensitive information
3. **Business Logic Failures**: Invalid state transitions (e.g., applying to closed gigs) may not show clear error messages
4. **Regression Risk**: Changes to error handling can break user-facing error displays without detection

Current test coverage focuses on successful workflows. We need E2E tests that verify:
- Form validation errors are **visible** to users in the browser
- Unauthorized access attempts **redirect** to login or show access denied messages
- Business rule violations (closed gigs, invalid state transitions) display **clear, helpful error messages**
- Error messages are **in Russian** and follow platform conventions

## Proposed Solution

Create a comprehensive E2E test suite (`__tests__/e2e/error-scenarios.spec.ts`) using Playwright that validates error handling across all major user workflows.

### Test Coverage

The test suite will cover:

1. **Form Validation Errors**
   - Gig creation with missing required fields
   - Application submission with invalid structured fields (too short/long)
   - Message sending with empty content
   - Registration with invalid email format

2. **Authorization Errors**
   - Unauthenticated access to protected routes (redirects to /login)
   - SPECIALIST trying to access CLIENT-only pages (gig creation)
   - CLIENT trying to access SPECIALIST-only actions (applying to gigs)
   - Non-owner trying to manage gig (accept applications, approve work)

3. **Business Logic Errors**
   - Applying to closed gig (closedByAdmin = true)
   - Applying to non-OPEN gig (IN_PROGRESS, COMPLETED, PAID)
   - Submitting work when not assigned specialist
   - Approving work when not gig owner
   - Invalid state transitions (e.g., marking OPEN gig as paid)

4. **Error Message Quality**
   - Messages are in Russian
   - Messages are specific and actionable
   - Messages don't expose sensitive information
   - Messages are displayed in appropriate UI location (form field, toast, page header)

### Approach

- **Hybrid testing**: Use Playwright for UI interactions, programmatic setup for test data
- **Realistic scenarios**: Test errors users will actually encounter
- **Comprehensive assertions**: Verify both error message content and UI display
- **Idempotent**: Tests can run multiple times without conflicts

## Constraints

- **No new features**: This change only adds tests, no production code changes
- **Existing error handling**: Tests validate existing error handling behavior
- **Russian language**: All error messages must be in Russian (existing requirement)
- **E2E test architecture**: Must follow existing E2E patterns (shared test.db, sequential execution, cleanup hooks)

## Non-Goals

- **Not fixing errors**: This change documents and tests existing error behavior, not fixes
- **Not unit/integration tests**: Focus is on browser-visible errors, not server-side validation logic
- **Not exhaustive**: Cover common error scenarios, not every possible edge case
- **Not performance testing**: Focus is on correctness, not error handling performance

## Success Criteria

1. E2E test file exists at `__tests__/e2e/error-scenarios.spec.ts`
2. All test scenarios pass consistently
3. Tests complete in under 60 seconds total
4. Tests follow existing E2E patterns (cleanup, idempotency, Russian data)
5. Tests are documented in TESTING.md

## Dependencies

- Existing E2E test infrastructure (Playwright, test.db, helpers)
- Existing error handling in server actions
- Existing UI error display components

## Risks

- **Flaky tests**: Error scenarios may involve timing issues (redirects, async validation)
- **Brittle selectors**: Error message selectors may break if UI changes
- **Incomplete coverage**: May miss edge cases not anticipated in initial design

## Mitigation

- Use Playwright's built-in waiting mechanisms (`waitForURL`, `waitForSelector`)
- Use semantic selectors (role, text) over CSS selectors where possible
- Document known gaps and plan for iterative expansion
