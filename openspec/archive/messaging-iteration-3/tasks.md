# Implementation Tasks: messaging-iteration-3

## Task 1: Implement sendMessage Server Action

**Implementation:**
1. Open or create `app/actions/gig.ts`
2. Add `sendMessage` server action with signature:
   ```typescript
   export async function sendMessage(
     prevState: { error?: string } | null,
     formData: FormData
   ): Promise<{ error?: string }>
   ```
3. Extract and validate inputs:
   - `gigId` from formData (hidden field)
   - `content` from formData (textarea)
   - Validate content is not empty after trimming
   - Validate content length <= 2000 characters (before trimming)
4. Get session and verify authentication (redirect to `/login` if not authenticated)
5. Fetch gig with relations:
   ```typescript
   const gig = await prisma.gig.findUnique({
     where: { id: gigId },
     select: {
       id: true,
       clientId: true,
       assignedSpecialistId: true,
       closedByAdmin: true,
     },
   })
   ```
6. Validate gig exists, has assigned specialist, and is not closed
7. Verify user is authorized (clientId === userId OR assignedSpecialistId === userId)
8. Create message:
   ```typescript
   await prisma.message.create({
     data: {
       gigId,
       senderId: session.userId,
       content: content.trim(),
     },
   })
   ```
9. On success: `redirect(\`/dashboard/gigs/${gigId}\`)`
10. On error: return `{ error: 'descriptive message' }`

**Test Plan:**
1. Run `npx tsx scripts/test-send-message.ts` (to be created)
2. Verify successful message creation by authorized users (client and specialist)
3. Verify rejection of unauthorized users
4. Verify rejection of empty content
5. Verify rejection of content > 2000 characters
6. Verify rejection when no specialist assigned
7. Verify rejection when gig is closed
8. Verify redirect happens on success (check that redirect() is called)

---

## Task 2: Update MessageForm Component (if needed)

**Implementation:**
1. Open `app/dashboard/gigs/[id]/message-form.tsx`
2. Verify it uses `useActionState` with `sendMessage` action
3. Verify it has textarea with `name="content"` and hidden input with `name="gigId"`
4. Add `maxLength={2000}` attribute to textarea for client-side validation
5. Ensure error display works correctly
6. Note: Form reset will happen automatically via redirect (no need for useEffect reset logic)

**Test Plan:**
1. Manually test in browser:
   - Navigate to a gig detail page with assigned specialist
   - Send a message as the client
   - Verify redirect happens and new message appears
   - Send a message as the assigned specialist
   - Verify redirect happens and new message appears
2. Test validation:
   - Try to send empty message (should show error)
   - Try to send message > 2000 chars (should show error)
3. Test unauthorized access:
   - Try to send message as non-participant (should show error)

---

## Task 3: Create Integration Test Script

**Implementation:**
1. Create `scripts/test-send-message.ts`
2. Test scenarios:
   - Create test users (client, specialist1, specialist2)
   - Create test gig with assigned specialist
   - Test successful message send by client
   - Test successful message send by assigned specialist
   - Test rejection by non-assigned specialist
   - Test rejection with empty content
   - Test rejection with content > 2000 chars
   - Test rejection on OPEN gig (no assigned specialist)
   - Test rejection on closed gig
3. Use FormData to simulate form submissions
4. Assert expected outcomes (message created or error returned)

**Test Plan:**
```bash
npx tsx scripts/test-send-message.ts
```
Expected output: All test scenarios pass with appropriate success/error messages.

---

## Task 4: Manual UI Testing

**Implementation:**
1. Start dev server: `npm run dev`
2. Create test data:
   - Register as CLIENT, create profile, create gig
   - Register as SPECIALIST, create profile, apply to gig
   - Accept application as CLIENT
3. Test messaging flow:
   - Send message as CLIENT
   - Verify redirect and message appears
   - Send message as SPECIALIST
   - Verify redirect and message appears
4. Test edge cases:
   - Try sending very long message (>2000 chars)
   - Try sending empty message
   - Log in as different user, try to send message (should fail)

**Test Plan:**
Manual verification checklist:
- [ ] Client can send messages on their own gigs
- [ ] Assigned specialist can send messages
- [ ] Non-participants cannot send messages
- [ ] Empty messages are rejected
- [ ] Messages > 2000 chars are rejected
- [ ] Page redirects and refreshes after successful send
- [ ] Error messages display correctly
- [ ] Messages appear in correct chronological order
