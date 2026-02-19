# Implementation Tasks: messaging-tests

## Task 1: Set up test file structure and mocks

**Description:**
Create the test file with proper imports, mocks, and setup/teardown hooks.

**Implementation Notes:**
- Create `__tests__/integration/messaging.test.ts`
- Import Vitest functions: `describe`, `it`, `expect`, `vi`, `beforeEach`, `afterEach`
- Import test helpers: `getTestPrismaClient`, `withAuthContext`, `setTestSessionToken`, `getTestSessionToken`
- Import factory functions: `createTestUser`, `createTestGig`, `createTestApplication`
- Mock `@/lib/prisma` to use test database (lazy getter pattern)
- Mock `next/headers` for session cookie management
- Mock `next/navigation` for redirect handling
- Import `sendMessage` action after mocks
- Add `beforeEach` hook to clear session token
- Add `afterEach` hook to clear session token

**Test Plan:**
- Run `npm test messaging.test.ts` to verify file loads without errors
- Verify mocks are properly configured
- Verify test database isolation works

---

## Task 2: Implement authorization tests

**Description:**
Test that only gig owner and assigned specialist can send messages.

**Implementation Notes:**
- Create `describe('Message Authorization')` block
- Test 1: CLIENT owner can send messages
  - Create client user, specialist user
  - Create gig owned by client, status IN_PROGRESS
  - Create and accept application to assign specialist
  - Use `withAuthContext(client, ...)` to send message
  - Assert message created with correct gigId, senderId, content
- Test 2: Assigned SPECIALIST can send messages
  - Use same gig setup
  - Use `withAuthContext(specialist, ...)` to send message
  - Assert message created successfully
- Test 3: Non-assigned SPECIALIST cannot send messages
  - Create third specialist user (not assigned)
  - Use `withAuthContext(otherSpecialist, ...)` to attempt send
  - Assert returns error: "You are not authorized to send messages on this gig."
  - Assert no message created (count unchanged)
- Test 4: CLIENT non-owner cannot send messages
  - Create second client user
  - Use `withAuthContext(otherClient, ...)` to attempt send
  - Assert returns error: "You are not authorized to send messages on this gig."
- Test 5: Unauthenticated user redirects to login
  - Clear session token
  - Attempt to call sendMessage
  - Catch redirect error, assert contains "/login"

**Test Plan:**
- Run `npm test messaging.test.ts`
- Verify all 5 authorization tests pass
- Verify error messages match implementation exactly

---

## Task 3: Implement message visibility tests

**Description:**
Test that messages are scoped to specific gigs and only visible to participants.

**Implementation Notes:**
- Create `describe('Message Visibility')` block
- Test 1: Messages are scoped to specific gig
  - Create two separate gigs (Gig A and Gig B) with different clients and specialists
  - Send 2 messages to Gig A
  - Send 3 messages to Gig B
  - Query messages for Gig A: `prisma.message.findMany({ where: { gigId: gigA.id } })`
  - Assert count is 2, all messages have gigId = gigA.id
  - Query messages for Gig B
  - Assert count is 3, all messages have gigId = gigB.id
- Test 2: Message count is correct per gig
  - Use same setup
  - Assert total messages in DB is 5
  - Assert each gig has correct count

**Test Plan:**
- Run `npm test messaging.test.ts`
- Verify visibility tests pass
- Verify message queries return correct gig-specific data

---

## Task 4: Implement message ordering tests

**Description:**
Test that messages are returned in chronological order (oldest first).

**Implementation Notes:**
- Create `describe('Message Ordering')` block
- Test 1: Messages ordered by createdAt ascending
  - Create gig with assigned specialist
  - Send 3 messages with small delays between them (or use Prisma's auto timestamps)
  - Query messages: `prisma.message.findMany({ where: { gigId }, orderBy: { createdAt: 'asc' } })`
  - Assert messages[0].createdAt < messages[1].createdAt < messages[2].createdAt
  - Assert content order matches send order
- Test 2: Message timestamps are accurate
  - Send a message
  - Retrieve message from DB
  - Assert createdAt is a Date object
  - Assert createdAt is within last few seconds (reasonable time window)

**Test Plan:**
- Run `npm test messaging.test.ts`
- Verify ordering tests pass
- Verify timestamps are set correctly

---

## Task 5: Implement state validation tests

**Description:**
Test messaging restrictions based on gig state (no specialist, closed, different statuses).

**Implementation Notes:**
- Create `describe('State Validation')` block
- Test 1: Cannot send messages before specialist is assigned
  - Create gig with status OPEN, assignedSpecialistId = null
  - Attempt to send message as gig owner
  - Assert returns error: "Cannot send messages until a specialist is assigned."
  - Assert no message created
- Test 2: Cannot send messages if gig is closed by admin
  - Create gig with assigned specialist, closedByAdmin = true
  - Attempt to send message as gig owner
  - Assert returns error: "Cannot send messages to a closed gig."
  - Assert no message created
- Test 3: Can send messages in IN_PROGRESS status
  - Create gig with status IN_PROGRESS, assigned specialist
  - Send message as owner
  - Assert message created successfully
- Test 4: Can send messages in REVIEW status
  - Update gig status to REVIEW
  - Send message as specialist
  - Assert message created successfully
- Test 5: Can send messages in COMPLETED status
  - Update gig status to COMPLETED
  - Send message as owner
  - Assert message created successfully
- Test 6: Can send messages in PAID status
  - Update gig status to PAID
  - Send message as specialist
  - Assert message created successfully

**Test Plan:**
- Run `npm test messaging.test.ts`
- Verify all state validation tests pass
- Verify messaging works across all active statuses
- Verify restrictions enforced for OPEN and closed gigs

---

## Task 6: Implement content validation tests

**Description:**
Test message content validation (empty, whitespace, max length, trimming).

**Implementation Notes:**
- Create `describe('Content Validation')` block
- Test 1: Empty content is rejected
  - Create FormData with content = ""
  - Call sendMessage
  - Assert returns error: "Message content is required."
- Test 2: Whitespace-only content is rejected
  - Create FormData with content = "   \n\t  "
  - Call sendMessage
  - Assert returns error: "Message content is required."
- Test 3: Content exceeding max length is rejected
  - Create FormData with content = "a".repeat(2001)
  - Call sendMessage
  - Assert returns error: "Message is too long. Maximum 2000 characters allowed."
- Test 4: Content is trimmed before storage
  - Create FormData with content = "  Hello World  "
  - Call sendMessage successfully
  - Query message from DB
  - Assert stored content is "Hello World" (no leading/trailing spaces)
- Test 5: Valid content within limits is accepted
  - Create FormData with content = "Valid message content"
  - Call sendMessage
  - Assert message created
  - Assert content matches exactly (after trimming)
- Test 6: Content at max length boundary (2000 chars) is accepted
  - Create FormData with content = "a".repeat(2000)
  - Call sendMessage
  - Assert message created successfully

**Test Plan:**
- Run `npm test messaging.test.ts`
- Verify all content validation tests pass
- Verify error messages match implementation
- Verify trimming behavior works correctly

---

## Task 7: Implement edge case tests

**Description:**
Test edge cases and error conditions.

**Implementation Notes:**
- Create `describe('Edge Cases')` block
- Test 1: Send message to non-existent gig
  - Create FormData with gigId = "non-existent-id"
  - Call sendMessage
  - Assert returns error: "Gig not found."
- Test 2: Message count increases correctly
  - Create gig with assigned specialist
  - Query initial message count
  - Send message
  - Query new message count
  - Assert count increased by 1
- Test 3: Messages persist across queries
  - Send message with specific content
  - Query message by ID
  - Assert all fields match (content, senderId, gigId, createdAt)
  - Query again to verify persistence
  - Assert data unchanged

**Test Plan:**
- Run `npm test messaging.test.ts`
- Verify all edge case tests pass
- Verify data persistence and integrity

---

## Task 8: Verify test coverage and documentation

**Description:**
Ensure all spec scenarios are covered and tests are well-documented.

**Implementation Notes:**
- Review spec files:
  - `openspec/archive/messaging-iteration-3/specs/gig/spec.md` (9 scenarios)
  - `openspec/archive/messaging-iteration-4/specs/ui/spec.md` (4 scenarios)
- Create coverage checklist in test file comments
- Verify each scenario has corresponding test(s)
- Add descriptive comments for complex test setups
- Ensure test names clearly describe what is being tested

**Test Plan:**
- Run `npm test messaging.test.ts` - all tests should pass
- Run `npm run test:coverage` - verify messaging.test.ts shows good coverage
- Review test output for clarity and completeness
- Count total test cases (should be 25+)

---

## Task 9: Run full test suite and verify integration

**Description:**
Ensure new tests don't break existing tests and integrate properly.

**Implementation Notes:**
- Run full test suite: `npm test`
- Verify no regressions in existing tests
- Verify messaging tests run in isolation (per-worker database)
- Check test execution time (should be under 10 seconds for messaging tests)
- Verify tests are deterministic (run multiple times, always pass)

**Test Plan:**
- Run `npm test` - all tests should pass
- Run `npm test messaging.test.ts` 5 times - should pass every time
- Run `npm run test:coverage` - verify overall coverage increased
- Verify test output is clean (no warnings or errors)

---

## Summary

**Total Tasks:** 9
**Estimated Test Cases:** 25-30
**Expected Coverage:** 100% of messaging spec scenarios

**Deliverables:**
- `__tests__/integration/messaging.test.ts` with comprehensive test coverage
- All tests passing consistently
- Documentation of which spec scenarios are covered
- Integration with existing test infrastructure
