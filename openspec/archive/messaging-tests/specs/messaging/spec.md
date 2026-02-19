# Messaging Testing Specification

## ADDED Requirements

### Requirement: Message Authorization Tests

The test suite MUST verify that only authorized users can send and view messages.

#### Scenario: CLIENT owner can send messages
- GIVEN a gig with status "IN_PROGRESS" and an assigned specialist
- AND an authenticated CLIENT user who owns the gig
- WHEN the client calls `sendMessage` with valid content
- THEN a Message record MUST be created successfully
- AND the message MUST be associated with the correct gigId and senderId

#### Scenario: Assigned SPECIALIST can send messages
- GIVEN a gig with status "IN_PROGRESS" and an assigned specialist
- AND an authenticated SPECIALIST user who is assigned to the gig
- WHEN the specialist calls `sendMessage` with valid content
- THEN a Message record MUST be created successfully
- AND the message MUST be associated with the correct gigId and senderId

#### Scenario: Non-assigned SPECIALIST cannot send messages
- GIVEN a gig with an assigned specialist
- AND an authenticated SPECIALIST user who is NOT assigned to the gig
- WHEN the non-assigned specialist attempts to call `sendMessage`
- THEN the action MUST return error: "You are not authorized to send messages on this gig."
- AND no Message record MUST be created

#### Scenario: CLIENT non-owner cannot send messages
- GIVEN a gig owned by CLIENT user A
- AND an authenticated CLIENT user B (different from owner)
- WHEN CLIENT B attempts to call `sendMessage`
- THEN the action MUST return error: "You are not authorized to send messages on this gig."
- AND no Message record MUST be created

#### Scenario: Unauthenticated user cannot send messages
- GIVEN no valid session
- WHEN `sendMessage` is called
- THEN it MUST redirect to "/login"

**Acceptance Criteria:**
- Test file MUST create multiple users with different roles
- Test file MUST verify authorization for both CLIENT and SPECIALIST roles
- Test file MUST verify rejection of unauthorized users
- All authorization error messages MUST match implementation exactly

---

### Requirement: Message Visibility Tests

The test suite MUST verify that messages are only visible to gig participants.

#### Scenario: Messages are scoped to specific gig
- GIVEN two gigs (Gig A and Gig B) with different participants
- AND messages sent to both gigs
- WHEN querying messages for Gig A
- THEN only messages associated with Gig A MUST be returned
- AND messages from Gig B MUST NOT be included

#### Scenario: Only gig owner and assigned specialist can view messages
- GIVEN a gig with messages between owner and assigned specialist
- WHEN the gig detail page is loaded by the owner
- THEN all messages MUST be visible
- WHEN the gig detail page is loaded by the assigned specialist
- THEN all messages MUST be visible
- WHEN the gig detail page is loaded by a non-participant
- THEN messages MUST NOT be visible (handled by page authorization)

**Acceptance Criteria:**
- Test file MUST create multiple gigs with different participants
- Test file MUST verify message queries return only gig-specific messages
- Test file MUST verify message count matches expected for each gig

---

### Requirement: Message Ordering Tests

The test suite MUST verify that messages are returned in chronological order.

#### Scenario: Messages ordered by createdAt ascending
- GIVEN a gig with multiple messages sent at different times
- WHEN messages are queried from the database
- THEN messages MUST be ordered by createdAt in ascending order (oldest first)
- AND the first message in the array MUST be the earliest message
- AND the last message in the array MUST be the most recent message

#### Scenario: Message timestamps are accurate
- GIVEN a message is created
- WHEN the message is retrieved from the database
- THEN the createdAt timestamp MUST be set to the time of creation
- AND the timestamp MUST be a valid Date object

**Acceptance Criteria:**
- Test file MUST create multiple messages with time delays or explicit timestamps
- Test file MUST verify ordering by comparing createdAt values
- Test file MUST assert first and last messages are in correct order

---

### Requirement: State Validation Tests

The test suite MUST verify that messaging restrictions are enforced based on gig state.

#### Scenario: Cannot send messages before specialist is assigned
- GIVEN a gig with status "OPEN" and no assigned specialist (assignedSpecialistId = null)
- AND an authenticated CLIENT user who owns the gig
- WHEN the client attempts to call `sendMessage`
- THEN the action MUST return error: "Cannot send messages until a specialist is assigned."
- AND no Message record MUST be created

#### Scenario: Cannot send messages if gig is closed by admin
- GIVEN a gig with closedByAdmin = true
- AND an authenticated user who is authorized (owner or assigned specialist)
- WHEN the user attempts to call `sendMessage`
- THEN the action MUST return error: "Cannot send messages to a closed gig."
- AND no Message record MUST be created

#### Scenario: Can send messages in all active gig statuses
- GIVEN a gig with an assigned specialist
- AND gig status is one of: "IN_PROGRESS", "REVIEW", "COMPLETED", "PAID"
- AND an authenticated user who is authorized (owner or assigned specialist)
- WHEN the user calls `sendMessage` with valid content
- THEN a Message record MUST be created successfully
- AND messaging MUST work regardless of gig status (as long as specialist is assigned and gig not closed)

**Acceptance Criteria:**
- Test file MUST test messaging with assignedSpecialistId = null
- Test file MUST test messaging with closedByAdmin = true
- Test file MUST test messaging across multiple gig statuses (IN_PROGRESS, REVIEW, COMPLETED, PAID)
- All state validation error messages MUST match implementation exactly

---

### Requirement: Content Validation Tests

The test suite MUST verify that message content is properly validated.

#### Scenario: Empty content is rejected
- GIVEN an authorized user attempts to send a message with empty content
- WHEN `sendMessage` is called with content = ""
- THEN the action MUST return error: "Message content is required."
- AND no Message record MUST be created

#### Scenario: Whitespace-only content is rejected
- GIVEN an authorized user attempts to send a message with only whitespace (spaces, tabs, newlines)
- WHEN `sendMessage` is called with content = "   \n\t  "
- THEN the action MUST return error: "Message content is required."
- AND no Message record MUST be created (content is trimmed, becomes empty)

#### Scenario: Content exceeding max length is rejected
- GIVEN an authorized user attempts to send a message with content longer than 2000 characters
- WHEN `sendMessage` is called with content.length > 2000
- THEN the action MUST return error: "Message is too long. Maximum 2000 characters allowed."
- AND no Message record MUST be created

#### Scenario: Content is trimmed before storage
- GIVEN an authorized user sends a message with leading/trailing whitespace
- WHEN `sendMessage` is called with content = "  Hello World  "
- THEN a Message record MUST be created
- AND the stored content MUST be "Hello World" (trimmed)

#### Scenario: Valid content within limits is accepted
- GIVEN an authorized user sends a message with content between 1 and 2000 characters
- WHEN `sendMessage` is called with valid content
- THEN a Message record MUST be created successfully
- AND the content MUST be stored exactly as provided (after trimming)

**Acceptance Criteria:**
- Test file MUST test empty string, whitespace-only string, and content > 2000 chars
- Test file MUST verify trimming behavior (leading/trailing whitespace removed)
- Test file MUST verify valid content is stored correctly
- All content validation error messages MUST match implementation exactly

---

### Requirement: Edge Case Tests

The test suite MUST verify handling of edge cases and error conditions.

#### Scenario: Send message to non-existent gig
- GIVEN a gigId that does not exist in the database
- WHEN `sendMessage` is called with the non-existent gigId
- THEN the action MUST return error: "Gig not found."
- AND no Message record MUST be created

#### Scenario: Message count increases correctly
- GIVEN a gig with N existing messages
- WHEN a new message is sent successfully
- THEN the total message count for the gig MUST be N + 1

#### Scenario: Messages persist across queries
- GIVEN a message is created successfully
- WHEN the message is queried from the database
- THEN the message MUST be retrievable with all fields intact
- AND the message content, senderId, and gigId MUST match the original values

**Acceptance Criteria:**
- Test file MUST test non-existent gig ID
- Test file MUST verify message count before and after creation
- Test file MUST verify message persistence and data integrity

---

## Test Implementation Requirements

### Requirement: Test File Structure

The test suite MUST be organized and follow established patterns.

**Acceptance Criteria:**
- Test file MUST be located at `__tests__/integration/messaging.test.ts`
- Test file MUST use Vitest framework (`describe`, `it`, `expect`)
- Test file MUST import test helpers from `__tests__/helpers/`
- Test file MUST use `getTestPrismaClient()` for database access
- Test file MUST use `withAuthContext()` for authenticated actions
- Test file MUST use `createTestUser()`, `createTestGig()`, `createTestApplication()` factories
- Test file MUST mock `@/lib/prisma`, `next/headers`, and `next/navigation`
- Test file MUST clean up test data using `beforeEach`/`afterEach` hooks
- Test file MUST be organized with clear `describe` blocks for each requirement category

### Requirement: Test Coverage

The test suite MUST achieve comprehensive coverage of messaging functionality.

**Acceptance Criteria:**
- Test file MUST cover all 9 scenarios from messaging-iteration-3 spec (sendMessage action)
- Test file MUST cover all 4 scenarios from messaging-iteration-4 spec (UI edge cases)
- Test file MUST include at least 25 test cases total
- All tests MUST pass consistently
- Test execution MUST complete in under 10 seconds
- Running `npm test messaging.test.ts` MUST show all tests passing

### Requirement: Test Quality

The test suite MUST follow best practices and be maintainable.

**Acceptance Criteria:**
- Each test MUST have a clear, descriptive name
- Each test MUST follow Arrange-Act-Assert pattern
- Each test MUST be independent (no shared state between tests)
- Each test MUST use meaningful assertions (not just "no error thrown")
- Test data MUST use realistic Russian values (names, companies, etc.)
- Error messages in assertions MUST match implementation exactly
- Tests MUST handle async operations correctly (await all promises)
