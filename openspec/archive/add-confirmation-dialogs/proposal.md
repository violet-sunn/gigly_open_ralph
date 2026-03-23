# Proposal: Add Confirmation Dialogs for Destructive Actions

## Problem Statement

Currently, destructive actions (Close Gig, Suspend User, Withdraw Application, Reject Application) execute immediately without confirmation. This creates risk of accidental data loss or unintended consequences, especially for irreversible admin actions.

Users may accidentally click destructive action buttons, leading to:
- Admins accidentally closing active gigs or suspending legitimate users
- Clients accidentally rejecting promising applications
- Specialists accidentally withdrawing applications they want to keep active

## Proposed Solution

Implement a reusable `ConfirmDialog` component and integrate it with all destructive actions to require explicit user confirmation before execution.

### Scope

**In Scope:**
- Create reusable `ConfirmDialog` React component with customizable title, message, and action buttons
- Add confirmation to "Close Gig" action (admin)
- Add confirmation to "Suspend User" action (admin)
- Add confirmation to "Withdraw Application" action (specialist)
- Add confirmation to "Reject Application" action (client)
- Display clear consequences of each action in dialog message
- Provide "Confirm" and "Cancel" buttons with appropriate styling (destructive vs. neutral)

**Out of Scope:**
- Confirmation for non-destructive actions (Accept Application, Approve Work, Mark as Paid)
- Undo functionality for destructive actions
- Confirmation for gig creation or editing
- Email notifications about destructive actions

## Design Constraints

1. **Reusability**: ConfirmDialog component MUST be generic enough to handle all destructive action types
2. **Accessibility**: Dialog MUST be keyboard-navigable and screen-reader friendly
3. **Visual Hierarchy**: Destructive actions MUST use warning colors (red) to signal danger
4. **User Experience**: Dialog MUST clearly explain consequences without technical jargon
5. **Performance**: Dialog MUST render instantly without blocking UI

## Success Criteria

1. All four destructive actions require confirmation before execution
2. Users can cancel destructive actions without side effects
3. Dialog messages clearly explain what will happen
4. Accidental clicks on destructive buttons do not execute actions
5. E2E tests verify confirmation flow for each action type

## Non-Goals

- Adding confirmation to every action in the system
- Implementing multi-step approval workflows
- Adding audit logs for confirmation dialogs (audit logs already exist for actions)
- Implementing "Are you sure you're sure?" double confirmations
