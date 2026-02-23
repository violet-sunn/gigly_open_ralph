# Implementation Tasks: Terminal State Messaging

## Task 1: Add PAID status check to sendMessage server action

**Implementation:**
- Open `app/actions/gig.ts`
- Locate the `sendMessage` function (around line 368)
- Find the existing `closedByAdmin` check (around line 412)
- Add PAID status check immediately after the `closedByAdmin` check:
  ```typescript
  if (gig.status === 'PAID') {
    return { error: 'Cannot send messages to a paid gig.' }
  }
  ```
- Ensure the check happens AFTER authorization but BEFORE message creation

**Test Plan:**
- Run existing integration tests: `npm run test:unit -- __tests__/integration/messaging.test.ts`
- All existing tests should pass (no regression)
- Add new test case in `__tests__/integration/messaging.test.ts`:
  ```typescript
  test('sendMessage rejects messages to PAID gigs', async () => {
    // Create gig with PAID status
    // Attempt to send message as authorized user
    // Assert error: 'Cannot send messages to a paid gig.'
    // Assert no message record created
  })
  ```
- Verify test passes

---

## Task 2: Update gig detail page UI to hide MessageForm for PAID gigs

**Implementation:**
- Open `app/dashboard/gigs/[id]/page.tsx`
- Locate the messaging conditional logic (around line 357)
- Find the existing MessageForm conditional: `{!gig.closedByAdmin && (...)`
- Update the condition to: `{!gig.closedByAdmin && gig.status !== 'PAID' && (...)`
- This will hide the MessageForm when either condition is true

**Test Plan:**
- Run existing E2E tests: `npm run test:e2e -- __tests__/e2e/gig-lifecycle.spec.ts`
- All existing tests should pass
- Manual verification:
  1. Create a test gig and complete the full lifecycle to PAID status
  2. Navigate to the gig detail page as the client
  3. Verify MessageForm is NOT visible
  4. Verify existing messages ARE visible
  5. Navigate to the same page as the assigned specialist
  6. Verify same behavior (no form, messages visible)

---

## Task 3: Add explanatory message for PAID status

**Implementation:**
- Open `app/dashboard/gigs/[id]/page.tsx`
- Locate the existing `closedByAdmin` explanatory message block (around line 362-368)
- Add a new conditional block immediately after the MessageForm conditional:
  ```tsx
  {gig.status === 'PAID' && (
    <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
      <p className="text-sm text-gray-600">
        This gig has been marked as paid. Messaging is no longer available.
      </p>
    </div>
  )}
  ```
- Ensure styling matches the `closedByAdmin` message for consistency

**Test Plan:**
- Manual verification:
  1. Navigate to a PAID gig detail page
  2. Verify explanatory message is displayed below the message list
  3. Verify message text is clear and matches specification
  4. Verify styling matches the closedByAdmin message (gray background, border, padding)
- Add E2E test in `__tests__/e2e/messaging.spec.ts`:
  ```typescript
  test('displays explanatory message for PAID gigs', async ({ page }) => {
    // Create and complete gig to PAID status
    // Navigate to gig detail page
    // Assert explanatory message is visible
    // Assert message text matches specification
  })
  ```

---

## Task 4: Add integration tests for PAID status messaging

**Implementation:**
- Open or create `__tests__/integration/messaging.test.ts`
- Add comprehensive test coverage for PAID status scenarios:
  1. `sendMessage` rejects messages to PAID gigs (client)
  2. `sendMessage` rejects messages to PAID gigs (specialist)
  3. Existing messages remain accessible on PAID gigs
  4. COMPLETED gigs still allow messaging (regression test)

**Test Plan:**
- Run test suite: `npm run test:unit -- __tests__/integration/messaging.test.ts`
- All new tests should pass
- Verify coverage includes both client and specialist perspectives
- Verify error messages match specification exactly

---

## Task 5: Update gig specification documentation

**Implementation:**
- The spec delta has already been created in `openspec/changes/terminal-state-messaging/specs/gig/spec.md`
- After implementation is complete and tested, merge the spec delta into `openspec/specs/gig/spec.md`:
  1. Add the new "Send message to PAID gig" scenario to the "Send Message Server Action" requirement
  2. Add the new "Display messaging UI for PAID gig" and "Display messaging UI for COMPLETED gig" scenarios to create a new "Gig Detail Page Messaging UI" requirement
  3. Update acceptance criteria to reflect the new validation logic

**Test Plan:**
- Review the updated specification for completeness
- Verify all scenarios have clear GIVEN/WHEN/THEN structure
- Verify acceptance criteria are testable and deterministic
- Run full test suite to confirm specification matches implementation: `npm test`

---

## Task 6: Regression testing

**Implementation:**
- No code changes required
- Comprehensive verification that existing functionality is not broken

**Test Plan:**
- Run full test suite: `npm test`
- Verify all 493+ existing tests pass
- Manual testing checklist:
  1. Create new gig → verify messaging works in IN_PROGRESS
  2. Submit work → verify messaging works in REVIEW
  3. Approve work → verify messaging works in COMPLETED
  4. Mark as paid → verify messaging is disabled in PAID
  5. Admin closes gig → verify messaging is disabled (existing behavior)
  6. Verify both conditions (closedByAdmin AND status=PAID) independently disable messaging
- E2E test run: `npm run test:e2e`
- Verify no regressions in gig lifecycle, application management, or other messaging scenarios
