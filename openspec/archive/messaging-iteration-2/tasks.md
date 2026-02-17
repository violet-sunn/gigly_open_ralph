# Implementation Tasks: messaging-iteration-2

## Task 1: Create sendMessage Server Action
**File**: `app/actions/gig.ts`

### Implementation Notes
- Add new server action `sendMessage` to existing gig actions file
- Signature: `async function sendMessage(prevState: { error?: string } | null, formData: FormData)`
- Extract `gigId` and `content` from formData
- Validate content is non-empty after trimming
- Get session and verify authentication
- Query gig with `include: { assignedSpecialist: true }` to check authorization
- Verify user is gig owner OR assigned specialist
- Verify gig has assigned specialist (assignedSpecialistId !== null)
- Verify gig is not closed by admin (closedByAdmin === false)
- Create message using `prisma.message.create()`
- Call `revalidatePath(\`/dashboard/gigs/${gigId}\`)` to refresh the page
- Return `{ error: undefined }` on success or `{ error: string }` on failure

### Test Plan
1. **Setup**: Run `npx tsx scripts/test-message-model.ts` to seed test data (creates client, specialist, gig with IN_PROGRESS status)
2. **Test authorization**:
   - Create a test script that calls sendMessage with different user sessions
   - Verify gig owner can send messages
   - Verify assigned specialist can send messages
   - Verify non-assigned specialist gets error
   - Verify unauthenticated user redirects to login
3. **Test validation**:
   - Submit empty content → expect error "Message content is required."
   - Submit whitespace-only content → expect error "Message content is required."
   - Submit valid content → expect success
4. **Test edge cases**:
   - Send message to OPEN gig (no assigned specialist) → expect error
   - Send message to closed gig (closedByAdmin = true) → expect error
   - Send message to non-existent gig → expect error "Gig not found."
5. **Verify database**:
   - After successful send, query `prisma.message.findMany({ where: { gigId } })`
   - Verify message was created with correct gigId, senderId, content
   - Verify createdAt timestamp is recent

**Acceptance Criteria**:
- [ ] Server action exported from `app/actions/gig.ts`
- [ ] All validation scenarios return appropriate errors
- [ ] Authorization checks prevent unauthorized access
- [ ] Successful sends create Message records in database
- [ ] Page revalidation triggers after successful send

---

## Task 2: Create MessageList Component
**File**: `app/dashboard/gigs/[id]/message-list.tsx` (new file)

### Implementation Notes
- Create a server component that displays messages
- Props: `messages: Array<Message & { sender: User & { clientProfile, specialistProfile } }>`
- Render messages in chronological order (already sorted by query)
- For each message:
  - Display sender name: use `sender.specialistProfile?.displayName` or `sender.clientProfile?.companyName` or fallback to `sender.email`
  - Display content as plain text (use `whitespace-pre-wrap` for line breaks)
  - Display timestamp: `message.createdAt.toLocaleString('ru-RU')`
- Use simple list rendering with Tailwind classes for styling
- Handle empty state: "No messages yet. Start the conversation below."
- Style messages with subtle borders/backgrounds to distinguish them
- Consider adding visual distinction for "own" messages vs "other" messages (optional, but nice UX)

### Test Plan
1. **Visual testing**:
   - Seed messages using test script
   - Navigate to gig detail page as CLIENT owner
   - Verify messages display in correct order (oldest first)
   - Verify sender names are correct
   - Verify timestamps are formatted correctly
   - Navigate as assigned SPECIALIST
   - Verify same messages are visible
2. **Empty state**:
   - Create a gig with assigned specialist but no messages
   - Verify empty state message displays
3. **Sender name display**:
   - Create messages from users with and without profiles
   - Verify display name / company name is used when available
   - Verify email is used as fallback

**Acceptance Criteria**:
- [ ] Component renders messages in chronological order
- [ ] Sender names display correctly (profile name or email fallback)
- [ ] Timestamps formatted as locale string
- [ ] Empty state handled gracefully
- [ ] Styling is clean and readable

---

## Task 3: Create MessageForm Component
**File**: `app/dashboard/gigs/[id]/message-form.tsx` (new file)

### Implementation Notes
- Create a client component with `'use client'` directive
- Props: `gigId: string`
- Use `useActionState` hook with `sendMessage` action
- Use `useFormStatus` hook for pending state
- Render form with:
  - Hidden input for gigId
  - Textarea for content (name="content", required, rows={3}, placeholder="Type your message...")
  - Submit button ("Send Message" / "Sending..." based on pending state)
- Display error message if `state?.error` exists
- Clear textarea after successful send using `useEffect` or form ref
- Disable textarea and button during submission

### Test Plan
1. **Form submission**:
   - Navigate to gig detail page as authorized user
   - Type message in textarea
   - Click "Send Message"
   - Verify button shows "Sending..." and is disabled
   - Verify textarea is disabled during submission
   - After success, verify textarea is cleared
   - Verify new message appears in message list
2. **Error handling**:
   - Submit empty message
   - Verify error displays: "Message content is required."
   - Verify form remains visible for retry
   - Submit valid message
   - Verify error clears
3. **Loading state**:
   - Submit message and observe loading state
   - Verify button text changes to "Sending..."
   - Verify button is disabled

**Acceptance Criteria**:
- [ ] Form uses useActionState with sendMessage action
- [ ] Loading state displays correctly
- [ ] Error messages display inline
- [ ] Textarea clears after successful send
- [ ] Form is disabled during submission

---

## Task 4: Update Gig Detail Page
**File**: `app/dashboard/gigs/[id]/page.tsx`

### Implementation Notes
- Import MessageList and MessageForm components
- Update Prisma query to include messages:
  ```typescript
  include: {
    // ... existing includes
    messages: {
      include: {
        sender: {
          select: { email: true, id: true },
          include: {
            clientProfile: { select: { companyName: true } },
            specialistProfile: { select: { displayName: true } }
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    }
  }
  ```
- Add access control logic:
  ```typescript
  const canViewMessages = (isOwner || isAssignedSpecialist) && gig.assignedSpecialistId !== null
  ```
- Render Messages section conditionally:
  - Only show if `canViewMessages` is true
  - Position after applications section or before admin moderation section
  - Wrap in white card with padding (consistent with other sections)
  - Include heading "Messages"
  - Render MessageList component with messages prop
  - Render MessageForm component with gigId prop

### Test Plan
1. **Access control**:
   - As CLIENT owner of gig with assigned specialist → verify messages section visible
   - As assigned SPECIALIST → verify messages section visible
   - As non-assigned SPECIALIST → verify messages section NOT visible
   - As CLIENT owner of OPEN gig (no assigned specialist) → verify messages section NOT visible
2. **Integration**:
   - Send message using form
   - Verify page revalidates and new message appears
   - Verify message list updates without full page reload (Next.js revalidation)
3. **Layout**:
   - Verify messages section fits naturally in page layout
   - Verify responsive design works on mobile
   - Verify no layout shifts or visual bugs

**Acceptance Criteria**:
- [ ] Query includes messages with sender relations
- [ ] Access control prevents unauthorized viewing
- [ ] Messages section renders conditionally
- [ ] MessageList and MessageForm components integrated
- [ ] Page layout remains clean and responsive

---

## Task 5: End-to-End Testing
**File**: Manual testing checklist

### Test Plan
1. **Setup test data**:
   - Run `npx tsx scripts/test-message-model.ts` to create test users and gig
   - Verify test gig has status IN_PROGRESS with assigned specialist
   - Manually create additional messages via Prisma Studio if needed

2. **Test as CLIENT owner**:
   - Login as test client user
   - Navigate to test gig detail page
   - Verify messages section is visible
   - Verify existing messages display correctly
   - Send a new message
   - Verify message appears in list immediately
   - Verify sender name shows client email or company name

3. **Test as assigned SPECIALIST**:
   - Login as test specialist user
   - Navigate to test gig detail page
   - Verify messages section is visible
   - Verify all messages (including client's) display correctly
   - Send a new message
   - Verify message appears in list
   - Verify sender name shows specialist email or display name

4. **Test as non-assigned SPECIALIST**:
   - Create another specialist user
   - Have them apply to the test gig (but don't accept)
   - Login as this specialist
   - Navigate to test gig detail page
   - Verify messages section is NOT visible
   - Verify message form is NOT visible

5. **Test edge cases**:
   - Try to send empty message → verify error
   - Try to send very long message → verify it displays correctly
   - Test with gig in different statuses (IN_PROGRESS, REVIEW, COMPLETED, PAID)
   - Verify messages work in all post-assignment statuses

6. **Test chronological ordering**:
   - Create multiple messages with different timestamps
   - Verify they display oldest first
   - Send new message
   - Verify it appears at the bottom of the list

**Acceptance Criteria**:
- [ ] All user roles see correct content based on authorization
- [ ] Messages send and display correctly
- [ ] Access control works as specified
- [ ] No console errors or warnings
- [ ] UI is responsive and accessible
- [ ] Feature works across all relevant gig statuses

---

## Summary

This change adds message display and composition to the gig detail page, completing the messaging feature started in iteration 1. The implementation follows the project's principles of simplicity and MVP focus, providing essential communication functionality without over-engineering.

**Total estimated effort**: 3-4 hours
- Task 1: 1 hour
- Task 2: 45 minutes
- Task 3: 45 minutes
- Task 4: 30 minutes
- Task 5: 45 minutes

**Dependencies**:
- messaging-iteration-1 (completed)
- Existing gig detail page structure
- Existing authentication and session management
