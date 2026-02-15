# Authentication Specification Delta

## MODIFIED Requirements

### Requirement: Session Payload Includes Role
The JWT session payload MUST include `role` in addition to `userId` and `email`.

#### Scenario: Session created with role
- GIVEN a successful login or registration
- WHEN `createSession()` is called
- THEN the JWT payload MUST contain `userId`, `email`, and `role`

#### Scenario: getSession returns role
- GIVEN a valid session cookie
- WHEN `getSession()` is called
- THEN the returned object MUST include `role`

**Acceptance Criteria:**
- `createSession` signature updated to `(userId: string, email: string, role: string)`
- `getSession()` return type includes `role: string`
- All callers of `createSession` pass the `role` argument
- Middleware `verifySession` return type includes `role`

---

### Requirement: Registration Action Accepts Role
The `registerUser` action MUST read a `role` field from the form data and persist it.

#### Scenario: Registration with CLIENT role
- GIVEN form data with email, password, and role="CLIENT"
- WHEN `registerUser` is called
- THEN the user MUST be created with `role: "CLIENT"`
- AND the session MUST contain `role: "CLIENT"`

#### Scenario: Registration with invalid role
- GIVEN form data with role="HACKER"
- WHEN `registerUser` is called
- THEN it MUST return `{ error: 'Invalid role selected.' }`
- AND no user MUST be created

**Acceptance Criteria:**
- `registerUser` reads `formData.get('role')`
- Validates role is `"CLIENT"` or `"SPECIALIST"`
- Passes role to `prisma.user.create()` and `createSession()`

---

### Requirement: Login Action Includes Role in Session
The `loginUser` action MUST include the user's role in the session.

#### Scenario: Login creates session with role
- GIVEN a registered user with role "SPECIALIST"
- WHEN `loginUser` is called with valid credentials
- THEN the session MUST contain `role: "SPECIALIST"`

**Acceptance Criteria:**
- `loginUser` passes `user.role` to `createSession()`
