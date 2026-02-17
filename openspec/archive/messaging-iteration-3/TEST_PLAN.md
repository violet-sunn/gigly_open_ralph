# Test Plan: messaging-iteration-3

## Automated Tests

### Integration Tests
**Script:** `scripts/test-send-message.ts`
**Command:** `npx tsx scripts/test-send-message.ts`

**Coverage:**
- ✅ Content validation (empty, max length, trimming)
- ✅ Authorization logic (owner, assigned specialist, unauthorized users)
- ✅ Gig state validation (assigned specialist required, not closed)
- ✅ Message creation by client
- ✅ Message creation by specialist
- ✅ Message retrieval and chronological ordering
- ✅ Non-existent gig handling

**Status:** All tests passing ✅

---

## Manual UI Testing

### Prerequisites
1. Start development server: `npm run dev`
2. Navigate to `http://localhost:3000`

### Test Scenario 1: Client Sends Message
**Steps:**
1. Register/login as CLIENT
2. Create a gig (if needed)
3. Have a SPECIALIST apply to the gig
4. Accept the application (gig moves to IN_PROGRESS)
5. Navigate to gig detail page
6. Scroll to "Messages" section
7. Type a message in the textarea
8. Click "Send Message"

**Expected Results:**
- ✅ Page redirects and refreshes
- ✅ New message appears in message list
- ✅ Message shows client's company name as sender
- ✅ Timestamp is displayed
- ✅ Form is cleared (due to redirect)

### Test Scenario 2: Specialist Sends Message
**Steps:**
1. Login as the assigned SPECIALIST
2. Navigate to the gig detail page
3. Scroll to "Messages" section
4. Type a message in the textarea
5. Click "Send Message"

**Expected Results:**
- ✅ Page redirects and refreshes
- ✅ New message appears in message list
- ✅ Message shows specialist's display name as sender
- ✅ Messages appear in chronological order

### Test Scenario 3: Empty Message Validation
**Steps:**
1. As authorized user (client or specialist)
2. Navigate to gig detail page
3. Try to submit empty message (just spaces)
4. Click "Send Message"

**Expected Results:**
- ✅ Error message displayed: "Message content is required."
- ✅ No page redirect
- ✅ No new message created

### Test Scenario 4: Max Length Validation
**Steps:**
1. As authorized user
2. Navigate to gig detail page
3. Type or paste message > 2000 characters
4. Try to submit

**Expected Results:**
- ✅ Client-side: textarea prevents input beyond 2000 chars
- ✅ Server-side: if bypassed, error message: "Message is too long. Maximum 2000 characters allowed."

### Test Scenario 5: Unauthorized Access
**Steps:**
1. Login as SPECIALIST who is NOT assigned to the gig
2. Navigate to gig detail page (via direct URL)
3. Check if message section is visible

**Expected Results:**
- ✅ Message section is NOT visible
- ✅ Cannot send messages

### Test Scenario 6: OPEN Gig (No Specialist)
**Steps:**
1. Login as CLIENT
2. Navigate to OPEN gig (no applications accepted yet)
3. Check if message section is visible

**Expected Results:**
- ✅ Message section is NOT visible
- ✅ Cannot send messages until specialist is assigned

### Test Scenario 7: Closed Gig
**Steps:**
1. As ADMIN, close a gig
2. Login as client or assigned specialist
3. Navigate to closed gig
4. Try to send message (if form is visible)

**Expected Results:**
- ✅ Error message: "Cannot send messages to a closed gig."
- ✅ No message created

### Test Scenario 8: Content Trimming
**Steps:**
1. As authorized user
2. Type message with leading/trailing spaces: "  Hello  "
3. Submit message

**Expected Results:**
- ✅ Message stored as "Hello" (trimmed)
- ✅ Displayed without extra whitespace

---

## Regression Testing

### Verify Existing Functionality Still Works
- ✅ Gig creation
- ✅ Application submission
- ✅ Application acceptance
- ✅ Work submission
- ✅ Work approval
- ✅ Mark as paid
- ✅ Admin moderation

---

## Performance Testing

### Load Test (Optional)
1. Create gig with 50+ messages
2. Navigate to gig detail page
3. Send new message

**Expected:**
- Page loads in reasonable time
- Redirect completes successfully
- All messages display correctly

---

## Browser Compatibility (Optional)

Test in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

**Expected:**
- Consistent behavior across browsers
- Form validation works
- Redirect works
- Messages display correctly

---

## Accessibility Testing (Optional)

- ✅ Textarea is keyboard accessible
- ✅ Submit button is keyboard accessible
- ✅ Error messages are announced by screen readers
- ✅ Form has proper labels

---

## Security Testing

### Manual Security Checks
1. **SQL Injection:** Try sending message with SQL: `'; DROP TABLE messages; --`
   - Expected: Stored as plain text, no SQL execution
2. **XSS:** Try sending message with script: `<script>alert('xss')</script>`
   - Expected: Displayed as plain text, no script execution
3. **Authorization Bypass:** Try to send message to gig you don't own
   - Expected: Error message, no message created

---

## Sign-off Checklist

- [ ] All automated tests passing
- [ ] Manual UI tests completed
- [ ] No console errors in browser
- [ ] No server errors in logs
- [ ] Error messages are user-friendly
- [ ] Success behavior works as expected
- [ ] Authorization is enforced
- [ ] Content validation works
- [ ] Messages display correctly
- [ ] Timestamps are formatted correctly
- [ ] Sender names display correctly
- [ ] Page performance is acceptable
