# Change Proposal: messaging-iteration-1

## Problem Statement

Currently, clients and specialists have no way to communicate within the platform about gig details, clarifications, or progress updates. This forces users to exchange contact information and move conversations to external channels (Telegram, email), which:

- Creates **platform leakage** (users bypass the platform entirely)
- Loses **dispute context** (no record of what was discussed or agreed upon)
- Reduces **trust and transparency** (no audit trail for admins)
- Weakens **user retention** (less reason to stay on the platform)

The project context explicitly identifies "Simple Gig Chat / Context Comments" as a CRITICAL MVP feature to prevent Telegram leakage and maintain dispute context.

## Proposed Solution

Implement a **data layer for gig-scoped messaging** that allows clients and assigned specialists to exchange messages within the context of a specific gig.

This is **iteration 1**: database structure only. No UI, no server actions, no real-time features. Just the foundational data model that can be manually tested via Prisma Studio.

### Scope

**In Scope (this change):**
- Message model in Prisma schema
- Database migration
- Relations: Message ↔ Gig, Message ↔ User
- Manual testing via Prisma Studio

**Out of Scope (future iterations):**
- UI components for displaying/sending messages
- Server actions for creating messages
- Real-time updates or notifications
- Read receipts, typing indicators
- File attachments
- Message editing or deletion

### Design Constraints

1. **Gig-scoped only**: Messages are always tied to a specific gig, not general user-to-user DMs
2. **Two-party only**: Only the gig owner (client) and assigned specialist can participate
3. **Simple text content**: No rich text, no attachments (for now)
4. **Immutable messages**: No editing or deletion in this iteration (can be added later)
5. **Chronological ordering**: Messages ordered by createdAt timestamp

### Non-Goals

- General user-to-user messaging (not gig-scoped)
- Group chats or multi-party conversations
- Message reactions, threads, or advanced features
- Integration with external messaging services

## Success Criteria

1. Migration runs successfully without errors
2. Message records can be created via Prisma Studio
3. Messages correctly link to Gig and User via foreign keys
4. Messages persist across database restarts
5. Querying a Gig includes its messages
6. Querying a User includes their sent messages

## Risks & Mitigations

**Risk**: Schema design doesn't support future features (editing, deletion, read status)
**Mitigation**: Keep design simple but extensible. Can add fields later (editedAt, deletedAt, readAt) without breaking changes.

**Risk**: Performance issues with large message volumes
**Mitigation**: Add indexes on gigId and createdAt. Pagination can be added in UI layer later.

## Rollout Plan

1. Create and apply migration
2. Manually test via Prisma Studio (create messages, verify relations)
3. Verify data persists and queries work correctly
4. Document schema for next iteration (UI implementation)
