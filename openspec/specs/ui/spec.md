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
- AND each gig in "My Gigs" MUST be a clickable link to `/dashboard/gigs/{gig.id}`
- AND IN_PROGRESS gigs MUST show the assigned specialist's email
- AND if no gigs exist, it MUST show "No gigs posted yet."
- AND it MUST display a "Sign out" button

#### Scenario: Client clicks a gig in "My Gigs"
- GIVEN a CLIENT user is on `/dashboard`
- AND the "My Gigs" section lists at least one gig
- WHEN the client clicks on a gig item
- THEN the browser MUST navigate to `/dashboard/gigs/{gig.id}`

#### Scenario: Gig list item shows clickable affordance
- GIVEN a CLIENT user is on `/dashboard`
- AND the "My Gigs" section lists at least one gig
- WHEN the user hovers over a gig item
- THEN the item MUST visually indicate it is clickable (e.g., background color change or cursor pointer)

#### Scenario: Specialist visits dashboard
- GIVEN a user with role "SPECIALIST" is logged in
- WHEN they visit `/dashboard`
- THEN the page MUST display "Specialist Dashboard" heading
- AND it MUST show a "Browse Gigs" link to `/dashboard/gigs`
- AND it MUST show a "My Profile" link to `/dashboard/profile`
- AND it MUST display three tabs: "Active Work", "Pending Applications", "Archive"
- AND the "Active Work" tab MUST be selected by default
- AND it MUST display a "Sign out" button

#### Scenario: Active Work tab displays in-progress gigs
- GIVEN a SPECIALIST user is on `/dashboard`
- AND the "Active Work" tab is selected
- WHEN the tab content renders
- THEN the tab MUST display gigs where:
  - The specialist is assigned (assignedSpecialistId matches user ID)
  - Status is IN_PROGRESS, REVIEW, or COMPLETED (excludes PAID)
- AND each gig MUST be wrapped in a `<Link href="/dashboard/gigs/{gig.id}">`
- AND each gig MUST show: title, status, budget (₽), and date
- AND each gig MUST have hover affordance (e.g., bg-gray-50 on hover)
- AND if no active gigs exist, it MUST show "No active work."
- AND PAID gigs MUST NOT appear in this tab

#### Scenario: Pending Applications tab displays pending applications
- GIVEN a SPECIALIST user is on `/dashboard`
- AND the "Pending Applications" tab is selected
- WHEN the tab content renders
- THEN the tab MUST display applications where:
  - Status is PENDING (awaiting client decision)
  - The specialist is the applicant
- AND each application MUST be wrapped in a `<Link href="/dashboard/gigs/{app.gigId}">`
- AND each application MUST show: gig title, status, and date
- AND each application MUST have hover affordance (e.g., bg-gray-50 on hover)
- AND if no pending applications exist, it MUST show "No pending applications."
- AND ACCEPTED applications MUST NOT appear in this tab (they appear in Active Work)
- AND REJECTED applications MUST NOT appear in this tab (they appear in Archive)

#### Scenario: Archive tab displays completed and rejected items
- GIVEN a SPECIALIST user is on `/dashboard`
- AND the "Archive" tab is selected
- WHEN the tab content renders
- THEN the tab MUST display two sections:
  - "Completed Gigs" section showing gigs with status PAID
  - "Rejected Applications" section showing applications with status REJECTED
- AND each item MUST be wrapped in a `<Link href="/dashboard/gigs/{id}">`
- AND each item MUST show: title, status, and date
- AND each item MUST have hover affordance (e.g., bg-gray-50 on hover)
- AND if no archived items exist, it MUST show "No archived items."
- AND IN_PROGRESS, REVIEW, COMPLETED gigs MUST NOT appear in this tab

#### Scenario: Tab switching is instant
- GIVEN a SPECIALIST user is on `/dashboard`
- WHEN they click on a different tab
- THEN the tab content MUST update immediately (client-side state change)
- AND no network request MUST be made
- AND no loading spinner MUST be displayed
- AND the active tab MUST be visually distinguished (e.g., blue border or background)
- AND the previous tab content MUST be hidden
- AND the new tab content MUST be displayed

#### Scenario: No gig appears in multiple tabs
- GIVEN a SPECIALIST user has multiple gigs and applications
- WHEN they view the dashboard and switch between tabs
- THEN each gig MUST appear in exactly one tab:
  - If application is ACCEPTED and gig is IN_PROGRESS/REVIEW/COMPLETED → appears in "Active Work" only
  - If application is PENDING → appears in "Pending Applications" only
  - If application is REJECTED → appears in "Archive" only
  - If gig is PAID → appears in "Archive" only
- AND no gig MUST appear in both "Active Work" and "Pending Applications"
- AND no gig MUST appear in both "Active Work" and "Archive"
- AND no application MUST appear in both "Pending Applications" and "Archive"

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
- Each gig in "My Gigs" MUST be wrapped in a `<Link href="/dashboard/gigs/{gig.id}">` with `block` class and `hover:bg-gray-50` for visual feedback
- SPECIALIST view uses `SpecialistDashboardTabs` client component
- `SpecialistDashboardTabs` component:
  - Marked with `'use client'` directive
  - Accepts props: `activeGigs: Gig[]`, `applications: Application[]`
  - Manages tab state with `useState<'active' | 'pending' | 'archive'>('active')`
  - Renders three tabs: "Active Work", "Pending Applications", "Archive"
  - Active Work tab: filters `activeGigs.filter(gig => gig.status !== 'PAID')`
  - Pending Applications tab: filters `applications.filter(app => app.status === 'PENDING')`
  - Archive tab: shows PAID gigs and REJECTED applications in two sections
  - All gig/application cards wrapped in Link components
  - Hover states on all cards (hover:bg-gray-50)
  - Empty state messages for each tab
  - Active tab visually distinguished (border-blue-600)
  - Tab switching is client-side only (no network requests)
- "Browse Gigs" is a `<Link>` to `/dashboard/gigs`
- Profile completion hints remain visible above tabs
- "My Profile" link remains accessible

---

### Requirement: Gig Creation Form
The system MUST provide a form at `/dashboard/gigs/new` for CLIENT users to create gigs.

#### Scenario: Form renders for CLIENT user
- GIVEN an authenticated user with role "CLIENT"
- WHEN they navigate to `/dashboard/gigs/new`
- THEN the page MUST display a form with:
  - Title input (text, required)
  - Description textarea (required)
  - Acceptance Criteria textarea (required, labeled "Definition of Done" or "Acceptance Criteria")
  - Goal/Outcome textarea (optional, with helpful placeholder and helper text)
  - Deliverables textarea (optional, with helpful placeholder and helper text)
  - Constraints/Preferences textarea (optional, with helpful placeholder and helper text)
  - Budget input (number, required, in roubles)
  - Tags input (text, optional, comma-separated)
  - A live fee preview showing: budget, service fee (20%), and total amount
  - A "Post Gig" submit button

#### Scenario: Acceptance criteria field has helpful guidance
- GIVEN a CLIENT user is on the gig creation form
- WHEN they view the acceptance criteria field
- THEN the field MUST have:
  - Label: "Definition of Done" or "Acceptance Criteria"
  - Placeholder text with example (e.g., "What does 'done' look like? Be specific: deliverables, quality standards, success metrics...")
  - Helper text below field: "Minimum 50 characters. Clear criteria prevent disputes and scope creep."

#### Scenario: Form validates acceptance criteria length
- GIVEN a CLIENT user enters acceptance criteria shorter than 50 characters
- WHEN they submit the form
- THEN the server action MUST return an error
- AND the error MUST be displayed inline on the form

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

#### Scenario: Optional structured fields render correctly
- GIVEN an authenticated CLIENT user on the gig creation form
- WHEN the page renders
- THEN three optional textarea fields MUST be displayed:
  - Goal/Outcome field with label, placeholder example, and helper text
  - Deliverables field with label, placeholder example, and helper text
  - Constraints/Preferences field with label, placeholder example, and helper text
- AND the fields MUST be positioned after "Definition of Done", before budget
- AND the fields MUST be visually grouped with "Additional Details (Optional)" heading
- AND no `required` attribute on optional fields

#### Scenario: Character count displays for acceptanceCriteria field
- GIVEN a CLIENT user is on the gig creation form
- WHEN they type in the acceptanceCriteria textarea
- THEN the form MUST display a real-time character count below the field
- AND the count MUST show format "X / 50 characters (minimum)"
- AND the count MUST be right-aligned
- AND when character count is below 50, the text MUST be red (text-red-600)
- AND when character count is 50 or above, the text MUST be gray (text-gray-600)
- AND when character count is 50-149 and user has interacted, a quality guidance warning MUST appear above the counter
- AND when character count is 150+, the quality guidance warning MUST NOT appear

#### Scenario: Character count displays for optional goal field
- GIVEN a CLIENT user is on the gig creation form
- WHEN they type in the goal textarea
- THEN the form MUST display a real-time character count
- AND the count MUST show format "X / 1000 characters"
- AND the count MUST be right-aligned
- AND the text MUST be gray (text-gray-600) when under 900 characters
- AND the text MUST be orange (text-orange-600) when 900 or more characters

#### Scenario: Character count displays for optional deliverables field
- GIVEN a CLIENT user is on the gig creation form
- WHEN they type in the deliverables textarea
- THEN the form MUST display a real-time character count
- AND the count MUST show format "X / 1000 characters"
- AND the count MUST be right-aligned
- AND the text MUST be gray (text-gray-600) when under 900 characters
- AND the text MUST be orange (text-orange-600) when 900 or more characters

#### Scenario: Character count displays for optional constraints field
- GIVEN a CLIENT user is on the gig creation form
- WHEN they type in the constraints textarea
- THEN the form MUST display a real-time character count
- AND the count MUST show format "X / 1000 characters"
- AND the count MUST be right-aligned
- AND the text MUST be gray (text-gray-600) when under 900 characters
- AND the text MUST be orange (text-orange-600) when 900 or more characters

#### Scenario: Character count updates in real-time
- GIVEN a CLIENT user is typing in any textarea field
- WHEN they add or delete characters
- THEN the character count MUST update immediately without delay
- AND the count MUST reflect the current `.length` of the textarea value
- AND the color coding MUST update based on current count

#### Scenario: Character count is accessible
- GIVEN a CLIENT user with a screen reader is on the gig creation form
- WHEN they interact with a textarea field
- THEN the character count MUST be announced by the screen reader
- AND the count element MUST have `aria-live="polite"` attribute
- AND the count element MUST have descriptive `aria-label` or visible text

#### Scenario: Character count does not interfere with validation
- GIVEN a CLIENT user submits the form with acceptanceCriteria under 50 characters
- WHEN the form is submitted
- THEN the server-side validation MUST still reject the submission
- AND the character count display MUST NOT bypass or replace server validation
- AND the error message from server MUST still be displayed

#### Scenario: Character count layout is non-intrusive
- GIVEN a CLIENT user is viewing the gig creation form
- WHEN they see the character counts
- THEN each count MUST be positioned on the same line as the helper text
- AND each count MUST be right-aligned (text-right or ml-auto)
- AND each count MUST use small font size (text-sm)
- AND the counts MUST NOT push other form elements out of alignment

**Acceptance Criteria:**
- `app/dashboard/gigs/new/page.tsx` exists
- Uses `useActionState` with `createGig` action
- Uses `useFormStatus` for pending state on submit button
- Acceptance criteria field:
  - `<textarea name="acceptanceCriteria" required rows={5} />`
  - Label: "Definition of Done" or "Acceptance Criteria"
  - Placeholder with example text
  - Helper text: "Minimum 50 characters. Clear criteria prevent disputes and scope creep."
  - Real-time character counter showing "X / 50 characters (minimum)"
  - Red text (text-red-600) when under 50, gray (text-gray-600) when 50+
- Three optional fields (goal, deliverables, constraints):
  - Each has label, placeholder with realistic example, helper text
  - Each has `name` attribute, `rows={3}`
  - No `required` attribute
  - Positioned after acceptanceCriteria, before budget
  - Visual grouping with "Additional Details (Optional)" heading
  - Real-time character counter showing "X / 1000 characters"
  - Gray text (text-gray-600) when under 900, orange (text-orange-600) when 900+
- Character counters:
  - All four textarea fields display character counts
  - Update in real-time via `onChange` handler
  - Right-aligned with text-sm class
  - Each has `aria-live="polite"` for accessibility
  - Positioned on same line as helper text using flex layout
  - No performance degradation or input lag
- Budget input accepts roubles, displays fee breakdown in real-time
- Displays `state?.error` when present
- Server-side validation unchanged (still validates min 50 chars for acceptanceCriteria)
- Quality guidance warning component integrated (see Acceptance Criteria Quality Guidance Warning requirement)

---

### Requirement: Gig Creation Form Visual Sections
The gig creation form MUST organize fields into three visually distinct sections with clear headings and boundaries to improve form comprehension and reduce cognitive load.

#### Scenario: Form renders with three visual sections
- GIVEN an authenticated CLIENT user navigates to `/dashboard/gigs/new`
- WHEN the page loads
- THEN the form MUST display three visually distinct sections:
  1. "Basic Information" section
  2. "Requirements & Success Criteria" section
  3. "Budget & Details" section
- AND each section MUST have a visible boundary (border or background color)
- AND each section MUST have adequate padding and spacing

#### Scenario: Basic Information section structure
- GIVEN a CLIENT user views the gig creation form
- WHEN they see the "Basic Information" section
- THEN the section MUST contain:
  - Heading: "Basic Information" (h3 or equivalent)
  - Description: "Provide a clear title and overview of the work"
  - Fields: title (text input), description (textarea)
- AND the section MUST be the first section in the form
- AND the section MUST have a light background color (e.g., bg-gray-50)
- AND the section MUST have a border (e.g., border-gray-200)

#### Scenario: Requirements & Success Criteria section structure
- GIVEN a CLIENT user views the gig creation form
- WHEN they see the "Requirements & Success Criteria" section
- THEN the section MUST contain:
  - Heading: "Requirements & Success Criteria" (h3 or equivalent)
  - Link to example gigs: "💡 View example gigs for inspiration" (right-aligned in section header, opens /dashboard/gigs in new tab)
  - Description: "Define what success looks like and help specialists understand your needs"
  - Fields: acceptanceCriteria (textarea with character counter and quality warning), goal (optional textarea), deliverables (optional textarea), constraints (optional textarea)
- AND the section header MUST use flex layout (flex items-center justify-between) with heading on left and example link on right
- AND the example link MUST open in new tab (target="_blank") with security attributes (rel="noopener noreferrer")
- AND the example link MUST use secondary styling (text-sm text-indigo-600 hover:text-indigo-800 underline)
- AND the section MUST be the second section in the form (after Basic Information)
- AND the section MUST have a light background color (e.g., bg-gray-50)
- AND the section MUST have a border (e.g., border-gray-200)
- AND all existing character counters and quality warnings MUST remain functional

#### Scenario: Budget & Details section structure
- GIVEN a CLIENT user views the gig creation form
- WHEN they see the "Budget & Details" section
- THEN the section MUST contain:
  - Heading: "Budget & Details" (h3 or equivalent)
  - Description: "Set your budget and add tags to help specialists find your gig"
  - Fields: budget (number input), service fee preview (read-only display), tags (text input)
- AND the section MUST be the third section in the form (after Requirements & Success Criteria)
- AND the section MUST have a light background color (e.g., bg-gray-50)
- AND the section MUST have a border (e.g., border-gray-200)
- AND the live fee calculation preview MUST remain functional

#### Scenario: Section headings are semantically correct
- GIVEN a CLIENT user with a screen reader views the gig creation form
- WHEN they navigate through the form
- THEN each section heading MUST use proper heading tags (h3)
- AND headings MUST be in logical order (no skipped heading levels)
- AND headings MUST be announced by screen readers

#### Scenario: Sections are visually distinct but not overwhelming
- GIVEN a CLIENT user views the gig creation form
- WHEN they scan the form visually
- THEN section boundaries MUST be clear and easy to identify
- AND the visual styling MUST use subtle colors (gray-50 backgrounds, gray-200 borders)
- AND sections MUST have adequate spacing between them (e.g., mb-6 or space-y-6)
- AND the overall form MUST NOT feel cluttered or over-designed

#### Scenario: Form remains mobile responsive
- GIVEN a CLIENT user views the gig creation form on a mobile device (320px width)
- WHEN the page renders
- THEN all three sections MUST stack vertically
- AND section containers MUST NOT cause horizontal scrolling
- AND all fields MUST remain fully functional and accessible
- AND padding and spacing MUST scale appropriately for small screens

#### Scenario: Section descriptions provide helpful context
- GIVEN a CLIENT user is filling out the gig creation form
- WHEN they read the section descriptions
- THEN each description MUST clearly explain the purpose of that section
- AND descriptions MUST be concise (one sentence)
- AND descriptions MUST use plain language (no jargon)

#### Scenario: Field order within sections remains unchanged
- GIVEN a CLIENT user views the gig creation form
- WHEN they see the fields within each section
- THEN the field order MUST match the current implementation:
  - Basic Information: title, description
  - Requirements & Success Criteria: acceptanceCriteria, goal, deliverables, constraints
  - Budget & Details: budget, tags
- AND no fields MUST be reordered or moved to different sections

#### Scenario: All existing form functionality remains intact
- GIVEN a CLIENT user interacts with the gig creation form
- WHEN they use any form feature (character counters, quality warnings, fee preview, validation)
- THEN all features MUST work exactly as before
- AND no functionality MUST be broken or degraded
- AND form submission behavior MUST remain unchanged

**Acceptance Criteria:**
- Form organized into three visual sections with clear boundaries
- Each section has heading (h3) and descriptive subtext
- Section styling uses Tailwind classes: bg-gray-50, border, border-gray-200, rounded-lg, p-6
- Sections separated with space-y-6 or mb-6 for vertical spacing
- All existing character counters, quality warnings, and fee preview remain functional
- Form remains fully responsive on mobile devices (320px and up)
- No changes to field validation, server actions, or form submission logic
- Semantic HTML structure maintained (proper heading hierarchy)
- Accessible to screen readers (headings announced, logical tab order)
- Submit button remains at the bottom of the form (outside sections)

---

### Requirement: Acceptance Criteria Quality Guidance Warning
The gig creation form MUST display a soft validation warning when acceptance criteria is above the hard minimum but below a quality threshold, encouraging users to add more detail without blocking submission.

#### Scenario: Warning appears for brief acceptance criteria
- GIVEN a CLIENT user is on the gig creation form at `/dashboard/gigs/new`
- AND they have typed between 50-149 characters in the acceptanceCriteria textarea
- AND they have interacted with the field (onChange event has fired at least once)
- WHEN the character count is calculated
- THEN a quality guidance warning MUST be displayed below the textarea
- AND the warning MUST show the message: "💡 Consider adding more detail to prevent disputes. What specific deliverables, quality standards, or success metrics define 'done'?"
- AND the warning MUST be styled with amber/yellow colors (bg-amber-50, border-amber-300, text-amber-800)
- AND the warning MUST include a lightbulb emoji (💡) at the start
- AND the warning MUST be positioned between the textarea and the character counter

#### Scenario: Warning disappears when quality threshold is reached
- GIVEN a CLIENT user sees the quality guidance warning
- AND they continue typing in the acceptanceCriteria textarea
- WHEN the character count reaches 150 or more
- THEN the warning MUST disappear immediately
- AND the character counter MUST remain visible
- AND no error message MUST be displayed

#### Scenario: Warning does not appear on page load
- GIVEN a CLIENT user navigates to `/dashboard/gigs/new`
- WHEN the page loads with an empty acceptanceCriteria field
- THEN the quality guidance warning MUST NOT be displayed
- AND the warning MUST only appear after the user starts typing (onChange event)

#### Scenario: Warning does not appear below hard minimum
- GIVEN a CLIENT user has typed fewer than 50 characters in acceptanceCriteria
- WHEN the character count is calculated
- THEN the quality guidance warning MUST NOT be displayed
- AND the hard validation error (red character counter) MUST be displayed instead
- AND only one message MUST be visible at a time (no double-messaging)

#### Scenario: Warning does not block form submission
- GIVEN a CLIENT user sees the quality guidance warning
- AND the acceptanceCriteria field has between 50-149 characters
- WHEN they click the "Post Gig" submit button
- THEN the form MUST submit normally
- AND the server action MUST accept the submission (no new validation errors)
- AND the gig MUST be created successfully

#### Scenario: Warning is accessible to screen readers
- GIVEN a CLIENT user with a screen reader is on the gig creation form
- WHEN the quality guidance warning appears or disappears
- THEN the warning element MUST have `aria-live="polite"` attribute
- AND the warning text MUST be announced by the screen reader
- AND the announcement MUST not interrupt the user's current action

**Acceptance Criteria:**
- New client component `AcceptanceCriteriaQualityWarning` created at `app/components/AcceptanceCriteriaQualityWarning.tsx`
- Component accepts props: `characterCount: number`, `hasInteracted: boolean`
- Component renders conditionally: `characterCount >= 50 && characterCount < 150 && hasInteracted`
- Warning styled with Tailwind classes: `bg-amber-50 border border-amber-300 text-amber-800 rounded-md p-3 mb-2`
- Warning includes `aria-live="polite"` and `role="status"` for accessibility
- Warning includes lightbulb emoji and specific guidance text
- Warning positioned between textarea and character counter in form layout
- Smooth fade transition using `transition-opacity duration-200`
- Form tracks `hasInteracted` state for acceptanceCriteria field (set to true on first onChange)
- No changes to server-side validation logic (50 char minimum still enforced)
- No changes to form submission behavior (warning does not block submission)
- Existing character counter remains functional and visible

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
- THEN the page MUST display: title, description, acceptance criteria, budget (₽), tags, status, and client email
- AND it MUST display an "Apply" form with a cover letter textarea and submit button
- AND if the specialist has already applied, the form MUST be replaced with "You have already applied" message

#### Scenario: Acceptance criteria displayed prominently
- GIVEN any authenticated user views a gig detail page
- WHEN the page renders
- THEN the acceptance criteria MUST be displayed:
  - In a visually distinct section (e.g., bordered box or card)
  - With heading "Definition of Done" or "Acceptance Criteria"
  - Positioned between description and budget/tags (high visibility)
  - Formatted with preserved whitespace (white-space: pre-wrap)

#### Scenario: Legacy gig without acceptance criteria
- GIVEN a gig created before this change (acceptanceCriteria is null)
- WHEN any user views the gig detail page
- THEN the acceptance criteria section MUST display "Not specified" or similar placeholder
- AND the section MUST still be visible (not hidden)

#### Scenario: Structured requirement fields displayed when present
- GIVEN a gig with non-empty goal, deliverables, and/or constraints
- WHEN any authenticated user views the gig detail page
- THEN the page MUST display an "Additional Requirements" section
- AND the section MUST be positioned after description, before or alongside "Definition of Done"
- AND each non-empty field MUST be displayed with:
  - Clear subsection heading (e.g., "🎯 Goal / Desired Outcome")
  - Content with preserved whitespace (`white-space: pre-wrap`)
- AND empty fields MUST be hidden (not shown as "Not specified")

#### Scenario: Structured fields hidden when all empty
- GIVEN a gig where goal, deliverables, and constraints are all empty strings
- WHEN any authenticated user views the gig detail page
- THEN the "Additional Requirements" section MUST NOT be displayed at all
- AND the page MUST render normally with existing fields only

#### Scenario: CLIENT views gig detail
- GIVEN an authenticated CLIENT user
- WHEN they navigate to `/dashboard/gigs/[id]`
- THEN the page MUST display the gig details (including acceptance criteria)
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
- Acceptance criteria section:
  - Heading: "Definition of Done" or "Acceptance Criteria"
  - Visually distinct (border, background, or card styling)
  - Positioned prominently (before or after description)
  - Handles null values gracefully (shows "Not specified")
  - Preserves whitespace with `white-space: pre-wrap`
- Structured requirement fields section:
  - "Additional Requirements" heading
  - Only renders if at least one field (goal, deliverables, constraints) has content
  - Individual subsections for each non-empty field with clear headings
  - Each subsection preserves whitespace with `white-space: pre-wrap`
  - Positioned after description, before or alongside "Definition of Done"
  - Empty fields are hidden (no "Not specified" placeholders)
  - Visible to all roles (no role-based hiding)
- SPECIALIST sees apply form (or "already applied" message)
- CLIENT who owns the gig sees applications list
- OPEN gigs: PENDING applications show Accept/Reject buttons via `ApplicationActions` client component
- IN_PROGRESS gigs: applications show status badges, assigned specialist email displayed
- `ApplicationActions` uses `useActionState` with `acceptApplication` / `rejectApplication`
- `ApplicationActions` uses `useFormStatus` for pending states ("Accepting..." / "Rejecting...")
- Each button submits a form with hidden `applicationId` field
- Inline error display from action state
- SPECIALIST sees apply form (or "already applied" message)
- CLIENT who owns the gig sees applications list
- OPEN gigs: PENDING applications show Accept/Reject buttons via `ApplicationActions` client component
- IN_PROGRESS gigs: applications show status badges, assigned specialist email displayed
- `ApplicationActions` uses `useActionState` with `acceptApplication` / `rejectApplication`
- `ApplicationActions` uses `useFormStatus` for pending states ("Accepting..." / "Rejecting...")
- Each button submits a form with hidden `applicationId` field
- Inline error display from action state

---

### Requirement: Profile View Page
The system MUST provide a profile view page at `/dashboard/profile` showing the authenticated user's profile from their respective profile table.

#### Scenario: SPECIALIST views own profile
- GIVEN an authenticated user with role "SPECIALIST"
- WHEN they navigate to `/dashboard/profile`
- THEN the page MUST query the user with `include: { specialistProfile: true }`
- AND if `specialistProfile` is null, display "Profile not set up yet" with a link to edit
- AND if `specialistProfile` exists, display all profile fields

#### Scenario: CLIENT views own profile
- GIVEN an authenticated user with role "CLIENT"
- WHEN they navigate to `/dashboard/profile`
- THEN the page MUST query the user with `include: { clientProfile: true }`
- AND if `clientProfile` is null, display "Profile not set up yet" with a link to edit
- AND if `clientProfile` exists, display all profile fields

**Acceptance Criteria:**
- `app/dashboard/profile/page.tsx` exists as a server component
- Handles null profile gracefully
- Displays "Not set" for empty string fields
- Hourly rate displayed in roubles (converted from kopecks)

---

### Requirement: Profile Edit Page
The system MUST provide a profile edit page at `/dashboard/profile/edit` with a form to update profile fields.

#### Scenario: Form shows role-specific fields
- GIVEN an authenticated user
- WHEN they navigate to `/dashboard/profile/edit`
- THEN the form MUST show fields appropriate for their role
- AND SPECIALIST sees: displayName, techStack, experienceLevel, bio
- AND CLIENT sees: companyName, inn, kpp, contactPerson, phoneNumber

#### Scenario: Form pre-fills existing data
- GIVEN a user with existing profile data
- WHEN they navigate to `/dashboard/profile/edit`
- THEN all form fields MUST be pre-filled with current values

**Acceptance Criteria:**
- `app/dashboard/profile/edit/page.tsx` exists
- Uses `useActionState` with `updateProfile` action
- Uses `useFormStatus` for pending state
- CLIENT form marks companyName and inn as required

---

### Requirement: Public Profile View Page
The system MUST provide a public profile view page at `/dashboard/profile/[userId]` showing another user's profile (read-only).

#### Scenario: View SPECIALIST public profile
- GIVEN an authenticated user
- WHEN they navigate to `/dashboard/profile/[userId]` for a SPECIALIST
- THEN the page MUST display public profile information
- AND MUST NOT show the user's email address

#### Scenario: View own profile via public URL
- GIVEN an authenticated user
- WHEN they navigate to `/dashboard/profile/[userId]` where userId matches their own
- THEN they MUST be redirected to `/dashboard/profile`

**Acceptance Criteria:**
- `app/dashboard/profile/[userId]/page.tsx` exists as a server component
- Hides sensitive fields (email, INN, KPP, phone for CLIENT)
- Redirects own profile to `/dashboard/profile`
- Handles null profiles gracefully

---

### Requirement: Dashboard Profile Integration
The dashboard MUST show profile completion hints and provide access to profile pages.

#### Scenario: CLIENT dashboard shows profile completion hint
- GIVEN a user with role "CLIENT" is logged in
- AND the user has incomplete profile (missing companyName or inn)
- WHEN they visit `/dashboard`
- THEN the page MUST display a notice to complete their profile

#### Scenario: SPECIALIST dashboard shows profile completion hint
- GIVEN a user with role "SPECIALIST" is logged in
- AND the user has incomplete profile (missing techStack or experienceLevel)
- WHEN they visit `/dashboard`
- THEN the page MUST display a notice to complete their profile

#### Scenario: Dashboard shows profile link
- GIVEN an authenticated user (any role)
- WHEN they visit `/dashboard`
- THEN the page MUST display a "My Profile" link to `/dashboard/profile`

**Acceptance Criteria:**
- Dashboard queries user with appropriate profile relation
- Shows profile completion notice if key fields are missing
- Includes "My Profile" link in dashboard navigation

---

### Requirement: Payment Status Display on Gig Detail Page
The gig detail page MUST display payment status and provide payment actions for eligible users.

#### Scenario: CLIENT owner views COMPLETED gig
- GIVEN an authenticated CLIENT user who owns a gig
- AND the gig status is "COMPLETED"
- WHEN they navigate to `/dashboard/gigs/[id]`
- THEN the page MUST display a "Mark as Paid" button
- AND the button MUST be in a form that submits to `markAsPaid` action
- AND the page MUST show status badge "Completed - Awaiting Payment"

#### Scenario: CLIENT owner views PAID gig
- GIVEN an authenticated CLIENT user who owns a gig
- AND the gig status is "PAID"
- WHEN they navigate to `/dashboard/gigs/[id]`
- THEN the page MUST display status badge "Paid"
- AND the page MUST display the payment date (formatted from paidAt)
- AND the page MUST NOT show the "Mark as Paid" button

#### Scenario: SPECIALIST views COMPLETED gig (assigned to them)
- GIVEN an authenticated SPECIALIST user who is the assigned specialist
- AND the gig status is "COMPLETED"
- WHEN they navigate to `/dashboard/gigs/[id]`
- THEN the page MUST display status badge "Completed - Awaiting Payment"
- AND the page MUST NOT show the "Mark as Paid" button (not the owner)

#### Scenario: SPECIALIST views PAID gig (assigned to them)
- GIVEN an authenticated SPECIALIST user who is the assigned specialist
- AND the gig status is "PAID"
- WHEN they navigate to `/dashboard/gigs/[id]`
- THEN the page MUST display status badge "Paid"
- AND the page MUST display the payment date
- AND the page MUST show a message like "Payment confirmed on [date]"

#### Scenario: Mark as Paid button shows loading state
- GIVEN a CLIENT owner clicks "Mark as Paid"
- WHEN the server action is processing
- THEN the submit button MUST show "Marking as Paid..." text
- AND the button MUST be disabled

#### Scenario: Mark as Paid form shows error
- GIVEN a CLIENT submits the mark as paid form and the server action returns an error
- WHEN the error is returned
- THEN the error message MUST be displayed inline near the button

**Acceptance Criteria:**
- Gig detail page queries gig with paidAt field
- Status badge shows "Paid" for PAID gigs, "Completed - Awaiting Payment" for COMPLETED gigs
- "Mark as Paid" button only visible to CLIENT owner on COMPLETED gigs
- Payment date formatted as locale date string (e.g., "February 16, 2026")
- Uses client component `MarkAsPaidButton` with `useActionState` and `useFormStatus`
- Form includes hidden `gigId` field
- Inline error display from action state

---

### Requirement: Payment Status on Dashboards
The dashboard MUST display payment status for gigs in the user's lists.

#### Scenario: CLIENT dashboard shows payment status
- GIVEN a user with role "CLIENT" is logged in
- WHEN they visit `/dashboard`
- THEN each gig in "My Gigs" MUST show its status
- AND COMPLETED gigs MUST show "Awaiting Payment"
- AND PAID gigs MUST show "Paid on [date]"

#### Scenario: SPECIALIST dashboard shows payment status
- GIVEN a user with role "SPECIALIST" is logged in
- WHEN they visit `/dashboard`
- THEN each application in "My Applications" MUST show the gig status
- AND if the gig is PAID, it MUST show "Paid on [date]"
- AND if the gig is COMPLETED, it MUST show "Completed - Awaiting Payment"

**Acceptance Criteria:**
- Dashboard queries gigs/applications with paidAt field included
- Status display logic handles PAID status
- Payment dates formatted consistently (locale date string)
- PAID gigs visually distinguished (e.g., green badge or checkmark icon)

---

### Requirement: Message Display on Gig Detail Page
The gig detail page MUST display messages in chronological order when the user is authorized to view them.

#### Scenario: CLIENT owner views gig with messages
- GIVEN an authenticated user with role "CLIENT"
- AND the user is the gig owner (userId === gig.clientId)
- AND the gig has an assigned specialist (assignedSpecialistId is not null)
- AND the gig has at least one message
- WHEN they navigate to `/dashboard/gigs/[id]`
- THEN the page MUST display a "Messages" section
- AND messages MUST be displayed in chronological order (oldest first, ordered by createdAt ASC)
- AND each message MUST show:
  - Sender name (email or specialistProfile.displayName / clientProfile.companyName if available)
  - Message content (plain text)
  - Timestamp (formatted as locale date/time string)
- AND the page MUST display a message composition form below the message list

#### Scenario: Assigned SPECIALIST views gig with messages
- GIVEN an authenticated user with role "SPECIALIST"
- AND the user is the assigned specialist (userId === gig.assignedSpecialistId)
- AND the gig has at least one message
- WHEN they navigate to `/dashboard/gigs/[id]`
- THEN the page MUST display a "Messages" section
- AND messages MUST be displayed in chronological order (oldest first)
- AND each message MUST show sender name, content, and timestamp
- AND the page MUST display a message composition form below the message list

#### Scenario: Non-assigned SPECIALIST views gig
- GIVEN an authenticated user with role "SPECIALIST"
- AND the user is NOT the assigned specialist (applied but was rejected)
- WHEN they navigate to `/dashboard/gigs/[id]`
- THEN the page MUST NOT display the "Messages" section
- AND the page MUST NOT display the message composition form

#### Scenario: Gig with no assigned specialist
- GIVEN a gig with status "OPEN" (no assigned specialist)
- WHEN an authorized user views the gig detail page
- THEN the page MUST NOT display the "Messages" section
- AND the page MUST NOT display the message composition form

#### Scenario: Gig with assigned specialist but no messages yet
- GIVEN a gig with an assigned specialist
- AND the gig has zero messages
- WHEN an authorized user views the gig detail page
- THEN the page MUST display a "Messages" section
- AND it MUST show "No messages yet. Start the conversation below."
- AND the page MUST display the message composition form

#### Scenario: Message sender identification
- GIVEN a message sent by a CLIENT user
- WHEN the message is displayed
- THEN the sender name MUST be the client's email
- AND if clientProfile.companyName exists, it MUST be displayed instead of or alongside email

#### Scenario: Message sender identification for SPECIALIST
- GIVEN a message sent by a SPECIALIST user
- WHEN the message is displayed
- THEN the sender name MUST be the specialist's email
- AND if specialistProfile.displayName exists, it MUST be displayed instead of email

#### Scenario: Message timestamp formatting
- GIVEN a message with createdAt timestamp
- WHEN the message is displayed
- THEN the timestamp MUST be formatted as a locale date/time string (e.g., "17.02.2026, 14:30")
- AND the timestamp MUST use 'ru-RU' locale for consistency with the rest of the app

**Acceptance Criteria:**
- Gig detail page queries messages with `include: { messages: { include: { sender: { include: { clientProfile: true, specialistProfile: true } } }, orderBy: { createdAt: 'asc' } } }`
- Messages section only visible when user is owner OR assigned specialist
- Messages section only visible when gig has assigned specialist
- Messages displayed in chronological order (oldest first)
- Each message shows sender name, content, and formatted timestamp
- Empty state message when no messages exist
- Message list uses simple `<ul>` or `<div>` rendering (no complex chat UI)

---

### Requirement: Message Composition Form
The gig detail page MUST provide a form for authorized users to send messages.

#### Scenario: Form renders for authorized users
- GIVEN an authenticated user who is the gig owner OR assigned specialist
- AND the gig has an assigned specialist
- WHEN they view the gig detail page
- THEN the page MUST display a message composition form with:
  - A textarea for message content (required, placeholder text)
  - A "Send Message" submit button
  - The form MUST be below the message list

#### Scenario: Form shows loading state
- GIVEN an authorized user submits the message form
- WHEN the server action is processing
- THEN the submit button MUST show "Sending..." text
- AND the button MUST be disabled
- AND the textarea MUST be disabled

#### Scenario: Form shows error
- GIVEN an authorized user submits invalid data (e.g., empty message)
- WHEN the server action returns an error
- THEN the error message MUST be displayed inline above the form
- AND the form MUST remain visible so the user can retry

#### Scenario: Form clears after successful send
- GIVEN an authorized user submits a valid message
- WHEN the server action succeeds
- THEN the textarea MUST be cleared (empty)
- AND the page MUST revalidate to show the new message in the list
- AND no error message MUST be displayed

#### Scenario: Form does not render for unauthorized users
- GIVEN an authenticated user who is NOT the gig owner AND NOT the assigned specialist
- WHEN they view the gig detail page
- THEN the message composition form MUST NOT be displayed

#### Scenario: Form does not render when no specialist assigned
- GIVEN a gig with status "OPEN" (no assigned specialist)
- WHEN any user views the gig detail page
- THEN the message composition form MUST NOT be displayed

**Acceptance Criteria:**
- Message form is a client component using `useActionState` with `sendMessage` action
- Uses `useFormStatus` for pending state on submit button
- Textarea has `name="content"`, `required`, `rows={3}`, and placeholder text
- Hidden input field for `gigId`
- Displays `state?.error` when present
- Form only renders when user is authorized (owner OR assigned specialist) AND gig has assigned specialist
- On successful send, form resets via `useEffect` or form.reset()
- All existing gig detail page functionality remains unchanged
- Messages section is positioned logically (after applications section)
- Page layout remains responsive and accessible

