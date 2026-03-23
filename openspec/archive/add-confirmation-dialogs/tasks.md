# Tasks: Add Confirmation Dialogs for Destructive Actions

## Task 1: Create ConfirmDialog Component

**Implementation:**
1. Create `app/components/ui/ConfirmDialog.tsx` with props interface:
   - `isOpen: boolean`
   - `title: string`
   - `message: string`
   - `onConfirm: () => void`
   - `onCancel: () => void`
   - `confirmLabel?: string` (default: "Confirm")
   - `cancelLabel?: string` (default: "Cancel")
2. Implement modal dialog with:
   - Backdrop overlay (semi-transparent dark background)
   - Centered dialog box with white background, rounded corners, shadow
   - Title displayed prominently (text-xl font-semibold)
   - Message displayed below title (text-sm text-gray-600)
   - Button row with Cancel (left, gray) and Confirm (right, red) buttons
3. Add event handlers:
   - Escape key closes dialog (calls onCancel)
   - Backdrop click closes dialog (calls onCancel)
   - Confirm button calls onConfirm then closes
   - Cancel button calls onCancel then closes
4. Implement focus management:
   - Focus Cancel button when dialog opens
   - Trap focus within dialog (Tab cycles between buttons)
5. Add ARIA attributes:
   - `role="dialog"`
   - `aria-modal="true"`
   - `aria-labelledby` pointing to title
   - `aria-describedby` pointing to message
6. Use design tokens for colors (if available) or Tailwind classes
7. Make responsive: full width on mobile (<640px), fixed width on desktop

**Test Plan:**
- Unit test: Dialog renders with correct title and message
- Unit test: Clicking Confirm calls onConfirm callback
- Unit test: Clicking Cancel calls onCancel callback
- Unit test: Pressing Escape calls onCancel callback
- Unit test: Clicking backdrop calls onCancel callback
- E2E test: Dialog is keyboard accessible (Tab navigation, Enter to confirm)
- E2E test: Dialog has correct ARIA attributes
- Visual test: Dialog appears centered with correct styling

---

## Task 2: Create useConfirmDialog Hook

**Implementation:**
1. Create `app/hooks/useConfirmDialog.ts`
2. Implement hook with useState for isOpen state
3. Implement openDialog function: sets isOpen to true
4. Implement closeDialog function: sets isOpen to false
5. Implement confirmDialog function: accepts action callback, executes it, then sets isOpen to false
6. Return object: `{ isOpen, openDialog, closeDialog, confirmDialog }`

**Test Plan:**
- Unit test: Hook initializes with isOpen = false
- Unit test: openDialog sets isOpen to true
- Unit test: closeDialog sets isOpen to false
- Unit test: confirmDialog executes action callback and sets isOpen to false
- Integration test: Hook works correctly in component context

---

## Task 3: Add Confirmation to Reject Application

**Implementation:**
1. Open `app/dashboard/gigs/[id]/page.tsx` (or wherever Reject Application button is rendered)
2. Import ConfirmDialog and useConfirmDialog
3. Add useConfirmDialog hook to component
4. Wrap existing Reject Application button click handler:
   - On click: call openDialog() instead of directly calling rejectApplication
5. Add ConfirmDialog component to JSX:
   - isOpen={isOpen}
   - title="Reject Application"
   - message="This will permanently reject this application. The specialist will be notified and cannot reapply to this gig."
   - onConfirm={() => confirmDialog(() => rejectApplication(applicationId))}
   - onCancel={closeDialog}
6. Ensure existing rejectApplication server action logic unchanged

**Test Plan:**
- E2E test: Clicking "Reject Application" opens confirmation dialog
- E2E test: Dialog displays correct title and message
- E2E test: Clicking "Confirm" in dialog executes rejection and closes dialog
- E2E test: Clicking "Cancel" in dialog closes dialog without rejecting
- E2E test: Application status remains PENDING after cancel
- E2E test: Application status updates to REJECTED after confirm
- Integration test: rejectApplication server action still works correctly

---

## Task 4: Add Confirmation to Withdraw Application

**Implementation:**
1. Open `app/dashboard/gigs/[id]/page.tsx` (or wherever Withdraw Application button is rendered)
2. Import ConfirmDialog and useConfirmDialog (if not already imported)
3. Add useConfirmDialog hook to component (or reuse existing if same component)
4. Wrap existing Withdraw Application button click handler:
   - On click: call openDialog() instead of directly calling withdrawApplication
5. Add ConfirmDialog component to JSX:
   - isOpen={isOpen}
   - title="Withdraw Application"
   - message="This will withdraw your application. You will not be able to reapply to this gig."
   - onConfirm={() => confirmDialog(() => withdrawApplication(applicationId))}
   - onCancel={closeDialog}
6. Ensure existing withdrawApplication server action logic unchanged

**Test Plan:**
- E2E test: Clicking "Withdraw Application" opens confirmation dialog
- E2E test: Dialog displays correct title and message
- E2E test: Clicking "Confirm" in dialog executes withdrawal and closes dialog
- E2E test: Clicking "Cancel" in dialog closes dialog without withdrawing
- E2E test: Application status remains PENDING after cancel
- E2E test: Application status updates to WITHDRAWN after confirm
- Integration test: withdrawApplication server action still works correctly

---

## Task 5: Add Confirmation to Close Gig (Admin)

**Implementation:**
1. Open `app/admin/gigs/page.tsx` (or wherever Close Gig button is rendered)
2. Import ConfirmDialog and useConfirmDialog
3. Add useConfirmDialog hook to component
4. Wrap existing Close Gig button click handler:
   - On click: call openDialog() instead of directly calling closeGig
5. Add ConfirmDialog component to JSX:
   - isOpen={isOpen}
   - title="Close Gig"
   - message="This will close the gig and prevent new applications. The gig owner and assigned specialist (if any) will no longer be able to interact with this gig. This action is logged."
   - onConfirm={() => confirmDialog(() => closeGig(gigId))}
   - onCancel={closeDialog}
6. Ensure existing closeGig server action logic unchanged (transaction, moderation log)

**Test Plan:**
- E2E test: Admin clicking "Close Gig" opens confirmation dialog
- E2E test: Dialog displays correct title and message
- E2E test: Clicking "Confirm" in dialog executes close and closes dialog
- E2E test: Clicking "Cancel" in dialog closes dialog without closing gig
- E2E test: Gig closedByAdmin remains false after cancel
- E2E test: Gig closedByAdmin updates to true after confirm
- E2E test: ModerationLog entry created after confirm
- Integration test: closeGig server action still works correctly

---

## Task 6: Add Confirmation to Suspend User (Admin)

**Implementation:**
1. Open `app/admin/users/page.tsx` (or wherever Suspend User button is rendered)
2. Import ConfirmDialog and useConfirmDialog
3. Add useConfirmDialog hook to component
4. Wrap existing Suspend User button click handler:
   - On click: call openDialog() instead of directly calling suspendUser
5. Add ConfirmDialog component to JSX:
   - isOpen={isOpen}
   - title="Suspend User"
   - message="This will suspend the user's account and prevent them from logging in. All their active gigs and applications will remain visible but they cannot create new ones. This action is logged."
   - onConfirm={() => confirmDialog(() => suspendUser(userId))}
   - onCancel={closeDialog}
6. Ensure existing suspendUser server action logic unchanged (transaction, moderation log)

**Test Plan:**
- E2E test: Admin clicking "Suspend" opens confirmation dialog
- E2E test: Dialog displays correct title and message
- E2E test: Clicking "Confirm" in dialog executes suspension and closes dialog
- E2E test: Clicking "Cancel" in dialog closes dialog without suspending
- E2E test: User suspended field remains false after cancel
- E2E test: User suspended field updates to true after confirm
- E2E test: ModerationLog entry created after confirm
- Integration test: suspendUser server action still works correctly

---

## Task 7: Add Confirmation to Unsuspend User (Admin)

**Implementation:**
1. Open `app/admin/users/page.tsx` (or wherever Unsuspend User button is rendered)
2. Import ConfirmDialog and useConfirmDialog (if not already imported)
3. Add useConfirmDialog hook to component (or reuse existing if same component)
4. Wrap existing Unsuspend User button click handler:
   - On click: call openDialog() instead of directly calling unsuspendUser
5. Add ConfirmDialog component to JSX:
   - isOpen={isOpen}
   - title="Unsuspend User"
   - message="This will restore the user's account access and allow them to log in again. This action is logged."
   - onConfirm={() => confirmDialog(() => unsuspendUser(userId))}
   - onCancel={closeDialog}
6. Ensure existing unsuspendUser server action logic unchanged

**Test Plan:**
- E2E test: Admin clicking "Unsuspend" opens confirmation dialog
- E2E test: Dialog displays correct title and message
- E2E test: Clicking "Confirm" in dialog executes unsuspension and closes dialog
- E2E test: Clicking "Cancel" in dialog closes dialog without unsuspending
- E2E test: User suspended field remains true after cancel
- E2E test: User suspended field updates to false after confirm
- E2E test: ModerationLog entry created after confirm
- Integration test: unsuspendUser server action still works correctly

---

## Task 8: Integration Testing and Documentation

**Implementation:**
1. Run full test suite to ensure no regressions
2. Verify all E2E tests pass for confirmation flows
3. Update `TESTING.md` with examples of testing confirmation dialogs
4. Update component documentation if needed

**Test Plan:**
- Run `npm test` - all unit tests pass
- Run `npm run test:e2e` - all E2E tests pass
- Manual testing: verify all confirmation dialogs work in browser
- Manual testing: verify keyboard navigation works
- Manual testing: verify mobile responsive behavior
- Manual testing: verify screen reader announces dialog correctly
