# Change Proposal: Standardize Error Messages

## Problem Statement

Error messages across server actions are inconsistent in tone, specificity, and helpfulness. Current issues:

1. **Inconsistent tone:** Some errors are terse ("Gig not found."), others are verbose with guidance ("Technical approach must be at least 100 characters. Please provide more detail about your methodology.")

2. **Missing actionable guidance:** Many errors explain what went wrong but not how to fix it:
   - "Only clients can create gigs." - doesn't tell specialists what they can do instead
   - "This gig is no longer accepting applications." - doesn't explain what status it's in
   - "Application not found." - doesn't suggest next steps

3. **No error categorization:** All errors are plain strings with no codes or categories, making it hard to:
   - Programmatically handle specific error types
   - Debug issues in production
   - Track error patterns in analytics

4. **Technical jargon:** Some errors use internal terminology:
   - "Only the gig owner can manage applications." - uses "gig owner" instead of "you" or "the client who posted this gig"
   - "This application is no longer pending." - exposes internal status terminology

5. **Inconsistent validation feedback:** Some validation errors are specific, others are generic:
   - Good: "Technical approach must be at least 100 characters. Please provide more detail about your methodology."
   - Bad: "Failed to update profile. Please try again."

## Proposed Solution

Audit and standardize all error messages in server actions to follow a consistent pattern:

**Error Message Structure:**
```
[What went wrong] [Why it happened - optional] [How to fix it]
```

**Error Categories:**
- `VALIDATION` - Input validation failures
- `AUTHORIZATION` - Permission/role violations
- `NOT_FOUND` - Resource not found
- `STATE` - Invalid state transitions
- `RATE_LIMIT` - Rate limiting (already good)
- `SYSTEM` - Unexpected errors

**Tone Guidelines:**
- Helpful, not technical
- Explain the problem in user terms
- Always provide actionable next steps
- Use "you" instead of role names when addressing the user
- Avoid internal terminology (status names, technical concepts)

## Scope

**In Scope:**
- All server actions in `app/actions/` directory:
  - `auth.ts` - login, register, logout
  - `gig.ts` - createGig, applyToGig, acceptApplication, rejectApplication, submitWork, approveWork, markAsPaid, withdrawApplication, sendMessage
  - `profile.ts` - updateProfile
  - `moderation.ts` - admin actions (if exists)
  - `user.ts`, `message.ts`, `notification.ts` (if they have user-facing errors)

- Error message audit and rewrite
- Add error codes/categories for debugging
- Update tests to verify new error messages

**Out of Scope:**
- UI error display components (already functional)
- Error logging/monitoring infrastructure
- Client-side validation messages
- API error responses (no public API yet)

## Constraints

1. **Backward compatibility:** Error messages are displayed in UI, so changes should not break existing error display logic
2. **No breaking changes:** Server action return type `{ error?: string }` must remain unchanged
3. **Test coverage:** All error scenarios must have test coverage to prevent regressions
4. **Russian market context:** Error messages should be appropriate for Russian B2B users (professional but friendly)

## Success Criteria

1. All error messages follow the standardized structure (what/why/how)
2. Error messages use consistent, helpful tone without technical jargon
3. All validation errors explain the requirement and how to meet it
4. All authorization errors explain what permission is needed
5. All state errors explain the current state and valid transitions
6. Error codes/categories added for debugging (optional enhancement)
7. All existing tests updated to match new error messages
8. Manual testing confirms all error conditions produce clear, actionable messages

## Non-Goals

- Internationalization (i18n) - error messages remain in English for MVP
- Error analytics/tracking - focus on message quality, not instrumentation
- Custom error classes - keep simple string-based errors for now
- UI redesign - error display components work fine, just need better messages
