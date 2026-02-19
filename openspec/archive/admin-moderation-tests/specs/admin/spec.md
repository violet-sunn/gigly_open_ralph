# Admin Moderation Testing Specification

## ADDED Requirements

### Requirement: User Suspension Tests

The platform SHALL have comprehensive tests verifying that user suspension functionality works correctly and prevents suspended users from accessing the platform.

#### Scenario: ADMIN can suspend users

**Given** an ADMIN user is authenticated
**And** a target user exists (CLIENT or SPECIALIST)
**When** the ADMIN calls `suspendUser` with userId and reason
**Then** the target user's `suspended` field SHALL be set to `true`
**And** a ModerationLog entry SHALL be created with action='SUSPEND_USER'
**And** the ModerationLog SHALL record the adminId, targetUserId, and reason
**And** the action SHALL redirect to `/admin/users`

**Acceptance Criteria**:
- Integration test creates ADMIN and target user
- Calls `suspendUser` action with valid FormData
- Verifies user.suspended = true in database
- Verifies ModerationLog entry exists with correct fields
- Verifies redirect occurs (catches NEXT_REDIRECT error)

#### Scenario: Suspended user cannot login

**Given** a user exists with `suspended = true`
**When** the user attempts to login with correct credentials
**Then** the login SHALL fail with error "Your account has been suspended"
**And** no session token SHALL be created
**And** the user SHALL NOT be redirected to dashboard

**Acceptance Criteria**:
- Integration test creates suspended user
- Calls `loginUser` action with correct email/password
- Verifies error message matches "Your account has been suspended"
- Verifies no session cookie is set
- Verifies user remains on login page (no redirect)

#### Scenario: ADMIN can unsuspend users

**Given** an ADMIN user is authenticated
**And** a suspended user exists
**When** the ADMIN calls `unsuspendUser` with userId and reason
**Then** the user's `suspended` field SHALL be set to `false`
**And** a ModerationLog entry SHALL be created with action='UNSUSPEND_USER'
**And** the user SHALL be able to login again

**Acceptance Criteria**:
- Integration test creates ADMIN and suspended user
- Calls `unsuspendUser` action
- Verifies user.suspended = false
- Verifies ModerationLog entry created
- Verifies user can login successfully after unsuspension

#### Scenario: Non-ADMIN cannot suspend users

**Given** a CLIENT or SPECIALIST user is authenticated
**When** they attempt to call `suspendUser`
**Then** the action SHALL return error "Only admins can perform moderation actions."
**And** the target user SHALL NOT be suspended
**And** no ModerationLog entry SHALL be created

**Acceptance Criteria**:
- Test with CLIENT role attempting suspension
- Test with SPECIALIST role attempting suspension
- Both SHALL return authorization error
- Target user remains unsuspended
- No audit log entries created

#### Scenario: Suspension requires reason

**Given** an ADMIN user is authenticated
**When** they call `suspendUser` with empty or whitespace-only reason
**Then** the action SHALL return error "Reason is required for suspension."
**And** the user SHALL NOT be suspended

**Acceptance Criteria**:
- Test with empty string reason
- Test with whitespace-only reason ("   ")
- Both SHALL return validation error
- User remains unsuspended

#### Scenario: Cannot suspend already suspended user

**Given** an ADMIN user is authenticated
**And** a user is already suspended
**When** the ADMIN attempts to suspend them again
**Then** the action SHALL return error "User is already suspended."
**And** no duplicate ModerationLog entry SHALL be created

**Acceptance Criteria**:
- Create user with suspended=true
- Attempt to suspend again
- Verify idempotency error returned
- Verify only one log entry exists (from initial suspension)

---

### Requirement: Gig Closure Tests

The platform SHALL have comprehensive tests verifying that gig closure functionality works correctly and prevents activity on closed gigs.

#### Scenario: ADMIN can close gigs

**Given** an ADMIN user is authenticated
**And** an OPEN gig exists
**When** the ADMIN calls `closeGig` with gigId and reason
**Then** the gig's `closedByAdmin` field SHALL be set to `true`
**And** the gig's `closedAt` field SHALL be set to current timestamp
**And** a ModerationLog entry SHALL be created with action='CLOSE_GIG'
**And** the action SHALL redirect to `/admin/gigs`

**Acceptance Criteria**:
- Integration test creates ADMIN and gig
- Calls `closeGig` action
- Verifies gig.closedByAdmin = true
- Verifies gig.closedAt is set to DateTime
- Verifies ModerationLog entry with correct fields

#### Scenario: Closed gig cannot receive applications

**Given** a gig has been closed by admin (closedByAdmin=true)
**And** a SPECIALIST user is authenticated
**When** the SPECIALIST attempts to apply to the gig
**Then** the application SHALL fail with error "Cannot apply to closed gig"
**And** no Application record SHALL be created

**Acceptance Criteria**:
- Integration test creates closed gig
- SPECIALIST attempts to call `applyToGig` action
- Verifies error message returned
- Verifies no application exists in database
- Test covers OPEN gigs that are closed (not IN_PROGRESS/COMPLETED)

#### Scenario: Closed gig cannot receive messages

**Given** a gig has been closed by admin
**And** the gig has an assigned specialist
**And** the client or specialist is authenticated
**When** they attempt to send a message to the gig
**Then** the message SHALL fail with error "Cannot send messages to closed gig"
**And** no Message record SHALL be created

**Acceptance Criteria**:
- Integration test creates closed gig with assigned specialist
- Client attempts to call `sendMessage` action
- Specialist attempts to call `sendMessage` action
- Both SHALL return error
- No messages created in database

#### Scenario: Non-ADMIN cannot close gigs

**Given** a CLIENT or SPECIALIST user is authenticated
**When** they attempt to call `closeGig`
**Then** the action SHALL return error "Only admins can perform moderation actions."
**And** the gig SHALL NOT be closed
**And** no ModerationLog entry SHALL be created

**Acceptance Criteria**:
- Test with CLIENT (even gig owner) attempting closure
- Test with SPECIALIST attempting closure
- Both SHALL return authorization error
- Gig remains open (closedByAdmin=false)

#### Scenario: Gig closure requires reason

**Given** an ADMIN user is authenticated
**When** they call `closeGig` with empty or whitespace-only reason
**Then** the action SHALL return error "Reason is required for closing a gig."
**And** the gig SHALL NOT be closed

**Acceptance Criteria**:
- Test with empty string reason
- Test with whitespace-only reason
- Both SHALL return validation error
- Gig remains open

#### Scenario: Cannot close already closed gig

**Given** an ADMIN user is authenticated
**And** a gig is already closed by admin
**When** the ADMIN attempts to close it again
**Then** the action SHALL return error "Gig is already closed."
**And** no duplicate ModerationLog entry SHALL be created

**Acceptance Criteria**:
- Create gig with closedByAdmin=true
- Attempt to close again
- Verify idempotency error returned
- Verify only one log entry exists

---

### Requirement: Moderation Logging Tests

The platform SHALL have comprehensive tests verifying that all moderation actions are properly logged for audit purposes.

#### Scenario: Moderation actions create audit logs

**Given** an ADMIN performs any moderation action
**When** the action completes successfully
**Then** a ModerationLog entry SHALL be created
**And** the log SHALL include: action type, reason, adminId, timestamp
**And** the log SHALL include targetUserId (for user actions) or targetGigId (for gig actions)

**Acceptance Criteria**:
- Test SUSPEND_USER creates log with targetUserId
- Test UNSUSPEND_USER creates log with targetUserId
- Test CLOSE_GIG creates log with targetGigId
- All logs include adminId, reason, createdAt
- Logs are created atomically with the moderation action (transaction)

#### Scenario: Failed moderation actions do not create logs

**Given** an ADMIN attempts a moderation action
**When** the action fails validation or authorization
**Then** no ModerationLog entry SHALL be created

**Acceptance Criteria**:
- Attempt suspension with empty reason - no log created
- Attempt suspension as non-ADMIN - no log created
- Attempt to suspend non-existent user - no log created
- Verify ModerationLog table remains empty after failed attempts

#### Scenario: Moderation logs are immutable

**Given** a ModerationLog entry exists
**When** time passes or subsequent actions occur
**Then** the log entry SHALL NOT be modified or deleted
**And** the log SHALL remain as permanent audit trail

**Acceptance Criteria**:
- Create moderation log
- Perform subsequent actions (unsuspend, etc.)
- Verify original log entry unchanged
- Verify both logs exist (suspend + unsuspend)

---

### Requirement: Moderation History Visibility Tests

The platform SHALL have tests verifying that admins can view moderation history and that logs are properly filtered and displayed.

#### Scenario: ADMIN can retrieve all moderation logs

**Given** multiple moderation actions have been performed
**And** an ADMIN user is authenticated
**When** the ADMIN queries ModerationLog table
**Then** all moderation logs SHALL be returned
**And** logs SHALL include admin, targetUser, and targetGig relations
**And** logs SHALL be ordered by createdAt descending (newest first)

**Acceptance Criteria**:
- Integration test creates multiple moderation actions
- Queries ModerationLog with includes for relations
- Verifies all logs returned
- Verifies ordering by createdAt DESC
- Verifies relations are populated (admin.email, targetUser.email, targetGig.title)

#### Scenario: ADMIN can filter logs by action type

**Given** moderation logs of different types exist
**When** the ADMIN queries logs filtered by action type
**Then** only logs matching the action type SHALL be returned

**Acceptance Criteria**:
- Create SUSPEND_USER, UNSUSPEND_USER, and CLOSE_GIG logs
- Query with where: { action: 'SUSPEND_USER' }
- Verify only suspension logs returned
- Test all three action types

#### Scenario: ADMIN can filter logs by target user

**Given** moderation logs for multiple users exist
**When** the ADMIN queries logs filtered by targetUserId
**Then** only logs for that user SHALL be returned
**And** logs SHALL include both SUSPEND and UNSUSPEND actions

**Acceptance Criteria**:
- Create logs for multiple users
- Query with where: { targetUserId: specificUserId }
- Verify only logs for that user returned
- Verify both suspension and unsuspension logs included

#### Scenario: ADMIN can filter logs by target gig

**Given** moderation logs for multiple gigs exist
**When** the ADMIN queries logs filtered by targetGigId
**Then** only logs for that gig SHALL be returned

**Acceptance Criteria**:
- Create logs for multiple gigs
- Query with where: { targetGigId: specificGigId }
- Verify only logs for that gig returned

#### Scenario: Non-ADMIN cannot access moderation logs

**Given** a CLIENT or SPECIALIST user is authenticated
**When** they attempt to query ModerationLog table
**Then** the query SHALL be blocked by authorization middleware
**Or** the query SHALL return empty results (depending on implementation)

**Acceptance Criteria**:
- This is a note for future implementation
- Current tests focus on ADMIN access
- Authorization for log viewing should be enforced at route/API level

---

### Requirement: Authorization Tests

The platform SHALL have comprehensive tests verifying that moderation actions are restricted to ADMIN role only.

#### Scenario: Only ADMIN can suspend users

**Given** users with CLIENT, SPECIALIST, and ADMIN roles exist
**When** each role attempts to suspend a user
**Then** only ADMIN SHALL succeed
**And** CLIENT and SPECIALIST SHALL receive authorization error

**Acceptance Criteria**:
- Test covered in "Non-ADMIN cannot suspend users" scenario above
- Verify error message: "Only admins can perform moderation actions."

#### Scenario: Only ADMIN can unsuspend users

**Given** users with CLIENT, SPECIALIST, and ADMIN roles exist
**When** each role attempts to unsuspend a user
**Then** only ADMIN SHALL succeed
**And** CLIENT and SPECIALIST SHALL receive authorization error

**Acceptance Criteria**:
- Test with CLIENT attempting unsuspension
- Test with SPECIALIST attempting unsuspension
- Both SHALL return authorization error
- User remains suspended

#### Scenario: Only ADMIN can close gigs

**Given** users with CLIENT, SPECIALIST, and ADMIN roles exist
**When** each role attempts to close a gig
**Then** only ADMIN SHALL succeed
**And** CLIENT and SPECIALIST SHALL receive authorization error
**And** even the gig owner (CLIENT) SHALL NOT be able to close via admin action

**Acceptance Criteria**:
- Test covered in "Non-ADMIN cannot close gigs" scenario above
- Verify gig owner cannot use admin closure action

#### Scenario: Unauthenticated users cannot perform moderation

**Given** no user is authenticated
**When** moderation actions are attempted
**Then** all actions SHALL redirect to /login
**And** no moderation SHALL occur

**Acceptance Criteria**:
- Test suspendUser without session - redirects to /login
- Test unsuspendUser without session - redirects to /login
- Test closeGig without session - redirects to /login

---

### Requirement: Edge Cases and Validation Tests

The platform SHALL have tests covering edge cases, validation rules, and error handling for moderation actions.

#### Scenario: Cannot suspend non-existent user

**Given** an ADMIN user is authenticated
**When** they attempt to suspend a user with invalid/non-existent userId
**Then** the action SHALL return error "User not found."
**And** no ModerationLog entry SHALL be created

**Acceptance Criteria**:
- Test with random UUID that doesn't exist
- Verify error message
- Verify no log created

#### Scenario: Cannot unsuspend non-existent user

**Given** an ADMIN user is authenticated
**When** they attempt to unsuspend a user with invalid userId
**Then** the action SHALL return error "User not found."

**Acceptance Criteria**:
- Test with non-existent userId
- Verify error message

#### Scenario: Cannot unsuspend non-suspended user

**Given** an ADMIN user is authenticated
**And** a user exists with suspended=false
**When** the ADMIN attempts to unsuspend them
**Then** the action SHALL return error "User is not suspended."

**Acceptance Criteria**:
- Create user with suspended=false
- Attempt unsuspension
- Verify error message

#### Scenario: Cannot close non-existent gig

**Given** an ADMIN user is authenticated
**When** they attempt to close a gig with invalid gigId
**Then** the action SHALL return error "Gig not found."
**And** no ModerationLog entry SHALL be created

**Acceptance Criteria**:
- Test with non-existent gigId
- Verify error message
- Verify no log created

#### Scenario: Moderation actions use database transactions

**Given** an ADMIN performs a moderation action
**When** the action involves multiple database operations
**Then** all operations SHALL be wrapped in a transaction
**And** if any operation fails, all SHALL be rolled back

**Acceptance Criteria**:
- Verify suspendUser uses prisma.$transaction
- Verify unsuspendUser uses prisma.$transaction
- Verify closeGig uses prisma.$transaction
- This ensures atomicity: either both user update AND log creation succeed, or neither

#### Scenario: Reason field is trimmed

**Given** an ADMIN provides a reason with leading/trailing whitespace
**When** the moderation action is performed
**Then** the reason SHALL be trimmed before storage
**And** the ModerationLog SHALL contain the trimmed reason

**Acceptance Criteria**:
- Test with reason "  Spam content  "
- Verify stored reason is "Spam content" (trimmed)
- Applies to all three actions: suspend, unsuspend, close

---

### Requirement: Integration with Existing Features

The platform SHALL have tests verifying that moderation actions integrate correctly with existing authentication and gig lifecycle features.

#### Scenario: Suspended user session is invalidated

**Given** a user is logged in with active session
**When** an ADMIN suspends the user
**Then** the user's existing session SHALL remain valid until next request
**But** subsequent login attempts SHALL fail
**And** the user SHALL be logged out on next page load (middleware check)

**Acceptance Criteria**:
- Note: Current implementation doesn't invalidate existing sessions
- Test verifies that suspended users cannot LOGIN (new sessions)
- Existing session invalidation is a future enhancement
- Document this behavior in test comments

#### Scenario: Closed gig status is independent of closedByAdmin

**Given** a gig with status IN_PROGRESS
**When** an ADMIN closes the gig
**Then** the gig's status field SHALL remain IN_PROGRESS
**And** the closedByAdmin field SHALL be true
**And** the gig SHALL be effectively closed (no new applications/messages)

**Acceptance Criteria**:
- Create gig with status='IN_PROGRESS'
- Close via admin action
- Verify status still 'IN_PROGRESS'
- Verify closedByAdmin=true
- Verify applications are blocked

#### Scenario: Closed gig appears in admin gig list

**Given** multiple gigs exist, some closed by admin
**When** the ADMIN views the gig management page
**Then** closed gigs SHALL be visible
**And** closed gigs SHALL be marked with closedByAdmin indicator
**And** closed gigs SHALL show closedAt timestamp

**Acceptance Criteria**:
- This is a UI test (out of scope for integration tests)
- Integration test verifies data is queryable:
  - Query gigs with where: { closedByAdmin: true }
  - Verify closedAt field is populated
  - Verify closed gigs are returned with correct data
