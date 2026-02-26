# Gig Specification Delta: Message Notifications

## ADDED Requirements

### Requirement: Create Notification on Message Send
The `sendMessage` server action MUST create or update a notification record for the message recipient.

#### Scenario: Sending message creates notification for recipient
- GIVEN an authenticated CLIENT user who owns gig "abc123"
- AND the gig has an assigned SPECIALIST user with ID "specialist-456"
- WHEN the CLIENT calls `sendMessage` with valid content
- THEN a Message record MUST be created
- AND a Notification record MUST be created or updated for userId="specialist-456" and gigId="abc123"
- AND the Notification `lastReadAt` MUST remain unchanged (or null if new record)
- AND the action MUST redirect to `/dashboard/gigs/abc123`

#### Scenario: Sending message as specialist creates notification for client
- GIVEN an authenticated SPECIALIST user who is assigned to gig "abc123"
- AND the gig is owned by CLIENT user with ID "client-789"
- WHEN the SPECIALIST calls `sendMessage` with valid content
- THEN a Message record MUST be created
- AND a Notification record MUST be created or updated for userId="client-789" and gigId="abc123"
- AND the Notification `lastReadAt` MUST remain unchanged (or null if new record)

#### Scenario: Notification creation does not affect message send success
- GIVEN an authenticated user sends a valid message
- WHEN the notification creation fails (e.g., database error)
- THEN the message MUST still be created successfully
- AND the error MUST be logged but not returned to the user
- AND the action MUST redirect normally

#### Scenario: Notification is not created for sender
- GIVEN an authenticated user sends a message on gig "abc123"
- WHEN the message is sent
- THEN a Notification record MUST NOT be created or updated for the sender's userId
- AND only the recipient's notification MUST be affected

**Acceptance Criteria:**
- `sendMessage` action creates/updates Notification record for recipient
- Uses Prisma `upsert` operation: create if not exists, update `updatedAt` if exists
- Does NOT modify `lastReadAt` field (only recipient can mark as read)
- Notification creation happens in the same transaction as message creation
- Sender's notification is not affected
- Error handling: log notification errors but don't fail message send

---

### Requirement: Fetch Unread Notifications Server Action
The system MUST provide a `getUnreadNotifications` server action that returns gigs with unread messages for the authenticated user.

#### Scenario: Fetch unread notifications for CLIENT
- GIVEN an authenticated CLIENT user with ID "client-123"
- AND the user owns 3 gigs with unread messages
- WHEN `getUnreadNotifications` is called
- THEN it MUST return an array of 3 notification objects
- AND each object MUST include:
  - gigId
  - gig title
  - last message sender name (specialist display name or email)
  - last message timestamp
  - unread count (number of messages after lastReadAt)

#### Scenario: Fetch unread notifications for SPECIALIST
- GIVEN an authenticated SPECIALIST user with ID "specialist-456"
- AND the user is assigned to 2 gigs with unread messages
- WHEN `getUnreadNotifications` is called
- THEN it MUST return an array of 2 notification objects
- AND each object MUST include gig details and last message info

#### Scenario: Unread notifications exclude gigs with no new messages
- GIVEN an authenticated user has notification records for 5 gigs
- AND 3 gigs have messages after the user's lastReadAt timestamp
- AND 2 gigs have no messages after lastReadAt
- WHEN `getUnreadNotifications` is called
- THEN it MUST return only the 3 gigs with new messages

#### Scenario: Unread notifications include gigs with no notification record
- GIVEN an authenticated user is assigned to gig "abc123"
- AND the gig has 2 messages from the client
- AND no Notification record exists for this user-gig pair
- WHEN `getUnreadNotifications` is called
- THEN it MUST include gig "abc123" in the results (never read = unread)

#### Scenario: Unread notifications exclude closed gigs
- GIVEN an authenticated user has unread messages on gig "abc123"
- AND the gig has closedByAdmin = true
- WHEN `getUnreadNotifications` is called
- THEN it MUST NOT include gig "abc123" in the results

#### Scenario: Unread notifications exclude gigs where user only sent messages
- GIVEN an authenticated user has sent 3 messages on gig "abc123"
- AND no other user has sent messages on this gig
- WHEN `getUnreadNotifications` is called
- THEN it MUST NOT include gig "abc123" in the results

#### Scenario: Unauthenticated user attempts to fetch notifications
- GIVEN no valid session
- WHEN `getUnreadNotifications` is called
- THEN it MUST redirect to `/login`

#### Scenario: Notifications sorted by most recent message first
- GIVEN an authenticated user has unread messages on 5 gigs
- WHEN `getUnreadNotifications` is called
- THEN the results MUST be sorted by last message timestamp (descending)
- AND the gig with the most recent message MUST be first

**Acceptance Criteria:**
- `getUnreadNotifications` is exported from `app/actions/notification.ts` with `'use server'`
- Returns array of notification objects with gig details and last message info
- Only includes gigs where user is owner OR assigned specialist
- Only includes gigs with messages from other users (not just own messages)
- Excludes closed gigs (closedByAdmin = true)
- Handles gigs with no Notification record (treats as unread)
- Sorted by most recent message first
- Query is efficient (< 100ms for 1000+ messages)
- Uses proper indexes (userId, gigId, createdAt)

---

### Requirement: Mark Notification as Read Server Action
The system MUST provide a `markNotificationAsRead` server action that updates the lastReadAt timestamp for a user-gig pair.

#### Scenario: Mark notification as read for gig owner
- GIVEN an authenticated CLIENT user who owns gig "abc123"
- WHEN `markNotificationAsRead` is called with gigId="abc123"
- THEN the Notification record for this user-gig pair MUST be created or updated
- AND `lastReadAt` MUST be set to the current timestamp (new Date())
- AND the action MUST return success

#### Scenario: Mark notification as read for assigned specialist
- GIVEN an authenticated SPECIALIST user who is assigned to gig "abc123"
- WHEN `markNotificationAsRead` is called with gigId="abc123"
- THEN the Notification record for this user-gig pair MUST be created or updated
- AND `lastReadAt` MUST be set to the current timestamp

#### Scenario: Create notification record if none exists
- GIVEN an authenticated user visits gig "abc123" for the first time
- AND no Notification record exists for this user-gig pair
- WHEN `markNotificationAsRead` is called with gigId="abc123"
- THEN a new Notification record MUST be created
- AND `lastReadAt` MUST be set to the current timestamp

#### Scenario: Update existing notification record
- GIVEN an authenticated user has a Notification record for gig "abc123" with lastReadAt="2026-02-20 10:00"
- WHEN `markNotificationAsRead` is called with gigId="abc123" at "2026-02-20 15:00"
- THEN the existing Notification record MUST be updated
- AND `lastReadAt` MUST be set to "2026-02-20 15:00"

#### Scenario: Unauthorized user cannot mark as read
- GIVEN an authenticated SPECIALIST user who is NOT assigned to gig "abc123"
- WHEN `markNotificationAsRead` is called with gigId="abc123"
- THEN it MUST return `{ error: 'You are not authorized to mark this notification as read.' }`
- AND no Notification record MUST be created or updated

#### Scenario: Unauthenticated user attempts to mark as read
- GIVEN no valid session
- WHEN `markNotificationAsRead` is called
- THEN it MUST redirect to `/login`

#### Scenario: Mark as read for non-existent gig
- GIVEN a gigId that does not exist
- WHEN `markNotificationAsRead` is called
- THEN it MUST return `{ error: 'Gig not found.' }`

#### Scenario: Mark as read is idempotent
- GIVEN a user calls `markNotificationAsRead` for gig "abc123" multiple times
- WHEN the action is called repeatedly
- THEN each call MUST update the `lastReadAt` timestamp
- AND no duplicate Notification records MUST be created
- AND no errors MUST be returned

**Acceptance Criteria:**
- `markNotificationAsRead` is exported from `app/actions/notification.ts` with `'use server'`
- Signature is `(gigId: string) => Promise<{ error?: string }>`
- Uses Prisma `upsert` operation (create if not exists, update if exists)
- Authorization check: user is gig owner OR assigned specialist
- Sets `lastReadAt` to `new Date()`
- Returns `{ error: string }` on failure
- Returns `{}` (empty object) on success
- Operation is fast (< 50ms)
- Idempotent (safe to call multiple times)

---

### Requirement: Get Unread Count Server Action
The system MUST provide a `getUnreadCount` server action that returns the total number of gigs with unread messages.

#### Scenario: Get unread count for user with unread messages
- GIVEN an authenticated user with unread messages on 5 gigs
- WHEN `getUnreadCount` is called
- THEN it MUST return `{ count: 5 }`

#### Scenario: Get unread count for user with no unread messages
- GIVEN an authenticated user with zero unread messages
- WHEN `getUnreadCount` is called
- THEN it MUST return `{ count: 0 }`

#### Scenario: Unread count excludes closed gigs
- GIVEN an authenticated user has unread messages on 3 gigs
- AND 1 of those gigs has closedByAdmin = true
- WHEN `getUnreadCount` is called
- THEN it MUST return `{ count: 2 }`

#### Scenario: Unread count only includes gigs where user is participant
- GIVEN a SPECIALIST user who is assigned to 2 gigs with unread messages
- AND has applied to 5 other gigs (not assigned)
- WHEN `getUnreadCount` is called
- THEN it MUST return `{ count: 2 }` (only assigned gigs)

#### Scenario: Unauthenticated user attempts to get count
- GIVEN no valid session
- WHEN `getUnreadCount` is called
- THEN it MUST redirect to `/login`

**Acceptance Criteria:**
- `getUnreadCount` is exported from `app/actions/notification.ts` with `'use server'`
- Returns `{ count: number }`
- Count logic matches `getUnreadNotifications` (same filtering rules)
- Query is efficient (< 50ms for 1000+ messages)
- Uses COUNT query instead of fetching all records
