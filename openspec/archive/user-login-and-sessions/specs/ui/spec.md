# UI Specification Delta

## ADDED Requirements

### Requirement: Login Page
The application MUST provide a login page at `/login` with email and password fields.

#### Scenario: Login page renders correctly
- GIVEN a user navigates to `/login`
- WHEN the page loads
- THEN it MUST display a form with email and password inputs
- AND it MUST display a "Sign in" submit button
- AND it MUST display a link to `/register` for users without an account

#### Scenario: Login form shows loading state
- GIVEN a user submits the login form
- WHEN the server action is processing
- THEN the submit button MUST show "Signing in..." text
- AND the button MUST be disabled

#### Scenario: Login form shows error
- GIVEN a user submits invalid credentials
- WHEN the server action returns an error
- THEN the error message MUST be displayed inline on the form

**Acceptance Criteria:**
- `app/login/page.tsx` exists as a `'use client'` component
- Uses `useActionState` with `loginUser` action
- Uses `useFormStatus` for pending state on submit button
- Includes a `<Link>` to `/register`
- Displays `state?.error` when present

---

### Requirement: Registration Page Login Link
The registration page MUST include a link to the login page.

#### Scenario: Register page links to login
- GIVEN a user is on `/register`
- WHEN the page renders
- THEN it MUST display a link to `/login` (e.g., "Already have an account? Sign in")

**Acceptance Criteria:**
- `app/register/page.tsx` includes a `<Link href="/login">` element

---

## MODIFIED Requirements

### Requirement: Homepage Authenticated State
The homepage MUST display different content based on authentication state.

#### Scenario: Authenticated user visits homepage
- GIVEN a user is logged in (valid session cookie)
- WHEN they visit `/`
- THEN the page MUST display their email address
- AND it MUST display a logout button/form
- AND it MUST NOT show the "Get Started" CTA

#### Scenario: Anonymous user visits homepage
- GIVEN no valid session cookie exists
- WHEN a user visits `/`
- THEN the page MUST display the existing "Get Started" link to `/register`
- AND it MUST also display a "Sign in" link to `/login`

**Acceptance Criteria:**
- `app/page.tsx` calls `getSession()` to check auth state
- Authenticated: shows email + logout form
- Anonymous: shows "Get Started" link + "Sign in" link
