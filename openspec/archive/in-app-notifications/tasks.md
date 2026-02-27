# Implementation Tasks: In-App Notifications for Applications and Status Changes

## Task 1: Extend Notification Model Schema

**Description**: Add type, eventType, and eventData fields to the Notification model to support different notification types.

**Implementation Notes**:
- Edit `prisma/schema.prisma`
- Add three new fields to Notification model:
  - `type` (String, default "MESSAGE") - values: "MESSAGE", "APPLICATION", "STATUS_CHANGE"
  - `eventType` (String?, optional) - specific event like "application_submitted", "work_approved"
  - `eventData` (String?, optional) - JSON string for event-specific metadata
- Run `npx prisma format` to validate syntax
- Run `npx prisma migrate dev --name extend-notification-model` to create migration
- Verify migration includes proper defaults for existing records
- Test backward compatibility: existing notifications should work without type field

**Test Plan**:
```bash
# Validate schema
npx prisma validate

# Check migration was created
ls prisma/migrations/ | grep extend-notification-model

# Verify database structure
npx prisma studio
# Navigate to Notification model and verify new fields exist

# Test backward compatibility
# Run existing notification tests to ensure they still pass
npm run test:unit -- notifications.test.ts
```

---

## Task 2: Create Notification Helper Function

**Description**: Create a reusable helper function for creating notifications with proper error handling.

**Implementation Notes**:
- Create `lib/notifications.ts` file
- Implement `createNotification` helper function:
  - Parameters: userId, gigId, type, eventType, eventData (optional)
  - Uses prisma.notification.create()
  - Wraps in try-catch to log errors without throwing
  - Returns void (fire-and-forget pattern)
- Implement `createNotificationsBulk` helper function for performance optimization:
  - Parameters: array of notification objects [{ userId, gigId, type, eventType, eventData }]
  - Uses prisma.notification.createMany() for batch insertion
  - Wraps in try-catch to log errors without throwing
  - Returns void (fire-and-forget pattern)
  - Use this for bulk operations like auto-rejecting multiple applications
- Implement `getNotificationDisplayText` helper function:
  - Parameters: notification object with type, eventType, eventData
  - Returns formatted display text based on notification type
  - Handles all event types: application_submitted, application_accepted, application_rejected, application_withdrawn, work_submitted, work_approved, payment_marked
- Implement `getNotificationIcon` helper function:
  - Returns appropriate emoji or icon identifier for each notification type

**Test Plan**:
```typescript
// Create __tests__/unit/notifications-helper.test.ts

describe('createNotification', () => {
  it('creates notification with all fields', async () => {
    await createNotification('user-123', 'gig-456', 'APPLICATION', 'application_submitted', { specialistId: 'spec-789' });
    const notification = await prisma.notification.findFirst({ where: { userId: 'user-123', gigId: 'gig-456' } });
    expect(notification.type).toBe('APPLICATION');
    expect(notification.eventType).toBe('application_submitted');
  });

  it('handles errors gracefully without throwing', async () => {
    // Mock prisma to throw error
    await expect(createNotification('invalid', 'invalid', 'MESSAGE', null, null)).resolves.not.toThrow();
  });
});

describe('createNotificationsBulk', () => {
  it('creates multiple notifications in one operation', async () => {
    const notifications = [
      { userId: 'user-1', gigId: 'gig-123', type: 'APPLICATION', eventType: 'application_rejected', eventData: null },
      { userId: 'user-2', gigId: 'gig-123', type: 'APPLICATION', eventType: 'application_rejected', eventData: null },
      { userId: 'user-3', gigId: 'gig-123', type: 'APPLICATION', eventType: 'application_rejected', eventData: null },
    ];
    await createNotificationsBulk(notifications);
    const created = await prisma.notification.findMany({ where: { gigId: 'gig-123' } });
    expect(created).toHaveLength(3);
  });

  it('handles errors gracefully without throwing', async () => {
    // Mock prisma to throw error
    await expect(createNotificationsBulk([{ userId: 'invalid', gigId: 'invalid', type: 'MESSAGE', eventType: null, eventData: null }])).resolves.not.toThrow();
  });
});

describe('getNotificationDisplayText', () => {
  it('returns correct text for application_submitted', () => {
    const text = getNotificationDisplayText({ type: 'APPLICATION', eventType: 'application_submitted', eventData: '{"specialistName":"John"}' });
    expect(text).toContain('New application from John');
  });

  it('returns correct text for work_approved', () => {
    const text = getNotificationDisplayText({ type: 'STATUS_CHANGE', eventType: 'work_approved' });
    expect(text).toContain('Work approved');
  });

  it('handles MESSAGE type for backward compatibility', () => {
    const text = getNotificationDisplayText({ type: 'MESSAGE', eventType: null });
    expect(text).toContain('message');
  });
});
```

---

## Task 3: Add Notification to applyToGig Action

**Description**: Create notification for gig owner when a specialist applies to their gig.

**Implementation Notes**:
- Edit `app/actions/gig.ts`
- In `applyToGig` action, after creating application:
  - Get gig owner ID from gig.clientId
  - Get specialist name from session user's profile
  - Call `createNotification(gig.clientId, gigId, 'APPLICATION', 'application_submitted', { specialistId, specialistName, applicationId })`
  - Wrap in try-catch to prevent notification errors from failing application
- Use transaction if possible to ensure atomicity

**Test Plan**:
```typescript
// Add to __tests__/integration/gig-application.test.ts

describe('applyToGig notification creation', () => {
  it('creates notification for gig owner when specialist applies', async () => {
    const client = await createTestUser(prisma, { role: 'CLIENT' });
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' });
    const gig = await createTestGig(prisma, { clientId: client.id, status: 'OPEN' });

    await withAuthContext(specialist, async () => {
      await applyToGig(null, createFormData({ gigId: gig.id, approach: 'Test approach...', questions: 'Test questions...' }));
    });

    const notification = await prisma.notification.findFirst({
      where: { userId: client.id, gigId: gig.id, type: 'APPLICATION', eventType: 'application_submitted' }
    });

    expect(notification).toBeDefined();
    expect(notification.lastReadAt).toBeNull();
  });

  it('application succeeds even if notification creation fails', async () => {
    // Mock createNotification to throw error
    // Apply to gig
    // Assert: application is created successfully
  });
});
```

---

## Task 4: Add Notifications to Application Status Actions

**Description**: Create notifications for specialists when their applications are accepted or rejected.

**Implementation Notes**:
- Edit `app/actions/gig.ts`
- In `acceptApplication` action, after accepting:
  - Get specialist ID from application.specialistId
  - Call `createNotification(specialistId, gigId, 'APPLICATION', 'application_accepted', { applicationId })` for the accepted specialist
  - For auto-rejected applications, use **bulk creation for performance**:
    - Collect all rejected applications into an array
    - Map to notification objects: `rejectedApps.map(app => ({ userId: app.specialistId, gigId, type: 'APPLICATION', eventType: 'application_rejected', eventData: JSON.stringify({ applicationId: app.id }) }))`
    - Call `createNotificationsBulk(notificationArray)` once instead of looping
    - This optimizes from N sequential writes to 1 batch operation
- In `rejectApplication` action, after rejecting:
  - Get specialist ID from application.specialistId
  - Call `createNotification(specialistId, gigId, 'APPLICATION', 'application_rejected', { applicationId })`
- Use transactions to ensure atomicity where possible

**Test Plan**:
```typescript
// Add to __tests__/integration/application-management.test.ts

describe('acceptApplication notification creation', () => {
  it('creates notification for accepted specialist', async () => {
    const client = await createTestUser(prisma, { role: 'CLIENT' });
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' });
    const gig = await createTestGig(prisma, { clientId: client.id, status: 'OPEN' });
    const application = await createTestApplication(prisma, { gigId: gig.id, specialistId: specialist.id });

    await withAuthContext(client, async () => {
      await acceptApplication(null, createFormData({ applicationId: application.id }));
    });

    const notification = await prisma.notification.findFirst({
      where: { userId: specialist.id, gigId: gig.id, type: 'APPLICATION', eventType: 'application_accepted' }
    });

    expect(notification).toBeDefined();
  });

  it('creates notifications for all auto-rejected specialists', async () => {
    const client = await createTestUser(prisma, { role: 'CLIENT' });
    const specialist1 = await createTestUser(prisma, { role: 'SPECIALIST' });
    const specialist2 = await createTestUser(prisma, { role: 'SPECIALIST' });
    const specialist3 = await createTestUser(prisma, { role: 'SPECIALIST' });
    const gig = await createTestGig(prisma, { clientId: client.id, status: 'OPEN' });

    const app1 = await createTestApplication(prisma, { gigId: gig.id, specialistId: specialist1.id });
    const app2 = await createTestApplication(prisma, { gigId: gig.id, specialistId: specialist2.id });
    const app3 = await createTestApplication(prisma, { gigId: gig.id, specialistId: specialist3.id });

    await withAuthContext(client, async () => {
      await acceptApplication(null, createFormData({ applicationId: app1.id }));
    });

    const rejectedNotifications = await prisma.notification.findMany({
      where: { gigId: gig.id, type: 'APPLICATION', eventType: 'application_rejected' }
    });

    expect(rejectedNotifications).toHaveLength(2);
    expect(rejectedNotifications.map(n => n.userId)).toContain(specialist2.id);
    expect(rejectedNotifications.map(n => n.userId)).toContain(specialist3.id);
  });
});

describe('rejectApplication notification creation', () => {
  it('creates notification for rejected specialist', async () => {
    const client = await createTestUser(prisma, { role: 'CLIENT' });
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' });
    const gig = await createTestGig(prisma, { clientId: client.id, status: 'OPEN' });
    const application = await createTestApplication(prisma, { gigId: gig.id, specialistId: specialist.id });

    await withAuthContext(client, async () => {
      await rejectApplication(null, createFormData({ applicationId: application.id }));
    });

    const notification = await prisma.notification.findFirst({
      where: { userId: specialist.id, gigId: gig.id, type: 'APPLICATION', eventType: 'application_rejected' }
    });

    expect(notification).toBeDefined();
  });
});
```

---

## Task 5: Add Notification to withdrawApplication Action

**Description**: Create notification for gig owner when a specialist withdraws their application.

**Implementation Notes**:
- Edit `app/actions/gig.ts`
- In `withdrawApplication` action, after withdrawing:
  - Get gig owner ID from gig.clientId
  - Get specialist name from session user's profile
  - Call `createNotification(gig.clientId, gigId, 'APPLICATION', 'application_withdrawn', { specialistId, specialistName, applicationId })`
  - Wrap in try-catch to prevent notification errors from failing withdrawal

**Test Plan**:
```typescript
// Add to __tests__/integration/application-withdrawal.test.ts

describe('withdrawApplication notification creation', () => {
  it('creates notification for gig owner when specialist withdraws', async () => {
    const client = await createTestUser(prisma, { role: 'CLIENT' });
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' });
    const gig = await createTestGig(prisma, { clientId: client.id, status: 'OPEN' });
    const application = await createTestApplication(prisma, { gigId: gig.id, specialistId: specialist.id, status: 'PENDING' });

    await withAuthContext(specialist, async () => {
      await withdrawApplication(null, createFormData({ applicationId: application.id }));
    });

    const notification = await prisma.notification.findFirst({
      where: { userId: client.id, gigId: gig.id, type: 'APPLICATION', eventType: 'application_withdrawn' }
    });

    expect(notification).toBeDefined();
  });
});
```

---

## Task 6: Add Notification to submitWork Action

**Description**: Create notification for gig owner when specialist submits work for review.

**Implementation Notes**:
- Edit `app/actions/gig.ts`
- In `submitWork` action, after submitting:
  - Get gig owner ID from gig.clientId
  - Get specialist name from session user's profile
  - Call `createNotification(gig.clientId, gigId, 'STATUS_CHANGE', 'work_submitted', { specialistId, specialistName })`
  - Wrap in try-catch

**Test Plan**:
```typescript
// Add to __tests__/integration/gig-lifecycle.test.ts

describe('submitWork notification creation', () => {
  it('creates notification for gig owner when work is submitted', async () => {
    const client = await createTestUser(prisma, { role: 'CLIENT' });
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' });
    const gig = await createTestGig(prisma, { clientId: client.id, assignedSpecialistId: specialist.id, status: 'IN_PROGRESS' });

    await withAuthContext(specialist, async () => {
      await submitWork(null, createFormData({ gigId: gig.id }));
    });

    const notification = await prisma.notification.findFirst({
      where: { userId: client.id, gigId: gig.id, type: 'STATUS_CHANGE', eventType: 'work_submitted' }
    });

    expect(notification).toBeDefined();
  });
});
```

---

## Task 7: Add Notification to approveWork Action

**Description**: Create notification for assigned specialist when client approves work.

**Implementation Notes**:
- Edit `app/actions/gig.ts`
- In `approveWork` action, after approving:
  - Get specialist ID from gig.assignedSpecialistId
  - Call `createNotification(specialistId, gigId, 'STATUS_CHANGE', 'work_approved', { clientId })`
  - Wrap in try-catch

**Test Plan**:
```typescript
// Add to __tests__/integration/gig-lifecycle.test.ts

describe('approveWork notification creation', () => {
  it('creates notification for specialist when work is approved', async () => {
    const client = await createTestUser(prisma, { role: 'CLIENT' });
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' });
    const gig = await createTestGig(prisma, { clientId: client.id, assignedSpecialistId: specialist.id, status: 'REVIEW' });

    await withAuthContext(client, async () => {
      await approveWork(null, createFormData({ gigId: gig.id }));
    });

    const notification = await prisma.notification.findFirst({
      where: { userId: specialist.id, gigId: gig.id, type: 'STATUS_CHANGE', eventType: 'work_approved' }
    });

    expect(notification).toBeDefined();
  });
});
```

---

## Task 8: Add Notification to markAsPaid Action

**Description**: Create notification for assigned specialist when client marks gig as paid.

**Implementation Notes**:
- Edit `app/actions/gig.ts`
- In `markAsPaid` action, after marking as paid:
  - Get specialist ID from gig.assignedSpecialistId
  - Call `createNotification(specialistId, gigId, 'STATUS_CHANGE', 'payment_marked', { clientId, paidAt })`
  - Wrap in try-catch

**Test Plan**:
```typescript
// Add to __tests__/integration/payment-tracking.test.ts

describe('markAsPaid notification creation', () => {
  it('creates notification for specialist when payment is marked', async () => {
    const client = await createTestUser(prisma, { role: 'CLIENT' });
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' });
    const gig = await createTestGig(prisma, { clientId: client.id, assignedSpecialistId: specialist.id, status: 'COMPLETED' });

    await withAuthContext(client, async () => {
      await markAsPaid(null, createFormData({ gigId: gig.id }));
    });

    const notification = await prisma.notification.findFirst({
      where: { userId: specialist.id, gigId: gig.id, type: 'STATUS_CHANGE', eventType: 'payment_marked' }
    });

    expect(notification).toBeDefined();
  });
});
```

---

## Task 9: Update getUnreadNotifications to Handle All Types

**Description**: Modify the notification fetching logic to include all notification types and format display text appropriately.

**Implementation Notes**:
- Edit `app/actions/notification.ts`
- Update `getUnreadNotifications` function:
  - Query should include all notification types (not just messages)
  - For each gig, check for unread notifications of any type
  - Consolidate multiple unread notifications per gig into one entry
  - Use `getNotificationDisplayText` helper to format display text
  - Include notification type and icon in returned data
  - Sort by most recent notification timestamp
- Maintain backward compatibility with existing message-only logic

**Test Plan**:
```typescript
// Add to __tests__/integration/notifications.test.ts

describe('getUnreadNotifications with multiple types', () => {
  it('returns notifications of all types', async () => {
    const client = await createTestUser(prisma, { role: 'CLIENT' });
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' });
    const gig = await createTestGig(prisma, { clientId: client.id, assignedSpecialistId: specialist.id });

    // Create different notification types
    await prisma.notification.create({ data: { userId: client.id, gigId: gig.id, type: 'MESSAGE', eventType: null } });
    await prisma.notification.create({ data: { userId: client.id, gigId: gig.id, type: 'APPLICATION', eventType: 'application_submitted' } });
    await prisma.notification.create({ data: { userId: client.id, gigId: gig.id, type: 'STATUS_CHANGE', eventType: 'work_submitted' } });

    const notifications = await withAuthContext(client, async () => {
      return await getUnreadNotifications();
    });

    expect(notifications).toHaveLength(1); // Consolidated into one entry
    expect(notifications[0].unreadCount).toBe(3);
  });

  it('formats display text based on notification type', async () => {
    const client = await createTestUser(prisma, { role: 'CLIENT' });
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST', email: 'specialist@test.com' });
    const gig = await createTestGig(prisma, { clientId: client.id, assignedSpecialistId: specialist.id });

    await prisma.notification.create({
      data: {
        userId: client.id,
        gigId: gig.id,
        type: 'APPLICATION',
        eventType: 'application_submitted',
        eventData: JSON.stringify({ specialistName: 'specialist@test.com' })
      }
    });

    const notifications = await withAuthContext(client, async () => {
      return await getUnreadNotifications();
    });

    expect(notifications[0].displayText).toContain('New application');
    expect(notifications[0].displayText).toContain('specialist@test.com');
  });

  it('maintains backward compatibility with message notifications', async () => {
    const client = await createTestUser(prisma, { role: 'CLIENT' });
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' });
    const gig = await createTestGig(prisma, { clientId: client.id, assignedSpecialistId: specialist.id });

    // Create old-style notification without type field
    await prisma.notification.create({ data: { userId: client.id, gigId: gig.id } });

    const notifications = await withAuthContext(client, async () => {
      return await getUnreadNotifications();
    });

    expect(notifications).toHaveLength(1);
    // Should handle gracefully without errors
  });
});
```

---

## Task 10: Update NotificationDropdown Component

**Description**: Enhance the NotificationDropdown component to display different notification types with appropriate styling and icons.

**Implementation Notes**:
- Edit `app/components/NotificationDropdown.tsx`
- Update notification item rendering:
  - Display icon based on notification type (📝 for APPLICATION, 🔄 for STATUS_CHANGE, 💬 for MESSAGE)
  - Display formatted text from `displayText` field
  - Add visual distinction for different types (border color, background)
  - Show unread count if > 1
- Update empty state to mention all notification types
- Ensure clicking notification still navigates to gig page and closes dropdown

**Test Plan**:
```bash
# Manual testing
npm run dev

# Test as CLIENT:
1. Have specialist apply to your gig
2. Click notification bell
3. Verify dropdown shows "New application from [specialist]" with application icon
4. Click notification, verify navigates to gig page
5. Verify notification is marked as read

# Test as SPECIALIST:
1. Have client accept your application
2. Click notification bell
3. Verify dropdown shows "Application accepted" with appropriate icon
4. Submit work, have client approve
5. Verify notification shows "Work approved"
6. Have client mark as paid
7. Verify notification shows "Payment marked"

# Test mixed notifications:
1. Create scenario with multiple notification types on same gig
2. Verify dropdown consolidates them into one entry
3. Verify unread count shows total
4. Verify most recent event determines display text
```

---

## Task 11: Integration and E2E Testing

**Description**: Create comprehensive integration and E2E tests for the complete notification flow.

**Implementation Notes**:
- Create `__tests__/e2e/notifications-extended.spec.ts`
- Test complete user flows:
  1. Specialist applies → Client sees notification → Client clicks → Marked as read
  2. Client accepts application → Specialist sees notification
  3. Specialist submits work → Client sees notification
  4. Client approves work → Specialist sees notification
  5. Client marks as paid → Specialist sees notification
  6. Multiple notification types on same gig → Consolidated display
- Use Playwright for E2E tests
- Test both CLIENT and SPECIALIST perspectives

**Test Plan**:
```typescript
// __tests__/e2e/notifications-extended.spec.ts

test('complete gig lifecycle generates all notifications', async ({ page, context }) => {
  // Setup: create client, specialist, gig
  // Specialist applies to gig
  // Switch to client page, verify bell shows "1"
  // Click bell, verify "New application" notification
  // Accept application
  // Switch to specialist page, verify bell shows "1"
  // Click bell, verify "Application accepted" notification
  // Submit work
  // Switch to client page, verify bell shows "1"
  // Click bell, verify "Work submitted" notification
  // Approve work
  // Switch to specialist page, verify bell shows "1"
  // Click bell, verify "Work approved" notification
  // Mark as paid
  // Switch to specialist page, verify bell shows "1"
  // Click bell, verify "Payment marked" notification
});

test('notification badge shows correct count across types', async ({ page }) => {
  // Setup: create multiple gigs with different notification types
  // Login as user
  // Verify bell badge shows total count across all types
  // Visit one gig
  // Verify badge decreases by count for that gig
});
```

---

## Task 12: Documentation and Cleanup

**Description**: Update documentation and verify all tests pass.

**Implementation Notes**:
- Update `openspec/project.md` "Current State" section:
  - Update notification system description to mention all event types
  - Add to "Implemented" list: "In-app notifications for applications, messages, and work status changes"
- Run all tests to ensure nothing broke
- Run `npm run build` to verify production build works
- Update any relevant README or developer documentation
- Archive the change proposal to `openspec/archive/in-app-notifications/`

**Test Plan**:
```bash
# Run all tests
npm test

# Run E2E tests
npm run test:e2e

# Verify build
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# Verify Prisma schema
npx prisma validate

# Run specific notification tests
npm run test:unit -- notifications
npm run test:integration -- notifications
npm run test:integration -- gig-application
npm run test:integration -- application-management
npm run test:integration -- gig-lifecycle
npm run test:integration -- payment-tracking
```

---

## Summary

**Total Tasks**: 12
**Estimated Time**: 12-16 hours

**Task Dependencies**:
- Task 1 (schema) must complete before all others
- Task 2 (helper functions) must complete before Tasks 3-8
- Tasks 3-8 (notification creation) can be done in parallel after Task 2
- Task 9 (update getUnreadNotifications) depends on Tasks 1-8
- Task 10 (update UI) depends on Task 9
- Task 11 (E2E testing) depends on all previous tasks
- Task 12 (documentation) is final cleanup

**Critical Path**: Task 1 → Task 2 → Tasks 3-8 (parallel) → Task 9 → Task 10 → Task 11 → Task 12

**Key Implementation Notes**:
- All notification creation should be fire-and-forget (errors logged but don't fail main action)
- Use transactions where possible for atomicity
- Maintain backward compatibility with existing message notifications
- Consolidate multiple notifications per gig in the UI
- Test coverage should be ≥ 90% for new code
