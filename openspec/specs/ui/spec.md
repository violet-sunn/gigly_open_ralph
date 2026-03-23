# UI Specification

## Design Token System

All UI styling SHOULD use design tokens from `openspec/specs/ui/design-tokens.json` as the single source of truth. Tokens are automatically parsed and integrated into Tailwind CSS classes and CSS variables.

**Token Usage:**
- New components SHOULD use design tokens via Tailwind utility classes (e.g., `bg-surface-level-0`, `text-neutral-strong`)
- CSS variables are available for custom styles (e.g., `var(--bg-surface-level-0)`)
- Hardcoded color/typography values should be avoided unless appropriate tokens don't exist

**Token Regeneration:**
When design-tokens.json is updated, run `node scripts/parse-design-tokens.js` to regenerate Tailwind config and CSS variables.

**Documentation:**
See `docs/DESIGN_SYSTEM.md` for detailed token naming conventions, usage examples, and migration guidance.

---

## Requirements

### Requirement: Navigation Header Token-Based Styling
The main navigation header MUST use design tokens for all color and spacing values to ensure consistency with the design system.

#### Scenario: Navigation header uses token-based background color
- GIVEN an authenticated user views any page with the MainNav component
- WHEN the navigation header renders
- THEN the header background MUST use `bg-surface-level-1` design token
- AND the header border MUST use `border-neutral-weak` design token
- AND the header MUST NOT use hardcoded color values like `bg-navy-800` or `border-gray-700`

#### Scenario: Navigation links maintain active and hover states
- GIVEN an authenticated user is on a specific page (e.g., /dashboard)
- WHEN the navigation header renders
- THEN the active navigation link MUST be visually highlighted
- AND the active link MUST use `border-blue-500` and `text-blue-500` for active state
- AND hovering over inactive links MUST show hover state with `hover:text-white` and `hover:bg-navy-700`
- AND all navigation link text MUST remain exactly as implemented (no text changes)

#### Scenario: Navigation header is responsive
- GIVEN an authenticated user views the navigation on a mobile device (320px width)
- WHEN the page renders
- THEN the navigation header MUST remain functional and accessible
- AND all navigation links MUST be clickable
- AND the layout MUST NOT cause horizontal scrolling
- AND the notification bell MUST remain visible and functional

**Acceptance Criteria:**
- MainNav component uses `bg-surface-level-1` for header background
- MainNav component uses `border-neutral-weak` for header border
- Active state styling uses `border-blue-500` and `text-blue-500`
- Hover states use `hover:text-white` and `hover:bg-navy-700`
- All navigation link text preserved exactly as-is
- Responsive behavior works on mobile (320px width)
- All existing E2E navigation tests pass without modification

---

### Requirement: Notification Bell Token-Based Styling
The notification bell component MUST use design tokens where appropriate while maintaining semantic color usage for badges.

#### Scenario: Notification badge uses semantic error color
- GIVEN an authenticated user (CLIENT or SPECIALIST) has unread notifications
- WHEN the notification bell renders in the navigation header
- THEN the unread count badge MUST display with `bg-error-500` background
- AND the badge MUST use `text-white` for the count text
- AND the badge MUST be positioned at the top-right of the bell icon
- AND the badge MUST be visually prominent and easily noticeable

#### Scenario: Notification bell maintains functionality
- GIVEN an authenticated user clicks the notification bell
- WHEN the dropdown opens
- THEN all notification functionality MUST work as before
- AND clicking outside the dropdown MUST close it
- AND clicking a notification item MUST navigate to the gig page
- AND the unread count MUST update correctly after viewing notifications

**Acceptance Criteria:**
- NotificationBell component uses `bg-error-500` for badge background (semantic color)
- Badge displays unread count correctly
- All notification bell functionality preserved
- Dropdown interactions work as before
- No functional regressions in notification system

---

### Requirement: Layout Container Token-Based Background
The protected layout container MUST use design tokens for background colors to ensure visual consistency across all pages.

#### Scenario: Protected layout uses token-based background
- GIVEN an authenticated user navigates to any protected page
- WHEN the layout renders
- THEN the page background MUST use `var(--bg-surface-level-0)` CSS variable
- AND the background color MUST be consistent across all protected pages
- AND the MainNav component MUST be wrapped in Suspense boundary
- AND the layout MUST provide proper fallback during loading

#### Scenario: Layout maintains responsive behavior
- GIVEN an authenticated user views a protected page on various devices
- WHEN the page renders at different viewport sizes (320px, 768px, 1024px, 1440px)
- THEN the layout MUST adapt appropriately
- AND the navigation header MUST remain sticky at the top
- AND page content MUST be properly contained with max-width constraints
- AND horizontal scrolling MUST NOT occur

**Acceptance Criteria:**
- Protected layout uses `var(--bg-surface-level-0)` for page background
- MainNav wrapped in Suspense with proper fallback
- Layout is responsive across all viewport sizes
- No horizontal scrolling on any viewport
- Consistent visual appearance across all protected pages

---

### Requirement: Homepage
The homepage at `/` MUST display the application name and adapt based on authentication state using token-based styling.

#### Scenario: Anonymous user visits homepage with token-based styling
- GIVEN no valid session cookie exists
- WHEN a user visits `/`
- THEN it MUST display the application name "Gigly"
- AND it MUST display a "Get Started" link to `/register`
- AND it MUST display a "Sign in" link to `/login`
- AND the page background MUST use `bg-surface-level-0`
- AND the "Get Started" button MUST use `bg-blue-500 hover:bg-blue-600 text-white`
- AND the "Sign in" link MUST use `text-blue-500 hover:text-blue-400`

#### Scenario: Authenticated user visits homepage with token-based styling
- GIVEN a user is logged in (valid session cookie)
- WHEN they visit `/`
- THEN it MUST display their email address
- AND it MUST display a logout button/form
- AND it MUST NOT show the "Get Started" CTA
- AND the "Go to Dashboard" button MUST use `bg-blue-500 hover:bg-blue-600 text-white`
- AND the "Sign out" button MUST use `text-blue-500 border border-blue-500 hover:bg-blue-500/10`
- AND the page background MUST use `bg-surface-level-0`

**Acceptance Criteria:**
- `app/page.tsx` calls `getSession()` to check auth state
- Authenticated: shows email + logout form with token-based button styling
- Anonymous: shows "Get Started" link + "Sign in" link with token-based styling
- Page background uses `bg-surface-level-0`
- Primary CTA uses `bg-blue-500 hover:bg-blue-600`
- Secondary actions use text link styling or outlined button styling

---

### Requirement: Registration Page Figma Design Implementation
The registration page MUST implement the exact visual specifications from the approved Figma design.

#### Scenario: Registration page uses AuthContainer with exact dimensions
- GIVEN a user views the registration page
- WHEN the page renders
- THEN the AuthContainer MUST be 418px wide on desktop
- AND the AuthContainer MUST be 90vw wide on mobile (viewport < 768px)
- AND the AuthContainer MUST have min-height of 540px
- AND the AuthContainer MUST have 25px border-radius
- AND the AuthContainer MUST have 40px padding on desktop
- AND the AuthContainer MUST have 20px padding on mobile

#### Scenario: Registration page displays LogoHeader with correct styling
- GIVEN a user views the registration page
- WHEN the LogoHeader renders
- THEN it MUST have rgba(49,54,67,0.5) background
- AND it MUST have 10px border-radius
- AND it MUST have 7px/9px padding
- AND the logo MUST be 29px height

#### Scenario: Registration page heading uses correct typography
- GIVEN a user views the registration page
- WHEN the heading renders
- THEN it MUST display "Регистрация" text
- AND it MUST use 22px font size
- AND it MUST use font-semibold weight (Manrope SemiBold or fallback)
- AND it MUST be white color
- AND it MUST be center-aligned

#### Scenario: Registration page input fields use exact styling
- GIVEN a user views the registration page
- WHEN input fields render
- THEN they MUST have #10121c background color
- AND they MUST have #242935 border color (1px solid)
- AND they MUST have 20px border-radius
- AND they MUST have 20px padding
- AND they MUST have white text color
- AND placeholder text MUST use neutral-weak token color
- AND focus state MUST show 2px #0088ff ring

#### Scenario: Registration page submit button uses exact styling
- GIVEN a user views the registration page
- WHEN the submit button renders
- THEN it MUST be 50px height
- AND it MUST have #0088FF background color
- AND it MUST display "Зарегестрироватся" text
- AND it MUST use 19px bold font
- AND it MUST have 10px border-radius
- AND it MUST have white text color

#### Scenario: Registration page secondary link uses exact styling
- GIVEN a user views the registration page
- WHEN the secondary link renders
- THEN it MUST be 50px height
- AND it MUST have rgba(0,136,255,0.24) background color
- AND it MUST display "Войти" text
- AND it MUST use 15px medium font
- AND it MUST have 10px border-radius
- AND it MUST link to `/login`

#### Scenario: Registration page displays decorative background pattern
- GIVEN a user views the registration page
- WHEN the page renders
- THEN a decorative pattern MUST be visible at the bottom of the page
- AND the pattern MUST be a checkerboard design
- AND the pattern MUST use #0088ff color at 0.3 opacity
- AND the pattern MUST be 327px height
- AND the pattern MUST span full width
- AND the pattern MUST be positioned absolutely at bottom
- AND the pattern MUST have z-index 0 (behind content)
- AND the pattern MUST have pointer-events-none

#### Scenario: Registration page role cards maintain visual consistency
- GIVEN a user views the registration page
- WHEN role cards render
- THEN they MUST have #10121c background
- AND they MUST have 20px border-radius
- AND they MUST have 20px padding
- AND they MUST have 24px gap between icon and text
- AND selected card MUST have 2px border with #0265dc color
- AND unselected card MUST have 2px transparent border
- AND there MUST be 17px gap between role cards

#### Scenario: Registration page layout uses correct spacing
- GIVEN a user views the registration page
- WHEN the page renders
- THEN there MUST be 47px gap between logo and content sections
- AND there MUST be 30px gap between heading and form
- AND there MUST be 21px gap between form elements
- AND there MUST be 17px gap between role cards
- AND there MUST be 21px gap between buttons

**Acceptance Criteria:**
- All dimensions match Figma specifications exactly
- All color values match Figma specifications exactly (#10121c, #242935, #0088FF, etc.)
- All spacing values match Figma specifications exactly (47px, 30px, 21px, 17px, etc.)
- Typography matches Figma specifications (22px heading, 19px button, 15px link)
- Decorative pattern renders correctly at bottom with checkerboard design
- Responsive design adapts container width and padding for mobile viewports
- Visual comparison with Figma shows exact match
- All components use existing auth components (AuthContainer, LogoHeader, RoleCard, AuthButton)

---

### Requirement: Registration Form with Role Selection
The registration form MUST provide visible feedback after submission and include a role selector using token-based styling consistent with Dashboard patterns.

#### Scenario: Registration page renders with token-based styling
- GIVEN a user navigates to `/register`
- WHEN the page loads
- THEN the form container MUST use `bg-surface-level-1 border border-neutral-weak rounded-lg shadow-md`
- AND the form container MUST use `p-8` (32px) padding
- AND form fields MUST use `space-y-6` (24px) vertical spacing
- AND the page background MUST use `bg-surface-level-0`

#### Scenario: Role selector renders with token-based styling
- GIVEN a user navigates to `/register`
- WHEN the page loads
- THEN it MUST display two selectable options: "Client" and "Specialist"
- AND no role MUST be pre-selected (user must actively choose)
- AND each role option MUST use `border border-gray-600 rounded-md`
- AND selected role MUST use `peer-checked:border-blue-500 peer-checked:bg-blue-500/10 peer-checked:text-blue-500`
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

#### Scenario: Failed registration (missing fields)
- GIVEN a user submits with empty email or password
- WHEN the form is submitted
- THEN HTML5 validation MUST prevent submission (existing `required` attributes)

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
- Page background uses `bg-surface-level-0`
- On success: user is redirected to `/dashboard` with session set
- On error: an error message is displayed inline on the registration page
- A loading/pending indicator is shown while the form submits
- Registration page includes a `<Link href="/login">` ("Already have an account? Sign in")
- Role selector values (CLIENT, SPECIALIST) preserved exactly
- All form field names preserved exactly

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
- AND the page background MUST use `bg-surface-level-0`

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
- Page background uses `bg-surface-level-0`
- Includes a `<Link>` to `/register`
- Displays `state?.error` when present

---

### Requirement: Role-Based Dashboard
The dashboard MUST render different content based on the user's role.

#### Scenario: Client visits dashboard
- GIVEN a user with role "CLIENT" is logged in
- WHEN they visit `/dashboard`
- THEN the page MUST display "Client Dashboard" heading
- AND it MUST show a "Post a Gig" link to `/gigs/new`
- AND it MUST show a "My Gigs" section listing the user's gigs with title, budget (₽), status, and date
- AND each gig in "My Gigs" MUST be a clickable link to `/gigs/{gig.id}`
- AND IN_PROGRESS gigs MUST show the assigned specialist's email
- AND if no gigs exist, it MUST show "No gigs posted yet."
- AND it MUST display a "Sign out" button

#### Scenario: Client clicks a gig in "My Gigs"
- GIVEN a CLIENT user is on `/dashboard`
- AND the "My Gigs" section lists at least one gig
- WHEN the client clicks on a gig item
- THEN the browser MUST navigate to `/gigs/{gig.id}`

#### Scenario: Gig list item shows clickable affordance
- GIVEN a CLIENT user is on `/dashboard`
- AND the "My Gigs" section lists at least one gig
- WHEN the user hovers over a gig item
- THEN the item MUST visually indicate it is clickable (e.g., background color change or cursor pointer)

#### Scenario: Specialist visits dashboard
- GIVEN a user with role "SPECIALIST" is logged in
- WHEN they visit `/dashboard`
- THEN the page MUST display "Specialist Dashboard" heading
- AND it MUST show a "Browse Gigs" link to `/gigs`
- AND it MUST show a "My Profile" link to `/profile`
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
- AND each gig MUST be wrapped in a `<Link href="/gigs/{gig.id}">`
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
- AND each application MUST be wrapped in a `<Link href="/gigs/{app.gigId}">`
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
- AND each item MUST be wrapped in a `<Link href="/gigs/{id}">`
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
- "Post a Gig" is a `<Link>` to `/gigs/new`
- Each gig in "My Gigs" MUST be wrapped in a `<Link href="/gigs/{gig.id}">` with `block` class and `hover:bg-gray-50` for visual feedback
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
- "Browse Gigs" is a `<Link>` to `/gigs`
- Profile completion hints remain visible above tabs
- Dashboard page background uses token-based color from layout (see Layout Container Token-Based Background requirement)
- Navigation header uses token-based styling (see Navigation Header Token-Based Styling requirement)
- All dashboard functionality remains unchanged
- Token migration does not affect dashboard behavior or data display
- "My Profile" link remains accessible

---

### Requirement: Dashboard Sidebar Messages Section
The dashboard sidebar MUST display recent messages from gigs where the user is involved, replacing the current placeholder.

#### Scenario: Messages section displays last message per gig
- GIVEN an authenticated user (CLIENT or SPECIALIST) with messages on multiple gigs they're involved in
- WHEN they view the dashboard page
- THEN the "СООБЩЕНИЯ" (Messages) section in the sidebar MUST display the most recent message from each distinct gig
- AND each message item MUST show:
  - Gig title
  - Sender name (display name or email)
  - Message preview (first 50 characters with ellipsis if truncated)
  - Relative timestamp (e.g., "2 hours ago", "3 days ago")
- AND gigs MUST be sorted by most recent message timestamp (gigs with newest activity first)
- AND the section MUST be scrollable to show all gigs with messages (no hard limit)
- AND only ONE message per gig MUST be displayed (the most recent one)

#### Scenario: Message items are clickable and navigate to messages section
- GIVEN the messages section displays message items from multiple gigs
- WHEN the user clicks on a message item
- THEN the browser MUST navigate to `/gigs/[gigId]#messages` for that message's gig
- AND the page MUST automatically scroll to the messages section
- AND the navigation MUST preserve the current context
- AND the gig title MUST be clearly visible in the message item to provide context

#### Scenario: Empty state when no messages
- GIVEN an authenticated user with no messages on any gigs
- WHEN they view the dashboard
- THEN the messages section MUST display "No recent messages"
- AND the section MUST show a friendly icon or illustration

#### Scenario: Messages only from involved gigs
- GIVEN an authenticated CLIENT user
- WHEN the messages section queries for messages
- THEN it MUST only include messages from gigs where the user is the owner
- AND it MUST only include gigs with an assigned specialist (messages are only available after assignment)

#### Scenario: Messages only from involved gigs (SPECIALIST)
- GIVEN an authenticated SPECIALIST user
- WHEN the messages section queries for messages
- THEN it MUST only include messages from gigs where the user is the assigned specialist

#### Scenario: Performance optimization
- GIVEN the dashboard page loads
- WHEN the messages section queries the database
- THEN the query MUST use proper indexes (gigId, createdAt)
- AND the query MUST fetch only the most recent message per gig (not all messages)
- AND the query MUST include only necessary fields (no full gig data)
- AND the query execution time MUST be < 200ms even with many gigs

**Acceptance Criteria:**
- New server action `getRecentMessages` created in `app/actions/message.ts`
- Server action returns array of objects with: `{ gigId, gigTitle, senderName, contentPreview, createdAt }`
- Each object represents the most recent message from a distinct gig
- Query fetches all gigs where user is involved (owner or assigned specialist)
- For each gig, only the most recent message is included
- Results sorted by message timestamp (most recent first)
- Dashboard page calls `getRecentMessages` and passes data to Messages card component
- Messages card component displays list of clickable message items
- Each message item shows: gig title (bold), sender name, content preview, relative timestamp
- Each message item links to `/gigs/[gigId]#messages` (with hash fragment for auto-scroll)
- Gig detail page messages section has `id="messages"` attribute for hash navigation
- Empty state displays when no messages
- Messages section uses `max-h-80 overflow-y-auto` for scrolling (no hard limit on number of gigs)
- Query uses Prisma with proper relations and ordering
- Query includes sender relation with `select` for name fields only
- All existing dashboard functionality remains intact

---

### Requirement: Gig Creation Form
The system MUST provide a form at `/gigs/new` for CLIENT users to create gigs.

#### Scenario: Form renders for CLIENT user
- GIVEN an authenticated user with role "CLIENT"
- WHEN they navigate to `/gigs/new`
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
- WHEN they navigate to `/gigs/new`
- THEN they MUST be redirected to `/dashboard`

#### Scenario: Unauthenticated user visits gig creation page
- GIVEN no valid session
- WHEN a user navigates to `/gigs/new`
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
- `app/gigs/new/page.tsx` exists
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
- GIVEN an authenticated CLIENT user navigates to `/gigs/new`
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
  - Link to example gigs: "💡 View example gigs for inspiration" (right-aligned in section header, opens /gigs in new tab)
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
- GIVEN a CLIENT user is on the gig creation form at `/gigs/new`
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
- GIVEN a CLIENT user navigates to `/gigs/new`
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
The system MUST provide a page at `/gigs` listing all OPEN gigs for browsing.

#### Scenario: Specialist browses gigs
- GIVEN an authenticated user with role "SPECIALIST"
- WHEN they navigate to `/gigs`
- THEN the page MUST display a list of all gigs with status "OPEN"
- AND each gig MUST show: title, budget (formatted in ₽), tags, and creation date
- AND each gig MUST link to `/gigs/[id]`

#### Scenario: No open gigs available
- GIVEN no gigs with status "OPEN" exist
- WHEN a SPECIALIST visits `/gigs`
- THEN the page MUST display "No open gigs available."

#### Scenario: CLIENT visits browse page
- GIVEN an authenticated user with role "CLIENT"
- WHEN they navigate to `/gigs`
- THEN the page MUST also display the gig list (read-only, no apply action)

#### Scenario: Unauthenticated user visits browse page
- GIVEN no valid session
- WHEN a user navigates to `/gigs`
- THEN they MUST be redirected to `/login` (handled by existing middleware)

**Acceptance Criteria:**
- `app/gigs/page.tsx` exists as a server component
- Queries `prisma.gig.findMany({ where: { status: 'OPEN' } })`
- Each gig links to its detail page
- Accessible to both CLIENT and SPECIALIST roles

---

### Requirement: Gig Detail Page
The system MUST provide a page at `/gigs/[id]` showing full gig details.

#### Scenario: Specialist views gig detail
- GIVEN an authenticated SPECIALIST user
- WHEN they navigate to `/gigs/[id]` for an existing gig
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
- WHEN they navigate to `/gigs/[id]`
- THEN the page MUST display the gig details (including acceptance criteria)
- AND it MUST NOT show the apply form
- AND if the CLIENT owns the gig, it MUST show the list of applications with specialist email, cover letter, status, and date
- AND if the gig is OPEN, each PENDING application MUST show "Accept" and "Reject" buttons
- AND if the gig is IN_PROGRESS, applications MUST show status badges ("Accepted" / "Rejected") instead of buttons
- AND if the gig is IN_PROGRESS, the assigned specialist's email MUST be shown prominently

#### Scenario: Gig not found
- GIVEN a non-existent gig ID
- WHEN a user navigates to `/gigs/[id]`
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
- `app/gigs/[id]/page.tsx` exists as a server component
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
The system MUST provide a profile view page at `/profile` showing the authenticated user's profile from their respective profile table.

#### Scenario: SPECIALIST views own profile
- GIVEN an authenticated user with role "SPECIALIST"
- WHEN they navigate to `/profile`
- THEN the page MUST query the user with `include: { specialistProfile: true }`
- AND if `specialistProfile` is null, display "Profile not set up yet" with a link to edit
- AND if `specialistProfile` exists, display all profile fields

#### Scenario: CLIENT views own profile
- GIVEN an authenticated user with role "CLIENT"
- WHEN they navigate to `/profile`
- THEN the page MUST query the user with `include: { clientProfile: true }`
- AND if `clientProfile` is null, display "Profile not set up yet" with a link to edit
- AND if `clientProfile` exists, display all profile fields

**Acceptance Criteria:**
- `app/profile/page.tsx` exists as a server component
- Handles null profile gracefully
- Displays "Not set" for empty string fields
- Hourly rate displayed in roubles (converted from kopecks)

---

### Requirement: Profile Edit Page Layout Consistency
The profile edit page MUST match the visual layout and structure of the profile view page to provide a consistent user experience.

#### Scenario: Edit page uses same header card structure
- GIVEN an authenticated user navigates to `/profile/edit`
- WHEN the page renders
- THEN the page MUST display a header card at the top
- AND the header card MUST include:
  - Avatar circle with user initial (read-only, same as profile view)
  - User name or email
  - Role label (e.g., "Specialist" or "Client")
- AND the header card MUST use the same styling as profile view: `bg-navy-800 border border-gray-700 rounded-lg p-6 shadow-md`

#### Scenario: Edit form uses 2-column grid layout
- GIVEN an authenticated SPECIALIST user on `/profile/edit`
- WHEN the page renders below the header card
- THEN the form MUST use a 2-column grid layout: `grid grid-cols-1 lg:grid-cols-2 gap-6`
- AND the left column MUST contain: Display Name, Tech Stack, Experience Level fields
- AND the right column MUST contain: Bio field (full height textarea)
- AND both columns MUST use card styling: `bg-navy-800 border border-gray-700 rounded-lg p-6 shadow-md`

#### Scenario: Edit form uses 2-column grid layout (CLIENT)
- GIVEN an authenticated CLIENT user on `/profile/edit`
- WHEN the page renders below the header card
- THEN the form MUST use a 2-column grid layout: `grid grid-cols-1 lg:grid-cols-2 gap-6`
- AND the left column MUST contain: Company Name, INN, KPP fields
- AND the right column MUST contain: Contact Person, Phone Number fields
- AND both columns MUST use card styling: `bg-navy-800 border border-gray-700 rounded-lg p-6 shadow-md`

#### Scenario: Form fields maintain existing validation
- GIVEN a user fills out the profile edit form
- WHEN they submit the form
- THEN all existing validation rules MUST still apply
- AND required fields MUST still be enforced (companyName, inn for CLIENT; no required fields for SPECIALIST)
- AND the `updateProfile` server action MUST remain unchanged
- AND error messages MUST display in the same manner

#### Scenario: Form pre-fills existing data
- GIVEN a user with existing profile data
- WHEN they navigate to `/profile/edit`
- THEN all form fields MUST be pre-filled with current values

#### Scenario: Save and Cancel buttons positioned consistently
- GIVEN a user is on the profile edit page
- WHEN they view the form
- THEN the Save and Cancel buttons MUST be positioned at the bottom of the form
- AND the buttons MUST be outside the grid columns (full width row)
- AND the Save button MUST use primary styling: `bg-blue-500 hover:bg-blue-600`
- AND the Cancel button MUST link to `/profile`

#### Scenario: Responsive behavior on mobile
- GIVEN a user views the profile edit page on a mobile device (< 1024px width)
- WHEN the page renders
- THEN the 2-column grid MUST stack vertically (single column)
- AND the header card MUST remain at the top
- AND all form fields MUST remain fully functional
- AND the layout MUST match the profile view page's mobile behavior

#### Scenario: Visual consistency with profile view
- GIVEN a user navigates between `/profile` and `/profile/edit`
- WHEN they compare the two pages
- THEN the header card structure MUST be visually identical (avatar, name, role)
- AND the card styling MUST be identical (colors, borders, shadows, spacing)
- AND the overall page layout MUST feel like the same design system
- AND the transition between view and edit MUST feel smooth and natural

**Acceptance Criteria:**
- Profile edit page uses `max-w-7xl mx-auto px-4` container (same as profile view)
- Header card component created or inline implementation with avatar, name, role
- Form uses 2-column grid layout with proper responsive breakpoints
- Left and right columns wrapped in card containers with consistent styling
- All existing form fields preserved with same names and validation
- Save/Cancel buttons positioned below grid in full-width row
- Mobile layout stacks columns vertically
- No changes to `updateProfile` server action
- All existing profile edit tests continue to pass
- Visual regression testing confirms consistency with profile view page
- `app/profile/edit/page.tsx` exists
- Uses `useActionState` with `updateProfile` action
- Uses `useFormStatus` for pending state
- CLIENT form marks companyName and inn as required

---

### Requirement: Public Profile View Page
The system MUST provide a public profile view page at `/profile/[userId]` showing another user's profile (read-only).

#### Scenario: View SPECIALIST public profile
- GIVEN an authenticated user
- WHEN they navigate to `/profile/[userId]` for a SPECIALIST
- THEN the page MUST display public profile information
- AND MUST NOT show the user's email address

#### Scenario: View own profile via public URL
- GIVEN an authenticated user
- WHEN they navigate to `/profile/[userId]` where userId matches their own
- THEN they MUST be redirected to `/profile`

**Acceptance Criteria:**
- `app/profile/[userId]/page.tsx` exists as a server component
- Hides sensitive fields (email, INN, KPP, phone for CLIENT)
- Redirects own profile to `/profile`
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
- THEN the page MUST display a "My Profile" link to `/profile`

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
- WHEN they navigate to `/gigs/[id]`
- THEN the page MUST display a "Mark as Paid" button
- AND the button MUST be in a form that submits to `markAsPaid` action
- AND the page MUST show status badge "Completed - Awaiting Payment"

#### Scenario: CLIENT owner views PAID gig
- GIVEN an authenticated CLIENT user who owns a gig
- AND the gig status is "PAID"
- WHEN they navigate to `/gigs/[id]`
- THEN the page MUST display status badge "Paid"
- AND the page MUST display the payment date (formatted from paidAt)
- AND the page MUST NOT show the "Mark as Paid" button

#### Scenario: SPECIALIST views COMPLETED gig (assigned to them)
- GIVEN an authenticated SPECIALIST user who is the assigned specialist
- AND the gig status is "COMPLETED"
- WHEN they navigate to `/gigs/[id]`
- THEN the page MUST display status badge "Completed - Awaiting Payment"
- AND the page MUST NOT show the "Mark as Paid" button (not the owner)

#### Scenario: SPECIALIST views PAID gig (assigned to them)
- GIVEN an authenticated SPECIALIST user who is the assigned specialist
- AND the gig status is "PAID"
- WHEN they navigate to `/gigs/[id]`
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
- WHEN they navigate to `/gigs/[id]`
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
- WHEN they navigate to `/gigs/[id]`
- THEN the page MUST display a "Messages" section
- AND messages MUST be displayed in chronological order (oldest first)
- AND each message MUST show sender name, content, and timestamp
- AND the page MUST display a message composition form below the message list

#### Scenario: Non-assigned SPECIALIST views gig
- GIVEN an authenticated user with role "SPECIALIST"
- AND the user is NOT the assigned specialist (applied but was rejected)
- WHEN they navigate to `/gigs/[id]`
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


---

### Requirement: Notification Bell in Navigation
The system MUST display a notification bell icon in the navigation header that shows unread message count and opens a dropdown.

#### Scenario: Bell icon renders in navigation
- GIVEN an authenticated user (CLIENT or SPECIALIST)
- WHEN they view any page with the navigation header
- THEN the navigation MUST display a bell icon
- AND the bell icon MUST be positioned in the top-right area of the navigation
- AND the bell icon MUST be clickable

#### Scenario: Bell shows unread count badge
- GIVEN an authenticated user with unread messages on 3 gigs
- WHEN they view the navigation
- THEN the bell icon MUST display a badge with the number "3"
- AND the badge MUST be visually prominent (red background, white text)
- AND the badge MUST be positioned at the top-right of the bell icon

#### Scenario: Bell shows no badge when no unread messages
- GIVEN an authenticated user with zero unread messages
- WHEN they view the navigation
- THEN the bell icon MUST be displayed
- AND the bell icon MUST NOT display a badge

#### Scenario: Clicking bell opens dropdown
- GIVEN an authenticated user
- WHEN they click the bell icon
- THEN a dropdown menu MUST appear below the bell icon
- AND the dropdown MUST overlay other page content

#### Scenario: Clicking outside dropdown closes it
- GIVEN the notification dropdown is open
- WHEN the user clicks anywhere outside the dropdown
- THEN the dropdown MUST close

**Acceptance Criteria:**
- Bell icon component is a client component (uses useState for dropdown open/close)
- Bell icon is visible on all authenticated pages for CLIENT and SPECIALIST users
- Badge displays unread count when > 0
- Badge is hidden when count = 0
- Dropdown opens/closes on bell click
- Dropdown closes on outside click (useEffect with click listener)
- Bell icon is accessible (keyboard navigation, ARIA labels)

---

### Requirement: Notification Dropdown Content
The notification dropdown MUST display a list of gigs with unread messages and allow navigation to those gigs.

#### Scenario: Dropdown shows list of gigs with unread messages
- GIVEN an authenticated user with unread messages on 3 gigs
- WHEN they open the notification dropdown
- THEN the dropdown MUST display a list of 3 notification items
- AND each item MUST show gig title, sender name, and relative time

#### Scenario: Dropdown shows empty state
- GIVEN an authenticated user with zero unread messages
- WHEN they open the notification dropdown
- THEN the dropdown MUST display "No new messages"
- AND the dropdown MUST show a friendly icon

#### Scenario: Clicking notification navigates to gig
- GIVEN the notification dropdown is open
- WHEN the user clicks on a notification item
- THEN the browser MUST navigate to `/gigs/[gigId]`
- AND the dropdown MUST close
- AND the notification MUST be marked as read (handled by gig page load)

#### Scenario: Dropdown shows most recent notifications first
- GIVEN an authenticated user with unread messages on multiple gigs
- WHEN they open the notification dropdown
- THEN notifications MUST be sorted by most recent message first

**Acceptance Criteria:**
- Dropdown component fetches notifications via server action
- Dropdown displays list of gigs with unread messages
- Each notification item is clickable and navigates to gig detail page
- Empty state displays when no unread messages
- Notifications sorted by most recent message first
- Loading state displays while fetching
- Error state displays on fetch failure
- Dropdown is accessible (keyboard navigation, ARIA roles)

---

### Requirement: Mark Notifications as Read on Gig Visit
The gig detail page MUST automatically mark notifications as read when the user visits the page.

#### Scenario: Visiting gig marks notification as read
- GIVEN an authenticated user with unread messages on a gig
- WHEN they navigate to the gig detail page
- THEN the Notification record for this user-gig pair MUST be updated
- AND `lastReadAt` MUST be set to the current timestamp
- AND the unread count badge MUST decrease by 1 (on next page load)

#### Scenario: Mark as read only for authorized users
- GIVEN a user who is NOT the gig owner or assigned specialist
- WHEN they navigate to the gig detail page
- THEN no Notification record MUST be created or updated

**Acceptance Criteria:**
- Gig detail page calls `markNotificationAsRead` server action on page load
- Server action only executes for authorized users (gig owner or assigned specialist)
- Server action uses upsert operation (create if not exists, update if exists)
- Mark as read operation is fast (< 50ms)


---

### Requirement: Gig Browse Page Card Hierarchy
The gig browse page MUST use design tokens to establish visual hierarchy through surface levels, creating depth and organization.

#### Scenario: Gig cards use token-based hierarchy
- GIVEN a SPECIALIST user views `/dashboard/gigs`
- WHEN the page renders with gig cards
- THEN each gig card MUST use `bg-surface-level-1` background token
- AND on hover, cards MUST use `bg-surface-level-2` for visual feedback
- AND borders MUST use `border-neutral-weak` token for subtle separation
- AND hover borders MUST use `border-neutral-strong` for emphasis
- AND the page background MUST remain `bg-surface-level-0` (from layout)

#### Scenario: Filter panel uses sidebar pattern
- GIVEN a SPECIALIST user views the gig browse page
- WHEN the filter panel renders
- THEN the filter panel container MUST use `bg-white` background (light theme for contrast)
- AND filter inputs MUST use `border-gray-300` with `focus:ring-blue-500`
- AND the "Apply Filters" button MUST use `bg-blue-600 hover:bg-blue-700`
- AND the "Clear Filters" button MUST use `bg-gray-200 hover:bg-gray-300`
- AND the panel MUST have `rounded-lg shadow-md p-6` styling

#### Scenario: Gig card spacing follows rhythm
- GIVEN gig cards are displayed in a list
- WHEN cards are stacked vertically
- THEN the gap between cards MUST use `space-y-4` (16px)
- AND each card MUST use `p-6` (24px) padding
- AND the card grid MUST have adequate spacing from filter panel

**Acceptance Criteria:**
- Gig cards use `bg-surface-level-1` with `border-neutral-weak`
- Hover states use `bg-surface-level-2` and `border-neutral-strong`
- Filter panel maintains light theme styling for contrast
- Card spacing uses `space-y-4` (16px gaps)
- Card padding uses `p-6` (24px)
- All existing filter functionality preserved
- Pagination controls remain functional

---

### Requirement: Gig Detail Page Two-Column Layout
The gig detail page MUST use token-based styling in a two-column layout with clear visual hierarchy.

#### Scenario: Main content column uses token-based cards
- GIVEN a user views a gig detail page at `/dashboard/gigs/[id]`
- WHEN the main content column renders
- THEN the gig details card MUST use `bg-surface-level-1 border border-neutral-weak`
- AND the applications section card MUST use `bg-surface-level-1 border border-neutral-weak`
- AND individual application cards MUST use `bg-surface-level-2 border border-neutral-weak`
- AND the messages section card MUST use `bg-navy-800 border border-gray-700` (existing styling)
- AND all cards MUST use `rounded-lg` and appropriate padding

#### Scenario: Sidebar uses token-based styling
- GIVEN a user views a gig detail page
- WHEN the sidebar renders
- THEN the budget card MUST use `bg-surface-level-1 border border-neutral-weak`
- AND the card MUST use `p-6` (24px) padding
- AND the card MUST be sticky with `sticky top-6`

#### Scenario: Status badges use semantic colors on detail page
- GIVEN a gig detail page displays status badges
- WHEN status badges render
- THEN "OPEN" status MUST use gray colors: `bg-blue-500/10 text-blue-400`
- AND "IN_PROGRESS" status MUST use green colors: `bg-success-weak-default text-success-default`
- AND "REVIEW" status MUST use warning colors: `bg-warning-weak-default text-warning-default`
- AND "COMPLETED" status MUST use warning colors: `bg-warning-weak-default text-warning-default`
- AND "PAID" status MUST use success colors: `bg-success-weak-default text-success-default`
- AND application status badges MUST follow same semantic system

**Acceptance Criteria:**
- Main content cards use `bg-surface-level-1` for primary containers
- Nested application cards use `bg-surface-level-2` for hierarchy
- Sidebar budget card uses `bg-surface-level-1`
- Status badges use semantic color tokens consistently
- Messages section maintains existing styling (separate migration)
- Two-column layout responsive on mobile (stacks vertically)
- All existing functionality preserved

---

### Requirement: Gig Detail Page Action Forms
Action forms on the gig detail page MUST use token-based styling with prominent CTAs.

#### Scenario: Apply form uses token-based styling
- GIVEN a SPECIALIST user views an OPEN gig detail page
- WHEN the apply form renders
- THEN the form container MUST use `bg-surface-level-1 border border-neutral-weak`
- AND the form MUST use `p-8` (32px) padding
- AND the submit button MUST use `bg-blue-500 hover:bg-blue-600`
- AND textarea fields MUST use token-based borders and focus states

#### Scenario: Submit work form uses token-based styling
- GIVEN an assigned SPECIALIST views an IN_PROGRESS gig
- WHEN the submit work form renders
- THEN the form container MUST use `bg-surface-level-1 border border-neutral-weak`
- AND the submit button MUST use `bg-blue-500 hover:bg-blue-600`

#### Scenario: Approve work form uses token-based styling
- GIVEN a CLIENT owner views a REVIEW gig
- WHEN the approve work form renders
- THEN the form container MUST use `bg-surface-level-1 border border-neutral-weak`
- AND the approve button MUST use `bg-blue-500 hover:bg-blue-600`

#### Scenario: Mark as paid button uses token-based styling
- GIVEN a CLIENT owner views a COMPLETED gig
- WHEN the mark as paid section renders
- THEN the container MUST use `bg-surface-level-1 border border-neutral-weak`
- AND the button MUST use `bg-blue-500 hover:bg-blue-600`

**Acceptance Criteria:**
- All action form containers use `bg-surface-level-1 border border-neutral-weak`
- All primary action buttons use `bg-blue-500 hover:bg-blue-600`
- Form padding uses `p-8` (32px) for generous spacing
- All form validation and submission logic preserved
- Error messages display correctly
- Loading states work identically

---

### Requirement: Gig Creation Form Visual Sections
The gig creation form MUST use token-based styling for visual sections while maintaining existing structure.

#### Scenario: Form sections use token-based styling
- GIVEN a CLIENT user views the gig creation form at `/dashboard/gigs/new`
- WHEN the form renders
- THEN the "Basic Information" section MUST use `bg-surface-level-1 border border-neutral-weak`
- AND the "Requirements & Success Criteria" section MUST use `bg-surface-level-1 border border-neutral-weak`
- AND the "Budget & Details" section MUST use `bg-surface-level-1 border border-neutral-weak`
- AND all sections MUST use `rounded-lg p-8` styling
- AND sections MUST be separated with `space-y-8` (32px gaps)

#### Scenario: Form fields maintain consistent styling
- GIVEN a CLIENT user interacts with form fields
- WHEN fields render and receive focus
- THEN input fields MUST use `border-gray-600 focus:border-blue-500 focus:ring-blue-500`
- AND textarea fields MUST use same border and focus styling
- AND all fields MUST use `bg-navy-800 text-white` for dark theme consistency
- AND placeholder text MUST use `placeholder:text-gray-400`

#### Scenario: Submit button uses prominent styling
- GIVEN a CLIENT user views the gig creation form
- WHEN the submit button renders
- THEN the button MUST use `bg-blue-500 hover:bg-blue-600 text-white`
- AND the button MUST include focus states: `focus:ring-2 focus:ring-blue-500`
- AND the button MUST be full-width: `w-full`
- AND loading state MUST show "Posting..." text

**Acceptance Criteria:**
- All three form sections use `bg-surface-level-1 border border-neutral-weak`
- Section spacing uses `space-y-8` (32px)
- Form fields maintain dark theme styling with token-based borders
- Submit button uses solid blue with proper focus states
- All character counters remain functional
- All validation warnings remain functional
- Form submission logic unchanged
- All existing tests pass

---

### Requirement: Gig Browse Page Status Badges
Status badges on the gig browse page MUST use semantic colors consistently with Dashboard patterns.

#### Scenario: Example gig badges use blue accent
- GIVEN a gig browse page displays example gigs
- WHEN example badges render
- THEN the badge MUST use `bg-blue-500/10 text-blue-500`
- AND the badge MUST include the ✨ emoji
- AND the badge MUST use `text-xs px-2 py-0.5 rounded-full font-medium`

#### Scenario: Gig status badges use semantic colors
- GIVEN gig cards display status information
- WHEN status badges render (if shown)
- THEN badges MUST follow the same semantic color system as Dashboard
- AND "OPEN" MUST use gray colors
- AND "IN_PROGRESS" MUST use green colors
- AND other statuses MUST use appropriate semantic colors

**Acceptance Criteria:**
- Example badges use blue accent colors
- Status badges (if displayed) use semantic color tokens
- Badge styling consistent with Dashboard badges
- Badge text remains unchanged

---

### Requirement: Gig Pages Functionality Preservation
All gig page functionality MUST remain unchanged during token migration to ensure zero behavioral regressions.

#### Scenario: Gig browse functionality unchanged
- GIVEN a SPECIALIST user interacts with the gig browse page
- WHEN they use filters, pagination, or click gig cards
- THEN all filter logic MUST work identically to before migration
- AND pagination MUST work identically
- AND clicking gig cards MUST navigate to detail pages correctly
- AND all URL parameters MUST be preserved

#### Scenario: Gig detail functionality unchanged
- GIVEN a user interacts with a gig detail page
- WHEN they submit forms, view applications, or send messages
- THEN all form submissions MUST work identically
- AND application accept/reject MUST work identically
- AND work submission/approval MUST work identically
- AND messaging MUST work identically
- AND all navigation MUST work correctly

#### Scenario: Gig creation functionality unchanged
- GIVEN a CLIENT user creates a gig
- WHEN they fill out the form and submit
- THEN all validation MUST work identically
- AND character counters MUST work identically
- AND quality warnings MUST work identically
- AND form submission MUST work identically
- AND redirect after creation MUST work correctly

#### Scenario: Integration tests pass without modification
- GIVEN the token migration is complete
- WHEN integration test suites run
- THEN `gig-creation` tests MUST pass without modification
- AND `gig-filtering` tests MUST pass without modification
- AND `application-flow` tests MUST pass without modification
- AND no test selectors MUST be broken by styling changes

**Acceptance Criteria:**
- All filter functionality works identically
- All pagination functionality works identically
- All form submissions work identically
- All navigation works identically
- All existing integration tests pass without modification
- No functional regressions introduced
- All URL parameters preserved correctly

---

### Requirement: Text Color Token Usage Guidelines

All UI components MUST use design token-based text colors for consistency with the automated design token system.

#### Scenario: Primary text uses text-neutral-strong token
- GIVEN any component renders primary text content (headings, body text, important labels)
- WHEN the text is displayed
- THEN the text MUST use `text-neutral-strong` token
- AND the text MUST NOT use manual gray classes (`text-gray-300`, `text-gray-400`, `text-gray-500`)
- AND the text MUST be readable on `bg-surface-level-0` backgrounds

#### Scenario: Secondary text uses text-neutral-weak token
- GIVEN any component renders secondary text content (metadata, timestamps, helper text, labels)
- WHEN the text is displayed
- THEN the text MUST use `text-neutral-weak` token
- AND the text MUST NOT use manual gray classes (`text-gray-300`, `text-gray-400`, `text-gray-500`)
- AND the text MUST be readable on `bg-surface-level-0`, `bg-surface-level-1`, and `bg-surface-level-2` backgrounds

#### Scenario: Text color tokens meet WCAG AA contrast standards
- GIVEN text is displayed on any background surface
- WHEN contrast ratio is calculated
- THEN `text-neutral-strong` on `bg-surface-level-0` MUST meet WCAG AA (≥ 4.5:1 for normal text)
- AND `text-neutral-weak` on `bg-surface-level-0` MUST meet WCAG AA (≥ 4.5:1 for normal text)
- AND `text-neutral-weak` on `bg-surface-level-1` MUST meet WCAG AA (≥ 4.5:1 for normal text)
- AND `text-neutral-weak` on `bg-surface-level-2` MUST meet WCAG AA (≥ 4.5:1 for normal text)

#### Scenario: Semantic colors remain unchanged
- GIVEN a component displays status, error, success, or warning text
- WHEN the text is displayed
- THEN semantic color tokens MUST be used (e.g., `text-error-500`, `text-success-400`, `text-warning-500`)
- AND semantic colors MUST NOT be replaced with neutral tokens
- AND `text-white` MAY be used for maximum contrast headings

**Acceptance Criteria:**
- All new components use `text-neutral-strong` or `text-neutral-weak` for non-semantic text
- Zero instances of `text-gray-300`, `text-gray-400`, or `text-gray-500` in component files
- All text meets WCAG AA contrast standards
- Semantic colors (`text-error-*`, `text-success-*`, `text-warning-*`) remain unchanged
- `text-white` remains available for maximum contrast use cases

---

### Requirement: Hover State Strategy

All interactive elements MUST follow a consistent strategy for hover state styling.

#### Scenario: Token-first approach for hover states
- GIVEN an interactive element needs hover state styling
- WHEN appropriate design tokens exist for the hover state
- THEN the component MUST use design tokens (e.g., `hover:bg-surface-level-2` for cards)
- AND hardcoded values MUST NOT be used when tokens are available

#### Scenario: Hardcoded fallbacks for hover states without tokens
- GIVEN an interactive element needs hover state styling
- AND no appropriate design token exists for the desired hover effect
- WHEN the hover state is implemented
- THEN hardcoded values MAY be used as a pragmatic fallback (e.g., `hover:bg-navy-700` for subtle hover effects)
- AND the usage SHOULD be consistent with the design system's color palette

**Hover State Guidelines:**

1. **Cards and Containers:**
   - Use `hover:bg-surface-level-2` when hovering over cards on `bg-surface-level-1` backgrounds
   - Use `hover:border-neutral-strong` for border emphasis on hover

2. **Buttons:**
   - Primary buttons: Use `hover:bg-blue-600` (semantic color, not a token)
   - Secondary buttons: Use `hover:bg-gray-200` or similar semantic colors
   - Danger buttons: Use `hover:bg-red-600` (semantic color)

3. **Links:**
   - Use `hover:text-blue-400` for blue links
   - Use `hover:text-white` for navigation links on dark backgrounds

4. **Navigation Items:**
   - Use `hover:bg-navy-700` for subtle hover effects on dark navigation (acceptable hardcoded fallback)
   - Use `hover:text-white` for text color changes

5. **Form Inputs:**
   - Use `focus:border-blue-500` and `focus:ring-blue-500` (semantic colors)
   - Hover states on inputs are generally not needed (focus states are sufficient)

**When Hardcoded Values Are Acceptable:**
- Subtle hover effects where no appropriate token exists (e.g., `hover:bg-navy-700`)
- Semantic colors for buttons and status indicators (e.g., `hover:bg-blue-600`, `hover:bg-red-600`)
- Transitions and animations that require specific color values

**When Tokens Are Required:**
- Background surfaces (use `bg-surface-level-*` tokens)
- Borders (use `border-neutral-*` tokens)
- Text colors (use `text-neutral-*` tokens for non-semantic text)

**Acceptance Criteria:**
- Hover states use tokens where appropriate tokens exist
- Hardcoded values used only for semantic colors or where no token exists
- Hover effects are consistent across similar components
- All hover states maintain adequate contrast for accessibility

---

### Requirement: Auth Asset File Organization
Auth screen assets MUST be organized in a dedicated directory structure with clear naming conventions.

#### Scenario: Assets are stored in public/assets/auth directory
- GIVEN the auth-assets change is implemented
- WHEN the file system is inspected
- THEN a `public/assets/auth/` directory MUST exist
- AND the directory MUST contain the following files:
  - `specialist-icon.svg` (32x32px user/person icon)
  - `client-icon.svg` (32x32px briefcase/bag icon)
  - `background-pattern.svg` (pixelated checkered pattern)
  - `logo.svg` or multiple logo variants

#### Scenario: Asset filenames follow kebab-case convention
- GIVEN any auth asset file
- WHEN the filename is inspected
- THEN the filename MUST use kebab-case (lowercase with hyphens)
- AND the filename MUST have `.svg` extension
- AND the filename MUST be descriptive of the asset's purpose

---

### Requirement: SVG Optimization and Accessibility
All SVG assets MUST be optimized for performance and accessible to assistive technologies.

#### Scenario: SVG files are under 10KB
- GIVEN any SVG file in `public/assets/auth/`
- WHEN the file size is measured
- THEN the file size MUST be less than 10KB (10,240 bytes)
- AND the SVG MUST NOT contain unnecessary metadata, comments, or editor artifacts

#### Scenario: SVG files include proper viewBox attributes
- GIVEN any SVG file in `public/assets/auth/`
- WHEN the SVG markup is inspected
- THEN the `<svg>` element MUST include a `viewBox` attribute
- AND the viewBox MUST define the coordinate system for proper scaling
- AND icon SVGs MUST use `viewBox="0 0 32 32"` for 32x32px dimensions

#### Scenario: Icon SVGs include accessibility attributes
- GIVEN an icon SVG file (specialist-icon.svg or client-icon.svg)
- WHEN the SVG markup is inspected
- THEN the `<svg>` element MUST include either:
  - An `aria-label` attribute with descriptive text (e.g., "Specialist role icon"), OR
  - A `role="img"` attribute with a child `<title>` element
- AND the accessibility text MUST describe the icon's purpose, not its visual appearance

#### Scenario: Decorative SVGs are marked as presentational
- GIVEN the background pattern SVG (background-pattern.svg)
- WHEN the SVG markup is inspected
- THEN the `<svg>` element MUST include `aria-hidden="true"` attribute
- AND the SVG MUST include `role="presentation"` attribute
- BECAUSE decorative elements should be hidden from screen readers

---

### Requirement: Centralized Asset Imports
Auth assets MUST be importable through a centralized module to ensure consistency and type safety.

#### Scenario: Asset constants file exports all auth assets
- GIVEN the auth-assets change is implemented
- WHEN a developer needs to use an auth asset
- THEN they MUST be able to import from `lib/assets.tsx`
- AND the module MUST export constants or components for each asset
- AND the exports MUST include TypeScript types for props

#### Scenario: Asset components accept className prop
- GIVEN an asset exported as a React component
- WHEN the component is used in JSX
- THEN the component MUST accept a `className` prop for Tailwind styling
- AND the className MUST be applied to the root `<svg>` element
- AND the component MUST preserve default dimensions while allowing override via className

---

### Requirement: Asset Integration in Auth Pages
Auth assets MUST be integrated into login and register pages with proper rendering and positioning.

#### Scenario: Role icons appear in register page role selection
- GIVEN a user visits the `/register` page
- WHEN the role selection UI renders
- THEN the specialist icon MUST appear next to the SPECIALIST role option
- AND the client icon MUST appear next to the CLIENT role option
- AND the icons MUST be visually distinct and recognizable

#### Scenario: Assets render without layout shift
- GIVEN a user loads an auth page (login or register)
- WHEN the page renders
- THEN assets MUST NOT cause cumulative layout shift (CLS)
- AND assets MUST have explicit width/height attributes or CSS dimensions
- AND assets MUST load without blocking page interactivity

---

### Requirement: RoleCard Component
The RoleCard component MUST provide a selectable card UI for role selection (CLIENT/SPECIALIST) matching Figma design specifications (nodes 4113:481, 4116:396).

#### Scenario: RoleCard renders with correct dimensions and spacing
- GIVEN a RoleCard component is rendered
- WHEN the component displays
- THEN the card MUST have 20px padding on all sides
- AND the icon MUST be 32px × 32px
- AND the text MUST be 17px font size
- AND the gap between icon and text MUST be 24px
- AND the border-radius MUST be 20px

#### Scenario: RoleCard uses design tokens for styling
- GIVEN a RoleCard component is rendered
- WHEN the component displays
- THEN the background color MUST use a design token (not hardcoded)
- AND the border color MUST use a design token
- AND the text color MUST use a design token
- AND NO hardcoded color values (e.g., #060813) SHALL be present in the component code

#### Scenario: RoleCard shows hover state
- GIVEN a RoleCard component is rendered
- WHEN the user hovers over the card
- THEN the card MUST display a visual hover state
- AND the hover state MUST be distinguishable from the default state
- AND the transition MUST be smooth (CSS transition applied)

#### Scenario: RoleCard shows selected state with blue border
- GIVEN a RoleCard component is rendered with selected={true}
- WHEN the component displays
- THEN the card MUST display a 2px border with color #0265dc
- AND the selected state MUST be visually distinct from default and hover states

#### Scenario: RoleCard is keyboard accessible
- GIVEN a RoleCard component is rendered
- WHEN the user navigates using keyboard (Tab key)
- THEN the card MUST be focusable
- AND the card MUST display a visible focus indicator
- AND the user MUST be able to select the card using Enter or Space key

#### Scenario: RoleCard has proper ARIA attributes
- GIVEN a RoleCard component is rendered
- WHEN the component displays
- THEN the card MUST have role="button" or be a <button> element
- AND the card MUST have aria-pressed attribute reflecting selected state
- AND the card MUST have an accessible label describing the role

---

### Requirement: AuthContainer Component
The AuthContainer component MUST provide a centered container for auth forms matching Figma design specifications.

#### Scenario: AuthContainer renders with correct dimensions
- GIVEN an AuthContainer component is rendered
- WHEN the component displays
- THEN the container MUST have 418px width
- AND the container MUST have 540px height
- AND the border-radius MUST be 25px

#### Scenario: AuthContainer uses design tokens for colors
- GIVEN an AuthContainer component is rendered
- WHEN the component displays
- THEN the background color MUST use a design token matching #060813
- AND the border color MUST use a design token matching #242935
- AND NO hardcoded color values SHALL be present in the component code

#### Scenario: AuthContainer centers content
- GIVEN an AuthContainer component is rendered with child elements
- WHEN the component displays
- THEN the container MUST be horizontally centered on the page
- AND the container MUST be vertically centered on the page
- AND child elements MUST be laid out according to the container's flex/grid properties

---

### Requirement: LogoHeader Component
The LogoHeader component MUST provide a semi-transparent header with logo matching Figma design specifications (node 4106:615).

#### Scenario: LogoHeader renders with correct styling
- GIVEN a LogoHeader component is rendered
- WHEN the component displays
- THEN the background color MUST be rgba(49,54,67,0.5) or equivalent design token
- AND the border-radius MUST be 10px
- AND the padding MUST be 7px vertical and 9px horizontal

#### Scenario: LogoHeader displays logo image
- GIVEN a LogoHeader component is rendered with a logo prop
- WHEN the component displays
- THEN the logo image MUST be displayed
- AND the logo MUST have appropriate alt text for accessibility

---

### Requirement: AuthButton Component
The AuthButton component MUST provide primary and secondary button variants matching Figma design specifications.

#### Scenario: AuthButton primary variant renders correctly
- GIVEN an AuthButton component is rendered with variant="primary"
- WHEN the component displays
- THEN the button MUST have 50px height
- AND the background color MUST be #0088FF or equivalent design token
- AND the border-radius MUST be 10px

#### Scenario: AuthButton secondary variant renders correctly
- GIVEN an AuthButton component is rendered with variant="secondary"
- WHEN the component displays
- THEN the button MUST have 50px height
- AND the background color MUST be rgba(0,136,255,0.24) or equivalent design token
- AND the border-radius MUST be 10px

#### Scenario: AuthButton is keyboard accessible
- GIVEN an AuthButton component is rendered
- WHEN the user navigates using keyboard (Tab key)
- THEN the button MUST be focusable
- AND the button MUST display a visible focus indicator
- AND the user MUST be able to activate the button using Enter or Space key

#### Scenario: AuthButton has proper ARIA attributes
- GIVEN an AuthButton component is rendered
- WHEN the component displays
- THEN the button MUST be a <button> element or have role="button"
- AND the button MUST have an accessible label (via children or aria-label)
- AND if the button is disabled, it MUST have aria-disabled="true"

---

### Requirement: Auth Components Accessibility Compliance
All auth components MUST pass accessibility audits for keyboard navigation, ARIA labels, and focus states.

#### Scenario: Components pass axe-core accessibility audit
- GIVEN all auth components are rendered in a page
- WHEN an axe-core accessibility audit is run
- THEN there MUST be zero critical or serious accessibility violations
- AND all interactive elements MUST be keyboard accessible
- AND all interactive elements MUST have proper ARIA attributes

#### Scenario: Components support keyboard navigation
- GIVEN any interactive auth component is rendered
- WHEN the user navigates using only keyboard (Tab, Enter, Space, Arrow keys)
- THEN the user MUST be able to reach all interactive elements
- AND the user MUST be able to activate all interactive elements
- AND the current focus MUST be visually indicated at all times

---

### Requirement: Figma Design Fidelity
Auth components MUST match Figma design specifications pixel-perfect, verified through visual comparison.

#### Scenario: Component measurements match Figma specs
- GIVEN a component is rendered in the browser
- WHEN the developer inspects the component using browser DevTools
- THEN all dimensions (width, height, padding, margin, gap) MUST match Figma specs within 1px tolerance
- AND all border-radius values MUST match Figma specs exactly
- AND all font sizes MUST match Figma specs exactly

#### Scenario: Component colors match Figma specs
- GIVEN a component is rendered in the browser
- WHEN the developer inspects the component using browser DevTools
- THEN all color values MUST match Figma specs exactly (or use equivalent design tokens)
- AND all opacity/transparency values MUST match Figma specs exactly

#### Scenario: Figma MCP tool is used to fetch specs
- GIVEN the implementation process begins
- WHEN the developer needs component specifications
- THEN the Figma MCP tool MUST be used to fetch exact measurements and colors from nodes
- AND manual measurement or guessing SHALL NOT be used
- AND the fetched specs MUST be documented in implementation notes
### Requirement: BackButton Component Context Handling

The BackButton component MUST support multiple navigation contexts via the `from` query parameter and render appropriate back navigation links.

#### Scenario: BackButton renders for profile context
- GIVEN a user navigates to a page with `?from=profile` query parameter
- WHEN the BackButton component renders
- THEN it MUST display "← Back to Profile" text
- AND it MUST link to `/dashboard/profile`

#### Scenario: BackButton renders for dashboard context
- GIVEN a user navigates to a page with `?from=dashboard` query parameter
- WHEN the BackButton component renders
- THEN it MUST display "← Back to Dashboard" text
- AND it MUST link to `/dashboard`

#### Scenario: BackButton renders for admin-dashboard context
- GIVEN a user navigates to a page with `?from=admin-dashboard` query parameter
- WHEN the BackButton component renders
- THEN it MUST display "← Back to Admin Dashboard" text
- AND it MUST link to `/admin`

#### Scenario: BackButton renders for examples context
- GIVEN a user navigates to a page with `?from=examples` query parameter
- WHEN the BackButton component renders
- THEN it MUST display "← Back to Examples" text
- AND it MUST link to `/dashboard/gigs/examples`

#### Scenario: BackButton preserves browse filters and pagination
- GIVEN a user navigates to a gig detail page with `?from=browse&search=react&tags=React&page=2` query parameters
- WHEN the BackButton component renders
- THEN it MUST display "← Back to Browse Gigs" text
- AND it MUST link to `/gigs?search=react&tags=React&page=2`
- AND it MUST preserve all filter and pagination query parameters (search, tags, minBudget, maxBudget, sort, page)

#### Scenario: BackButton does not render without from parameter
- GIVEN a user navigates to a page without a `from` query parameter
- WHEN the BackButton component renders
- THEN it MUST return null (not render anything)

#### Scenario: BackButton does not render for unknown context
- GIVEN a user navigates to a page with `?from=unknown-context` query parameter
- WHEN the BackButton component renders
- THEN it MUST return null (not render anything)

---

### Requirement: Profile Edit Page Back Navigation

The profile edit page MUST include a BackButton component to allow users to navigate back to their profile.

#### Scenario: BackButton appears on profile edit page
- GIVEN a user navigates to `/profile/edit?from=profile`
- WHEN the page renders
- THEN a BackButton component MUST be visible at the top of the page content
- AND clicking the BackButton MUST navigate to `/dashboard/profile`

#### Scenario: Profile edit links include from parameter
- GIVEN a user is viewing their profile page at `/dashboard/profile`
- WHEN they click any "Edit Profile" or "Редактировать профиль" link
- THEN they MUST be navigated to `/profile/edit?from=profile`

---

### Requirement: Gig Creation Page Back Navigation

The gig creation page MUST include a BackButton component to allow users to navigate back to the dashboard.

#### Scenario: BackButton appears on gig creation page
- GIVEN a user navigates to `/gigs/new?from=dashboard`
- WHEN the page renders
- THEN a BackButton component MUST be visible at the top of the page content
- AND clicking the BackButton MUST navigate to `/dashboard`

#### Scenario: Gig creation links include from parameter
- GIVEN a user is viewing their dashboard
- WHEN they click a "Post a Gig" or "Create Gig" link
- THEN they MUST be navigated to `/gigs/new?from=dashboard`

---

### Requirement: Admin Pages Back Navigation

Admin user management and gig management pages MUST use the BackButton component for consistent navigation back to the admin dashboard.

#### Scenario: BackButton appears on admin users page
- GIVEN an admin navigates to `/admin/users?from=admin-dashboard`
- WHEN the page renders
- THEN a BackButton component MUST be visible at the bottom of the page
- AND clicking the BackButton MUST navigate to `/admin`
- AND the manual "← Back to Admin Dashboard" link MUST be removed

#### Scenario: BackButton appears on admin gigs page
- GIVEN an admin navigates to `/admin/gigs?from=admin-dashboard`
- WHEN the page renders
- THEN a BackButton component MUST be visible at the bottom of the page
- AND clicking the BackButton MUST navigate to `/admin`
- AND the manual "← Back to Admin Dashboard" link MUST be removed

#### Scenario: Admin dashboard links include from parameter
- GIVEN an admin is viewing the admin dashboard at `/admin`
- WHEN they click "User Management" or "Gig Management" links
- THEN they MUST be navigated to `/admin/users?from=admin-dashboard` or `/admin/gigs?from=admin-dashboard` respectively

---

### Requirement: Public Profile Page Back Navigation

The public profile page MUST include a BackButton component to allow users to navigate back to the dashboard.

#### Scenario: BackButton appears on public profile page
- GIVEN a user navigates to `/profile/[userId]?from=dashboard`
- WHEN the page renders
- THEN a BackButton component MUST be visible at the top of the page content
- AND clicking the BackButton MUST navigate to `/dashboard`

#### Scenario: Public profile links include from parameter
- GIVEN a user views a specialist's name in an application list or gig details
- WHEN they click the link to view the specialist's public profile
- THEN they MUST be navigated to `/profile/[userId]?from=dashboard`

---

### Requirement: Examples Page Back Navigation

The examples page MUST include a BackButton component to allow users to navigate back to the dashboard.

#### Scenario: BackButton appears on examples page
- GIVEN a user navigates to `/gigs/examples?from=dashboard`
- WHEN the page renders
- THEN a BackButton component MUST be visible at the top of the page content
- AND clicking the BackButton MUST navigate to `/dashboard`

#### Scenario: Examples page links include from parameter
- GIVEN a user is viewing the gig creation form
- WHEN they click the "💡 View example gigs for inspiration" link
- THEN they MUST be navigated to `/gigs/examples?from=dashboard` (note: link already opens in new tab, so from parameter is for consistency)

---

### Requirement: BackButton Component Implementation

The BackButton component MUST be implemented as a client component using Next.js hooks for query parameter access.

#### Scenario: BackButton uses useSearchParams hook
- GIVEN the BackButton component is rendered
- WHEN it needs to access the `from` query parameter
- THEN it MUST use the `useSearchParams()` hook from `next/navigation`
- AND it MUST be wrapped in a Suspense boundary where used

#### Scenario: BackButton maintains consistent styling
- GIVEN a BackButton is rendered on any page
- WHEN the component displays
- THEN it MUST use consistent styling: `inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors`
- AND it MUST display the arrow character "←" before the text

---
# UI Specification: Empty States

## ADDED Requirements

### Requirement: Gig Browse Page Empty State Enhancement
The gig browse page MUST use the EmptyState component when no gigs match filters or when no gigs are available.

#### Scenario: No gigs match active filters
- GIVEN a SPECIALIST user is on `/dashboard/gigs` with active filters
- WHEN no gigs match the filter criteria
- THEN the page MUST display an EmptyState component with:
  - icon: "🔍"
  - heading: "No Gigs Match Your Filters"
  - description: "Try adjusting your search criteria, tags, or budget range to find more opportunities."
  - primaryAction: { label: "Clear Filters", href: "/gigs" }

#### Scenario: No open gigs available at all
- GIVEN a SPECIALIST user is on `/dashboard/gigs` with no active filters
- WHEN no OPEN gigs exist in the system
- THEN the page MUST display an EmptyState component with:
  - icon: "📭"
  - heading: "No Open Gigs Available"
  - description: "There are no open gigs at the moment. Check back soon for new opportunities, or view example gigs to see what projects look like."
  - primaryAction: { label: "View Example Gigs", href: "/gigs/examples" }

### Requirement: Admin Gigs Page Empty State Enhancement
The admin gigs management page MUST use the EmptyState component when no gigs are found.

#### Scenario: No gigs found with filters
- GIVEN an ADMIN user is on `/admin/gigs` with active filters
- WHEN no gigs match the filter criteria
- THEN the page MUST display an EmptyState component with:
  - icon: "🔍"
  - heading: "No Gigs Found"
  - description: "No gigs match your current filters. Try adjusting the status or closed filters to see more results."
  - primaryAction: { label: "Clear Filters", href: "/admin/gigs" }

#### Scenario: No gigs exist in system
- GIVEN an ADMIN user is on `/admin/gigs` with no active filters
- WHEN no gigs exist in the database
- THEN the page MUST display an EmptyState component with:
  - icon: "📋"
  - heading: "No Gigs Yet"
  - description: "No gigs have been created yet. Once clients start posting gigs, they will appear here for moderation."

### Requirement: Admin Users Page Empty State Enhancement
The admin users management page MUST use the EmptyState component when no users are found.

#### Scenario: No users found with filters
- GIVEN an ADMIN user is on `/admin/users` with active filters
- WHEN no users match the filter criteria
- THEN the page MUST display an EmptyState component with:
  - icon: "🔍"
  - heading: "No Users Found"
  - description: "No users match your current filters. Try adjusting the role or status filters to see more results."
  - primaryAction: { label: "Clear Filters", href: "/admin/users" }

#### Scenario: No users exist in system
- GIVEN an ADMIN user is on `/admin/users` with no active filters
- WHEN no users exist in the database (excluding the admin themselves)
- THEN the page MUST display an EmptyState component with:
  - icon: "👥"
  - heading: "No Users Yet"
  - description: "No users have registered yet. Once users sign up, they will appear here for moderation."

### Requirement: Example Gigs Page Empty State Enhancement
The example gigs page MUST use the EmptyState component when no example gigs are available.

#### Scenario: No example gigs available
- GIVEN a user (CLIENT or SPECIALIST) is on `/gigs/examples`
- WHEN no example gigs exist in the database
- THEN the page MUST display an EmptyState component with:
  - icon: "✨"
  - heading: "No Example Gigs Available"
  - description: "Example gigs haven't been set up yet. Check back later for inspiration on creating great gig descriptions."

### Requirement: Dashboard Messages Empty State Enhancement
The dashboard messages card MUST use the EmptyState component when no recent messages exist.

#### Scenario: No recent messages for CLIENT
- GIVEN a CLIENT user views their dashboard
- WHEN no recent messages exist for their gigs
- THEN the messages card MUST display an EmptyState component with:
  - icon: "💬"
  - heading: "No Messages Yet"
  - description: "Messages with specialists will appear here once you accept applications and start communicating."

#### Scenario: No recent messages for SPECIALIST
- GIVEN a SPECIALIST user views their dashboard
- WHEN no recent messages exist for their active gigs
- THEN the messages card MUST display an EmptyState component with:
  - icon: "💬"
  - heading: "No Messages Yet"
  - description: "Messages with clients will appear here once your applications are accepted and work begins."

### Requirement: Empty State Design Token Compliance
All empty states MUST use design tokens for styling to ensure consistency with the design system.

#### Scenario: EmptyState component uses design tokens
- GIVEN any page renders an EmptyState component
- WHEN the component is inspected
- THEN it MUST use design tokens for:
  - Background: `bg-surface-level-1`
  - Border: `border-neutral-weak`
  - Heading text: `text-white`
  - Description text: `text-neutral-default`
  - Primary button: `bg-blue-500 hover:bg-blue-600 text-white`
  - Secondary link: `text-blue-600 hover:text-blue-800`
- AND it MUST NOT use hardcoded color values

### Requirement: Empty State Accessibility
All empty states MUST be accessible to screen readers and keyboard navigation.

#### Scenario: Empty state is accessible
- GIVEN any page renders an EmptyState component
- WHEN a user navigates with keyboard or screen reader
- THEN the heading MUST be properly structured (h3 or appropriate level)
- AND action buttons MUST be keyboard accessible
- AND links MUST have descriptive text (not just "Click here")
- AND the empty state MUST have sufficient color contrast

### Requirement: Role-Specific Empty State Testing
Empty states MUST be tested for both CLIENT and SPECIALIST roles to ensure appropriate messaging.

#### Scenario: CLIENT sees appropriate empty states
- GIVEN a CLIENT user navigates through the application
- WHEN they encounter empty states on their dashboard
- THEN empty states MUST reference CLIENT-specific actions (e.g., "Post New Gig", "Accept Applications")
- AND empty states MUST NOT reference SPECIALIST actions (e.g., "Browse Gigs", "Apply to Gigs")

#### Scenario: SPECIALIST sees appropriate empty states
- GIVEN a SPECIALIST user navigates through the application
- WHEN they encounter empty states on their dashboard or gig browsing
- THEN empty states MUST reference SPECIALIST-specific actions (e.g., "Browse Gigs", "Apply to Projects")
- AND empty states MUST NOT reference CLIENT actions (e.g., "Post Gig", "Review Applications")

---

## Loading State Requirements

### Requirement: Form Loading States

All forms that submit data via server actions MUST display loading indicators during async operations to provide user feedback and prevent duplicate submissions.

#### Scenario: Form displays loading state during submission

**Given** a user has filled out a form with valid data
**When** the user clicks the submit button
**Then** the submit button MUST display loading text (e.g., "Saving...", "Submitting...", "Loading...")
**And** the submit button MUST be disabled
**And** the button MUST show reduced opacity (opacity-50) to indicate disabled state
**And** the cursor MUST change to not-allowed when hovering over the disabled button

**Acceptance Criteria:**
- Submit button uses `useFormStatus()` hook from 'react-dom'
- Button text changes from default to loading text when `pending` is true
- Button has `disabled={pending}` attribute
- Button styling includes `disabled:opacity-50` and `disabled:cursor-not-allowed`
- Loading text is contextual to the operation (e.g., "Saving profile...", "Posting gig...", "Submitting application...")

#### Scenario: Form prevents duplicate submissions

**Given** a user has submitted a form
**When** the user clicks the submit button multiple times rapidly
**Then** only one submission MUST occur
**And** subsequent clicks MUST be ignored while the first submission is pending
**And** the button MUST remain disabled until the submission completes

**Acceptance Criteria:**
- Button is disabled immediately when clicked
- Multiple rapid clicks do not trigger multiple server action calls
- Database contains only one record after multiple clicks

#### Scenario: Loading state clears after submission completes

**Given** a form is in loading state
**When** the server action completes (success or error)
**Then** the loading state MUST clear
**And** the button MUST return to enabled state (if form is still visible)
**And** the button text MUST return to default text (if form is still visible)
**And** if submission succeeded, the user MUST be redirected or see success feedback
**And** if submission failed, the user MUST see error message and can retry

**Acceptance Criteria:**
- Loading state clears on successful submission
- Loading state clears on failed submission
- Error messages are displayed if submission fails
- User can retry submission after error

### Requirement: Consistent Loading UI Patterns

All loading indicators MUST follow consistent UI patterns for visual coherence and predictable user experience.

#### Scenario: Loading buttons use consistent styling

**Given** any form with a submit button
**When** the form is in loading state
**Then** the button MUST use consistent styling:
- Text changes to contextual loading message
- Button is disabled with `disabled={pending}`
- Opacity reduced to 50% with `disabled:opacity-50`
- Cursor changes to not-allowed with `disabled:cursor-not-allowed`
- Transition duration of 200ms for smooth state changes
- Design tokens used for colors (bg-blue-500, text-white, etc.)

**Acceptance Criteria:**
- All loading buttons use the same CSS classes for disabled state
- All loading buttons use design tokens for colors
- Visual review confirms consistent appearance across all forms

#### Scenario: Loading text is contextual and clear

**Given** different types of forms (profile edit, gig creation, application submission, etc.)
**When** each form is in loading state
**Then** the loading text MUST be contextual to the operation:
- Profile edit: "Saving profile..."
- Gig creation: "Posting gig..."
- Application submission: "Submitting application..."
- Work submission: "Submitting work..."
- Work approval: "Approving work..."
- Payment marking: "Marking as paid..."
- User suspension: "Suspending..."
- User unsuspension: "Unsuspending..."
- Gig closing: "Closing..."
- Message sending: "Sending message..."

**Acceptance Criteria:**
- Each form has contextually appropriate loading text
- Loading text is concise (2-3 words + ellipsis)
- Loading text uses present continuous tense ("-ing" form)

### Requirement: LoadingButton Component

The platform SHOULD provide a shared LoadingButton component to standardize loading state implementation across all forms.

#### Scenario: LoadingButton component displays loading state

**Given** a form uses the LoadingButton component
**When** the form is submitted
**Then** the LoadingButton MUST display the loading text
**And** the button MUST be disabled
**And** the button MUST use the specified variant styling (primary, secondary, or danger)

**Acceptance Criteria:**
- LoadingButton component exists at `app/components/LoadingButton.tsx`
- Component accepts props: `loadingText`, `defaultText`, `variant`, `className`
- Component uses `useFormStatus()` hook internally
- Component supports variants: primary (blue), secondary (gray), danger (red)
# UI Specification Delta: Breadcrumb Navigation

## ADDED Requirements

### Requirement: Breadcrumb Component
The system MUST provide a reusable `Breadcrumb` component that displays hierarchical navigation paths.

#### Scenario: Render breadcrumb with multiple levels
- GIVEN a breadcrumb with 3 levels: "Dashboard" > "Browse Gigs" > "Senior React Developer"
- WHEN the component renders
- THEN it MUST display all three levels separated by ">" or "/" separator
- AND the first two levels MUST be clickable links
- AND the last level (current page) MUST be non-clickable text
- AND the current page MUST be visually distinct (different color/weight)

#### Scenario: Breadcrumb uses design tokens
- GIVEN the Breadcrumb component renders
- WHEN styling is applied
- THEN all colors MUST use design tokens (e.g., `text-neutral-strong`, `text-primary`)
- AND spacing MUST use Tailwind spacing utilities
- AND NO hardcoded color values MUST be present

#### Scenario: Breadcrumb links navigate correctly
- GIVEN a breadcrumb link for "Dashboard"
- WHEN the user clicks the link
- THEN the browser MUST navigate to `/dashboard`
- AND the navigation MUST use Next.js Link component (client-side navigation)

#### Scenario: Breadcrumb is keyboard accessible
- GIVEN a breadcrumb with clickable links
- WHEN the user navigates using Tab key
- THEN each link MUST be focusable
- AND pressing Enter on a focused link MUST navigate to that page

#### Scenario: Breadcrumb is screen reader accessible
- GIVEN a breadcrumb component
- WHEN a screen reader reads the page
- THEN the breadcrumb MUST be announced as navigation
- AND the current page MUST be announced with "current page" or similar

**Acceptance Criteria:**
- Component exported from `app/components/Breadcrumb.tsx`
- Accepts `items` prop: `Array<{ label: string; href?: string; current?: boolean }>`
- Uses Next.js `Link` component for navigation
- Uses design tokens for all styling
- Includes `aria-label="Breadcrumb"` on nav element
- Includes `aria-current="page"` on current page item
- Separator is "/" character with appropriate spacing

---

### Requirement: Responsive Breadcrumb Behavior
The Breadcrumb component MUST adapt to mobile viewports by collapsing intermediate levels.

#### Scenario: Full breadcrumb on desktop
- GIVEN a viewport width >= 768px (tablet/desktop)
- WHEN a breadcrumb with 4 levels renders
- THEN all 4 levels MUST be visible
- AND no ellipsis MUST be shown

#### Scenario: Collapsed breadcrumb on mobile
- GIVEN a viewport width < 768px (mobile)
- WHEN a breadcrumb with 4 levels renders (e.g., "Dashboard" > "Browse Gigs" > "Category" > "Current")
- THEN it MUST show: "Dashboard" > "..." > "Current"
- AND the ellipsis MUST indicate collapsed levels
- AND the immediate parent and current page MUST always be visible

#### Scenario: Short breadcrumb on mobile
- GIVEN a viewport width < 768px
- WHEN a breadcrumb with 2 levels renders
- THEN both levels MUST be visible
- AND no ellipsis MUST be shown

**Acceptance Criteria:**
- Uses Tailwind responsive utilities (`hidden md:inline`, etc.)
- Mobile shows first item + ellipsis + last item (for 3+ levels)
- Mobile shows all items (for 2 levels)
- Ellipsis is non-interactive text (not a button/link)

---

### Requirement: Gig Detail Page Breadcrumbs
Gig detail pages MUST display breadcrumbs showing the path from Dashboard.

#### Scenario: Specialist views gig detail
- GIVEN an authenticated SPECIALIST user
- WHEN viewing a gig detail page at `/gigs/[id]`
- THEN breadcrumbs MUST show: "Dashboard" > "Browse Gigs" > "[Gig Title]"
- AND "Dashboard" MUST link to `/dashboard`
- AND "Browse Gigs" MUST link to `/gigs`
- AND "[Gig Title]" MUST be the current page (non-clickable)

#### Scenario: Client views gig detail
- GIVEN an authenticated CLIENT user
- WHEN viewing a gig detail page at `/gigs/[id]`
- THEN breadcrumbs MUST show: "Dashboard" > "[Gig Title]"
- AND "Dashboard" MUST link to `/dashboard`
- AND "[Gig Title]" MUST be the current page (non-clickable)

#### Scenario: Admin views gig detail
- GIVEN an authenticated ADMIN user
- WHEN viewing a gig detail page at `/gigs/[id]`
- THEN breadcrumbs MUST show: "Dashboard" > "[Gig Title]"
- AND "Dashboard" MUST link to `/dashboard`
- AND "[Gig Title]" MUST be the current page (non-clickable)

#### Scenario: Gig title is truncated if too long
- GIVEN a gig with a very long title (> 50 characters)
- WHEN breadcrumbs render
- THEN the gig title MUST be truncated with ellipsis
- AND the full title MUST be available via tooltip or title attribute

**Acceptance Criteria:**
- Breadcrumb component added to `app/(protected)/gigs/[id]/page.tsx`
- Gig title fetched from existing page data (no extra query)
- Role-based breadcrumb paths (SPECIALIST includes "Browse Gigs", others don't)
- Long titles truncated at 50 characters with ellipsis
- Positioned above page heading

---

### Requirement: Profile Page Breadcrumbs
Profile pages MUST display breadcrumbs showing the path from Dashboard.

#### Scenario: User views own profile
- GIVEN an authenticated user
- WHEN viewing their profile at `/profile`
- THEN breadcrumbs MUST show: "Dashboard" > "Profile"
- AND "Dashboard" MUST link to `/dashboard`
- AND "Profile" MUST be the current page (non-clickable)

#### Scenario: User edits profile
- GIVEN an authenticated user
- WHEN viewing profile edit page at `/profile/edit`
- THEN breadcrumbs MUST show: "Dashboard" > "Profile" > "Edit"
- AND "Dashboard" MUST link to `/dashboard`
- AND "Profile" MUST link to `/profile`
- AND "Edit" MUST be the current page (non-clickable)

#### Scenario: User views another user's profile
- GIVEN an authenticated user
- WHEN viewing another user's profile at `/profile/[userId]`
- THEN breadcrumbs MUST show: "Dashboard" > "Profile" > "[User Name]"
- AND "Dashboard" MUST link to `/dashboard`
- AND "Profile" MUST link to `/profile`
- AND "[User Name]" MUST be the current page (non-clickable)

**Acceptance Criteria:**
- Breadcrumb component added to all profile pages
- User name fetched from existing page data (no extra query)
- Positioned above page heading
- Consistent spacing with other breadcrumb implementations

---

### Requirement: Admin Page Breadcrumbs
Admin pages MUST display breadcrumbs showing the path from Admin dashboard.

#### Scenario: Admin views user management page
- GIVEN an authenticated ADMIN user
- WHEN viewing `/admin/users`
- THEN breadcrumbs MUST show: "Admin" > "Users"
- AND "Admin" MUST link to `/admin`
- AND "Users" MUST be the current page (non-clickable)

#### Scenario: Admin views gig management page
- GIVEN an authenticated ADMIN user
- WHEN viewing `/admin/gigs`
- THEN breadcrumbs MUST show: "Admin" > "Gigs"
- AND "Admin" MUST link to `/admin`
- AND "Gigs" MUST be the current page (non-clickable)

**Acceptance Criteria:**
- Breadcrumb component added to `/admin/users/page.tsx` and `/admin/gigs/page.tsx`
- Admin dashboard (`/admin`) does NOT have breadcrumbs (top-level page)
- Positioned above page heading
- Consistent spacing with other breadcrumb implementations

---

### Requirement: Breadcrumb Visual Design
Breadcrumbs MUST follow the design system and maintain visual consistency.

#### Scenario: Breadcrumb styling matches design system
- GIVEN a breadcrumb component renders
- WHEN inspecting the styles
- THEN text color MUST use `text-neutral-strong` for links
- AND text color MUST use `text-neutral-weak` for current page
- AND hover state MUST use `hover:text-white` for links
- AND separator MUST use `text-neutral-weak`
- AND font size MUST be `text-sm`

#### Scenario: Breadcrumb spacing is consistent
- GIVEN a breadcrumb component renders
- WHEN measuring spacing
- THEN margin bottom MUST be `mb-4` or `mb-6`
- AND separator spacing MUST be `mx-2`
- AND the breadcrumb MUST align with page content (same horizontal padding)

**Acceptance Criteria:**
- All colors use design tokens
- Font size is `text-sm`
- Separator is "/" with `mx-2` spacing
- Bottom margin is `mb-4` or `mb-6`
- Links have hover state
- Current page has reduced opacity or different color

---

### Requirement: ConfirmDialog Component
The system MUST provide a reusable `ConfirmDialog` component that displays a modal confirmation dialog for destructive actions.

#### Scenario: Dialog renders with custom title and message
- GIVEN a ConfirmDialog component with title and message
- WHEN the dialog is rendered
- THEN the title MUST be displayed prominently at the top
- AND the message MUST be displayed below the title
- AND the dialog MUST be centered on the screen with a backdrop overlay

#### Scenario: Dialog has Confirm and Cancel buttons
- GIVEN a ConfirmDialog component
- WHEN the dialog is rendered
- THEN it MUST display a "Confirm" button with destructive styling (red background)
- AND it MUST display a "Cancel" button with neutral styling
- AND the Cancel button MUST be positioned to the left of the Confirm button

#### Scenario: Clicking Confirm executes callback
- GIVEN a ConfirmDialog with onConfirm callback
- WHEN the user clicks the "Confirm" button
- THEN the onConfirm callback MUST be executed
- AND the dialog MUST close automatically

#### Scenario: Clicking Cancel closes dialog without action
- GIVEN a ConfirmDialog with onConfirm callback
- WHEN the user clicks the "Cancel" button
- THEN the onConfirm callback MUST NOT be executed
- AND the dialog MUST close

#### Scenario: Pressing Escape closes dialog without action
- GIVEN an open ConfirmDialog
- WHEN the user presses the Escape key
- THEN the dialog MUST close
- AND the onConfirm callback MUST NOT be executed

#### Scenario: Clicking backdrop closes dialog without action
- GIVEN an open ConfirmDialog
- WHEN the user clicks the backdrop (outside the dialog)
- THEN the dialog MUST close
- AND the onConfirm callback MUST NOT be executed

#### Scenario: Dialog is keyboard accessible
- GIVEN an open ConfirmDialog
- WHEN the user navigates with Tab key
- THEN focus MUST move between Cancel and Confirm buttons
- AND pressing Enter on focused button MUST trigger that button's action

#### Scenario: Dialog traps focus
- GIVEN an open ConfirmDialog
- WHEN the user navigates with Tab key
- THEN focus MUST remain within the dialog
- AND focus MUST NOT move to elements behind the dialog

#### Scenario: Dialog has ARIA attributes
- GIVEN a ConfirmDialog component
- WHEN the dialog is rendered
- THEN it MUST have role="dialog"
- AND it MUST have aria-modal="true"
- AND it MUST have aria-labelledby pointing to the title element
- AND it MUST have aria-describedby pointing to the message element

**Acceptance Criteria:**
- Component exported from `app/components/ui/ConfirmDialog.tsx`
- Props interface: `{ isOpen: boolean, title: string, message: string, onConfirm: () => void, onCancel: () => void, confirmLabel?: string, cancelLabel?: string }`
- Default labels: confirmLabel="Confirm", cancelLabel="Cancel"
- Uses design tokens for colors (bg-error-600 for destructive button, bg-surface-level-2 for neutral button)
- Backdrop has semi-transparent dark overlay (bg-black bg-opacity-50)
- Dialog has white background, rounded corners, shadow
- Responsive: w-[90vw] sm:w-full (adapts to mobile screens)
- Focus management: uses useFocusTrap hook
- Escape key handler and backdrop click handler
- ARIA attributes for accessibility

---

### Requirement: useConfirmDialog Hook
The system MUST provide a `useConfirmDialog` custom hook that manages dialog state and provides open/close functions.

#### Scenario: Hook provides dialog state
- GIVEN a component using useConfirmDialog hook
- WHEN the hook is initialized
- THEN it MUST return isOpen state (boolean)
- AND it MUST return openDialog function
- AND it MUST return closeDialog function
- AND it MUST return confirmDialog function

#### Scenario: openDialog sets isOpen to true
- GIVEN a component using useConfirmDialog hook
- WHEN openDialog() is called
- THEN isOpen MUST be set to true
- AND the dialog MUST become visible

#### Scenario: closeDialog sets isOpen to false
- GIVEN a component with open dialog (isOpen = true)
- WHEN closeDialog() is called
- THEN isOpen MUST be set to false
- AND the dialog MUST become hidden

#### Scenario: confirmDialog executes action and closes
- GIVEN a component using useConfirmDialog with action callback
- WHEN confirmDialog() is called
- THEN the action callback MUST be executed
- AND isOpen MUST be set to false
- AND the dialog MUST close

**Acceptance Criteria:**
- Hook exported from `app/hooks/useConfirmDialog.ts`
- Returns object: `{ isOpen: boolean, openDialog: () => void, closeDialog: () => void, confirmDialog: (action: () => void) => void }`
- confirmDialog accepts action callback and executes it before closing
- State management uses React useState
- Hook is reusable across multiple components
- Functions maintain stable references using useCallback
