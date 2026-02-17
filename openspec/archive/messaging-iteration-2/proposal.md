# Change Proposal: messaging-iteration-2

## Overview

Display messages on the gig detail page to enable communication between clients and assigned specialists. This is the second iteration of the messaging feature, building on the data layer created in messaging-iteration-1.

## Problem Statement

Currently, clients and specialists have no way to communicate within the platform once a gig is in progress. This creates several problems:

1. **Platform Leakage**: Users are forced to move conversations to external channels (Telegram, email), which means the platform loses context and control.
2. **Dispute Resolution**: Without in-platform communication history, admins cannot resolve disputes effectively.
3. **Scope Creep**: Informal external conversations lead to undocumented scope changes and misaligned expectations.
4. **User Experience**: Users expect basic communication tools in a marketplace platform.

From project.md:
> "Simple Gig Chat / Context Comments (CRITICAL: prevents Telegram leakage, maintains dispute context)"

## Solution

Implement a simple message display and composition UI on the gig detail page with the following characteristics:

- **Chronological display**: Messages shown in order from oldest to newest
- **Sender identification**: Each message shows sender name and timestamp
- **Access control**: Only visible to gig owner (CLIENT) and assigned specialist (SPECIALIST)
- **Simple rendering**: Plain text messages in a list, no rich features
- **Gig-scoped**: Messages are tied to a specific gig context

## Scope

### In Scope
- Display existing messages on gig detail page
- Server action to send new messages
- Message composition form (textarea + submit button)
- Access control enforcement (owner + assigned specialist only)
- Sender name display (email or profile display name)
- Timestamp display (formatted date/time)
- Chronological ordering (oldest first)

### Out of Scope (Deferred to Future Iterations)
- File attachments
- Message editing or deletion
- Read receipts
- Typing indicators
- Real-time updates (WebSocket/polling)
- Email notifications
- Message search
- Rich text formatting
- Emoji reactions

## Constraints

1. **Access Control**: Messages MUST only be visible to:
   - The gig owner (CLIENT who created the gig)
   - The assigned specialist (SPECIALIST assigned via accepted application)
   - Messages MUST NOT be visible to other specialists who applied but were not accepted

2. **Gig Status**: Messages SHOULD only be displayed when a specialist is assigned (gig status is IN_PROGRESS, REVIEW, COMPLETED, or PAID)

3. **Simplicity**: This is an MVP feature. Keep the UI minimal and functional. No over-engineering.

4. **Performance**: Message queries should be efficient (use existing indexes on gigId and createdAt)

## Non-Goals

- This is NOT a full-featured chat system
- This is NOT a notification system
- This is NOT a real-time messaging platform
- This is NOT a customer support ticketing system

## Success Criteria

1. **Functional**: Users can send and view messages on gig detail pages
2. **Secure**: Access control prevents unauthorized message viewing
3. **Usable**: Messages are easy to read with clear sender identification
4. **Testable**: Can be validated using seeded messages from messaging-iteration-1

## Testing Strategy

Use the existing test script `scripts/test-message-model.ts` to seed test messages, then verify:
- Messages display correctly on gig detail page
- Only authorized users can see messages
- Message form submits successfully
- New messages appear after submission
- Timestamps and sender names are correct
