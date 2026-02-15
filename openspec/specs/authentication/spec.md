# Authentication Specification Delta

## MODIFIED Requirements

### Requirement: Password Hashing
The registration Server Action MUST hash passwords before storing them in the database.

#### Scenario: Password is hashed on registration
- GIVEN a user submits a registration form with a plaintext password
- WHEN the Server Action processes the request
- THEN the password MUST be hashed using bcrypt before being saved
- AND the stored password MUST NOT equal the plaintext input

**Acceptance Criteria:**
- `bcryptjs` package is installed
- `registerUser` action hashes the password with `bcrypt.hash()` before `prisma.user.create()`
- Stored password in the database is a bcrypt hash (starts with `$2a$` or `$2b$`)

---

### Requirement: Registration Action Redirect
The registration Server Action MUST redirect the user on success instead of silently returning an object.

#### Scenario: Redirect after successful registration
- GIVEN a valid registration submission
- WHEN the user is created successfully
- THEN the action MUST call `redirect('/')` from `next/navigation`
- AND the user MUST land on the homepage

#### Scenario: Error returned on failure
- GIVEN a registration submission that fails (e.g., duplicate email)
- WHEN the Server Action catches the error
- THEN it MUST return an object with an error message
- AND the form MUST display that message to the user

**Acceptance Criteria:**
- On success: `redirect('/')` is called (from `next/navigation`)
- On failure: `{ error: string }` is returned
- The `registerUser` function signature is compatible with `useActionState`
