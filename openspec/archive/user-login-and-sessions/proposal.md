# Change Proposal: User Login & Session Management

## Why
Users can register but have no way to log in. There is no session management, so the app cannot distinguish between authenticated and anonymous visitors. Without login and sessions, registration is a dead end.

## What
1. **Login page** at `/login` with email/password form, inline error feedback, and loading state (mirrors the registration UX).
2. **Login server action** that verifies credentials against the database using bcrypt comparison.
3. **JWT-based session** stored in an HTTP-only cookie, created on successful login or registration.
4. **Session utility library** (`lib/session.ts`) for creating, reading, and destroying sessions.
5. **Next.js middleware** to protect authenticated routes (future use) and expose session state.
6. **Logout server action** that clears the session cookie.
7. **Homepage update** — show user email and a logout button when authenticated, keep the current "Get Started" CTA for anonymous visitors.
8. **Registration flow update** — automatically log the user in (set session cookie) after successful registration, before redirecting.

## Constraints
- Use `jose` for JWT signing/verification (lightweight, no native dependencies).
- Session secret stored in `SESSION_SECRET` environment variable.
- HTTP-only, secure (in production), SameSite=Lax cookie.
- No external auth frameworks (NextAuth, Lucia, etc.).
- No email verification or password reset in this change.

## Non-Goals
- Role-based access control (RBAC) — the `role` field exists but is not enforced yet.
- Password reset / forgot password flow.
- Email verification.
- OAuth / social login.
- Remember me / refresh token rotation.
