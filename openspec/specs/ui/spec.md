# UI Specification

## Requirements

### Requirement: Homepage
The homepage at `/` MUST display the application name and adapt based on authentication state.

#### Scenario: Anonymous user visits homepage
- GIVEN no valid session cookie exists
- WHEN a user visits `/`
- THEN it MUST display the application name "Gigly"
- AND it MUST display a "Get Started" link to `/register`
- AND it MUST display a "Sign in" link to `/login`

#### Scenario: Authenticated user visits homepage
- GIVEN a user is logged in (valid session cookie)
- WHEN they visit `/`
- THEN it MUST display their email address
- AND it MUST display a logout button/form
- AND it MUST NOT show the "Get Started" CTA

**Acceptance Criteria:**
- `app/page.tsx` calls `getSession()` to check auth state
- Authenticated: shows email + logout form
- Anonymous: shows "Get Started" link + "Sign in" link

---

### Requirement: Registration Form with Role Selection
The registration form MUST provide visible feedback after submission and include a role selector.

#### Scenario: Role selector renders
- GIVEN a user navigates to `/register`
- WHEN the page loads
- THEN it MUST display two selectable options: "Client" and "Specialist"
- AND no role MUST be pre-selected (user must actively choose)

#### Scenario: Registration submits with selected role
- GIVEN a user selects "Client", fills email and password
- WHEN the form is submitted
- THEN the form data MUST include `role: "CLIENT"`

#### Scenario: Registration without selecting role
- GIVEN a user fills email and password but does not select a role
- WHEN the form is submitted
- THEN the server action MUST return an error (role is required)

#### Scenario: Successful registration
- GIVEN a user selects a role, fills in valid email and password on `/register`
- WHEN the form is submitted
- THEN the user MUST be redirected to `/dashboard` with a session cookie set
- AND the form MUST NOT appear to do nothing

#### Scenario: Failed registration (duplicate email)
- GIVEN a user submits an email that already exists
- WHEN the form is submitted
- THEN an error message MUST be displayed on the page
- AND the form MUST remain visible so the user can retry

#### Scenario: Failed registration (missing fields)
- GIVEN a user submits with empty email or password
- WHEN the form is submitted
- THEN HTML5 validation MUST prevent submission (existing `required` attributes)

**Acceptance Criteria:**
- `app/register/page.tsx` includes radio buttons with `name="role"`, values `"CLIENT"` / `"SPECIALIST"`, `required`
- On success: user is redirected to `/dashboard` with session set
- On error: an error message is displayed inline on the registration page
- The form uses `useActionState` (React 19) to track submission state
- A loading/pending indicator is shown while the form submits
- Registration page includes a `<Link href="/login">` ("Already have an account? Sign in")

---

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

### Requirement: Role-Based Dashboard
The dashboard MUST render different content based on the user's role.

#### Scenario: Client visits dashboard
- GIVEN a user with role "CLIENT" is logged in
- WHEN they visit `/dashboard`
- THEN the page MUST display "Client Dashboard" heading
- AND it MUST show a "Post a Gig" call-to-action (placeholder/disabled)
- AND it MUST show a "My Gigs" section (empty state placeholder)
- AND it MUST display a "Sign out" button

#### Scenario: Specialist visits dashboard
- GIVEN a user with role "SPECIALIST" is logged in
- WHEN they visit `/dashboard`
- THEN the page MUST display "Specialist Dashboard" heading
- AND it MUST show a "Browse Gigs" call-to-action (placeholder/disabled)
- AND it MUST show a "My Applications" section (empty state placeholder)
- AND it MUST display a "Sign out" button

#### Scenario: Unknown role visits dashboard
- GIVEN a user with an unrecognized role is logged in
- WHEN they visit `/dashboard`
- THEN the page MUST display a generic dashboard with a message to contact support

**Acceptance Criteria:**
- `app/dashboard/page.tsx` is a server component
- Reads `session.role` from `getSession()`
- Renders different content for `"CLIENT"` vs `"SPECIALIST"`
- Includes fallback for unknown roles
- Both views include the sign-out form
