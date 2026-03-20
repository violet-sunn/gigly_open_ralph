# UI Specification Delta: Authentication Pages Token Migration

## MODIFIED Requirements

### Requirement: Homepage
The homepage at `/` MUST display the application name and adapt based on authentication state using token-based styling.

#### Scenario: Anonymous user visits homepage with token-based styling
- GIVEN no valid session cookie exists
- WHEN a user visits `/`
- THEN it MUST display the application name "Gigly"
- AND it MUST display a "Get Started" link to `/register`
- AND it MUST display a "Sign in" link to `/login`
- AND the page background MUST use `bg-navy-900`
- AND the "Get Started" button MUST use `bg-blue-500 hover:bg-blue-600 text-white`
- AND the "Sign in" link MUST use `text-blue-500 hover:text-blue-400`
- AND the layout MUST use consistent spacing with Dashboard patterns

#### Scenario: Authenticated user visits homepage with token-based styling
- GIVEN a user is logged in (valid session cookie)
- WHEN they visit `/`
- THEN it MUST display their email address
- AND it MUST display a logout button/form
- AND it MUST NOT show the "Get Started" CTA
- AND the "Go to Dashboard" button MUST use `bg-blue-500 hover:bg-blue-600 text-white`
- AND the "Sign out" button MUST use `text-blue-500 border border-blue-500 hover:bg-blue-500/10`
- AND the page background MUST use `bg-navy-900`

**Acceptance Criteria:**
- `app/page.tsx` calls `getSession()` to check auth state
- Authenticated: shows email + logout form with token-based button styling
- Anonymous: shows "Get Started" link + "Sign in" link with token-based styling
- Page background uses `bg-navy-900`
- Primary CTA uses `bg-blue-500 hover:bg-blue-600`
- Secondary actions use text link styling or outlined button styling
- All existing functionality preserved
- No changes to authentication logic

---

### Requirement: Login Page
The application MUST provide a login page at `/login` with email and password fields using token-based styling consistent with Dashboard form patterns.

#### Scenario: Login page renders with token-based styling
- GIVEN a user navigates to `/login`
- WHEN the page loads
- THEN it MUST display a form with email and password inputs
- AND it MUST display a "Sign in" submit button
- AND it MUST display a link to `/register` for users without an account
- AND the form container MUST use `bg-surface-level-1 border border-neutral-weak rounded-lg shadow-md`
- AND the form container MUST use `p-8` (32px) padding
- AND form fields MUST use `space-y-6` (24px) vertical spacing
- AND the page background MUST use `bg-navy-900`

#### Scenario: Login form inputs use token-based styling
- GIVEN a user views the login form
- WHEN form inputs render
- THEN email and password inputs MUST use `bg-navy-800 border border-gray-600 text-white`
- AND inputs MUST use `focus:ring-1 focus:ring-blue-500 focus:border-blue-500` for focus states
- AND placeholder text MUST use `placeholder:text-gray-400`
- AND input padding MUST use `px-4 py-3`
- AND labels MUST use `text-white text-sm font-medium`

#### Scenario: Login form submit button uses prominent styling
- GIVEN a user views the login form
- WHEN the submit button renders
- THEN the button MUST use `bg-blue-500 hover:bg-blue-600 text-white`
- AND the button MUST use `w-full` (full width)
- AND the button MUST use `py-3 px-6 rounded-md text-sm font-semibold`
- AND the button MUST include focus states: `focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-navy-900`
- AND disabled state MUST use `disabled:opacity-50 disabled:cursor-not-allowed`

#### Scenario: Login form shows loading state
- GIVEN a user submits the login form
- WHEN the server action is processing
- THEN the submit button MUST show "Signing in..." text
- AND the button MUST be disabled

#### Scenario: Login form shows error with consistent styling
- GIVEN a user submits invalid credentials
- WHEN the server action returns an error
- THEN the error message MUST be displayed inline on the form
- AND the error message MUST use `text-error-500 text-sm`
- AND the error message MUST be positioned between form fields and submit button

#### Scenario: Login page link to registration uses secondary styling
- GIVEN a user views the login page
- WHEN the registration link renders
- THEN the link text MUST use `text-blue-500 hover:text-blue-400 font-medium`
- AND the surrounding text MUST use `text-gray-300 text-sm`

**Acceptance Criteria:**
- `app/login/page.tsx` exists as a `'use client'` component
- Uses `useActionState` with `loginUser` action
- Uses `useFormStatus` for pending state on submit button
- Form container uses `bg-surface-level-1 border border-neutral-weak rounded-lg shadow-md p-8`
- Form fields use `space-y-6` vertical spacing
- Input fields use `bg-navy-800 border border-gray-600 text-white` with token-based focus states
- Submit button uses `bg-blue-500 hover:bg-blue-600 text-white w-full`
- Error messages use `text-error-500 text-sm`
- Registration link uses `text-blue-500 hover:text-blue-400`
- Page background uses `bg-navy-900`
- All existing functionality preserved (validation, error handling, navigation)
- Includes a `<Link>` to `/register`
- Displays `state?.error` when present

---

### Requirement: Registration Form with Role Selection
The registration form MUST provide visible feedback after submission and include a role selector using token-based styling consistent with Dashboard patterns.

#### Scenario: Registration page renders with token-based styling
- GIVEN a user navigates to `/register`
- WHEN the page loads
- THEN the form container MUST use `bg-surface-level-1 border border-neutral-weak rounded-lg shadow-md`
- AND the form container MUST use `p-8` (32px) padding
- AND form fields MUST use `space-y-6` (24px) vertical spacing
- AND the page background MUST use `bg-navy-900`

#### Scenario: Role selector renders with token-based styling
- GIVEN a user navigates to `/register`
- WHEN the page loads
- THEN it MUST display two selectable options: "Client" and "Specialist"
- AND no role MUST be pre-selected (user must actively choose)
- AND each role option MUST use `border border-gray-600 rounded-md`
- AND selected role MUST use `border-blue-500 bg-blue-500/10 text-blue-500`
- AND unselected roles MUST use `hover:bg-navy-700` on hover
- AND role descriptions MUST use `text-gray-400 text-xs`

#### Scenario: Registration form inputs use token-based styling
- GIVEN a user views the registration form
- WHEN form inputs render
- THEN email and password inputs MUST use `bg-navy-800 border border-gray-600 text-white`
- AND inputs MUST use `focus:ring-1 focus:ring-blue-500 focus:border-blue-500` for focus states
- AND placeholder text MUST use `placeholder:text-gray-400`
- AND input padding MUST use `px-4 py-3`
- AND labels MUST use `text-white text-sm font-medium`

#### Scenario: Registration form submit button uses prominent styling
- GIVEN a user views the registration form
- WHEN the submit button renders
- THEN the button MUST use `bg-blue-500 hover:bg-blue-600 text-white`
- AND the button MUST use `w-full` (full width)
- AND the button MUST use `py-3 px-6 rounded-md text-sm font-semibold`
- AND the button MUST include focus states: `focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-navy-900`
- AND disabled state MUST use `disabled:opacity-50 disabled:cursor-not-allowed`

#### Scenario: Registration submits with selected role
- GIVEN a user selects "Client", fills email and password
- WHEN the form is submitted
- THEN the form data MUST include `role: "CLIENT"`
- AND all existing validation MUST work identically

#### Scenario: Registration without selecting role
- GIVEN a user fills email and password but does not select a role
- WHEN the form is submitted
- THEN the server action MUST return an error (role is required)
- AND the error MUST be displayed with `text-error-500 text-sm` styling

#### Scenario: Successful registration
- GIVEN a user selects a role, fills in valid email and password on `/register`
- WHEN the form is submitted
- THEN the user MUST be redirected to `/dashboard` with a session cookie set
- AND the form MUST NOT appear to do nothing

#### Scenario: Failed registration (duplicate email)
- GIVEN a user submits an email that already exists
- WHEN the form is submitted
- THEN an error message MUST be displayed on the page
- AND the error message MUST use `text-error-500 text-sm` styling
- AND the form MUST remain visible so the user can retry

#### Scenario: Registration page link to login uses secondary styling
- GIVEN a user views the registration page
- WHEN the login link renders
- THEN the link text MUST use `text-blue-500 hover:text-blue-400 font-medium`
- AND the surrounding text MUST use `text-gray-300 text-sm`

**Acceptance Criteria:**
- `app/register/page.tsx` exists as a `'use client'` component
- Uses `useActionState` with `registerUser` action
- Uses `useFormStatus` for pending state on submit button
- Form container uses `bg-surface-level-1 border border-neutral-weak rounded-lg shadow-md p-8`
- Form fields use `space-y-6` vertical spacing
- Role selector includes radio buttons with `name="role"`, values `"CLIENT"` / `"SPECIALIST"`, `required`
- Role selector uses token-based styling: `border-gray-600`, selected `border-blue-500 bg-blue-500/10 text-blue-500`
- Input fields use `bg-navy-800 border border-gray-600 text-white` with token-based focus states
- Submit button uses `bg-blue-500 hover:bg-blue-600 text-white w-full`
- Error messages use `text-error-500 text-sm`
- Login link uses `text-blue-500 hover:text-blue-400`
- Page background uses `bg-navy-900`
- On success: user is redirected to `/dashboard` with session set
- On error: an error message is displayed inline on the registration page
- A loading/pending indicator is shown while the form submits
- Registration page includes a `<Link href="/login">` ("Already have an account? Sign in")
- All existing functionality preserved (role validation, password validation, error handling)
- Role selector values (CLIENT, SPECIALIST) preserved exactly
- All form field names preserved exactly

---

## ADDED Requirements

### Requirement: Authentication Pages Visual Consistency
Authentication pages MUST maintain visual consistency with Dashboard patterns through token-based styling.

#### Scenario: Form containers match Dashboard card hierarchy
- GIVEN a user views any authentication page (login, registration)
- WHEN form containers render
- THEN form containers MUST use `bg-surface-level-1` background token
- AND form containers MUST use `border-neutral-weak` border token
- AND form containers MUST use `rounded-lg shadow-md` for depth
- AND form containers MUST use `p-8` (32px) padding matching Dashboard form patterns

#### Scenario: Form spacing matches Dashboard rhythm
- GIVEN a user views any authentication form
- WHEN form fields render
- THEN form fields MUST use `space-y-6` (24px) vertical spacing
- AND input groups MUST use `space-y-4` (16px) for label-input pairs
- AND the spacing MUST match Dashboard form field spacing patterns

#### Scenario: Primary CTAs match Dashboard button styling
- GIVEN a user views any authentication page
- WHEN primary action buttons render (Login, Register, Get Started)
- THEN buttons MUST use `bg-blue-500 hover:bg-blue-600 text-white`
- AND buttons MUST use `py-3 px-6` (12px vertical, 24px horizontal) padding
- AND buttons MUST use `rounded-md text-sm font-semibold`
- AND buttons MUST include focus states: `focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`
- AND the styling MUST match Dashboard primary action buttons

#### Scenario: Secondary actions match Dashboard link styling
- GIVEN a user views any authentication page
- WHEN secondary action links render (Sign in, Sign up, Sign out outlined button)
- THEN text links MUST use `text-blue-500 hover:text-blue-400 font-medium`
- AND outlined buttons MUST use `text-blue-500 border border-blue-500 hover:bg-blue-500/10`
- AND the styling MUST match Dashboard secondary action patterns

#### Scenario: Error messages match Dashboard error styling
- GIVEN a user encounters an error on any authentication page
- WHEN error messages render
- THEN error messages MUST use `text-error-500` color token
- AND error messages MUST use `text-sm` font size
- AND the styling MUST match Dashboard error message patterns

#### Scenario: Page backgrounds match application theme
- GIVEN a user views any authentication page
- WHEN the page renders
- THEN the page background MUST use `bg-navy-900`
- AND the background MUST match the application's overall dark theme
- AND the background MUST provide proper contrast with form containers

**Acceptance Criteria:**
- All authentication pages use `bg-navy-900` for page background
- All form containers use `bg-surface-level-1 border border-neutral-weak rounded-lg shadow-md p-8`
- All form fields use `space-y-6` vertical spacing
- All primary action buttons use `bg-blue-500 hover:bg-blue-600 text-white`
- All secondary action links use `text-blue-500 hover:text-blue-400`
- All error messages use `text-error-500 text-sm`
- Visual consistency verified against Dashboard form patterns
- No functional changes to authentication logic
- All existing tests pass without modification
