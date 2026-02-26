# Change Proposal: Message Notifications

## Change Name
`message-notifications`

## Problem Statement

Currently, both specialists and clients have no way to know when they receive new messages on their gigs. Users must manually check each gig to see if there are new messages, leading to:

- **Missed communications**: Users don't know when the other party has responded
- **Platform leakage**: Without notifications, users are incentivized to move conversations to Telegram/WhatsApp where they get instant alerts
- **Poor user experience**: Constant manual checking creates friction and frustration
- **Delayed responses**: Important messages sit unread, slowing down gig progress

This is a **critical gap** in the messaging system implemented in changes #14-16. Without notifications, the in-platform messaging loses much of its value.

## Proposed Solution

Implement a notification system with a "bell" icon in the navigation that:

1. **Displays unread message count**: Shows a badge with the number of gigs that have unread messages
2. **Notification dropdown**: Clicking the bell opens a dropdown listing gigs with new messages
3. **Direct navigation**: Clicking a notification navigates to the specific gig page
4. **Auto-mark as read**: Visiting a gig page marks its messages as read for that user

### Scope

**In Scope:**
- Notification bell icon in dashboard/navigation header
- Unread message tracking per user per gig
- Notification dropdown UI with list of gigs with unread messages
- Auto-mark as read when visiting gig page
- Badge showing total unread count

**Out of Scope (Post-MVP):**
- Real-time notifications (WebSockets/SSE)
- Email notifications
- Push notifications
- Notification preferences/settings
- Notification history/archive
- Mark as read without visiting gig
- Notification sounds

## Design Decisions

### 1. Notification Granularity
**Decision**: Track "unread messages per gig per user" rather than individual message notifications.

**Rationale**:
- Simpler data model (one record per user-gig pair vs. one per message)
- Sufficient for MVP (users just need to know "this gig has new messages")
- Easier to implement mark-as-read logic
- Reduces database size

### 2. Read Status Tracking
**Decision**: Use a separate `Notification` table with `gigId`, `userId`, `lastReadAt` timestamp.

**Rationale**:
- Clean separation of concerns (messages remain immutable)
- Efficient queries (index on userId for fast notification fetches)
- Supports future features (notification preferences, history)
- Avoids denormalizing read status into Message table

### 3. Mark as Read Trigger
**Decision**: Auto-mark as read when user visits gig detail page.

**Rationale**:
- Zero user friction (no extra clicks)
- Aligns with user intent (visiting page = reading messages)
- Simple implementation (server-side on page load)
- Matches common UX patterns (email, Slack, etc.)

### 4. Notification Display
**Decision**: Bell icon in navigation with dropdown, not a separate notifications page.

**Rationale**:
- Always visible (persistent navigation element)
- Quick access (one click to see notifications)
- Familiar pattern (GitHub, LinkedIn, etc.)
- Minimal navigation overhead

### 5. Real-time Updates
**Decision**: Defer real-time updates to post-MVP. Use page refresh for now.

**Rationale**:
- Significant complexity (WebSockets, connection management)
- Not critical for MVP (users can refresh page)
- Polling is acceptable for low-traffic MVP
- Can add later without breaking changes

## Technical Approach

### Database Schema
```prisma
model Notification {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  gigId     String
  gig       Gig      @relation(fields: [gigId], references: [id], onDelete: Cascade)
  lastReadAt DateTime?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, gigId])
  @@index([userId])
  @@index([gigId])
}
```

### Notification Logic
1. **Create notification**: When a message is sent, create/update Notification record for the recipient
2. **Fetch unread**: Query Notifications where `lastReadAt < gig.messages.max(createdAt)` or `lastReadAt IS NULL`
3. **Mark as read**: Update `lastReadAt` to current timestamp when user visits gig page

### UI Components
- `NotificationBell` component in navigation (client component)
- `NotificationDropdown` component showing list of gigs with unread messages
- Badge showing unread count

## Constraints

- **No breaking changes**: Existing messaging functionality remains unchanged
- **Performance**: Notification queries must be efficient (< 100ms)
- **Backward compatibility**: Works with existing messages (no migration of message data)
- **MVP simplicity**: No real-time updates, no complex notification preferences

## Non-Goals

- Email notifications (post-MVP)
- Real-time push notifications (post-MVP)
- Notification preferences/settings (post-MVP)
- Notification history beyond current unread state (post-MVP)
- Mark individual messages as read (post-MVP)
- Notification grouping/threading (post-MVP)

## Success Metrics

- **Adoption**: % of users who click on notification bell within first week
- **Engagement**: Reduction in time between message sent and message read
- **Retention**: Reduction in platform leakage (users moving to Telegram)
- **Technical**: Notification query performance < 100ms p95

## Risks & Mitigations

**Risk**: Notification queries become slow as message volume grows
**Mitigation**: Proper indexing on userId, gigId, and timestamps. Monitor query performance.

**Risk**: Users expect real-time updates, frustrated by page refresh requirement
**Mitigation**: Clear messaging in UI ("Refresh to see new notifications"). Plan real-time updates for next iteration.

**Risk**: Notification logic bugs (false positives/negatives)
**Mitigation**: Comprehensive test coverage, especially around mark-as-read logic.

## Dependencies

- Existing messaging system (changes #14-16)
- Gig detail page (for mark-as-read trigger)
- Dashboard/navigation structure (for bell icon placement)

## Estimated Effort

- Database schema: 1 hour
- Server actions (create, fetch, mark as read): 2 hours
- UI components (bell, dropdown): 3 hours
- Integration with gig detail page: 1 hour
- Testing: 2 hours
- **Total**: ~9 hours (1-2 days)
