# Authentication Specification Delta: Login Page Redesign

## MODIFIED Requirements

### Requirement: Login Page UI with Role Context
The login page UI MUST display role context from query parameter while maintaining existing authentication logic.

#### Scenario: Login page displays role context without affecting auth logic
- GIVEN a user navigates to `/login?role=SPECIALIST`
- WHEN the page renders
- THEN the role parameter MUST be read and displayed visually (role cards)
- AND the role parameter MUST NOT affect the `loginUser` server action
- AND the role parameter MUST NOT be submitted with the form
- AND authentication MUST proceed identically regardless of role parameter presence

#### Scenario: Login succeeds and redirects to dashboard regardless of role parameter
- GIVEN a user logs in from `/login?role=CLIENT`
- WHEN authentication succeeds
- THEN the user MUST be redirected to `/dashboard`
- AND the session MUST contain the user's actual role from the database
- AND the query parameter role MUST NOT override the database role

**Acceptance Criteria:**
- Role query parameter is read client-side for display only
- Role parameter does not affect server-side authentication logic
- `loginUser` action remains unchanged
- Session creation uses database role, not query parameter
- All existing authentication tests pass without modification

---

## ADDED Requirements

### Requirement: Login Page Maintains Existing Auth Validation
The redesigned login page MUST maintain all existing authentication validation and security measures.

#### Scenario: Rate limiting remains active on redesigned login page
- GIVEN a user attempts to login multiple times from redesigned page
- WHEN the rate limit threshold is exceeded (15 attempts per 15 minutes)
- THEN the login MUST be blocked with rate limit error
- AND the error message MUST be displayed in the new UI

#### Scenario: Invalid credentials show error in new UI
- GIVEN a user submits invalid credentials on redesigned page
- WHEN the `loginUser` action returns an error
- THEN the error message MUST be displayed in the new UI
- AND the error styling MUST match the new design

#### Scenario: Successful login creates session and redirects
- GIVEN a user submits valid credentials on redesigned page
- WHEN authentication succeeds
- THEN a JWT session MUST be created
- AND the user MUST be redirected to `/dashboard`
- AND the behavior MUST be identical to the old login page

**Acceptance Criteria:**
- All existing authentication logic remains unchanged
- Rate limiting continues to function
- Error messages display correctly in new UI
- Session creation and redirect behavior unchanged
- All existing authentication integration tests pass
- All existing authentication E2E tests pass
