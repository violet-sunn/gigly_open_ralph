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
- AND it MUST show a "Post a Gig" link to `/dashboard/gigs/new`
- AND it MUST show a "My Gigs" section listing the user's gigs with title, budget (₽), status, and date
- AND IN_PROGRESS gigs MUST show the assigned specialist's email
- AND if no gigs exist, it MUST show "No gigs posted yet."
- AND it MUST display a "Sign out" button

#### Scenario: Specialist visits dashboard
- GIVEN a user with role "SPECIALIST" is logged in
- WHEN they visit `/dashboard`
- THEN the page MUST display "Specialist Dashboard" heading
- AND it MUST show a "Browse Gigs" link to `/dashboard/gigs`
- AND it MUST show a "My Applications" section listing applications with gig title, status, and date
- AND if no applications exist, it MUST show "No applications yet."
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
- CLIENT view queries gigs via Prisma and lists them with application count
- "Post a Gig" is a `<Link>` to `/dashboard/gigs/new`
- SPECIALIST view queries applications via Prisma and lists them
- "Browse Gigs" is a `<Link>` to `/dashboard/gigs`

---

### Requirement: Gig Creation Form
The system MUST provide a form at `/dashboard/gigs/new` for CLIENT users to create gigs.

#### Scenario: Form renders for CLIENT user
- GIVEN an authenticated user with role "CLIENT"
- WHEN they navigate to `/dashboard/gigs/new`
- THEN the page MUST display a form with:
  - Title input (text, required)
  - Description textarea (required)
  - Budget input (number, required, in roubles)
  - Tags input (text, optional, comma-separated)
  - A live fee preview showing: budget, service fee (20%), and total amount
  - A "Post Gig" submit button

#### Scenario: Live fee calculation preview
- GIVEN a CLIENT user is on the gig creation form
- WHEN they enter a budget value (e.g., 100000)
- THEN the form MUST display in real-time:
  - "Budget: 100,000 ₽"
  - "Service fee (20%): 20,000 ₽"
  - "Total: 120,000 ₽"

#### Scenario: Form shows loading state
- GIVEN a CLIENT user submits the gig form
- WHEN the server action is processing
- THEN the submit button MUST show "Posting..." text
- AND the button MUST be disabled

#### Scenario: Form shows error
- GIVEN a CLIENT user submits invalid data
- WHEN the server action returns an error
- THEN the error message MUST be displayed inline on the form

#### Scenario: Non-CLIENT user visits gig creation page
- GIVEN an authenticated user with role "SPECIALIST"
- WHEN they navigate to `/dashboard/gigs/new`
- THEN they MUST be redirected to `/dashboard`

#### Scenario: Unauthenticated user visits gig creation page
- GIVEN no valid session
- WHEN a user navigates to `/dashboard/gigs/new`
- THEN they MUST be redirected to `/login` (handled by existing middleware)

**Acceptance Criteria:**
- `app/dashboard/gigs/new/page.tsx` exists
- Uses `useActionState` with `createGig` action
- Uses `useFormStatus` for pending state on submit button
- Budget input accepts roubles, displays fee breakdown in real-time
- Displays `state?.error` when present

---

### Requirement: Gig Browse Page
The system MUST provide a page at `/dashboard/gigs` listing all OPEN gigs for browsing.

#### Scenario: Specialist browses gigs
- GIVEN an authenticated user with role "SPECIALIST"
- WHEN they navigate to `/dashboard/gigs`
- THEN the page MUST display a list of all gigs with status "OPEN"
- AND each gig MUST show: title, budget (formatted in ₽), tags, and creation date
- AND each gig MUST link to `/dashboard/gigs/[id]`

#### Scenario: No open gigs available
- GIVEN no gigs with status "OPEN" exist
- WHEN a SPECIALIST visits `/dashboard/gigs`
- THEN the page MUST display "No open gigs available."

#### Scenario: CLIENT visits browse page
- GIVEN an authenticated user with role "CLIENT"
- WHEN they navigate to `/dashboard/gigs`
- THEN the page MUST also display the gig list (read-only, no apply action)

#### Scenario: Unauthenticated user visits browse page
- GIVEN no valid session
- WHEN a user navigates to `/dashboard/gigs`
- THEN they MUST be redirected to `/login` (handled by existing middleware)

**Acceptance Criteria:**
- `app/dashboard/gigs/page.tsx` exists as a server component
- Queries `prisma.gig.findMany({ where: { status: 'OPEN' } })`
- Each gig links to its detail page
- Accessible to both CLIENT and SPECIALIST roles

---

### Requirement: Gig Detail Page
The system MUST provide a page at `/dashboard/gigs/[id]` showing full gig details.

#### Scenario: Specialist views gig detail
- GIVEN an authenticated SPECIALIST user
- WHEN they navigate to `/dashboard/gigs/[id]` for an existing gig
- THEN the page MUST display: title, description, budget (₽), tags, status, and client email
- AND it MUST display an "Apply" form with a cover letter textarea and submit button
- AND if the specialist has already applied, the form MUST be replaced with "You have already applied" message

#### Scenario: CLIENT views gig detail
- GIVEN an authenticated CLIENT user
- WHEN they navigate to `/dashboard/gigs/[id]`
- THEN the page MUST display the gig details
- AND it MUST NOT show the apply form
- AND if the CLIENT owns the gig, it MUST show the list of applications with specialist email, cover letter, status, and date
- AND if the gig is OPEN, each PENDING application MUST show "Accept" and "Reject" buttons
- AND if the gig is IN_PROGRESS, applications MUST show status badges ("Accepted" / "Rejected") instead of buttons
- AND if the gig is IN_PROGRESS, the assigned specialist's email MUST be shown prominently

#### Scenario: Gig not found
- GIVEN a non-existent gig ID
- WHEN a user navigates to `/dashboard/gigs/[id]`
- THEN the page MUST show a "Gig not found" message with a link back to `/dashboard`

#### Scenario: Apply form shows loading state
- GIVEN a SPECIALIST submits the apply form
- WHEN the server action is processing
- THEN the submit button MUST show "Applying..." text
- AND the button MUST be disabled

#### Scenario: Apply form shows error
- GIVEN a SPECIALIST submits and the server action returns an error
- WHEN the error is returned
- THEN the error message MUST be displayed inline on the form

**Acceptance Criteria:**
- `app/dashboard/gigs/[id]/page.tsx` exists as a server component
- Queries gig by ID with `include: { client: true, assignedSpecialist: true, applications: true }`
- SPECIALIST sees apply form (or "already applied" message)
- CLIENT who owns the gig sees applications list
- OPEN gigs: PENDING applications show Accept/Reject buttons via `ApplicationActions` client component
- IN_PROGRESS gigs: applications show status badges, assigned specialist email displayed
- `ApplicationActions` uses `useActionState` with `acceptApplication` / `rejectApplication`
- `ApplicationActions` uses `useFormStatus` for pending states ("Accepting..." / "Rejecting...")
- Each button submits a form with hidden `applicationId` field
- Inline error display from action state
