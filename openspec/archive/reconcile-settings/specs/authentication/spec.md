# Spec delta — authentication (reconcile-settings)

Adds **real session tracking** (a `Session` Prisma model + login capture + a terminate action) so the settings «Активные
сессии» list is backed by real data. Built **backward-compatibly** — existing auth, middleware, and the test harness's
directly-minted JWTs keep working.

## ADDED Requirements

### Requirement: Session Model and Login Capture
The schema MUST define a `Session` model — `id`, `userId` (FK to `User`, `onDelete: Cascade`), `userAgent`, `ipAddress`,
`createdAt`, `lastActiveAt`, indexed on `userId` — and `User.sessions Session[]`. `createSession` MUST capture the
request `user-agent` and IP (from `headers()`), create a `Session` row, and embed that row's id as `sid` in the JWT.

#### Scenario: Logging in creates a session row
- GIVEN a successful login (or registration auto-login)
- WHEN `createSession` runs
- THEN a `Session` row MUST be created for the user with the captured `userAgent` + `ipAddress`, and the issued JWT MUST
  carry its `sid`

### Requirement: Session Validation Is Backward-Compatible
`getSession` MUST continue to validate any otherwise-valid JWT, reading `sid` **when present** but NOT requiring a
`Session` row to exist — so existing tokens and the test harness's directly-minted sessions (no `sid`, no row) keep
authenticating. `destroySession` (logout) MUST delete the current session's row when a `sid` is present.

#### Scenario: A sid-less token still authenticates
- GIVEN a valid JWT with no `sid` (e.g. a test-minted session)
- WHEN `getSession` runs
- THEN it MUST return the session payload as today (no `Session` row required)

#### Scenario: Logout deletes the current session row
- GIVEN a logged-in user whose JWT carries a `sid`
- WHEN `logoutUser` / `destroySession` runs
- THEN the matching `Session` row MUST be deleted and the cookie cleared

### Requirement: Terminate Session
A `terminateSession(sessionId)` server action MUST delete a `Session` row **only if it belongs to the requesting user**.
If the terminated session is the requester's current `sid`, the action MUST also clear the cookie and redirect to
`/login`. `getActiveSessions(userId, currentSid)` MUST return the user's sessions as `SessionRowVM[]` (current →
`active`, others → `Default`), with the title parsed from the user-agent and **no fabricated location**.

#### Scenario: A user terminates another of their sessions
- GIVEN a user with two sessions A (current) and B
- WHEN they terminate B
- THEN B's `Session` row MUST be deleted, A MUST remain, and the user MUST stay logged in

#### Scenario: Terminating someone else's session is rejected
- GIVEN session B belonging to another user
- WHEN a user calls `terminateSession(B)`
- THEN it MUST NOT delete B (ownership enforced)

**Acceptance Criteria:**
- `Session` model (`userAgent`/`ipAddress`/`createdAt`/`lastActiveAt`, `userId` cascade, indexed) + `User.sessions`
- `createSession` captures UA + IP via `headers()`, creates a row, embeds `sid`; `getSession` tolerant of sid-less/row-less tokens (harness unbroken)
- `destroySession`/`logoutUser` deletes the current row; `terminateSession(id)` ownership-checked (+ self-logout when current)
- `getActiveSessions` → `SessionRowVM[]` (UA-parsed title, relative last-active, current = `active`); location omitted
- `session-tracking.test.ts` (creation + `sid` + terminate ownership + backward-compat) green; `build` + `test:unit` green
