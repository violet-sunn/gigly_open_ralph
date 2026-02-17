# Change Proposal: messaging-iteration-4

## Overview

Improve the messaging UX by handling edge cases, adding visual distinction between message senders, and ensuring robust behavior across all gig statuses.

## Problem Statement

The current messaging implementation (from messaging-iteration-3) provides basic functionality but lacks polish:

1. **Visual clarity**: All messages look identical - users cannot quickly distinguish between client and specialist messages
2. **Edge case messaging**: While the system prevents messaging before specialist assignment, the UI could be more explicit about why messaging is unavailable
3. **Whitespace handling**: Message content should be trimmed to prevent accidental whitespace-only messages (already implemented in backend, needs verification)
4. **Status coverage**: Need to verify messaging works correctly across all gig lifecycle states

## Proposed Solution

### 1. Visual Distinction Between Senders

Add simple visual styling to differentiate client and specialist messages:
- **Client messages**: Align left with blue accent (existing style)
- **Specialist messages**: Align right with green/purple accent
- Keep implementation minimal - no chat bubbles or complex layouts

### 2. Explicit Edge Case Messaging

When specialist is not yet assigned (gig status = OPEN):
- Show clear message: "Messaging will be available once a specialist is assigned to this gig."
- Replace the generic "No messages yet" with context-aware messaging

### 3. Whitespace Trimming

Verify that message content trimming is working correctly:
- Backend already trims with `contentRaw.trim()`
- Frontend textarea should prevent submission of whitespace-only content
- Empty messages after trimming should show validation error

### 4. Cross-Status Testing

Test messaging behavior across all gig statuses:
- **OPEN**: Messaging section hidden (no specialist assigned)
- **IN_PROGRESS**: Full messaging available
- **REVIEW**: Full messaging available
- **COMPLETED**: Full messaging available (for post-completion discussion)
- **PAID**: Full messaging available (for follow-up)
- **closedByAdmin**: Messaging blocked with appropriate error

## Constraints

- **Minimal UI changes**: Keep the current simple list-based layout, only add sender distinction
- **No new database fields**: Use existing data (sender role, profiles)
- **No breaking changes**: Existing messages must display correctly
- **Performance**: No additional database queries beyond what's already loaded

## Non-Goals

- Rich messaging features (file uploads, reactions, read receipts)
- Real-time updates (WebSocket/polling)
- Message editing or deletion
- Notification system
- Message search or filtering

## Success Criteria

1. Users can visually distinguish client vs specialist messages at a glance
2. Edge cases (no specialist, closed gig) show clear, helpful messages
3. Whitespace-only messages are prevented
4. Messaging works correctly in all gig statuses where it should be available
5. No regressions in existing messaging functionality
