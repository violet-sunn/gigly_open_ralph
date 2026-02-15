# Tasks: User Login & Session Management

## 1. Install `jose` dependency
- Run `npm install jose`
- **Test:** `npm ls jose` shows the package installed

## 2. Create session utility library (`lib/session.ts`)
- Create `lib/session.ts` exporting:
  - `createSession(userId: string, email: string)` — signs a JWT with `jose`, sets HTTP-only cookie named `session` with 7-day expiry
  - `getSession()` — reads the `session` cookie, verifies the JWT, returns `{ userId, email }` or `null`
  - `destroySession()` — deletes the `session` cookie
- Use `cookies()` from `next/headers` for cookie access
- Read secret from `process.env.SESSION_SECRET`, encode to `Uint8Array` for `jose`
- **Test:** `npx tsc --noEmit` passes

## 3. Add `SESSION_SECRET` to environment
- Add `SESSION_SECRET` to `.env` (generate a random 32+ char string)
- **Test:** Value present in `.env`

## 4. Update `registerUser` to create session on success
- After `prisma.user.create()`, call `createSession(user.id, user.email)` before `redirect('/')`
- Store the return value of `prisma.user.create()` in a variable to access `id` and `email`
- **Test:** `npx tsc --noEmit` passes

## 5. Create `loginUser` server action
- Add `loginUser` to `app/actions/auth.ts`
- Signature: `(prevState: { error?: string } | null, formData: FormData)`
- Look up user by email with `prisma.user.findUnique()`
- If not found, return `{ error: 'Invalid email or password.' }`
- Compare password with `bcrypt.compare()`
- If mismatch, return same generic error
- On success, call `createSession(user.id, user.email)` then `redirect('/')`
- **Test:** `npx tsc --noEmit` passes

## 6. Create `logoutUser` server action
- Add `logoutUser` to `app/actions/auth.ts`
- Call `destroySession()` then `redirect('/')`
- **Test:** `npx tsc --noEmit` passes

## 7. Create login page (`app/login/page.tsx`)
- `'use client'` component
- Use `useActionState` with `loginUser`, initial state `null`
- Form with email + password inputs (same styling as register page)
- `SubmitButton` component using `useFormStatus` — shows "Signing in..." when pending
- Display `state?.error` inline
- Include `<Link href="/register">` with text like "Don't have an account? Sign up"
- **Test:** `npx tsc --noEmit` passes. `npm run lint` passes.

## 8. Add login link to registration page
- Add a `<Link href="/login">` below the form in `app/register/page.tsx`
- Text: "Already have an account? Sign in"
- **Test:** `npx tsc --noEmit` passes

## 9. Update homepage for authenticated state
- In `app/page.tsx`, call `getSession()` to check auth
- If authenticated: show user email and a logout form (button that calls `logoutUser`)
- If anonymous: show existing "Get Started" link + add a "Sign in" link to `/login`
- **Test:** `npx tsc --noEmit` passes. `npm run lint` passes.

## 10. Create middleware for route protection (`middleware.ts`)
- Create `middleware.ts` in project root
- Protect `/dashboard`: redirect to `/login` if no valid session
- Protect `/login` and `/register`: redirect to `/dashboard` if already logged in
- Use `jose` directly (not `lib/session.ts`) since middleware runs in Edge runtime
- **Test:** `npx tsc --noEmit` passes

## 11. Create dashboard page (`app/dashboard/page.tsx`)
- Server component that reads session via `getSession()`
- Display user email and role
- Include a logout form with "Sign Out" button calling `logoutUser`
- **Test:** `npx tsc --noEmit` passes

## 12. Create integration test script (`scripts/test-auth-flow.ts`)
- Create `scripts/test-auth-flow.ts` that exercises the auth flow end-to-end:
  1. Clean up any leftover test user from previous runs
  2. Create a user directly via Prisma with a bcrypt-hashed password
  3. Verify the user exists in the DB
  4. Verify the stored password hash is valid via `bcrypt.compare()`
  5. Call `loginUser` with correct credentials — expect success (NEXT_REDIRECT thrown)
  6. Call `loginUser` with wrong password — expect `{ error: 'Invalid email or password.' }`
  7. Call `loginUser` with non-existent email — expect `{ error: 'Invalid email or password.' }`
  8. Clean up: delete the test user
- Each test case prints PASS or FAIL
- Script exits with code 0 if all pass, non-zero on any failure
- Run via `npx tsx scripts/test-auth-flow.ts`
- **Test:** `npx tsx scripts/test-auth-flow.ts` exits 0 with all PASS

## 13. Final validation
- Run `npx tsc --noEmit` — no type errors
- Run `npm run lint` — no lint errors
- Run `npx prisma validate` — schema valid
- Run `npx tsx scripts/test-auth-flow.ts` — all assertions pass
- Run `npm run build` — build succeeds
