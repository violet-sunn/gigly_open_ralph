# Implementation Tasks: Standardize Error Messages

## Task 1: Audit Current Error Messages

**Description:**
Review all server actions and document current error messages, categorizing them by type and identifying issues.

**Implementation:**
1. Read all files in `app/actions/` directory
2. Extract all error messages (look for `return { error: '...' }` patterns)
3. Categorize each error by type (validation, authorization, not found, state, system)
4. Identify issues: missing guidance, technical jargon, inconsistent tone
5. Create a spreadsheet or markdown table with:
   - File/function name
   - Current error message
   - Error category
   - Issues identified
   - Proposed new message

**Test Plan:**
- No tests needed (documentation task)
- Deliverable: `openspec/changes/standardize-error-messages/audit.md` with complete error inventory

---

## Task 2: Define Error Message Standards

**Description:**
Create clear guidelines for writing error messages, including structure, tone, and examples.

**Implementation:**
1. Create `openspec/changes/standardize-error-messages/specs/error-handling/spec.md`
2. Define error message structure: `[What] [Why - optional] [How]`
3. Define error categories with codes (VALIDATION, AUTHORIZATION, NOT_FOUND, STATE, RATE_LIMIT, SYSTEM)
4. Provide examples for each category showing before/after
5. Document tone guidelines (helpful, non-technical, actionable)
6. Include edge cases: multiple validation errors, generic fallbacks

**Test Plan:**
- No tests needed (specification task)
- Deliverable: Complete spec file with examples and guidelines
- Review with team to ensure guidelines are clear and practical

---

## Task 3: Standardize Authentication Errors (auth.ts)

**Description:**
Update error messages in `registerUser` and `loginUser` to follow new standards.

**Implementation:**
1. Update `registerUser` errors:
   - Password validation: Already good, keep as-is
   - Role selection: "Please select whether you're a client or specialist."
   - Duplicate email: "An account with this email already exists. Try logging in instead."
   - Rate limit: Already good (uses getRateLimitError)

2. Update `loginUser` errors:
   - Invalid credentials: Keep generic for security, but add guidance: "Invalid email or password. Check your credentials and try again."
   - Suspended account: "Your account has been suspended. Contact support at [email] for assistance."
   - Rate limit: Already good

**Test Plan:**
```bash
# Run existing auth tests
npm run test:unit -- __tests__/integration/auth.test.ts

# Verify error messages match new standards
# Update test assertions to match new error text
# All tests should pass after updates
```

---

## Task 4: Standardize Gig Creation Errors (gig.ts - createGig)

**Description:**
Update error messages in `createGig` to be more helpful and consistent.

**Implementation:**
1. Role check: "Only clients can post gigs. Switch to a client account or register as a client to continue."
2. Required fields: "Please fill in all required fields: title, description, and acceptance criteria."
3. Acceptance criteria length: "Acceptance criteria must be at least 50 characters. Add more detail about what defines success for this gig."
4. Budget validation: "Budget must be a positive number in roubles. Enter the amount you'll pay the specialist (service fee will be calculated automatically)."

**Test Plan:**
```bash
# Run gig creation tests
npm run test:unit -- __tests__/integration/gig-creation.test.ts

# Update test assertions for new error messages
# Verify all 40+ test scenarios still pass
# Manually test gig creation form to see errors in UI
```

---

## Task 5: Standardize Application Errors (gig.ts - applyToGig, acceptApplication, rejectApplication, withdrawApplication)

**Description:**
Update error messages for application-related actions.

**Implementation:**
1. `applyToGig`:
   - Role check: "Only specialists can apply to gigs. Switch to a specialist account or register as a specialist to continue."
   - Required fields: Keep current messages (already good with guidance)
   - Gig not found: "This gig no longer exists or has been removed."
   - Example gig: "This is an example gig for demonstration. Browse real gigs to find work opportunities."
   - Closed gig: "This gig has been closed by administrators and is no longer available."
   - Wrong status: "This gig is no longer accepting applications. It may already have an assigned specialist."
   - Already applied: "You've already applied to this gig. Check your dashboard to see your application status."
   - Rate limit: Already good

2. `acceptApplication`:
   - Role check: "Only clients can manage applications. If you're the specialist, wait for the client's decision."
   - Not found: "This application no longer exists or has been removed."
   - Not owner: "Only the client who posted this gig can accept applications."
   - Wrong gig status: "This gig is no longer accepting applications. A specialist may already be assigned."
   - Wrong app status: "This application has already been accepted or rejected."

3. `rejectApplication`:
   - Similar updates to acceptApplication

4. `withdrawApplication`:
   - Role check: "Only specialists can withdraw applications. If you're the client, you can reject applications instead."
   - Not found: "This application no longer exists or has been removed."
   - Not owner: "You can only withdraw your own applications."
   - Already withdrawn: "This application has already been withdrawn."
   - Wrong status: "You can only withdraw pending applications. This application has already been accepted or rejected."
   - Closed gig: "Cannot withdraw applications from closed gigs."
   - Example gig: "Cannot withdraw applications from example gigs."

**Test Plan:**
```bash
# Run application tests
npm run test:unit -- __tests__/integration/application-*.test.ts
npm run test:e2e -- __tests__/e2e/application-*.spec.ts

# Update all test assertions
# Verify application flows work correctly with new messages
# Test all error conditions manually in UI
```

---

## Task 6: Standardize Gig Lifecycle Errors (gig.ts - submitWork, approveWork, markAsPaid)

**Description:**
Update error messages for gig lifecycle transitions.

**Implementation:**
1. `submitWork`:
   - Role check: "Only specialists can submit work. If you're the client, wait for the specialist to submit their deliverables."
   - Not found: "This gig no longer exists or has been removed."
   - Wrong status: "Work can only be submitted for gigs that are in progress. Current status: [status]."
   - Not assigned: "Only the assigned specialist can submit work for this gig."

2. `approveWork`:
   - Role check: "Only clients can approve work. If you're the specialist, wait for the client to review your submission."
   - Not found: "This gig no longer exists or has been removed."
   - Wrong status: "Work can only be approved for gigs under review. The specialist needs to submit their work first."
   - Not owner: "Only the client who posted this gig can approve the work."

3. `markAsPaid`:
   - Role check: "Only clients can mark gigs as paid. If you're the specialist, wait for the client to confirm payment."
   - Not found: "This gig no longer exists or has been removed."
   - Not owner: "Only the client who posted this gig can mark it as paid."
   - Already paid: "This gig has already been marked as paid on [date]."
   - Wrong status: "Only completed gigs can be marked as paid. The work needs to be approved first."

**Test Plan:**
```bash
# Run gig lifecycle tests
npm run test:unit -- __tests__/integration/gig-lifecycle.test.ts

# Update test assertions
# Verify all lifecycle transitions work correctly
# Test error conditions manually
```

---

## Task 7: Standardize Messaging Errors (gig.ts - sendMessage)

**Description:**
Update error messages for gig messaging.

**Implementation:**
1. Rate limit: Already good (uses getRateLimitError)
2. Content validation:
   - Too long: "Message is too long. Maximum 2000 characters allowed. Current length: [length]."
   - Empty: "Message cannot be empty. Please enter a message to send."
3. Gig not found: "This gig no longer exists or has been removed."
4. Closed gig: "Cannot send messages to closed gigs. This gig has been closed by administrators."
5. Paid gig: "Cannot send messages to completed and paid gigs. The work has been finalized."
6. No specialist: "Cannot send messages until a specialist is assigned to this gig. Wait for the client to accept an application."
7. Not authorized: "You can only send messages if you're the client who posted this gig or the assigned specialist."

**Test Plan:**
```bash
# Run messaging tests
npm run test:unit -- __tests__/integration/messaging.test.ts

# Update test assertions
# Test messaging UI with various error conditions
# Verify error messages display correctly
```

---

## Task 8: Standardize Profile Errors (profile.ts)

**Description:**
Update error messages in `updateProfile`.

**Implementation:**
1. Not authenticated: Redirect to login (already handled)
2. Invalid role: "Invalid user role. Please contact support if you see this error."
3. Validation errors:
   - Experience level: "Experience level must be Middle or Senior. Please select one of these options."
   - Required fields (CLIENT): "Company name and INN are required. Please fill in these fields to complete your profile."
4. Generic error: "Failed to update profile. Please check your information and try again. If the problem persists, contact support."

**Test Plan:**
```bash
# Run profile tests
npm run test:unit -- __tests__/integration/profile.test.ts

# Update test assertions
# Test profile editing UI with various error conditions
# Verify validation errors display correctly
```

---

## Task 9: Add Error Codes/Categories (Optional Enhancement)

**Description:**
Add error codes to make debugging easier and enable programmatic error handling.

**Implementation:**
1. Create `lib/errors.ts` with error code constants:
```typescript
export const ERROR_CODES = {
  // Validation
  VALIDATION_REQUIRED_FIELD: 'VALIDATION_REQUIRED_FIELD',
  VALIDATION_MIN_LENGTH: 'VALIDATION_MIN_LENGTH',
  VALIDATION_MAX_LENGTH: 'VALIDATION_MAX_LENGTH',
  VALIDATION_INVALID_FORMAT: 'VALIDATION_INVALID_FORMAT',

  // Authorization
  AUTH_ROLE_REQUIRED: 'AUTH_ROLE_REQUIRED',
  AUTH_NOT_OWNER: 'AUTH_NOT_OWNER',
  AUTH_NOT_ASSIGNED: 'AUTH_NOT_ASSIGNED',

  // Not Found
  NOT_FOUND_GIG: 'NOT_FOUND_GIG',
  NOT_FOUND_APPLICATION: 'NOT_FOUND_APPLICATION',

  // State
  STATE_INVALID_TRANSITION: 'STATE_INVALID_TRANSITION',
  STATE_ALREADY_COMPLETED: 'STATE_ALREADY_COMPLETED',

  // Rate Limit
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',

  // System
  SYSTEM_ERROR: 'SYSTEM_ERROR',
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];

export interface StandardError {
  message: string;
  code?: ErrorCode;
  field?: string;
}
```

2. Update server actions to return error codes:
```typescript
return {
  error: 'Only clients can post gigs. Switch to a client account or register as a client to continue.',
  code: ERROR_CODES.AUTH_ROLE_REQUIRED
}
```

3. Update UI components to handle error codes (optional, for future use)

**Test Plan:**
```bash
# Run all tests to ensure error codes don't break anything
npm test

# Verify error codes are returned correctly
# Test that UI still displays errors correctly (ignores code field)
```

**Note:** This task is optional and can be deferred if time is limited. The primary goal is improving error message quality, not adding error codes.

---

## Task 10: Update All Tests

**Description:**
Update all test assertions to match new error messages.

**Implementation:**
1. Search codebase for all test files that assert on error messages:
```bash
grep -r "error.*:" __tests__/
```

2. Update each test assertion to match new error text
3. Run full test suite to verify no regressions:
```bash
npm test
npm run test:e2e
```

4. Fix any failing tests

**Test Plan:**
```bash
# Run full test suite
npm test
npm run test:e2e

# All tests should pass
# No regressions in functionality
# Error messages should be tested, not just ignored
```

---

## Task 11: Manual Testing & Validation

**Description:**
Manually test all error conditions in the UI to verify messages are clear and helpful.

**Implementation:**
1. Create test checklist covering all error scenarios:
   - Authentication errors (wrong password, suspended account, rate limit)
   - Gig creation errors (missing fields, invalid budget, short acceptance criteria)
   - Application errors (wrong role, already applied, closed gig, rate limit)
   - Lifecycle errors (wrong status, not authorized)
   - Messaging errors (empty message, too long, no specialist)
   - Profile errors (missing required fields, invalid experience level)

2. Test each scenario in development environment
3. Verify error messages:
   - Display correctly in UI
   - Are easy to understand
   - Provide actionable guidance
   - Use appropriate tone

4. Document any issues found and fix them

**Test Plan:**
- Manual testing checklist (create spreadsheet or markdown table)
- Screenshot examples of good error messages
- User feedback (if available) on error message clarity
- Sign-off from product owner or tech lead

---

## Summary

**Total Tasks:** 11 (10 required, 1 optional)

**Estimated Effort:**
- Task 1 (Audit): 2-3 hours
- Task 2 (Standards): 1-2 hours
- Tasks 3-8 (Implementation): 4-6 hours total
- Task 9 (Error codes): 2-3 hours (optional)
- Task 10 (Update tests): 2-3 hours
- Task 11 (Manual testing): 2-3 hours

**Total:** 13-20 hours (11-17 hours without optional task 9)

**Dependencies:**
- Tasks 3-8 depend on Task 2 (standards must be defined first)
- Task 10 depends on Tasks 3-8 (tests updated after implementation)
- Task 11 depends on all previous tasks (manual testing is final validation)

**Risks:**
- Test updates may be time-consuming if many tests assert on exact error text
- Some error messages may need iteration based on user feedback
- Error codes (Task 9) may require UI changes if we want to use them for programmatic handling
