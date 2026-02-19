# Testing Specification - Comprehensive Auth & Authorization Tests

## ADDED Requirements

### Requirement: User Registration Tests
The test suite MUST verify all user registration scenarios including role selection, password hashing, and validation.

#### Scenario: Register CLIENT user successfully
- GIVEN valid registration data with role "CLIENT"
- WHEN `registerUser` action is called
- THEN a user record MUST be created in the database
- AND `user.role` MUST equal "CLIENT"
- AND `user.password` MUST be a bcrypt hash (starts with `$2a$` or `$2b$`)
- AND the plaintext password MUST verify against the stored hash using `bcrypt.compare()`

#### Scenario: Register SPECIALIST user successfully
- GIVEN valid registration data with role "SPECIALIST"
- WHEN `registerUser` action is called
- THEN a user record MUST be created in the database
- AND `user.role` MUST equal "SPECIALIST"
- AND the password MUST be properly hashed

#### Scenario: Registration rejects ADMIN role (Mass Assignment Protection)
- GIVEN registration data with role "ADMIN"
- WHEN `registerUser` action is called
- THEN it MUST return `{ error: 'Please select a role.' }` or similar
- AND no user MUST be created in the database
- AND the backend MUST NOT trust client-provided role values

#### Scenario: Registration rejects invalid role
- GIVEN registration data with role "HACKER" or "USER" or any invalid string
- WHEN `registerUser` action is called
- THEN it MUST return an error
- AND no user MUST be created

#### Scenario: Registration ignores additional privileged fields in payload
- GIVEN registration FormData with extra fields like `suspended: false` or `isAdmin: true`
- WHEN `registerUser` action is called
- THEN only whitelisted fields (email, password, role) MUST be processed
- AND the user MUST be created with default values for non-whitelisted fields
- AND no privilege escalation MUST occur

#### Scenario: Registration prevents duplicate email
- GIVEN a user already exists with email "test@example.com"
- WHEN `registerUser` is called with the same email
- THEN it MUST return an error
- AND no duplicate user MUST be created

**Acceptance Criteria:**
- Test file: `__tests__/auth/registration.test.ts`
- Uses test database (`test.db`)
- Cleans up test users after each test
- All scenarios pass
- Tests verify database state directly using Prisma

---

### Requirement: Login and Session Tests
The test suite MUST verify login credential verification, session creation, and suspended user blocking.

#### Scenario: Login with correct credentials creates session
- GIVEN a registered user with email "user@example.com" and password "TestPass123!"
- WHEN `loginUser` action is called with matching credentials
- THEN password verification MUST succeed using `bcrypt.compare()`
- AND a session MUST be created (test catches NEXT_REDIRECT as success indicator)
- AND the session payload MUST contain userId, email, and role

#### Scenario: Login with incorrect password fails
- GIVEN a registered user with email "user@example.com"
- WHEN `loginUser` is called with wrong password
- THEN it MUST return `{ error: 'Invalid email or password.' }`
- AND no session MUST be created

#### Scenario: Login with non-existent email fails
- GIVEN no user exists with email "ghost@example.com"
- WHEN `loginUser` is called with that email
- THEN it MUST return `{ error: 'Invalid email or password.' }`
- AND the error message MUST NOT reveal whether the email exists

#### Scenario: Suspended user cannot login
- GIVEN a registered user with `suspended = true`
- WHEN `loginUser` is called with correct credentials
- THEN it MUST return `{ error: 'Your account has been suspended. Please contact support.' }` or similar
- AND no session MUST be created
- AND the user MUST remain logged out

**Acceptance Criteria:**
- Test file: `__tests__/auth/login.test.ts`
- Tests verify session creation by checking for NEXT_REDIRECT error
- Tests verify suspended user blocking
- All scenarios pass

---

### Requirement: Session Management Tests
The test suite MUST verify JWT session creation, reading, expiration, and destruction.

#### Scenario: createSession generates valid JWT
- GIVEN userId, email, and role parameters
- WHEN `createSession()` is called
- THEN a JWT MUST be created with those values in the payload
- AND the JWT MUST be signed with SESSION_SECRET
- AND the JWT MUST have a 7-day expiration
- AND an HTTP-only cookie MUST be set

#### Scenario: getSession reads valid session
- GIVEN a valid session cookie exists
- WHEN `getSession()` is called
- THEN it MUST return an object with userId, email, and role
- AND the values MUST match the original session data

#### Scenario: getSession returns null for invalid token
- GIVEN an invalid or malformed session cookie
- WHEN `getSession()` is called
- THEN it MUST return null
- AND no error MUST be thrown

#### Scenario: getSession returns null for expired token
- GIVEN an expired session cookie (>7 days old)
- WHEN `getSession()` is called
- THEN it MUST return null

#### Scenario: destroySession clears cookie
- GIVEN an active session
- WHEN `destroySession()` is called
- THEN the session cookie MUST be deleted
- AND subsequent `getSession()` calls MUST return null

**Acceptance Criteria:**
- Test file: `__tests__/auth/session.test.ts`
- Tests mock cookies using Next.js testing utilities or direct cookie manipulation
- Tests verify JWT payload structure
- All scenarios pass

---

### Requirement: Role-Based Gig Authorization Tests
The test suite MUST verify that gig operations are properly restricted by user role.

#### Scenario: CLIENT can create gigs
- GIVEN an authenticated CLIENT user
- WHEN `createGig` action is called
- THEN the gig MUST be created successfully
- AND `gig.ownerId` MUST equal the CLIENT's userId

#### Scenario: SPECIALIST cannot create gigs
- GIVEN an authenticated SPECIALIST user
- WHEN `createGig` action is called
- THEN it MUST return an authorization error
- AND no gig MUST be created

#### Scenario: SPECIALIST can apply to open gigs
- GIVEN an authenticated SPECIALIST user and an OPEN gig
- WHEN `applyToGig` action is called
- THEN an application MUST be created
- AND `application.specialistId` MUST equal the SPECIALIST's userId

#### Scenario: CLIENT cannot apply to gigs
- GIVEN an authenticated CLIENT user and an OPEN gig
- WHEN `applyToGig` action is called
- THEN it MUST return an authorization error
- AND no application MUST be created

#### Scenario: Gig owner can accept applications
- GIVEN a CLIENT user who owns a gig with a PENDING application
- WHEN `acceptApplication` action is called by the owner
- THEN the application status MUST change to ACCEPTED
- AND the gig status MUST change to IN_PROGRESS
- AND `gig.assignedSpecialistId` MUST be set

#### Scenario: Non-owner cannot accept applications
- GIVEN a CLIENT user who does NOT own a gig
- WHEN `acceptApplication` action is called
- THEN it MUST return an authorization error
- AND the application status MUST remain PENDING

#### Scenario: Assigned specialist can submit work
- GIVEN a SPECIALIST assigned to a gig in IN_PROGRESS status
- WHEN `submitWork` action is called
- THEN the gig status MUST change to REVIEW
- AND `gig.submittedAt` MUST be set

#### Scenario: Non-assigned specialist cannot submit work
- GIVEN a SPECIALIST NOT assigned to a gig
- WHEN `submitWork` action is called
- THEN it MUST return an authorization error
- AND the gig status MUST remain unchanged

#### Scenario: Gig owner can approve work
- GIVEN a CLIENT who owns a gig in REVIEW status
- WHEN `approveWork` action is called
- THEN the gig status MUST change to COMPLETED
- AND `gig.completedAt` MUST be set

#### Scenario: Non-owner cannot approve work
- GIVEN a CLIENT who does NOT own a gig in REVIEW status
- WHEN `approveWork` action is called
- THEN it MUST return an authorization error
- AND the gig status MUST remain REVIEW

#### Scenario: Gig owner can mark as paid
- GIVEN a CLIENT who owns a gig in COMPLETED status
- WHEN `markAsPaid` action is called
- THEN `gig.paidAt` MUST be set
- AND the gig status remains COMPLETED (paid is a flag, not a status)

#### Scenario: Non-owner cannot mark as paid
- GIVEN a CLIENT who does NOT own a gig
- WHEN `markAsPaid` action is called
- THEN it MUST return an authorization error

**Acceptance Criteria:**
- Test file: `__tests__/auth/gig-authorization.test.ts`
- Tests create test users (CLIENT, SPECIALIST) and gigs in various states
- Tests verify authorization errors are returned with clear messages
- Tests verify database state changes only occur for authorized actions
- All scenarios pass

---

### Requirement: Horizontal Privilege Escalation Prevention (IDOR Tests)
The test suite MUST verify that users cannot access or modify resources owned by other users of the same role.

#### Scenario: Client A cannot accept applications on Client B's gig
- GIVEN Client A and Client B (both CLIENT role)
- AND Client B owns a gig with a PENDING application
- WHEN Client A attempts to call `acceptApplication` on Client B's gig
- THEN it MUST return an authorization error (e.g., "Only the gig owner can accept applications")
- AND the application status MUST remain PENDING
- AND no gig state changes MUST occur

#### Scenario: Client A cannot approve work on Client B's gig
- GIVEN Client A and Client B (both CLIENT role)
- AND Client B owns a gig in REVIEW status
- WHEN Client A attempts to call `approveWork` on Client B's gig
- THEN it MUST return an authorization error
- AND the gig status MUST remain REVIEW

#### Scenario: Client A cannot mark Client B's gig as paid
- GIVEN Client A and Client B (both CLIENT role)
- AND Client B owns a gig in COMPLETED status
- WHEN Client A attempts to call `markAsPaid` on Client B's gig
- THEN it MUST return an authorization error
- AND `gig.paidAt` MUST remain null

#### Scenario: Specialist A cannot submit work for gig assigned to Specialist B
- GIVEN Specialist A and Specialist B (both SPECIALIST role)
- AND a gig in IN_PROGRESS status assigned to Specialist B
- WHEN Specialist A attempts to call `submitWork` on that gig
- THEN it MUST return an authorization error (e.g., "Only the assigned specialist can submit work")
- AND the gig status MUST remain IN_PROGRESS

#### Scenario: Specialist A cannot withdraw Specialist B's application
- GIVEN Specialist A and Specialist B (both SPECIALIST role)
- AND Specialist B has a PENDING application on a gig
- WHEN Specialist A attempts to withdraw or modify Specialist B's application
- THEN it MUST return an authorization error
- AND the application MUST remain unchanged

**Acceptance Criteria:**
- Test file: `__tests__/integration/horizontal-privilege-escalation.test.ts`
- Tests create multiple users of the same role (Client A, Client B, Specialist A, Specialist B)
- Tests verify ownership checks prevent horizontal escalation
- Tests verify clear error messages indicate ownership requirement
- All IDOR scenarios pass

---

### Requirement: Admin Authorization Tests
The test suite MUST verify that admin operations are restricted to ADMIN role only.

#### Scenario: ADMIN can suspend users
- GIVEN an authenticated ADMIN user
- WHEN `suspendUser` action is called on a target user
- THEN `user.suspended` MUST be set to true
- AND a ModerationLog entry MUST be created

#### Scenario: CLIENT cannot suspend users
- GIVEN an authenticated CLIENT user
- WHEN `suspendUser` action is called
- THEN it MUST return an authorization error
- AND the target user MUST remain unsuspended

#### Scenario: SPECIALIST cannot suspend users
- GIVEN an authenticated SPECIALIST user
- WHEN `suspendUser` action is called
- THEN it MUST return an authorization error

#### Scenario: ADMIN can close gigs
- GIVEN an authenticated ADMIN user and an open gig
- WHEN `closeGig` action is called
- THEN `gig.closedByAdmin` MUST be set to true
- AND a ModerationLog entry MUST be created

#### Scenario: CLIENT cannot close other users' gigs
- GIVEN an authenticated CLIENT user
- WHEN `closeGig` action is called on another user's gig
- THEN it MUST return an authorization error
- AND the gig MUST remain open

#### Scenario: ADMIN can unsuspend users
- GIVEN an authenticated ADMIN user and a suspended user
- WHEN `unsuspendUser` action is called
- THEN `user.suspended` MUST be set to false
- AND a ModerationLog entry MUST be created

**Acceptance Criteria:**
- Test file: `__tests__/auth/admin-authorization.test.ts`
- Tests create ADMIN, CLIENT, and SPECIALIST test users
- Tests verify ModerationLog entries are created
- Tests verify non-ADMIN users receive authorization errors
- All scenarios pass

---

### Requirement: Authorization Error Clarity Tests
The test suite MUST verify that authorization errors provide clear, actionable messages.

#### Scenario: Unauthorized action returns clear error
- GIVEN any unauthorized action attempt
- WHEN the action is called
- THEN the error message MUST clearly indicate the authorization failure
- AND the error message MUST NOT expose sensitive system details
- AND the error message SHOULD guide the user (e.g., "Only the gig owner can approve work")

**Acceptance Criteria:**
- Tests verify error message format and clarity
- Error messages follow consistent pattern
- No stack traces or internal details exposed to users

---

## Test Infrastructure Requirements

### Requirement: Test Database Isolation
All auth tests MUST use per-worker isolated databases with transaction-based rollback.

**Acceptance Criteria:**
- Tests use `withTestTransaction()` wrapper for automatic rollback
- Each Vitest worker gets its own in-memory database (`memdb_${workerId}.db`)
- Tests can run in parallel without conflicts
- No manual cleanup needed (transactions auto-rollback)
- Running tests does not affect development database
- Tests use `getTestPrismaClient()` to access the worker's database

### Requirement: Test Coverage Reporting
The test suite MUST generate coverage reports for auth-related code.

**Acceptance Criteria:**
- `npm run test:coverage` includes auth tests
- Coverage report shows line/branch coverage for:
  - `app/actions/auth.ts`
  - `lib/session.ts`
  - Auth-related server actions (gig operations, admin operations)
- Target: >80% coverage for auth code

### Requirement: Test Documentation
The test suite MUST serve as living documentation for auth behavior.

**Acceptance Criteria:**
- Test names clearly describe the scenario being tested
- Tests use descriptive variable names
- Complex authorization logic includes comments explaining the rule
- Test file structure mirrors the spec structure
