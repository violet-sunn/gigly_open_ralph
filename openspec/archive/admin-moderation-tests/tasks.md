# Implementation Tasks: Admin Moderation Tests

## Task 1: Test Suspended User Login Prevention

**Priority**: CRITICAL (fills major gap in test coverage)

### Implementation Notes
- Create new test file: `__tests__/integration/suspended-user-login.test.ts`
- Test the `loginUser` action from `@/app/actions/auth.ts`
- Verify that suspended users receive specific error message
- Verify that no session token is created for suspended users

### Scenarios to Cover
1. Suspended user attempts login with correct credentials → fails with "Your account has been suspended"
2. Suspended user attempts login with incorrect credentials → fails with password error (not suspension error)
3. Non-suspended user can login normally (baseline)
4. User suspended after login → existing session remains valid (document current behavior)

### Test Plan
```typescript
// Pseudo-code structure
describe('Suspended User Login Prevention', () => {
  it('suspended user cannot login with correct credentials', async () => {
    // Create user with suspended=true
    // Attempt login with correct password
    // Verify error: "Your account has been suspended"
    // Verify no session token created
  })

  it('suspended user gets suspension error, not password error', async () => {
    // Create suspended user
    // Attempt login with wrong password
    // Verify suspension error takes precedence
  })

  it('non-suspended user can login normally', async () => {
    // Create user with suspended=false
    // Login successfully
    // Verify session created
  })
})
```

### Acceptance Criteria
- [ ] All 3 test scenarios pass
- [ ] Tests use `withAuthContext` helper for authentication
- [ ] Tests verify error messages match exactly
- [ ] Tests verify no session cookie is set for suspended users
- [ ] Run `npm run test:unit` - all tests pass

---

## Task 2: Test Closed Gig Application Prevention

**Priority**: HIGH

### Implementation Notes
- Create new test file: `__tests__/integration/closed-gig-applications.test.ts`
- Test the `applyToGig` action from `@/app/actions/application.ts`
- Verify that applications to closed gigs are rejected
- Test across different gig statuses (OPEN, IN_PROGRESS, etc.)

### Scenarios to Cover
1. SPECIALIST cannot apply to closed OPEN gig
2. SPECIALIST cannot apply to closed IN_PROGRESS gig
3. SPECIALIST can apply to non-closed OPEN gig (baseline)
4. Application rejection returns specific error message
5. No Application record is created when rejected

### Test Plan
```typescript
describe('Closed Gig Application Prevention', () => {
  it('cannot apply to closed OPEN gig', async () => {
    // Create gig with status='OPEN', closedByAdmin=true
    // SPECIALIST attempts to apply
    // Verify error: "Cannot apply to closed gig"
    // Verify no application created
  })

  it('cannot apply to closed IN_PROGRESS gig', async () => {
    // Create gig with status='IN_PROGRESS', closedByAdmin=true
    // SPECIALIST attempts to apply
    // Verify error returned
  })

  it('can apply to non-closed OPEN gig', async () => {
    // Create gig with closedByAdmin=false
    // SPECIALIST applies successfully
    // Verify application created
  })
})
```

### Acceptance Criteria
- [ ] All test scenarios pass
- [ ] Tests verify error message matches expected text
- [ ] Tests verify no Application records created for closed gigs
- [ ] Tests use transaction rollback for isolation
- [ ] Run `npm run test:unit` - all tests pass

---

## Task 3: Test Closed Gig Message Prevention

**Priority**: HIGH

### Implementation Notes
- Create new test file: `__tests__/integration/closed-gig-messages.test.ts`
- Test the `sendMessage` action from `@/app/actions/message.ts`
- Verify that messages to closed gigs are rejected
- Test for both CLIENT and SPECIALIST senders

### Scenarios to Cover
1. CLIENT cannot send message to closed gig
2. SPECIALIST cannot send message to closed gig
3. CLIENT can send message to non-closed gig (baseline)
4. SPECIALIST can send message to non-closed gig (baseline)
5. Message rejection returns specific error message
6. No Message record is created when rejected

### Test Plan
```typescript
describe('Closed Gig Message Prevention', () => {
  it('client cannot send message to closed gig', async () => {
    // Create closed gig with assigned specialist
    // CLIENT (gig owner) attempts to send message
    // Verify error: "Cannot send messages to closed gig"
    // Verify no message created
  })

  it('specialist cannot send message to closed gig', async () => {
    // Create closed gig with assigned specialist
    // SPECIALIST attempts to send message
    // Verify error returned
    // Verify no message created
  })

  it('can send messages to non-closed gig', async () => {
    // Create non-closed gig with assigned specialist
    // Both CLIENT and SPECIALIST send messages
    // Verify messages created
  })
})
```

### Acceptance Criteria
- [ ] All test scenarios pass
- [ ] Tests verify both CLIENT and SPECIALIST are blocked
- [ ] Tests verify error message matches expected text
- [ ] Tests verify no Message records created for closed gigs
- [ ] Run `npm run test:unit` - all tests pass

---

## Task 4: Test Moderation Logging and History

**Priority**: MEDIUM

### Implementation Notes
- Create new test file: `__tests__/integration/moderation-logging.test.ts`
- Test ModerationLog creation for all moderation actions
- Test querying and filtering moderation logs
- Verify audit trail integrity

### Scenarios to Cover
1. SUSPEND_USER creates log with correct fields
2. UNSUSPEND_USER creates log with correct fields
3. CLOSE_GIG creates log with correct fields
4. Failed actions do not create logs
5. Logs are immutable (not modified by subsequent actions)
6. ADMIN can query all logs
7. ADMIN can filter logs by action type
8. ADMIN can filter logs by targetUserId
9. ADMIN can filter logs by targetGigId
10. Logs include relations (admin, targetUser, targetGig)

### Test Plan
```typescript
describe('Moderation Logging', () => {
  it('creates log when suspending user', async () => {
    // ADMIN suspends user
    // Query ModerationLog
    // Verify action='SUSPEND_USER', adminId, targetUserId, reason
  })

  it('does not create log on failed action', async () => {
    // ADMIN attempts suspension with empty reason
    // Verify no ModerationLog entry created
  })

  it('logs are immutable', async () => {
    // ADMIN suspends user (creates log1)
    // ADMIN unsuspends user (creates log2)
    // Verify both logs exist unchanged
  })

  it('can filter logs by action type', async () => {
    // Create multiple log types
    // Query with where: { action: 'SUSPEND_USER' }
    // Verify only suspension logs returned
  })

  it('can filter logs by target user', async () => {
    // Create logs for multiple users
    // Query with where: { targetUserId }
    // Verify only logs for that user returned
  })
})
```

### Acceptance Criteria
- [ ] All 10 test scenarios pass
- [ ] Tests verify log fields match spec
- [ ] Tests verify logs include relations (admin.email, targetUser.email, etc.)
- [ ] Tests verify logs are ordered by createdAt DESC
- [ ] Run `npm run test:unit` - all tests pass

---

## Task 5: Test Edge Cases and Validation

**Priority**: MEDIUM

### Implementation Notes
- Create new test file: `__tests__/integration/moderation-edge-cases.test.ts`
- Test validation rules for all moderation actions
- Test idempotency (cannot suspend already suspended user, etc.)
- Test error handling for non-existent entities

### Scenarios to Cover
1. Cannot suspend with empty reason
2. Cannot suspend with whitespace-only reason
3. Cannot suspend already suspended user
4. Cannot suspend non-existent user
5. Cannot unsuspend with empty reason
6. Cannot unsuspend non-suspended user
7. Cannot unsuspend non-existent user
8. Cannot close gig with empty reason
9. Cannot close already closed gig
10. Cannot close non-existent gig
11. Reason field is trimmed before storage
12. Moderation actions use database transactions

### Test Plan
```typescript
describe('Moderation Edge Cases', () => {
  it('rejects suspension with empty reason', async () => {
    // ADMIN attempts suspension with reason=""
    // Verify error: "Reason is required for suspension."
    // Verify user not suspended
  })

  it('rejects suspension of already suspended user', async () => {
    // Create user with suspended=true
    // ADMIN attempts suspension
    // Verify error: "User is already suspended."
  })

  it('rejects suspension of non-existent user', async () => {
    // ADMIN attempts suspension with invalid userId
    // Verify error: "User not found."
  })

  it('trims reason before storage', async () => {
    // ADMIN suspends with reason="  Spam  "
    // Query ModerationLog
    // Verify reason="Spam" (trimmed)
  })

  it('uses transaction for atomicity', async () => {
    // Verify suspendUser calls prisma.$transaction
    // Verify both user update and log creation succeed or fail together
    // (This may require mocking to test transaction rollback)
  })
})
```

### Acceptance Criteria
- [ ] All 12 test scenarios pass
- [ ] Tests verify exact error messages
- [ ] Tests verify idempotency (no duplicate logs)
- [ ] Tests verify validation rules enforced
- [ ] Tests verify reason trimming works
- [ ] Run `npm run test:unit` - all tests pass

---

## Task 6: Test Authorization for All Roles

**Priority**: HIGH

### Implementation Notes
- Extend existing `__tests__/integration/admin-authorization.test.ts`
- Add missing authorization scenarios
- Test unauthenticated access
- Verify error messages are consistent

### Scenarios to Cover
1. CLIENT cannot unsuspend users (add to existing file)
2. SPECIALIST cannot unsuspend users (add to existing file)
3. Unauthenticated user cannot suspend (redirects to /login)
4. Unauthenticated user cannot unsuspend (redirects to /login)
5. Unauthenticated user cannot close gig (redirects to /login)
6. Gig owner (CLIENT) cannot use admin close action

### Test Plan
```typescript
describe('Admin Authorization Tests', () => {
  // Existing tests remain...

  it('CLIENT cannot unsuspend users', async () => {
    // Create CLIENT and suspended user
    // CLIENT attempts unsuspension
    // Verify error: "Only admins can perform moderation actions."
  })

  it('unauthenticated user cannot suspend', async () => {
    // No session set
    // Attempt suspendUser
    // Verify redirect to /login (NEXT_REDIRECT error)
  })

  it('gig owner cannot use admin close action', async () => {
    // Create CLIENT and their own gig
    // CLIENT attempts closeGig (admin action)
    // Verify authorization error
    // Note: Gig owner can delete/cancel via different action (future)
  })
})
```

### Acceptance Criteria
- [ ] All 6 new test scenarios pass
- [ ] Tests verify authorization errors are consistent
- [ ] Tests verify redirects for unauthenticated access
- [ ] Existing tests continue to pass
- [ ] Run `npm run test:unit` - all tests pass

---

## Task 7: Integration with Existing Features

**Priority**: LOW (documentation and verification)

### Implementation Notes
- Create new test file: `__tests__/integration/moderation-integration.test.ts`
- Document current behavior of moderation with existing features
- Test interactions between moderation and gig lifecycle
- Verify data integrity across features

### Scenarios to Cover
1. Closed gig status field is independent of closedByAdmin
2. Closed IN_PROGRESS gig remains IN_PROGRESS
3. Closed gig is queryable by admin
4. Suspended user's gigs remain accessible
5. Suspended user's applications remain visible
6. Document: Existing sessions not invalidated on suspension

### Test Plan
```typescript
describe('Moderation Integration', () => {
  it('closed gig status is independent of closedByAdmin', async () => {
    // Create gig with status='IN_PROGRESS'
    // ADMIN closes gig
    // Verify status still 'IN_PROGRESS'
    // Verify closedByAdmin=true
  })

  it('closed gigs are queryable', async () => {
    // Create multiple gigs, close some
    // Query with where: { closedByAdmin: true }
    // Verify closed gigs returned with closedAt timestamp
  })

  it('suspended user gigs remain accessible', async () => {
    // Create CLIENT with gigs
    // ADMIN suspends CLIENT
    // Query gigs by clientId
    // Verify gigs still exist and queryable
  })

  it('documents session invalidation behavior', async () => {
    // Note in test comments:
    // Current implementation does not invalidate existing sessions
    // Suspended users cannot create NEW sessions (login)
    // Existing sessions remain valid until expiry
    // Future enhancement: invalidate on suspension
  })
})
```

### Acceptance Criteria
- [ ] All test scenarios pass
- [ ] Tests document current behavior in comments
- [ ] Tests verify data integrity (no cascading deletes)
- [ ] Tests verify closedByAdmin is independent of status
- [ ] Run `npm run test:unit` - all tests pass

---

## Task 8: Update Test Documentation

**Priority**: LOW

### Implementation Notes
- Update `TESTING.md` with admin moderation test examples
- Document test patterns used
- Add section on testing moderation features

### Changes to Make
1. Add "Testing Admin Moderation" section to TESTING.md
2. Include example of testing suspended user login
3. Include example of testing closed gig restrictions
4. Document use of ModerationLog queries in tests
5. Add note about transaction testing patterns

### Acceptance Criteria
- [ ] TESTING.md includes admin moderation section
- [ ] Examples are clear and well-commented
- [ ] Documentation explains test patterns used
- [ ] Documentation is consistent with existing style

---

## Summary

### Test Files to Create
1. `__tests__/integration/suspended-user-login.test.ts` (Task 1)
2. `__tests__/integration/closed-gig-applications.test.ts` (Task 2)
3. `__tests__/integration/closed-gig-messages.test.ts` (Task 3)
4. `__tests__/integration/moderation-logging.test.ts` (Task 4)
5. `__tests__/integration/moderation-edge-cases.test.ts` (Task 5)
6. `__tests__/integration/moderation-integration.test.ts` (Task 7)

### Test Files to Extend
1. `__tests__/integration/admin-authorization.test.ts` (Task 6)

### Documentation to Update
1. `TESTING.md` (Task 8)

### Total Test Scenarios
- Task 1: 4 scenarios
- Task 2: 5 scenarios
- Task 3: 6 scenarios
- Task 4: 10 scenarios
- Task 5: 12 scenarios
- Task 6: 6 scenarios
- Task 7: 6 scenarios
- **Total: 49 new test scenarios**

### Estimated Coverage
- Existing: 6 scenarios (from admin-authorization.test.ts)
- New: 49 scenarios
- **Total: 55 test scenarios covering all admin moderation requirements**

### Implementation Order
1. **Task 1** (CRITICAL) - Suspended user login prevention
2. **Task 2** (HIGH) - Closed gig applications
3. **Task 3** (HIGH) - Closed gig messages
4. **Task 6** (HIGH) - Authorization tests
5. **Task 4** (MEDIUM) - Moderation logging
6. **Task 5** (MEDIUM) - Edge cases
7. **Task 7** (LOW) - Integration tests
8. **Task 8** (LOW) - Documentation

### Running Tests
After each task:
```bash
npm run test:unit
```

After all tasks:
```bash
npm run test:coverage
```

Verify coverage for:
- `app/actions/moderation.ts` - should be >95%
- `app/actions/auth.ts` (login with suspension check) - should include new scenarios
- `app/actions/application.ts` (closed gig check) - should include new scenarios
- `app/actions/message.ts` (closed gig check) - should include new scenarios
