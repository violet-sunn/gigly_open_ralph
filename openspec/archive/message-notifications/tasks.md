# Implementation Tasks: Message Notifications

## Task 1: Add Notification Model to Database Schema

**Description**: Add the Notification model to Prisma schema with proper relations and indexes.

**Implementation Notes**:
- Edit `prisma/schema.prisma`
- Add Notification model with fields: id, userId, gigId, lastReadAt, createdAt, updatedAt
- Add unique constraint on [userId, gigId]
- Add indexes on userId and gigId
- Add `notifications Notification[]` relation to User model
- Add `notifications Notification[]` relation to Gig model
- Set onDelete: Cascade for both foreign keys
- Run `npx prisma format` to validate syntax
- Run `npx prisma migrate dev --name add-notification-model` to create migration
- Verify migration SQL includes proper indexes and constraints

**Test Plan**:
```bash
# Validate schema
npx prisma validate

# Check migration was created
ls prisma/migrations/ | grep add-notification-model

# Verify database structure
npx prisma studio
# Navigate to Notification model and verify all fields exist

# Test unique constraint
# In Prisma Studio, try to create two notifications with same userId and gigId
# Should fail with unique constraint error
```

---

## Task 2: Create Notification Server Actions

**Description**: Implement server actions for notification management: getUnreadNotifications, getUnreadCount, markNotificationAsRead.

**Implementation Notes**:
- Create `app/actions/notification.ts` file
- Add `'use server'` directive at top
- Import getSession, prisma
- Implement `getUnreadNotifications()`:
  - Get session, redirect to /login if not authenticated
  - Query gigs where user is owner OR assigned specialist
  - Join with messages and notifications
  - Filter: messages.createdAt > notification.lastReadAt OR notification is null
  - Exclude: closedByAdmin = true
  - Exclude: all messages are from current user (no messages from others)
  - Sort by most recent message first
  - Return array with: gigId, gig title, last message sender, last message time, unread count
- Implement `getUnreadCount()`:
  - Same logic as getUnreadNotifications but return count only
  - Use Prisma count() for efficiency
- Implement `markNotificationAsRead(gigId: string)`:
  - Get session, redirect if not authenticated
  - Verify user is gig owner OR assigned specialist
  - Use prisma.notification.upsert() to create or update
  - Set lastReadAt to new Date()
  - Return { error?: string }

**Test Plan**:
```typescript
// Create integration test: __tests__/integration/notifications.test.ts

describe('getUnreadNotifications', () => {
  it('returns gigs with unread messages for gig owner', async () => {
    // Setup: create client, specialist, gig, assign specialist, send message from specialist
    // Call getUnreadNotifications as client
    // Assert: returns 1 notification with correct gig details
  });

  it('returns gigs with unread messages for assigned specialist', async () => {
    // Setup: create client, specialist, gig, assign specialist, send message from client
    // Call getUnreadNotifications as specialist
    // Assert: returns 1 notification
  });

  it('excludes gigs with no messages from others', async () => {
    // Setup: create gig, send message as owner only
    // Call getUnreadNotifications
    // Assert: returns empty array
  });

  it('excludes closed gigs', async () => {
    // Setup: create gig with unread messages, set closedByAdmin = true
    // Call getUnreadNotifications
    // Assert: returns empty array
  });

  it('includes gigs with no notification record', async () => {
    // Setup: create gig with messages, no notification record
    // Call getUnreadNotifications
    // Assert: returns 1 notification (never read = unread)
  });
});

describe('getUnreadCount', () => {
  it('returns correct count of gigs with unread messages', async () => {
    // Setup: create 3 gigs with unread messages
    // Call getUnreadCount
    // Assert: returns { count: 3 }
  });

  it('returns 0 when no unread messages', async () => {
    // Setup: create gigs with all messages read
    // Call getUnreadCount
    // Assert: returns { count: 0 }
  });
});

describe('markNotificationAsRead', () => {
  it('creates notification record if none exists', async () => {
    // Setup: create gig with messages, no notification record
    // Call markNotificationAsRead
    // Assert: notification record created with lastReadAt set
  });

  it('updates existing notification record', async () => {
    // Setup: create notification with old lastReadAt
    // Call markNotificationAsRead
    // Assert: lastReadAt updated to current time
  });

  it('rejects unauthorized users', async () => {
    // Setup: create gig, authenticate as non-participant
    // Call markNotificationAsRead
    // Assert: returns error
  });
});
```

---

## Task 3: Update sendMessage Action to Create Notifications

**Description**: Modify the sendMessage server action to create/update notification records for message recipients.

**Implementation Notes**:
- Edit `app/actions/gig.ts`
- In `sendMessage` action, after creating message:
  - Determine recipient userId (if sender is client, recipient is assignedSpecialistId; if sender is specialist, recipient is clientId)
  - Use prisma.notification.upsert() to create or update notification for recipient
  - Set where: { userId_gigId: { userId: recipientId, gigId } }
  - Set create: { userId: recipientId, gigId, lastReadAt: null }
  - Set update: { updatedAt: new Date() } (don't touch lastReadAt)
  - Wrap message creation and notification upsert in a transaction
  - If notification creation fails, log error but don't fail message send
- Test that notifications are created for both client→specialist and specialist→client messages

**Test Plan**:
```typescript
// Add to existing __tests__/integration/messaging.test.ts

describe('sendMessage notification creation', () => {
  it('creates notification for specialist when client sends message', async () => {
    // Setup: create gig with assigned specialist
    // Send message as client
    // Assert: notification record exists for specialist with lastReadAt = null
  });

  it('creates notification for client when specialist sends message', async () => {
    // Setup: create gig with assigned specialist
    // Send message as specialist
    // Assert: notification record exists for client with lastReadAt = null
  });

  it('updates notification updatedAt without changing lastReadAt', async () => {
    // Setup: create notification with lastReadAt set to past time
    // Send new message
    // Assert: updatedAt changed, lastReadAt unchanged
  });

  it('does not create notification for sender', async () => {
    // Setup: create gig
    // Send message as client
    // Assert: no notification record for client (sender)
  });
});
```

---

## Task 4: Add Mark as Read to Gig Detail Page

**Description**: Update gig detail page to automatically mark notifications as read when user visits the page.

**Implementation Notes**:
- Edit `app/(protected)/gigs/[id]/page.tsx`
- After fetching gig data, check if user is authorized (gig owner OR assigned specialist)
- If authorized, call `markNotificationAsRead(gigId)` server action
- Use try-catch to handle errors silently (don't block page render)
- This should happen on every page load (server component)

**Test Plan**:
```typescript
// Add to existing __tests__/integration/gig-detail.test.ts

describe('gig detail page mark as read', () => {
  it('marks notification as read when client visits gig', async () => {
    // Setup: create gig with unread messages for client
    // Visit gig detail page as client
    // Assert: notification lastReadAt is updated
  });

  it('marks notification as read when specialist visits gig', async () => {
    // Setup: create gig with unread messages for specialist
    // Visit gig detail page as specialist
    // Assert: notification lastReadAt is updated
  });

  it('does not mark as read for unauthorized users', async () => {
    // Setup: create gig with unread messages
    // Visit gig detail page as non-participant specialist
    // Assert: notification lastReadAt is not updated
  });
});
```

---

## Task 5: Create Notification Bell Component

**Description**: Create a client component that displays a bell icon with unread count badge.

**Implementation Notes**:
- Create `app/components/NotificationBell.tsx`
- Mark as `'use client'`
- Use useState for dropdown open/close state
- Use useEffect to fetch unread count on mount
- Display bell icon (use Heroicons BellIcon or emoji 🔔)
- Display badge with count if count > 0
- Badge styling: absolute positioning, red/blue background, white text, rounded-full
- Handle click to toggle dropdown
- Use useEffect with document click listener to close dropdown on outside click
- Add ARIA labels for accessibility: aria-label="Notifications", aria-expanded for dropdown state

**Test Plan**:
```typescript
// Create __tests__/unit/NotificationBell.test.tsx

describe('NotificationBell', () => {
  it('renders bell icon', () => {
    render(<NotificationBell />);
    expect(screen.getByLabelText('Notifications')).toBeInTheDocument();
  });

  it('displays badge when unread count > 0', async () => {
    // Mock getUnreadCount to return { count: 3 }
    render(<NotificationBell />);
    await waitFor(() => {
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  it('hides badge when unread count = 0', async () => {
    // Mock getUnreadCount to return { count: 0 }
    render(<NotificationBell />);
    await waitFor(() => {
      expect(screen.queryByText('0')).not.toBeInTheDocument();
    });
  });

  it('toggles dropdown on click', () => {
    render(<NotificationBell />);
    const bell = screen.getByLabelText('Notifications');
    fireEvent.click(bell);
    expect(screen.getByRole('menu')).toBeInTheDocument();
    fireEvent.click(bell);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
```

---

## Task 6: Create Notification Dropdown Component

**Description**: Create a client component that displays a list of gigs with unread messages.

**Implementation Notes**:
- Create `app/components/NotificationDropdown.tsx`
- Mark as `'use client'`
- Accept props: isOpen (boolean), onClose (function)
- Use useEffect to fetch notifications when isOpen changes to true
- Display loading state while fetching
- Display empty state if no notifications: "No new messages" with icon
- Display list of notifications:
  - Each item: gig title (truncated to 50 chars), sender name, relative time
  - Each item is a Link to `/gigs/[gigId]` (flat URL structure, no /dashboard prefix)
  - Each item has hover state (bg-gray-50)
  - Click closes dropdown (call onClose)
- Display error state if fetch fails: "Failed to load notifications" with Retry button
- Sort notifications by most recent first
- Limit to 10 notifications (slice array)
- Use relative time formatting: "2m ago", "1h ago", "yesterday", "2 days ago"

**Test Plan**:
```typescript
// Create __tests__/unit/NotificationDropdown.test.tsx

describe('NotificationDropdown', () => {
  it('displays loading state initially', () => {
    render(<NotificationDropdown isOpen={true} onClose={jest.fn()} />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays list of notifications', async () => {
    // Mock getUnreadNotifications to return 3 notifications
    render(<NotificationDropdown isOpen={true} onClose={jest.fn()} />);
    await waitFor(() => {
      expect(screen.getByText('Gig Title 1')).toBeInTheDocument();
      expect(screen.getByText('Gig Title 2')).toBeInTheDocument();
      expect(screen.getByText('Gig Title 3')).toBeInTheDocument();
    });
  });

  it('displays empty state when no notifications', async () => {
    // Mock getUnreadNotifications to return empty array
    render(<NotificationDropdown isOpen={true} onClose={jest.fn()} />);
    await waitFor(() => {
      expect(screen.getByText('No new messages')).toBeInTheDocument();
    });
  });

  it('navigates to gig on notification click', async () => {
    // Mock getUnreadNotifications
    render(<NotificationDropdown isOpen={true} onClose={jest.fn()} />);
    await waitFor(() => {
      const link = screen.getByText('Gig Title 1').closest('a');
      expect(link).toHaveAttribute('href', '/gigs/gig-id-1');
    });
  });

  it('calls onClose when notification is clicked', async () => {
    const onClose = jest.fn();
    render(<NotificationDropdown isOpen={true} onClose={onClose} />);
    await waitFor(() => {
      fireEvent.click(screen.getByText('Gig Title 1'));
    });
    expect(onClose).toHaveBeenCalled();
  });
});
```

---

## Task 7: Integrate Notification Bell into Navigation

**Description**: Add the NotificationBell component to the protected route navigation header.

**Implementation Notes**:
- Edit `app/(protected)/layout.tsx` to integrate NotificationBell into the existing `MainNav` component
- The MainNav component is already rendered in the protected layout and handles navigation for authenticated users
- Import NotificationBell component into MainNav
- Add NotificationBell to the header, positioned in top-right area (likely next to the user menu/logout button)
- Ensure it's visible on all protected pages (dashboard, gigs, profile, etc.)
- Style to match existing navigation (spacing, colors)
- Ensure it works for both CLIENT and SPECIALIST roles
- Test responsive layout (mobile, tablet, desktop)

**Test Plan**:
```bash
# Manual testing
npm run dev

# Test as CLIENT:
1. Login as client
2. Navigate to dashboard
3. Verify bell icon is visible in navigation
4. Send message to specialist on a gig
5. Login as specialist
6. Verify bell shows badge with count "1"
7. Click bell, verify dropdown opens
8. Click notification, verify navigates to gig
9. Verify badge count decreases to "0"

# Test as SPECIALIST:
1. Login as specialist
2. Navigate to dashboard
3. Verify bell icon is visible
4. Send message to client on a gig
5. Login as client
6. Verify bell shows badge with count "1"
7. Click bell, verify dropdown opens
8. Click notification, verify navigates to gig
9. Verify badge count decreases to "0"

# Test responsive:
1. Resize browser to mobile width (375px)
2. Verify bell icon is still visible and functional
3. Verify dropdown doesn't overflow screen
```

---

## Task 8: E2E Testing for Notification Flow

**Description**: Create end-to-end tests for the complete notification workflow.

**Implementation Notes**:
- Create `__tests__/e2e/notifications.spec.ts`
- Test complete user flows:
  1. Client sends message → Specialist sees notification → Specialist clicks notification → Notification marked as read
  2. Specialist sends message → Client sees notification → Client clicks notification → Notification marked as read
  3. Multiple unread messages → Badge shows correct count → Visit gigs → Badge count decreases
- Use Playwright for E2E tests
- Test both CLIENT and SPECIALIST perspectives

**Test Plan**:
```typescript
// __tests__/e2e/notifications.spec.ts

test('client sends message, specialist receives notification', async ({ page, context }) => {
  // Setup: create client, specialist, gig, assign specialist
  // Login as client, navigate to gig, send message
  // Open new page as specialist
  // Assert: bell badge shows "1"
  // Click bell, assert: dropdown shows gig with message
  // Click notification, assert: navigates to gig page
  // Assert: bell badge shows "0"
});

test('specialist sends message, client receives notification', async ({ page, context }) => {
  // Setup: create client, specialist, gig, assign specialist
  // Login as specialist, navigate to gig, send message
  // Open new page as client
  // Assert: bell badge shows "1"
  // Click bell, assert: dropdown shows gig with message
  // Click notification, assert: navigates to gig page
  // Assert: bell badge shows "0"
});

test('multiple unread messages show correct count', async ({ page }) => {
  // Setup: create 3 gigs with unread messages
  // Login as user
  // Assert: bell badge shows "3"
  // Visit first gig
  // Assert: bell badge shows "2"
  // Visit second gig
  // Assert: bell badge shows "1"
  // Visit third gig
  // Assert: bell badge shows "0"
});

test('notification dropdown shows most recent first', async ({ page }) => {
  // Setup: create 3 gigs with messages at different times
  // Login as user, click bell
  // Assert: notifications are sorted by most recent message first
});
```

---

## Task 9: Documentation and Cleanup

**Description**: Update documentation and verify all tests pass.

**Implementation Notes**:
- Update `openspec/project.md` "Current State" section to mention notification system
- Add notification system to "Implemented" list
- Run all tests to ensure nothing broke
- Run `npm run build` to verify production build works
- Update any relevant README or developer documentation

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
```

---

## Summary

**Total Tasks**: 9
**Estimated Time**: 9-12 hours

**Task Dependencies**:
- Task 1 must complete before Task 2
- Task 2 must complete before Task 3
- Task 3 must complete before Task 4
- Task 5 and Task 6 can be done in parallel
- Task 7 depends on Task 5 and Task 6
- Task 8 depends on all previous tasks
- Task 9 is final cleanup

**Critical Path**: Task 1 → Task 2 → Task 3 → Task 4 → Task 5 → Task 6 → Task 7 → Task 8 → Task 9
