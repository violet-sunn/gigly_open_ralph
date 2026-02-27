# Change Proposal: In-App Notifications for Applications and Status Changes

## Problem Statement

Users don't know when they have important updates on their gigs, causing them to:
- Miss new applications on their posted gigs (CLIENT)
- Miss application status updates (SPECIALIST)
- Miss work status changes (both roles)
- Abandon the platform due to lack of engagement signals

The existing notification system only tracks message notifications. Users need to be notified about all key events in the gig lifecycle.

## Current State

The platform has a notification system implemented for messages:
- Notification model with userId, gigId, lastReadAt fields
- NotificationBell component showing unread count badge
- NotificationDropdown showing gigs with unread messages
- Mark as read functionality when visiting gig pages

However, this system only tracks messages. Users are not notified when:
- Someone applies to their gig (CLIENT)
- Their application is accepted/rejected (SPECIALIST)
- Work is submitted for review (CLIENT)
- Work is approved (SPECIALIST)
- Payment is marked (SPECIALIST)

## Proposed Solution

Extend the existing notification system to track different notification types:

1. **Add notification type tracking**: Add a `type` field to Notification model to distinguish between MESSAGE, APPLICATION, and STATUS_CHANGE notifications
2. **Add event metadata**: Add `eventType` and `eventData` fields to store specific event details
3. **Create notifications on key events**:
   - New application submitted → notify gig owner
   - Application accepted/rejected → notify specialist
   - Work submitted → notify gig owner
   - Work approved → notify specialist
   - Gig marked as paid → notify specialist
4. **Update UI to display different notification types**: Show appropriate icons and text for each notification type
5. **Maintain backward compatibility**: Existing message notifications continue to work

## Scope

### In Scope
- Extend Notification model with type and event metadata fields
- Create notifications for application events (new, accepted, rejected, withdrawn)
- Create notifications for status change events (submitted, approved, paid)
- Update NotificationDropdown to display different notification types with appropriate styling
- Update unread count logic to include all notification types
- Comprehensive test coverage for new notification types

### Out of Scope
- Real-time notifications (WebSocket/SSE) - refresh on page load is sufficient
- Email notifications - explicitly excluded per requirements
- Push notifications
- Notification preferences/settings
- Notification history page
- Bulk mark as read
- Notification filtering by type

## Constraints

- Must maintain backward compatibility with existing message notifications
- Must not require real-time infrastructure (WebSocket/SSE)
- Must use existing Notification model structure (extend, don't replace)
- Must work with page refresh model (no real-time updates required)
- Must not send emails (per requirements)

## Success Criteria

1. Users see notifications for all key events (applications, messages, status changes)
2. Unread count badge updates correctly when new events occur
3. Notification dropdown shows clear, actionable information for each notification type
4. Clicking a notification navigates to the relevant gig page
5. Visiting a gig page marks all notifications for that gig as read
6. All existing message notification functionality continues to work
7. Test coverage ≥ 90% for new notification logic

## Non-Goals

- Real-time notification delivery (page refresh is sufficient)
- Email notifications
- Notification preferences UI
- Notification grouping/threading
- Notification snoozing or archiving
- Per-notification mark as read (gig-level is sufficient)
