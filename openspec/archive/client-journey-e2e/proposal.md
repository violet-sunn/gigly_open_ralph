# Change Proposal: Client Journey E2E Test

## Change ID
`client-journey-e2e`

## Problem Statement

The platform currently lacks comprehensive end-to-end test coverage for the complete client journey from registration to payment. While we have unit and integration tests for individual features, we need an E2E test that validates the entire workflow as a real user would experience it in a browser.

**Current gaps:**
- No E2E test covering the full gig lifecycle from client perspective
- No validation that all UI interactions work together seamlessly
- No test simulating realistic multi-user interactions (client + specialist)
- No verification that the complete flow from registration → gig creation → specialist selection → work approval → payment works end-to-end

## Proposed Solution

Create a comprehensive Playwright E2E test that simulates a complete client journey:

1. **Client Registration** - Register a new client account via UI
2. **Client Login** - Authenticate as the client
3. **Gig Creation** - Create a gig with all required fields via UI
4. **Specialist Application** - Simulate specialist applying (via test setup/API)
5. **Application Review** - Review and accept the specialist's application via UI
6. **Work Submission** - Simulate specialist submitting work (via test setup/API)
7. **Work Approval** - Approve the submitted work via UI
8. **Payment Marking** - Mark the gig as paid via UI
9. **Final Verification** - Verify gig status is PAID and all state is correct

**Key design decisions:**

- **Single test flow**: The test will be a single cohesive test that flows through all steps, not separate independent tests. This reflects the real user journey.
- **Hybrid approach**: Client actions use browser UI (Playwright), while specialist actions use programmatic setup (direct database/API calls) to avoid complex multi-browser orchestration.
- **Explicit verification**: Each step includes explicit assertions before proceeding to the next step.
- **Realistic data**: Use Russian company names, gig titles, and realistic budget values.

## Scope

### In Scope
- Complete client journey E2E test covering all 9 steps
- Browser-based UI interactions for client actions
- Programmatic specialist actions (application, work submission)
- State verification at each step
- Test documentation and examples

### Out of Scope
- Multi-browser orchestration (client and specialist in separate browsers)
- Real-time waiting for async events (we simulate specialist actions)
- Performance testing or load testing
- Testing error scenarios (focus on happy path)
- Testing admin moderation flows

## Constraints

- Test MUST use Playwright for browser automation
- Test MUST use existing test helpers (`setE2ESession`, `createTestUser`, etc.)
- Test MUST complete in under 30 seconds
- Test MUST be idempotent (can run multiple times without conflicts)
- Test MUST use test database, not development database
- Test MUST follow AAA pattern (Arrange-Act-Assert)

## Success Criteria

1. E2E test file exists at `__tests__/e2e/client-journey.spec.ts`
2. Test covers all 9 steps of the client journey
3. Test passes consistently (run 10 times, all pass)
4. Test uses realistic Russian data
5. Test includes clear comments explaining each step
6. Test execution time < 30 seconds
7. Documentation updated with example usage

## Non-Goals

- Testing specialist journey (separate test)
- Testing error paths (invalid data, authorization failures)
- Testing edge cases (concurrent applications, gig closure)
- Testing messaging functionality within the journey
- Testing admin intervention scenarios
