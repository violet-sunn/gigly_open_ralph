# Tasks — homepage-and-registration-flow

## 1. Install bcryptjs
- Run `npm install bcryptjs` and `npm install -D @types/bcryptjs`
- **Test plan:** `npm ls bcryptjs` shows installed version; `npx tsc --noEmit` passes

## 2. Hash password in registerUser action
- In `app/actions/auth.ts`, import `bcrypt` from `bcryptjs`
- Hash the password with `bcrypt.hash(password, 10)` before passing to `prisma.user.create()`
- **Test plan:** Register a user, then inspect the database — stored password starts with `$2a$` or `$2b$`, not the plaintext value

## 3. Add redirect on successful registration
- In `app/actions/auth.ts`, import `redirect` from `next/navigation`
- After successful `prisma.user.create()`, call `redirect('/')`
- Move `redirect()` outside the try/catch (Next.js redirect throws internally)
- On failure, return `{ error: 'Registration failed' }` (or a more specific message for duplicate email)
- **Test plan:** Submit valid registration → browser ends up on `/`. Submit duplicate email → error object returned

## 4. Update registerUser signature for useActionState
- Change the function signature to `(prevState: { error?: string } | null, formData: FormData)`
- Return `{ error: string }` on failure, or redirect on success (no return needed)
- **Test plan:** `npx tsc --noEmit` passes; function is compatible with `useActionState`

## 5. Convert registration page to client component with useActionState
- Add `'use client'` to `app/register/page.tsx`
- Import `useActionState` from `react` and `useFormStatus` from `react-dom`
- Wire up `useActionState(registerUser, null)` to get `[state, formAction]`
- Pass `formAction` as the form's `action`
- Display `state?.error` as an inline error message above the submit button
- **Test plan:** Submit duplicate email → error message visible on page. Submit valid data → redirect to `/`

## 6. Add pending/loading state to submit button
- Create a `SubmitButton` component using `useFormStatus`
- Show "Signing up..." and disable the button while `pending` is true
- **Test plan:** Click submit → button text changes to "Signing up..." and is disabled during submission

## 7. Update homepage with link to register
- In `app/page.tsx`, replace the placeholder content
- Add a prominent "Get Started" or "Sign Up" link pointing to `/register`
- Keep it styled with Tailwind, centered layout
- **Test plan:** Navigate to `/` → link to `/register` is visible. Click it → navigates to `/register`

## 8. Final validation
- Run `npx tsc --noEmit` — no type errors
- Run `npm run lint` — no lint errors
- Run `npx prisma validate` — schema valid
- Manual flow: `/` → click link → `/register` → fill form → submit → redirected to `/`
- Duplicate email flow: submit same email again → error message shown
