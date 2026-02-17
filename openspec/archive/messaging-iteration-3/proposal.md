# Change Proposal: messaging-iteration-3

## Context

The messaging data layer and basic UI components were implemented in previous iterations (messaging-iteration-1 and messaging-iteration-2). The Message model exists, and basic message display and form components are in place. However, the current implementation has gaps in user experience and validation:

1. **No redirect after message send**: The form resets but stays on the same page, which doesn't provide clear feedback that the message was sent and doesn't refresh the message list to show the new message.
2. **Missing max length validation**: Users can submit arbitrarily long messages, which could cause UI/UX issues.
3. **Server action may not be fully implemented**: The `sendMessage` action is referenced in the form but may not exist or may not follow the established patterns.

## Problem Statement

Users need a complete, polished message sending experience that:
- Provides clear feedback when a message is sent successfully
- Prevents excessively long messages
- Follows the established useActionState pattern used throughout the app
- Maintains security by restricting message sending to authorized users only

## Proposed Solution

Implement/refine the `sendMessage` server action with:
- **Redirect on success**: After successful message creation, redirect to the gig detail page to refresh the message list and provide clear feedback
- **Content validation**: Require non-empty content (after trimming) and enforce a reasonable maximum length (2000 characters)
- **Access control**: Only the gig owner (client) or assigned specialist can send messages
- **Gig state validation**: Messages can only be sent to gigs with an assigned specialist (not OPEN gigs)

## Constraints

- MUST use useActionState-compatible signature: `(prevState, formData) => Promise<{error?: string}>`
- MUST redirect on success (not just revalidate)
- MUST validate content length (max 2000 characters)
- MUST prevent messaging on OPEN gigs (no assigned specialist yet)
- MUST prevent messaging on closed gigs (closedByAdmin = true)

## Non-Goals

- Real-time messaging (WebSocket/polling)
- Read receipts or typing indicators
- File attachments
- Message editing or deletion
- Message threading or replies
- Rich text formatting
