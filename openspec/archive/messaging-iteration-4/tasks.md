# Implementation Tasks: messaging-iteration-4

## Task 1: Add Visual Distinction Between Client and Specialist Messages

**Description:**
Update the MessageList component to visually distinguish between client and specialist messages using alignment and color accents.

**Implementation Notes:**

Files to modify:
- `app/dashboard/gigs/[id]/message-list.tsx`
- `app/dashboard/gigs/[id]/page.tsx` (pass currentUserId to MessageList)

Changes:
1. Add `currentUserId` prop to MessageList component interface
2. For each message, determine if sender is client or specialist by checking `message.sender.role` or comparing `message.senderId` with `gig.clientId`
3. Apply conditional styling:
   - **Client messages**: `text-left`, blue accent (e.g., `border-l-4 border-blue-500 pl-3`)
   - **Specialist messages**: `text-right`, green accent (e.g., `border-r-4 border-green-500 pr-3`)
   - Consider adding subtle background tint: `bg-blue-50` for client, `bg-green-50` for specialist
4. Adjust layout to support right-aligned messages (use `flex` with `justify-end` for specialist messages)
5. Keep sender name and timestamp visible for all messages

**Test Plan:**

Manual testing:
1. Create a test gig and accept a specialist application
2. Send messages as both client and specialist
3. Verify visual distinction:
   - Client messages appear left-aligned with blue accent
   - Specialist messages appear right-aligned with green accent
   - Sender names are still visible
   - Timestamps are still visible
   - Content is readable and properly formatted
4. Test with long messages to ensure layout doesn't break
5. Test with multiple consecutive messages from same sender

Assertions:
- Messages from different senders MUST be visually distinguishable at a glance
- Layout MUST remain clean and readable
- No horizontal scrolling or overflow issues
- Existing message data (name, timestamp, content) MUST still be displayed

---

## Task 2: Handle Edge Case When No Specialist Assigned

**Description:**
Update the gig detail page to show an informational message when messaging is unavailable because no specialist has been assigned yet.

**Implementation Notes:**

Files to modify:
- `app/dashboard/gigs/[id]/page.tsx`

Changes:
1. Locate the messaging section rendering logic (currently around line 277-285)
2. Update the `canViewMessages` condition logic:
   - Current: `(isOwner || isAssignedSpecialist) && gig.assignedSpecialistId !== null`
   - Keep this logic but add more granular rendering
3. Add conditional rendering:
   ```tsx
   {(isOwner || isAssignedSpecialist) && (
     <div className="mt-6 bg-white rounded-lg shadow-md p-6">
       <h3 className="text-lg font-medium text-gray-900 mb-4">Messages</h3>
       {gig.assignedSpecialistId === null ? (
         <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
           <p className="text-sm text-blue-800">
             Messaging will be available once a specialist is assigned to this gig.
           </p>
         </div>
       ) : (
         <>
           <MessageList messages={gig.messages} currentUserId={session.userId} gigClientId={gig.clientId} />
           <div className="mt-4 pt-4 border-t border-gray-200">
             <MessageForm gigId={gig.id} />
           </div>
         </>
       )}
     </div>
   )}
   ```
4. Consider showing this section only to the gig owner when status is OPEN (specialists shouldn't see it)

**Test Plan:**

Manual testing:
1. Create a new gig (status = OPEN, no specialist assigned)
2. View the gig as the client owner
3. Verify messaging section shows: "Messaging will be available once a specialist is assigned to this gig."
4. Verify no message form is displayed
5. Accept a specialist application
6. Verify messaging section now shows message list and form
7. Verify specialists cannot see the "not available" message on OPEN gigs they haven't been assigned to

Assertions:
- OPEN gigs without specialist MUST show informational message to owner
- Message form MUST NOT be displayed when no specialist assigned
- After specialist assignment, full messaging MUST be available
- No JavaScript errors in console

---

## Task 3: Enhance Client-Side Whitespace Validation (Optional)

**Description:**
Add client-side validation to prevent submission of whitespace-only messages, improving UX by catching this before server round-trip.

**Implementation Notes:**

Files to modify:
- `app/dashboard/gigs/[id]/message-form.tsx`

Changes:
1. Add `pattern` attribute to textarea to reject whitespace-only input:
   ```tsx
   <textarea
     name="content"
     required
     maxLength={2000}
     pattern=".*\S+.*"
     title="Message cannot be empty or contain only whitespace"
     rows={3}
     placeholder="Type your message..."
     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
   />
   ```
2. Alternatively, add custom validation with `onInvalid` handler for better error messages
3. Backend validation MUST remain in place as the authoritative check

**Test Plan:**

Manual testing:
1. Navigate to a gig with messaging enabled
2. Try to submit a message with only spaces
3. Verify browser shows validation error before submission
4. Try to submit a message with only newlines
5. Verify browser shows validation error
6. Submit a valid message with leading/trailing whitespace
7. Verify message is accepted and trimmed content is stored

Assertions:
- Whitespace-only messages MUST be rejected at client side
- Valid messages with whitespace MUST be accepted and trimmed
- Backend validation MUST still catch any edge cases
- Error messages MUST be clear and helpful

---

## Task 4: Cross-Status Messaging Testing

**Description:**
Comprehensive testing to verify messaging works correctly across all gig lifecycle statuses.

**Implementation Notes:**

No code changes required - this is a testing task to verify existing implementation.

Test scenarios to cover:
1. OPEN status (no specialist) - messaging unavailable
2. IN_PROGRESS status - messaging available
3. REVIEW status - messaging available
4. COMPLETED status - messaging available
5. PAID status - messaging available
6. closedByAdmin = true - messaging blocked

**Test Plan:**

Manual testing workflow:
1. **Setup**: Create a test gig and accept a specialist application

2. **Test IN_PROGRESS status**:
   - Gig should be in IN_PROGRESS after accepting application
   - Send messages as both client and specialist
   - Verify messages are sent, stored, and displayed correctly
   - Verify both users can see all messages

3. **Test REVIEW status**:
   - Have specialist submit work (transitions to REVIEW)
   - Send messages as both client and specialist
   - Verify messaging still works
   - Verify messages sent in previous status are still visible

4. **Test COMPLETED status**:
   - Have client approve work (transitions to COMPLETED)
   - Send messages as both client and specialist
   - Verify messaging still works (for post-completion discussion)
   - Verify all previous messages are still visible

5. **Test PAID status**:
   - Have client mark as paid (transitions to PAID)
   - Send messages as both client and specialist
   - Verify messaging still works (for follow-up)
   - Verify all previous messages are still visible

6. **Test closedByAdmin**:
   - As admin, close the gig
   - Attempt to send message as client
   - Verify error: "Cannot send messages to a closed gig."
   - Verify existing messages are still visible
   - Attempt to send message as specialist
   - Verify same error

7. **Test OPEN status (no specialist)**:
   - Create a new gig (don't accept any applications)
   - View as client owner
   - Verify informational message is shown
   - Verify no message form is displayed

Assertions:
- Messaging MUST work in IN_PROGRESS, REVIEW, COMPLETED, and PAID statuses
- Messaging MUST be blocked on closed gigs with appropriate error
- Messaging MUST be unavailable on OPEN gigs (no specialist assigned)
- All messages MUST persist across status transitions
- No data loss or corruption during status changes
- Authorization checks MUST prevent unauthorized users from sending messages

**Automated Testing (Optional):**

Consider creating an integration test script in `scripts/test-messaging-statuses.ts`:
```typescript
// Pseudo-code structure
// 1. Create gig, accept application (IN_PROGRESS)
// 2. Send message, verify stored
// 3. Submit work (REVIEW)
// 4. Send message, verify stored
// 5. Approve work (COMPLETED)
// 6. Send message, verify stored
// 7. Mark as paid (PAID)
// 8. Send message, verify stored
// 9. Close gig (admin)
// 10. Attempt message, verify error
// 11. Verify all messages still readable
```

---

## Task 5: Update MessageList to Accept Additional Props

**Description:**
Update MessageList component signature to accept props needed for sender distinction.

**Implementation Notes:**

Files to modify:
- `app/dashboard/gigs/[id]/message-list.tsx`

Changes:
1. Update MessageListProps interface:
   ```typescript
   interface MessageListProps {
     messages: MessageWithSender[]
     currentUserId: string
     gigClientId: string
   }
   ```
2. Use these props to determine message sender role:
   - If `message.senderId === gigClientId`, sender is client
   - Otherwise, sender is specialist
3. Apply styling based on sender role

**Test Plan:**

This task is part of Task 1 implementation. Testing covered there.

---

## Summary

**Total Tasks**: 5 (4 implementation + 1 comprehensive testing)

**Estimated Effort**:
- Task 1: 30-45 minutes (UI styling)
- Task 2: 20-30 minutes (conditional rendering)
- Task 3: 15-20 minutes (optional enhancement)
- Task 4: 45-60 minutes (comprehensive testing)
- Task 5: 10-15 minutes (prop updates)

**Total**: ~2-3 hours including testing

**Dependencies**:
- Task 5 must be completed before Task 1
- Task 4 should be done last to verify all changes
- Task 3 is optional and can be skipped if time is limited

**Rollback Plan**:
If issues arise, revert changes to:
- `app/dashboard/gigs/[id]/message-list.tsx`
- `app/dashboard/gigs/[id]/page.tsx`
- `app/dashboard/gigs/[id]/message-form.tsx` (if Task 3 completed)

No database migrations required - all changes are UI-only.
