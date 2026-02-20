# Change Proposal: Messaging Flow E2E Test

## Change ID
`messaging-flow-e2e`

## Status
Proposed

## Context

The platform has gig-scoped messaging functionality that allows clients and assigned specialists to communicate within the context of a gig. This messaging feature is critical for preventing platform leakage (users moving to Telegram/email) and maintaining dispute context.

Currently, there is no E2E test that validates the complete messaging flow from both user perspectives, including:
- Sending messages as client
- Receiving and viewing messages as specialist
- Sending replies as specialist
- Receiving and viewing replies as client
- Chronological message ordering

The existing E2E tests (`client-journey.spec.ts`, `specialist-journey.spec.ts`) focus on the gig lifecycle but do not test the messaging functionality in detail.

## Problem Statement

Without comprehensive E2E testing of the messaging flow, we risk:
1. **User switching bugs**: Issues with session management when users logout/login
2. **Message visibility bugs**: Messages not appearing for the intended recipient
3. **Ordering bugs**: Messages displayed in incorrect chronological order
4. **Authorization bugs**: Users seeing messages from gigs they shouldn't access
5. **UI/UX regressions**: Form submission, page reloads, or message display breaking

## Proposed Solution

Create a comprehensive E2E test (`messaging-flow-e2e.spec.ts`) that validates the complete messaging flow using Playwright browser automation. The test will:

1. **Setup phase (programmatic)**:
   - Create client user with profile
   - Create OPEN gig
   - Create specialist user with profile
   - Create and accept application (gig transitions to IN_PROGRESS)

2. **Client sends message (UI)**:
   - Authenticate as client via session cookie
   - Navigate to gig detail page
   - Send message via message form
   - Verify message appears in UI
   - Logout (clear session)

3. **Specialist receives and replies (UI)**:
   - Authenticate as specialist via session cookie
   - Navigate to gig detail page
   - Verify client's message is visible
   - Send reply via message form
   - Verify reply appears in UI
   - Logout (clear session)

4. **Client receives reply (UI)**:
   - Authenticate as client again via session cookie
   - Navigate to gig detail page
   - Verify both messages are visible
   - Verify messages are ordered chronologically (oldest first)

5. **Final verification (database)**:
   - Query messages from database
   - Verify message count, content, senders, and timestamps
   - Verify chronological ordering

### Test Approach

The test will use a **hybrid approach** following existing E2E test patterns:
- **Programmatic setup**: Create users, gig, and application via test helpers
- **UI interactions**: Message sending, navigation, and verification via Playwright
- **Session management**: Authenticate users by setting session cookies (no login form)
- **State verification**: Database queries to confirm message persistence

### User Switching Strategy

To test both user perspectives, the test will:
1. Set client session cookie → interact → clear cookies
2. Set specialist session cookie → interact → clear cookies
3. Set client session cookie again → verify

This approach is faster and more reliable than using the login form repeatedly.

## Constraints

- Test must complete in under 30 seconds
- Test must use realistic Russian message content
- Test must be idempotent (can run multiple times without conflicts)
- Test must clean up all test data in afterEach hook
- Test must follow existing E2E test patterns and conventions

## Non-Goals

- Testing message validation edge cases (covered by integration tests)
- Testing message form UI details (character counters, etc.)
- Testing message notifications (not implemented yet)
- Testing message editing or deletion (not implemented)
- Testing file attachments (not implemented)

## Success Criteria

1. E2E test file exists at `__tests__/e2e/messaging-flow-e2e.spec.ts`
2. Test passes consistently when run via `npm run test:e2e -- messaging-flow-e2e.spec.ts`
3. Test validates all 6 requirements from the PRD
4. Test completes in under 30 seconds
5. Test uses realistic Russian message content
6. Test follows existing E2E test patterns (hybrid approach, cleanup, etc.)
7. Test is documented with clear step-by-step comments

## Dependencies

- Existing messaging functionality (implemented in change `messaging-iteration-3` and `messaging-iteration-4`)
- Existing E2E test infrastructure (Playwright, test helpers, session management)
- Test database isolation and cleanup mechanisms

## Risks

- **Timing issues**: Page reloads and database updates may require polling/retries
- **Session management**: Cookie clearing and re-authentication must work reliably
- **Message ordering**: Timestamps must be precise enough to ensure correct ordering
- **Test flakiness**: Network delays or slow database operations could cause intermittent failures

## Mitigation Strategies

- Use `page.waitForLoadState('networkidle')` after navigation and form submission
- Poll database with timeout when verifying state changes
- Use `Date.now()` with small delays between messages to ensure distinct timestamps
- Add retry logic for flaky assertions
- Use realistic timeouts (5-10 seconds) for element visibility checks
