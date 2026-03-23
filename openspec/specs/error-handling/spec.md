# Error Handling Specification

## ADDED Requirements

### Requirement: Error Message Structure
All user-facing error messages MUST follow a consistent three-part structure: [What went wrong] [Why it happened - optional] [How to fix it].

#### Scenario: Validation error includes what and how
- GIVEN a user submits a form with invalid data
- WHEN validation fails
- THEN the error message MUST explain what field is invalid
- AND the error message MUST explain how to correct it
- AND the error message MUST NOT use technical jargon

**Example:**
- Bad: "Budget must be a positive number."
- Good: "Budget must be a positive number in roubles. Enter the amount you'll pay the specialist (service fee will be calculated automatically)."

#### Scenario: Authorization error includes what, why, and how
- GIVEN a user attempts an action they're not authorized for
- WHEN authorization check fails
- THEN the error message MUST explain what action was blocked
- AND the error message MUST explain why (role/permission requirement)
- AND the error message MUST suggest an alternative action

**Example:**
- Bad: "Only clients can create gigs."
- Good: "Only clients can post gigs. Switch to a client account or register as a client to continue."

#### Scenario: State error includes current state and valid transitions
- GIVEN a user attempts an invalid state transition
- WHEN the state check fails
- THEN the error message MUST explain what action was attempted
- AND the error message MUST explain the current state
- AND the error message MUST explain what needs to happen first

**Example:**
- Bad: "This gig is no longer accepting applications."
- Good: "This gig is no longer accepting applications. It may already have an assigned specialist."

**Acceptance Criteria:**
- All error messages follow the three-part structure
- "What" is always present and clear
- "Why" is included when it helps understanding
- "How" provides actionable next steps
- No error message is just a statement without guidance

---

### Requirement: Error Message Tone
All error messages MUST use a helpful, professional tone appropriate for B2B users without technical jargon.

#### Scenario: Error uses "you" instead of role names
- GIVEN an error message addressing the user
- WHEN the message is displayed
- THEN it MUST use "you" or "your" when referring to the user
- AND it MUST NOT use role names like "CLIENT" or "SPECIALIST" in all caps
- AND it MUST use lowercase descriptive terms like "client" or "specialist" when needed

**Example:**
- Bad: "Only the gig owner can manage applications."
- Good: "Only the client who posted this gig can accept applications."

#### Scenario: Error avoids internal terminology
- GIVEN an error message about system state
- WHEN the message is displayed
- THEN it MUST NOT expose internal status names (PENDING, IN_PROGRESS, REVIEW)
- AND it MUST use plain language descriptions instead
- AND it MUST be understandable to non-technical users

**Example:**
- Bad: "This application is no longer pending."
- Good: "This application has already been accepted or rejected."

#### Scenario: Error is concise but complete
- GIVEN an error message
- WHEN the message is displayed
- THEN it MUST be no longer than 2-3 sentences
- AND it MUST include all necessary information
- AND it MUST NOT be overly verbose or repetitive

**Acceptance Criteria:**
- All error messages use "you/your" when addressing the user
- No error messages use internal status names or technical terminology
- Error messages are 1-3 sentences (typically 2)
- Tone is professional but friendly, appropriate for B2B context
- Messages are helpful, not condescending or overly apologetic

---

### Requirement: Validation Error Specificity
Validation error messages MUST specify the exact requirement and how to meet it.

#### Scenario: Length validation includes the requirement
- GIVEN a field with minimum or maximum length requirement
- WHEN validation fails
- THEN the error message MUST state the exact length requirement
- AND the error message MUST explain why the requirement exists (if helpful)
- AND the error message MUST suggest how to meet it

**Example:**
- Bad: "Acceptance criteria is too short."
- Good: "Acceptance criteria must be at least 50 characters. Add more detail about what defines success for this gig."

#### Scenario: Format validation includes examples
- GIVEN a field with format requirements
- WHEN validation fails
- THEN the error message MUST explain the expected format
- AND the error message SHOULD include an example if helpful
- AND the error message MUST NOT just say "invalid format"

**Example:**
- Bad: "Invalid budget."
- Good: "Budget must be a positive number in roubles. Enter the amount you'll pay the specialist (service fee will be calculated automatically)."

#### Scenario: Required field validation is specific
- GIVEN multiple required fields
- WHEN validation fails
- THEN the error message MUST list which specific fields are missing
- AND the error message MUST NOT just say "required fields are missing"
- AND the error message MUST be actionable

**Example:**
- Bad: "Required fields are missing."
- Good: "Please fill in all required fields: title, description, and acceptance criteria."

**Acceptance Criteria:**
- All length validation errors include the exact requirement (min/max characters)
- All format validation errors explain the expected format
- All required field errors list the specific missing fields
- Validation errors provide context about why the requirement exists (when helpful)
- No generic "invalid" or "required" messages without specifics

---

### Requirement: Authorization Error Clarity
Authorization error messages MUST explain the permission requirement and suggest alternatives.

#### Scenario: Role-based authorization includes alternative
- GIVEN a user with wrong role attempts an action
- WHEN authorization check fails
- THEN the error message MUST explain what role is required
- AND the error message MUST suggest switching accounts or registering
- AND the error message MUST explain what the correct role can do

**Example:**
- Bad: "Only specialists can apply to gigs."
- Good: "Only specialists can apply to gigs. Switch to a specialist account or register as a specialist to continue."

#### Scenario: Ownership authorization is clear
- GIVEN a user attempts to modify a resource they don't own
- WHEN authorization check fails
- THEN the error message MUST explain who can perform the action
- AND the error message MUST NOT just say "not authorized"
- AND the error message MUST be specific about the ownership requirement

**Example:**
- Bad: "Not authorized."
- Good: "Only the client who posted this gig can accept applications."

#### Scenario: Assignment authorization explains relationship
- GIVEN a user attempts an action requiring assignment
- WHEN authorization check fails
- THEN the error message MUST explain the assignment requirement
- AND the error message MUST suggest who can perform the action
- AND the error message MUST be clear about the relationship

**Example:**
- Bad: "Only the assigned specialist can submit work."
- Good: "Only the assigned specialist can submit work for this gig."

**Acceptance Criteria:**
- All role-based errors suggest account switching or registration
- All ownership errors explain who can perform the action
- All assignment errors explain the required relationship
- No generic "not authorized" or "access denied" messages
- Authorization errors are specific about what permission is needed

---

### Requirement: State Error Informativeness
State error messages MUST explain the current state and what needs to happen for the action to be valid.

#### Scenario: Invalid state transition explains current state
- GIVEN a user attempts an action in wrong state
- WHEN state check fails
- THEN the error message MUST explain what action was attempted
- AND the error message MUST explain the current state (in plain language)
- AND the error message MUST explain what state is required

**Example:**
- Bad: "Work can only be submitted for gigs in progress."
- Good: "Work can only be submitted for gigs that are in progress. Current status: [status]."

#### Scenario: Already completed action is clear
- GIVEN a user attempts an action that's already been done
- WHEN the check fails
- THEN the error message MUST explain the action has already been completed
- AND the error message SHOULD include when it was completed (if available)
- AND the error message MUST NOT just say "already done"

**Example:**
- Bad: "This gig has already been marked as paid."
- Good: "This gig has already been marked as paid on [date]."

#### Scenario: Prerequisite action is explained
- GIVEN a user attempts an action with unmet prerequisites
- WHEN the prerequisite check fails
- THEN the error message MUST explain what prerequisite is missing
- AND the error message MUST explain what needs to happen first
- AND the error message MUST be actionable

**Example:**
- Bad: "Cannot send messages until a specialist is assigned."
- Good: "Cannot send messages until a specialist is assigned to this gig. Wait for the client to accept an application."

**Acceptance Criteria:**
- All state errors explain the current state in plain language
- All state errors explain what state is required for the action
- All prerequisite errors explain what needs to happen first
- State errors include timestamps when relevant (e.g., "paid on [date]")
- No errors expose internal state names (OPEN, IN_PROGRESS, REVIEW, etc.)

---

### Requirement: Not Found Error Helpfulness
Not found error messages MUST explain what resource is missing and suggest next steps.

#### Scenario: Resource not found suggests alternatives
- GIVEN a user accesses a non-existent resource
- WHEN the resource is not found
- THEN the error message MUST explain what resource is missing
- AND the error message MUST suggest possible reasons (removed, never existed)
- AND the error message SHOULD suggest where to find similar resources

**Example:**
- Bad: "Gig not found."
- Good: "This gig no longer exists or has been removed."

#### Scenario: Not found error is consistent across resources
- GIVEN different types of resources (gigs, applications, profiles)
- WHEN any resource is not found
- THEN all not found errors MUST follow the same pattern
- AND the pattern MUST be: "This [resource] no longer exists or has been removed."
- AND the message MUST be consistent in tone and structure

**Acceptance Criteria:**
- All not found errors follow consistent pattern
- Not found errors suggest possible reasons (removed, never existed)
- Not found errors don't just say "[Resource] not found"
- Messages are helpful, not just informative
- Consistent wording across all resource types

---

### Requirement: Rate Limit Error Consistency
Rate limit error messages MUST maintain the existing helpful format with retry-after information.

#### Scenario: Rate limit error includes retry time
- GIVEN a user exceeds a rate limit
- WHEN the rate limit check fails
- THEN the error message MUST explain what action was rate limited
- AND the error message MUST include the retry-after time in human-readable format
- AND the error message MUST follow the existing pattern from `getRateLimitError`

**Example:**
- Current (keep as-is): "Too many login attempts. Please try again in 5 minutes."
- Current (keep as-is): "You've submitted too many applications. Please try again in 30 minutes."

#### Scenario: Rate limit errors are action-specific
- GIVEN different rate-limited actions (login, register, apply, message)
- WHEN rate limits are exceeded
- THEN each error MUST mention the specific action
- AND the error MUST use appropriate terminology for that action
- AND the format MUST be consistent across all rate-limited actions

**Acceptance Criteria:**
- All rate limit errors use `getRateLimitError` utility
- Rate limit errors include human-readable retry-after time
- Rate limit errors are action-specific (login attempts, applications, messages)
- No changes needed to existing rate limit error format (already good)
- Consistency maintained across all rate-limited endpoints

---

### Requirement: System Error Fallback
System errors (unexpected failures) MUST provide a helpful fallback message with support contact information.

#### Scenario: Unexpected error provides fallback
- GIVEN an unexpected system error occurs
- WHEN the error is caught in a try-catch block
- THEN the error message MUST NOT expose technical details
- AND the error message MUST suggest trying again
- AND the error message MUST provide support contact if problem persists

**Example:**
- Bad: "Failed to update profile. Please try again."
- Good: "Failed to update profile. Please check your information and try again. If the problem persists, contact support."

#### Scenario: Database errors are user-friendly
- GIVEN a database constraint violation or connection error
- WHEN the error is caught
- THEN the error message MUST be translated to user-friendly language
- AND the error message MUST NOT expose SQL or technical details
- AND the error message MUST suggest actionable next steps

**Example:**
- Bad: "Unique constraint violation on email field."
- Good: "An account with this email already exists. Try logging in instead."

**Acceptance Criteria:**
- All try-catch blocks return user-friendly error messages
- No technical details (SQL, stack traces, internal errors) exposed to users
- System errors suggest trying again and contacting support
- Database constraint violations translated to user-friendly messages
- Consistent fallback pattern across all server actions

---

### Requirement: Error Message Testing
All error messages MUST be covered by automated tests that verify the exact message text.

#### Scenario: Tests assert on exact error message
- GIVEN a test for an error condition
- WHEN the test is executed
- THEN the test MUST assert on the exact error message text
- AND the test MUST NOT just check that an error exists
- AND the test MUST fail if the error message changes

**Example:**
```typescript
// Bad
expect(result.error).toBeDefined()

// Good
expect(result.error).toBe('Only clients can post gigs. Switch to a client account or register as a client to continue.')
```

#### Scenario: All error paths have test coverage
- GIVEN a server action with multiple error conditions
- WHEN tests are executed
- THEN every error return path MUST have a test
- AND every test MUST verify the error message
- AND no error condition MUST be untested

**Acceptance Criteria:**
- All error messages have test coverage
- Tests assert on exact error message text
- Tests fail if error messages change (preventing accidental changes)
- Coverage includes all error paths (validation, authorization, state, not found)
- Integration tests verify error messages, not just unit tests

---

## MODIFIED Requirements

### Requirement: Input Validation Error Messages (from security/spec.md)
MODIFY the existing input validation requirements to include error message standards.

#### Changes:
- All validation error messages MUST follow the standardized structure (what/why/how)
- All validation error messages MUST specify the exact requirement
- All validation error messages MUST provide actionable guidance

**Example modifications:**
- Gig creation validation: "Acceptance criteria must be at least 50 characters. Add more detail about what defines success for this gig."
- Application validation: "Technical approach must be at least 100 characters. Please provide more detail about your methodology."
- Message validation: "Message is too long. Maximum 2000 characters allowed. Current length: [length]."

**Acceptance Criteria:**
- All existing validation errors updated to follow new standards
- No breaking changes to validation logic
- Tests updated to match new error messages
- Validation errors are more helpful than before

---

## Implementation Notes

### Error Message Patterns

**Validation Errors:**
```
"[Field] must be [requirement]. [Guidance on how to meet requirement]."
```

**Authorization Errors:**
```
"Only [role/owner] can [action]. [Alternative action or suggestion]."
```

**State Errors:**
```
"[Action] can only be done when [state requirement]. [Current state or what needs to happen first]."
```

**Not Found Errors:**
```
"This [resource] no longer exists or has been removed."
```

**Rate Limit Errors:**
```
"Too many [action]. Please try again in [time]."
```

**System Errors:**
```
"Failed to [action]. Please [try again/check input] and try again. If the problem persists, contact support."
```

### Testing Strategy

1. **Unit tests:** Test error message utility functions (if created)
2. **Integration tests:** Test all server action error paths with exact message assertions
3. **E2E tests:** Verify error messages display correctly in UI
4. **Manual testing:** Review all error messages in context for clarity and helpfulness

### Migration Strategy

1. Audit all existing error messages (Task 1)
2. Define standards and patterns (Task 2)
3. Update server actions one file at a time (Tasks 3-8)
4. Update tests after each file (Task 10)
5. Manual testing and validation (Task 11)

### Backward Compatibility

- Server action return type `{ error?: string }` remains unchanged
- UI error display components work without modification
- Error codes (if added) are optional and don't break existing functionality
- Tests need updates but no breaking changes to application logic
