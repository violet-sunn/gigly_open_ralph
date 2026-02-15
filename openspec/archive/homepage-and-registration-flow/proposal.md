# Change: homepage-and-registration-flow

## Why
The homepage shows a generic placeholder with no navigation to the registration page. Users must manually type `/register` in the URL bar. Once on the registration form, clicking "Sign up" appears to do nothing — the server action runs but the UI gives zero feedback (no success message, no error message, no redirect).

## What
1. Replace the placeholder homepage with a landing page that links to `/register`.
2. Add user-facing feedback to the registration flow: show errors on failure, redirect or show a success message on success.
3. Add password hashing — passwords are currently stored in plaintext.

## Constraints
- Keep SQLite + Prisma stack as-is.
- No external auth libraries (NextAuth, etc.) — stay with Server Actions.
- Minimal dependencies: only add `bcryptjs` for hashing.

## Non-Goals
- Login flow (separate change).
- Session management / JWT tokens.
- Email verification.
- Password strength validation beyond basic "required".
