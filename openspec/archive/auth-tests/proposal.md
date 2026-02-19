# Change Proposal: Comprehensive Authentication & Authorization Tests

## Problem Statement

The authentication and authorization system is the security foundation of Gigly. It controls:
- User registration with role selection (CLIENT, SPECIALIST)
- Password hashing and verification
- Session management with JWT tokens
- Role-based access control (RBAC) for gigs, applications, and admin functions
- Suspended user prevention

While the auth system is implemented and functional, **it lacks comprehensive automated test coverage**. This creates risks:
- Security vulnerabilities may go undetected (weak password handling, session hijacking, privilege escalation)
- Role-based authorization bugs could allow unauthorized actions (SPECIALIST creating gigs, CLIENT applying to gigs)
- Regression bugs during refactoring or feature additions
- Difficult to validate that suspended users are properly blocked
- No automated verification that admin-only routes are protected

## Proposed Solution

Create a comprehensive test suite covering all authentication and authorization scenarios using the existing Vitest testing framework. Tests will validate:

1. **User Registration**: Role selection, password hashing, validation, duplicate prevention
2. **Login Flow**: Credential verification, session creation, suspended user blocking
3. **Session Management**: JWT creation, persistence, expiration, logout
4. **Role-Based Authorization**: CLIENT/SPECIALIST/ADMIN permissions for gigs, applications, moderation
5. **Route Protection**: Middleware enforcement of auth requirements and role restrictions

## Scope

### In Scope
- Unit tests for auth actions (register, login, logout)
- Unit tests for session management (createSession, getSession, destroySession)
- Integration tests for complete auth flows (register → login → authorized action)
- **Mass assignment protection tests** (ADMIN role injection, privileged field injection)
- **Vertical privilege escalation tests** (role-based: CLIENT vs SPECIALIST vs ADMIN)
- **Horizontal privilege escalation tests (IDOR)** (ownership-based: Client A vs Client B, Specialist A vs Specialist B)
- Authorization tests for gig operations (create, apply, accept, submit, approve, mark paid)
- Authorization tests for admin operations (suspend user, close gig)
- Tests for edge cases (suspended users, invalid roles, expired sessions)

### Out of Scope
- E2E browser tests (Playwright) - focus on unit/integration tests first
- Performance/load testing of auth system
- Security penetration testing
- OAuth/social login tests (not implemented)
- Password reset tests (not implemented)

## Constraints

- Use existing Vitest framework and test database setup
- Tests MUST use per-worker isolated databases (`memdb_${workerId}.db`)
- Tests MUST use `withTestTransaction()` for automatic rollback and isolation
- Tests MUST be deterministic and runnable in parallel
- Follow existing test conventions from `TESTING.md`
- Use existing test helpers: `createTestUser()`, `createAuthenticatedClient()`, etc.

## Success Criteria

1. All auth and authorization scenarios from archived specs have corresponding tests
2. Test suite runs successfully with `npm run test:unit`
3. Coverage report shows >80% coverage for auth-related code
4. **OWASP Top 10 security tests pass**:
   - Mass assignment protection (ADMIN role injection blocked)
   - Vertical privilege escalation prevention (role-based authorization)
   - Horizontal privilege escalation prevention (IDOR - ownership checks)
5. Tests catch known security issues (e.g., ADMIN role in registration, suspended user login, Client A accessing Client B's gig)
6. Tests serve as documentation for auth system behavior

## Non-Goals

- Refactoring existing auth implementation
- Adding new auth features
- Changing auth architecture or session strategy
- Adding E2E tests (separate effort)
