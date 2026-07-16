# UI Specification

> ⚠️ **PARTIALLY OUTDATED (as of 2026-06-14).** The page-level UI requirements below describe the
> **pre-redesign** screens and reference design-token classes derived from the now-**deleted**
> `openspec/specs/ui/design-tokens.json`. The **single source of truth for the design system is the
> `/screens` SVGs**, extracted into `docs/DESIGN_SPECS.md`. These specs are superseded incrementally as the
> UI redesign plan (`openspec/planning/ui-redesign-integration.md`) rebuilds each screen; the
> `extract-svg-tokens-and-assets` change adds the design-system extraction requirements.

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

### Requirement: AuthDesign Screen (login + onboarding)
The auth surface MUST be a single `app/_design/AuthDesign.tsx` component rebuilt directly on
`gigly_full_design/Auth.dc.html` (reground-auth-to-design), consistent with the other `*Design.tsx` screens
(inline-styled prototype markup on `app/_design/tokens.css`, literal Handjet/Manrope). It renders a shared shell and two
views (`login`, `onboarding`). `/login` renders `initialView="login"`; `/register` renders `initialView="onboarding"`.
This supersedes the prior kit/legacy login page (no English copy, no `bg-navy` Tailwind login form, no checkerboard).

#### Scenario: Shared auth shell
- GIVEN any auth view renders
- THEN it shows the GIGLY wordmark top-left, the `pixel-wave.svg` bottom band (served from `/assets/pixel-wave.svg`,
  brand-blue), and the footer links «Политика конфиденциальности» / «Условия пользования» / «Помощь» on the
  `var(--surface-app)` (`#01030e`) surface via the design tokens

#### Scenario: Login view
- GIVEN a user navigates to `/login`
- THEN the «ВХОД В GIGLY» lockup (blue-G logomark + Handjet heading + Manrope subtitle), Email + Пароль, a
  non-functional «Забыли пароль?» link, a «Войти» submit wired to `loginUser`, and a «Нет аккаунта? Создать аккаунт»
  link are shown — no step-dots, no role selector, no English

#### Scenario: Token/font purity
- GIVEN the auth screens render
- THEN colours and fonts resolve from `app/_design/tokens.css` (no off-design hex/font literals), and the screens work
  in both `data-theme` modes

**Acceptance Criteria:**
- `app/_design/AuthDesign.tsx` is a `'use client'` component importing `./tokens.css`; `/login` and `/register` render it
- Login view uses `useActionState(loginUser)` and shows `state?.error` (Russian); switches to onboarding via «Создать аккаунт»
- No English UI strings, no kit `AuthContainer`/`AuthButton`, no checkerboard

#### Scenario: Onboarding view (3 steps, two-phase)
- GIVEN a user navigates to `/register`
- THEN the onboarding view reproduces the 3-step flow from `Auth.dc.html` with step-dots: step 1 role select via the
  diagonal chips (Компания / Специалист), step 2 credentials (Email + «Придумайте пароль» + «Подтвердите пароль») with
  «Зарегистрироваться» (creates the account via `registerUser`) and a «Войти» link, step 3 role-specific setup
  (CLIENT «ДОБРО ПОЖАЛОВАТЬ» — Компания/ФИО/Должность/Местоположение+TZ; SPECIALIST «НАСТРОЙТЕ СВОЙ АККАУНТ» —
  ФИО/Специализация/Местоположение+TZ) with a back-arrow, «Продолжить» (saves via `updateProfile` → `/dashboard`), and
  the consent footer «Нажимая «Продолжить»…»

**Acceptance Criteria:**
- Onboarding step transitions are client-side state; step-2 submits to `registerUser`, step-3 to `updateProfile`
- Dropdowns bound to `SPECIALIZATIONS`/`TIMEZONES`; role chosen at step 1 (no `?role=`)

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
The system MUST provide a form at `/gigs/new` for CLIENT users to create gigs. The live screen is the re-grounded `CreateGigDesign.tsx` on the `gigly_full_design` skin, governed in detail by «Gig Creation Screen Is the Guided Brief» and its companion requirements; this requirement fixes the field, validation, fee, and access contract. All on-screen text MUST be Russian.

> Reconciled (raise-service-fee-and-reconcile-create-gig, 2026-07-16). The previous version described the pre-reground
> English kit form and was wrong on three shipped facts: it listed `goal`/`deliverables` as optional (they are
> **required** — C1), quoted the service fee as **20%** (now **17.5%**), and specced "X / 1000 characters" kit counters
> that do not exist. Those scenarios are corrected or removed below; the counter behaviour is owned by «Localized Live
> Character Counters on Gig Create/Edit», the fee rate by the gig spec «Service Fee Rate Is a Single Source of Truth»,
> and the validation by «Create Gig Server Action» / «Shared Server-Authoritative Gig Validator (parseGigForm SSOT)».

#### Scenario: Form renders for CLIENT user
- GIVEN an authenticated user with role "CLIENT"
- WHEN they navigate to `/gigs/new`
- THEN the page MUST display the guided-brief form containing, at minimum:
  - Title input (required)
  - Category selector (required)
  - Description textarea (required, ≥20 characters)
  - Acceptance-criteria editor (required, ≥50 characters combined)
  - Goal textarea (**required**)
  - Deliverables textarea (**required**)
  - Constraints textarea (optional)
  - Budget input (required, in roubles)
  - Deadline input (required)
  - Tags input (optional)
  - A live fee preview showing budget, service fee (**17,5%**), and total
  - A publish action

#### Scenario: Goal and deliverables are required
- GIVEN a CLIENT on the gig creation form
- WHEN the page renders
- THEN `goal` and `deliverables` MUST be required — the server's `parseGigForm` rejects them empty (see the gig spec «Create Gig Server Action» / «Shared Server-Authoritative Gig Validator»)
- AND `constraints` MUST remain optional
- AND the readiness checklist MUST reflect goal and deliverables as required checks
- AND the form MUST NOT present them under an "optional" grouping

#### Scenario: Live fee calculation preview is 17.5%
- GIVEN a CLIENT on the gig creation form
- WHEN they enter a budget (e.g. 100000)
- THEN the form MUST display live: Бюджет «100 000 ₽», Сервисный сбор (17,5%) «17 500 ₽», Итого «117 500 ₽»
- AND the fee MUST equal `floor(budget × SERVICE_FEE_RATE)` (0.175), matching the value the server persists
- AND the preview MUST NOT quote a 10% or 20% fee

#### Scenario: Character counters are Russian and token-based
- GIVEN a CLIENT typing in the description or acceptance-criteria fields
- WHEN a counter renders
- THEN it MUST show progress to the minimum in Russian (per «Localized Live Character Counters on Gig Create/Edit»)
- AND the form MUST NOT render the pre-reground kit counters («X / 1000 characters», `text-gray-600` / `text-orange-600`) on goal / deliverables / constraints — that behaviour does not exist on the live screen

#### Scenario: Validation is server-authoritative
- GIVEN a submission that fails a rule (short description, empty goal or deliverables, short criteria, non-positive budget, or out-of-range deadline)
- WHEN it is submitted
- THEN the server action MUST reject it and the error MUST be displayed inline
- AND the client readiness checklist MUST mirror — never replace — `parseGigForm`

#### Scenario: Non-CLIENT user visits gig creation page
- GIVEN an authenticated user with role "SPECIALIST"
- WHEN they navigate to `/gigs/new`
- THEN they MUST be redirected to `/dashboard`

#### Scenario: Unauthenticated user visits gig creation page
- GIVEN no valid session
- WHEN a user navigates to `/gigs/new`
- THEN they MUST be redirected to `/login` (handled by existing middleware)

**Acceptance Criteria:**
- The live form is the re-grounded `CreateGigDesign.tsx` on the `gigly_full_design` skin, wired to `createGig` via `useActionState`
- `goal` and `deliverables` are required; `constraints` optional — consistent with the gig spec
- Service fee is 17.5% everywhere it appears; no "10%" or "20%" remains in this requirement
- Counter behaviour defers to «Localized Live Character Counters on Gig Create/Edit»; no "X / 1000 characters" kit counters
- Access-control and server-authoritative-validation scenarios are preserved

---

### Requirement: Localized Live Character Counters on Gig Create/Edit
The re-grounded gig create and edit forms MUST render a live, **Russian-localized** character counter on the description and acceptance-criteria fields (and on any field with a maximum), so the user always sees their progress against the minimum/maximum. The counter component (`app/(protected)/gigs/new/character-counter.tsx`) MUST be rendered (it previously existed but was unused) and its text MUST be Russian.

#### Scenario: Description counter shows progress to the minimum
- GIVEN a CLIENT user typing in the description field on `/gigs/new` (or the edit form)
- WHEN the value is shorter than 20 characters (trimmed)
- THEN a live counter MUST display the current count against the 20-character minimum, in Russian (e.g. «12 / 20 символов»)
- AND the counter MUST update on every keystroke
- AND the counter MUST visually signal "not yet met" (a token-based warning color) until the minimum is reached

#### Scenario: Criteria counter shows progress to the minimum
- GIVEN a CLIENT user editing acceptance criteria
- WHEN the combined committed criteria text is shorter than 50 characters (trimmed)
- THEN a live counter MUST display the current count against the 50-character minimum, in Russian (e.g. «34 / 50 символов»)
- AND it MUST update as criteria are added or removed

#### Scenario: Counter is accessible
- GIVEN a screen-reader user on the form
- WHEN a counter updates
- THEN the counter element MUST have `aria-live="polite"` and a descriptive Russian `aria-label` or visible text

#### Scenario: Counter does not replace server validation
- GIVEN a submission with a sub-minimum field
- WHEN the form is submitted
- THEN the server MUST still reject it (the counter is advisory only, not a substitute for `parseGigForm`)

---

### Requirement: Legible "Why Submit Is Disabled" Guidance
The re-grounded gig create/edit form MUST tell the user **why** the submit control is unavailable and **what remains**, rather than showing a bare disabled button with a vague hint. The guidance MUST be in Russian and name the specific unmet requirement(s) and the shortfall.

#### Scenario: Short description explains the shortfall
- GIVEN a CLIENT user whose description is 12 characters (below the 20 minimum) and all else valid
- WHEN they view the submit area
- THEN the button MUST be disabled AND a Russian message MUST state the unmet requirement and remaining amount (e.g. «Описание: ещё 8 символов»)
- AND once the description reaches 20 characters, the message MUST clear and the button MUST enable

#### Scenario: Multiple unmet requirements are surfaced
- GIVEN a CLIENT user with more than one unmet requirement (e.g. empty goal AND short criteria)
- WHEN they view the readiness area
- THEN the guidance MUST make clear which requirements are still unmet (not merely the first), so the user can complete the brief

---

### Requirement: Custom Acceptance Criteria Always Count
The re-grounded gig create/edit form MUST ensure that acceptance criteria the user **types themselves** count toward readiness and are persisted, not only criteria picked from suggested chips. Pending text in the custom-criteria input MUST NOT be silently dropped.

#### Scenario: Typed-but-not-committed criteria still count on submit
- GIVEN a CLIENT user who typed a custom criterion into the criteria input but did not press Enter or «Добавить»
- WHEN they submit the form
- THEN the pending input text MUST be auto-committed into the criteria set before validation
- AND if the resulting combined criteria are ≥ 50 characters, the gig MUST be creatable (the readiness check MUST NOT stay unmet solely because the text was uncommitted)

#### Scenario: A hint prompts committing custom criteria
- GIVEN a CLIENT user with non-empty text in the custom-criteria input that has not been added
- WHEN they view the criteria field
- THEN a Russian hint MUST prompt them to add it (e.g. «нажмите Добавить»), so the commit step is discoverable

#### Scenario: Custom-only criteria can satisfy the minimum
- GIVEN a CLIENT user who adds only their own custom criteria (no suggested chips) totalling ≥ 50 characters
- WHEN they submit
- THEN the criteria readiness MUST be satisfied and the gig MUST be creatable

---

### Requirement: Edit Form Readiness Parity
The gig **edit** form (`EditGigDesign.tsx`) MUST present the same readiness affordances (localized counters, why-disabled guidance, custom-criteria handling) as the create form, so a user cannot edit a gig into a state that creation would reject and always sees the same feedback.

#### Scenario: Edit form mirrors create readiness
- GIVEN the owning CLIENT editing an `OPEN` gig
- WHEN a field is below its minimum (e.g. description < 20, criteria < 50, empty goal/deliverables)
- THEN the edit form MUST show the same localized counter + why-disabled guidance as create
- AND submitting anyway MUST be rejected by the server (`updateGig` → `parseGigForm`)

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
The system MUST display a notification bell icon in the navigation header that shows unread message count and opens a dropdown. This requirement governs the bell's *display and dropdown behavior*; **when** the count is re-read is governed by "Notification Bell Refreshes Without a Manual Reload" below — a mount-only fetch does NOT satisfy it.

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
- The badge is not rendered until the first real read lands (no flash of a stale zero)

---

### Requirement: Notification Bell Refreshes Without a Manual Reload
The notification bell MUST keep its unread count fresh during a session without the user reloading the page. The bell lives in the persistent `app/(protected)/layout.tsx` shell, which does not re-mount on client-side navigation, so a mount-only fetch (`useEffect(…, [])`) is NOT sufficient and MUST NOT be the only refresh trigger.

#### Scenario: Count refreshes on client-side navigation
- GIVEN an authenticated CLIENT sitting on `/dashboard` with a bell count of N
- AND a specialist applies to one of their gigs (raising the true count to N+1)
- WHEN the client navigates in-app to another protected route (e.g. `/my-gigs`) without a full page reload
- THEN the bell MUST refetch the unread count and display N+1
- AND the refetch MUST be driven by the current pathname changing (e.g. `usePathname()` in the effect dependencies)

#### Scenario: Count refreshes on a poll backstop while the user is idle
- GIVEN an authenticated user who stays on a single route without navigating
- AND their true unread count changes
- WHEN the poll interval elapses (~30s, and no longer than 60s)
- THEN the bell MUST refetch and display the new count without any user action

#### Scenario: Count refreshes when the tab is re-focused
- GIVEN an authenticated user who switches away to another tab and returns
- WHEN the tab becomes visible again
- THEN the bell MUST refetch the unread count
- AND a tab becoming *hidden* MUST NOT trigger a refetch

#### Scenario: Polling stands down for unauthenticated users
- GIVEN a tab whose session has ended (logged out, or expired in another tab)
- WHEN the next poll observes an unauthenticated response
- THEN the hook MUST stop polling permanently — no further count requests for the life of that mount
- AND the counters MUST keep their last known value rather than flashing to zero
- AND the failed/unauthenticated read MUST NOT throw an unhandled error or spam the console
- NOTE: the client cannot know the session ended without asking once, so exactly one request per mount may observe
  the unauthenticated state; what MUST NOT happen is continued polling after that.

#### Scenario: Refresh does not disturb an open dropdown
- GIVEN the user has the notification dropdown open
- WHEN a background refresh completes
- THEN the dropdown MUST remain open and usable (the refresh MUST NOT close it or steal focus)

**Acceptance Criteria:**
- Refetch triggers: pathname change, an interval of ~30s (≤60s), and tab re-focus (`visibilitychange`)
- The interval is cleared on unmount (no leaked timers)
- Notification semantics are unchanged: unread still derives from `Notification.lastReadAt` via the existing `getUnreadNotifications` path, and preference gating is untouched
- Implemented by `app/_design/useLiveCounts.ts`; when the shell drives the bell (passing `count`), the bell MUST NOT open a second poll

---

### Requirement: Sidebar Nav Counts Are Live
The sidebar «Мои гиги» / «Чаты» badges MUST reflect current state during a session. They MUST NOT be computed once per shell mount in the server layout and left frozen; they MUST refresh on the same triggers as the bell.

#### Scenario: Chats badge updates after a new message arrives
- GIVEN an authenticated user whose sidebar shows a «Чаты» count of N
- AND the counterparty sends a message on a gig (raising the true unread-conversation count to N+1)
- WHEN the user navigates in-app or the poll interval elapses
- THEN the «Чаты» badge MUST display N+1 without a full page reload

#### Scenario: Gigs badge updates after a gig-set change
- GIVEN an authenticated user whose sidebar shows a «Мои гиги» count
- WHEN the underlying set of their gigs changes and they navigate in-app or the poll elapses
- THEN the badge MUST reflect the new count without a full page reload

#### Scenario: Server-rendered counts are the initial value (no flash)
- GIVEN a fresh page load of a protected route
- WHEN the shell first paints
- THEN the badges MUST render the server-computed counts immediately as their initial value
- AND MUST NOT flash empty/zero before the first client refetch

#### Scenario: Counts remain correctly derived
- GIVEN the live refresh
- WHEN the chats count is recomputed
- THEN it MUST still use `getUnreadChatCount` (gigs with unread messages), matching the inbox badges, per "Unread, Mark-Read, and the Sidebar «Чаты» Count"
- AND the gigs count MUST still be scoped by role (CLIENT → `clientId`, SPECIALIST → `assignedSpecialistId`)

**Acceptance Criteria:**
- `getLiveCounts()` (`app/actions/counts.ts`) returns `{ notifications, gigs, chats }` in one round trip — a single poll feeds the whole shell
- Both the SSR seed (`app/(protected)/layout.tsx`) and the live action derive counts from the SAME helper (`lib/counts.ts`) — the count logic MUST NOT be forked
- `AppShellDesign` seeds from the server-rendered `counts` prop and refetches on pathname change / poll / focus
- The ADMIN shell path (`counts={{}}`) MUST NOT issue count fetches

---

### Requirement: Authenticated Counter Surfaces Are Not Cacheable by an Intermediary
Authenticated, counter-bearing responses MUST be marked uncacheable so a proxy/CDN in front of the app cannot serve another user's or a stale session's HTML by URL.

#### Scenario: Authenticated responses are marked no-store
- GIVEN an authenticated request to a protected route (e.g. `/dashboard`)
- WHEN the response is returned
- THEN it MUST carry a `Cache-Control` header of `no-store` (or equivalently `private, no-store, max-age=0, must-revalidate`)
- AND an intermediary caching by URL MUST NOT be able to serve that response to a later request

#### Scenario: Counter-bearing segments are dynamically rendered
- GIVEN the protected shell and the routes that render counters
- WHEN the app is built
- THEN those segments MUST be dynamically rendered (ƒ via `export const dynamic = 'force-dynamic'`), not statically optimized or full-route cached

#### Scenario: Static and public assets stay cacheable
- GIVEN a static asset or an unauthenticated public route
- WHEN it is served
- THEN it MUST NOT be made uncacheable by this hardening (e.g. `_next/static` keeps `public, max-age=31536000, immutable`)

#### Scenario: A hard reload always reflects current state
- GIVEN a user whose true counts have changed
- WHEN they hard-reload a protected route in the deployed environment
- THEN the response MUST reflect the current counts (never a cached earlier body)
- AND the «F5 не помогает, только перезаход» symptom MUST NOT reproduce

**Acceptance Criteria:**
- `middleware.ts` sets `Cache-Control: private, no-store, max-age=0, must-revalidate` on authenticated responses — it is the single choke point, since it already runs the session/role gate
- The middleware `matcher` MUST cover every counter-bearing surface (`/dashboard`, `/gigs`, `/profile`, `/admin`, `/my-gigs`, `/chats`, `/finances`, `/disputes`, `/settings`); entries beyond the role-gated prefixes are matched for the header only and do not change auth behavior (the `(protected)` layout remains their guard)
- `export const dynamic = 'force-dynamic'` on the protected shell

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

### Requirement: Notification display text SHALL be rendered in Russian

`getNotificationDisplayText` (`lib/notification-utils.ts`) SHALL return Russian text for every notification type/event branch, matching the app's shipped tone. No English SHALL remain in any branch. The dynamic specialist name from `eventData` SHALL be interpolated unchanged. The message-aggregation path in `app/actions/notification.ts` (which sets `displayText` directly without calling `getNotificationDisplayText`) SHALL likewise set Russian text.

#### Scenario: APPLICATION events

- WHEN `type = 'APPLICATION'` and `eventType = 'application_submitted'` with `eventData.specialistName = 'Попова'`
- THEN the text SHALL be «Новая заявка от Попова»
- AND `application_accepted` SHALL be «Ваша заявка принята»
- AND `application_rejected` SHALL be «Ваша заявка отклонена»
- AND `application_withdrawn` with `specialistName = 'Попова'` SHALL be «Попова отозвал(а) заявку»
- AND an unknown/`null` application eventType SHALL be «Обновление по заявке»
- AND when `specialistName` is absent, `application_submitted` SHALL fall back to «Новая заявка от специалиста» and `application_withdrawn` to «Специалист отозвал(а) заявку»

#### Scenario: PAYMENT and STATUS_CHANGE events

- WHEN `type = 'PAYMENT'`
- THEN the text SHALL be «Оплата отмечена»
- AND `STATUS_CHANGE` / `work_submitted` SHALL be «Работа отправлена на проверку»
- AND `STATUS_CHANGE` / `work_approved` SHALL be «Ваша работа принята»
- AND `STATUS_CHANGE` / `payment_marked` SHALL be «Оплата отмечена»
- AND `STATUS_CHANGE` / `gig_updated` SHALL remain «Условия гига обновлены» (unchanged)
- AND an unknown/`null` status eventType SHALL be «Статус гига обновлён»

#### Scenario: MESSAGE / default

- WHEN `type = 'MESSAGE'` (or an unrecognized type)
- THEN `getNotificationDisplayText` SHALL return «Новое сообщение»
- AND the message-aggregation `displayText` in `app/actions/notification.ts` SHALL also be «Новое сообщение»

---

### Requirement: Notification popover chrome SHALL be rendered in Russian

The notifications popover (`app/components/NotificationDropdown.tsx`) SHALL render all static chrome in Russian, and the bell (`app/components/NotificationBell.tsx`) SHALL use Russian accessibility labels. No English SHALL remain in the notifications surface.

#### Scenario: Popover header, states, and update suffix

- WHEN the popover is open
- THEN the header SHALL read «Уведомления» (not «Notifications»)
- AND the loading state SHALL read Russian copy (e.g. «Загрузка уведомлений…»)
- AND the error state SHALL read Russian copy (e.g. «Не удалось загрузить уведомления») with a Russian retry control (e.g. «Повторить»)
- AND the empty state SHALL read Russian copy (e.g. «Нет новых уведомлений» / «Вы всё просмотрели»)
- AND the multi-update suffix SHALL read Russian with correct pluralization (e.g. «(3 обновления)»), replacing «(N updates)»

#### Scenario: Relative-time formatting is Russian

- WHEN a notification timestamp is formatted by the popover's relative-time helper
- THEN «just now» SHALL be Russian (e.g. «только что»)
- AND «Nm ago» SHALL be Russian (e.g. «N мин назад»)
- AND «Nh ago» SHALL be Russian (e.g. «N ч назад»)
- AND «yesterday» SHALL be «вчера»
- AND «N days ago» SHALL be Russian (e.g. «N дн назад»)
- AND the older-than-a-week fallback SHALL keep the existing `ru-RU` `toLocaleDateString` output

#### Scenario: Accessibility labels are Russian

- WHEN assistive technology reads the bell and popover
- THEN the bell button `aria-label` SHALL be Russian (e.g. «Уведомления»)
- AND the popover `aria-label` SHALL be Russian (e.g. «Меню уведомлений»)


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
- AND it MUST link to `/gigs/examples`
- AND it MUST NOT link to `/dashboard/gigs/examples`, which is not a route and yields a 404

#### Scenario: BackButton renders for gig-creation context
- GIVEN a user navigates to a page with `?from=new` query parameter (the examples page, opened from the gig-creation screen)
- WHEN the BackButton component renders
- THEN it MUST display «← Назад к созданию гига» text
- AND it MUST link to `/gigs/new`

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

### Requirement: Examples Page Entry Point and Back Navigation

The gig-creation screen MUST offer a visible, discoverable link to the example gigs, and the examples page MUST include a BackButton so the viewer can return to where they came from. The link navigates in the **same tab**; the in-progress brief is protected by persisting it to `sessionStorage` (see «Create-Gig Draft Survives Navigation»), NOT by opening a new tab. Same-tab navigation is deliberate — a new tab is hard to return from on mobile / in-app (webview) browsers, and the old new-tab «← Назад к созданию гига» control actively misled, loading an empty second form in the new tab rather than the draft.

> History (`examples-for-clients` — Round-3 #10, then `persist-create-gig-draft` — Round-3 follow-up). The entry point was already required, and was **missing**: the re-ground to `CreateGigDesign.tsx` dropped it, and `gig-browse-access.spec.ts` was rewritten to `page.goto` the examples URL rather than click the link — so the suite stayed green while the feature was gone. The E2E now clicks the real link. The `from` value changed from `dashboard` to `new` so the return lands on the creation screen the viewer came from. The link **originally opened a new tab** to protect the client-state brief; that was replaced by sessionStorage persistence + same-tab navigation, because the new tab was fragile on mobile and its back control led to an empty form, not the draft. A later fix (`fix-client-gig-detail-back`) made the gig-detail «Назад» default **role-aware**: C5 only fixed the `?from=examples` path, so a CLIENT opening any ordinary gig still hit `/gigs` → `/dashboard`; the default now sends a CLIENT to `/my-gigs` (see the role-default scenario below).

#### Scenario: The gig-creation screen links to the examples
- GIVEN a CLIENT is on the gig-creation screen (`/gigs/new`, `CreateGigDesign`)
- WHEN the screen renders
- THEN it MUST display a visible link to the example gigs, in Russian («💡 Посмотреть примеры»), positioned as inspiration for writing the brief
- AND the link MUST target `/gigs/examples?from=new`
- AND it MUST navigate in the same tab (a `next/link` anchor, no `target="_blank"`), the brief being protected by draft persistence rather than a new tab
- AND it MUST be token-pure (`gigly_full_design` skin), not kit classes

#### Scenario: The in-progress brief survives opening the examples
- GIVEN a CLIENT has partially filled the creation form (title, description, criteria chips)
- WHEN they open the examples link and return via «← Назад к созданию гига»
- THEN every entered value MUST still be present (restored from the persisted draft)
- AND the readiness checklist/counters (per «Legible «Why Submit Is Disabled» Guidance») MUST be unchanged

#### Scenario: BackButton appears on examples page
- GIVEN a user navigates to `/gigs/examples?from=dashboard`
- WHEN the page renders
- THEN a BackButton component MUST be visible at the top of the page content
- AND clicking the BackButton MUST navigate to `/dashboard`

#### Scenario: BackButton returns to the creation screen
- GIVEN a user is on `/gigs/examples?from=new`
- WHEN the page renders
- THEN the BackButton MUST display «← Назад к созданию гига»
- AND it MUST link to `/gigs/new`

#### Scenario: An example gig's detail returns to the examples
- GIVEN a viewer opens an example gig from the examples list (`/gigs/{id}?from=examples`)
- WHEN the gig-detail screen renders its own back control
- THEN it MUST read «← Назад к примерам» and return to `/gigs/examples`
- AND it MUST NOT return to `/gigs` — that is the SPECIALIST-only search, which redirects a CLIENT on to `/dashboard`, stranding them away from both the examples and their draft

#### Scenario: The gig-detail back control defaults by role without a from parameter
- GIVEN a gig detail opened without `?from` (the ordinary case)
- WHEN the back control renders
- THEN it MUST read «← Назад к гигам»
- AND for a SPECIALIST viewer it MUST target `/gigs` (the search they browse from)
- AND for a CLIENT viewer it MUST target `/my-gigs` — NOT `/gigs`, which is SPECIALIST-only and redirects a CLIENT on to `/dashboard`, stranding them away from their own gigs
- AND the viewer's role MUST be threaded from the server page (`viewerRole` from the session), keeping the decision at the page/data layer

**Note on where the return path lives.** The re-grounded `GigDetail` deliberately ships its **own** «Назад» control and never renders `BackButton` (see `[id]/page.tsx`), so `?from=examples` was inert from the re-ground until the control was made context-aware. `from` is threaded from the server page's `searchParams` rather than read with `useSearchParams`, keeping the data at the page layer. The examples page is the only live consumer of `BackButton`.

---

### Requirement: Create-Gig Draft Survives Navigation

The in-progress «Создать гиг» brief MUST be persisted client-side so that navigating away from `/gigs/new` and back — most importantly to view «Примеры», but also an accidental reload or a mobile tab-switch — restores every entered value. Persistence uses `sessionStorage` (scoped to the tab/session, not `localStorage`), keyed by a single constant owned by `lib/create-gig-draft.ts` (`CREATE_GIG_DRAFT_KEY`). Every storage access MUST be guarded so the form still functions when storage is unavailable (SSR, privacy mode, sandboxed iframe) or full.

> Introduced by `persist-create-gig-draft` (Round-3 follow-up). This is what lets the examples link drop its new tab (see «Examples Page Entry Point and Back Navigation»): the brief is no longer only in volatile component state.

#### Scenario: The brief is restored on return to the creation screen
- GIVEN a CLIENT has entered brief fields (title, category, description, goal, deliverables, budget, deadline, tags, criteria chips)
- WHEN they navigate away from `/gigs/new` and return within the same session
- THEN each field MUST be restored to its entered value from the persisted draft
- AND the restore MUST happen after mount (post-hydration), so the server render and first client render still match

#### Scenario: A successful publish clears the draft
- GIVEN a CLIENT publishes a gig and lands on `/gigs/new/success`
- WHEN the success screen mounts
- THEN the persisted draft MUST be cleared
- AND a subsequent «Создать ещё» (or any later visit to `/gigs/new`) MUST start from an empty form, not the just-published brief

#### Scenario: Persistence is non-fatal when storage is unavailable
- GIVEN `sessionStorage` is unavailable or throws (SSR, privacy mode, quota exceeded)
- WHEN the form saves or restores the draft
- THEN the operation MUST be a silent no-op and the form MUST remain fully usable in-memory

**Acceptance Criteria:**
- `lib/create-gig-draft.ts` owns `CREATE_GIG_DRAFT_KEY`, `loadDraft`, `saveDraft`, `clearDraft`; all storage access guarded + try/catch
- `CreateGigDesign` restores once in a mount effect and saves on every field change (gated on a `restored` flag so the empty initial state never clobbers a saved draft)
- `CreateGigSuccess` calls `clearDraft()` on mount
- `loadDraft` tolerates a missing / corrupt / partially-shaped payload (returns null / a filtered partial)

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
The example gigs page MUST show a dedicated empty state when no example gigs are available, in **Russian**.

> Reconciled by `examples-for-clients`. This previously mandated *the `EmptyState` component* with verbatim English
> copy. That is no longer satisfiable alongside «Example Gigs Page Is Localized and Re-grounded» below: the shared
> `EmptyState` is a pre-reground kit component (`bg-surface-level-1`, `border-neutral-weak`, `text-white`), so
> rendering it would reintroduce exactly the classes that requirement removes. The intent — never show a bare empty
> list — is preserved; the mechanism is now the re-grounded screen's own empty state, matching how the other
> re-grounded screens (e.g. `DisputesDesign`) render theirs.

#### Scenario: No example gigs available
- GIVEN a user (CLIENT or SPECIALIST) is on `/gigs/examples`
- WHEN no example gigs exist in the database
- THEN the page MUST display an empty state with the «✨» icon and a Russian heading/description explaining that examples are not set up yet
- AND it MUST NOT display the superseded English strings «No Example Gigs Available» / «Example gigs haven't been set up yet…»
- AND it MUST NOT render the kit `EmptyState` component, whose classes the token-purity requirement forbids

### Requirement: Example Gigs Page Is Localized and Re-grounded
The `/gigs/examples` page MUST be in Russian and rendered on the `gigly_full_design` skin, consistent with every other re-grounded screen. It is a client-facing inspiration surface reached while writing a brief; English kit copy makes it read as an unfinished internal page. (Source change: `examples-for-clients` — Round-3 #10.)

#### Scenario: The page is Russian
- GIVEN any viewer on `/gigs/examples`
- WHEN the page renders
- THEN the heading («Примеры гигов»), the explanatory copy, and the per-card badge («✨ пример») MUST be in Russian
- AND the English strings «Example Gigs» / «✨ Example» MUST NOT appear

#### Scenario: The page is token-pure
- GIVEN the page renders
- THEN it MUST use the `gigly_full_design` tokens/skin (`app/_design/tokens.css`), not the pre-reground kit classes (`bg-surface-level-*`, `text-neutral-strong`, …)

#### Scenario: Example cards remain navigable with a return path
- GIVEN example gigs exist
- WHEN the list renders
- THEN each card MUST link to that gig's detail with `?from=examples`, so the detail's back control returns to `/gigs/examples`

#### Scenario: The page queries only what it renders
- GIVEN the page's Prisma query
- WHEN it fetches example gigs
- THEN it MUST NOT `include` the client's `email` / `clientProfile` while rendering neither — an unused personal-data include on a page with no role check
- AND it MUST still filter to `isExample: true` AND `status: 'OPEN'`, newest first

**Acceptance Criteria:**
- Access is unchanged: no role gate is added (both CLIENT and SPECIALIST may reach the route, per the Empty State requirement above and the existing `SPECIALIST access` integration tests)
- The specialist empty-browse entry to examples («Gig Browse Page Empty State Enhancement» → "View Example Gigs") is untouched and remains legitimate

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
# UI Specification Delta: Mobile Responsive Optimization

This document describes changes to the UI specification to support comprehensive mobile responsive design.

---

## ADDED Requirements

### Requirement: Responsive Navigation with Hamburger Menu
The main navigation component MUST adapt to mobile viewports by using a hamburger menu to save vertical space and improve usability.

#### Scenario: Desktop navigation displays horizontal links
- GIVEN an authenticated user views the navigation on a desktop viewport (>=768px)
- WHEN the MainNav component renders
- THEN the navigation links MUST be displayed horizontally in the header
- AND the hamburger menu button MUST be hidden
- AND all navigation links MUST be visible and accessible

#### Scenario: Mobile navigation displays hamburger menu
- GIVEN an authenticated user views the navigation on a mobile viewport (<768px)
- WHEN the MainNav component renders
- THEN the horizontal navigation links MUST be hidden
- AND a hamburger menu button (☰) MUST be displayed in the header
- AND the hamburger button MUST have a minimum touch target size of 44x44px
- AND the hamburger button MUST be positioned in the top-right area of the header

#### Scenario: Hamburger menu toggles open and closed
- GIVEN a user on a mobile viewport (<768px)
- WHEN they tap the hamburger menu button
- THEN a mobile menu MUST slide in from the right or top
- AND the mobile menu MUST display all navigation links vertically
- AND tapping the hamburger button again MUST close the menu
- AND tapping outside the menu MUST close the menu

#### Scenario: Mobile menu displays all navigation links
- GIVEN a user opens the mobile menu
- WHEN the menu is displayed
- THEN all navigation links MUST be visible (Dashboard, Post Gig/Browse Gigs, Profile, Admin links)
- AND each link MUST have adequate spacing (minimum 44px height)
- AND the user's email MUST be displayed
- AND the Sign Out button MUST be displayed
- AND all links MUST be tappable with adequate touch targets

#### Scenario: Mobile menu maintains active link highlighting
- GIVEN a user is on a specific page (e.g., /dashboard)
- WHEN they open the mobile menu
- THEN the active navigation link MUST be visually highlighted
- AND the highlighting MUST match the desktop navigation style

#### Scenario: Mobile menu is keyboard accessible
- GIVEN a user opens the mobile menu
- WHEN they navigate with Tab key
- THEN focus MUST move between menu items
- AND pressing Enter on a focused link MUST navigate to that page
- AND pressing Escape MUST close the menu

**Acceptance Criteria:**
- MainNav component uses Tailwind responsive utilities: `hidden md:flex` for desktop nav, `md:hidden` for mobile button
- Hamburger button has minimum 44x44px touch target
- Mobile menu slides in with smooth transition (CSS transition or animation)
- Mobile menu has backdrop overlay (semi-transparent dark background)
- Mobile menu closes on link click, outside click, or Escape key
- Active link highlighting works in mobile menu
- All navigation functionality preserved on mobile

---

### Requirement: Table-to-Card Conversion on Mobile
Data tables MUST convert to card layouts on mobile viewports to prevent horizontal scrolling and improve readability.

#### Scenario: Admin users table displays as table on desktop
- GIVEN an admin user views the users management page on desktop (>=768px)
- WHEN the page renders
- THEN the users data MUST be displayed in a table format
- AND the table MUST show columns: Email, Role, Status, Registered, Actions
- AND the table MUST be fully visible without horizontal scrolling

#### Scenario: Admin users table displays as cards on mobile
- GIVEN an admin user views the users management page on mobile (<768px)
- WHEN the page renders
- THEN the table MUST be hidden
- AND the users data MUST be displayed as cards
- AND each card MUST show: email, role badge, status badge, registered date, action button
- AND cards MUST stack vertically
- AND cards MUST fit within viewport width without horizontal scrolling

#### Scenario: Admin gigs table displays as table on desktop
- GIVEN an admin user views the gigs management page on desktop (>=768px)
- WHEN the page renders
- THEN the gigs data MUST be displayed in a table format
- AND the table MUST show columns: Title, Status, Budget, Client, Created, Actions
- AND the table MUST be fully visible without horizontal scrolling

#### Scenario: Admin gigs table displays as cards on mobile
- GIVEN an admin user views the gigs management page on mobile (<768px)
- WHEN the page renders
- THEN the table MUST be hidden
- AND the gigs data MUST be displayed as cards
- AND each card MUST show: title, status badge, budget, client name, created date, action button
- AND cards MUST stack vertically
- AND cards MUST fit within viewport width without horizontal scrolling

#### Scenario: Card layout maintains all functionality
- GIVEN an admin user views data in card layout on mobile
- WHEN they interact with action buttons (suspend, unsuspend, close)
- THEN all functionality MUST work identically to table layout
- AND action buttons MUST have minimum 44x44px touch targets
- AND success/error feedback MUST display correctly

**Acceptance Criteria:**
- Use Tailwind responsive utilities: `hidden md:table` for tables, `md:hidden` for cards
- Card components created for user and gig data
- Cards use design tokens for styling (bg-surface-level-1, border-neutral-weak)
- Cards have adequate padding and spacing for mobile
- Action buttons in cards have minimum 44x44px touch targets
- All table functionality preserved in card layout
- No horizontal scrolling on mobile

---

### Requirement: Touch Target Size Compliance
All interactive elements MUST meet the minimum touch target size of 44x44px to ensure usability on touch devices.

#### Scenario: Buttons meet minimum touch target size
- GIVEN any page with buttons (submit, cancel, action buttons)
- WHEN the page renders on any viewport
- THEN all buttons MUST have a minimum height of 44px
- AND all buttons MUST have adequate horizontal padding to ensure minimum 44px width
- AND buttons with icons only MUST be at least 44x44px

#### Scenario: Links meet minimum touch target size
- GIVEN any page with clickable links
- WHEN the page renders on any viewport
- THEN all links MUST have adequate padding to ensure minimum 44x44px clickable area
- AND navigation links MUST have minimum 44px height
- AND inline text links MUST have adequate line-height and padding

#### Scenario: Form inputs meet minimum touch target size
- GIVEN any form with input fields
- WHEN the form renders on any viewport
- THEN all text inputs MUST have minimum height of 44px
- AND all textareas MUST have minimum height of 44px
- AND all select dropdowns MUST have minimum height of 44px
- AND all checkboxes and radio buttons MUST have minimum 44x44px clickable area

#### Scenario: Icon buttons meet minimum touch target size
- GIVEN any page with icon-only buttons (hamburger menu, close buttons, etc.)
- WHEN the page renders on any viewport
- THEN all icon buttons MUST be at least 44x44px
- AND icon buttons MUST have visible focus states for accessibility

**Acceptance Criteria:**
- All buttons have `min-h-[44px]` or equivalent padding
- All form inputs have `h-11` (44px) or larger
- All navigation links have adequate padding for 44px height
- Icon buttons have explicit width and height of 44px minimum
- Touch target audit completed and documented
- E2E tests verify critical touch targets meet minimum size

---

### Requirement: Horizontal Scroll Prevention
All pages MUST prevent horizontal scrolling on mobile viewports to ensure content fits within the viewport width.

#### Scenario: No horizontal scrolling on any page
- GIVEN a user views any page on a mobile viewport (375px width)
- WHEN the page renders
- THEN the page MUST NOT have a horizontal scrollbar
- AND all content MUST fit within the viewport width
- AND no content MUST extend beyond the right edge of the viewport

#### Scenario: Wide content adapts to viewport
- GIVEN a page with potentially wide content (tables, long text, images)
- WHEN the page renders on mobile viewport
- THEN wide tables MUST convert to card layouts or scrollable containers
- AND long text MUST wrap to multiple lines
- AND images MUST scale to fit viewport width
- AND fixed-width containers MUST use responsive width (max-w-full, w-full)

#### Scenario: Container padding respects viewport
- GIVEN any page with container padding
- WHEN the page renders on mobile viewport
- THEN container padding MUST be adjusted for mobile (e.g., px-4 instead of px-8)
- AND content MUST not be cut off by excessive padding
- AND adequate padding MUST be maintained for readability

**Acceptance Criteria:**
- All pages tested at 375px viewport width
- No horizontal scrollbar appears on any page
- Wide content uses responsive strategies (card conversion, wrapping, scaling)
- Container classes use responsive padding (px-4 sm:px-6 lg:px-8)
- E2E tests verify no horizontal scrolling
- Manual testing on actual mobile devices (iOS Safari, Android Chrome)

---

## MODIFIED Requirements

### Requirement: Gig Creation Form (Mobile Optimization)
The gig creation form MUST be optimized for mobile viewports with adequate spacing and touch-friendly inputs.

#### Scenario: Form inputs are touch-friendly on mobile
- GIVEN a CLIENT user views the gig creation form on mobile (375px viewport)
- WHEN the form renders
- THEN all input fields MUST have minimum height of 44px
- AND all input fields MUST have adequate padding (16px minimum)
- AND all textareas MUST have minimum height of 44px
- AND the submit button MUST have minimum height of 44px

#### Scenario: Form layout adapts to mobile
- GIVEN a CLIENT user views the gig creation form on mobile
- WHEN the form renders
- THEN the form container MUST fit within viewport width
- AND there MUST be no horizontal scrolling
- AND field labels MUST be clearly visible
- AND spacing between fields MUST be adequate for mobile (16px minimum)

#### Scenario: Form remains fully functional on mobile
- GIVEN a CLIENT user fills out the gig creation form on mobile
- WHEN they interact with form fields and submit
- THEN all form functionality MUST work identically to desktop
- AND validation errors MUST display clearly
- AND the budget preview MUST be visible and readable
- AND the form MUST be submittable without issues

**Acceptance Criteria:**
- All form inputs have `h-11` (44px) or larger
- Input padding adjusted for mobile: `p-4` (16px)
- Form container uses responsive width: `max-w-lg w-full`
- Spacing between fields: `space-y-4` (16px)
- E2E tests verify form usability at 375px viewport
- Manual testing on actual mobile devices

---

### Requirement: Profile Edit Form (Mobile Optimization)
The profile edit form MUST be optimized for mobile viewports with vertical stacking and touch-friendly inputs.

#### Scenario: Form stacks vertically on mobile
- GIVEN a user views the profile edit form on mobile (<1024px viewport)
- WHEN the form renders
- THEN the 2-column grid MUST stack vertically (single column)
- AND all form fields MUST be displayed in a single column
- AND the header card MUST remain at the top
- AND the layout MUST match the profile view page's mobile behavior

#### Scenario: Form inputs are touch-friendly on mobile
- GIVEN a user views the profile edit form on mobile
- WHEN the form renders
- THEN all input fields MUST have minimum height of 44px
- AND all input fields MUST have adequate padding (16px minimum)
- AND all textareas MUST have minimum height of 44px
- AND Save/Cancel buttons MUST have minimum height of 44px

#### Scenario: Form remains fully functional on mobile
- GIVEN a user fills out the profile edit form on mobile
- WHEN they interact with form fields and submit
- THEN all form functionality MUST work identically to desktop
- AND validation errors MUST display clearly
- AND the form MUST be submittable without issues
- AND there MUST be no horizontal scrolling

**Acceptance Criteria:**
- Grid layout uses `grid-cols-1 lg:grid-cols-2` (already implemented)
- All form inputs have `h-11` (44px) or larger
- Input padding adjusted for mobile: `p-4` (16px)
- Save/Cancel buttons have minimum 44px height
- E2E tests verify form usability at 375px viewport
- Manual testing on actual mobile devices

---

### Requirement: Dashboard Pages (Mobile Optimization)
The dashboard pages MUST be optimized for mobile viewports with vertical stacking and touch-friendly interactions.

#### Scenario: Dashboard layout stacks vertically on mobile
- GIVEN a user views their dashboard on mobile (<1024px viewport)
- WHEN the page renders
- THEN the 2-column grid (main content + sidebar) MUST stack vertically
- AND the main content MUST be displayed first
- AND the sidebar MUST be displayed below main content
- AND all cards MUST fit within viewport width

#### Scenario: Dashboard cards are touch-friendly
- GIVEN a user views their dashboard on mobile
- WHEN they interact with gig cards, application cards, or action buttons
- THEN all clickable elements MUST have minimum 44x44px touch targets
- AND card links MUST be easily tappable
- AND buttons MUST have adequate spacing between them

#### Scenario: Dashboard remains fully functional on mobile
- GIVEN a user interacts with their dashboard on mobile
- WHEN they tap links, buttons, or cards
- THEN all functionality MUST work identically to desktop
- AND navigation MUST work correctly
- AND there MUST be no horizontal scrolling
- AND all content MUST be readable

**Acceptance Criteria:**
- Grid layout uses `grid-cols-1 lg:grid-cols-3` or similar responsive breakpoints
- All buttons and links have adequate touch targets (44x44px minimum)
- Cards use responsive padding: `p-4 sm:p-6`
- E2E tests verify dashboard usability at 375px viewport
- Manual testing for both CLIENT and SPECIALIST dashboards

---

## REMOVED Requirements

(No requirements are being removed in this change)

---

<!-- Merged on archive from change: extract-svg-tokens-and-assets (2026-06-14). Source delta retained in openspec/archive/extract-svg-tokens-and-assets/specs/ui/spec.md -->

## ADDED Requirements

### Requirement: Design-System SVG Asset Library
The reusable vector assets embedded in `screens/tokens.svg` and `screens/frames.svg` MUST be sliced into an
importable library of individual, optimized SVG files under `public/assets/design-system/`.

#### Scenario: Asset library directory structure exists
- GIVEN the change is implemented
- WHEN the file system is inspected
- THEN a `public/assets/design-system/` directory MUST exist
- AND it MUST contain the subdirectories `icons/`, `brand/`, and `patterns/`

#### Scenario: The named icon set is sliced into individual SVGs
- GIVEN the `public/assets/design-system/icons/` directory
- WHEN its contents are inspected
- THEN it MUST contain at least one standalone SVG for each of the following, named in kebab-case:
  - the navigation set: `dashboard`, `my-gigs`, `chats`, `finances`, `disputes`, `search`
  - the standalone UI icons present in the SVGs: `bell`, `gear`, `collapse`, `send`, `view-toggle`, `verified`, `status-dot` (plus `filter`, `radio-on`/`radio-off`, `clear`, `star` observed in the library)
- AND `attach` and `eye` are NOT present in the in-hand SVGs (chat composer / auth screen) and are recorded as Figma-sourced residual gaps rather than produced here
- AND each icon MUST be a single self-contained `.svg` file (not a sprite sheet)
- AND additional icons discovered in the SVGs that are not in this list MAY also be included

#### Scenario: Brand and pattern assets are sliced
- GIVEN the asset library
- WHEN `brand/` and `patterns/` are inspected
- THEN `brand/` MUST contain the GIGLY logo / wordmark as an SVG (e.g. `gigly-logo.svg`)
- AND `patterns/` MUST contain the checkerboard pattern as an SVG (e.g. `checkerboard.svg`)

#### Scenario: Sliced assets are faithful to the source
- GIVEN any sliced asset SVG
- WHEN it is rendered and compared to the corresponding region of the source SVG
- THEN it MUST be visually identical to that region (it is a slice, not a redraw)
- AND its colour fills MUST be the exact hex values from the source (no re-colouring or approximation)

**Acceptance Criteria:**
- `public/assets/design-system/{icons,brand,patterns}/` exist
- Every named icon, the logo/wordmark, and the checkerboard exist as individual `.svg` files
- Each asset is a slice of the source geometry, not a hand-redrawn approximation

---

### Requirement: SVG Asset Optimization and Accessibility
Every sliced asset SVG MUST be valid, optimized, and accessible.

#### Scenario: Asset SVGs are valid and carry a viewBox
- GIVEN any `.svg` file in `public/assets/design-system/`
- WHEN the markup is inspected
- THEN it MUST be well-formed XML
- AND the root `<svg>` element MUST include a `viewBox` attribute defining its coordinate system
- AND icon SVGs SHOULD use a consistent square `viewBox`

#### Scenario: Asset SVGs are optimized
- GIVEN any `.svg` file in `public/assets/design-system/`
- WHEN the markup is inspected
- THEN it MUST NOT contain editor metadata, comments, or tool artifacts (e.g. `<metadata>`, `data-figma-*`, Sketch/Illustrator namespaces)
- AND each icon file SHOULD be under 10KB

#### Scenario: Meaningful icons are labelled; decorative assets are hidden
- GIVEN an icon SVG that conveys meaning (e.g. `bell`, `gear`, `verified`)
- WHEN the markup is inspected
- THEN it MUST include either an `aria-label` with descriptive text OR a `role="img"` with a child `<title>`
- AND GIVEN the decorative checkerboard pattern SVG
- THEN it MUST include `aria-hidden="true"` and `role="presentation"`

**Acceptance Criteria:**
- All asset SVGs are well-formed XML with a `viewBox`
- No editor/tool metadata remains; icons are ≤10KB
- Meaningful icons carry accessible names; the decorative pattern is hidden from assistive tech

---

### Requirement: Extracted Colour Palette in DESIGN_SPECS.md
The colour palette MUST be derived from the SVG fills and documented in `docs/DESIGN_SPECS.md` as the raw
observed set, organized by semantic family, with every value traceable to the SVGs.

#### Scenario: DESIGN_SPECS.md documents the palette
- GIVEN the change is implemented
- WHEN `docs/DESIGN_SPECS.md` is inspected
- THEN it MUST contain a colour-palette section listing the distinct fill colours observed in the SVGs
  (approximately 22–23 distinct six-digit hex values)
- AND each colour MUST be presented with its hex value and an observed usage/role label

#### Scenario: Palette covers all required families
- GIVEN the palette section
- WHEN its organization is inspected
- THEN it MUST group colours into at least these families:
  - **surface** (e.g. `#01030e`, `#10121c`, `#0e101a`, `#1a1a24`, `#1a1d2a`)
  - **neutral / border** (e.g. `#8a8f99`, `#9fa0a4`, `#3a3d45`)
  - **brand** (e.g. `#0088ff`, `#0077e6`, `#4cacff`)
  - **status** — the six gig statuses, with their colours (neutral, amber `#f59e0b`, blue `#3b82f6`, purple `#8b5cf6`, green `#10b981`/`#0cc671`, red `#ef4444`/`#ff383c`)
  - **tag / category** (e.g. pink `#f45fb1`, teal `#05c9e6`, orange `#f27c0d`)

#### Scenario: Palette values are real SVG fills (provenance)
- GIVEN any hex value documented in the palette section
- WHEN that hex is searched for in `screens/tokens.svg` or `screens/frames.svg`
- THEN it MUST be found as an actual fill value
- AND no documented colour may be invented, rounded, or carried over from a prior estimate if it does not appear in the SVGs

#### Scenario: Values are raw observed, not normalized
- GIVEN the palette section
- WHEN it is inspected
- THEN it MUST present the **observed** colours as-found
- AND it MUST NOT collapse near-duplicates or assign canonical scale names (e.g. `surface/level-0`) — normalization is deferred to `derive-design-system`

**Acceptance Criteria:**
- `docs/DESIGN_SPECS.md` lists ~22–23 distinct observed fills grouped by family (surface, neutral, brand, status×6, tag/category)
- Every documented hex is grep-findable in the SVGs
- The section is explicitly labelled as observed/raw, not canonical

---

### Requirement: Extracted Radius Set in DESIGN_SPECS.md
The corner-radius set MUST be derived from the SVG `rx` geometry and documented in `docs/DESIGN_SPECS.md` as
the raw observed set.

#### Scenario: DESIGN_SPECS.md documents the radius set
- GIVEN the change is implemented
- WHEN `docs/DESIGN_SPECS.md` is inspected
- THEN it MUST contain a radius section listing the distinct `rx` values observed in the SVGs
- AND the documented set MUST span the observed 2–18px range, including at minimum: `2, 2.5, 3, 3.5, 4, 4.5, 5, 8, 11, 12, 13, 16, 18`

#### Scenario: Radius values are real SVG geometry (provenance)
- GIVEN any radius value documented in the radius section
- WHEN `rx="<value>"` is searched for across `screens/tokens.svg` and `screens/frames.svg`
- THEN it MUST be found
- AND each documented radius SHOULD note an example component/context where it occurs

#### Scenario: Radii are raw observed, not normalized
- GIVEN the radius section
- WHEN it is inspected
- THEN it MUST present the observed values as-found and MUST NOT pre-collapse them into a canonical scale
  (canonicalization is deferred to `derive-design-system`)

**Acceptance Criteria:**
- `docs/DESIGN_SPECS.md` lists the observed radius set spanning 2–18px
- Every documented radius is grep-findable as an `rx` in the SVGs
- The set is presented as observed, not canonical

---

### Requirement: Measured Component Geometry in DESIGN_SPECS.md
Per-component geometry MUST be measured from SVG coordinates and documented in `docs/DESIGN_SPECS.md`, with
no estimated values.

#### Scenario: Geometry is documented per library component
- GIVEN the change is implemented
- WHEN `docs/DESIGN_SPECS.md` is inspected
- THEN it MUST contain a measured-geometry section covering the library components present in the SVGs,
  including at minimum: the sidebar (expanded and collapsed), the topbar, GigCard, button, input, tabs,
  filter, tag / category tag, status badge and status dot, rating, avatar, and view-toggle
- AND for each component it MUST record the measurable values among: outer dimensions, internal paddings,
  gaps between elements, border widths, and icon sizes

#### Scenario: Values are measured from coordinates, not estimated
- GIVEN any geometry value documented for a component
- WHEN its provenance is inspected
- THEN it MUST be derived from SVG coordinates (e.g. element `x`/`y`/`width`/`height`, or the delta between
  two coordinates), with a source hint recorded
- AND the section MUST state that values are measured, not estimated

#### Scenario: Unmeasurable values are flagged, not guessed
- GIVEN a property that cannot be determined from the SVG coordinates (e.g. a hover-only state, or a value
  obscured by an outlined glyph)
- WHEN it is documented
- THEN it MUST be explicitly flagged as not measurable from the SVGs (and routed to the residual-gap list if
  it requires another source)
- AND it MUST NOT be filled in with an estimated number

**Acceptance Criteria:**
- `docs/DESIGN_SPECS.md` documents measured geometry for each named library component
- Each value carries a coordinate-based provenance hint
- Unmeasurable properties are flagged explicitly, never estimated

---

### Requirement: 1440px Reference Renders as the Fidelity Baseline
Reference renders of every library **component** MUST be produced from the SVGs at the 1440px reference width
and committed as the fidelity baseline. The SVGs contain the component library, **not** the 12 assembled
screens; assembled screen frames are staged as interim lossy baselines (from the JPGs) and recorded as a
Figma-sourced residual gap.

#### Scenario: Reference render directory exists
- GIVEN the change is implemented
- WHEN the file system is inspected
- THEN a `docs/design-system/reference-renders/` directory MUST exist
- AND it MUST contain `components/` and `frames/` subdirectories

#### Scenario: Assembled screen frames are staged (interim) and flagged as a Figma gap
- GIVEN the SVGs contain the component library, NOT the 12 assembled screens
- WHEN `docs/design-system/reference-renders/frames/` is inspected
- THEN it MUST contain an interim baseline per screen, sourced from the lossy `screens/*.jpg`
- AND a `README.md` there MUST state these are lossy and that high-fidelity per-screen frames must be exported from Figma
- AND the residual-gap list MUST record assembled screen frames as a Figma-sourced gap

#### Scenario: Every library component is rendered
- GIVEN the components in `screens/tokens.svg`
- WHEN `docs/design-system/reference-renders/components/` is inspected
- THEN it MUST contain a PNG render (full sheet and/or per-component crops) covering every library component
- AND renders MUST be at the 1440px reference fidelity (frames rendered to a 1440px-wide reference)

#### Scenario: Renders are valid raster images
- GIVEN any file under `docs/design-system/reference-renders/`
- WHEN it is inspected
- THEN it MUST be a valid PNG image with non-zero dimensions

**Acceptance Criteria:**
- `docs/design-system/reference-renders/{components,frames}/` exist and are populated
- Component renders cover the full library and are derived **from the SVGs** (valid non-empty PNGs at 1440px reference fidelity)
- An interim baseline per screen is staged from the JPGs (lossy), with a README flagging high-fidelity screen frames as a Figma gap

---

### Requirement: Explicit Residual-Gap List
`docs/DESIGN_SPECS.md` MUST contain an explicit, actionable list of everything the SVGs cannot supply, with
each item routed to Figma / Dev Mode.

#### Scenario: Residual-gap section exists and covers the known categories
- GIVEN the change is implemented
- WHEN `docs/DESIGN_SPECS.md` is inspected
- THEN it MUST contain a "Residual Gaps" section
- AND it MUST cover at least these categories:
  - **Raster banner art** — the cosmic banner imagery (the 2 `<image>` nodes in `frames.svg`), to be exported from Figma
  - **Semantic token names** — to be attached from a fresh Figma token export (the SVGs encode values, not names)
  - **Font metrics** — SF Compact + NKDy Mono (text is outlined to paths in the SVGs; zero `font-family` references), to be obtained from Figma/source + licence
  - **Assembled screen frames** — the 12 screen JPGs are NOT in the SVGs (only the component library is); high-fidelity per-screen frames must come from Figma (interim lossy JPG baselines staged)
  - **Icons absent from the SVGs** — `attach` (chat composer) and `eye` (auth) are not in the component SVGs
  - **Components absent from the SVGs** — any other component referenced by the redesign but not present in `tokens.svg`/`frames.svg`

#### Scenario: Each gap is specific and actionable
- GIVEN any entry in the Residual Gaps section
- WHEN it is read
- THEN it MUST state what is missing, why it cannot come from the SVGs, and the source it must come from
  (e.g. a Figma node, an exported raster, a font file + licence)

#### Scenario: Figma is used only for residual gaps
- GIVEN the extraction work
- WHEN the provenance of palette colours, radii, icon/logo/pattern assets, and component geometry is reviewed
- THEN those MUST all be sourced from the SVGs
- AND Figma / Dev Mode MUST NOT have been used to re-source any value the SVGs already encode

**Acceptance Criteria:**
- `docs/DESIGN_SPECS.md` has a "Residual Gaps" section covering raster banner art, semantic token names, font metrics, and SVG-absent components
- Each gap names what is missing and its required source
- All SVG-recoverable substrate is sourced from the SVGs, not Figma

---

<!-- Merged on archive from change: derive-design-system (2026-06-14). Source delta retained in openspec/archive/derive-design-system/specs/ui/spec.md -->

## ADDED Requirements

### Requirement: Canonical Design Scales
The raw observed values in `docs/DESIGN_SPECS.md` (colour palette, radius set) plus spacing and type MUST be
normalized into canonical **colour**, **radius**, **spacing**, and **type** scales in
`docs/DESIGN_SYSTEM_SPEC.md`. Every raw observed value MUST be accounted for — mapped to a canonical step, or
recorded as a reconciled near-duplicate or a promoted variant — and no canonical value may be introduced that
does not trace to the observed substrate.

#### Scenario: Canonical colour scale defined and every observed fill mapped
- GIVEN the ~22 observed fills in `docs/DESIGN_SPECS.md` §2
- WHEN `docs/DESIGN_SYSTEM_SPEC.md` is inspected
- THEN it MUST define a canonical colour scale organized by role family (surface ramp, text/neutral, border,
  brand ramp, the 6-status set, the 5-category set)
- AND every one of the observed fills MUST appear in a mapping (observed hex → canonical token, or → a logged
  reconciliation decision)
- AND every canonical colour MUST be a hex that is grep-findable in `screens/tokens.svg` or `screens/frames.svg`

#### Scenario: Near-duplicate colours are reconciled
- GIVEN the observed near-duplicate pairs/sets — green `#10b981`/`#0cc671`, red `#ef4444`/`#ff383c`, and the
  blues `#0088ff`/`#4cacff`/`#0077e6`/`#1379f3`/`#0099ff`
- WHEN the colour normalization is inspected
- THEN each near-duplicate MUST either collapse to a single canonical step (with the others recorded as
  collapsed) OR be promoted to a distinct named variant with a stated reason
- AND distinct *roles* that happen to be close (e.g. status-blue `#3b82f6` vs brand-blue `#0088ff`) MUST remain
  separate variants rather than being collapsed

#### Scenario: Canonical radius scale defined and every observed rx mapped
- GIVEN the 13 observed radii (2, 2.5, 3, 3.5, 4, 4.5, 5, 8, 11, 12, 13, 16, 18) in `docs/DESIGN_SPECS.md` §3
- WHEN the radius normalization is inspected
- THEN it MUST define a canonical radius scale of fewer, named steps (e.g. xs/sm/md/lg/xl/pill, plus circular
  for avatars)
- AND each observed `rx` MUST map to a canonical step (with snapped values, e.g. 2.5→2 or 11/13→12, recorded)
- AND the dominant component radius (8px → cards/inputs/buttons) and the pill radius (18px) MUST be preserved
  as canonical steps

#### Scenario: Canonical spacing scale derived from measured geometry
- GIVEN the spacing-like measurements in `docs/DESIGN_SPECS.md` §5 (12px insets, 40px control height / nav
  pitch, etc.) and the screen-observed one-offs (17/20/21/24/30/47px)
- WHEN the spacing scale is inspected
- THEN `docs/DESIGN_SYSTEM_SPEC.md` MUST define a canonical spacing scale on a regular base grid (e.g. base-4)
- AND each observed one-off MUST map to a canonical step (e.g. 17→16, 21→20, 47→48) with the snap recorded, or
  be flagged as a genuine value
- AND the standard control height (40px) and standard icon size (16px) MUST be captured as named size tokens

#### Scenario: Type scale and roles defined, exact metrics flagged forward
- GIVEN that the SVG text is outlined to paths (zero `font-family` refs; exact metrics are a residual gap per
  `docs/DESIGN_SPECS.md` §7)
- WHEN the type section is inspected
- THEN it MUST define a canonical type scale as a set of named roles (e.g. display, heading levels, title,
  body, label, caption, mono) with relative size/weight/line-height structure
- AND it MUST name the intended families (SF Compact, NKDy Mono) and MUST flag the exact font files + metrics +
  SF Compact web licence as a residual resolved in `typography-system`
- AND any measurable type fact (e.g. an observed heading px size) SHOULD be recorded with its provenance

#### Scenario: Genuine divergences become variants, not dropped values
- GIVEN a raw observed value that is judged an intentional difference rather than measurement noise
- WHEN it is normalized
- THEN it MUST be promoted to a named system variant in the canonical scale
- AND it MUST NOT be silently discarded nor copied as a screen-specific special case

**Acceptance Criteria:**
- Canonical colour, radius, spacing, and type scales exist in `docs/DESIGN_SYSTEM_SPEC.md`
- Every observed fill and radius is mapped to a canonical token or a logged reconciliation decision
- Near-duplicates are reconciled (collapsed or promoted to named variants); close-but-distinct roles stay separate
- Type roles are defined; exact font metrics/licence flagged forward to `typography-system`

---

### Requirement: Semantic Token Taxonomy
`docs/DESIGN_SYSTEM_SPEC.md` MUST define the semantic token taxonomy — the namespaces, the naming convention,
and the mapping from every canonical scale value to a semantic name — such that tokens reference **meaning**,
never a raw hex/px. This taxonomy is the shape `design-token-engine` will serialize.

#### Scenario: Token namespaces are defined
- GIVEN the change is implemented
- WHEN the taxonomy section is inspected
- THEN it MUST define namespaces covering at least: `surface/*`, `text/*`, `border/*`, `brand/*`, `status/*`,
  `category/*`, `space/*`, `radius/*`, `type/*`, and `shadow/*` (plus `z/*`, `opacity/*`, `size/*` as needed)
- AND it MUST state a consistent naming convention (e.g. `namespace/role[-modifier]`)

#### Scenario: Every canonical value has a semantic name
- GIVEN the canonical scales from the "Canonical Design Scales" requirement
- WHEN the taxonomy mapping is inspected
- THEN every canonical colour, radius, spacing step, and type role MUST have exactly one semantic token name
- AND the 6 gig statuses and 5 categories MUST each map to a named `status/*` and `category/*` token

#### Scenario: Tokens reference meaning, not raw values
- GIVEN the taxonomy
- WHEN a token name is read
- THEN it MUST encode role/meaning (e.g. `surface/level-2`, `text/muted`, `status/in-progress`,
  `radius/md`, `space/4`) rather than the raw value (e.g. not `blue-0088ff`, not `radius-8`)

**Acceptance Criteria:**
- Namespaces and a naming convention are defined
- Every canonical value maps to exactly one semantic name; statuses (6) and categories (5) are named
- Names encode meaning, not raw values; the taxonomy is serializable by `design-token-engine`

---

### Requirement: Component Vocabulary and Variant/State Matrices
`docs/DESIGN_SYSTEM_SPEC.md` MUST enumerate the component vocabulary — **primitives** and **blocks** — and
define each component's variant / state / size axes, grounded in the states actually present in the library
(`docs/DESIGN_SPECS.md` §4 and the SVGs), not invented.

#### Scenario: Primitive vocabulary is defined with matrices
- GIVEN the change is implemented
- WHEN the primitives section is inspected
- THEN it MUST enumerate at least: Button, Input, PasswordInput, Select, Filter, Tabs, Toggle, Radio, Tag,
  CategoryTag, StatusBadge/Dot, Avatar, Rating, ViewToggle, ProgressBar, SearchInput
- AND each primitive MUST declare its variant/state/size axes (e.g. Button: variant {primary, secondary,
  ghost, link} × state {default, hover, pressed, disabled}; StatusBadge: 6 status variants × form {pill,
  inline-dot}; Filter/Radio: state {off, hover, on, disabled})
- AND the declared states MUST correspond to states observed in the library

#### Scenario: Block vocabulary is defined with variants
- GIVEN the change is implemented
- WHEN the blocks section is inspected
- THEN it MUST enumerate at least: GigCard, ProfileCard, MessageBubble, ConversationItem, NotificationItem,
  SidebarNav, Topbar, FilterBar, BannerCard, StatPanel, RequirementCard, CriteriaList, ClientCard, TermsTabs,
  ApplyPanel, ChatPanel, MessagesPanel
- AND each block MUST declare its variant axes (e.g. GigCard: status×6 × layout {grid, list}; SidebarNav:
  role × {expanded, collapsed})
- AND each block MUST list the primitives it is composed from

#### Scenario: Every library component maps to a vocabulary entry
- GIVEN the component inventory in `docs/DESIGN_SPECS.md` §4
- WHEN the vocabulary is inspected
- THEN every inventoried component MUST correspond to a primitive, a block, or a documented composition of them
- AND no inventoried component may be left without a vocabulary mapping

**Acceptance Criteria:**
- Primitives and blocks are enumerated with variant/state/size matrices grounded in observed states
- Each block lists its constituent primitives
- Every library component in `docs/DESIGN_SPECS.md` §4 maps to a vocabulary entry

---

### Requirement: Layout Grammar and Screen-Composition Pattern
`docs/DESIGN_SYSTEM_SPEC.md` MUST define the layout grammar — the page templates, regions/slots, and content
layout primitives — and the screen-composition pattern by which screens are assembled.

#### Scenario: Page templates are defined
- GIVEN the change is implemented
- WHEN the layout-grammar section is inspected
- THEN it MUST define an `AppShell` template with a sidebar slot, a topbar slot, and a content region, in both
  sidebar **expanded** and **collapsed** states
- AND it MUST define an `AuthLayout` template (centered card region + checkerboard footer) for the auth/register
  screens

#### Scenario: Regions/slots and layout primitives are defined
- GIVEN the layout-grammar section
- WHEN it is inspected
- THEN it MUST define the named regions/slots each template exposes
- AND it MUST define content layout primitives (at least `Stack`, `Grid`, `Split`, `Section`, `Panel`, `Rail`)
- AND those primitives MUST express spacing using the canonical spacing scale (no raw px)

#### Scenario: Screen-composition pattern is specified
- GIVEN the change is implemented
- WHEN the composition section is inspected
- THEN it MUST state the rule that a screen = Template + slotted Blocks + data bindings
- AND it MUST state that screens contain **no styling, no layout literals, and no raw markup** — composition
  only (the rule a later composition lint will enforce)

**Acceptance Criteria:**
- `AppShell` (expanded + collapsed) and `AuthLayout` templates are defined with named regions/slots
- Layout primitives (Stack, Grid, Split, Section, Panel, Rail) are defined on the canonical spacing scale
- The screen-composition pattern and its "composition-only" rule are specified

---

### Requirement: Typed Block View-Model Contracts
Every block in the vocabulary MUST declare a typed **view-model contract** — the named, typed shape of the data
it requires — independent of the Prisma schema, so blocks render from fixtures before Phase 1 models exist.

#### Scenario: Each block declares a typed view-model
- GIVEN the block vocabulary
- WHEN the view-model section is inspected
- THEN every enumerated block MUST have a typed view-model contract listing its fields and their types
- AND the contract MUST be expressed in schema-independent terms (e.g. a `GigCardVM` with `status`,
  `category`, `tags`, `budget`, `deadlineDays`, `rating { value, count, verified }`), not as Prisma models

#### Scenario: Contracts decouple UI from schema
- GIVEN the view-model contracts
- WHEN they are inspected
- THEN they MUST reference the data a block displays, not database tables or query shapes
- AND they SHOULD note which Phase 1 data change is expected to fulfill each contract (per the planning doc's
  data-model worklist) without depending on it existing yet

**Acceptance Criteria:**
- Every block has a typed, schema-independent view-model contract with named fields
- Contracts are renderable from fixtures and note their fulfilling Phase 1 change where applicable

---

### Requirement: DESIGN_SYSTEM_SPEC.md as SSOT with Reconciliation Log
`docs/DESIGN_SYSTEM_SPEC.md` MUST exist, be declared the single source of truth for the design system, contain
(or link to) all of the system definition, and include a **complete Reconciliation Log** recording every
screen/library deviation and its resolution.

#### Scenario: The SSOT document exists and is self-describing
- GIVEN the change is implemented
- WHEN the file system is inspected
- THEN `docs/DESIGN_SYSTEM_SPEC.md` MUST exist
- AND it MUST state that it is the single source of truth for the design system
- AND it MUST contain (or link to) the canonical scales, the token taxonomy, the component vocabulary +
  matrices, the layout grammar, and the block view-model contracts
- AND it MUST reference `docs/DESIGN_SPECS.md` as its raw-substrate provenance

#### Scenario: Reconciliation log records every deviation with a resolution
- GIVEN the screens disagree with each other or with the library (spacing one-offs, near-duplicate colours,
  radius variance, slightly different paddings)
- WHEN the Reconciliation Log section is inspected
- THEN it MUST contain an entry for each such deviation
- AND each entry MUST state the observed deviation, the decision (normalize-to-scale / promote-to-variant /
  flag-for-designer), and the canonical entity it resolves to
- AND the log MUST be complete — no observed deviation left unaddressed

#### Scenario: Screens are treated as samples, not the spec
- GIVEN any screen-level value that differs from the canonical scale
- WHEN its reconciliation entry is read
- THEN the resolution MUST normalize it to the system (or promote a deliberate variant) — never enshrine the
  screenshot value as a one-off
- AND the canonical system, not the screenshot, MUST be stated as authoritative

**Acceptance Criteria:**
- `docs/DESIGN_SYSTEM_SPEC.md` exists, is declared the SSOT, and contains/links all system definitions
- A Reconciliation Log records every deviation → resolution and is complete
- Screens are treated as samples; deviations resolve to the system, not to copied one-offs

---

### Requirement: System Coverage and Traceability
`docs/DESIGN_SYSTEM_SPEC.md` MUST include a **System Coverage Matrix** demonstrating that every library
component and every one of the 12 sample screens maps onto system entities (tokens, primitives, blocks, layout
primitives, templates) with **no unaccounted one-offs**, and that the vocabulary is complete enough for the
later generativity proof.

#### Scenario: Every library component is traced
- GIVEN the component inventory in `docs/DESIGN_SPECS.md` §4
- WHEN the coverage matrix is inspected
- THEN every inventoried component MUST be traced to the primitive/block/composition that represents it
- AND any component with no mapping MUST be recorded as a system gap, not omitted

#### Scenario: Every screen maps to a composition with no orphan one-offs
- GIVEN the 12 sample screens (`screens/auth.jpg`, `reg.jpg`, `reg-customer.jpg`, `reg-specialist.jpg`,
  `customer-dashboard.jpg`, `customer-projects.jpg`, `specialist-dashboard.jpg`, `specialist-gig-search.jpg`,
  `specialist-gig.jpg`, `specialist-projects.jpg`, `specialist-chats.jpg`, `specialist-progile.jpg`)
- WHEN the coverage matrix is inspected
- THEN each screen MUST be expressed as `Template + Blocks + data bindings`
- AND every distinct visual element in each screen MUST resolve to a system entity (token / primitive / block /
  layout primitive)
- AND any element that resolves to none MUST be logged as a one-off in the Reconciliation Log with a resolution
  — there MUST be no unaccounted one-offs

#### Scenario: Every raw value is accounted for
- GIVEN the ~22 observed fills and 13 observed radii in `docs/DESIGN_SPECS.md`
- WHEN the coverage matrix / reconciliation log is inspected
- THEN each observed value MUST resolve to a canonical token or a logged reconciliation decision
- AND the matrix MUST make it verifiable that none was silently dropped

#### Scenario: Vocabulary is complete enough for generativity
- GIVEN the mock-less screens (admin moderation `/admin/*`, Finances, Disputes, Settings)
- WHEN the coverage analysis is inspected
- THEN the spec MUST confirm each is expressible from the defined vocabulary (`AppShell` + existing
  blocks/primitives) with no new system entity
- AND any entity such a screen would require but the library lacks MUST be recorded as a system gap to resolve
  before Phase 2 (feeding the `prove-extensibility-admin` generativity proof)

**Acceptance Criteria:**
- A System Coverage Matrix traces every library component and every one of the 12 screens to system entities
- Every raw observed value resolves to a canonical token or a logged decision — no silent drops
- No unaccounted one-offs remain; mock-less screens are confirmed expressible (generativity-ready), gaps logged

---

<!-- Merged on archive from change: design-token-engine (2026-06-14). Source delta retained in openspec/archive/design-token-engine/specs/ui/spec.md -->

## ADDED Requirements

### Requirement: Serialized Token Source from the Canonical Taxonomy
`openspec/specs/ui/design-tokens.json` MUST be (re)created and shaped to the `docs/DESIGN_SYSTEM_SPEC.md`
taxonomy, with every colour/radius/spacing value tracing to the raw substrate (`docs/DESIGN_SPECS.md` → a real
SVG fill/`rx`/coordinate). It MUST NOT contain pre-redesign "parody" values and MUST NOT re-source values from
Figma (Figma is for names/gaps only).

#### Scenario: Token JSON exists and is shaped to the taxonomy
- GIVEN the canonical taxonomy in `docs/DESIGN_SYSTEM_SPEC.md` §2
- WHEN `openspec/specs/ui/design-tokens.json` is inspected
- THEN the file MUST exist and be valid JSON
- AND it MUST contain the taxonomy namespaces — surface, text, border, brand, status, category, space, radius,
  type, shadow, gradient, z (z-index), opacity, size — named semantically (`namespace/role` → nested
  `namespace.role`)
- AND token names MUST encode meaning (e.g. `status/in-progress`, `surface/level-2`), never the raw value
  (not `blue-3b82f6`, not `radius-8`)

#### Scenario: Every token value traces to the substrate; no parody values
- GIVEN the canonical scales in `docs/DESIGN_SYSTEM_SPEC.md` §1 and the raw fills in `docs/DESIGN_SPECS.md` §2
- WHEN a sample of colour tokens is inspected (e.g. `#0088ff`, `#10b981`, `#f59e0b`, `#f45fb1`)
- THEN each sampled hex MUST be grep-findable in `screens/tokens.svg` or `screens/frames.svg`
- AND no pre-redesign parody hex (e.g. `#0A0E27`, `#0EA5E9`, `#141937`) may appear in the token JSON

#### Scenario: Status and category palettes are present and named
- GIVEN the 6 gig statuses and 5 categories from the SSOT
- WHEN the colour section is inspected
- THEN there MUST be a `status/*` token for each of open, review, in-progress, verification, completed, rejected
- AND a `category/*` token for each of marketing, design, programming, development, coding

#### Scenario: Full token surface is represented
- GIVEN the deliverable list (colour/type/space/radius/shadow/gradient/z-index + status + category)
- WHEN the JSON is inspected
- THEN each of those token groups MUST be present
- AND type tokens MUST express the scale structure (role size/weight/line-height) with the measurable 22px
  heading anchor, while exact font families/metrics + licence are referenced forward to `typography-system`

**Acceptance Criteria:**
- `design-tokens.json` exists, valid, shaped to the taxonomy, semantically named
- Sampled colour/radius values trace to the SVGs; no parody values present
- 6 statuses + 5 categories named; colour/type/space/radius/shadow/gradient/z-index all represented

---

### Requirement: Token Generation Pipeline
`scripts/parse-design-tokens.js` MUST parse the new token JSON without error and regenerate
`scripts/generated-tokens.{js,css}`, which `tailwind.config.ts` MUST consume. The parser MUST be extended to emit
the token types the taxonomy requires while preserving its reference-resolution / hex→rgba / px→rem behaviour.

#### Scenario: Parser runs clean against the new JSON
- GIVEN `openspec/specs/ui/design-tokens.json` shaped to the taxonomy
- WHEN `node scripts/parse-design-tokens.js` is run
- THEN it MUST exit 0 with no error and no unresolved-reference warnings
- AND it MUST write `scripts/generated-tokens.js` and `scripts/generated-tokens.css`

#### Scenario: Parser handles the new token types
- GIVEN the taxonomy adds semantic colour families (`surface/brand/status/category/text/border`) and the groups
  gradient, z-index, opacity, size, plus string radii (`radius/circular`, `radius/pill`)
- WHEN the parser processes the JSON
- THEN it MUST emit tokens for those groups (not silently drop them)
- AND string-valued radii (e.g. `circular = 50%`) MUST be emitted as-is rather than coerced to `NaNpx`

#### Scenario: Generated outputs are in sync with the JSON
- GIVEN the committed `scripts/generated-tokens.{js,css}`
- WHEN the parser is re-run
- THEN the regenerated files MUST match the committed files (ignoring the `Generated:` timestamp line)
- AND no token may be hand-edited in the generated files (they are build artifacts of the JSON)

#### Scenario: Tailwind consumes the tokens and the build passes
- GIVEN `tailwind.config.ts` requires `./scripts/generated-tokens.js`
- WHEN `npm run build` is run
- THEN the build MUST pass
- AND the token colour/spacing/radius/type scales MUST be available as Tailwind utilities

**Acceptance Criteria:**
- Parser exits clean and regenerates both output files; outputs in sync with the JSON
- New token types (gradient, z-index, string radii, semantic colour families, opacity, size) are emitted
- Tailwind consumes the tokens; `npm run build` passes

---

### Requirement: Clean Cutover Without a Legacy-Name Shim
The legacy/parody manual palettes MUST be removed from `tailwind.config.ts` and **no legacy-name shim** may be
introduced. The deleted parody `design-tokens.json` values and names MUST NOT be resurrected. The app is
pre-launch and Phase 2 recomposes every screen, so the ~770 existing consumers of old token *class names* are NOT
hand-patched here; `npm run build` and `npm run test:unit` MUST stay green, with the only build-safety obligation
being that `@apply` directives and CSS-var anchors remain valid.

#### Scenario: Legacy/parody palettes are removed
- GIVEN the legacy manual colour blocks in `tailwind.config.ts` (`navy`, `blue`, `gray`, `success`, `warning`,
  `error`, and stale pre-redesign values)
- WHEN `tailwind.config.ts` is inspected after the change
- THEN those parody palettes MUST be removed (or replaced by token-backed values), leaving the token-driven
  scales as the source
- AND no parody hex (e.g. `#0A0E27`, `#0EA5E9`) may remain in the config

#### Scenario: No legacy-name shim is introduced
- GIVEN the project guidance that the deleted JSON/names are the parody and stay gone
- WHEN the change is inspected
- THEN there MUST NOT be a shim module/alias mapping old parody names onto new tokens
- AND the token API surface MUST be the new semantic names only

#### Scenario: Build and unit suite stay green after cutover
- GIVEN old token class names may be referenced by Phase-2-doomed components (not hand-patched here)
- WHEN `npm run build` and `npm run test:unit` are run after the cutover
- THEN both MUST pass
- AND undefined `className` utilities in doomed components are acceptable (Tailwind drops them; visual-only)
- AND every `@apply` directive and CSS-var anchor in `app/globals.css` MUST resolve to a defined token/class
  (an `@apply` of an undefined class is a build error and MUST NOT occur)

**Acceptance Criteria:**
- Legacy/parody palettes removed from `tailwind.config.ts`; no parody hex remains
- No legacy-name shim exists; the semantic names are the only token API
- `npm run build` + `npm run test:unit` pass; all `@apply`/CSS-var anchors resolve

---

### Requirement: Token-Purity Lint (baseline-then-tighten)
A token-purity lint MUST exist and MUST **fail** on raw colour/spacing/radius/type literals used outside the token
system, and **pass** on token-pure code. Because ~62 raw-hex literals already exist in Phase-2-doomed legacy
components, the lint MUST use a **baseline-then-tighten** policy: pre-existing violations are recorded in a
baseline and do not block, while any **new** violation hard-fails. This makes Fidelity DoD **F2** structural for
all new code; a later cleanup change flips the policy to fail-on-all once legacy components are recomposed.

#### Scenario: Lint runs and passes on the baselined codebase
- GIVEN the lint is wired into a `lint:tokens` script (referenced by the build/CI) with a baseline of pre-existing
  legacy violations
- WHEN the lint runs against the current codebase
- THEN the token-purity check MUST execute
- AND it MUST pass (the baselined pre-existing violations do not block)

#### Scenario: Lint fails on a new planted raw literal
- GIVEN a deliberately planted, non-baselined off-token literal (e.g. `color: #123456` or `padding: 7px`) in app
  source
- WHEN the lint runs
- THEN it MUST report the violation and exit non-zero (fail)
- AND the message MUST identify the offending literal/location

#### Scenario: Lint allows non-design literals and token references
- GIVEN allowlisted values (`0`, `transparent`, `currentColor`, `inherit`) and token-based utilities/vars
- WHEN the lint runs
- THEN those MUST NOT be flagged
- AND values expressed via tokens (Tailwind token utilities / `var(--token)`) MUST pass

**Acceptance Criteria:**
- The lint executes (in `lint:tokens`/build) and passes on the baselined codebase
- It fails (non-zero) on a new, non-baselined raw colour/spacing/radius/type literal, identifying it
- Pre-existing legacy violations are baselined; allowlisted literals and token references are not flagged

---

### Requirement: Token Validation Replacing the Deleted Profile-Tokens Test
Fresh token validation MUST replace the deleted `scripts/validate-profile-tokens.mjs` /
`__tests__/unit/profile-tokens.test.ts`, asserting the token JSON's integrity and that the generated outputs
match it.

#### Scenario: Validation asserts JSON integrity and taxonomy coverage
- GIVEN the new validation (script and/or unit test)
- WHEN it runs
- THEN it MUST assert `design-tokens.json` parses and contains every required taxonomy namespace
- AND it MUST assert the 6 statuses + 5 categories are present

#### Scenario: Validation asserts generated outputs are in sync
- GIVEN the committed `scripts/generated-tokens.{js,css}`
- WHEN the validation runs
- THEN it MUST detect drift between the JSON and the generated outputs (ignoring the timestamp line)
- AND it MUST fail if a generated file was hand-edited or left stale

#### Scenario: Validation runs in the unit suite and is green
- GIVEN the validation is wired into `npm run test:unit`
- WHEN the suite runs
- THEN the token validation MUST pass
- AND the overall unit suite MUST remain green

**Acceptance Criteria:**
- Fresh validation asserts JSON integrity + taxonomy coverage (statuses/categories included)
- It detects JSON↔generated drift and fails on staleness/hand-edits
- It runs in `npm run test:unit` and the suite is green

---

<!-- Merged on archive from change: reconcile-design-tokens-from-figma (2026-06-17). Source delta retained in openspec/archive/reconcile-design-tokens-from-figma/specs/ui/spec.md -->

## ADDED Requirements

### Requirement: Screen-Level Blue Reconciliation
The system MUST account for every blue observed in the Figma component/screen designs against the token
palette, leaving no unaccounted near-duplicate. The role/specialty blue `#006ccb` (job-experience role
text, node `3088:3896`) MUST be resolved to a recorded decision — either normalized to an existing brand
token or sanctioned as a new semantic token — and MUST NOT survive as a raw, untokened literal.

#### Scenario: The three blues are each mapped to a token
- GIVEN `#0088ff` (brand/default), `#4cacff` (brand/highlight), and `#006ccb` (role/specialty text)
- WHEN the token palette and the reconciliation log are inspected
- THEN `#0088ff` MUST map to `color-semantic.brand.default` and `#4cacff` to `color-semantic.brand.highlight`
- AND `#006ccb` MUST be recorded as either normalized to an existing brand token (recommended: `brand.default`)
  or added as a new semantic token (e.g. `brand.link`)
- AND the chosen resolution MUST be written to the reconciliation log with its rationale

#### Scenario: No unaccounted blue remains a raw literal target
- GIVEN the recorded decision for `#006ccb`
- WHEN `design-tokens.json` is inspected
- THEN `#006ccb` MUST NOT appear as an orphan value with no semantic name UNLESS the decision sanctioned it
  as a named token
- AND if normalized, the log MUST state which token the JobExperienceCard role text will bind to (so the
  later block change has a token target, not a hex)

### Requirement: Non-Token Font Family Decision
The three font families seen raw in the Figma designs — `Vremena Grotesk`, `IBM Plex Sans`, and `Inter` —
MUST be resolved to a recorded decision, since the token model binds only two families (`font.family.sans`
= SF Compact, `font.family.mono` = NKDuy Mono). Each MUST be either added as a family token or mapped to an
existing family token; the decision and its rationale MUST be recorded.

#### Scenario: Each non-token family has a recorded resolution
- GIVEN `Vremena Grotesk` (message/notification/value text), `IBM Plex Sans` (embedded gig titles + file chip),
  and `Inter` (attention-card emoji markers)
- WHEN the reconciliation log is inspected
- THEN each family MUST have an explicit resolution — "add family token" OR "map to `font.family.sans`/`mono`"
- AND `Inter` MUST be noted as already the dev-stage substitute for `font.family.sans` (not a third family in code)
- AND the recommended resolution (map Vremena/IBM Plex to existing families for MVP, flag for designer
  confirmation) MUST be recorded unless the designer confirms intentional distinct families

#### Scenario: No new family token is added without a recorded justification
- GIVEN the recommended "no new family tokens for MVP" decision
- WHEN `design-tokens.json` `font.family` is inspected
- THEN it MUST contain only the justified families (expected: `sans`, `mono` unchanged)
- AND any added family token MUST carry a description citing the designer confirmation that motivated it

### Requirement: Category Hue Binding Confirmation
Because the tag/Category hues exist in Figma only as component-variant fills (raw hex, not bound variables),
the five-hue `category.*` mapping in the SSOT MUST be confirmed against the Figma component fills and the
`marketing #0088ff` vs `Blue #4cacff` ambiguity resolved, with the result recorded.

#### Scenario: The five category hues are confirmed against component fills
- GIVEN `category.marketing #0088ff`, `category.design #f45fb1`, `category.programming #0cc671`,
  `category.development #05c9e6`, `category.coding #f27c0d`
- WHEN compared against the `tag`/`Category` component-variant fills in `docs/figma-components-export.md`
  / `docs/figma-component-audit.md`
- THEN each category token value MUST equal its corresponding component fill OR a divergence MUST be logged
- AND the `marketing #0088ff` vs `Blue #4cacff` ambiguity MUST be resolved in the log (recommended:
  `marketing = #0088ff` brand; `#4cacff` is the highlight tint used for the "Стек" Blue tag label, not a category)

### Requirement: Reconciliation Decision Log
Every decision made by token reconciliation MUST be recorded in a durable, human-readable reconciliation log so the
later block/screen changes inherit token targets rather than re-deriving values.

#### Scenario: The log records each residual decision
- GIVEN the reconciliation resolves the third blue, the three non-token families, and the category-hue confirmation
- WHEN the reconciliation log (in `docs/DESIGN_SYSTEM_SPEC.md` or `docs/TOKEN_RECONCILIATION.md`) is inspected
- THEN it MUST contain a dated entry for each decision with: the observed raw value(s), the decision, the
  rationale, and the token target (where applicable)
- AND it MUST cite the originating import doc(s) (`docs/figma-screens-export.md`, `docs/figma-components-export.md`)

### Requirement: Generated Pipeline Stays in Sync With the Reconciled SSOT
After any token edit, `scripts/generated-tokens.{js,css}` MUST be regenerated from `design-tokens.json` and
remain byte-in-sync (ignoring the timestamp line), and token validation MUST assert this so a hand-edit or
stale generation is caught.

#### Scenario: Regeneration is a no-op diff when no token changed
- GIVEN a reconciliation that adds/normalizes no tokens (the common case)
- WHEN `node scripts/parse-design-tokens.js` is run
- THEN `scripts/generated-tokens.{js,css}` MUST be unchanged except for the `Generated:` timestamp line

#### Scenario: A token edit propagates and stays in sync
- GIVEN a decision that DOES add/normalize a token (e.g. a sanctioned `brand.link`)
- WHEN the parser is re-run and `npm run build` executes
- THEN both generated files MUST reflect the edit, the build MUST pass, and the token validation test MUST
  assert the generated outputs match the JSON

#### Scenario: Token-purity lint stays green and still catches new literals
- GIVEN the existing baseline-then-tighten token-purity lint
- WHEN `npm run lint:tokens` (or the build) runs after the reconciliation
- THEN it MUST pass on the baselined codebase
- AND it MUST still fail on a planted, non-baselined off-token literal (e.g. `color: #006ccb`)

---

<!-- Merged on archive from change: add-missing-primitives (2026-06-17). Source delta retained in openspec/archive/add-missing-primitives/specs/ui/spec.md -->

## ADDED Requirements

### Requirement: Icon Button Primitive
An `IconButton` primitive MUST exist (`app/components/primitives/IconButton.tsx`), modelling Figma `button_icon`
(`3828:11151`). It MUST be square `size/control` (40×40), `radius/sm`, hold a `size/icon-rail` (20) icon, and
expose a typed `bg` axis (`no` | `yes`), the interaction states Default/Hover/Active, and an optional counter
badge. It MUST be token-pure (no raw hex/px) and carry an accessible label.

#### Scenario: Renders both bg variants with correct geometry
- GIVEN `<IconButton bg="yes">` and `<IconButton bg="no">`
- WHEN each renders
- THEN both MUST be 40×40 (`h-control w-control`) with `radius/sm` and a 20px icon
- AND `bg="yes"` MUST use the `surface/level-2` token fill; `bg="no"` MUST be transparent
- AND hover/active MUST resolve to surface-token classes (no raw literals)

#### Scenario: Optional counter badge
- GIVEN `<IconButton counter={5}>`
- WHEN it renders
- THEN a badge MUST appear top-right using the `brand/default` token fill and an inverse-text token
- AND when `counter` is absent, no badge renders

#### Scenario: Accessible and token-pure
- GIVEN any `IconButton`
- WHEN it renders
- THEN it MUST expose an accessible name (`aria-label`, required by the type)
- AND the token-purity lint MUST report zero new off-token literals for the file

#### Scenario: Genuine icon-only controls are refactored
- GIVEN the blocks that faked an icon-only control via `Button variant=ghost` + a bare `Icon`
- WHEN they are inspected after the change
- THEN the four icon-only edit affordances (`ProfileHeader`, `CategoryTags`, `ExperienceList`, `TagList`) MUST use `IconButton`
- AND controls that are NOT the `button_icon` atom — a brand-filled CTA (ChatPanel send), a text fallback
  (ChatPanel «Файл»), and text logout buttons (`SidebarNav`/`SidebarNavLive` «Выйти») — MUST remain `Button`, not `IconButton`

### Requirement: Specialty Tag Primitive
A `SpecialtyTag` primitive MUST exist, modelling Figma `Специальность` (`3435:5794`): a chip with brand-blue
**mono** text (`type/data` family `mono`) on a white fill, with `S` and `XS` size tiers (`type/data` → `type/data-small`).
It MUST be token-pure; the white fill MUST be expressed via the `surface/inverse` token, not a raw literal.

#### Scenario: Renders brand-blue mono text on a tokened white fill
- GIVEN `<SpecialtyTag size="S">[Senior Frontend Engineer]</SpecialtyTag>`
- WHEN it renders
- THEN the text MUST use the `brand/default` colour token and the `mono` family at the `type/data` step
- AND the fill MUST be the `surface/inverse` token (`bg-surface-inverse`), not `#ffffff`
- AND padding MUST use `space/sm` (8) horizontally

#### Scenario: Both size tiers
- GIVEN `size="S"` and `size="XS"`
- WHEN each renders
- THEN `S` MUST use `type/data` (14) and `XS` MUST use `type/data-small` (12)
- AND the typed API MUST reject any size outside `{S, XS}`

#### Scenario: Token-pure
- GIVEN the `SpecialtyTag` file
- WHEN the token-purity lint runs
- THEN it MUST report zero new off-token literals

### Requirement: Button Size Tiers and Danger Variant
The `Button` primitive MUST gain a `Tetriary` 32px size tier and a `danger` variant, modelling Figma `Button`
(`3149:3432`: Tetriary `3179:4001`, session-delete `3152:3486`), without changing the existing
`primary|secondary|ghost|link` behaviour or the default `md` (40h) size.

#### Scenario: Size axis is real (not a dead union)
- GIVEN `<Button size="sm">` and `<Button size="md">`
- WHEN each renders
- THEN `sm` MUST be 32px tall (the Tetriary tier) and `md` MUST remain 40px (`size/control`)
- AND the typed `size` union MUST include both and reject any other value
- AND existing `md` consumers MUST render unchanged

#### Scenario: Danger variant is token-pure
- GIVEN `<Button variant="danger">`
- WHEN it renders
- THEN it MUST use the `status/rejected` token for text and a tinted fill (`status-rejected` at reduced alpha)
  with a `border/default` border — NO raw `#FF383C`/`#ef4444` literal
- AND the iOS-red ↔ `status/rejected` delta MUST be recorded in the reconciliation log (§10.2)

#### Scenario: Variant union extended without regressions
- GIVEN the `ButtonVariant` union
- WHEN inspected
- THEN it MUST include `danger` alongside the existing four
- AND existing Button render tests MUST stay green

### Requirement: Filter Group Expand/Collapse Axis
The filter primitives MUST support the `Expand` axis from Figma `Filter` (`2826:2529`, Expand=yes `3904:6136`):
a `FilterGroup` that shows a header and expands/collapses its `Filter` option rows. It MUST be token-pure and
keyboard-operable.

#### Scenario: Expanded shows options, collapsed hides them
- GIVEN a `FilterGroup` with `expanded={true}` then `expanded={false}`
- WHEN each renders
- THEN expanded MUST render its `Filter` option rows; collapsed MUST hide them
- AND the header MUST expose `aria-expanded` reflecting the state

#### Scenario: Composes existing Filter rows
- GIVEN the group
- WHEN it renders its options
- THEN each option MUST be the existing `Filter` (Radio + label + optional count) primitive — not a re-implementation
- AND the token-purity lint MUST report zero new off-token literals

#### Scenario: Toggle is controllable
- GIVEN an `onToggle` handler
- WHEN the header is activated (click / Enter / Space)
- THEN `onToggle` MUST fire so the parent can flip `expanded`

### Requirement: Select Option Disabled State
`Select` MUST support a per-option `disabled` state, modelling Figma `dropdown/item` Disabled (`3907:6167`).
A disabled option MUST be visually de-emphasised (the `opacity/disabled` token), non-selectable, and marked for
assistive tech.

#### Scenario: Disabled option is non-interactive
- GIVEN a `SelectOption` with `disabled: true` in an expanded `Select`
- WHEN the option renders and is clicked
- THEN it MUST NOT fire `onSelect`
- AND it MUST carry `aria-disabled="true"`
- AND it MUST use the `opacity/disabled` token for de-emphasis (no raw opacity literal)

#### Scenario: Enabled options unaffected
- GIVEN a mix of enabled and disabled options
- WHEN the list renders
- THEN enabled options MUST still select on click and show the selected/hover states
- AND the `SelectOption` type MUST accept an optional `disabled?: boolean`

### Requirement: New Primitives Are Catalogued and Token-Validated
Every primitive/axis added by this change MUST appear in the workbench catalog with all its states, MUST have
render/state tests, and MUST keep the token pipeline green.

#### Scenario: Workbench shows all new states
- GIVEN `app/workbench/primitives/page.tsx` (via the catalog registry)
- WHEN it renders
- THEN it MUST include `IconButton` (bg no/yes, +counter), `SpecialtyTag` (S/XS), `Button` (sm tier + danger),
  the Filter expand group, and a disabled `Select` option

#### Scenario: Render tests and lints pass
- GIVEN `__tests__/unit/components/ui-primitives.test.tsx` extended for the new primitives
- WHEN `npm run test:unit`, `npm run lint:tokens`, and `npm run validate:tokens` run
- THEN the new render/state tests MUST pass, the token-purity lint MUST report no new off-token literals,
  and the generated outputs MUST stay in sync with the JSON (the added `surface/inverse` token included)
- AND `npm run build` MUST pass

---

<!-- Merged on archive from change: reconcile-attention-card-and-settings-composites (2026-06-17). Source delta retained in openspec/archive/reconcile-attention-card-and-settings-composites/specs/ui/spec.md -->

## ADDED Requirements

### Requirement: Attention Notification Accent Tokens
A semantic `attention/*` colour token group MUST exist in `design-tokens.json`, encoding the six
notification-**type** accents (distinct from the gig-`status/*` palette). Each token MUST be a single
canonical value; AttentionCard MUST reference these tokens, never raw hex.

#### Scenario: Six attention accents are named and distinct from status
- GIVEN the notification types status-change, message, deadline, accepted, rejected, payment
- WHEN `design-tokens.json` `color-semantic.attention` is inspected
- THEN it MUST define `status-change` (#7c3aed), `message` (#2563eb), `deadline` (#ea580c),
  `accepted` (#16a34a), `rejected` (#9ca3af, neutral), `payment` (#0891b2)
- AND these MUST be separate tokens from `status/*` (e.g. `attention/rejected` is gray, not `status/rejected` red)
- AND the generated `scripts/generated-tokens.{js,css}` MUST emit the group and stay in sync with the JSON

#### Scenario: Per-type glow is tokenised, not raw
- GIVEN the AttentionCard ambient glow keyed to each accent
- WHEN the glow is implemented
- THEN it MUST derive from a `gradient/attention-*-glow` token (mirroring `gradient/status-completed-glow`)
  — NO raw hex radial-gradient literal in component source

### Requirement: AttentionCard Block
An `AttentionCard` block MUST exist, modelling Figma `attention card` (`3367:3916`). It MUST be **data-driven
by notification type** (one implementation; no per-variant copies), with the type accent driving the marker,
the left `border-l-4` accent, and the ambient glow, while the **embedded gig/message block keeps its own
gig-status styling**. It MUST be token-pure and declare a typed view-model.

#### Scenario: Type drives the accent in one code path
- GIVEN `AttentionCard` rendered for each of the six types from fixtures
- WHEN each renders
- THEN the marker fill, the left accent, and the glow MUST all resolve to that type's `attention/*` token
- AND there MUST be a single component (a `type → token` map), not six hand-written variants

#### Scenario: Shell geometry and structure match the source
- GIVEN any AttentionCard
- WHEN it renders
- THEN it MUST be a `radius/xl` card with a `border/default` hairline, a header (marker + title + relative
  date), an embedded content block, and a full-width CTA whose fill is the type accent token
- AND the left accent MUST be a 4px left edge in the type accent token

#### Scenario: Embedded block keeps its own gig-status glow
- GIVEN a variant whose embedded block is a gig card (e.g. accepted / rejected / payment)
- WHEN it renders
- THEN the embedded block MUST use its gig-status accent (independent of the outer attention accent)
- AND the message-type variant MUST embed a message preview block instead

#### Scenario: Token-pure
- GIVEN the `AttentionCard` file
- WHEN the token-purity lint runs
- THEN it MUST report zero new off-token literals

### Requirement: Settings Field Blocks (ToggleField, CheckField)
`ToggleField` and `CheckField` blocks MUST exist, modelling Figma `toggle field` (`3138:3199`) and
`check field` (`3138:3148`). Both MUST be token-pure and declare typed view-models.

#### Scenario: ToggleField is a titled+described toggle row
- GIVEN `<ToggleField>` with a title, description, and `checked`
- WHEN it renders
- THEN it MUST show the title (label type), the description (muted body), and a `Toggle` primitive reflecting `checked`
- AND toggling MUST invoke its `onChange`

#### Scenario: CheckField is a single-select list
- GIVEN `<CheckField>` with options where one is selected
- WHEN it renders
- THEN each row MUST show a circle (unselected) / check-circle (selected) indicator + a label, composing the
  `Radio` primitive (the Figma circle/check-circle maps to the exported radio-off/radio-on assets — not redrawn)
- AND selecting a row MUST invoke `onChange` with that row's key

### Requirement: SessionRow Block
A `SessionRow` block MUST exist, modelling Figma `session` (`3149:2645`) with `Default | active | delete`
states, reusing existing primitives. It MUST be token-pure.

#### Scenario: Three states reuse existing primitives
- GIVEN `state="Default"`, `state="active"`, `state="delete"`
- WHEN each renders
- THEN Default MUST show title + description + a remove affordance (`IconButton`)
- AND active MUST show the «Текущий» pill via `StatusBadge variant="current"` (no bespoke pill)
- AND delete MUST show the destructive `Button variant="danger"` (no raw red literal)

#### Scenario: Token-pure
- GIVEN the `SessionRow` file
- WHEN the token-purity lint runs
- THEN it MUST report zero new off-token literals

### Requirement: FileChip Block
A `FileChip` block MUST exist, modelling Figma `file` (`3600:5262`): a row with an optional file-type icon,
filename, and size, on the `overlay/line` surface. It MUST be token-pure and declare a typed view-model.

#### Scenario: Renders name + size on the overlay token surface
- GIVEN `<FileChip name="ТЗ.doc" size="15 MB">`
- WHEN it renders
- THEN it MUST show the name and the size on an `overlay/line` token fill at `radius/md`
- AND the file-type icon MUST render when provided; the file-earmark glyph is a residual (routed to Figma
  export), so the icon slot is optional, NOT redrawn
- AND the typography MUST use family tokens (sans per the RC-S2 decision), no raw font-family literal

### Requirement: New Composites Are Catalogued and Validated
Every block added by this change MUST appear in the workbench catalog with its states, MUST have render/state
tests, and MUST keep the token pipeline + lint green.

#### Scenario: Workbench shows the new blocks
- GIVEN the workbench catalog registry
- WHEN the catalog renders
- THEN it MUST include `AttentionCard` (all six types), `ToggleField`, `CheckField`, `SessionRow`
  (Default/active/delete), and `FileChip`, each mapped to a `reference`

#### Scenario: Render tests, lints, and build pass
- GIVEN `__tests__/unit/components/domain-blocks.test.tsx` extended for the new blocks
- WHEN `npm run test:unit`, `npm run lint:tokens`, `npm run validate:tokens`, and `npm run build` run
- THEN the new render/state tests MUST pass; the token-purity lint MUST report no new off-token literals;
  the generated token outputs MUST stay in sync with the JSON (the `attention/*` group included);
  and the build MUST pass

---

<!-- Merged on archive from change: add-profile-and-gig-detail-blocks (2026-06-17). Source delta retained in openspec/archive/add-profile-and-gig-detail-blocks/specs/ui/spec.md. NB the RequirementCard + CriteriaList requirements below RECONCILE (supersede) their prior inline presentations in the domain-blocks vocabulary. -->

## ADDED Requirements

### Requirement: SectionHeader Block
A `SectionHeader` block MUST exist, modelling Figma `H/H1/BLOCK` (`3371:5248`): the «БЛОК» section
heading — a `type/h1` (24px, mono) title with an optional trailing icon and an optional count. It MUST be
token-pure, and the hand-rolled section headings in `TagList`, `CategoryTags`, and `ExperienceList` MUST adopt it.

#### Scenario: Renders the title at the h1 (24 mono) role
- GIVEN `<SectionHeader title="Стек">`
- WHEN it renders
- THEN the title MUST use `text-h1 font-h1` (Figma H2 = 24px, the mono family) — NOT `text-h2` (18 sans)
- AND the file MUST be token-pure (no raw hex/px)

#### Scenario: Optional trailing icon and count
- GIVEN `<SectionHeader title="Стек" icon={ICON.gear} count={5}>`
- WHEN it renders
- THEN a trailing icon MUST render when `icon` is set, and a count when `count` is set

#### Scenario: Hand-rolled headings adopt SectionHeader
- GIVEN `TagList`, `CategoryTags`, `ExperienceList` (which rendered section titles as `text-h2 font-h2`)
- WHEN they are inspected after the change
- THEN each MUST render its section title via `SectionHeader` (no bespoke heading span)

### Requirement: JobExperienceCard Block
A `JobExperienceCard` block MUST exist, modelling Figma `job experience` (`3088:3896`): a `border/default`
(frame-stroke) card with company + period, a role line, and a description. `ExperienceList` MUST compose it
instead of inlining the entry. It MUST be token-pure and declare a typed view-model.

#### Scenario: Renders company, period, role, description
- GIVEN `<JobExperienceCard>` with company, period, title (role), description
- WHEN it renders
- THEN it MUST show the company, the period (muted), the role line, and the description (muted body)
- AND the role-line colour MUST be `text-brand-default` (RC-S1 — the Figma role-blue normalised to brand/default), not a raw hex

#### Scenario: ExperienceList composes JobExperienceCard
- GIVEN `ExperienceList` with experience entries
- WHEN it renders
- THEN each entry MUST be a `JobExperienceCard` (not inlined markup)
- AND the token-purity lint MUST report zero new off-token literals

### Requirement: CriteriaRow Item
A `CriteriaRow` item component MUST exist, modelling Figma `критерий` (`2932:7224`): a numbered left block in
the brand accent + an on-accent digit + a title + optional description. It MUST be token-pure and is the item
`CriteriaList` maps over (NOT a parallel list block).

#### Scenario: Numbered row with on-accent digit
- GIVEN `<CriteriaRow index={1} title="Data Fetching" description="…">`
- WHEN it renders
- THEN the number block MUST use `bg-brand-default` with the digit in `text-surface-level-0` (on-accent dark)
- AND it MUST show the title (strong) and the description (muted) when present
- AND it MUST be token-pure (no raw hex/px)

### Requirement: RequirementCard Tile Presentation
`RequirementCard` MUST render the Figma `требование` tile (`2932:7177`) — superseding any prior presentation: a
`border/default` (frame-stroke) hairline card at `radius/md`, a `justify-between` column with a min height, an
18px (sans) title and a 14px muted description. It MUST be token-pure and keep `RequirementCardVM` so
`GigDetail.tsx` is unaffected.

#### Scenario: Renders as a frame-stroke tile
- GIVEN `<RequirementCard>` with a title and body
- WHEN it renders
- THEN the container MUST use `border-overlay-line-strong` (frame-stroke) at `radius/md`
- AND the title MUST be `text-h2 font-h2` (18 sans) and the body `text-body font-body text-muted`
- AND the layout MUST be a `justify-between` column
- AND the existing `RequirementCardVM` MUST keep compiling in `GigDetail.tsx`

### Requirement: CriteriaList Numbered Presentation
`CriteriaList` MUST render the Figma `критерии успеха` list as **numbered** `CriteriaRow` items (title +
optional description) — superseding the prior met/unmet checklist. The VM item gains an optional `description`;
`met` becomes optional/ignored and back-compatible so `GigDetail.tsx` still compiles.

#### Scenario: Renders numbered CriteriaRow items
- GIVEN `<CriteriaList>` with N items
- WHEN it renders
- THEN it MUST render N `CriteriaRow` items numbered 1..N (each label as title, + description when present)
- AND it MUST NOT render the prior met/unmet `verified` checklist asset
- AND the prior `CriteriaListVM` items (`{ label, met? }`) MUST keep compiling

### Requirement: Profile/Gig-detail Blocks Catalogued and Tested
Every block added or reconciled by this change MUST appear in the workbench catalog with its states, MUST have
render tests, and MUST keep the suite + lints green.

#### Scenario: Workbench + tests
- GIVEN the workbench catalog registry and `__tests__/unit/components/domain-blocks.test.tsx`
- WHEN the catalog renders and `npm run test:unit`, `npm run lint:tokens`, `npm run build` run
- THEN the catalog MUST include `SectionHeader`, `JobExperienceCard`, the reconciled `RequirementCard` tile,
  and the reconciled numbered `CriteriaList`
- AND the render tests MUST pass, the token-purity lint MUST report no new off-token literals, and the build MUST pass

---

<!-- Merged on archive from change: add-onboarding-and-auth-blocks (2026-06-18). Source delta retained in openspec/archive/add-onboarding-and-auth-blocks/specs/ui/spec.md -->

## ADDED Requirements

### Requirement: Textarea Primitive
A `Textarea` primitive MUST exist (`app/components/primitives/Textarea.tsx`), modelling the Figma cover-letter
field (`2860:2430`): a multi-line input on an `overlay/fill` surface with a `border/default` hairline at
`radius/md`, top-aligned text, and a muted placeholder. It MUST be token-pure and is the field the gig-apply
cover letter composes (no domain-named bespoke block).

#### Scenario: Renders a multi-line field token-pure
- GIVEN `<Textarea placeholder="…">`
- WHEN it renders
- THEN it MUST render a `<textarea>` on `bg-overlay-fill` with `border-border` at `rounded-md` and a
  `placeholder:text-muted` placeholder
- AND the file MUST be token-pure (no raw hex/px)

#### Scenario: Disabled state
- GIVEN `<Textarea disabled>`
- WHEN it renders
- THEN the `<textarea>` MUST be disabled and de-emphasised via the `opacity/disabled` token

### Requirement: AuthStepDots Primitive
An `AuthStepDots` primitive MUST exist, modelling the Figma auth `counter` (`3179:3997`): a row of N dots where
the **active** dot is larger and brand-coloured and the inactive dots are smaller and dimmed. It MUST be
token-pure and is the authoritative auth step indicator (distinct from the labelled `StepIndicator`).

#### Scenario: Marks the active step
- GIVEN `<AuthStepDots count={3} current={1}>`
- WHEN it renders
- THEN it MUST render 3 dots; the dot at index 1 MUST use the `brand/default` token and be visually larger
- AND the other dots MUST be dimmed (a translucent/muted token), smaller
- AND the file MUST be token-pure (no raw hex/px)

#### Scenario: Accessible
- GIVEN any `AuthStepDots`
- WHEN it renders
- THEN it MUST expose the progress to assistive tech (e.g. an `aria-label` describing step current of count)

### Requirement: Logomark Primitive
A `Logomark` primitive MUST exist, rendering the **exported** Gigly brand mark
(`public/assets/design-system/brand/gigly-logo.svg`, Figma `3179:3571`) — never a redrawn glyph (F4). It MUST
support an optional wordmark lockup and be token-pure.

#### Scenario: Renders the exported asset
- GIVEN `<Logomark />`
- WHEN it renders
- THEN it MUST render an `<img>` whose source is the exported `gigly-logo.svg` asset
- AND it MUST carry an accessible name (e.g. `alt="Gigly"`)
- AND it MUST NOT inline a redrawn logo path

### Requirement: OnboardingCard Block
An `OnboardingCard` block MUST exist, modelling the Figma welcome "pic" (`3082:3820`) — distinct from
`BannerCard`: a `radius/lg` card with an `overlay/fill` scrim, an optional bleed image (residual — exported or
omitted, not redrawn), a `type/h3` title + `type/body` subtitle, an inline `ProgressBar` primitive, and a
**secondary** `Button`. It MUST be token-pure and declare a typed view-model.

#### Scenario: Composes ProgressBar + secondary Button on a scrim
- GIVEN `<OnboardingCard>` with title, subtitle, progress, and a CTA
- WHEN it renders
- THEN it MUST show the title (`text-h2 font-h2`, the type/h3 role) and subtitle (`text-body … text-muted`)
- AND it MUST render the `ProgressBar` primitive at the given value
- AND it MUST render a `Button variant="secondary"` for the CTA
- AND the container MUST use `radius/lg` with an `overlay/fill` scrim (token), no raw hex

#### Scenario: Bleed image is an optional residual
- GIVEN an OnboardingCard with and without an `art` image
- WHEN each renders
- THEN the image MUST render via an exported `ImageRef` when present and be omitted otherwise (not redrawn)

### Requirement: TermsTabs Uses the Canonical Tabs (no bespoke toggle)
`TermsTabs` MUST continue to compose the canonical `Tabs` primitive; the Figma gig-apply segmented-pill toggle
(`2860:2413`) MUST be **normalized to `Tabs`**, NOT reproduced as a fifth bespoke toggle treatment.

#### Scenario: TermsTabs renders canonical tabs
- GIVEN `<TermsTabs>` (proposed / client)
- WHEN it renders
- THEN it MUST render the two tabs via the `Tabs` primitive (`role="tab"` elements)
- AND no bespoke segmented-pill toggle component may be introduced for it

### Requirement: Onboarding/Auth Primitives & Block Catalogued and Tested
Every primitive/block added by this change MUST appear in the workbench catalog with its states, MUST have
render tests, and MUST keep the suite + lints green.

#### Scenario: Workbench + tests
- GIVEN the workbench catalog registry and the primitive/block test files
- WHEN the catalog renders and `npm run test:unit`, `npm run lint:tokens`, `npm run build` run
- THEN the catalog MUST include `Textarea`, `AuthStepDots`, `Logomark`, and `OnboardingCard`
- AND the new render tests MUST pass, the token-purity lint MUST report no new off-token literals, and the build MUST pass

---

<!-- Merged on archive from change: typography-system (2026-06-14). Source delta retained in openspec/archive/typography-system/specs/ui/spec.md -->

## ADDED Requirements

### Requirement: Font Licence Resolution and Decision
The web-licensability of SF Compact (display/UI) and NKDy Mono (mono) MUST be determined and documented, and a
dev-stage decision MUST be recorded in `docs/TYPOGRAPHY.md` — including the chosen substitutes, measured deltas,
the capped-fidelity flag, and the swap-in path to real licensed fonts.

#### Scenario: Licence finding is documented
- GIVEN SF Compact is Apple's typeface and NKDy Mono is not a generally-available web font
- WHEN `docs/TYPOGRAPHY.md` is inspected
- THEN it MUST state that SF Compact / NKDy Mono are not web-embeddable for this app
- AND it MUST reference the residual provenance (`docs/DESIGN_SYSTEM_SPEC.md` §1.4 / `docs/DESIGN_SPECS.md` §7.3)

#### Scenario: Dev-stage substitutes are selected with rationale
- GIVEN the fonts cannot be embedded
- WHEN the decision section is inspected
- THEN it MUST name a closest-resemblance substitute for the sans/display family (e.g. Inter for SF Compact) and
  for the mono family (e.g. an OFL monospace for NKDy Mono)
- AND each substitute MUST be freely licensed (e.g. SIL OFL) and justified as the closest available resemblance

#### Scenario: Capped fidelity and swap-in path are recorded
- GIVEN the substitute is not the exact reference font
- WHEN the document is inspected
- THEN it MUST flag fidelity as capped on the type axis until a licensed font is obtained
- AND it MUST describe the swap-in path: replacing the font source while keeping the `--font-sans` / `--font-mono`
  variable contract stable
- AND it MUST record the measured glyph-metric deltas (e.g. cap-height / x-height / advance) where determinable

**Acceptance Criteria:**
- `docs/TYPOGRAPHY.md` documents the licence finding, substitutes (sans + mono), capped-fidelity flag, deltas, and swap-in path
- Substitutes are freely licensed and justified as the closest resemblance

---

### Requirement: Font Loading via next/font Without Layout Shift
Fonts MUST be loaded via `next/font` (self-hosted `local` preferred; `google` acceptable) with CSS-variable
bindings applied at the app root, configured to avoid layout shift.

#### Scenario: Fonts load with CSS-variable bindings at the root
- GIVEN the substitute fonts
- WHEN `app/layout.tsx` is inspected
- THEN it MUST load them via `next/font` and expose `--font-sans` and `--font-mono` variables
- AND those variables MUST be applied on the root `<html>`/`<body>` so the whole app inherits the type families

#### Scenario: Loading is configured to avoid layout shift
- GIVEN font swapping can cause CLS
- WHEN the font loader configuration is inspected
- THEN it MUST use `display: 'swap'` and `next/font`'s fallback-metric adjustment (e.g. `adjustFontFallback` /
  size-adjust) so there is no layout shift
- AND a self-hosted `local` loader MUST reference committed `woff2` files (deterministic/offline) where used

#### Scenario: No raw font literals outside the font system
- GIVEN the token-purity discipline
- WHEN the change is inspected
- THEN font families MUST be expressed via the `--font-*` variables / `font.family` tokens, not hardcoded
  `font-family` strings scattered in components
- AND `npm run lint:tokens` MUST still pass

**Acceptance Criteria:**
- `next/font` loads sans + mono, binds `--font-sans`/`--font-mono` at the root, CLS-safe config
- Self-hosted `woff2` used for `local` loading where applicable; token-purity lint still passes

---

### Requirement: Family Tokens Bound to the Type Scale
A `font.family` token group MUST be added to `openspec/specs/ui/design-tokens.json` and `tailwind.config.ts`
`fontFamily` MUST consume it, so the `type/*` roles apply family together with the existing size/weight/
line-height tokens.

#### Scenario: Family tokens exist and regenerate cleanly
- GIVEN the token engine
- WHEN `design-tokens.json` and the generated outputs are inspected
- THEN `design-tokens.json` MUST contain a `font.family` group with `sans` and `mono` referencing the `--font-*`
  variables
- AND `node scripts/parse-design-tokens.js` MUST emit a `fontFamily` group into `scripts/generated-tokens.js`
  without error
- AND `npm run validate:tokens` MUST pass (no drift)

#### Scenario: Tailwind binds families to the type roles
- GIVEN `tailwind.config.ts`
- WHEN it is inspected
- THEN `fontFamily` MUST consume the family tokens (`font-sans` → sans, `font-mono` → mono)
- AND the `type/*` size/weight/line-height tokens MUST remain applied so a role yields family + size + weight +
  line-height together

#### Scenario: Mono role uses the mono family
- GIVEN monospace data (e.g. `300 400 ₽`, codes) uses `type/mono`
- WHEN the mono role is applied
- THEN it MUST resolve to the mono family (`--font-mono`)
- AND text roles (display/h1/h2/title/body/label/caption) MUST resolve to the sans family (`--font-sans`)

**Acceptance Criteria:**
- `font.family` tokens added + regenerated; `validate:tokens` passes
- Tailwind `fontFamily` consumes them; type roles bind family + metrics; mono role uses the mono family

---

### Requirement: Metric Verification and Capped Fidelity
The change MUST verify type metrics deterministically (no layout shift; a sample heading/label renders at the
token metrics with the bound family) and MUST flag that the full per-screen pixel fidelity-diff is deferred to
`fidelity-harness`.

#### Scenario: A sample heading/label renders at the token metrics
- GIVEN the bound type roles
- WHEN a sample heading (e.g. the 22px auth heading anchor) and a label are rendered/asserted
- THEN they MUST use the token font-size / line-height / weight and the bound family
- AND a deterministic test (unit/build) MUST confirm the binding (size + family present), not a visual guess

#### Scenario: No layout shift from the font swap
- GIVEN the global font change
- WHEN the app is built and rendered
- THEN `npm run build` MUST pass and the font loader's fallback-metric adjustment MUST be in place to prevent CLS
- AND `npm run test:unit` MUST stay green

#### Scenario: Full fidelity-diff is deferred and capped status recorded
- GIVEN `fidelity-harness` (the pixel-diff gate) is not yet built
- WHEN the verification scope is inspected
- THEN this change MUST document the measured metric deltas and explicitly defer the per-screen pixel diff to
  `fidelity-harness`
- AND it MUST record that type-axis fidelity is capped until a licensed SF Compact (or equivalent) is embedded

**Acceptance Criteria:**
- Deterministic metric/binding verification passes; `npm run build` + `npm run test:unit` green
- Measured deltas documented; pixel fidelity-diff deferred to `fidelity-harness`; capped fidelity recorded

---

<!-- Merged on archive from change: layout-grammar (2026-06-14). Source delta retained in openspec/archive/layout-grammar/specs/ui/spec.md -->

## ADDED Requirements

### Requirement: Page Templates (AppShell and AuthLayout)
The layout grammar MUST provide an `AppShell` template (sidebar slot + topbar slot + content region; expanded and
collapsed sidebar states) and an `AuthLayout` template (centered card region + checkerboard footer), per
`docs/DESIGN_SYSTEM_SPEC.md` §4.1. Templates accept blocks as slots; they do not build the blocks.

#### Scenario: AppShell exposes slots and both sidebar states
- GIVEN the `AppShell` template
- WHEN it is rendered with placeholder `sidebar`, `topbar`, and content
- THEN it MUST render all three regions (sidebar slot, topbar slot, content region)
- AND it MUST support a sidebar `expanded` state and a `collapsed` (icon-rail) state, selectable via a prop
- AND the collapsed state MUST present the sidebar as a narrow rail (icon-rail width per `docs/DESIGN_SPECS.md` §5)

#### Scenario: AuthLayout exposes a centered card + checkerboard footer
- GIVEN the `AuthLayout` template
- WHEN it is rendered with placeholder card content
- THEN it MUST render a centered card region
- AND it MUST render a checkerboard footer using `public/assets/design-system/patterns/checkerboard.svg`

#### Scenario: Templates take blocks as slots, not built-in
- GIVEN the templates
- WHEN their props are inspected
- THEN `AppShell` MUST accept `sidebar` and `topbar` (and content/children) as slot props rather than importing
  concrete SidebarNav/Topbar blocks
- AND the templates MUST render with placeholder blocks (the real blocks arrive in `domain-blocks`)

**Acceptance Criteria:**
- `AppShell` renders sidebar/topbar/content with expanded + collapsed states; `AuthLayout` renders card + checkerboard footer
- Templates accept blocks as slot props and render with placeholders

---

### Requirement: Content Layout Primitives on the Canonical Scale
The grammar MUST provide the content layout primitives `Stack`, `Grid`, `Split`, `Section`, `Panel`, and `Rail`,
each expressing spacing/radius/surface **only via canonical tokens** (no raw px / off-token literals).

#### Scenario: All six primitives exist and render
- GIVEN the change is implemented
- WHEN the layout primitives are rendered with children
- THEN `Stack` (axis + gap), `Grid` (columns + gap), `Split` (two-pane ratio + gap), `Section` (title + gap),
  `Panel` (surface + radius + padding), and `Rail` (narrow icon column) MUST each render their children
- AND each MUST expose the axes named in `docs/DESIGN_SYSTEM_SPEC.md` §4.2

#### Scenario: Primitives are token-pure
- GIVEN the rendered primitive output
- WHEN its classes/styles are inspected
- THEN spacing MUST be expressed via the canonical `space/*` scale (Tailwind token utilities), radius via
  `radius/*`, and surface via `surface/*` — with no raw px or off-token colour literal
- AND `npm run lint:tokens` MUST still pass with these components in `app/`

#### Scenario: Spacing flows from the token scale
- GIVEN a primitive's `gap`/`padding` prop
- WHEN it maps to output
- THEN the value MUST resolve to a canonical spacing token (e.g. `gap` → `space/*`), not a hardcoded pixel value

**Acceptance Criteria:**
- Stack/Grid/Split/Section/Panel/Rail exist and render children with their documented axes
- Output is token-pure (space/radius/surface tokens only); `lint:tokens` passes

---

### Requirement: Screen-Composition Pattern and Composition Lint
The change MUST encode the rule that a screen = Template + slotted Blocks + data bindings (composition-only: no
styling, no layout literals, no raw markup) and MUST enforce it with a composition lint.

#### Scenario: Composition rule is documented and lint exists
- GIVEN the change is implemented
- WHEN the repo is inspected
- THEN there MUST be a `lint:composition` script (e.g. `scripts/design-system/validate-composition.js`)
- AND it MUST encode the rule: a composed screen imports only from templates/blocks/primitives/data and contains
  no `style=` attributes, no off-token `className` styling, and no raw structural markup

#### Scenario: Lint fails on a raw-markup screen
- GIVEN a planted composed-screen file containing raw styled markup (e.g. `<div className="p-4" style={{…}}>` or a
  disallowed import)
- WHEN `lint:composition` runs
- THEN it MUST report the violation and exit non-zero (fail)
- AND the message MUST identify the offending file and reason

#### Scenario: Lint passes compliant screens and does not block existing pages
- GIVEN composed screens are identified by opt-in (a `@composed-screen` marker) and none exist yet
- WHEN `lint:composition` runs against the current tree
- THEN it MUST pass (it MUST NOT flag existing pre-redesign pages, which are not yet composed)
- AND a compliant composed screen (template + slotted blocks + data, no raw markup) MUST pass

**Acceptance Criteria:**
- `lint:composition` exists, encodes the composition-only rule, passes the current tree + a compliant sample
- It fails a planted raw-markup screen, naming it; existing pages are not blocked

---

### Requirement: Verification and Deferred Fidelity
The templates and primitives MUST be verified deterministically (render tests + token-purity + composition lint),
with the F1 pixel fidelity-diff explicitly deferred to `fidelity-harness`.

#### Scenario: Render tests cover templates and primitives
- GIVEN the components
- WHEN `npm run test:unit` runs
- THEN render tests MUST confirm `AppShell` (expanded + collapsed) and `AuthLayout` render their slots, and each
  layout primitive renders its children
- AND the overall unit suite MUST stay green

#### Scenario: Build stays green
- GIVEN the new components
- WHEN `npm run build` runs
- THEN it MUST pass (the components compile as presentational/server-safe components)

#### Scenario: F1 fidelity is deferred and noted
- GIVEN `fidelity-harness` (the pixel-diff gate) is not yet built
- WHEN the verification scope is inspected
- THEN the change MUST verify structure (render), token-purity (F2), and composition (F5) now
- AND it MUST explicitly defer the F1 pixel fidelity-diff on the empty shell to `fidelity-harness`

**Acceptance Criteria:**
- Render tests pass for templates (expanded+collapsed) and all primitives; `npm run build` + `npm run test:unit` green
- F2 (token-purity) + F5 (composition) enforced; F1 pixel-diff deferred to `fidelity-harness`

---

<!-- Merged on archive from change: ui-primitives (2026-06-14). Source delta retained in openspec/archive/ui-primitives/specs/ui/spec.md -->

## ADDED Requirements

### Requirement: Primitive Vocabulary — 16 Variant-Driven Components
The kit MUST provide the 16 primitives of `docs/DESIGN_SYSTEM_SPEC.md` §3.1 under `app/components/primitives/`, each
exposing the typed `variant`/`state`/`size` axes named there and rendering **every state present in the library**
(`docs/DESIGN_SPECS.md` §4). Each primitive is a controlled, presentational component (state is a prop).

#### Scenario: All sixteen primitives exist and render
- GIVEN the change is implemented
- WHEN each primitive is rendered with children/props
- THEN `Button`, `Input`, `PasswordInput`, `SearchInput`, `Select`, `Radio`, `Filter`, `Tabs`, `Toggle`, `Tag`,
  `CategoryTag`, `StatusBadge` (badge + inline dot), `Avatar`, `Rating`, `ViewToggle`, and `ProgressBar` MUST each
  exist as a component under `app/components/primitives/` and render its output

#### Scenario: Every library state is renderable per primitive
- GIVEN a primitive with a documented state matrix (e.g. Button `primary|secondary|ghost|link` × `default|hover|
  pressed|disabled`; Input `default|focus|filled|disabled|error`; Radio/Filter `off|hover|on|disabled`; StatusBadge
  the 6 status variants; Avatar `sm|lg` + `online`; ViewToggle `grid-active|list-active`)
- WHEN each variant/state/size in the matrix is requested via props
- THEN the primitive MUST render that exact state (the requested variant/state/size resolves to its canonical token
  styling), with no library state missing

#### Scenario: Standard controls use the canonical control geometry
- GIVEN the standard-control primitives (Button, Input, Select, StatusBadge pill)
- WHEN they are rendered at their default size
- THEN they MUST express the standard control height via the `size/control` (40px) token and `radius/md`, per
  `docs/DESIGN_SPECS.md` §5 — not a hardcoded pixel height

**Acceptance Criteria:**
- All 16 primitives exist under `app/components/primitives/` with the §3.1 variant/state/size props and render
- Every state from the library is renderable per primitive; standard controls use `size/control` + `radius/md`

---

### Requirement: Token Purity and Typed-API Enforcement (F2)
Every primitive MUST express colour/spacing/radius/type/size **only via canonical token utilities** (zero hardcoded
values), and its `variant`/`state`/`size` props MUST be typed unions so an off-system value does not type-check.

#### Scenario: Primitives are token-pure
- GIVEN the rendered primitive output
- WHEN its classes/styles are inspected
- THEN colour MUST resolve to `brand/*`, `surface/*`, `text/*`, `border/*`, `status/*`, or `category/*` tokens,
  spacing to `space/*`, radius to `radius/*`, type to `type/*`, and fixed dimensions to `size/*` — with no raw hex,
  `rgb()/hsl()`, or raw `px` literal
- AND `npm run lint:tokens` MUST pass with **no new baseline entries** (the new primitives add nothing to
  `scripts/design-system/token-purity-baseline.json`)

#### Scenario: Typed API rejects off-system values
- GIVEN a primitive with typed `variant`/`state`/`size` union props
- WHEN a non-existent variant or off-scale value is supplied (e.g. `<Button variant="purple" />`,
  `<StatusBadge status="mauve" />`)
- THEN the type-checker MUST reject it (`tsc --noEmit` / `npm run build` fails on the planted value)
- AND the clean tree (only in-system values) MUST type-check and build green

#### Scenario: Variant maps are JIT-visible static class strings
- GIVEN the primitive token map (`app/components/primitives/tokens.ts`)
- WHEN a variant/state/size is mapped to styling
- THEN it MUST resolve through a static literal-class lookup (the `app/components/layout/scale.ts` pattern), not a
  dynamically built class string, so Tailwind's JIT emits the utility

**Acceptance Criteria:**
- No raw colour/px literals in `app/components/primitives/`; `lint:tokens` passes with an unchanged baseline file
- `variant`/`state`/`size` are typed unions; a planted off-system value fails `tsc --noEmit`; the clean tree builds

---

### Requirement: Real Assets (F4)
Icon-bearing primitives MUST use the exported SVG assets in `public/assets/design-system/icons/`, not redrawn
approximations; the known asset residuals MUST be flagged rather than re-drawn.

#### Scenario: Icon primitives reference exported assets
- GIVEN SearchInput (search + clear), ViewToggle (grid/list), Rating (star + verified), Radio/Filter
  (radio-off/radio-on), and StatusBadge inline dot (status-dot)
- WHEN their icon usage is inspected
- THEN each MUST reference an exported asset from `public/assets/design-system/icons/` (e.g. `search.svg`,
  `clear.svg`, `grid.svg`, `list.svg`, `star.svg`, `verified.svg`, `radio-off.svg`, `radio-on.svg`,
  `status-dot.svg`) — not an inline redrawn glyph

#### Scenario: Missing-icon residuals are flagged, not redrawn
- GIVEN the `eye` (PasswordInput reveal) and `attach` (chat composer) icons are absent from the in-hand SVGs
  (`docs/DESIGN_SPECS.md` §7.5)
- WHEN PasswordInput's reveal control is implemented
- THEN it MUST ship with an accessible text/label fallback (not a redrawn `eye` glyph), and the residual MUST be
  flagged (routed to Figma) — preserving the `revealed` state in the typed matrix

**Acceptance Criteria:**
- Icon-bearing primitives use exported assets from `public/assets/design-system/icons/`
- `eye`/`attach` residuals are flagged (not redrawn); PasswordInput reveal has an accessible fallback

---

### Requirement: All-States Render Coverage and Verification
The primitives MUST be verified deterministically by a render-test suite covering **every variant/state/size**, plus
the typed-rejection and token-purity checks, with the unit suite and build staying green.

#### Scenario: Render tests cover every state of every primitive
- GIVEN the render-test suite (`__tests__/unit/components/ui-primitives.test.tsx`, jsdom)
- WHEN `npm run test:unit` runs
- THEN it MUST render each primitive in every documented variant/state/size and assert the expected token utility /
  asset is present (e.g. Button primary → `bg-brand-default`; StatusBadge review → `status-review`; ProgressBar
  fill → `bg-brand-default` at the bound value)
- AND the overall unit suite MUST stay green

#### Scenario: Build stays green
- GIVEN the new primitives
- WHEN `npm run build` runs
- THEN it MUST pass (the primitives compile; presentational where possible, `"use client"` only where a DOM event
  is owned)

**Acceptance Criteria:**
- Render tests pass for every variant/state/size of all 16 primitives; `npm run build` + `npm run test:unit` green

---

### Requirement: Composition-Leaf Purity and Deferred Automated Fidelity
The primitives MUST be composition leaves (token-pure presentational components that consume only tokens + exported
assets and build no domain blocks), with the automated **F1 pixel-diff** explicitly deferred to `fidelity-harness`.

#### Scenario: Primitives are leaves, not blocks
- GIVEN the primitives
- WHEN their imports/output are inspected
- THEN they MUST consume only canonical tokens + exported assets (and, where applicable, other primitives such as
  PasswordInput/SearchInput extending Input, or Filter composing Radio) — and MUST NOT import or build domain blocks
  (GigCard, SidebarNav, …) or compose screens
- AND `npm run lint:composition` MUST still pass (the change adds no composed-screen violations)

#### Scenario: F1 automated fidelity is deferred and noted
- GIVEN `fidelity-harness` (the pixel-diff gate) is not yet built
- WHEN the verification scope is inspected
- THEN the change MUST build primitives to the measured geometry of `docs/DESIGN_SPECS.md` §5 and verify F2/F3/F4/F5
  deterministically now
- AND it MUST explicitly defer the automated F1 pixel-diff (vs the reference crops in
  `docs/design-system/reference-renders/`) to `fidelity-harness` (#9)

#### Scenario: Legacy components are untouched
- GIVEN the pre-redesign controls (`app/components/ui/*`, `app/components/auth/*`, `MainNav`, `LoadingButton`, …)
- WHEN the change's diff is inspected
- THEN those files MUST be unchanged (Phase 2 recomposes/removes them); this change adds the new vocabulary only

**Acceptance Criteria:**
- Primitives consume only tokens + assets (+ other primitives), build no blocks; `lint:composition` passes
- F2/F3/F4/F5 enforced now; automated F1 pixel-diff deferred to `fidelity-harness`; legacy components untouched

---

<!-- Merged on archive from change: domain-blocks (2026-06-14). Source delta retained in openspec/archive/domain-blocks/specs/ui/spec.md -->

## ADDED Requirements

### Requirement: Domain Block Vocabulary — 17 Composites from Primitives
The kit MUST provide the 17 blocks of `docs/DESIGN_SYSTEM_SPEC.md` §3.2 under `app/components/blocks/`, each
exposing the typed variant axes named there and composed only from `ui-primitives` + `layout-grammar` primitives +
tokens (+ the sub-blocks §3.2 names). Each block is a controlled, presentational composite.

#### Scenario: All seventeen blocks exist and render from fixtures
- GIVEN the change is implemented
- WHEN each block is rendered with its fixture view-model
- THEN `GigCard`, `ProfileCard`, `ClientCard`, `BannerCard`, `StatPanel`, `RequirementCard`, `CriteriaList`,
  `TermsTabs`, `ApplyPanel`, `MessageBubble`, `ConversationItem`, `NotificationItem`, `MessagesPanel`, `ChatPanel`,
  `SidebarNav`, `Topbar`, and `FilterBar` MUST each exist under `app/components/blocks/` and render its output

#### Scenario: GigCard renders all six statuses across both layouts
- GIVEN the `GigCard` block
- WHEN it is rendered for each of the 6 statuses (`open`, `review`, `in-progress`, `verification`, `completed`,
  `rejected`) in both `grid` and `list` layouts
- THEN it MUST render each combination, composing StatusBadge (the status), Tag/CategoryTag, Rating, the budget in
  `type/mono`, the deadline, and a "К проекту" Button — with no status or layout variant missing

#### Scenario: Each block's documented variant axes render
- GIVEN a block with a §3.2 variant axis (e.g. ProfileCard `{full, compact}`; MessageBubble `{in, out}`;
  ConversationItem `{read, unread}`; MessagesPanel `{preview, full}`; SidebarNav role × `{expanded, collapsed}`;
  FilterBar `{search-only, full}`; TermsTabs `{proposed, client}`; StatPanel `{single, grid}`)
- WHEN each variant is requested
- THEN the block MUST render that variant from its fixture

#### Scenario: Sub-block composition follows §3.2
- GIVEN the blocks that §3.2 defines as composing sub-blocks
- WHEN their composition is inspected
- THEN `MessagesPanel` MUST compose `ConversationItem`, `ChatPanel` MUST compose `MessageBubble` (+ a Composer), and
  `SidebarNav`/`Topbar` MUST compose `ProfileCard` — as the defined vocabulary

**Acceptance Criteria:**
- All 17 blocks exist under `app/components/blocks/` and render every §3.2 variant from fixtures
- GigCard covers 6 statuses × `{grid, list}`; §3.2 sub-block compositions are present

---

### Requirement: Typed View-Model Contracts (schema-independent, fixture-driven)
Each block MUST declare a typed view-model exactly per `docs/DESIGN_SYSTEM_SPEC.md` §5, schema-independent (the data
it displays, not Prisma tables), and MUST render from typed fixtures with no backend dependency.

#### Scenario: View-models match §5 and are typed
- GIVEN `app/components/blocks/view-models.ts`
- WHEN the contracts are inspected
- THEN each block's VM (`GigCardVM`, `ProfileCardVM`, `ClientCardVM`, `StatPanelVM`, `SidebarNavVM`, `TopbarVM`,
  `FilterBarVM`, `MessageBubbleVM`, `ConversationItemVM`, `NotificationItemVM`, `MessagesPanelVM`, `ChatPanelVM`,
  `RequirementCardVM`, `CriteriaListVM`, `TermsTabsVM`, `ApplyPanelVM`, `BannerCardVM`) MUST be defined with the §5
  field names/types, using schema-independent scalar aliases (`Money`, `DateISO`, `ImageRef`, `IconRef`, `Status`,
  `Category`)

#### Scenario: A malformed view-model fails the type-checker
- GIVEN a block typed by its VM
- WHEN a fixture/usage supplies a VM missing a required field or with a wrong-typed field (e.g. a `GigCardVM`
  without `status`, or `layout: "masonry"`)
- THEN `tsc --noEmit` / `npm run build` MUST fail on it
- AND the clean tree (fixtures matching the contracts) MUST type-check and build green

#### Scenario: Blocks render from fixtures with no backend
- GIVEN the blocks and `app/components/blocks/fixtures.ts`
- WHEN a block is rendered in a test
- THEN it MUST render purely from a fixture VM, and MUST NOT import Prisma, server actions, or `lib/*` data modules

**Acceptance Criteria:**
- Every block's VM matches §5 and type-checks; a malformed VM fails `tsc`
- Blocks render from typed fixtures; no Prisma/server/`lib` imports in `app/components/blocks/`

---

### Requirement: Token Purity and Composition Purity (F2/F5)
Blocks MUST express styling **only via canonical tokens** (zero hardcoded values) and MUST be composed only from
primitives + layout primitives + tokens + the §3.2 sub-blocks — no raw styled markup, no route/server imports.

#### Scenario: Blocks are token-pure
- GIVEN the block source/output
- WHEN it is inspected
- THEN colour/spacing/radius/type/size MUST resolve to canonical token utilities only — no raw hex, `rgb()/hsl()`,
  or raw `px` literal
- AND `npm run lint:tokens` MUST pass with **no new baseline entries**

#### Scenario: Blocks compose only the allowed kit modules
- GIVEN a block file under `app/components/blocks/`
- WHEN its imports are inspected
- THEN it MUST import only from `@/app/components/primitives`, `@/app/components/layout`, sibling blocks
  (`@/app/components/blocks/*`), the view-model/fixture modules, `react`, and `next/*` — and MUST NOT import app
  routes, server actions, Prisma, or `lib/*`, nor contain `style=` raw styling or off-token `className` literals

**Acceptance Criteria:**
- No raw colour/px literals in `app/components/blocks/`; `lint:tokens` passes with an unchanged baseline file
- Import-discipline check passes (only primitives/layout/blocks/tokens/fixtures/react/next); no raw styled markup

---

### Requirement: Real Assets and Residual Handling (F4)
Icon/asset-bearing blocks MUST use the exported assets via the primitives' `Icon`/`ICON` registry, not redrawn
glyphs; the known asset residuals MUST be flagged rather than re-drawn.

#### Scenario: Icon-bearing blocks use exported assets
- GIVEN SidebarNav (nav icons + logo), Topbar (bell/gear), NotificationItem (type icon), ChatPanel composer (send)
  (NB: CriteriaList no longer bears an icon — reconciled to numbered криterий rows, see the add-profile-and-gig-detail-blocks fold)
- WHEN their icon usage is inspected
- THEN each MUST render via the primitives' `Icon`/`ICON` registry (exported `public/assets/design-system/*`), not
  an inline redrawn glyph

#### Scenario: Banner raster and attach residuals are flagged, not redrawn
- GIVEN the cosmic banner raster (`docs/DESIGN_SPECS.md` §7.2) and the `attach` icon (§7.5) are absent from the
  in-hand SVGs
- WHEN BannerCard and ChatPanel are implemented
- THEN BannerCard MUST render `art` as a slotted `ImageRef` (fixture/placeholder, not a redrawn illustration) and
  ChatPanel's composer MUST ship an accessible `attach` fallback — both flagged as residuals (routed to Figma)

**Acceptance Criteria:**
- Icon-bearing blocks use exported assets via `Icon`/`ICON`
- Banner `art` is a slot; ChatPanel `attach` has an accessible fallback; both residuals flagged, not redrawn

---

### Requirement: All-Variants Render Coverage and Deferred Fidelity
The blocks MUST be verified deterministically by a render-test suite covering **every block in every variant** from
fixtures, with the unit suite and build green, and the automated **F1 pixel-diff** explicitly deferred to
`fidelity-harness`.

#### Scenario: Render tests cover every block and variant
- GIVEN the render-test suite (`__tests__/unit/components/domain-blocks.test.tsx`, jsdom)
- WHEN `npm run test:unit` runs
- THEN it MUST render each block in every documented variant from fixtures and assert the composed primitives/tokens/
  assets are present (e.g. GigCard `review` → StatusBadge `status-review` + a "К проекту" Button; MessageBubble `out`
  vs `in`; SidebarNav `collapsed` → Rail/icon-rail)
- AND the overall unit suite MUST stay green

#### Scenario: Build and composition lint stay green
- GIVEN the new blocks
- WHEN `npm run build` and `npm run lint:composition` run
- THEN both MUST pass (blocks compile; the change adds no composed-screen violations)

#### Scenario: F1 automated fidelity is deferred; legacy untouched
- GIVEN `fidelity-harness` is not yet built and Phase 2 has not begun
- WHEN the verification scope is inspected
- THEN the change MUST verify F2/F3/F4/F5 now and explicitly defer the automated F1 pixel-diff (vs the reference
  crops in `docs/design-system/reference-renders/`) to `fidelity-harness` (#9)
- AND the legacy route UI (`MainNav`, pre-redesign pages) and the shell (`app/(protected)/layout.tsx`) MUST be
  unchanged

**Acceptance Criteria:**
- Render tests pass for every block × variant from fixtures; `npm run build` + `npm run test:unit` +
  `npm run lint:composition` green
- F2/F3/F4/F5 enforced now; automated F1 pixel-diff deferred to `fidelity-harness`; legacy + shell untouched

---

<!-- Merged on archive from change: component-workbench (2026-06-14). Source delta retained in openspec/archive/component-workbench/specs/ui/spec.md -->

## ADDED Requirements

### Requirement: Living Catalog of Every System Entity
The change MUST provide a browsable, in-app workbench under `app/workbench/`, driven by a typed registry, that
documents every system entity with all its states: every token group, all 16 primitives, all 17 blocks, the 2
templates, and the 6 layout primitives. The workbench MUST be a dev-only surface.

#### Scenario: Workbench is browsable with per-kind sections
- GIVEN the change is implemented
- WHEN the workbench is opened in development
- THEN there MUST be an index plus per-kind catalog sections (tokens, primitives, blocks, templates, layout, screens)
  rendered from the typed registry

#### Scenario: Every system entity has a catalog story with all states
- GIVEN the catalog registry
- WHEN its entries are inspected
- THEN it MUST contain a story for every token group (colour, radius, spacing, type, shadow), all 16 primitives
  (each rendered in every variant/state/size), all 17 blocks (each rendered in every variant from
  `app/components/blocks/fixtures.ts`), the 2 templates (AppShell, AuthLayout), and the 6 layout primitives
  (Stack, Grid, Split, Section, Panel, Rail)

#### Scenario: Workbench is dev-only
- GIVEN the workbench routes
- WHEN `NODE_ENV` is `production`
- THEN the workbench MUST NOT render (e.g. `notFound()` via a shared `app/workbench/layout.tsx`) — it is a dev
  surface, not shipped UI

**Acceptance Criteria:**
- `app/workbench/` renders an index + per-kind sections from a typed registry
- The registry covers all token groups, 16 primitives (all states), 17 blocks (all variants), 2 templates, 6 layout primitives; dev-only

---

### Requirement: Reference-Crop Mapping (fidelity baseline registry)
Each catalog entry MUST map to a reference render that exists under `docs/design-system/reference-renders/`, and the
registry MUST expose the `(entity → reference baseline → renderable story)` mapping that `fidelity-harness` (#9) will
consume.

#### Scenario: Each entry maps to an existing reference render
- GIVEN the catalog registry
- WHEN each entry's `reference` path is resolved
- THEN it MUST point to a file that exists under `docs/design-system/reference-renders/` (e.g. primitives/tokens →
  `components/library-full.png`; blocks/templates → `components/components-frames-full.png`; the sample screen →
  `frames/specialist-dashboard.lossy.jpg`)

#### Scenario: Registry is the baseline mapping for the fidelity harness
- GIVEN the registry
- WHEN its shape is inspected
- THEN each entry MUST expose its `id`, `kind`, `reference`, and a renderable story — the triple `fidelity-harness`
  (#9) iterates to produce per-entity crops + diffs (this change maps baselines; it does NOT diff)

**Acceptance Criteria:**
- Every registry entry's `reference` file exists; the registry exposes entity→baseline→story for #9
- Per-entity crops and pixel-diffing are explicitly deferred to `fidelity-harness`

---

### Requirement: Screen Composition from Fixtures (pre-route)
The workbench MUST assemble at least one sample screen from a template + slotted blocks + fixtures, marked
`@composed-screen`, which passes the composition lint — proving screens compose from the kit before touching live
routes.

#### Scenario: A sample screen is composed from the kit + fixtures
- GIVEN the workbench
- WHEN the sample composition is inspected
- THEN it MUST compose `AppShell` + domain blocks (e.g. SidebarNav, Topbar, BannerCard, GigCard·grid, MessagesPanel)
  arranged via layout primitives, bound to `app/components/blocks/fixtures.ts` — with no backend/route/data wiring

#### Scenario: The sample composed screen passes the composition lint
- GIVEN the sample screen carries the `/* @composed-screen */` marker
- WHEN `npm run lint:composition` runs
- THEN it MUST PASS with the sample counted as a checked composed screen (≥ 1), i.e. the file imports only from
  templates/blocks/primitives/layout/data and contains no `className=` or `style=` attribute

#### Scenario: The sample screen renders from fixtures
- GIVEN the sample composition component
- WHEN it is rendered in a test
- THEN it MUST render its blocks from fixtures (e.g. a GigCard "К проекту" CTA and the SidebarNav "Дашборд" item are
  present) with no backend

**Acceptance Criteria:**
- A sample `@composed-screen` composes AppShell + blocks from fixtures; `lint:composition` PASSES with ≥1 checked
- The sample screen renders from fixtures (render test)

---

### Requirement: Coverage and Build Verification
A test MUST assert the registry covers every system entity (cross-checked against the kit barrels) and that every
entry's reference exists; the catalog MUST build and the unit suite stay green.

#### Scenario: Coverage test asserts complete entity coverage
- GIVEN `__tests__/unit/components/workbench.test.tsx`
- WHEN it runs
- THEN it MUST assert the registry's primitive ids ⊇ the 16 primitives exported by `@/app/components/primitives` and
  its block ids ⊇ the 17 blocks exported by `@/app/components/blocks`, plus the 2 templates and 6 layout primitives
- AND it MUST assert every registry entry's `reference` file exists on disk

#### Scenario: Catalog builds and suite stays green
- GIVEN the workbench routes
- WHEN `npm run build` and `npm run test:unit` run
- THEN the build MUST pass (the catalog compiles) and the overall unit suite MUST stay green

**Acceptance Criteria:**
- Coverage test passes (registry ⊇ all kit entities, cross-checked vs barrels; all references exist)
- `npm run build` + `npm run test:unit` green

---

### Requirement: Token-Purity, No-Storybook Scope, and Deferred Fidelity
The workbench MUST be token-pure and built without a Storybook dependency, leaving the automated pixel-diff to
`fidelity-harness` and all kit/legacy/route code unchanged.

#### Scenario: Workbench is token-pure
- GIVEN the workbench source under `app/workbench/`
- WHEN it is inspected
- THEN it MUST contain no raw hex/`rgb()`/`px` literals (swatches use token utility classes; resolved values, if
  shown, come from the imported token module — not source literals)
- AND `npm run lint:tokens` MUST pass with **no new baseline entries**

#### Scenario: No Storybook dependency; kit/legacy/routes unchanged
- GIVEN the change's diff and `package.json`
- WHEN inspected
- THEN no Storybook (or equivalent heavy catalog) dependency MUST be added; the catalog is in-app Next routes
- AND no primitive/block/template/legacy file, `app/(protected)/layout.tsx`, or Phase 1 model MUST be changed

#### Scenario: Automated pixel-diff deferred to fidelity-harness
- GIVEN `fidelity-harness` (#9) is not built
- WHEN the verification scope is inspected
- THEN this change MUST map entities to reference baselines and verify coverage/build/token-purity/composition now,
  and MUST explicitly defer the automated F1 pixel-diff to `fidelity-harness`

**Acceptance Criteria:**
- No raw literals in `app/workbench/`; `lint:tokens` passes with an unchanged baseline; no Storybook dependency
- No kit/legacy/route/model changes; automated F1 pixel-diff deferred to `fidelity-harness`

---

<!-- Merged on archive from change: fidelity-harness (2026-06-15). Source delta retained in openspec/archive/fidelity-harness/specs/ui/spec.md -->

## ADDED Requirements

### Requirement: Calibrated Pixel-Diff Engine
The change MUST provide a `pixelmatch`-based diff engine that computes a differing-pixel ratio against a calibrated
threshold (≤ ~1%), with AA/colour tolerance and region masking, usable as a library and a CI-blocking CLI.

#### Scenario: Known-good control passes
- GIVEN a reference image and an identical candidate image
- WHEN the engine diffs them at the calibrated threshold
- THEN the differing-pixel ratio MUST be ≈ 0 (≤ `maxDiffRatio`) and the engine MUST report PASS (exit 0 via CLI)

#### Scenario: Injected 4px offset fails
- GIVEN a structured reference image and a candidate that is the same image shifted by 4px
- WHEN the engine diffs them
- THEN the differing-pixel ratio MUST exceed `maxDiffRatio` (~1%) and the engine MUST report FAIL (non-zero CLI exit)

#### Scenario: Threshold, AA tolerance, and masking are configurable
- GIVEN the engine's calibration config (`maxDiffRatio` ≤ 0.01, a pixelmatch colour `threshold`, `includeAA`, and a
  list of mask rectangles)
- WHEN a comparison is run with a masked region over an area that otherwise differs
- THEN pixels inside the mask MUST NOT count toward the ratio (dynamic regions are ignorable)
- AND the colour/AA tolerance MUST be applied so anti-aliased edge pixels do not inflate the ratio

**Acceptance Criteria:**
- The engine returns a differing-pixel ratio; control ≈ 0 (pass), 4px offset > threshold (fail)
- Threshold (≤1%), AA/colour tolerance, and region masking are configurable; CLI exits non-zero on failure

---

### Requirement: 1440px Surface Capture vs Reference Renders
The change MUST capture each catalogued surface at a 1440px viewport with seeded fixtures and run the diff engine vs
the reference renders, producing artifacts. Per-screen ≤1%-vs-Figma enforcement is deferred to Phase 2.

#### Scenario: Surfaces render at 1440px with seeded fixtures
- GIVEN the Playwright fidelity capture and the dev-only `component-workbench`
- WHEN it runs
- THEN it MUST render each catalogued surface (the `/workbench/*` pages and the composed screen) at a 1440px viewport
  with the seeded fixtures and capture a PNG per surface

#### Scenario: Captures are diffed vs the reference renders into artifacts
- GIVEN a captured surface and its mapped reference render (e.g. the composed screen vs
  `frames/specialist-dashboard.lossy.jpg`)
- WHEN the engine compares them
- THEN it MUST produce a differing-pixel ratio and emit diff/side-by-side/overlay artifacts for review

#### Scenario: Per-screen ≤1% enforcement is deferred and flagged
- GIVEN the reference frames are lossy/draft (frames README), the font is a substitute, the raster art is unexported,
  and the design is unlocked
- WHEN the verification scope is inspected
- THEN this change MUST NOT make the ≤1%-vs-Figma match a blocking assertion
- AND it MUST explicitly defer per-screen ≤1% enforcement to Phase 2 (`compose-*`, design-lock-gated), capturing
  real baselines then

**Acceptance Criteria:**
- A 1440px capture renders each surface with seeded fixtures and diffs vs the reference renders, emitting artifacts
- ≤1%-vs-Figma enforcement is deferred to Phase 2 and flagged (not a blocking assertion here)

---

### Requirement: Diff Artifacts (side-by-side + 50%-overlay)
The engine MUST emit human-reviewable artifacts for each comparison: a diff image, a side-by-side composite, and a
50%-overlay.

#### Scenario: Artifacts are emitted for a comparison
- GIVEN a comparison of two images
- WHEN the engine runs with an output directory
- THEN it MUST write a diff image (highlighting differing pixels), a side-by-side composite (actual | expected), and
  a 50%-overlay (actual blended 50% over expected) to that directory

**Acceptance Criteria:**
- diff + side-by-side + 50%-overlay artifacts are written to the output dir for a comparison

---

### Requirement: CI-Blocking Harness
The harness MUST be CI-blocking: `npm run fidelity` MUST run the deterministic gates and exit non-zero on any
failure, and the engine self-test MUST run in the unit suite, with the build and suite staying green.

#### Scenario: Failure blocks (non-zero exit)
- GIVEN a comparison whose differing-pixel ratio exceeds the threshold (or a generativity violation)
- WHEN `npm run fidelity` runs
- THEN it MUST exit non-zero (blocking CI)

#### Scenario: Control passes (zero exit) and is in the suite
- GIVEN a known-good control
- WHEN `npm run fidelity` and `npm run test:unit` run
- THEN `npm run fidelity` MUST exit 0 and the engine self-test (control passes / offset fails) MUST be part of the
  unit suite, which MUST stay green
- AND `npm run build` MUST pass and `npm run lint:tokens` MUST pass with no new baseline entries

**Acceptance Criteria:**
- `npm run fidelity` exits non-zero on failure, zero on a clean control; engine self-test runs in `test:unit`
- `npm run build` + `npm run test:unit` + `npm run lint:tokens` (unchanged baseline) green

---

### Requirement: Generativity Scaffold
The change MUST provide a generativity scaffold: a novel screen assembled purely from the kit, with an assertion of
zero off-system values, that a planted off-token value fails. This scaffolds the `prove-extensibility-admin` (#29)
proof.

#### Scenario: A novel kit-only screen has zero off-system values
- GIVEN an arbitrary screen (`app/workbench/screens/GenerativityProbe.tsx`, `@composed-screen`) assembled from
  `AppShell` + existing blocks + fixtures — not one of the reference screens
- WHEN `npm run lint:generativity` runs
- THEN it MUST PASS: the screen imports only kit modules + fixtures, contains no `className`/`style`, and introduces
  no off-token literal (it passes `lint:composition` + `lint:tokens`) — zero off-system values

#### Scenario: A planted off-system value fails the gate
- GIVEN an off-token literal (e.g. a raw hex) or an off-system `className`/import planted in the generativity probe
- WHEN `npm run lint:generativity` runs
- THEN it MUST FAIL (non-zero), identifying the off-system value

#### Scenario: Scaffold is the basis for the admin generativity proof
- GIVEN the generativity scaffold
- WHEN its purpose is inspected
- THEN it MUST be documented as the scaffold that `prove-extensibility-admin` (#29) extends to the full admin proof
  (assemble admin screens from the kit with zero new system entities) — this change ships the scaffold, not the proof

**Acceptance Criteria:**
- A novel kit-only `@composed-screen` passes `lint:generativity` (zero off-system values)
- A planted off-token/off-system value fails it; the scaffold is documented for `prove-extensibility-admin`

---

## ADDED Requirements (compose-shell-cutover — Phase 2 shell)

> The first Phase-2 screen composition: `app/(protected)/layout.tsx` composes the `AppShell` template +
> `SidebarNav`/`Topbar` blocks (via live wrappers) with role-based RU nav, live counts, logout, and notifications,
> replacing the legacy `MainNav`. Verified by E2E (`__tests__/e2e/shell-cutover.spec.ts`), F3 logical parity, F5
> composition purity, the full unit suite, and the fidelity harness. F1 per-screen ≤1% is design-lock/font-gated (see
> the verification requirement).

### Requirement: Protected Layout Composes the AppShell
`app/(protected)/layout.tsx` MUST compose `AppShell` + `SidebarNav` + `Topbar` (replacing `MainNav`) as a
composition-pure screen (F5): it MUST carry the `@composed-screen` marker, import only kit (`templates`/`blocks`/
`layout`/`primitives`) + `lib`/`actions`, contain no `className`/`style`/raw markup, and render every existing
protected route inside the shell's content region.

#### Scenario: The layout is a composed screen and all protected routes render in it
- GIVEN `app/(protected)/layout.tsx`
- WHEN it and a protected route (`/dashboard`, `/gigs`, `/gigs/new`, `/gigs/[id]`, `/profile`, …) are inspected/rendered
- THEN the layout MUST compose `<AppShell sidebar topbar>{children}</AppShell>` (F5-pure, `MainNav` unused), and the
  page MUST render inside the shell content region

**Acceptance Criteria:**
- `app/(protected)/layout.tsx` composes `AppShell`+`SidebarNav`+`Topbar` (F5-pure, `@composed-screen`); `MainNav` retired
- Every existing protected route renders within the shell

### Requirement: Exact RU Navigation Per Role (F3)
The sidebar MUST show the exact RU navigation per role.

#### Scenario: CLIENT and SPECIALIST navigation
- GIVEN an authenticated user
- WHEN the sidebar renders
- THEN a CLIENT MUST see, in order, **Дашборд** (`/dashboard`), **Мои гиги**, **Чаты** (`/chats`), **Финансы**
  (`/finances`), **Споры** (`/disputes`); a SPECIALIST MUST see those plus **Поиск** (`/gigs`)
- AND items for not-yet-built routes (`/chats`, `/finances`, `/disputes`) are present per F3, pointing at their
  canonical hrefs (built by their own Phase-2 changes)

**Acceptance Criteria:**
- Exact RU items/order per role (CLIENT 5 items; SPECIALIST + Поиск); verified live by E2E

### Requirement: Live Counts and Active State
The shell MUST reflect live data: nav counts (open/assigned gigs, unread notifications) computed server-side, and the
active nav item for the current route (computed from `usePathname` in a client wrapper).

#### Scenario: Counts and active state
- GIVEN the layout (server) computes counts and the client wrapper reads the pathname
- WHEN the sidebar renders on a route
- THEN nav counts MUST reflect real data and the current route's item MUST be marked active

**Acceptance Criteria:**
- Live counts + active state (pathname-driven); verified live by E2E (Поиск active on `/gigs`)

### Requirement: Preserved Behaviour (auth, logout, notifications, a11y, desktop-only)
The cutover MUST preserve the protected layout's existing behaviour: the no-session redirect (`getSession()` →
`/login`), logout (the `logoutUser` form, the button being `type="submit"`), the interactive `NotificationBell`, the
skip-link target `#main-content` (the focusable `<main>` provided by `AppShell`), and it MUST be desktop-only (no
mobile hamburger).

#### Scenario: Guard, logout, notifications, a11y
- GIVEN the shell
- WHEN exercised
- THEN an unauthenticated request MUST redirect to `/login`; logout MUST submit `logoutUser` and redirect; the
  `NotificationBell` MUST be present; `#main-content`/skip-link MUST exist; no mobile menu is rendered

**Acceptance Criteria:**
- No-session redirect, `logoutUser` logout (submit button), `NotificationBell`, `#main-content`/skip-link preserved; desktop-only — verified live by E2E

### Requirement: Additive Live-Wiring Block Slots
`SidebarNav` MUST gain an optional `logout` slot and `Topbar` an optional `notifications` slot, additively: with no
slot they render the presentational defaults (fixtures/workbench unaffected); the live wrappers (`SidebarNavLive`/
`TopbarLive`) inject the `logoutUser` form + `NotificationBell` through them.

#### Scenario: Optional slots, presentational by default
- GIVEN the blocks
- WHEN no slot is passed (fixtures) vs the live wrappers passing slots
- THEN the no-slot render MUST be unchanged (composition lint/workbench unaffected), and the slotted render MUST show
  the supplied interactive nodes

**Acceptance Criteria:**
- `SidebarNav.logout?` + `Topbar.notifications?` optional slots; additive; live wrappers inject logout + notifications

### Requirement: Shell Verification and Deferred F1
The cutover MUST pass the buildable Fidelity DoD (F3 + F5) and the functional/E2E suite; the F1 per-screen ≤1%
pixel-diff is achieved only once external prerequisites land.

#### Scenario: Buildable + functional verification (enforced)
- GIVEN the change
- WHEN `lint:composition` (F5), `lint:tokens`, `npm run build`, `npm run test:unit`, `npm run fidelity`, and the
  shell E2E (`__tests__/e2e/shell-cutover.spec.ts`) run
- THEN they MUST pass — composition-pure layout, exact RU nav per role (F3), no unit regressions, and the live shell
  renders with working logout + auth guard

#### Scenario: F1 shell pixel-fidelity — run, chrome faithful, ≤1% deferred
- GIVEN the live shell captured at 1440px and diffed vs the screenshot reference (`scripts/design-system/
  fidelity-diff.js`)
- WHEN the artifacts (diff / side-by-side / 50%-overlay) are reviewed
- THEN the shell **chrome** (sidebar nav + topbar) MUST be visually faithful to the reference; the automated ≤1%
  threshold is NOT yet met (the diff is dominated by the **substitute font** — SF Compact unlicensed — and the
  **uncomposed page bodies**, which are composed by their own `compose-*` changes). The ≤1% gate is reached once the
  font is licensed and the bodies are composed — both outside this change.

**Acceptance Criteria:**
- F5 + F3 + `build` + `test:unit` + `npm run fidelity` + shell E2E green
- F1 diff run; shell chrome visually faithful; ≤1% deferred to the font licence + per-screen body composition

## ADDED Requirements (compose-client-dashboard — Phase 2 screen)

> The CLIENT `/dashboard` body composed from the kit (`BannerCard` + `Tabs` + `GigCard·grid` + `CreateGigCTA` +
> `MessagesPanel`) inside the layout's `AppShell`, bound to real data (completion %, gigs, messages). Verified by E2E
> (`__tests__/e2e/compose-client-dashboard.spec.ts`), F3 tab parity, F5 composition purity, mapper unit tests, build,
> the full unit suite, and a visual fidelity review. F1 ≤1% deferred (substitute font + cosmic banner raster).

### Requirement: CLIENT Dashboard Composed from Blocks
The CLIENT `/dashboard` body MUST be a composition-pure `@composed-screen` (`ClientDashboard`) composing a WELCOME
(greeting `SectionHeader` + `OnboardingCard ×2`) + a 2-col BOARD (`Tabs` + `GigCard` feed ‖ `CreateGigCTA` +
`MessagesPanel`) via layout primitives only (no `className`/`style`/raw markup; imports only
kit/`lib`/`actions`/`react`/`next`), rendered by the dashboard page for `role === 'CLIENT'`. *(Reconciled to
Дашборд/company `3371:5387` by `reconcile-dashboards` — `BannerCard` is replaced by the WELCOME greeting +
OnboardingCards and the body is a 2-col BOARD; see that change's section below.)*

#### Scenario: Composed CLIENT dashboard
- GIVEN a CLIENT loads `/dashboard`
- THEN the page MUST build the data server-side and render `<ClientDashboard>` (inside the shell) composing the five
  blocks; the no-session redirect MUST be preserved and the SPECIALIST branch MUST be unchanged

**Acceptance Criteria:**
- `ClientDashboard` is an F5-pure `@composed-screen` composing the five blocks; the page renders it for CLIENT; SPECIALIST branch untouched

### Requirement: CLIENT Dashboard Real Data Binding
The dashboard MUST bind real data via server-only, contract-typed mappers: `toGigCardVM` (gig → `GigCardVM`, status to
the design `Status`, `categorySlug` → `Category`, budget → `Money`, deadline, rating) and `getClientDashboard` (profile
completion %, the client's gigs as `GigCardVM`s + status tab counts, recent messages → `MessagesPanelVM`).

#### Scenario: Real completion %, gigs, messages
- GIVEN `getClientDashboard(userId)`
- THEN it MUST return the completion %, the client's gigs as `GigCardVM`s (+ tab counts), and messages as a
  `MessagesPanelVM` — assignable to the view-model contracts (imported `import type`); gig status maps `PAID→completed`

**Acceptance Criteria:**
- `toGigCardVM` + `getClientDashboard` (contract-typed); completion %, gigs, messages are real; status mapped to the design `Status`

### Requirement: CreateGigCTA Block
The `CreateGigCTA` block MUST exist — a token-pure primary action (`Button`-token-styled `Link`) + label → href —
with a fixture and a barrel export.

#### Scenario: CreateGigCTA is a token-pure kit block
- GIVEN `app/components/blocks/CreateGigCTA.tsx`
- THEN it MUST render a primary-styled `Link` (via `BUTTON_BASE`/`BUTTON_VARIANT`) → href, be token-pure, and be
  exported from the blocks barrel with a fixture

**Acceptance Criteria:**
- `CreateGigCTA` token-pure block (primary action + label → href); fixture + barrel export

### Requirement: CLIENT Dashboard Functional Parity (gig links, create flow, status tabs)
The composed dashboard MUST be functional and match the design's logical parity.

#### Scenario: Gig links, create flow, status tabs
- GIVEN the composed CLIENT dashboard
- THEN a `GigCard` MUST open `/gigs/[id]`; `CreateGigCTA` MUST open `/gigs/new`; and the `Tabs`
  (Все / В работе / На проверке / Завершённые, with real counts) MUST filter the `GigCard·grid` by status (F3)

**Acceptance Criteria:**
- `GigCard` → `/gigs/[id]`; `CreateGigCTA`/banner → `/gigs/new`; tabs filter the grid (RU labels + real counts, F3)

### Requirement: CLIENT Dashboard Verification and Deferred F1
The change MUST pass F3 + F5 + the functional/E2E suite; the F1 ≤1% pixel-diff is produced but deferred.

#### Scenario: Buildable + functional verification (enforced)
- GIVEN the change
- WHEN `lint:composition` (F5), `lint:tokens`, `npm run build`, `npm run test:unit`, the mapper unit tests, and the
  CLIENT dashboard E2E run
- THEN they MUST pass — the body is composition-pure, the blocks/tabs match the design (F3), gig links + the create
  flow work, and the existing tests stay green

#### Scenario: F1 diff produced; ≤1% deferred
- GIVEN the live CLIENT dashboard captured at 1440px and diffed vs `screens/customer-dashboard.jpg`
- THEN the composed layout MUST be visually faithful (overlay reviewed); the automated ≤1% threshold is NOT yet met —
  dominated by the **substitute font** (SF Compact unlicensed) and the **cosmic banner raster** (BannerCard `art`,
  unexported), not a composition defect; ≤1% is reached once the font is licensed and the raster exported

**Acceptance Criteria:**
- F5 + F3 + `build` + `test:unit` + mapper units + CLIENT dashboard E2E green
- F1 diff produced; composed layout visually faithful; ≤1% deferred to the font licence + banner-raster export

## ADDED Requirements (compose-specialist-dashboard — Phase 2 screen)

> The SPECIALIST `/dashboard` body composed from the kit (`BannerCard` + `Tabs` + `GigCard·grid` + `SearchPanel` +
> `MessagesPanel`) inside the layout's `AppShell`, bound to real data — completion %, the specialist's applications +
> assigned gigs across the **exact five status tabs** (Все / Заявки / В работе / На проверке / Завершённые, with
> counts), and messages. Verified by E2E (`__tests__/e2e/compose-specialist-dashboard.spec.ts`, 4/4), F3 tab parity, F5
> composition purity, the `getSpecialistDashboard` mapper unit test, build, and the full unit suite (867). F1 ≤1%
> deferred (substitute font + cosmic banner raster; diff ratio 0.1895). Reconciliation: legacy English 3-tab
> (Active/Pending/Archive) → the five RU tabs; rejected/withdrawn applications surface under **Все** only
> (`status: 'rejected'`); PENDING-application cards reflect the pending state (`review` / «На рассмотрении»).

### Requirement: SPECIALIST Dashboard Composed from Blocks
The SPECIALIST `/dashboard` body MUST be a composition-pure `@composed-screen` (`SpecialistDashboard`) composing a
WELCOME (greeting `SectionHeader` + `OnboardingCard ×2`) + a 2-col BOARD (`Tabs` + `GigCard` feed ‖ `SearchPanel` +
`MessagesPanel`) + the 6× `AttentionCard` strip via layout primitives only (no `className`/`style`/raw markup;
imports only kit/`lib`/`actions`/`react`/`next`), rendered by the dashboard page for `role === 'SPECIALIST'`.
*(Reconciled to Дашборд/specialist `2860:3751` by `reconcile-dashboards` — `BannerCard` is replaced by the WELCOME
greeting + OnboardingCards and the notification strip is added; see that change's section below.)*

#### Scenario: Composed SPECIALIST dashboard
- GIVEN a SPECIALIST loads `/dashboard`
- THEN the page MUST build the data server-side and render `<SpecialistDashboard>` (inside the shell) composing the
  five blocks, replacing the bespoke markup + the removed `SpecialistDashboardTabs`; the no-session redirect MUST be
  preserved and the CLIENT branch + unknown-role fallback MUST be unchanged

**Acceptance Criteria:**
- `SpecialistDashboard` is an F5-pure `@composed-screen` composing the five blocks; the page renders it for SPECIALIST; CLIENT branch + unknown-role fallback untouched; legacy `SpecialistDashboardTabs` removed

### Requirement: SPECIALIST Dashboard Exact Status Tabs with Counts
The dashboard `Tabs` MUST be exactly the design's five, in order, with live counts, mapped to the existing
application/gig states.

#### Scenario: The five tabs map to the existing states
- GIVEN the specialist's applications and assigned gigs
- THEN the `Tabs` MUST be exactly **Все · Заявки · В работе · На проверке · Завершённые** (in order, with counts), where
  Заявки = `PENDING` applications · В работе = assigned `IN_PROGRESS` · На проверке = assigned `REVIEW` · Завершённые =
  assigned `COMPLETED`/`PAID` · Все = all cards; selecting a tab MUST show only that tab's `GigCard`s (F3)

**Acceptance Criteria:**
- Tabs are exactly Все/Заявки/В работе/На проверке/Завершённые (RU, ordered) with live counts mapped to PENDING applications + assigned IN_PROGRESS/REVIEW/COMPLETED·PAID + all

### Requirement: SPECIALIST Dashboard Real Data Binding
The dashboard MUST bind real data via the server-only, contract-typed `getSpecialistDashboard` mapper, which reuses
`toGigCardVM`. It fetches the specialist's applications (full gig) + assigned gigs, maps each to a `GigCardVM` tagged
with a `tabKey`, builds the five-tab counts, computes profile completion %, and returns recent messages as a
`MessagesPanelVM`.

#### Scenario: Mapper returns completion %, tagged cards, counts, messages
- GIVEN `getSpecialistDashboard(userId)`
- THEN it MUST return the completion %, the applications + assigned gigs as `GigCardVM`s (each with a `tabKey`), the
  five-tab counts, and messages as a `MessagesPanelVM` — assignable to the view-model contracts (imported `import
  type`); PENDING-application cards map to `review`, rejected/withdrawn to `rejected` (tabKey `archive`)

**Acceptance Criteria:**
- `getSpecialistDashboard` (contract-typed, reuses `toGigCardVM`); completion %, `tabKey` cards, counts, messages are real; the block view-model contracts (`app/components/blocks/view-models.ts`) are unchanged (new types in `lib/view-models.ts`)

### Requirement: SearchPanel Block
The `SearchPanel` block MUST exist — a token-pure composition of the `SearchInput` primitive + a primary "Найти
проект" action, presentational via an `onSubmit(query)` callback — with a fixture and a barrel export.

#### Scenario: SearchPanel is a token-pure kit block over SearchInput
- GIVEN `app/components/blocks/SearchPanel.tsx`
- THEN it MUST compose `SearchInput` + a primary action, be token-pure, expose `onSubmit(query)`, and be exported from
  the blocks barrel with a fixture

**Acceptance Criteria:**
- `SearchPanel` token-pure block (SearchInput + "Найти проект" action, `onSubmit(query)`); fixture + barrel export

### Requirement: SPECIALIST Dashboard Functional Parity (gig links, find-project)
The composed dashboard MUST be functional and match the design's logical parity.

#### Scenario: Gig links and the find-project search
- GIVEN the composed SPECIALIST dashboard
- THEN a `GigCard` MUST open `/gigs/[id]`; the `SearchPanel` submit (and the "Найти проект" action) MUST navigate to
  `/gigs` (carrying the query, e.g. `/gigs?q=…`); and the `Tabs` MUST filter the grid by `tabKey` (F3)

**Acceptance Criteria:**
- `GigCard` → `/gigs/[id]`; `SearchPanel` submit → `/gigs?q=…`; tabs filter the grid by `tabKey` (RU labels + counts, F3)

### Requirement: SPECIALIST Dashboard Verification and Deferred F1
The change MUST pass F3 + F5 + the functional/E2E suite; the F1 ≤1% pixel-diff is produced but deferred.

#### Scenario: Buildable + functional verification (enforced)
- GIVEN the change
- WHEN `lint:composition` (F5), `lint:tokens`, `npm run build`, `npm run test:unit`, the mapper unit test, and the
  SPECIALIST dashboard E2E run
- THEN they MUST pass — the body is composition-pure, the five tabs match the design exactly (F3), gig links + the
  find-project flow work, and the existing tests stay green

#### Scenario: F1 diff produced; ≤1% deferred
- GIVEN the live SPECIALIST dashboard captured at 1440px and diffed vs `screens/specialist-dashboard.jpg`
- THEN the composed layout MUST be visually faithful (overlay reviewed; ratio 0.1895); the automated ≤1% threshold is
  NOT yet met — dominated by the **substitute font** (SF Compact unlicensed) and the **cosmic banner raster**
  (BannerCard `art`, unexported), not a composition defect; ≤1% is reached once the font is licensed and the raster
  exported

**Acceptance Criteria:**
- F5 + F3 + `build` + `test:unit` + mapper unit test + SPECIALIST dashboard E2E green
- F1 diff produced; composed layout visually faithful; ≤1% deferred to the font licence + banner-raster export

## ADDED Requirements (compose-gig-search — Phase 2 screen)

> **Superseded in part by `reconcile-gig-browse` (Phase 1, RC-S11, node `2860:2056`)** — the screen now leads with a
> `SectionHeader` «Поиск проектов» and the grid/list `ViewToggle` is **hoisted into that header row** (no longer
> rendered "via `FilterBar`", and the `Section title="Поиск гигов"` header is gone). See the dated
> `## MODIFIED + ADDED Requirements (reconcile-gig-browse — Phase 1 screen)` section below; the data-binding /
> preserved-query requirements here remain in force.

> The SPECIALIST `/gigs` browse/search screen composed from the kit (`FilterBar` + `ViewToggle` + `GigCard·(grid/list)`
> + a "Найдено N" `ResultCount`) inside the layout's `AppShell`, **preserving** the existing OPEN-gig query (search /
> tags / budget / sort / pagination, SPECIALIST-only, page-validation redirects, gig-link filter preservation) and
> **adding** the design's **category** filter, **Рейтинг** (gig-owner aggregate) filter, and **grid⇄list** view — all
> URL-param-driven. Verified by E2E (`__tests__/e2e/compose-gig-search.spec.ts`, 5/5), the preserved gig-browse
> integration tests (28/28 + `gig-browse-access` 10/10), the `getGigSearch`/`toBrowseGigCardVM` mapper unit test (3/3),
> F5 composition purity, build, and the full unit suite (870). F1 ≤1% deferred (substitute font; grid 0.1164 / list
> 0.0993). Reconciliation: design FilterBar = search + category + sort + Рейтинг + view; tag/budget remain honored via
> URL (server query unchanged) for deep links + integration tests; Рейтинг = the gig owner (client) aggregate rating.

### Requirement: Gig Search Composed from Blocks
The `/gigs` body MUST be a composition-pure `@composed-screen` (`GigSearch`) composing `FilterBar` + `ViewToggle` (via
`FilterBar`) + `GigCard·(grid/list)` + a "Найдено N" `ResultCount`, via layout primitives only (no
`className`/`style`/raw markup; imports only kit/`lib`/`actions`/`react`/`next`), rendered by the `/gigs` page for
SPECIALIST users.

#### Scenario: Composed gig search
- GIVEN a SPECIALIST loads `/gigs`
- THEN the page MUST build the data server-side and render `<GigSearch>` (inside the shell) composing the FilterBar +
  result count + GigCard grid/list, replacing the bespoke header + `GigBrowseClient`/`GigFilters`; the SPECIALIST-only
  redirect (CLIENT → `/dashboard?error=…`) MUST be preserved

**Acceptance Criteria:**
- `GigSearch` is an F5-pure `@composed-screen` composing FilterBar + ViewToggle + GigCard·(grid/list) + "Найдено N"; rendered for SPECIALIST; SPECIALIST-only redirect preserved; bespoke browse markup + `GigFilters` removed

### Requirement: Preserved Search / Tag / Budget / Sort / Pagination
The composition MUST preserve the existing OPEN-gig query and pagination behaviour exactly (URL-state, 25/page,
page-validation redirects, gig-link filter preservation); their semantics MUST NOT change.

#### Scenario: Query + pagination unchanged
- GIVEN the existing `search`/`tags`/`minBudget`/`maxBudget`/`sort`/`page` URL params
- THEN the OPEN-gig `where`/`orderBy`, the 25-per-page parallel `findMany`+`count`, the page-validation redirects, and
  `PaginationControls` MUST behave as before; a `GigCard` MUST open `/gigs/[id]?from=browse&…` preserving the filters

**Acceptance Criteria:**
- search/tag/budget/sort/pagination preserved (the gig-browse integration tests stay green); gig links preserve filters

### Requirement: Added Category, Рейтинг, View Toggle, and Result Count
The composition MUST add the design's category filter, rating filter, grid⇄list toggle, and RU result count, all
URL-param-driven.

#### Scenario: Category / Рейтинг / view / count
- GIVEN the composed FilterBar + ResultCount
- THEN choosing a category MUST filter by `categorySlug` (`category` param, validated); choosing a min-rating MUST
  filter by the gig **owner (client)** aggregate rating (`minRating` via `review.groupBy`); toggling the view MUST
  render `GigCard`s in grid (`Grid`, `layout: 'grid'`) or list (`Stack`, `layout: 'list'`) per a `view` param; and a RU
  **"Найдено N"** count MUST be shown

**Acceptance Criteria:**
- Category filter (5 categories), Рейтинг filter (client aggregate via groupBy), grid⇄list `ViewToggle`, "Найдено N" — all URL-driven (F3)

### Requirement: Functional FilterBar Block
The `FilterBar` block MUST drive the filter/search UI — a controlled `SearchInput` (`onSearch`) + category/sort/Рейтинг
`Select`s + `ViewToggle`, each emitting a typed callback — additively (optional props; the `search-only`/`full`
fixtures + workbench usage keep working) and token-pure.

#### Scenario: FilterBar emits typed changes
- GIVEN `app/components/blocks/FilterBar.tsx`
- THEN it MUST expose `onSearch`/`onCategory`/`onSort`/`onRating`/`onViewChange` callbacks driving the composed screen's
  URL state, with the legacy `vm.filters` Select rendered only when non-empty; new props optional, token-pure

**Acceptance Criteria:**
- `FilterBar` extended to drive search + category/sort/rating selects + view toggle (typed callbacks), additive + backward compatible, token-pure

### Requirement: Browse Data Binding via Contract-Typed Mappers
The screen MUST bind real data via server-only, contract-typed mappers reusing `toGigCardVM`: `toBrowseGigCardVM`
(overrides `rating` with the gig owner's aggregate via `getRatingForUser(clientId)` + sets `clientName`) and
`getGigSearch` (cards / `FilterBarVM` / count / page / totalPages / view).

#### Scenario: Browse cards show the client rating + name
- GIVEN an OPEN gig
- THEN `toBrowseGigCardVM(gig, layout)` MUST reuse `toGigCardVM` and show the gig owner's rating + `clientName`; and
  `getGigSearch` MUST return the cards, `FilterBarVM`, count, pagination, and view — `import type` the VMs; the block
  view-model contract (`app/components/blocks/view-models.ts`) MUST be unchanged

**Acceptance Criteria:**
- `toBrowseGigCardVM` (client rating + `clientName`, reuses `toGigCardVM`) + `getGigSearch`; block view-model contract unchanged (screen-data types in `lib/view-models.ts`)

### Requirement: Gig Search Verification and Deferred F1
The change MUST pass F3 + F5 + the functional/E2E suite; the F1 ≤1% pixel-diff is produced (both layouts) but deferred.

#### Scenario: Buildable + functional verification (enforced)
- GIVEN the change
- WHEN `lint:composition` (F5), `lint:tokens`, `npm run build`, `npm run test:unit`, and the gig-search E2E run
- THEN they MUST pass — the body is composition-pure, search/filter/sort/pagination/view match (F3), gig links work, and
  the preserved gig-browse integration tests stay green

#### Scenario: F1 diff produced in both layouts; ≤1% deferred
- GIVEN the live `/gigs` captured at 1440px in grid and list and diffed vs `screens/specialist-gig-search.jpg`
- THEN the composed layouts MUST be visually faithful; the automated ≤1% threshold is NOT yet met — dominated by the
  **substitute font** (SF Compact unlicensed), not a composition defect; ≤1% is reached once the font is licensed

**Acceptance Criteria:**
- F5 + F3 + `build` + `test:unit` + gig-search E2E green; gig-browse integration tests green
- F1 diff produced in both layouts (grid 0.1164 / list 0.0993); composed layouts visually faithful; ≤1% deferred to the font licence

## ADDED Requirements (compose-gig-detail-apply — Phase 2 screen)

> The `/gigs/[id]` gig-detail screen composed from the kit (`GigHeader` + `RequirementCard·grid` + `CriteriaList` +
> `ClientCard` + `TermsTabs` + `ApplyPanel` + `ChatPanel`) inside the layout's `AppShell`, binding real data via
> `getGigDetail` and **preserving every functional flow** for all roles (apply/withdraw; owner applications +
> accept/reject; submit/approve/pay; messaging; admin moderation; example/closed/not-found) by wiring the **unchanged 8
> server actions** directly (`useActionState` + `<form action>`). Verified by E2E
> (`__tests__/e2e/compose-gig-detail-apply.spec.ts`, 5/5 — apply → owner-accept → submit → messaging → example), the
> `getGigDetail` mapper unit test (4/4), the preserved gig-lifecycle integration tests (25), F5 composition purity,
> build, and the full unit suite (874). F1 ≤1% deferred (substitute font; ratio 0.1034). Two gap-fill blocks added:
> `GigHeader` (+ additive `GigHeaderVM`) and `Notice` (token-styled notices). The bespoke `[id]/*` form components are
> superseded; the page (server) renders the `Breadcrumb` + `<GigDetail>`.

### Requirement: Gig Detail Composed from Blocks
The `/gigs/[id]` body MUST be a composition-pure `@composed-screen` (`GigDetail`) composing `GigHeader` +
`RequirementCard·grid` + `CriteriaList` + `ClientCard` + `TermsTabs` + `ApplyPanel` + `ChatPanel` via layout primitives
only (no `className`/`style`/raw styled markup; imports only kit/`lib`/`actions`/`react`/`next` — NOT the bespoke
`[id]/*` form components), rendered by the `/gigs/[id]` page.

#### Scenario: Composed gig detail
- GIVEN a user loads `/gigs/[id]`
- THEN the page MUST build the data via `getGigDetail` and render `<GigDetail>` (inside the shell) + the `Breadcrumb`;
  the no-session redirect, the not-found branch, and `markNotificationAsRead` for authorized viewers MUST be preserved

**Acceptance Criteria:**
- `GigDetail` is an F5-pure `@composed-screen` composing the seven blocks; the page renders it + breadcrumb; redirect + not-found + notification preserved; bespoke `[id]/*` forms superseded

### Requirement: Gig Detail Real Data Binding
The screen MUST bind real data via the server-only, contract-typed `getGigDetail(gigId, viewer)` mapper: `GigHeaderVM`,
`RequirementCardVM[]` (filled goal/deliverables/constraints), `CriteriaListVM` (from `acceptanceCriteria`),
`ClientCardVM` (owner + `getRatingForUser(clientId)`), `TermsTabsVM` (proposed = the viewer's application counter,
falling back to the gig's; client = the gig's), `ChatPanelVM` (messages thread), `ApplyPanelVM`, plus the role +
lifecycle state. Returns `null` for a missing gig.

#### Scenario: Mapper returns the block VMs + role/lifecycle state
- GIVEN `getGigDetail(gigId, viewer)`
- THEN it MUST return the seven block VMs + `isOwner`/`isAssignedSpecialist`/`viewerApplication`/`applications`/
  `lifecycle`/`messaging`/`moderations`; assignable to the view-model contracts (`import type`); the block contract
  gains **only** the additive `GigHeaderVM` (screen-data types live in `lib/view-models.ts`)

**Acceptance Criteria:**
- `getGigDetail` (contract-typed) returns the seven block VMs + role/lifecycle flags; null for a missing gig; block contract gained only `GigHeaderVM`

### Requirement: GigHeader and Notice Blocks (composition-gap fills)
The `GigHeader` block (detail header: title + `StatusBadge` + budget + deadline + `CategoryTag` + tags + date, from
`GigHeaderVM`) and the `Notice` block (token-styled notices/errors) MUST be implemented token-pure, with fixtures and
barrel exports.

#### Scenario: GigHeader + Notice are token-pure kit blocks
- GIVEN `app/components/blocks/GigHeader.tsx` and `app/components/blocks/Notice.tsx`
- THEN both MUST be token-pure (primitives + layout + tokens), exported from the blocks barrel; `GigHeaderVM` is added
  additively to the block view-model contract

**Acceptance Criteria:**
- `GigHeader` (+ additive `GigHeaderVM`) + `Notice` blocks, token-pure, with fixture + barrel exports

### Requirement: Preserved Flows Wired to the Existing Actions
The composition MUST preserve every flow for all roles by wiring the existing server actions directly (no semantics
change): apply (`applyToGig`) + withdraw (`withdrawApplication`); owner applications + accept/reject
(`acceptApplication`/`rejectApplication`); submit (`submitWork`); approve (`approveWork`); mark-as-paid (`markAsPaid`);
gig-scoped messaging (`sendMessage`, gated on assignment + not closed/paid). Admin moderation, example, closed-by-admin,
and not-found states MUST render.

#### Scenario: The lifecycle walk + messaging + states
- GIVEN the composed gig detail
- WHEN a SPECIALIST applies, the owner accepts (→ IN_PROGRESS), the assigned specialist submits (→ REVIEW), the owner
  approves (→ COMPLETED) and marks paid (→ PAID), and messages are sent once assigned
- THEN each MUST work via its wired action; example gigs MUST show the no-apply notice; the lifecycle **semantics**
  (transitions, authorization) MUST be unchanged (the gig-lifecycle/application/messaging tests stay green)

**Acceptance Criteria:**
- All 8 actions wired + working (`useActionState` + `<form action>`); owner applications + accept/reject; messaging gating; example/closed/not-found; lifecycle semantics unchanged

### Requirement: Gig Detail Verification and Deferred F1
The change MUST pass F3 + F5 + the functional/E2E suite; the F1 ≤1% pixel-diff is produced but deferred.

#### Scenario: Buildable + functional verification (enforced)
- GIVEN the change
- WHEN `lint:composition` (F5), `lint:tokens`, `npm run build`, `npm run test:unit`, the mapper unit test, and the
  gig-detail E2E run
- THEN they MUST pass — the body is composition-pure, every role's flows/states match (F3), the lifecycle walk +
  messaging work, and the existing lifecycle/application/messaging tests stay green

#### Scenario: F1 diff produced; ≤1% deferred
- GIVEN the live SPECIALIST `/gigs/[id]` captured at 1440px and diffed vs `screens/specialist-gig.jpg`
- THEN the composed layout MUST be visually faithful (ratio 0.1034); the automated ≤1% threshold is NOT yet met —
  dominated by the **substitute font** (SF Compact unlicensed), not a composition defect; ≤1% is reached once the font
  is licensed

**Acceptance Criteria:**
- F5 + F3 + `build` + `test:unit` + mapper unit test + gig-detail E2E green; existing lifecycle/application/messaging tests green
- F1 diff produced (ratio 0.1034); composed layout visually faithful; ≤1% deferred to the font licence

## ADDED Requirements (compose-profile — Phase 2 screen)

> The `/profile` screen (own + the `/profile/[userId]` public view) composed from the kit (`ProfileHeader` + `StatPanel`
> + `TagList(Стек)` + `CategoryTags(Избранные)` + `ExperienceList(Опыт)` + `GigCard·list(Реализованные)`) inside the
> layout's `AppShell`, binding real data via `getProfile` (the profile-evolution fields, the tech stack, the five
> categories with the user's favorites marked, the bio + `WorkExperience`, the COMPLETED/PAID realized gigs, and the
> aggregate rating — no hardcoded rating) and **preserving the edit flow** (`/profile/edit` + the unchanged
> `updateProfile` action). Verified by E2E (`__tests__/e2e/compose-profile.spec.ts`, 3/3 — composed render · public
> read-only · edit round-trip), the `getProfile` mapper unit test (4/4), the preserved profile integration tests
> (profile-evolution 12 + profile-sanitization 8), F5 composition purity, build, and the full unit suite (878). F1 ≤1%
> deferred (substitute font + the mock's avatar raster; ratio 0.1471). Four gap-fill blocks added: `ProfileHeader`,
> `TagList`, `CategoryTags`, `ExperienceList` (+ additive `TagListVM`/`CategoryTagsVM`/`ExperienceListVM` and an optional
> `ProfileHeaderVM.online`). The bespoke profile bodies (own + public) are superseded; the superseded bespoke-markup
> pilot `profile-specialist-ui-tokens.spec.ts` is removed (its token-surface intent now guaranteed by the F2/F5 lints).

### Requirement: Profile Composed from Blocks
The `/profile` body (and the `/profile/[userId]` public view) MUST be a composition-pure `@composed-screen` (`Profile`)
composing `ProfileHeader` + `StatPanel` + `TagList` + `CategoryTags` + `ExperienceList` + `GigCard·list` via layout
primitives only (no `className`/`style`/raw styled markup; imports only kit/`lib`/`actions`/`react`/`next`), shared by
both pages.

#### Scenario: Composed profile
- GIVEN a user loads `/profile` or `/profile/[userId]`
- THEN each page MUST build the data via `getProfile` and render `<Profile>` (inside the shell) — the own page with
  `isOwner` + the `Breadcrumb`, the public page with `isOwner={false}`; the no-session redirect, the self→`/profile`
  redirect on the public route, and the not-set-up / not-found `Notice` (when `getProfile` returns `null`) MUST be
  preserved

**Acceptance Criteria:**
- `Profile` is an F5-pure `@composed-screen` composing the six blocks; both pages render it (own with `isOwner`, public read-only); redirect + self-redirect + not-set-up/not-found preserved; bespoke profile bodies superseded

### Requirement: Profile Real Data Binding
The screen MUST bind real data via the server-only, contract-typed `getProfile(targetUserId, viewer)` mapper. For a
SPECIALIST: `ProfileHeaderVM` (avatar / name / role tag / phone-verified / member-since from `createdAt`), `TagListVM`
(techStack split), `CategoryTagsVM` (the five canonical categories with the user's `favoriteCategories` marked),
`ExperienceListVM` (bio + ordered `WorkExperience`, period «2021 — Наст. время» for a null endYear), `realized:
GigCardVM[]` (COMPLETED/PAID assigned gigs), the aggregate `rating` (via `getRatingForUser`, not hardcoded), and
`isOwner`. For a CLIENT: the company header + stats. Returns `null` for a missing user / unset profile.

#### Scenario: Mapper returns the block VMs + role state
- GIVEN `getProfile(targetUserId, viewer)`
- THEN it MUST return the block VMs + `rating` + `isOwner` (SPECIALIST: header/stack/categories/experience/realized;
  CLIENT: header/stats); assignable to the view-model contracts (`import type`); `null` for a missing/unset profile;
  the block contract gains only the additive `TagListVM`/`CategoryTagsVM`/`ExperienceListVM` (screen-data types live in
  `lib/view-models.ts`)

**Acceptance Criteria:**
- `getProfile` (contract-typed) returns the block VMs + rating + `isOwner`; the real aggregate rating; null for missing/unset; reuses `getRatingForUser`/`CATEGORIES`/`toGigCardVM`

### Requirement: Profile Blocks (composition-gap fills)
The four blocks named by this composition but absent from the kit MUST be implemented token-pure, each with a fixture
and a barrel export: `ProfileHeader` (avatar + name + the specialty via the `SpecialtyTag` primitive + an availability
status pill + phone-verified badge + member-since + inline stats + optional owner edit affordance — reconciled to the
Figma ID block by `reconcile-profile-screen`; see that change's section below), `TagList` (titled `Tag` list),
`CategoryTags` (the five `CategoryTag`s with favorites emphasised), `ExperienceList` (bio + work-experience entries).

#### Scenario: The four blocks are token-pure kit blocks
- GIVEN `app/components/blocks/{ProfileHeader,TagList,CategoryTags,ExperienceList}.tsx`
- THEN each MUST be token-pure (primitives + layout + tokens), exported from the blocks barrel, with a fixture;
  `TagListVM`/`CategoryTagsVM`/`ExperienceListVM` are added additively to the block view-model contract (`ProfileHeaderVM`
  already exists; any change to it is additive)

**Acceptance Criteria:**
- Four token-pure blocks + three additive VMs (+ optional `ProfileHeaderVM.online`) + fixtures + barrel exports; `lint:tokens` (F2) passes

### Requirement: Preserved Edit Flow
The composition MUST preserve the profile edit flow without changing the edit form or the `updateProfile` action.

#### Scenario: Owner edits the profile
- GIVEN the profile owner viewing `/profile`
- WHEN they use the `ProfileHeader` edit affordance
- THEN it MUST navigate to `/profile/edit`, where the existing `ProfileEditForm` (driving the unchanged `updateProfile`
  action) saves and round-trips back to the composed `/profile`; the public `[userId]` view MUST NOT show any edit
  affordance

**Acceptance Criteria:**
- Edit affordance → `/profile/edit`; `ProfileEditForm` + `updateProfile` unchanged; save round-trips; public view read-only

### Requirement: Profile Verification and Deferred F1
The change MUST pass F3 + F5 + the functional/E2E suite; the F1 ≤1% pixel-diff is produced but deferred.

#### Scenario: Buildable + functional verification (enforced)
- GIVEN the change
- WHEN `lint:composition` (F5), `lint:tokens`, `npm run build`, `npm run test:unit`, the mapper unit test, and the
  profile E2E run
- THEN they MUST pass — the body is composition-pure, the IA matches the mock (header/stack/categories/experience/
  realized) (F3), the composed render + edit round-trip + public read-only view work, and the existing profile/
  `updateProfile` integration tests stay green

#### Scenario: F1 diff produced; ≤1% deferred
- GIVEN the live SPECIALIST `/profile` captured at 1440px and diffed vs `screens/specialist-progile.jpg`
- THEN the composed layout MUST be visually faithful (ratio 0.1471); the automated ≤1% threshold is NOT yet met —
  dominated by the **substitute font** (SF Compact unlicensed) + the mock's avatar raster, not a composition defect; ≤1%
  is reached once the font is licensed and the avatar asset is exported

**Acceptance Criteria:**
- F5 + F3 + `build` + `test:unit` + mapper unit test + profile E2E green; existing profile/`updateProfile` tests green
- F1 diff produced (ratio 0.1471); composed layout visually faithful; ≤1% deferred to the font licence + avatar export

## ADDED Requirements (compose-chats — Phase 2 screen)

> The new `/chats` inbox composed from the kit (`ConversationItem·list` + a search + `ChatHeader` + `ChatPanel` with
> `MessageBubble·thread` + composer) inside the layout's `AppShell`, over the existing gig-scoped `Message` model —
> conversations bound via `getConversations`, the selected thread via `getChatThread` (URL-driven `?gig=<id>`), **unread
> derived from `Notification.lastReadAt`**, opening a conversation marking it read, and the sidebar «Чаты» count wired
> to `getUnreadChatCount`. Sending reuses the **unchanged** `sendMessage` (which redirects to `/gigs/<id>` — the same
> conversation). Verified by E2E (`__tests__/e2e/compose-chats.spec.ts`, 4/4 — inbox · open-thread · send · search), the
> mapper unit tests (`chats-vm.test.ts`, 7/7), the preserved messaging integration tests (25) + the gig-detail E2E (5,
> per-gig messaging intact), F5 composition purity, build, and the full unit suite (885). F1 ≤1% deferred (substitute
> font + avatar rasters; ratio 0.1786). One gap-fill block added: `ChatHeader` (+ `ChatHeaderVM`); the `ChatPanel`
> (optional header + day separators), `ConversationItem` (subtitle), and `MessageBubbleVM` (date) changes are additive
> (the gig-detail caller is unchanged). No data model is added; messaging semantics are unchanged.

### Requirement: Chats Composed from Blocks
The `/chats` body MUST be a composition-pure `@composed-screen` (`Chats`) composing `ConversationItem·list` + a search +
`ChatHeader` + `ChatPanel` (with `MessageBubble·thread` + composer) via layout primitives only (no `className`/`style`/
raw styled markup; imports only kit/`lib`/`actions`/`react`/`next`), rendered by the `/chats` page with URL-driven
(`?gig=<id>`) conversation selection.

#### Scenario: Composed chats inbox
- GIVEN a user loads `/chats` (optionally `/chats?gig=<id>`)
- THEN the page MUST build the inbox via `getConversations` and, when `?gig` is present and the viewer is authorized, the
  thread via `getChatThread`, rendering `<Chats>` inside the shell; the no-session redirect MUST be preserved, and an
  empty/zero-state MUST render when there are no conversations or none is selected

**Acceptance Criteria:**
- `Chats` is an F5-pure `@composed-screen` composing the inbox + thread blocks; the page renders it with `?gig` selection; redirect + empty-state preserved

### Requirement: Inbox and Thread Real Data Binding
The screen MUST bind real data via server-only, contract-typed `getConversations` and `getChatThread` mappers over the
gig-scoped `Message` model. `getConversations(viewer)` returns one `ConversationItemVM` per gig the viewer participates
in (CLIENT: own gigs with an assigned specialist; SPECIALIST: assigned gigs) that has ≥1 message — counterparty name,
gig title (subtitle), last-message preview, time, and `unread` (messages from others after the viewer's
`Notification.lastReadAt`), sorted by last message desc. `getChatThread(gigId, viewer)` returns `{ header: ChatHeaderVM,
chat: ChatPanelVM }` (thread with direction per viewer + day-date + receipts; counterparty header) or `null` when the
viewer is not the gig owner / assigned specialist.

#### Scenario: Mappers return the conversation list and the authorized thread
- GIVEN `getConversations(viewer)` and `getChatThread(gigId, viewer)`
- THEN the list MUST carry per-gig conversations (name/subtitle/preview/timestamp/unread, ordered by last message) and
  the thread MUST carry the in/out bubbles (+ day separators) + the counterparty `ChatHeader`; `getChatThread` MUST
  return `null` for a non-participant or a missing gig; both reuse `getRatingForUser` + the `lastReadAt` rule

**Acceptance Criteria:**
- `getConversations` returns per-gig conversations + unread; `getChatThread` returns thread + header, `null` for unauthorized/missing

### Requirement: ChatHeader Block and Additive Chat Enhancements
The `ChatHeader` block MUST be implemented token-pure (Avatar + counterparty name + verified + Rating + presence) with a
fixture + barrel export; and the `ChatPanel` (optional header + day separators), `ConversationItem` (optional subtitle),
and `MessageBubbleVM` (optional `date`) changes MUST be additive and backward-compatible.

#### Scenario: ChatHeader + additive enhancements
- GIVEN `app/components/blocks/ChatHeader.tsx` and the chat blocks/contracts
- THEN `ChatHeader` MUST be a token-pure exported block with `ChatHeaderVM`; WHEN the additive props are absent the
  blocks MUST render exactly as before (the gig-detail `ChatPanel` is unaffected); WHEN `MessageBubbleVM.date` changes
  between consecutive bubbles a token-styled day separator MUST render, WHEN `ChatPanelVM.header` is present it MUST
  render above the thread, and WHEN `ConversationItemVM.subtitle` is present it MUST render under the name

**Acceptance Criteria:**
- `ChatHeader` token-pure block + `ChatHeaderVM` + fixture + export; `ChatPanel`/`ConversationItem`/`MessageBubbleVM` changes additive; `lint:tokens` passes

### Requirement: Unread, Mark-Read, and the Sidebar «Чаты» Count
Unread MUST be derived from `Notification.lastReadAt`; opening a conversation MUST mark it read; the sidebar «Чаты»
count MUST reflect the unread-conversation count.

#### Scenario: Opening clears unread and the count matches the inbox
- GIVEN a conversation with messages from the other party after the viewer's `lastReadAt`
- WHEN the viewer opens it (`/chats?gig=<id>`)
- THEN the page MUST call `markNotificationAsRead(gigId)` so the conversation's `unread` clears; and the protected
  layout's `chats` nav count MUST use `getUnreadChatCount` (gigs with unread messages), matching the inbox badges

**Acceptance Criteria:**
- Unread from `Notification.lastReadAt`; opening calls `markNotificationAsRead`; the sidebar «Чаты» count uses `getUnreadChatCount`

### Requirement: Preserved Messaging Wired to the Existing Action
Sending MUST use the existing `sendMessage` action (no semantics change), and per-gig (gig-detail) messaging MUST stay
intact.

#### Scenario: Send from the thread; gig-detail messaging unaffected
- GIVEN the selected conversation's composer
- WHEN the viewer submits a message
- THEN it MUST call `sendMessage` (the `content` field + a hidden `gigId`) via `useActionState` + `<form action>`; the
  message MUST be sent and visible (the action redirects to `/gigs/<id>` — the same conversation); the gig-detail
  per-gig `ChatPanel` MUST keep working (the block changes are additive)

**Acceptance Criteria:**
- `sendMessage` wired directly; messaging semantics unchanged; gig-detail per-gig messaging works (its E2E + the messaging integration tests stay green)

### Requirement: Chats Verification and Deferred F1
The change MUST pass F3 + F5 + the functional/E2E suite; the F1 ≤1% pixel-diff is produced but deferred.

#### Scenario: Buildable + functional verification (enforced)
- GIVEN the change
- WHEN `lint:composition` (F5), `lint:tokens`, `npm run build`, `npm run test:unit`, the mapper unit tests, and the
  chats E2E run
- THEN they MUST pass — the body is composition-pure, the IA matches the mock (list + thread + composer) (F3), the
  inbox/open-thread/mark-read/send/search flows work, and the existing messaging integration tests stay green

#### Scenario: F1 diff produced; ≤1% deferred
- GIVEN the live `/chats` captured at 1440px and diffed vs `screens/specialist-chats.jpg`
- THEN the composed layout MUST be visually faithful (ratio 0.1786); the automated ≤1% threshold is NOT yet met —
  dominated by the **substitute font** + avatar rasters, not a composition defect; ≤1% is reached once the font is
  licensed and avatars are exported

**Acceptance Criteria:**
- F5 + F3 + `build` + `test:unit` + mapper unit tests + chats E2E green; existing messaging tests + gig-detail E2E green
- F1 diff produced (ratio 0.1786); composed layout visually faithful; ≤1% deferred to the font licence + avatars

## ADDED Requirements (compose-finances — Phase 2 screen)

> The new `/finances` screen composed from the kit (`AppShell + StatPanel + LedgerTable`) inside the layout's
> `AppShell`, over the **logical** `finances-ledger` data layer (`lib/finances.ts`) — bound via the `getFinances`
> aggregator (reusing `getFinanceStats` + `getLedger`, no re-derivation, per-role amounts), with an empty state and an
> explicit «логические суммы, без реальных платежей» framing (the `project.md` Escrow/Payments MVP boundary). Read-only
> (no writes/actions). Verified by E2E (`__tests__/e2e/compose-finances.spec.ts`, 3/3 — ledger+stats+framing · empty
> state · «Финансы» nav active), the mapper unit tests (`finances-vm.test.ts`, 3/3 — CLIENT `totalAmount`, SPECIALIST
> `budget`, empty), the preserved `finances-ledger` tests (7), F5 composition purity, build, and the full unit suite
> (888). One gap-fill block added: `LedgerTable` (its `LedgerTableVM` contract pre-existed). **F1 is flagged-missing** —
> there is no `Финансы` reference frame in `/screens` (a frame is requested); the screen is composed from the kit with
> F5/F3 enforced. No data model is added; `lib/finances` semantics are unchanged.

### Requirement: Finances Composed from Blocks
The `/finances` body MUST be a composition-pure `@composed-screen` (`Finances`) composing `StatPanel` + `LedgerTable`
(plus a token-styled logical-amounts framing) via layout primitives only (no `className`/`style`/raw styled markup;
imports only kit/`lib`/`react`/`next`), rendered by the `/finances` page.

#### Scenario: Composed finances screen
- GIVEN an authenticated user loads `/finances`
- THEN the page MUST build the data via `getFinances` and render `<Finances>` (inside the shell); the no-session
  redirect MUST be preserved, and the sidebar «Финансы» nav item MUST be active on `/finances`

**Acceptance Criteria:**
- `Finances` is an F5-pure `@composed-screen` composing `StatPanel` + `LedgerTable` + framing; redirect preserved; «Финансы» nav item active

### Requirement: Finances Real Data Binding via getFinances
The screen MUST bind real data through a server-only, contract-typed `getFinances` aggregator over `lib/finances` (no
re-derivation): `{ stats: StatPanelVM, ledger: LedgerTableVM }` where the ledger entries are the viewer's PAID gigs
(newest first) with the summed balance, and the stats reflect realized/pending/count, using per-role amounts (CLIENT
`totalAmount`, SPECIALIST `budget`).

#### Scenario: Stats + ledger reflect PAID gigs
- GIVEN `getFinances(viewer)`
- THEN it MUST return `{ stats, ledger }` by reusing `getFinanceStats` + `getLedger`; the ledger reflects the viewer's
  PAID gigs + balance; amounts are per-role; assignable to the view-model contracts (`import type`)

**Acceptance Criteria:**
- `getFinances` returns `{ stats, ledger }` from `lib/finances`; reflects PAID gigs + balance; per-role amounts

### Requirement: LedgerTable Block (composition-gap fill)
The `LedgerTable` block MUST be implemented (named by this composition; its `LedgerTableVM` contract pre-existed but no
block implemented it).

#### Scenario: LedgerTable is a token-pure kit block with an empty state
- GIVEN `app/components/blocks/LedgerTable.tsx`
- THEN it MUST render the ledger from a `LedgerTableVM` — a header + one row per entry (date · label · `StatusBadge` ·
  amount in mono) + a summed balance, and an **empty state** when `entries` is empty — be token-pure, have a fixture,
  and be exported from the blocks barrel

**Acceptance Criteria:**
- `LedgerTable` token-pure block (entries + balance + empty state) + fixture + barrel export; `lint:tokens` passes

### Requirement: Logical-Amounts Framing and Empty State
The screen MUST make the MVP escrow boundary visible and handle the no-payments case.

#### Scenario: Framing + empty state
- GIVEN the `/finances` screen
- THEN it MUST display an explicit framing that amounts are logical with no real payments (e.g. «Суммы логические, без
  реальных платежей»), consistent with `project.md`'s Escrow / Payments (MVP) boundary; and WHEN the user has no PAID
  gigs the `LedgerTable` MUST render its empty state (e.g. «Пока нет операций»)

**Acceptance Criteria:**
- The logical-amounts framing is present; the empty state renders for users with no realized payments

### Requirement: Finances Verification and Flagged-Missing F1
The change MUST pass F3 + F5 + the functional/E2E suite; F1 is flagged-missing (no `Финансы` reference frame).

#### Scenario: Buildable + functional verification (enforced)
- GIVEN the change
- WHEN `lint:composition` (F5), `lint:tokens`, `npm run build`, `npm run test:unit`, the mapper unit tests, and the
  finances E2E run
- THEN they MUST pass — the body is composition-pure, the IA matches the intended composition (stats + ledger + empty
  state + framing) (F3), the screen reflects the ledger, and the existing `finances-ledger` tests stay green

#### Scenario: F1 flagged-missing
- GIVEN there is no `Финансы` full-screen reference frame in `/screens`
- THEN F1 ≤1% MUST NOT be run (no reference); the screen is composed from the kit with F5 enforced; the missing-mock
  fact MUST be recorded (a frame is requested) and F1 deferred until a frame lands

**Acceptance Criteria:**
- F5 + F3 + `build` + `test:unit` + mapper unit tests + finances E2E green; existing `finances-ledger` tests green
- F1 flagged-missing (no `Финансы` frame); composed from blocks; F5 still enforced

## ADDED Requirements (compose-disputes — Phase 2 screen)

> The new `/disputes` screen (list + detail) composed from the kit (`AppShell + DisputeList + DisputeDetail`) inside the
> layout's `AppShell`, over the `disputes-flow` data layer (`lib/disputes.ts` + `app/actions/dispute.ts`) — bound via
> the `getDisputes` (role-scoped list) + `getDispute` (authorization-enforced detail) aggregators (reusing
> `getDisputeList` + `getDisputeDetail`, no re-derivation), with an **open-dispute entry from a gig**, an **admin resolve
> view**, and an **empty state**. The resolve/open action wiring is **inlined into the composed client screens**
> (`DisputeView` for resolve, `GigDetail` for open) — mirroring the existing `GigDetail` pattern, because the
> composition linter forbids a `@composed-screen` from importing a sibling non-kit island file — reusing the existing
> `resolveDispute`/`openDispute` actions (no new action). Two gap-fill blocks added: `DisputeList` (its `DisputeListVM`
> contract pre-existed) + `DisputeDetail` (its `DisputeDetailVM` contract was materialized here). Verified by E2E
> (`__tests__/e2e/compose-disputes.spec.ts`, 6/6 — open-from-gig→lists · admin resolve→«Завершён»+resolution ·
> participant read-only · non-participant→not-found · empty state · «Споры» nav active), the mapper unit tests
> (`disputes-vm.test.ts`, 3/3 — ADMIN-all/participant-scoped · detail authorization · status mapping), the block render
> tests (+3), the preserved `disputes-flow` + admin-moderation tests, F5 composition purity, build, and the full unit
> suite (894). **F1 is flagged-missing** — there is no `Споры` reference frame in `/screens` (a frame is requested); the
> screen is composed from the kit with F5/F3/authorization enforced. No data model is added; `lib/disputes` /
> `app/actions/dispute` semantics are unchanged; the existing admin moderation (suspend/close/logs) is untouched.

### Requirement: Disputes Composed from Blocks
The `/disputes` (list) and `/disputes/[id]` (detail) bodies MUST be composition-pure `@composed-screen`s (`Disputes`
composing `DisputeList`; `DisputeView` composing `DisputeDetail` plus, for an ADMIN viewer, the inlined resolve view)
via layout primitives only (no `className`/`style`/raw styled markup; imports only kit/`lib`/`react`/`next`/
`@/app/actions`), rendered by the `/disputes` pages.

#### Scenario: Composed disputes screens
- GIVEN an authenticated user loads `/disputes` or `/disputes/{id}`
- THEN the pages MUST build the data via `getDisputes` / `getDispute` and render `<Disputes>` / `<DisputeView>` (inside
  the shell); the no-session redirect MUST be preserved; the detail page MUST render not-found when `getDispute` returns
  `null`; and the sidebar «Споры» nav item MUST be active on `/disputes`

**Acceptance Criteria:**
- `Disputes` / `DisputeView` are F5-pure `@composed-screen`s composing `DisputeList` / `DisputeDetail`; redirect preserved; non-existent/unauthorized detail → not-found; «Споры» nav item active

### Requirement: Disputes Real Data Binding via getDisputes / getDispute
The screens MUST bind real data through server-only, contract-typed `getDisputes` / `getDispute` aggregators over
`lib/disputes` (no re-derivation), scoped by role and enforcing detail authorization: `getDisputes(viewer)` →
`{ disputes: DisputeListVM, isAdmin }` (ADMIN → all; non-admin → only disputes where the viewer is a participant —
opener, or the gig's client / assigned specialist — newest first, status-mapped); `getDispute(id, viewer)` →
`DisputeDetailVM | null` (null when the dispute is missing OR the viewer is neither ADMIN nor a participant).

#### Scenario: Scoped list + authorized detail
- GIVEN `getDisputes(viewer)` and `getDispute(id, viewer)`
- THEN the list MUST reflect the role scope (ADMIN all / participant own) and the detail MUST return the
  `DisputeDetailVM` for an ADMIN or a participant and `null` otherwise — both by reusing `lib/disputes` (`import type`)

**Acceptance Criteria:**
- `getDisputes` → `{ disputes, isAdmin }` (ADMIN all / participant scoped); `getDispute` → `DisputeDetailVM | null` (null for non-participant); both reuse `lib/disputes`

### Requirement: DisputeList + DisputeDetail Blocks (composition-gap fill)
The `DisputeList` and `DisputeDetail` blocks MUST be implemented (both named by this composition; `DisputeListVM`
pre-existed, `DisputeDetailVM` is materialized here).

#### Scenario: DisputeList + DisputeDetail are token-pure kit blocks
- GIVEN `app/components/blocks/DisputeList.tsx` and `app/components/blocks/DisputeDetail.tsx` and
  `app/components/blocks/view-models.ts`
- THEN `view-models.ts` MUST export `DisputeDetailVM { id; gig; opener; reason; status: Status; resolution;
  resolvedBy?: string | null }` (type-only); `DisputeList` MUST render the list from a `DisputeListVM` (a header + one
  row per dispute — gig · opener · `StatusBadge` — each linking to the detail) with an **empty state** when empty; and
  `DisputeDetail` MUST render the detail (gig · `StatusBadge` · opener paired with `ClientCard` · reason ·
  resolution-when-resolved) — both token-pure, with a fixture, and exported from the blocks barrel

**Acceptance Criteria:**
- `DisputeList` (rows + empty state, linking to detail) + `DisputeDetail` (detail + `ClientCard`) token-pure blocks + fixtures + barrel exports; `DisputeDetailVM` materialized; `lint:tokens` passes

### Requirement: Open-Dispute Entry, Admin Resolve View, and Authorization
The screen MUST provide the open-dispute entry from a gig and the admin resolve view, reusing the existing actions, with
authorization respected.

#### Scenario: Open-dispute entry + admin resolve view
- GIVEN the gig detail screen for a participant on a gig with an assigned specialist, and the dispute detail screen
- THEN the gig screen MUST surface an open-dispute entry (a reason + submit) wired to the existing `openDispute` action
  (hidden from non-participants), and the dispute detail MUST present the admin resolve view (a `RESOLVED`/`REJECTED`
  choice + a required resolution note) wired to the existing `resolveDispute` action for an ADMIN viewer while showing
  a non-admin participant the dispute's status **read-only** (no resolve control) — no new server action

**Acceptance Criteria:**
- Open-dispute entry on the gig detail for participants (specialist assigned) over the existing `openDispute`; hidden from non-participants
- Admin resolve view over the existing `resolveDispute` for ADMIN; read-only status for participants; no new server action

### Requirement: Disputes Verification and Flagged-Missing F1
The change MUST pass F3 + F5 + the functional/E2E/authorization suite; F1 is flagged-missing (no `Споры` reference
frame).

#### Scenario: Buildable + functional verification (enforced)
- GIVEN the change
- WHEN `lint:composition` (F5), `lint:tokens`, `npm run build`, `npm run test:unit`, the mapper unit tests, and the
  disputes E2E run
- THEN they MUST pass — the bodies are composition-pure, the IA matches the intended composition (list + detail + admin
  resolve + empty state) (F3), open/list/resolve render, authorization is respected (non-participant → not-found;
  resolve is admin-only), and the existing `disputes-flow` + admin moderation tests stay green

#### Scenario: F1 flagged-missing
- GIVEN there is no `Споры`/`Disputes` full-screen reference frame in `/screens`
- THEN F1 ≤1% MUST NOT be run (no reference); the screen is composed from the kit with F5 enforced; the missing-mock
  fact MUST be recorded (a frame is requested) and F1 deferred until a frame lands

**Acceptance Criteria:**
- F5 + F3 + `build` + `test:unit` + mapper unit tests + disputes E2E green; existing `disputes-flow` + moderation tests green; authorization respected
- F1 flagged-missing (no `Споры` frame); composed from blocks; F5 still enforced

## ADDED Requirements (compose-auth-onboarding — Phase 2 screen)

> The `/auth` entry and `/register` flow recomposed into a **3-step registration wizard** from the kit (`AuthLayout` +
> `StepIndicator` + `RoleCards` + form primitives), replacing the pre-redesign hex-laden pages. Steps: role →
> credentials (email + password + confirm-password, client-side match check) → role-specific profile (the `reg-customer`
> company fields vs the `reg-specialist` fields with dropdowns bound to `SPECIALIZATIONS`/`EXPERIENCE_LEVELS`/
> `TIMEZONES`). Submitting calls the **kept** `registerUser` (additively extended to persist the profile + enforce
> confirm-password — see the `authentication` spec). Two gap-fills added: `StepIndicator` (primitive) + `RoleCards`
> (block, replacing the legacy hex RoleCard); the `AuthLayout` template + the exported checkerboard footer
> (`public/assets/design-system/patterns/checkerboard.svg`) pre-existed. The F5 wizard keeps multi-step fields submitting
> via the `hidden` attribute and carries `Select` values via hidden inputs (the `GigDetail`/`DisputeView` inline-client
> pattern). Verified by E2E (`compose-auth-onboarding.spec.ts` 5/5 + the updated auth suite — 7 files, 60/60 — role
> preselect · confirm-mismatch · register→/dashboard · footer asset) + integration (`register-onboarding.test.ts` 6/6 —
> profile persisted, mismatch→no user, dataset coercion, single-step backward-compat) + F5 + token purity + build + the
> 900-test unit suite. **All four references exist** (`auth`/`reg`/`reg-customer`/`reg-specialist`) → composed to match;
> **F1 ≤1% is deferred** on the global font-licence gate (per `__tests__/e2e/fidelity.spec.ts`). `loginUser`, the
> session/redirect contract, `/login`, and the legacy auth components are unchanged.

### Requirement: Auth Onboarding Composed from Blocks
The `/register` body MUST be a composition-pure `@composed-screen` (`RegisterWizard`) composing `AuthLayout` +
`AuthHeader` (Logomark + heading + `AuthStepDots`) + `RoleCards` + form primitives, and `/auth` MUST likewise be
recomposed from the kit — both via layout primitives only (no `className`/`style`/raw styled markup or hex literals;
imports only kit/`lib`/`react`/`next`/`@/app/actions`). *(Reconciled to the Figma auth nodes by
`reconcile-auth-and-onboarding` — the wizard now leads each step with `AuthHeader`/`AuthStepDots`, NOT the labelled
`StepIndicator`; see that change's section below.)*

#### Scenario: Register is a composed wizard
- GIVEN `app/register/RegisterWizard.tsx`
- THEN it MUST carry the `@composed-screen` marker, compose `AuthLayout` + `AuthHeader` + `RoleCards` + form
  primitives (`Input`/`PasswordInput`/`Select`) via layout primitives, import only kit/`lib`/`react`/`next`/
  `@/app/actions`, and contain **no** `className=`/`style=`/hex literals

#### Scenario: The pages render the composed auth screens
- GIVEN `app/register/page.tsx` and `app/auth/page.tsx`
- WHEN a user loads `/register` or `/auth`
- THEN `/register` MUST render `<RegisterWizard>` (reading `?role=` for preselect) and `/auth` MUST render a
  kit-composed entry (`AuthLayout` + `RoleCards` + «Войти»/«Зарегистрироваться» buttons routing to `/login?role=` /
  `/register?role=`) — both inside `AuthLayout`, with the exported checkerboard footer rendered

**Acceptance Criteria:**
- `RegisterWizard` is an F5-pure `@composed-screen` (AuthLayout + AuthHeader + RoleCards + form primitives); `/auth` recomposed from the kit; no className/style/hex
- The pages render the composed screens; the exported checkerboard footer renders

### Requirement: Three-Step Wizard with Role-Specific Profile Step
The wizard MUST present **3 steps** — role → credentials → role-specific profile — with the `AuthStepDots` counter
(via the `AuthHeader` block), and step 3 MUST differ by role (the `reg-customer` company profile vs the
`reg-specialist` profile) with dropdowns bound to the datasets.

#### Scenario: Three steps with a step indicator
- GIVEN the `/register` wizard
- THEN the `AuthStepDots` counter (via `AuthHeader`) MUST show three steps (role · credentials · profile); step 1 MUST present `RoleCards`
  («Профиль Компании» / «Профиль специалиста»); step 2 MUST present email + password + a **confirm-password** field with
  a client-side match check; and Next/Back navigation MUST move between steps

#### Scenario: Step 3 is role-specific with dropdown datasets
- GIVEN step 3
- WHEN the chosen role is CLIENT
- THEN it MUST present the company profile (companyName · inn · contactPerson · phoneNumber)
- AND WHEN the chosen role is SPECIALIST
- THEN it MUST present the specialist profile (displayName · position · techStack) with **dropdowns** for specialization
  (`SPECIALIZATIONS`), experience level (`EXPERIENCE_LEVELS`), and timezone (`TIMEZONES`)

#### Scenario: Role preselect from the query parameter
- GIVEN `/register?role=SPECIALIST` (or `=CLIENT`)
- THEN step 1 MUST preselect that role; an absent/invalid `?role=` MUST start with no preselection

**Acceptance Criteria:**
- 3 steps (role → credentials → profile) with the `AuthStepDots` counter (via `AuthHeader`); confirm-password with a client-side match check
- Step 3 role-specific (CLIENT company fields vs SPECIALIST fields + dropdowns from the datasets); `?role=` preselects step 1

### Requirement: StepIndicator + RoleCards (composition-gap fill)
The `StepIndicator` primitive and the `RoleCards` block MUST be implemented (both named by this composition; neither
existed token-pure — a legacy hex `RoleCard` is replaced). *(`StepIndicator` is **superseded for the auth path** by
`AuthStepDots`/`AuthHeader` (`reconcile-auth-and-onboarding`) — it remains a token-pure kit primitive but the
`/register` wizard no longer consumes it; `RoleCards` is unchanged and still composed.)*

#### Scenario: StepIndicator is a token-pure primitive
- GIVEN `app/components/primitives/StepIndicator.tsx`
- THEN it MUST render N labelled steps with the completed/current/upcoming state, be token-pure (no raw hex/px), and be
  exported from the primitives barrel

#### Scenario: RoleCards is a token-pure controlled block
- GIVEN `app/components/blocks/RoleCards.tsx`
- THEN it MUST render the two role options («Профиль Компании»/«Профиль специалиста») with role icons and a selected
  state via a controlled `{ value, onSelect }` interface, be token-pure, have a fixture, and be exported from the blocks
  barrel

**Acceptance Criteria:**
- `StepIndicator` token-pure primitive (done/current/upcoming) + barrel export
- `RoleCards` token-pure controlled block (two roles + selected state + icons) + fixture + barrel export; `lint:tokens` passes

### Requirement: Auth Onboarding Verification and Fidelity (references exist)
The change MUST pass F3 + F5 + the functional/E2E suite; F1 references exist → composed to match, ≤1% deferred on the
font-licence gate.

#### Scenario: Buildable + functional verification (enforced)
- GIVEN the change
- WHEN `lint:composition` (F5), `lint:tokens`, `npm run build`, `npm run test:unit`, the registration integration
  tests, the new auth-onboarding E2E, and the updated existing auth E2E run
- THEN they MUST pass — the wizard body is composition-pure, the IA matches the intended composition (3 steps + role
  cards + credentials + role-specific profile) (F3), register → `/dashboard` works with the profile persisted, and the
  existing single-step `registerUser`/`loginUser` tests stay green

#### Scenario: F1 references exist → composed to match, ≤1% deferred
- GIVEN the reference frames `screens/auth.jpg`, `screens/reg.jpg`, `screens/reg-customer.jpg`,
  `screens/reg-specialist.jpg` exist
- THEN the wizard MUST be composed to match the references' step/field IA (F3 + F5 enforced); **F1 ≤1% MUST NOT be
  asserted** — it is deferred on the global font-licence gate (per `__tests__/e2e/fidelity.spec.ts`); the fidelity
  apparatus runs and the deferral is recorded

**Acceptance Criteria:**
- F5 + F3 + `build` + `test:unit` + registration integration tests + auth-onboarding E2E + updated auth E2E green; existing auth tests green
- F1 references exist → composed to match; ≤1% deferred (font gate), apparatus runs, deferral recorded

## ADDED Requirements (compose-settings — Phase 2 screen)

> The new `/settings` screen composed from the kit (`AppShell` + a language `Select` + a notification `Toggle`·list + a
> delete DangerAction) inside the layout's `AppShell`, over the `account-preferences` data layer (`lib/preferences.ts` +
> `app/actions/settings.ts`), reached from the **Topbar gear**. Bound via the `getSettings` aggregator (reusing
> `getPreferences` + the session email, no re-derivation); the language `Select` (RU default, «Русский»/«English» over
> `LOCALES`) + the notification `ToggleList` (Отклики/Изменения статуса/Сообщения) save via the kept `updatePreferences`,
> and «Удалить аккаунт» is a reveal-to-confirm DangerAction (type your account email → the kept `deleteAccount`:
> wrong/blank → rejected, correct → FK-safe teardown + session destroy + redirect to `/`). One gap-fill block added:
> `ToggleList` (labelled toggle rows over the `Toggle` primitive). The Topbar gear is wired via an additive optional
> `gearHref` (`TopbarLive` passes `/settings`; absent → plain icon, unchanged). Values carry to the actions via hidden
> inputs (the `DisputeView` pattern). Verified by E2E (`compose-settings.spec.ts` 4/4 — gear entry · read prefs RU-default
> + toggles · toggle+Save persists · delete-confirm wrong→rejected/correct→teardown+`/`) + the `getSettings` unit test
> (2/2) + the `ToggleList` render test + F5 + token purity + build + the 902-test unit suite (preserved
> `account-preferences` 7/7). **There is no `Настройки` full-screen reference frame** → screen-level F1 ≤1% is not run;
> **F1 holds at the component level** (the library-faithful `Select`/`Toggle`, validated in ui-primitives / the fidelity
> harness). No data model is added; `lib/preferences`/`app/actions/settings` semantics, the sidebar nav, and the shell
> (beyond the gear link) are unchanged.

### Requirement: Settings Composed from Blocks
The `/settings` body MUST be a composition-pure `@composed-screen` (`Settings`) composing a language `Select` + a
notification `ToggleList` + an inline DangerAction via layout primitives only (no `className`/`style`/raw styled markup;
imports only kit/`lib`/`react`/`next`/`@/app/actions`), inside the layout's `AppShell`.

#### Scenario: Settings is a composed screen
- GIVEN `app/(protected)/settings/Settings.tsx`
- THEN it MUST carry the `@composed-screen` marker, compose `Select` + `ToggleList` + the inline DangerAction via
  Section/Stack, import only the allowed prefixes, and contain **no** `className=`/`style=`/raw styled markup

#### Scenario: The page renders it
- GIVEN `app/(protected)/settings/page.tsx`
- WHEN an authenticated user loads `/settings`
- THEN the page MUST build the data server-side (`getSettings`) and render `<Settings>` (inside the shell); the
  no-session redirect MUST be preserved

**Acceptance Criteria:**
- `Settings` is an F5-pure `@composed-screen` composing `Select` + `ToggleList` + the DangerAction; the page renders it; no-session redirect preserved

### Requirement: Settings Real Data Binding via getSettings
The screen MUST bind real data through a server-only, contract-typed `getSettings` aggregator over `lib/preferences`,
with no re-derivation.

#### Scenario: Preferences reflect the stored values
- GIVEN `getSettings(viewer)`
- THEN it MUST return `{ prefs, email }` by reusing `getPreferences(viewer.userId)` — the language `Select` reflects the
  stored `locale` (defaulting to RU) and the `ToggleList` reflects the three stored notification booleans; the `email`
  is the viewer's (for the delete confirm)

**Acceptance Criteria:**
- `getSettings` returns `{ prefs, email }` from `lib/preferences`; reflects stored prefs (RU default); contract-typed (`import type`)

### Requirement: Read and Update Preferences
The screen MUST let the user view and change their language + notification preferences via the kept `updatePreferences`
action.

#### Scenario: Update language + notifications
- GIVEN the `/settings` screen bound to the user's prefs
- WHEN the user changes the language `Select` (RU default; over `LOCALES`) and/or toggles a notification category and
  saves
- THEN it MUST submit to `updatePreferences` (locale validated against `LOCALES`; toggles as `'true'`/`'false'`), the
  partial-safe update MUST persist, and the saved state MUST be reflected (a confirmation on success, an error notice on
  failure)

**Acceptance Criteria:**
- Language `Select` (RU default) + notification `ToggleList` bound to the stored prefs; Save → `updatePreferences`; persisted + reflected; invalid locale rejected

### Requirement: Delete-Account DangerAction
The screen MUST present a destructive «Удалить аккаунт» action that confirms via the account email and calls the kept
`deleteAccount`.

#### Scenario: Confirm-to-delete
- GIVEN the `/settings` screen
- WHEN the user activates «Удалить аккаунт»
- THEN it MUST reveal a confirm step requiring the user to type their account email, wired to `deleteAccount`; a wrong
  (or blank) email MUST be rejected with no deletion; the correct email MUST delete the account (FK-safe teardown),
  destroy the session, and redirect to `/`

**Acceptance Criteria:**
- «Удалить аккаунт» reveal-to-confirm over the existing `deleteAccount` (email-gated); wrong email → rejected, no deletion; correct email → teardown + session destroy + redirect to `/`; no new action

### Requirement: ToggleList Block (composition-gap fill) and Gear Entry
The `ToggleList` block MUST be implemented (the `Toggle` primitive exists but no block lists labelled toggles), and the
Topbar gear MUST be the settings entry.

#### Scenario: ToggleList is a token-pure kit block
- GIVEN `app/components/blocks/ToggleList.tsx`
- THEN it MUST render a labelled toggle list from `{ items: { key; label; checked }[]; onToggle }` — one row per item
  (label + a `Toggle`) — be token-pure, have a fixture, and be exported from the blocks barrel

#### Scenario: The Topbar gear links to /settings
- GIVEN the Topbar (the profile/avatar gear)
- WHEN the live topbar renders
- THEN the gear MUST be a link to `/settings` (an additive `gearHref` on the `Topbar` block; `TopbarLive` passes
  `/settings`); when no `gearHref` is supplied the gear MUST render unchanged (plain icon)

**Acceptance Criteria:**
- `ToggleList` token-pure block (labelled rows + `Toggle`) + fixture + barrel export; `lint:tokens` passes
- The Topbar gear links to `/settings` (additive, opt-in); the route is reachable

### Requirement: Settings Verification and Component-Level Fidelity
The change MUST pass F3 + F5 + the functional/E2E suite; F1 is component-level (no full-screen frame).

#### Scenario: Buildable + functional verification (enforced)
- GIVEN the change
- WHEN `lint:composition` (F5), `lint:tokens`, `npm run build`, `npm run test:unit`, the `getSettings` unit test, and
  the settings E2E run
- THEN they MUST pass — the body is composition-pure, the IA matches the intended composition (language · notifications ·
  danger) (F3), read/update prefs + delete-account confirm + the gear entry work, and the existing `account-preferences`
  tests stay green

#### Scenario: F1 component-level
- GIVEN there is no `Настройки` full-screen reference frame in `/screens`
- THEN screen-level F1 ≤1% MUST NOT be run (no reference); **F1 at the component level MUST hold** — the screen composes
  the library-faithful `Select` + `Toggle` primitives (validated against their library component crops), and the new
  `ToggleList` only arranges the `Toggle`; F5 stays enforced and the missing full-screen frame MUST be recorded

**Acceptance Criteria:**
- F5 + F3 + `build` + `test:unit` + `getSettings` unit test + settings E2E green; existing `account-preferences` tests green
- F1 component-level satisfied (library `Select`/`Toggle`); screen-level F1 not run (no full-screen `Настройки` frame); composed from the kit; F5 still enforced

## ADDED Requirements (prove-extensibility-admin — Phase 2, the generativity proof #29)

> The **GENERATIVITY ACCEPTANCE** (the final Phase-2 change): the mock-less admin moderation screens (`/admin`,
> `/admin/users`, `/admin/gigs`) rebuilt **purely from the kit** (`AppShell` + existing blocks/primitives), proving the
> design system is generative and that its extensibility process is honest. The admin layout was cut over from the
> legacy `MainNav` to the `AppShell` (+ an admin `SidebarNav`/`Topbar`); the screens are F5-pure `@composed-screen`s
> binding `getAdminDashboard`/`getAdminUsers`/`getAdminGigs` (which reuse the existing query/pagination/filter logic
> verbatim), composed from `StatPanel` + a Select filter + the new `DataTable` + `StatusBadge`/`Tag` + inline
> reveal-to-confirm moderation forms over the **kept** `suspendUser`/`unsuspendUser`/`closeGig`. **ZERO new tokens/
> primitives and ZERO bespoke styling**: exactly **one** gap was surfaced — a generic `DataTable` block (already
> anticipated in `DESIGN_SYSTEM_SPEC.md §3.2`) — implemented **on-system** (token-pure semantic table) and recorded
> there. The generativity gate (`lint:generativity`) was extended to assert the admin screens assemble with **zero
> off-system values**. Verified by the gate + F5 + token purity + build + the 905-test unit suite + the preserved admin
> integration tests (56/56) + the admin E2E (16/16 — moderation workflow + pagination + filters). The five legacy
> off-system admin islands were deleted. **No full-screen F1** (admin has no mock) — the acceptance is generativity +
> F5 + F3 + behavior preservation. No data model / moderation / query / pagination semantics changed; the protected
> shell is unchanged.

### Requirement: Admin Screens Composed Purely from the Kit
The admin screens (`/admin`, `/admin/users`, `/admin/gigs`) MUST each be a composition-pure `@composed-screen` assembled
**only** from `AppShell` + existing blocks/primitives + the one newly-added `DataTable` block — with **no** bespoke
styling and **no** off-system value; the admin layout MUST be the `AppShell` (+ admin `SidebarNav`/`Topbar`), replacing
`MainNav`.

#### Scenario: Each admin screen is a kit-only composed screen
- GIVEN `app/admin/AdminDashboard.tsx`, `app/admin/users/AdminUsers.tsx`, `app/admin/gigs/AdminGigs.tsx` and
  `app/admin/layout.tsx`
- THEN each screen MUST carry `@composed-screen`, import only kit/`lib`/`react`/`next`/`@/app/actions`, compose existing
  blocks/primitives + the `DataTable`, and contain **no** `className=`/`style=`/off-token literal; AND the layout MUST
  render `AppShell` (+ an admin `SidebarNav`/`Topbar`, active item highlighted), preserving the `getSession` + ADMIN
  guard

**Acceptance Criteria:**
- The three admin screens are F5-pure `@composed-screen`s from `AppShell` + existing kit + the one new `DataTable`; no className/style/hex; the layout is `AppShell` (admin nav), replacing `MainNav`

### Requirement: One Logged System Addition (DataTable), Zero Bespoke Styling
The change MUST introduce **ZERO new tokens, ZERO new primitives, and ZERO bespoke styling**; the **only** permitted
system addition is a generic, token-pure `DataTable` block, logged to the design-system spec.

#### Scenario: DataTable is a token-pure generic block, logged
- GIVEN `app/components/blocks/DataTable.tsx` and `docs/DESIGN_SYSTEM_SPEC.md`
- THEN `DataTable` MUST render a generic **semantic** table from `{ columns; rows: { id; cells: ReactNode[] }; empty }`
  with an empty state — token-pure (no new token/primitive/off-token literal), with a fixture + barrel export — AND
  §3.2 MUST record it as the one gap surfaced by the generativity proof (added on-system); `lint:tokens` MUST pass with
  no new off-token literal

**Acceptance Criteria:**
- Exactly one system addition (`DataTable`), token-pure + fixture + barrel export + logged to `DESIGN_SYSTEM_SPEC.md` §3.2; zero new tokens/primitives and zero bespoke styling; `lint:tokens` passes

### Requirement: Admin Behavior Preserved
The change MUST preserve all admin behavior, reusing the moderation actions and the query/pagination/filter logic.

#### Scenario: Access, filtering, pagination, moderation
- GIVEN the admin screens
- WHEN a non-admin loads any `/admin*` route → they MUST be redirected to `/dashboard`
- AND WHEN an ADMIN filters (role/status/closed) and pages (30/page) → the filtered/paginated rows MUST render (invalid/
  over-range page → the existing redirects), reusing the existing `where`/`skip`/`take` logic
- AND WHEN they suspend/unsuspend a user or close a gig → the kept `suspendUser`/`unsuspendUser`/`closeGig` MUST run
  (with moderation logging) and the row state MUST update; empty states MUST render when there are no rows

**Acceptance Criteria:**
- Non-admin → `/dashboard`; filtering + pagination (30/page, redirects) preserved; suspend/unsuspend/close via the kept actions (+ logging); empty states; existing admin integration tests green

### Requirement: Generativity Gate Extended to the Admin Proof
The generativity gate MUST assert the admin screens assemble from the kit with zero off-system values.

#### Scenario: lint:generativity covers the admin screens
- GIVEN `scripts/design-system/validate-generativity.js`
- WHEN `npm run lint:generativity` runs
- THEN it MUST assert the admin screens (`AdminDashboard`/`AdminUsers`/`AdminGigs`) exist and are `@composed-screen`s,
  and MUST run the composition + token-purity lints over them — passing only when they carry **zero off-system values**
  (the existing probe check retained)

**Acceptance Criteria:**
- `lint:generativity` asserts the admin screens are kit-only composed screens with zero off-system values

### Requirement: Generativity Acceptance Verification
The change MUST pass the generativity gate + F5 + F3 + the functional/E2E suite; no full-screen F1 is run (no mock).

#### Scenario: Buildable + functional verification (enforced)
- GIVEN the change
- WHEN `lint:generativity`, `lint:composition` (F5), `lint:tokens`, `npm run build`, `npm run test:unit`, and the admin
  E2E run
- THEN they MUST pass — the admin screens are composition-pure and assemble from the kit with zero off-system values,
  the IA matches the intended composition (stats / users-table / gigs-table) (F3), all admin behavior is preserved, and
  the existing admin integration tests stay green; full-screen F1 MUST NOT be run (no mock), and the one `DataTable`
  addition MUST be logged

**Acceptance Criteria:**
- `lint:generativity` + F5 + F3 + `build` + `test:unit` + admin E2E green; existing admin integration tests green
- No full-screen F1 (no mock); the proof is generativity + behavior preservation; the `DataTable` addition logged

## MODIFIED + ADDED Requirements (reconcile-auth-and-onboarding — Phase 1 screen)

> The `/register` 3-step wizard reconciled to its 5 Figma auth/onboarding nodes (step 1 = role-select `3179:3179`;
> step 2 = create-account/specialist `3179:3863` & /company `3195:4564`; step 3 = welcome/specialist `3195:4282` &
> /company `3195:4704`). The labelled `StepIndicator` was swapped for the authoritative `AuthStepDots` dot counter,
> and each step now leads with the new `AuthHeader` block (Logomark → heading + subtitle → counter) — the F5
> composition lint forbids heading markup/`className` in the screen, so the «HEADER» lockup is a block. `registerUser`,
> the confirm-password check, `?role=` preselect, and register→`/dashboard` are unchanged; the full step-3 profile
> field set is kept as a sanctioned content variant of the welcome node (which shows fewer fields). Recorded as
> RC-S4/S5/S6 in `docs/DESIGN_SYSTEM_SPEC.md` §10.5. Verified by E2E (`compose-auth-onboarding` 5/5 + the updated auth
> suite — `register-page-redesign`/`registration`/`auth-navigation`/`auth-flow`, 44/44) + 2 new `AuthHeader` render
> tests + the 933-test unit suite + F5/token-purity/build. **F1 ≤1% remains deferred** on the font-licence gate
> (Phase 2 `refidelity-from-figma-references`); here F1 = structural match to each node.

### Requirement: Register Wizard Composes the Figma Auth/Onboarding Nodes
**SUPERSEDED (reground-auth-to-design, 2026-06-24).** The kit-composed `RegisterWizard` is replaced by the
`AuthDesign` onboarding view rebuilt directly on `gigly_full_design/Auth.dc.html` (`app/register/RegisterWizard.tsx`
and the `?role=`/`RegisterRoleReader` machinery are deleted). The `/register` screen behaviour is now defined by
"AuthDesign Screen (login + onboarding)" above (the prototype shell + two-phase onboarding: step-2 `registerUser`
creates the account, step-3 `updateProfile` saves the profile → `/dashboard`). See also the authentication spec's
"Registration Page UI Design".

### Requirement: AuthHeader Block (auth «HEADER» lockup)
An `AuthHeader` block MUST exist (`app/components/blocks/AuthHeader.tsx`) with a typed `AuthHeaderVM`
(`{ heading, subtitle?, step, totalSteps, showLogomark? }`), modelling the Figma auth «HEADER» lockup: an optional
`Logomark` → a `type/h1` heading + `type/body` muted subtitle → the `AuthStepDots` counter. It MUST be token-pure,
composed from primitives + layout + tokens, catalogued in the workbench, and rendered from a fixture.

#### Scenario: Composes Logomark + heading/subtitle + AuthStepDots
- GIVEN `<AuthHeader vm={…}>` with `showLogomark: true`
- WHEN it renders
- THEN it MUST render the `Logomark` (exported asset), the heading at the `type/h1` role + the muted subtitle, and the
  `AuthStepDots` counter marking the current step (`aria-valuenow = step + 1`, `aria-valuemax = totalSteps`)

#### Scenario: Welcome step omits the Logomark
- GIVEN `<AuthHeader vm={…}>` without `showLogomark`
- WHEN it renders
- THEN it MUST NOT render the `Logomark` (the welcome node leads with the heading only)

**Acceptance Criteria:**
- `AuthHeader` token-pure block + `AuthHeaderVM` + fixture + workbench entry + render tests; `lint:tokens` passes

### Requirement: Welcome-Step Field Set Is a Sanctioned Content Variant
The Figma welcome node shows `Input + Select ×2`; the implemented step 3 MUST keep the **full profile field set**
that `registerUser` persists. This divergence MUST be treated as a **sanctioned content variant** of the node's
layout grammar (heading + counter + labelled fields + back/primary buttons), recorded in the design-system
reconciliation notes — NOT resolved by dropping persisted fields. F3 parity for step 3 is asserted at the
layout-grammar + flow level, not a literal field-count match.

#### Scenario: Full field set is preserved and the divergence is recorded
- GIVEN the welcome/profile step
- WHEN it renders
- THEN it MUST present every field `registerUser` consumes for the role (no field dropped to match the node's
  count)
- AND the field-count divergence from the Figma node MUST be documented as a sanctioned content variant in the
  reconciliation note (`docs/DESIGN_SYSTEM_SPEC.md` §10.5, RC-S6)

**Acceptance Criteria:**
- Step 3 keeps the full `registerUser` field set per role; the field-count divergence is logged as a sanctioned content variant (RC-S6)

### Requirement: Auth Reconciliation Keeps the Suite and Lints Green
Reconciling the wizard MUST update the affected E2E/integration assertions to the new composition (dot counter +
Logomark + headings) while preserving every behavioural assertion (role preselect, mismatch, register→dashboard),
and MUST keep the build, token-purity lint, and unit/E2E suites green.

#### Scenario: Tests updated to the reconciled composition, suite green
- GIVEN `__tests__/e2e/compose-auth-onboarding.spec.ts` and the other affected auth tests
- WHEN they run after the reconciliation
- THEN the `StepIndicator` label assertions MUST be replaced by `AuthStepDots`/aria assertions
- AND the behavioural assertions (`?role=` preselect, confirm-password mismatch, full register → `/dashboard`,
  specialist vs company step-3 fields) MUST still pass
- AND `npm run build`, `npm run lint:tokens`, and `npm run test:unit` MUST pass

**Acceptance Criteria:**
- The affected auth E2E specs assert `AuthStepDots`/aria + the node heading (no removed `StepIndicator` labels); behavioural assertions intact
- `build` + `lint:tokens` + `test:unit` + the auth E2E set green

## MODIFIED + ADDED Requirements (reconcile-profile-screen — Phase 1 screen)

> `/profile` (own + the `/profile/[userId]` public view) reconciled to **Профиль/specialist (`2860:2103`)**. The
> BLOCK section already reconciled in `add-profile-and-gig-detail-blocks` (TagList/CategoryTags/ExperienceList adopt
> `SectionHeader`/`JobExperienceCard`); this change closes the **ID block** + a stray page-title: `ProfileHeader`
> now renders the specialty via the `SpecialtyTag` primitive (white `surface/inverse` chip, `brand/default` mono —
> not the ad-hoc `rounded-pill border` pill) and adds a token-pure availability status pill (online →
> `status/completed` dot + «В сети», offline → `text/subtle` dot + «Не в сети», mirroring the `Avatar` dot); the
> composed screen drops the `Section title="Профиль"` heading (the node CONTENT leads with the ID block). `getProfile`,
> the `ProfileHeaderVM`, the edit flow, and the read-only public view are unchanged; the mock's «на стадии разработки»
> analytics placeholder is honored, and the real numeric stats are kept as a sanctioned content variant. Recorded as
> RC-S7/S8 in `docs/DESIGN_SYSTEM_SPEC.md` §10.6. Verified by E2E (`compose-profile` 3/3 — composed render · public
> read-only · edit round-trip) + 4 new `ProfileHeader` render tests + the 937-test unit suite + F5/token-purity/build.
> **F1 ≤1% remains deferred** on the font-licence gate (Phase 2 `refidelity-from-figma-references`); here F1 =
> structural match to the node.

### Requirement: Profile Screen Reconciled to the Figma Profile Node
The `/profile` screen (`app/(protected)/profile/Profile.tsx`, shared by own + public `/profile/[userId]`) MUST
remain a composition-pure `@composed-screen` inside the layout's `AppShell`, reconciled to **Профиль/specialist
(`2860:2103`)**: an **ID block** (`ProfileHeader` ‖ the analytics placeholder `StatPanel`) followed by the 2-column
**BLOCK** (`TagList` + `ExperienceList` ‖ `CategoryTags` + the realized `GigCard` feed), each section led by a
`SectionHeader`. The screen MUST NOT render a `"Профиль"` page-title heading (the node CONTENT leads with the ID
block). It MUST be token-pure (F2) and composition-pure (F5), and MUST preserve the profile data binding, the
owner edit affordance → `/profile/edit`, and the read-only public view.

#### Scenario: Composes the ID block + 2-col BLOCK without a page title
- GIVEN a SPECIALIST profile at `/profile`
- WHEN it renders
- THEN it MUST render the `ProfileHeader` ID block and the analytics placeholder `StatPanel` as the ID-block row
- AND it MUST render the 2-col BLOCK — `TagList` («Стек») + `ExperienceList` («Опыт») in one column and
  `CategoryTags` + the realized `GigCard` feed in the other — each section headed by a `SectionHeader`
- AND it MUST NOT render a `"Профиль"` page-title heading
- AND the screen MUST contain no `className=`/`style=`/hex literals (F5)

#### Scenario: Honors the analytics placeholder
- GIVEN the ID-block row
- WHEN it renders
- THEN the right panel MUST show the «на стадии разработки» analytics placeholder
  («Здесь будет ваша статистика»), the mock's deferred-feature widget

#### Scenario: Profile data + edit flow preserved
- GIVEN the composed profile
- WHEN an owner views `/profile` and a non-owner views `/profile/[userId]`
- THEN the real profile data MUST bind (name, specialty, verify, tech stack, categories, experience, realized gigs)
- AND the owner MUST see the edit affordance → `/profile/edit` (a save round-trips), and the non-owner MUST NOT see
  any edit affordance

**Acceptance Criteria:**
- `Profile` is an F5-pure `@composed-screen` (ID block + 2-col BLOCK, no `"Профиль"` page-title); placeholder honored
- `getProfile`/edit flow/read-only public view preserved; F2 + F5 lints green

### Requirement: ProfileHeader ID Block Uses SpecialtyTag + a Status Pill
The `ProfileHeader` block MUST render the ID block per the Figma node: the avatar with its online/offline state,
the name (display type), the **specialty via the `SpecialtyTag` primitive** (white chip, brand-blue mono — NOT an
ad-hoc bordered pill), a **token-pure availability status pill** (online/offline, with a dot), the phone-verified
row, and the member-since line, plus the optional owner edit affordance. It MUST be token-pure.

#### Scenario: Specialty renders via SpecialtyTag
- GIVEN `<ProfileHeader vm={…}>` with a `roleTag`
- WHEN it renders
- THEN the specialty MUST render via the `SpecialtyTag` primitive (the `bg-surface-inverse` chip with
  `text-brand-default` mono text), not the ad-hoc `rounded-pill border` pill
- AND the `roleTag` text MUST still be visible (e.g. "Senior Frontend Engineer")

#### Scenario: Availability status pill with a dot
- GIVEN `<ProfileHeader vm={…}>` with `online: true` and with `online: false`
- WHEN each renders
- THEN the ID block MUST show a token-pure availability status pill carrying a dot, reflecting the online/offline
  state — no raw hex/px literals

#### Scenario: Verify + member-since preserved, token-pure
- GIVEN any `ProfileHeader`
- WHEN it renders
- THEN it MUST keep the phone-verified row ("Номер телефона верифицирован") and the member-since line
- AND the file MUST be token-pure (no raw hex/px)

**Acceptance Criteria:**
- `ProfileHeader` renders the specialty via `SpecialtyTag` + an availability status pill (online/offline dot); verify + member-since kept; token-pure

### Requirement: ID-Block Real Stats Are a Sanctioned Content Variant
The static node shows only the «на стадии разработки» analytics placeholder in the ID block; the implementation
MUST honor that placeholder AND MAY retain the real numeric stats (Рейтинг / Завершено задач / Повторные заказы,
from `header.stats`) as a **sanctioned content variant** — a functional enhancement the mock lacks. This MUST be
recorded in the design-system reconciliation note, NOT resolved by dropping the placeholder. F3 parity for the ID
block is asserted at the layout-grammar + flow level, not a literal element-count match.

#### Scenario: Placeholder honored, real stats retained and recorded
- GIVEN the ID block
- WHEN it renders
- THEN the «на стадии разработки» placeholder MUST be present (honored)
- AND retaining the real numeric stats MUST be documented as a sanctioned content variant in the reconciliation
  note (`docs/DESIGN_SYSTEM_SPEC.md` §10.6, RC-S7)

**Acceptance Criteria:**
- The placeholder is honored and the real numeric stats are retained + logged as a sanctioned content variant (RC-S7)

### Requirement: Profile Reconciliation Keeps the Suite Green
Reconciling the profile MUST update the affected E2E/unit assertions to the new ID-block composition (SpecialtyTag
+ status pill, no page-title) while preserving every behavioural assertion (data binding, owner edit round-trip,
read-only public view), and MUST keep the build, token-purity lint, and unit/E2E suites green.

#### Scenario: Tests updated to the reconciled composition, suite green
- GIVEN `__tests__/e2e/compose-profile.spec.ts` and the ProfileHeader render test
- WHEN they run after the reconciliation
- THEN they MUST assert the `SpecialtyTag` specialty chip + the availability status pill (and not a removed
  page-title), while the data-binding, edit-round-trip, and read-only assertions still pass
- AND `npm run build`, `npm run lint:tokens`, and `npm run test:unit` MUST pass

**Acceptance Criteria:**
- The affected E2E/unit assert the SpecialtyTag chip + status pill (no removed page-title); behavioural assertions intact
- `build` + `lint:tokens` + `test:unit` + the `compose-profile` E2E green

## MODIFIED + ADDED Requirements (reconcile-dashboards — Phase 1 screen)

> Both `/dashboard` screens reconciled to **Дашборд/specialist (`2860:3751`)** + **Дашборд/company (`3371:5387`)**.
> The former `BannerCard` + flat stack is replaced by a WELCOME (greeting `SectionHeader` + `OnboardingCard ×2`, the
> profile-completion tile carrying the real `completion` as its `ProgressBar` value) and a 2-col `Split` BOARD — col1
> «Активные задачи» (`SectionHeader` + the status `Tabs` Menu-switcher + the `GigCard` feed) ‖ col2 «найти
> гиг»/«Найти новый проект» (`SearchPanel` specialist / `CreateGigCTA` company) + «Сообщения» (`MessagesPanel`). The
> specialist adds the 6× `AttentionCard` strip bound to live `Notification`s via `getDashboardAttention` (newest-first,
> cap 6, eventType→`AttentionType`, gig embed); the company hides it (mock `Frame 342 hidden=true`). The `Section
> title="Дашборд"` page-title is dropped. VM change: `banner` → `greeting` + `onboarding` (+ specialist `attention`);
> `completion`/`gigCards`/`tabs`/`messages` preserved. Recorded as RC-S9/S10 in `docs/DESIGN_SYSTEM_SPEC.md` §10.7.
> Verified by E2E (`compose-specialist-dashboard` 4/4 + `compose-client-dashboard` 3/3) + the two dashboard-vm
> integration tests (5/5) + the 937-test unit suite + F5/token-purity/build. **F1 ≤1% remains deferred** on the
> font-licence gate (Phase 2 `refidelity-from-figma-references`); here F1 = structural match to each node.

### Requirement: Dashboard Screens Reconciled to the Figma Nodes
Both `/dashboard` screens (`SpecialistDashboard.tsx`, `ClientDashboard.tsx`) MUST remain composition-pure
`@composed-screen`s inside the layout's `AppShell`, reconciled to their Figma nodes: a **WELCOME** section
(a greeting heading + **two `OnboardingCard`s**) replacing the former `BannerCard`, followed by a **2-column
BOARD** — col1 «Активные задачи» (`SectionHeader` + the Tabs/Menu-switcher status filter + the `GigCard` feed),
col2 «Сообщения» (`SectionHeader` + the `MessagesPanel`) plus the role's find-project affordance (specialist:
`SearchPanel`; company: `CreateGigCTA`). The screens MUST NOT render a `"Дашборд"` page-title heading. They MUST be
token-pure (F2) and composition-pure (F5), and MUST preserve the status tabs + counts, the gig-link navigation, the
find-project search (specialist), and the create-gig affordance (company).

#### Scenario: WELCOME composes a greeting + two OnboardingCards (no BannerCard)
- GIVEN either dashboard
- WHEN it renders
- THEN it MUST render a greeting heading (name-bound, via `SectionHeader`) and **two `OnboardingCard`s**
- AND it MUST NOT render the former `BannerCard` headline

#### Scenario: BOARD is a 2-col Split with SectionHeader-led columns
- GIVEN either dashboard
- WHEN it renders
- THEN the BOARD MUST be a 2-col layout: col1 «Активные задачи» (`SectionHeader` + the status Tabs + the `GigCard`
  feed) and col2 «Сообщения» (`SectionHeader` + the `MessagesPanel`) plus the role's find-project affordance
  (specialist `SearchPanel` / company `CreateGigCTA`)
- AND each column section MUST be headed by a `SectionHeader`

#### Scenario: No page-title; status tabs + navigation preserved
- GIVEN either dashboard
- WHEN it renders and is interacted with
- THEN it MUST NOT render a `"Дашборд"` page-title heading
- AND the status Tabs (with counts) MUST still render and filter the `GigCard` feed, a `GigCard` MUST still open its
  gig detail, the specialist `SearchPanel` MUST still route to `/gigs`, and the company `CreateGigCTA` MUST still
  link to `/gigs/new`
- AND the screen MUST contain no `className=`/`style=`/hex literals (F5)

**Acceptance Criteria:**
- Both dashboards are F5-pure `@composed-screen`s: WELCOME (greeting + OnboardingCard×2) + 2-col BOARD; no `BannerCard`, no `"Дашборд"` page-title
- Tabs + counts, gig-link, specialist search → `/gigs`, company create → `/gigs/new` preserved; F2 + F5 lints green

### Requirement: Dashboard VMs Bind WELCOME + Attention from Live Data
`SpecialistDashboardData` and `ClientDashboardData` MUST replace `banner` with `greeting: string` +
`onboarding: OnboardingCardVM[]`, and `SpecialistDashboardData` MUST add `attention: AttentionCardVM[]`. The
`getSpecialistDashboard`/`getClientDashboard` mappers MUST bind these from live data: the greeting from the user's
name, the onboarding tiles from the real profile-completion (`completion`), and (specialist) the attention strip
from the user's recent notifications via a `getDashboardAttention(userId)` helper. `completion`, `gigCards`, `tabs`,
and `messages` MUST be preserved.

#### Scenario: Mapper emits greeting + onboarding + (specialist) attention
- GIVEN `getSpecialistDashboard(userId)` / `getClientDashboard(userId)`
- THEN each MUST return `greeting` (name-bound), `onboarding` (≥2 `OnboardingCardVM`s, the first carrying the real
  `completion` as its progress), `gigCards`, `tabs` (with counts), and `messages` — and NOT a `banner`
- AND `getSpecialistDashboard` MUST additionally return `attention: AttentionCardVM[]` (≤6, newest-first) mapped
  from the user's recent `Notification`s; each item's `type` is a valid `AttentionType` and its `embed` is a gig
  card or a message preview
- AND the returned objects MUST be assignable to the view-model contracts (`import type`)

#### Scenario: Attention helper maps notifications to typed cards
- GIVEN `getDashboardAttention(userId)`
- THEN it MUST return at most 6 `AttentionCardVM`s, newest-first, each with a valid `AttentionType` and a populated
  `embed` (gig `GigCardVM` when a gig is linked, else a message-style preview); an empty list when the user has no
  notifications

**Acceptance Criteria:**
- Both VMs expose `greeting` + `onboarding` (no `banner`); specialist adds `attention` (≤6, typed, gig/message embed)
- `getDashboardAttention` maps recent notifications newest-first (cap 6); `[]` when none

### Requirement: Attention Strip Is Specialist-Only; Tabs Retained as a Sanctioned Variant
The 6× `AttentionCard` strip MUST render on the **specialist** dashboard (a `SectionHeader` + a row of the
`attention` cards) when non-empty, and MUST NOT render on the **company** dashboard (the mock's `hidden=true`
strip). The col1 status Tabs MUST be kept for **both** roles as the «Активные задачи» Menu-switcher — matching the
company node and retained for the specialist as a **sanctioned content variant** (functional filtering the static
specialist feed omits), recorded in the reconciliation note.

#### Scenario: Specialist shows the strip; company hides it
- GIVEN a specialist with ≥1 notification and a company user
- WHEN each dashboard renders
- THEN the specialist dashboard MUST render the `AttentionCard` strip under its `SectionHeader`
- AND the company dashboard MUST NOT render any `AttentionCard` strip

#### Scenario: Tabs retained for both roles, divergence recorded
- GIVEN either dashboard
- WHEN it renders
- THEN col1 «Активные задачи» MUST include the status Tabs (the Menu-switcher) over the `GigCard` feed
- AND the specialist-tabs retention (vs the static node's plain feed) MUST be documented as a sanctioned content
  variant in the reconciliation note (`docs/DESIGN_SYSTEM_SPEC.md` §10.7, RC-S10)

**Acceptance Criteria:**
- Specialist renders the live attention strip (when non-empty); company renders none
- Tabs kept for both as the col1 Menu-switcher; the specialist retention logged as a sanctioned content variant (RC-S10)

### Requirement: Dashboard Reconciliation Keeps the Suite Green
Reconciling the dashboards MUST update the affected E2E/integration assertions to the new composition (greeting +
OnboardingCards + 2-col BOARD + specialist attention strip, no page-title, no `banner`) while preserving every
behavioural assertion (tabs + counts, gig-link, search, create), and MUST keep the build, token-purity lint, and
unit/E2E suites green.

#### Scenario: Tests updated to the reconciled composition, suite green
- GIVEN `__tests__/e2e/compose-{specialist,client}-dashboard.spec.ts` and
  `__tests__/integration/{specialist,client}-dashboard-vm.test.ts`
- WHEN they run after the reconciliation
- THEN the `BannerCard`/page-title assertions MUST be replaced by greeting + OnboardingCard + 2-col-BOARD (+ the
  specialist attention strip) assertions, and the VM tests MUST assert `greeting`/`onboarding`/`attention` (not
  `banner`)
- AND the behavioural assertions (five/four tabs + counts, gig-link → gig detail, specialist search → `/gigs`,
  company create → `/gigs/new`) MUST still pass
- AND `npm run build`, `npm run lint:tokens`, and `npm run test:unit` MUST pass

**Acceptance Criteria:**
- The affected E2E/VM tests assert the reconciled composition (greeting/onboarding/attention, no `banner`/page-title); behavioural assertions intact
- `build` + `lint:tokens` + `test:unit` + the two dashboard E2E suites green

## MODIFIED + ADDED Requirements (reconcile-gig-browse — Phase 1 screen)

> The `/gigs` browse screen (`GigSearch`) reconciled to **Поиск проектов/specialist (`2860:2056`)**. The former
> `Section title="Поиск гигов"` page-title is replaced by a **HEADER row** = a `SectionHeader` («Поиск проектов»,
> the БЛОК heading) + the grid/list **`switcher`** (`ViewToggle`) right-aligned in that same row, over the `GigCard`
> grid (`Grid columns={3}`) / list (`Stack`) spanning the full `Status` set. The switcher is **hoisted out of the
> `FilterBar`** (which now renders its `ViewToggle` only when `onViewChange` is wired) and still drives the `view`
> URL param. The functional `FilterBar` (search + category + sort + Рейтинг) is retained as a **sanctioned content
> variant** the static mock collapses; the server query, gig-link navigation, and `PaginationControls` are unchanged.
> Recorded as RC-S11 in `docs/DESIGN_SYSTEM_SPEC.md` §10.8. Verified by E2E (`compose-gig-search` 6/6, incl. the new
> reconciled-HEADER test) + `gig-pagination` 6/6 + the `domain-blocks` FilterBar unit test (42/42) + the 937-test
> unit suite + F2/F5/build. **F1 ≤1% remains deferred** on the font-licence gate (Phase 2
> `refidelity-from-figma-references`); here F1 = structural match to the node in both grid and list layouts.

### Requirement: Gig Browse Screen Reconciled to the Figma Node
The `/gigs` browse screen (`app/(protected)/gigs/GigSearch.tsx`) MUST remain a composition-pure `@composed-screen`
inside the layout's `AppShell`, reconciled to its Figma node `2860:2056`: a **HEADER row** composed of a
`SectionHeader` (title «Поиск проектов», the БЛОК heading role) on the left and the grid/list **`switcher`**
(`ViewToggle`) right-aligned in the same row, followed by the **`GigCard` grid** (`Grid columns={3}` for
`view="grid"`, a `Stack` for `view="list"`). The screen MUST NOT render the former `Section title="Поиск гигов"`
page-title heading, and MUST NOT render the grid/list switcher inside the `FilterBar`. The screen MUST be token-pure
(F2) and composition-pure (F5), and MUST preserve the search/category/sort/Рейтинг filtering, the grid⇄list view
toggle, the gig-open navigation (`/gigs/[id]?from=browse&…`), and the pagination beneath it.

#### Scenario: HEADER composes a SectionHeader + the grid/list switcher (no page-title)
- GIVEN the gig browse screen
- WHEN it renders
- THEN it MUST render a `SectionHeader` titled «Поиск проектов» and the grid/list `switcher` (`ViewToggle`) in the
  same header row
- AND it MUST NOT render the former `Section title="Поиск гигов"` page-title heading
- AND the grid/list switcher MUST NOT be rendered inside the `FilterBar`

#### Scenario: CONTENT is a GigCard grid/list spanning the full status set
- GIVEN the gig browse screen with gigs across the status set
  (`open | in-progress | review | verification | completed | rejected`)
- WHEN it renders in `view="grid"`
- THEN the cards MUST render in a `Grid columns={3}` of `GigCard`s, each opening its gig detail
  (`/gigs/[id]?from=browse&…`) on activation
- AND when `view="list"` the cards MUST render in a `Stack`
- AND a `GigCard` MUST render its status pill for each status value present

#### Scenario: Filters/search/pagination preserved; composition-pure
- GIVEN the gig browse screen
- WHEN it is interacted with
- THEN the `FilterBar` search + category + sort + Рейтинг controls MUST still drive their URL params, the header
  switcher MUST still toggle the `view` URL param, and `PaginationControls` MUST still render and paginate beneath the
  screen
- AND the screen MUST contain no `className=`/`style=`/hex literals (F5)

**Acceptance Criteria:**
- `GigSearch` is an F5-pure `@composed-screen`: HEADER (`SectionHeader` «Поиск проектов» + header-row `ViewToggle`) + `GigCard` grid/list; no `Section title="Поиск гигов"` page-title, no switcher inside the `FilterBar`
- Search/category/sort/Рейтинг filtering, grid⇄list toggle, gig-open (`from=browse`), and pagination preserved; F2 + F5 lints green

### Requirement: Switcher Hoisted to the Header; Filters Retained as a Sanctioned Variant
The grid/list `switcher` MUST live in the `SectionHeader` HEADER row (matching node `2860:2056`), not inside the
`FilterBar`; the `ViewToggle` primitive is reused verbatim (same `view`/`onChange` contract) with only its placement
changed, and `FilterBar` MUST render its `ViewToggle` only when `onViewChange` is wired. The functional `FilterBar`
(search + category + sort + Рейтинг) MUST be retained as a **sanctioned content variant** — the node mock shows only
the header + card grid (its filter UI collapsed), and the filtering is kept because it provides functional value the
static mock omits — recorded in the reconciliation note.

#### Scenario: Switcher in the header, single instance
- GIVEN the gig browse screen
- WHEN it renders
- THEN exactly one grid/list switcher MUST render, located in the `SectionHeader` header row (not in the `FilterBar`)
- AND toggling it MUST switch the `GigCard` layout between the `Grid` (grid) and the `Stack` (list)

#### Scenario: Retained filter affordance recorded as a sanctioned variant
- GIVEN the reconciled screen retains the `FilterBar` search/category/sort/Рейтинг controls the node mock omits
- WHEN the reconciliation is documented
- THEN the retention MUST be recorded as a sanctioned content variant in the reconciliation note
  (`docs/DESIGN_SYSTEM_SPEC.md` §10.8, RC-S11) with the node id `2860:2056`

**Acceptance Criteria:**
- Switcher hoisted to the `SectionHeader` row (single instance); `FilterBar` `ViewToggle` gated on `onViewChange`
- The retained functional filters logged as a sanctioned content variant (RC-S11)

### Requirement: Gig Browse Reconciliation Keeps the Suite Green
Reconciling the gig browse screen MUST update the affected E2E assertions to the new composition (the «Поиск
проектов» `SectionHeader` + the header-row switcher + the `GigCard` grid, no `Section title=` page-title, no
switcher inside the `FilterBar`) while preserving every behavioural assertion (search, category/sort/Рейтинг
filtering, grid⇄list toggle, gig-open, pagination), and MUST keep the build, token-purity lint, composition lint, and
unit/E2E suites green.

#### Scenario: Tests updated to the reconciled composition, suite green
- GIVEN `__tests__/e2e/compose-gig-search.spec.ts` (the browse composition spec, extended)
- WHEN it runs after the reconciliation
- THEN the old `Section title="Поиск гигов"` / filter-bar-switcher assertions MUST be replaced by the
  `SectionHeader` «Поиск проектов» + header-row switcher + `GigCard` grid assertions
- AND the behavioural assertions (search submits, category/sort/Рейтинг filter, grid⇄list toggle, gig-open
  `/gigs/[id]?from=browse`, pagination) MUST still pass
- AND `npm run build`, `npm run lint:tokens`, `node scripts/design-system/validate-composition.js`, and
  `npm run test:unit` MUST pass

**Acceptance Criteria:**
- The browse E2E spec asserts the reconciled HEADER (SectionHeader + header-row switcher, no page-title, no filter-bar switcher); behavioural assertions intact
- `build` + `lint:tokens` + `validate-composition` + `test:unit` + `compose-gig-search` E2E green

## MODIFIED + ADDED Requirements (adopt-design-fonts — Phase 0, full-design re-ground)

> The type layer re-grounded on `gigly_full_design`'s **sanctioned free-Cyrillic substitution** (README + `HANDOFF.md`
> + `styles.css`), replacing the dev-stage Inter + JetBrains Mono guesses: **NKDuy Mono → Handjet** (`--font-mono`,
> the accent/pixel face — display/h1/logo/mono), **Vremena Grotesk → Manrope** (`--font-grotesk`, NEW — numbers/price/
> term, message bodies, job-experience), **SF Compact → system stack** (`--font-sans`). Handjet + Manrope self-host
> via `next/font/google` (Cyrillic subset, variable axes, no runtime Google request); the `--font-sans`/`--font-mono`
> contract names stay stable so heading/body roles re-resolve with no per-token re-tagging. **The F1 font-licence cap
> is retired** (`docs/TYPOGRAPHY.md`) — the ≤1% gate's only remaining dependency is the Phase-4 re-baseline. Verified
> by `validate:tokens` (in sync; `grotesk` present), `lint:tokens`, `lint:composition`, `build` (self-hosted), and the
> 937-test unit suite.

### Requirement: Type Layer Binds the Sanctioned Design Fonts
The type layer MUST bind the design's sanctioned free-Cyrillic substitution: `--font-mono` (accent — `display / h1 /
mono / mono-small`) MUST resolve **Handjet**; `--font-sans` (`h2 / title / body / label / label-bioname / caption`)
MUST resolve a **system font stack**; `--font-grotesk` (NEW) MUST resolve **Manrope**. Handjet + Manrope MUST be
self-hosted at build via `next/font/google` (Cyrillic subset, no runtime Google request). Inter and JetBrains Mono
MUST NOT remain wired as the type families. The `--font-sans` / `--font-mono` contract names MUST be preserved
(consumers + the semantic `fontFamily.*` tokens unchanged).

#### Scenario: The three families resolve to the sanctioned substitutes
- GIVEN the running app
- WHEN `font-mono` (display/h1), `font-sans` (body), and `font-grotesk` elements render
- THEN `--font-mono` MUST resolve Handjet, `--font-sans` the system stack, `--font-grotesk` Manrope
- AND `app/fonts.ts` MUST self-host Handjet + Manrope via `next/font/google` and MUST NOT load Inter or JetBrains Mono

#### Scenario: Token pipeline regenerated and in sync
- GIVEN `design-tokens.json` `font.family` updated (accent → Handjet, primary → system, + `grotesk` → Manrope) and
  regenerated `scripts/generated-tokens.{js,css}`
- THEN `npm run validate:tokens` MUST pass, a `font-grotesk` Tailwind utility MUST exist, and the family descriptions
  MUST name the real substitutes (no "dev sub: Inter / JetBrains Mono")

**Acceptance Criteria:**
- `app/fonts.ts` loads Handjet (`--font-mono`) + Manrope (`--font-grotesk`) via `next/font/google`; `--font-sans` is the system stack; no Inter/JetBrains in the type layer
- `validate:tokens` + `lint:tokens` + `lint:composition` + `build` + `test:unit` green; the `font-mono`-class assertion still holds

### Requirement: Grotesk (Manrope) Family Available for the Vremena Roles
The type system MUST expose a `font-grotesk` family (Manrope) — a `fontFamily.grotesk` token + `--font-grotesk`
variable + Tailwind `font-grotesk` utility — for the Vremena Grotesk roles (numbers, gig price/term, message bodies,
job-experience). It MUST be wired + exercised (token + utility + a workbench typography sample); per-screen adoption
MAY land incrementally with the Phase-3 reconciliations.

#### Scenario: font-grotesk is wired and exercised
- GIVEN the regenerated tokens + Tailwind config
- THEN a `font-grotesk` (Manrope) sample MUST render in the workbench typography catalog, the `font-grotesk` utility
  MUST be available to screens, and applying it MUST introduce no off-token literal (token-purity stays green)

**Acceptance Criteria:**
- `fontFamily.grotesk` + `--font-family-grotesk` present in the generated outputs; `type/grotesk` in the workbench catalog

### Requirement: The F1 Font-Licence Cap Is Retired
The "type fidelity is CAPPED — fonts not web-embeddable" framing MUST be retired across the docs + planning risk
lists, replaced by the sanctioned substitution as system fact. `docs/TYPOGRAPHY.md` MUST state the resolved
Handjet / Manrope / system mapping, and no doc/planning MUST state that the font licence caps the F1 ≤1% gate.

#### Scenario: Docs and planning no longer frame type fidelity as capped
- GIVEN `docs/TYPOGRAPHY.md` and the planning docs after this change
- THEN they MUST describe the Handjet / Manrope / system substitution as the sanctioned target
- AND they MUST NOT state that the font licence caps F1; the gate's only remaining dependency is the Phase-4 re-baseline

**Acceptance Criteria:**
- `docs/TYPOGRAPHY.md` names the sanctioned trio (cap retired); the planning font-risk is struck; no live "font caps F1" claim remains

## ADDED Requirements (reconcile-tokens-to-full-design — Phase 1, full-design re-ground)

> The token SSOT re-synced to `gigly_full_design/design-system/fig-tokens.css` (189 tokens) — the core values already
> AGREED; this closes the residual additive gaps + one value correction. Added: the **per-status radial/border/text
> triads** (5 `gradient.status-*-glow` + a new `color-semantic.status-border.*` namespace; the 6 `status.*` text leaves
> unchanged), the **`sm`/`lg` shadows**, the **`80`/`96` spacing** (5xl/6xl). Pinned the **category↔hue** mapping to the
> design's `Category.jsx`: `marketing` corrected **#0088ff → #4cacff** (the Category blue; SUPERSEDES §10.1 RC-S3),
> `design` relabeled **rose** (#f45fb1), the rest confirmed. `status.open` text kept gray (#8a8f99 vs the Figma white)
> for legibility. All additive — no legacy key removed; regenerated `scripts/generated-tokens.{js,css}`. Recorded as
> RC-T1–T4 in `docs/DESIGN_SYSTEM_SPEC.md` §10.9. Verified by `validate:tokens` (45 colours, in sync, no parody),
> `lint:tokens` (baseline unchanged), `lint:composition`, `build`, and the 937-test unit suite.

### Requirement: Per-Status Radial/Border/Text Triads Are Token-Backed
The token SSOT MUST provide, for each of the 6 statuses (`open, review, in-progress, verification, completed,
rejected`), the full triad from `fig-tokens.css` `--status-{name}-*` (Figma keys mapped **new → open**, **testing →
verification**): the **text** colour (the existing `color-semantic.status.{name}` leaf), a **radial** glow
(`gradient.status-{name}-glow`), and a **border** tint (`color-semantic.status-border.{name}`). The additions MUST NOT
restructure the existing `color-semantic.status.{name}` leaves, and the generated outputs MUST be regenerated so every
new colour leaf + radial appears in `generated-tokens.{js,css}`.

#### Scenario: All six statuses expose a radial + border + text; existing leaves unchanged
- GIVEN `openspec/specs/ui/design-tokens.json` after the change
- THEN each status MUST have a `color-semantic.status.{name}` text leaf, a `gradient.status-{name}-glow` radial, and a
  `color-semantic.status-border.{name}` border leaf
- AND the existing `status.*` leaves (and `text-/bg-/border-status-*` utilities) MUST be preserved unchanged
- AND `npm run validate:tokens` MUST pass (no drift; `gradient` + `boxShadow` groups non-empty)

### Requirement: Shadow + Spacing Scales Completed; Category Mapping Pinned (Legacy Keys Kept)
`effect.shadow` MUST add `sm` (`0 1 2 0 rgba(0,0,0,0.3)`) and `lg` (`0 8 24 0 rgba(0,0,0,0.5)`), keeping `card`/
`popover` as legacy aliases; `numbers.spacing` MUST add `20` (80px) and `24` (96px) keeping the existing numeric keys;
the `numbers.corner` radius scale MUST be verified complete (xl 16 = `special`, xs 2 = `lt`) without change. The 5
`color-semantic.category` keys MUST be pinned to the design's `Category.jsx` hues — `marketing` #4cacff, `design`
#f45fb1 (rose), `programming` #0cc671, `development` #05c9e6, `coding` #f27c0d — with the `marketing` correction
(#0088ff → #4cacff) and the `status.open` gray-vs-white divergence recorded in `docs/DESIGN_SYSTEM_SPEC.md`.

#### Scenario: Scales extended + categories pinned, nothing removed
- GIVEN the SSOT after the change
- THEN `effect.shadow` MUST include `sm`/`md`/`lg`/`focus` (+ legacy `card`/`popover`), `numbers.spacing` MUST include
  `20`/`24`, and `color-semantic.category` MUST be `marketing #4cacff` / `design #f45fb1` (rose) / `programming #0cc671`
  / `development #05c9e6` / `coding #f27c0d`
- AND no previously present token key may be removed, and `npm run validate:tokens` MUST still find the 5 categories

### Requirement: Token Reconciliation Keeps the Pipeline Green
Regenerating the tokens MUST keep the build, token validator, token-purity lint, and unit suite green, with the
generated outputs in sync with the JSON SSOT.

#### Scenario: Deterministic gates pass after regeneration
- GIVEN the updated SSOT + regenerated `scripts/generated-tokens.{js,css}`
- WHEN `npm run validate:tokens`, `npm run lint:tokens`, `npm run build`, and `npm run clean:test-db && npm run test:unit` run
- THEN all MUST pass — tokens valid + in sync, no new off-token literal (purity baseline unchanged), the app builds, and
  the unit suite is green

**Acceptance Criteria:**
- 6 status radials + 6 status borders; `shadow.sm`/`lg`; spacing `80`/`96`; category pinned (marketing #4cacff, design rose); no legacy key removed
- `validate:tokens` (45 colours, in sync) + `lint:tokens` + `lint:composition` + `build` + `test:unit` green; RC-T1–T4 in §10.9 (RC-S3 superseded on marketing)

## ADDED Requirements (add-light-theme — Phase 1, runtime theming)

> The net-new **light theme** (`gigly_full_design/ТЗ — Светлая тема`). The token appearance layer (colours, shadows,
> gradients) is now emitted to Tailwind as `var(--*)` refs, with the dark values in `generated-tokens.css` `:root` and
> the light overrides under `[data-theme="light"]` (imported by `globals.css`) — so every **token-pure** utility
> switches at runtime. **Dark stays the default and visually unchanged** (dark var values == the prior literals);
> `brand.default #0088ff` + the font families are theme-invariant; status stays one-to-one (radial glow → flat 8–10%
> fill on light). A `lib/theme.ts` controller + a no-flash boot `<script>` in `app/layout.tsx` + a Settings → Внешний
> вид `Select` persist the choice in `localStorage['gigly-theme']`. Recorded as RC-T5–T7 in `docs/DESIGN_SYSTEM_SPEC.md`
> §10.10. Verified by `validate:tokens` (48 colours, var-backed, dark+light layers in sync), `lint:tokens`,
> `lint:composition`, `build`, the 937-test unit suite, and the `theme-switch` E2E (3/3).

### Requirement: Token Appearance Layer Is Runtime-Themeable via [data-theme]
The colour/shadow/gradient tokens MUST resolve through runtime CSS variables that switch on the root `[data-theme]`
attribute (Tailwind consumes `var(--<key>)`; `generated-tokens.css` defines each token's dark value in `:root` and its
light override in `[data-theme="light"]`; `app/globals.css` imports that layer). Dark MUST remain the default and be
visually unchanged (dark var values equal the prior literals). No Tailwind `/opacity` modifier may be used on a
var-backed colour — an alpha fill MUST be a dedicated full-value token (`color-semantic.tint.*`).

#### Scenario: Utilities resolve through switchable vars; dark default unregressed
- GIVEN the regenerated token pipeline
- THEN `tokens.colors/boxShadow/gradient[key]` MUST be `var(--…)`, `:root` MUST carry the dark values, and
  `[data-theme="light"]` MUST carry the light overrides; `globals.css` MUST import the layer
- AND with no/`dark` `data-theme` the app renders the (unchanged) dark theme; under `data-theme="light"` token-pure
  utilities render the light values
- AND no component uses a `/opacity` modifier on a var colour (alpha fills use `tint.*` tokens)

### Requirement: Light Token Values — Depth via Shadow + Grey; Brand & Type Invariant
The themeable tokens MUST carry `light` values per `ТЗ` (surfaces `#f4f5f7`/`#ffffff`/`#eceef1`; hairlines `#e6e8ec`;
navy-tinted shadows; status radial glows → flat 8–10% fills; overlays → dark hairlines). `brand.default #0088ff` and
the font families MUST NOT receive a light override; status hues stay one-to-one across themes.

#### Scenario: Light values present; brand/type invariant; status one-to-one
- GIVEN `design-tokens.json` after the change
- THEN the themeable surface/text/border/overlay/status/shadow tokens MUST carry a `light` value, and `brand.default`
  + the font families MUST NOT
- AND each status keeps its distinct hue in light (one-to-one lifecycle mapping preserved)

### Requirement: Theme Switch Persists and Applies Without Flash
A controller (`lib/theme.ts`) MUST set `<html data-theme>`, persist to `localStorage['gigly-theme']`, and restore on
load; `app/layout.tsx` MUST apply the stored theme before first paint via an inline boot script; Settings → Внешний
вид MUST expose the Тёмная/Светлая control. Dark is the default when unset.

#### Scenario: Toggle flips + persists + survives reload; dark default
- GIVEN the default (dark) app
- WHEN the user switches to Светлая in Settings → Внешний вид
- THEN `<html data-theme="light">`, the UI re-renders light, `localStorage['gigly-theme']="light"`, and a reload
  restores light with no flash-of-dark; an unset/`dark` value renders dark

**Acceptance Criteria:**
- Colours/shadows/gradients are `var(--*)`; `:root` (dark) + `[data-theme="light"]` (light) layers in sync + imported; dark default unchanged
- Light values present (brand + fonts invariant; status one-to-one); no `/opacity` on var colours (tint tokens instead)
- Switch persists in `localStorage['gigly-theme']` + applies before paint; `validate:tokens`/`lint:tokens`/`build`/`test:unit` + `theme-switch` E2E green

## ADDED Requirements (light-theme-screen-audit — Phase 1, light-theme acceptance pass)

> The light-theme acceptance pass (closes `add-light-theme`'s deferred scope; `ТЗ — Светлая тема` §3/§5/§8.4/§9). A
> deterministic **WCAG-AA contrast gate** (`scripts/design-system/validate-contrast.js`, `lint:contrast`) audits every
> text×surface token pair in BOTH themes — body 4.5:1 (`text.strong/muted/subtle`), large 3:1 for `status.*` labels
> (preserves the vivid one-to-one hues + keeps the shipped dark theme unchanged). The **74 legacy raw-literals → 0**:
> the dead-duplicate auth trees (`components/auth/*` + `app/components/auth/*`, both unimported) were deleted, `/login`
> + `InfoIcon` token-migrated, and `token-purity-baseline.json` emptied so the purity lint is **fail-on-all**. The logo
> reads on light via a `surface.logo-plate` token (transparent dark / dark island light, ТЗ §5). A `suppressHydration
> Warning` on `<html>` resolves the theme-boot-script hydration warning. Verified by `lint:contrast`, `lint:tokens`
> (0 baseline), `validate:tokens` (49 colours), `lint:composition`, `build`, the 911-test unit suite, and the
> `theme-coverage`/`theme-switch`/`login-role-param`/`auth-navigation` E2E. Recorded as RC-T8–T11 in
> `docs/DESIGN_SYSTEM_SPEC.md` §10.11.

### Requirement: WCAG-AA Contrast Is Enforced in Both Themes
A deterministic gate (`scripts/design-system/validate-contrast.js`, `npm run lint:contrast`) MUST compute the WCAG
contrast ratio for every audited text×surface token pair using the SSOT values for both themes (dark = `value`, light
= `light ?? value`) and MUST fail when a pair is below its threshold — **≥4.5:1** body (`text.strong/muted/subtle`),
**≥3:1** large (`status.*` labels). Documented exceptions (white-on-brand button; dark specialty chip) MUST be an
explicit allowlist; `text.disabled` is WCAG-exempt.

#### Scenario: Contrast gate passes AA both themes and fails on a violation
- GIVEN the token SSOT
- WHEN `npm run lint:contrast` runs
- THEN it MUST PASS only if every audited pair meets its AA threshold in both themes, and MUST FAIL (exit 1) on a
  planted below-AA value, naming the pair + theme + ratio

### Requirement: No Raw Colour Literals Remain (Purity Lint Fail-on-All)
`token-purity-baseline.json` MUST be empty and `lint:tokens` MUST fail on any raw hex/rgba literal. Legacy files MUST
be token-migrated or deleted-if-dead; the dead-duplicate auth trees MUST be removed rather than re-baselined.

#### Scenario: Empty baseline; any literal fails
- GIVEN the codebase after the audit
- THEN `token-purity-baseline.json` MUST be `{}`, `lint:tokens` MUST PASS, and introducing any raw literal MUST fail it
- AND the unused `components/auth/*` + `app/components/auth/*` trees MUST be deleted; `/login` + `InfoIcon` token-pure

### Requirement: The Logo Reads On Light; Every Screen Renders In Both Themes
`Logomark` MUST render legibly on a light surface (the `surface.logo-plate` token — transparent on dark, a dark island
on light), brand + Handjet invariant. A `theme-coverage` E2E MUST load the key public + protected routes under both
themes, asserting the page background switched (themed) and no console error, capturing a screenshot per (route ×
theme). The theme boot script's pre-hydration mutation of `<html>` MUST not produce a hydration warning
(`suppressHydrationWarning`).

#### Scenario: Logo legible on light; routes render themed without console errors
- GIVEN `data-theme="light"`
- THEN the `Logomark` mark MUST read against the light surface (dark plate), and each audited route under both themes
  MUST render with the themed page background and no console error (incl. no hydration warning)

**Acceptance Criteria:**
- `lint:contrast` PASS (AA both themes) + fails on a planted below-AA value; status classified large, exceptions allowlisted
- `token-purity-baseline.json` empty + `lint:tokens` fail-on-all; dead auth trees deleted; `/login` + `InfoIcon` token-migrated
- `surface.logo-plate` makes the logo read on light; `suppressHydrationWarning` on `<html>`; `theme-coverage` both-themes render green
- `validate:tokens` (49) + `lint:composition` + `build` + `test:unit` (911) + theme/auth E2E green

## ADDED Requirements (add-bio-block — Phase 3, kit gap)

> The design's identity row `bio` (Figma 2931:2365) + `bio/message/COMPANY` (2931:2366) added as a single `Bio` block
> over the existing primitives (Avatar + name + verify-patch + Rating stars + `Специальность`), with `sizeFor:
> gig|acc-bio` × `user: specialist|company` — the two nodes collapse into one block (the `user: 'company'` variant
> omits `Специальность`). Adopted in `ChatHeader` (renders `Bio`; `ChatHeaderVM` preserved + optional `specialty`) and
> the gig-detail CONDITIONS column (a company `Bio` from `getGigDetail`'s new `bio: BioVM`); `ClientCard` stays (dispute
> detail). Recorded RC-S13 in `docs/DESIGN_SYSTEM_SPEC.md` §10.12. Verified by 3 `Bio` render tests + `compose-chats` /
> `compose-gig-detail-apply` E2E + the 921-test unit suite.

### Requirement: Bio Block (Avatar + Name + Verify + Stars + Specialty), Variant-Typed
A `Bio` block MUST render the identity row from primitives only (no `className`/`style`/hex; Avatar + name + the
`verified` patch icon (F4) + Rating + the `SpecialtyTag` `Специальность` + an optional presence line), typed by
`BioVM` with `sizeFor: 'gig' | 'acc-bio'` and `user: 'specialist' | 'company'`. The `company` variant MUST omit
`Специальность` (covering `bio/message/COMPANY`). Token-pure (F2).

#### Scenario: Bio renders its parts across variants
- GIVEN a specialist `BioVM` (acc-bio, with rating + verified + specialty) and a company one
- THEN the specialist `Bio` MUST show avatar + name + the verify-patch + Rating stars + the `Специальность`; the
  company `Bio` MUST show avatar + name + verify + rating and MUST NOT render a `Специальность`
- AND the block MUST contain no `className=`/`style=`/hex literals (composing only kit primitives)

### Requirement: ChatHeader and Gig-Detail Conditions Adopt Bio
`ChatHeader` MUST render the `Bio` block (mapping `ChatHeaderVM` → `BioVM`; `ChatHeaderVM` gains an optional
`specialty`, existing fields preserved). `getGigDetail` MUST provide a company `bio: BioVM` (from the gig's client) and
the gig-detail screen MUST render `<Bio>` as the conditions bio, staying composition-pure (F5).

#### Scenario: The chat header and gig-detail conditions render via Bio
- GIVEN a chat thread and a gig-detail view
- THEN `ChatHeader` MUST render through `Bio` (avatar/name/verify/rating/presence, + specialty when present) with its
  existing `ChatHeaderVM` honored, and the gig-detail conditions MUST render a company `Bio` from `data.bio`
- AND both the chat and gig-detail screens MUST stay composition-pure and their E2E green

**Acceptance Criteria:**
- `Bio` block + `BioVM` (sizeFor gig|acc-bio × user specialist|company; company omits `Специальность`); token-pure; F4 verify asset
- `ChatHeader` renders via `Bio` (`ChatHeaderVM` += optional `specialty`); `getGigDetail` returns `bio`; gig-detail renders `Bio` (F5)
- 3-variant render tests; `build` + `lint:tokens` + `lint:composition` + `test:unit` (921) + chat/gig-detail E2E green
- The two-nodes→one-block (`user` axis) decision recorded (§10.12 / RC-S13)

### Requirement: Gig Detail Screen Reconciled to the Prototype
The `/gigs/[id]` screen MUST remain a composition-pure `@composed-screen` inside `AppShell`, reconciled to the
`gigly_full_design` `gigDetail` prototype as a 2-column layout: **col1** = a `main` overview (title + category tags +
the gig **description**) followed by a `SectionHeader` «Технические требования» (with a count) over a **2-column
`RequirementCard` grid**, and a `SectionHeader` «Критерии успеха» (count) over a **numbered `CriteriaList`**;
**col2 «УСЛОВИЯ»** = the company `Bio` (+ company description) followed by a conditions panel (`ConditionsPanel` — a
two-tab toggle «Условия {company}»/«Мои условия» + a Статус row + Срок + Бюджет + the role action panel) and a
`SectionHeader` «Сообщения» over the `ChatPanel`. The conditions panel is a dedicated `ConditionsPanel` block, NOT the
generic term-row `TermsTabs` (RC-S15). The screen MUST be token-pure (F2) and composition-pure (F5), and MUST preserve
every server-action flow (apply, withdraw, accept/reject, submit, approve, return-to-rework, mark-as-paid, messaging,
open-dispute, admin history).

#### Scenario: col1 renders main + Требования + Критерии успеха (no files section)
- GIVEN the gig detail screen
- WHEN it renders
- THEN col1 MUST show the title + tags + the gig **description**, a `SectionHeader` «Технические требования» over the
  2-col `RequirementCard` grid, and a `SectionHeader` «Критерии успеха» over the numbered `CriteriaList`
- AND it MUST NOT render any «Файлы»/attachments section (the prototype has none)

#### Scenario: col2 «УСЛОВИЯ» renders the bio, conditions, action panel, and chat
- GIVEN the gig detail screen
- WHEN it renders
- THEN col2 MUST render the company `Bio` (+ company description), then a `ConditionsPanel` (the two-tab toggle, a
  Статус row, and Срок + Бюджет), then the role action panel, then a `SectionHeader` «Сообщения» over the `ChatPanel`
- AND the `GigHeader`/`main` block MUST NOT render the former budget/deadline/posted meta row (срок/бюджет live in col2)

#### Scenario: All server-action flows preserved; composition-pure
- GIVEN the screen across roles
- WHEN it is interacted with
- THEN a SPECIALIST applies (+ withdraws); the owner sees the applications + accepts/rejects; the assigned specialist
  submits, the owner approves / returns-to-rework / pays; messaging works once assigned; example/closed/dispute/admin
  notices behave as before
- AND the screen MUST contain no `className=`/`style=`/hex literals (F5)

### Requirement: Срок/Бюджет Are Grotesk Numerics; the Company Sees the Fee Breakdown
The conditions panel MUST render **Срок выполнения** and **Бюджет проекта** as large **`font-grotesk`** (Manrope)
numbers with the «[N этап]» / «фикс. цена» sublabels. For the **company** viewer, the budget block MUST additionally
show the **Сервисный сбор (17,5%)** and **Итого к оплате** breakdown (from the gig's `serviceFee` / `totalAmount`); the
specialist MUST NOT see it (gated in `getGigDetail` as `fee: isOwner ? … : undefined`).

#### Scenario: Numerics use grotesk; company-only fee breakdown
- GIVEN the conditions panel
- WHEN it renders for a specialist and for the gig owner (company)
- THEN Срок + Бюджет MUST use the `font-grotesk` token, and the **company** view MUST show the 17.5% fee + total while
  the specialist view MUST NOT

### Requirement: GigHeader Reconciled to the main Shape (with description)
`GigHeaderVM` MUST carry `description` and the `GigHeader`/`main` block MUST render it; in the gig-detail composition
the block MUST NOT render the budget/deadline/posted meta row. `getGigDetail` MUST bind `header.description` from the
gig.

#### Scenario: main renders the description, not the meta row
- GIVEN `getGigDetail(gigId, viewer)`
- THEN `header.description` MUST equal the gig description and the `main` block MUST render it
- AND the budget/deadline/posted meta row MUST NOT appear in `main`

### Requirement: The Files-Section Omission Is a Design Fact, Not a Deferral
The screen MUST NOT render a files/attachments section, recorded as a **design fact** (the prototype `gigDetail` has no
such section) — explicitly correcting the prior export-based "4 file chips / sanctioned omission pending a backend"
claim. The decision MUST be recorded in the reconciliation note (§10.13 / RC-S14).

#### Scenario: No files section, correction recorded
- GIVEN the reconciled screen
- THEN there MUST be no files/attachments section, and `docs/DESIGN_SYSTEM_SPEC.md` MUST record that the prototype has
  none (superseding the earlier export-based claim)

### Requirement: Gig Detail Reconciliation Keeps the Suite Green
The reconciliation MUST update the affected E2E/unit/VM assertions to the prototype composition while preserving every
behavioural assertion, and keep the build, token-purity lint, composition lint, and unit/E2E suites green.

#### Scenario: Tests updated to the prototype composition, suite green
- GIVEN `compose-gig-detail-apply.spec.ts`, `domain-blocks.test.tsx`, `gig-detail-vm.test.ts`
- WHEN they run after the reconciliation
- THEN they MUST assert the col1 description + Требования/Критерии успеха headers + **no files section** + the col2
  Bio/ConditionsPanel/Срок/Бюджет/company-fee + the «Сообщения» chat, and the `GigHeader` description
- AND the behavioural assertions (apply → «Отозвать заявку», owner accept → «В работе», submit → «На проверке»,
  messaging echo, example «Откликаться на примеры нельзя») MUST still pass
- AND `npm run build`, `npm run lint:tokens`, `npm run lint:composition`, and `npm run test:unit` MUST pass

**Acceptance Criteria:**
- col1 = main (title+tags+description) + «Технические требования» (2-col RequirementCard) + «Критерии успеха» (numbered CriteriaList); **no files section**
- col2 «УСЛОВИЯ» = company `Bio` + `ConditionsPanel` (tabs + Статус + Срок/Бюджет as `font-grotesk`, company-only fee breakdown) + role action panel + «Сообщения» ChatPanel
- `GigHeader` renders `description`, drops the meta row; `getGigDetail` binds it + the `conditions` VM; срок/бюджет use `font-grotesk`
- every server-action flow preserved; **«Вернуть на доработку» flagged (no coded `returnWork`), not invented** (§10.13 / RC-S18)
- new `ConditionsPanel` block + `ConditionsPanelVM` (sanctioned deviation from "no new component"; RC-S15); `TermsTabs` kept in the kit untouched
- F2 + F5 lints green; the no-files correction recorded; `build` + `lint:tokens` + `lint:composition` + `test:unit` (923) + `compose-gig-detail-apply` E2E (5/5) green; F1 = structural vs the prototype (≤1% deferred to Phase 4 `refidelity-from-full-design`)
- Reconciliation decisions recorded (§10.13 / RC-S14–S18)

### Requirement: «Мои гиги» Screen at /my-gigs (Role-Aware Own Gigs)
The application MUST provide a standalone **«Мои гиги»** screen at `/my-gigs`, available to **both** CLIENT and
SPECIALIST, as a composition-pure `@composed-screen` inside `AppShell`. It MUST list the **viewer's own gigs** — for a
CLIENT, the gigs they posted; for a SPECIALIST, the gigs they applied to or are assigned to — as a 2-column `GigCard`
grid under a `SectionHeader` «Мои гиги» and a `Tabs` status bar. Each card MUST link to `/gigs/[id]`. The public
browse/search screen at `/gigs` MUST remain unchanged. The prototype's `gigs` screen key is NOT a URL contract; the
own-gigs screen lives at `/my-gigs` and the nav (`lib/nav.ts`) + fixtures point «Мои гиги» there for both roles
(RC-S19). The screen MUST be token-pure (F2) and composition-pure (F5), composing only existing kit blocks
(`SectionHeader`, `Tabs`, `GigCard`, an empty-state block) + layout + tokens. All on-screen text MUST be Russian.

#### Scenario: /my-gigs renders the header, tabs, and own-gig grid
- GIVEN an authenticated CLIENT (or SPECIALIST) on `/my-gigs`
- WHEN it renders
- THEN it MUST show a `SectionHeader` «Мои гиги», a `Tabs` status bar with per-tab counts, and a 2-column `GigCard` grid
  of the **viewer's own** gigs, each linking to `/gigs/[id]`
- AND the public browse/search at `/gigs` MUST be unaffected

#### Scenario: Role-aware content on one route
- GIVEN the `/my-gigs` screen
- WHEN a CLIENT views it, the grid MUST contain gigs the client posted
- AND WHEN a SPECIALIST views it, the grid MUST contain gigs the specialist applied to or is assigned to

### Requirement: «Мои гиги» Five Status Tabs With Counts (Both Roles)
The «Мои гиги» screen MUST present the prototype's five status tabs — **Все / Заявки / В работе / На проверке /
Завершённые** — for both roles, each with a count, with client-side filtering by the active tab (Все = all). The
**«Заявки»** tab is role-specific: for a CLIENT it MUST count own OPEN gigs that have received applications (the derived
«На рассмотрении», OPEN + applications>0); for a SPECIALIST it MUST count own PENDING applications. The derivation MUST
reuse `gigDisplayStatus` (no new status semantics). `lib/view-models.ts` MUST expose `getMyGigs(viewer)` returning the
role-aware tagged cards + the five-tab descriptor, reusing `toGigCardVM` and the dashboards' existing gig queries
(RC-S20).

#### Scenario: Tabs render with counts and filter the grid
- GIVEN the «Мои гиги» screen with gigs across statuses
- THEN the five tabs MUST each show a count, and selecting a tab MUST filter the grid to that status (Все shows all)

#### Scenario: «Заявки» is role-aware
- GIVEN the «Заявки» tab
- WHEN a CLIENT views it, it MUST count own OPEN gigs with applications (derived «На рассмотрении»)
- AND WHEN a SPECIALIST views it, it MUST count own PENDING applications

### Requirement: «Мои гиги» Empty State and Skeleton Loading
When the active tab has no gigs, the screen MUST render the prototype empty state — the title **«Здесь пока пусто»** and
the subtitle **«Гигов с таким статусом нет. Они появятся здесь, когда изменится статус работ.»**. While the server data
resolves, the route MUST render a 2-column **skeleton** grid (a `loading.tsx` / Suspense fallback) (RC-S21).

#### Scenario: Empty tab shows the prototype empty state
- GIVEN a tab with no gigs
- WHEN that tab is active
- THEN the screen MUST show «Здесь пока пусто» and the subtitle above

#### Scenario: Loading shows the skeleton grid
- GIVEN navigation to `/my-gigs` before data resolves
- THEN a 2-column skeleton grid MUST be shown via the route's loading boundary

**Acceptance Criteria:**
- `/my-gigs` (both roles), F5-pure: `SectionHeader` «Мои гиги» + `Tabs` (5 tabs, counts) + 2-col `GigCard` grid of own gigs; `/gigs` browse unchanged
- 5-tab set Все/Заявки/В работе/На проверке/Завершённые; «Заявки» role-aware (client OPEN+apps «На рассмотрении» / specialist PENDING); reuses `gigDisplayStatus`
- prototype empty state + 2-col skeleton `loading.tsx`; `getMyGigs(viewer)` factors the dashboards' own-gig logic; nav + fixtures → `/my-gigs`
- F2 + F5 lints green; `build` (`/my-gigs`) + `test:unit` (930) + `compose-my-gigs` E2E (3/3) green; F1 = structural vs the prototype `gigs` frame (≤1% deferred to Phase 4)
- Reconciliation decisions recorded (§10.14 / RC-S19–S21)

### Requirement: Chat Thread Header Uses the Bio Identity With a Dynamic Counterparty Role
The chat thread header MUST render the **`Bio`** identity (`acc-bio`): avatar + name + verify-patch + rating + presence
«был(-а) недавно». `Bio`'s `user` axis MUST be **driven by the counterparty's role**, not constant: a **company**
counterparty (a SPECIALIST viewing the chat) MUST use `user: "company"` and **collapse** the `Специальность`; a
**specialist** counterparty (a CLIENT viewing the chat) MUST use `user: "specialist"` and **show** it. `ChatHeaderVM`
MUST carry the counterparty role; the prior hard-coded `user: "specialist"` MUST be removed. `getChatThread` MUST set
`header.counterparty` from the viewer's role and populate `header.specialty` from the assigned specialist's profile
(position → specialization → experienceLevel) when the counterparty is a specialist, leaving it undefined for a company;
the presence «был(-а) недавно» and all messaging/authorization semantics MUST be unchanged (RC-S22, RC-S23).

#### Scenario: Company counterparty collapses Специальность
- GIVEN a SPECIALIST viewing a chat (the counterparty is the company)
- THEN the thread header MUST use the `Bio` company variant and MUST NOT show a `Специальность`; `getChatThread` MUST set
  `header.counterparty === "company"` and `header.specialty === undefined`

#### Scenario: Specialist counterparty shows Специальность
- GIVEN a CLIENT viewing a chat (the counterparty is the assigned specialist)
- THEN the thread header MUST use the `Bio` specialist variant and MUST show the specialist's `Специальность`;
  `getChatThread` MUST set `header.counterparty === "specialist"` and bind `header.specialty` from the profile

### Requirement: Conversation Item Shows Gig Status and Unread
Each `ConversationItem` MUST show the gig **status badge** (derived via `gigDisplayStatus`) and an **unread** indicator
alongside the counterparty name, gig-title subtitle, last-message preview, and timestamp, matching the prototype list
item. `ConversationItemVM` carries `status`; `getConversations` derives it (RC-S24). No field the prototype does not show
may be invented.

#### Scenario: Conversation item renders status + unread
- GIVEN a conversation in the list
- THEN it MUST show the gig status badge + the unread indicator + the gig-title subtitle

**Acceptance Criteria:**
- thread header uses `Bio` with a **dynamic** `user` axis (company collapses `Специальность`, specialist shows it); hard-coded `user: "specialist"` removed; `ChatHeaderVM` += `counterparty`
- `getChatThread` binds `header.counterparty` per viewer role + `header.specialty` (position→specialization→experienceLevel, undefined for a company); presence stays «был(-а) недавно»
- `ConversationItemVM` += `status`; `ConversationItem` renders the gig status badge; `getConversations` derives it via `gigDisplayStatus`
- every messaging flow preserved (select, send, search, participant-only auth); F2 + F5 lints green
- `build` (`/chats`) + `test:unit` (930) + `compose-chats` E2E (4/4) green; F1 = structural vs the prototype `chats` frame (≤1% deferred to Phase 4)
- Reconciliation decisions recorded (§10.15 / RC-S22–S24)

### Requirement: Company Applications Screen at /gigs/[id]/applications
The application MUST provide a company **«Отклики»** screen at `/gigs/[id]/applications`, a composition-pure
`@composed-screen` inside `AppShell`, available **only to the gig owner**. A non-owner (specialist, other company, or
unauthenticated) MUST be redirected to `/gigs/[id]` (or `/login`). The screen MUST render a «← Назад к проекту» link to
`/gigs/[id]`, a `SectionHeader` «Отклики» with the applicant count and the subtitle «на проект «{gig.title}»», the
`ApplicantCard` list, and an empty state when there are no applicants. It MUST be token-pure (F2) and composition-pure
(F5); all on-screen text MUST be Russian.

#### Scenario: The owner sees the gig-scoped applicants list
- GIVEN a CLIENT who owns a gig with applications
- WHEN they open `/gigs/[id]/applications`
- THEN the screen MUST show «Отклики» + the count + «на проект «{gig.title}»», a «← Назад к проекту» link, and an
  `ApplicantCard` per applicant
- AND the screen MUST contain no `className=`/`style=`/hex literals (F5)

#### Scenario: Non-owners are redirected
- GIVEN a specialist, a non-owner company, or an unauthenticated visitor
- WHEN they request `/gigs/[id]/applications`
- THEN they MUST be redirected away (`/gigs/[id]` or `/login`) and MUST NOT see the applicants

#### Scenario: Empty state
- GIVEN an owned gig with no applications
- WHEN the owner opens the screen
- THEN it MUST render an empty state (no applicant cards)

### Requirement: ApplicantCard Block
A new `ApplicantCard` block (+ `ApplicantCardVM`) MUST render the prototype applicant card: an identity row (avatar +
name + level + ★ rating) with a status pill, the tech tags, and the **Подход** / **Уточняющие вопросы** / **Оценка
трудозатрат** sections. It MUST expose an actions slot (children) that the screen fills with the inline Принять/Отклонить
forms (the server-action wiring stays in the screen). The block MUST be token-pure and presentational (no server-action
imports).

#### Scenario: ApplicantCard renders identity + the three sections + an actions slot
- GIVEN an `ApplicantCardVM` (name, level, rating, tags, approach/questions/estimate, status) with action children
- WHEN it renders
- THEN it MUST show the identity row + status pill, the tags, the Подход/Уточняющие вопросы/Оценка трудозатрат sections,
  and the provided actions
- AND it MUST contain no `className=`/`style=`/hex literals beyond its kit primitives

### Requirement: Accept/Reject on the Applications Screen (Lifecycle Reused)
For a **pending** applicant the screen MUST render **Принять** and **Отклонить** wired to the existing
`acceptApplication` / `rejectApplication` actions — reused verbatim. Accept MUST assign the specialist, transition the
gig `OPEN → IN_PROGRESS`, and auto-reject the other PENDING applications (with the existing notifications). When the gig
is assigned, the screen MUST render the derived success notice «Назначен {name} — гиг переходит «В работу». Остальные
отклики отклонены автоматически.».

#### Scenario: Accept assigns and auto-rejects others
- GIVEN an owner viewing two pending applicants
- WHEN they Принять one
- THEN that application MUST become ACCEPTED, the gig MUST become `IN_PROGRESS` with the specialist assigned, and the
  other PENDING application(s) MUST become REJECTED
- AND on revisiting the screen the «Назначен {name} …» success notice MUST be shown

#### Scenario: Reject rejects one applicant
- GIVEN an owner viewing a pending applicant
- WHEN they Отклонить
- THEN that application MUST become REJECTED and the gig MUST remain OPEN

### Requirement: Gig-Detail Owner Affordance Becomes the Applications Link
The gig-detail screen MUST replace its inline owner applicant list with the prototype **«Смотреть отклики (N)»** link to
`/gigs/[id]/applications` (owner only). Gig-detail MUST NOT render the inline `ApplicationEntry` owner list anymore; every
other gig-detail flow (apply/withdraw, lifecycle, messaging, dispute) is unchanged. `getGigApplications(gigId, viewer)`
MUST be owner-gated (null/redirect for non-owners), returning the gig title, count, assigned state, and the applicants as
`ApplicantCardVM[]`, reusing the existing applicant assembly.

#### Scenario: gig-detail links to the applications screen
- GIVEN the gig owner on `/gigs/[id]`
- WHEN it renders
- THEN it MUST show «Смотреть отклики (N)» linking to `/gigs/[id]/applications` and MUST NOT render the inline applicant
  list

#### Scenario: getGigApplications is owner-gated
- GIVEN `getGigApplications(gigId, viewer)`
- WHEN the viewer owns the gig, it MUST return the title, count, assigned state, and applicant cards
- AND WHEN the viewer does not own the gig, it MUST return null (the page redirects)

**Acceptance Criteria:**
- `/gigs/[id]/applications` (owner-only; non-owner redirected): «← Назад к проекту» + «Отклики» + count + «на проект «{title}»» + ApplicantCard list + empty state; F5-pure
- new `ApplicantCard` block + `ApplicantCardVM` (identity + status + tags + Подход/Уточняющие вопросы/Оценка трудозатрат + actions slot); fixture + render test
- accept/reject reused verbatim (accept → assign + `IN_PROGRESS` + auto-reject others + notify); derived «Назначен …» success notice
- gig-detail replaces the inline owner list with «Смотреть отклики (N)» → the screen; `getGigApplications(gigId, viewer)` owner-gated
- F2 + F5 lints green; `build` + `test:unit` + `build-applications-screen` E2E green; F1 = structural vs the prototype `applications` frame (≤1% deferred to Phase 4)
- Reconciliation decisions recorded (§10.17 / RC-S28–S30)

### Requirement: Gig Creation Screen Is the Guided Brief
The `/gigs/new` screen MUST be a composition-pure `@composed-screen` inside `AppShell` (CLIENT-only), reconciled to the
prototype `createGig` as a two-column layout: a left Definition-of-Done form and a right feedback panel. The left form
MUST present four sections — **«Что нужно сделать?»** (title + a category selector + description), **«Как поймём, что
готово?»** (цель + ожидаемый результат + a «Готово, когда…» criteria editor), **«Что важно учесть?»** (constraints +
tags), **«Условия»** (budget ₽ + срок) — all controlled, submitting via the existing `createGig`. The screen MUST be
token-pure (F2) and composition-pure (F5); all on-screen text MUST be Russian.

#### Scenario: The guided-brief form renders and submits
- GIVEN a CLIENT on `/gigs/new`
- WHEN it renders
- THEN it MUST show the four DoD sections and the right feedback panel
- AND filling the required fields + publishing MUST call `createGig` (which creates the gig with the 17.5% fee)
- AND the screen MUST contain no `className=`/`style=`/hex literals (F5)

### Requirement: Gig Creation Redirects to a Success Screen
On a successful create, `createGig` MUST redirect to a dedicated success screen at `/gigs/new/success` (changed from
`/dashboard`), which MUST render a «Гиг опубликован» confirmation card with **«К моим гигам»** (→ `/my-gigs`) and
**«Создать ещё»** (→ `/gigs/new`). The validation + fee math are unchanged.

#### Scenario: Publishing shows the success screen
- GIVEN a valid gig submitted from `/gigs/new`
- WHEN `createGig` succeeds
- THEN it MUST redirect to `/gigs/new/success`, which MUST show «Гиг опубликован» + «К моим гигам» + «Создать ещё»

### Requirement: Readiness Meter
The right panel MUST render a **«Готовность брифа»** readiness meter: a `ProgressBar` showing the share of completed
checks, colour-coded (≥6 of 7 green / ≥4 brand / else amber), over a **7-point checklist** — Название, Категория,
Описание (≥20 chars), Цель, Ожидаемый результат, Критерии приёмки (≥1), Бюджет и срок — each shown done (✓) or not (○),
plus a nudge for the first unmet check. It MUST update **live**; it is advisory (`createGig` remains the gate).

#### Scenario: The meter advances as fields are filled
- GIVEN the create-gig screen
- WHEN the user fills the title, category, a ≥20-char description, цель, результат, ≥1 criterion, and budget + срок
- THEN the readiness meter MUST advance toward 7/7 and each corresponding checklist item MUST flip to done

### Requirement: Live Fee Panel
The right panel MUST render a **«Сводка (комиссия)»** fee panel showing **Бюджет**, **Сервисный сбор (17,5%)**, and
**Итого к оплате** (budget + 17.5%), computed **live** from the budget input using the same rate the server applies
(`SERVICE_FEE_RATE = 0.175`), plus the «Опубликовать гиг» action.

#### Scenario: The fee updates live and matches the server
- GIVEN a budget entered in roubles
- WHEN it changes
- THEN the panel MUST show Сервисный сбор = `floor(budget × 0.175)` and Итого = budget + fee
- AND the percent label MUST read «17,5%», sourced from `SERVICE_FEE_PCT_LABEL`
- AND on publish the created gig's `serviceFee` / `totalAmount` MUST equal those figures

### Requirement: «Готово, когда…» Criteria Editor
The DoD section MUST provide a `CriteriaEditor` to build the acceptance criteria: an input + «Добавить», suggestion pills,
and removable criterion rows. The collected criteria MUST be submitted as the gig's `acceptanceCriteria` (the server's
existing ≥50-char floor still applies).

#### Scenario: Criteria are added, removed, and submitted
- GIVEN the criteria editor
- WHEN the user adds criteria (typing or via a suggestion) and removes one
- THEN the list MUST update, and publishing MUST submit the joined criteria as `acceptanceCriteria`

### Requirement: Create-Gig Blocks Render
The new `ReadinessMeter`, `FeePanel`, and `CriteriaEditor` blocks MUST render from fixtures (token-pure; `ReadinessMeter`
reuses `ProgressBar` with its new `tone` prop; `CriteriaEditor` exposes add/remove callbacks).

#### Scenario: The three blocks render from fixtures
- GIVEN the block fixtures
- WHEN each renders
- THEN `ReadinessMeter` MUST show the bar + the checklist, `FeePanel` MUST show Бюджет/Сервисный сбор (17,5%)/Итого, and
  `CriteriaEditor` MUST show the input + «Добавить» + the rows
- AND none MUST contain `className=`/`style=`/hex literals beyond their kit primitives

**Acceptance Criteria:**
- `/gigs/new` rebuilt as a two-column F5 `@composed-screen`: DoD form (4 sections, category via `CheckField`, `CriteriaEditor`) + readiness meter + live fee panel
- `ReadinessMeter` (ProgressBar + 7-check checklist + nudge), `FeePanel` (Бюджет/Сервисный сбор 17,5%/Итого + publish), `CriteriaEditor` (input + «Добавить» + suggestions + removable rows) — new blocks + fixtures + render tests; `ProgressBar` gains a `tone` prop
- live fee mirrors the server's 17.5% (`SERVICE_FEE_RATE`); validation + fee math reused unchanged
- `createGig` success redirect `/dashboard` → `/gigs/new/success` (only action change); success screen «Гиг опубликован» + «К моим гигам»/«Создать ещё»
- the createGig redirect-asserting test files updated to the new target (validation + fee assertions kept); F2 + F5 lints + `build` + `test:unit` + `compose-create-gig` E2E green; F1 = structural (≤1% Phase 4)
- Reconciliation decisions recorded (§10.19 / RC-S34–S36)

### Requirement: Admin Dashboard Shows Stats, Dispute Queue, and Moderation Log
The admin dashboard (`/admin`, ADMIN-only) MUST remain a composition-pure `@composed-screen` and MUST render: the
platform **stats** (`StatPanel`: users / gigs / suspended / closed), a **«Споры на модерации»** queue of OPEN disputes
(via `DisputeList`, with a count; each row linking to `/disputes/[id]` to resolve), a **«Журнал модерации»** of recent
`ModerationLog` entries (via `DataTable`: Действие / Кто / Когда), and the links to the «Пользователи» and «Гиги»
moderation pages. `getAdminDashboard()` MUST return the stats + the OPEN dispute list + the recent log rows. The
paginated `/admin/users` and `/admin/gigs` pages are unchanged. The screen MUST be token-pure (F2) and
composition-pure (F5); all on-screen text Russian.

#### Scenario: The dashboard renders the queue and the log
- GIVEN an ADMIN on `/admin` with OPEN disputes and prior moderation actions
- WHEN it renders
- THEN it MUST show the stats cards, a «Споры на модерации» list of the OPEN disputes (each linking to its dispute), and
  a «Журнал модерации» list of the recent moderation-log entries (action + actor + time)
- AND the «Пользователи» / «Гиги» links MUST remain; the screen MUST contain no `className=`/`style=`/hex literals (F5)

#### Scenario: The dispute queue links to the resolve panel
- GIVEN an OPEN dispute in the queue
- WHEN the admin opens it
- THEN it MUST navigate to `/disputes/[id]` (the admin verdict resolve panel)

#### Scenario: getAdminDashboard returns stats + disputes + log
- GIVEN `getAdminDashboard()`
- THEN it MUST return the four stat tiles, the OPEN dispute list, and the recent `ModerationLog` rows (action label +
  actor + time)

**Acceptance Criteria:**
- `/admin` renders stats + «Споры на модерации» (OPEN `DisputeList`, count, → `/disputes/[id]`) + «Журнал модерации» (`DataTable`) + the «Пользователи»/«Гиги» links; F5-pure
- `getAdminDashboard()` returns stats + open disputes + recent log; reuses `DisputeList`/`DataTable`/`StatPanel` (no new blocks); moderation actions + the paginated users/gigs pages unchanged
- F2 + F5 lints + `build` + `test:unit` + `compose-admin-dashboard` E2E green; F1 = structural vs the prototype admin frame (≤1% Phase 4)
- Reconciliation decisions recorded (§10.20 / RC-S38)

### Requirement: Onboarding Wizard Reconciled to the Prototype
**SUPERSEDED (reground-auth-to-design, 2026-06-24).** This requirement reconciled the kit `RegisterWizard` to the older
`Онбординг.dc.html` (which lacked a login screen). It is replaced by the full `Auth.dc.html` reground — see "AuthDesign
Screen (login + onboarding)" above. The footer legal links, step-3 consent disclaimer «Нажимая «Продолжить»…», and the
«Продолжить» CTA are preserved by `AuthDesign`; the role-specific field set is collected at step 3 and persisted via
`updateProfile` (two-phase), not by `registerUser`.

### Requirement: AuthFooter Block
A new `AuthFooter` block MUST render the three onboarding legal links — «Политика конфиденциальности», «Условия
пользования», «Помощь» — token-pure, suitable for the `AuthLayout` footer slot.

#### Scenario: AuthFooter renders the legal links
- GIVEN the `AuthFooter` block
- WHEN it renders
- THEN it MUST show the three links and contain no `className=`/`style=`/hex literals beyond its kit primitives

**Acceptance Criteria:**
- `/register` reconciled to `Онбординг.dc.html`: footer legal links (via `AuthLayout.footer`) + step-3 consent disclaimer + «Продолжить» CTA; flow/headings/step-dots/role-awareness kept
- new `AuthFooter` block + render test; richer schema-backed field sets kept (owner-confirmed; no `registerUser`/schema change)
- F2 + F5 lints + `build` + `test:unit` + `compose-onboarding` E2E green; the existing register E2E kept green; F1 = structural vs the prototype onboarding frame (≤1% Phase 4)
- Reconciliation decisions recorded (§10.21 / RC-S39–S40)

### Requirement: Human F1 Reference Re-Baselined to the Prototype
The workbench registry `reference` baselines MUST point at the `gigly_full_design` prototype imagery
(`…/reference-renders/prototype/*` derived from the prototype `screenshots/`) as the **human** F1 overlay/calibration
reference (replacing the stale interim lossy JPGs). The registry coverage test MUST keep asserting that every
`reference` exists. The prototype imagery is NOT the automated pixel target (that is the golden set).

#### Scenario: References resolve to the prototype imagery and exist
- GIVEN the registry catalog
- THEN every entry's `reference` MUST resolve to a prototype-derived image that exists on disk, and the coverage test
  MUST pass

### Requirement: Generativity Re-Proven in Both Themes
`validate-generativity` MUST pass over the `GenerativityProbe` + the admin screens + the expanded kit — asserting **zero
off-system values** (composition-purity + token-purity). Because the probe/admin are token-driven (F2), the proof MUST
hold in **both** themes, verified by the probe golden in light AND dark.

#### Scenario: Admin generativity = zero off-system values in both themes
- GIVEN `validate-generativity` over the probe + admin screens
- THEN composition-purity + token-purity MUST pass (zero off-system values), and the probe MUST render cleanly in both
  dark and light (captured as goldens)

**Acceptance Criteria:**
- `npm run test:fidelity` gates every workbench surface in dark + light at 1440px at ≤1% vs committed goldens (via `fidelity-diff.js`), emitting diff/side-by-side/overlay-50; `test:fidelity:update` (re)writes goldens; goldens env-pinned
- known-good control passes; the injected 4px offset fails (`--selfcheck`); a planted off-token literal fails `lint:tokens`
- registry `reference` re-baselined to the prototype imagery (human overlay reference); coverage test green
- `validate-generativity` = zero off-system values; the probe holds in both themes
- the §10.x ≤1%-deferral notes flipped to "gate live"; Phase-4 planning item checked; F1 is the standing visual-regression gate (no longer structural-only)
- Reconciliation decisions recorded (§10.22 / RC-S41–S43)

---

## Design Reference Capture

> Added by change `transport-capture-pipeline` (archived 2026-06-25). The committed, reproducible capture of the `gigly_full_design/` prototype that serves as the canonical "transport source" for the design-transport initiative (`openspec/planning/transport-design-from-prototype.md`). Produced by `npm run capture:design` → `design-reference/screens/` + `design-reference/STATE-MATRIX.md`.

### Requirement: Reproducible Design Reference Capture
The repo MUST provide a committed, reproducible capture of the `gigly_full_design/` prototype's rendered screens, to serve as the canonical "transport source" for the design-transport initiative. The capture MUST be regenerable by a single command and MUST NOT require manual browser steps.

#### Scenario: A single command regenerates the full reference set
- **GIVEN** a clean checkout with dependencies installed
- **WHEN** a developer runs `npm run capture:design`
- **THEN** a Node script MUST serve `gigly_full_design/` over a local static HTTP server
- **AND** drive Playwright chromium at a 1512px viewport width
- **AND** navigate each captured state via `window.__giglyGo(...)`
- **AND** write, for every captured state, a fully-resolved page HTML file and a reference PNG into `design-reference/screens/`
- **AND** complete with **zero page errors** (no `pageerror`, no failed resource loads for prototype assets)

#### Scenario: Resolved HTML contains no unresolved template artifacts
- **GIVEN** a captured HTML file under `design-reference/screens/`
- **WHEN** its contents are inspected
- **THEN** it MUST contain the fully-expanded DOM (real markup from the component bundle)
- **AND** it MUST NOT contain unresolved `{{ }}` interpolations, `<x-import …>` tags, or `<sc-if>` / `<sc-for>` directives

### Requirement: Complete State Coverage
The capture MUST cover not only each screen's entry state but every distinct visual state it renders, so that transport never has to reconstruct an un-captured state by eye.

#### Scenario: All role-valid route entry states are captured
- **GIVEN** the prototype's 13 routes, scoped by role (e.g. `createGig`/`applications` company-only, `disputeResolve` admin-only)
- **WHEN** the capture runs
- **THEN** all **19 role-valid route-states** MUST be captured as HTML+PNG pairs

#### Scenario: Variant states are captured
- **GIVEN** screens that render multiple states from the same route
- **WHEN** the capture runs
- **THEN** it MUST capture `gigDetail` for each role × gig status (open, in_progress, review, completed, paid, rejected)
- **AND** `my-gigs` for each status tab plus its empty and loading states
- **AND** `search` for results, empty, filtered, and loading states
- **AND** both role variants of every dual-role screen
- **AND** any state not reachable via `__giglyGo` MUST be recorded in the state matrix as "capture-by-interaction" with the interaction needed

#### Scenario: Overlays are captured as their own states
- **GIVEN** the prototype's overlays
- **WHEN** the capture runs
- **THEN** it MUST capture the profile-edit modals (`bio`, `cats`, `stack`), the notifications dropdown, a success toast, and a destructive-confirmation dialog
- **AND** it MUST NOT capture the settings modal (out of scope this round)
- **AND** it MUST NOT capture `Auth.dc.html` screens (captured by the auth change)

### Requirement: Documented State → Trigger Matrix
The capture MUST be accompanied by a committed document mapping every captured state to the exact trigger that produces it, so the set is auditable and extensible.

#### Scenario: Each captured state has a documented trigger
- **GIVEN** `design-reference/STATE-MATRIX.md`
- **WHEN** it is reviewed against the captured output
- **THEN** every captured state MUST appear with its `__giglyGo` parameters (or its capture-by-interaction note)
- **AND** every entry in the matrix MUST correspond to a produced HTML+PNG pair (no orphans in either direction)

---

## Shared Design Shell

> Added by change `transport-shared-shell` (archived 2026-06-25). The single shared chrome (sidebar + header) transported from the prototype into `app/_design/AppShellDesign.tsx`, wrapping every authenticated screen. Supersedes the pre-redesign token-based navigation-header requirements above for the authenticated app shell.

### Requirement: Shared Design Shell Wraps All Protected Routes
A single shared shell component (`app/_design/AppShellDesign.tsx`) MUST provide the sidebar + header chrome for every authenticated screen, transported from the prototype, so screens render only their own content inside a consistent frame.

#### Scenario: Protected and admin layouts render inside the shell
- **GIVEN** the protected layout (`app/(protected)/layout.tsx`) and the admin layout (`app/admin/layout.tsx`)
- **WHEN** any authenticated route renders
- **THEN** its content MUST be rendered as `children` of `AppShellDesign`
- **AND** no route may render its own sidebar/header chrome separately

#### Scenario: No competing shell renders for authenticated routes
- **GIVEN** the authenticated route tree
- **WHEN** a route renders
- **THEN** the legacy shell components (`AppShell`, `SidebarNavLive`, `TopbarLive`, `MainNav`) MUST NOT be in its render path

### Requirement: Sidebar Reconciled To Captured Reference
The sidebar MUST match the prototype's sidebar as captured in `design-reference/screens/`, with static copy transported verbatim.

#### Scenario: Sidebar structure and content
- **GIVEN** the rendered sidebar
- **WHEN** compared to the captured reference (e.g. `design-reference/screens/dashboard.specialist.png`)
- **THEN** it MUST contain, in order: the GIGLY wordmark, the profile card (avatar + name + role sub-label + notifications bell with unread badge + settings gear), the nav list, the support/help card, and the logout control
- **AND** the support/help card MUST use the prototype's verbatim copy — the «Поддержка» heading, the welcome body text, and the «Что случилось?» control (not a paraphrase)
- **AND** the active nav item MUST show the accent active-bar and accent label/icon treatment

#### Scenario: No role switcher is shown
- **GIVEN** a specialist, a company, or an admin session
- **WHEN** the sidebar renders
- **THEN** it MUST NOT show the prototype's three-segment role framing (Специалист / Компания / Админ) — that demo affordance is removed (see «The app shell MUST NOT present a role switcher…» below)
- **AND** the user's role MUST be communicated only by the profile card's role sub-label and the role-appropriate nav

### Requirement: The app shell MUST NOT present a role switcher or role-selector affordance

> Merged from change `remove-role-switcher-panel` (archived 2026-07-14). Supersedes the prototype's «all three segments» role-framing mandate above: the panel was a non-interactive demo artifact transported verbatim from the prototype and is removed. A user's role is fixed by their account; the shell communicates it only through the profile card's role sub-label (`profile.sub`) and the role-appropriate navigation. Deletion changes no behavior (the panel had no click handler).

The authenticated app shell (`app/_design/AppShellDesign.tsx`) MUST NOT render any control that lists the platform roles («Специалист» / «Компания» / «Админ») as selectable or role-preview segments.

#### Scenario: Specialist sees no role switcher
- **GIVEN** an authenticated user whose account role is `SPECIALIST`
- **WHEN** the app shell sidebar renders on any protected route
- **THEN** there MUST be no panel or control listing «Специалист / Компания / Админ» as segments
- **AND** the profile card MUST still show the avatar, name, role label, notification bell, and settings gear
- **AND** the specialist's navigation items and the derived page title MUST render and navigate correctly

#### Scenario: Client sees no role switcher
- **GIVEN** an authenticated user whose account role is `CLIENT`
- **WHEN** the app shell sidebar renders on any protected route
- **THEN** there MUST be no «Специалист / Компания / Админ» segment panel
- **AND** the profile card (avatar, name, role label, bell, gear) MUST remain intact
- **AND** the client's navigation items and page titles MUST be unaffected

#### Scenario: Admin sees no role switcher
- **GIVEN** an authenticated admin viewing the admin shell (`admin = true`)
- **WHEN** the app shell sidebar renders
- **THEN** there MUST be no «Специалист / Компания / Админ» segment panel
- **AND** the admin navigation (`buildAdminNav`) and admin page titles MUST render correctly

#### Scenario: No dead role-preview state remains
- **GIVEN** the app shell source after this change
- **WHEN** the repository is grepped under `app/`
- **THEN** there MUST be no `roleSegs`, no role-preview `activeRole` derivation feeding a switcher, and no three-role segment map
- **AND** the shell MUST compile and render for all three roles with no new console errors or warnings

### Requirement: Header Reconciled To Captured Reference
The header MUST match the prototype's header, with the page title derived per-route.

#### Scenario: Header title and controls
- **GIVEN** any authenticated route
- **WHEN** the header renders
- **THEN** it MUST show the accent vertical bar + the route's uppercase Handjet page title (matching the prototype's per-route titles)
- **AND** the top-right control MUST match the captured reference
- **AND** the search bar MUST appear only on the screens the prototype shows it on, with the prototype's verbatim placeholder text

### Requirement: Shell Wiring Preserved

> Extended by change `shell-nav-support-fixes` (archived 2026-07-14): four shell chrome controls that were transported from the prototype but never wired — the collapse chevron, the GIGLY wordmark, the notifications dropdown anchoring, and the «Что случилось?» support control — are now real, working controls. The requirement now also forbids no-op chrome (`cursor: pointer` without a handler, or a button without an action). See the four dedicated requirements below.

Reconciling the shell's markup MUST NOT break its existing behavior, and every shell chrome control MUST be wired to a real action (no inert controls).

#### Scenario: Interactive elements remain wired
- **GIVEN** the reconciled shell
- **WHEN** a user interacts with it
- **THEN** nav items MUST route via the existing nav builder + active-marking over `usePathname`
- **AND** the notifications bell MUST open the live notifications dropdown
- **AND** the settings gear MUST navigate to the existing `/settings` page (which is NOT restyled by this change)
- **AND** the logout control MUST invoke the existing `logoutUser` action
- **AND** the theme control MUST toggle the existing light/dark theme

#### Scenario: Previously-inert chrome controls are now wired
- **GIVEN** the reconciled shell
- **WHEN** a user interacts with the sidebar chrome
- **THEN** the collapse chevron MUST toggle (and persist) the sidebar collapsed/expanded state
- **AND** the GIGLY wordmark MUST navigate to the role-appropriate home (`/dashboard`, or `/admin` in the admin shell)
- **AND** the «Что случилось?» support control MUST navigate to the `/help` support page
- **AND** no shell chrome control may be a no-op (`cursor: pointer` without a handler, or a button without an action)

### Requirement: Sidebar Collapse Toggle Is Wired And Persisted

> Added by change `shell-nav-support-fixes` (archived 2026-07-14). Спец #7: the sidebar collapse chevron «« rendered with `cursor: pointer` but had no handler — a dead control. It is now a real `<button>` that collapses/expands the sidebar and persists the choice.

The sidebar collapse chevron in the app shell (`app/_design/AppShellDesign.tsx`) MUST collapse and expand the sidebar when activated, and MUST persist the chosen state across reloads. The chevron MUST NOT be a dead control.

#### Scenario: Chevron collapses the sidebar
- **GIVEN** an authenticated user on any protected route with the sidebar in its default (expanded) state
- **WHEN** they click the collapse chevron in the sidebar header
- **THEN** the sidebar MUST narrow to an icon-only rail (nav labels, counts, profile name/sub-label, and support-card body copy are hidden; nav icons remain)
- **AND** the chevron glyph MUST flip to indicate the inverse (expand) action
- **AND** the main content area MUST reflow to use the reclaimed width without clipping

#### Scenario: Chevron expands a collapsed sidebar
- **GIVEN** the sidebar is collapsed
- **WHEN** the user clicks the chevron again
- **THEN** the sidebar MUST return to its full width with labels, counts, profile text, and the support card restored to the captured design

#### Scenario: Collapsed state persists across reload
- **GIVEN** the user has collapsed (or expanded) the sidebar
- **WHEN** they reload the page or navigate to another protected route
- **THEN** the sidebar MUST render in the last-chosen state, read from `localStorage` (`gigly.sidebar.collapsed`)
- **AND** a first-time user (no stored value) MUST see the expanded default

#### Scenario: Chevron is keyboard-operable
- **GIVEN** the collapse control
- **WHEN** a keyboard user tabs to it and presses Enter/Space
- **THEN** it MUST toggle the sidebar (it is a real `<button>` with an accessible label), not an inert `<div>`

### Requirement: GIGLY Wordmark Navigates To Role-Appropriate Home

> Added by change `shell-nav-support-fixes` (archived 2026-07-14). Спец #14: the GIGLY wordmark was a plain `<div>`; it is now an actionable link to the user's home screen.

The GIGLY wordmark in the sidebar header MUST be an actionable link to the user's home screen, with the captured wordmark typography preserved.

#### Scenario: Wordmark links home for CLIENT/SPECIALIST
- **GIVEN** an authenticated CLIENT or SPECIALIST on any protected route
- **WHEN** they click the GIGLY wordmark
- **THEN** they MUST navigate to `/dashboard`
- **AND** the wordmark MUST retain its Handjet 30px, letter-spacing-2 styling from the captured reference

#### Scenario: Wordmark links to admin home for admin shell
- **GIVEN** the admin shell is rendered (`admin === true`)
- **WHEN** the admin clicks the GIGLY wordmark
- **THEN** they MUST navigate to `/admin`

#### Scenario: Wordmark is a real link
- **GIVEN** the rendered wordmark
- **WHEN** inspected
- **THEN** it MUST be a `next/link` anchor (keyboard-focusable, middle-click/open-in-new-tab capable), not a plain `<div>`

### Requirement: Notification Dropdown Anchors Within The Viewport On Desktop

> Added by change `shell-nav-support-fixes` (archived 2026-07-14). Спец #13: the dropdown used `absolute right-0` and, because the bell sits in the left sidebar, a 320px panel was pushed off the left edge of the viewport. It now opens toward the content area, on-screen.

The notifications dropdown (`app/components/NotificationDropdown.tsx`) MUST open attached to the notification bell and remain fully visible within the viewport on desktop widths. Because the bell sits in the left-hand sidebar, the panel MUST NOT overflow the left, right, or bottom viewport edge.

#### Scenario: Dropdown opens on-screen from the sidebar bell
- **GIVEN** an authenticated user on a desktop viewport (≥1024 px) with the bell in the sidebar profile card
- **WHEN** they open the notifications dropdown
- **THEN** the panel MUST be anchored to the bell and open toward the content area (not off the left edge)
- **AND** the panel's left and right edges MUST lie within the viewport (no horizontal clipping)
- **AND** the panel MUST NOT be clipped by the bottom of the viewport (it scrolls internally within its existing max height)

#### Scenario: Dropdown content and behavior are unchanged
- **GIVEN** the repositioned dropdown
- **WHEN** it renders
- **THEN** its content (title, notification list, per-type accent borders, empty/loading/error states), its click-outside and Escape-to-close behavior, and its mark-as-read-on-visit behavior MUST be identical to before — only its on-screen position changes

### Requirement: Support Widget Performs A Real Action

> Added by change `shell-nav-support-fixes` (archived 2026-07-14). Спец #2: the «Что случилось?» control had no handler; it now navigates to the in-app `/help` support page (which carries the `mailto:a.pisotskiy@gmail.com` contact and FAQ).

The «Поддержка / Что случилось?» control in the sidebar (`app/_design/AppShellDesign.tsx`) MUST perform a real, user-visible action leading to a working support destination. It MUST NOT be a dead control.

#### Scenario: Activating «Что случилось?» reaches support
- **GIVEN** an authenticated user on any protected route
- **WHEN** they activate the «Что случилось?» control
- **THEN** they MUST be taken to the in-app `/help` support page, which carries the `mailto:a.pisotskiy@gmail.com` contact and the FAQ
- **AND** the control MUST retain its captured visual styling (the «Поддержка» heading, welcome body copy, and the pill button with the send icon are unchanged)

#### Scenario: Control is keyboard-accessible and not inert
- **GIVEN** the support control
- **WHEN** a keyboard user focuses it and activates it
- **THEN** it MUST navigate to `/help` (it is a real link/actionable control with an accessible label), not a no-op button

---

## Dashboards, Browse & My-Gigs

> Added by change `transport-dashboards-search` (archived 2026-06-26). Reconciles the existing `DashboardDesign` (both roles), `GigSearchDesign` (`/gigs` browse), `MyGigsDesign` (`/my-gigs`), and the shared feed components (`GigCard`, `AttentionCardDesign`) to the captured reference. The prototype's route names cross-wire: the app's `/gigs` (browse) maps to the prototype's `search.*`; the app's `/my-gigs` maps to the prototype's `gigs.*`. The reconciliation was driven by the captured `design-reference/screens/` (not by eye). Verified: `build` + `lint` green, the affected E2E route specs **28 passed**, user eyeball across three rounds.

### Requirement: Shared Feed Components Reconciled To Reference
`app/_design/GigCard.tsx` and `app/_design/AttentionCardDesign.tsx` MUST match the gig cards and the «Требует внимания» strip as captured in `design-reference/screens/`, since they are shared across the dashboard, browse, my-gigs, profile, gig-detail, and applications screens.

#### Scenario: GigCard matches the reference in both modes
- **GIVEN** the rendered `GigCard`
- **WHEN** compared to the gig cards in `design-reference/screens/` (compact: `dashboard.specialist`; full: `search.specialist`)
- **THEN** the compact (feed) mode and the `full` mode (browse/my-gigs footer: Фикс. цена / Срок выполнения / «К проекту») MUST match — status dot/label, company+rating row (verify seal at 16px), tags, 2-line description clamp, and timeline/progress

#### Scenario: AttentionCard matches the reference
- **GIVEN** the rendered `AttentionCardDesign`
- **WHEN** compared to the attention strip in `dashboard.specialist`
- **THEN** the type-coloured bar + marker, the title/date row, and the embedded gig card MUST match, and the card MUST render its VM-supplied «К проекту» CTA
- **AND** reconciling the shared components MUST NOT visually regress their other consumers (profile / gig-detail / applications)

### Requirement: List-Screen Header Filter Cluster
The browse filter chips MUST live in the **shared shell header** (the prototype's `data-dc-tpl="51"` cluster), to the right of the search field, on every list screen that shows the search field (`/dashboard`, `/gigs`, `/my-gigs`) — NOT in the page body. This supersedes the page-body filter row. The set is Категория / Бюджет / Сортировка / Рейтинг (the prototype shows three; the working Рейтинг filter is kept as a sanctioned fourth chip, per product decision).

#### Scenario: Filter chips render in the header beside the search
- **GIVEN** any list screen with the header search field
- **WHEN** the header renders
- **THEN** the filter chips MUST appear in the header row to the right of the search field, each as the prototype's chip (funnel icon + label + «⌄»), implemented over a transparent native `<select>` so dropdown behaviour + accessibility are preserved
- **AND** a chip MUST tint its border accent when a non-default value is active

#### Scenario: Filters operate on the current screen (no redirect)
- **GIVEN** a list screen
- **WHEN** a filter chip value changes
- **THEN** it MUST refine the **current** route's query in place (no redirect to another screen) and reset pagination
- **AND** on `/gigs` the filters MUST drive the server query (full open-gig set)
- **AND** on `/dashboard` and `/my-gigs` the filters MUST narrow that screen's already-loaded feed **client-side** (category / budget range / minimum rating, plus budget sort), composing with the existing status-tab filtering — yielding results appropriate to each screen
- **AND** numeric budget filtering/sorting MUST read `GigCardVM.budgetValue` (roubles, populated by `toGigCardVM`); minimum-rating MUST read `rating.value`

### Requirement: Dashboard Reconciled To Reference
`DashboardDesign` MUST match `dashboard.specialist` (SPECIALIST) and `dashboard.company` (CLIENT), preserving the existing `DashboardVM` wiring.

#### Scenario: Dashboard regions match
- **GIVEN** a SPECIALIST or CLIENT session on `/dashboard`
- **WHEN** the page renders
- **THEN** it MUST match the reference for the welcome/onboarding tiles, the «Мои гиги» board (status tabs + gig feed), the right column (specialist «Найти новый гиг» search panel / client «Создайте первый гиг» create CTA), and the «Сообщения» panel; the SPECIALIST view additionally shows the «Требует внимания» strip, the CLIENT view does not
- **AND** the «Мои гиги» status tabs MUST use the reference treatment (active = subtle surface pill + hairline + accent count; inactive = transparent, no border)
- **AND** the «Сообщения» card MUST show the avatar+name row, the VM `unread` badge, a 3-line preview, and the time footer
- **AND** static copy (section headings, the «Создайте первый гиг» panel) MUST be the prototype's verbatim text

### Requirement: Browse (/gigs) Reconciled To Reference
`GigSearchDesign` MUST match the prototype's «ПОИСК ГИГОВ» (`search.specialist` / `search.company`): the «Найдено» count header, the 2-column grid of `full` GigCards, and the «Ничего не нашлось» empty state (with reset). The filters are in the shell header (above), so the body contains no filter row. The URL-param filter wiring + `PaginationControls` MUST be preserved.

#### Scenario: Browse results, filters, and empty state
- **GIVEN** the `/gigs` browse screen
- **WHEN** it renders with results
- **THEN** it MUST show the «Найдено» heading + count badge and the `full` GigCard grid; the header filters (category / budget / sort / rating) MUST narrow the results via the preserved URL params
- **AND** with no matches it MUST show the «Ничего не нашлось» empty state + reset

### Requirement: My-Gigs Reconciled To Reference
`MyGigsDesign` MUST match the prototype's «МОИ ГИГИ» (`gigs.specialist` all-tab + `myGigs.specialist.*` per-tab variants): the status tabs (Все / Заявки / В работе / На проверке / Завершённые), the feed of `full` GigCards, and the empty state.

#### Scenario: My-gigs tabs and feed
- **GIVEN** the `/my-gigs` screen
- **WHEN** it renders
- **THEN** the status tabs MUST use the same active/inactive treatment as the dashboard, and selecting a tab MUST filter the feed via the existing client-side tab state (composing with any active header filters)
- **AND** an empty tab MUST show the prototype's empty state

### Requirement: Dashboards/Browse/My-Gigs Reconciliation Keeps The Suite Green
The reconciliation MUST keep the build, lint, and the affected E2E route specs green, updating selectors only where the markup changed; no server-action changes, and `lib/view-models.ts` touched only for the additive `budgetValue` field (no data gap otherwise).

#### Scenario: Build, lint, and route E2E
- **GIVEN** the reconciled screens + shell header filters
- **WHEN** `npm run build`, `npm run lint`, and the route E2E specs (`compose-gig-search`, `compose-{client,specialist}-dashboard`, `compose-my-gigs`, `gig-pagination`, `gig-browse-access`) run
- **THEN** they MUST pass; the E2E selector updates MUST be limited to the changed markup (4 header comboboxes incl. Бюджет, the «По новизне»/«Сначала дороже» sort labels, the «Создайте первый гиг» heading)

---

## Gig Lifecycle

> Added by change `transport-gig-lifecycle` (archived 2026-06-26). Reconciles the existing gig-lifecycle screens (already built on the prototype's inline-styled markup + `tokens.css`) to the captured reference: `GigDetail.tsx` (NOT renamed), `CreateGigDesign.tsx`, `ApplicationsDesign.tsx`. All `app/actions/gig.ts` actions and the gig status machine are preserved; `lib/view-models.ts` untouched (no data gap). The screens were near-verbatim transports already, so the fixes were targeted. Verified: build + lint green; the directly-affected E2E specs (`compose-gig-detail-apply`, `compose-disputes`, `compose-create-gig`, `build-applications-screen`) **17 passed**. The create-gig **success** screen (`/gigs/new/success`) was deliberately LEFT OUT OF SCOPE (the prototype has no captured success screen — it confirms publish via a `toast.success`; the dedicated route stays on the kit vocabulary for a later cleanup).

### Requirement: Gig Detail Reconciled To Reference (All Role × Status States)
`app/(protected)/gigs/[id]/GigDetail.tsx` (this exact filename — NOT a `*Design` variant) MUST match the captured gig-detail reference for every role × status combination, preserving the `GigDetailData` wiring, the inline action blocks, and the `app/actions/gig.ts` actions.

#### Scenario: Each role × status state matches its captured reference
- **GIVEN** the rendered `GigDetail` for a given role and gig status
- **WHEN** compared to `design-reference/screens/gigDetail.{specialist,company}.<status>` (7 statuses per role: открыт / на рассмотрении / в работе / на проверке / завершён / оплачен / отклонён)
- **THEN** the two-column layout MUST match (col1 header/bio/criteria; col2 «УСЛОВИЯ» panel with Срок/Бюджет grotesk numerics, the owner-only fee breakdown, and the chat/action area), and the role × status action rail MUST present the correct affordances per status (SPECIALIST apply/applied/withdraw/submit; COMPANY view-applications/approve/return/mark-paid; terminal notices), wired to the existing actions

#### Scenario: Dispute link is gated to the live work window
- **GIVEN** an owner or assigned specialist viewing a non-example, assigned gig
- **WHEN** the action rail renders
- **THEN** the «Возникли разногласия? Открыть спор» link (→ `/disputes/new?gig=…`) MUST appear ONLY while the gig status is `IN_PROGRESS` or `REVIEW` (matching the prototype's `gigInProgress || gigReview`) — NOT on completed/paid (where "assigned" still holds but the reference shows no link)

### Requirement: Create Gig Reconciled To Reference
`app/(protected)/gigs/new/CreateGigDesign.tsx` MUST match `design-reference/screens/createGig.company`, preserving the `createGig` wiring, the 17.5% fee math (SSOT: `lib/pricing.ts`), and the stable `name=` field contract.

#### Scenario: Guided brief, readiness, and fee panels match
- **GIVEN** the `/gigs/new` create screen (CLIENT) and live edits
- **THEN** the guided-brief sections, the category chip select (inactive = neutral hairline border; active = `rgba(rgb,0.6)` border / `0.15` bg), and the criteria tag-editor MUST match; the criteria suggestions MUST be the prototype's real phrases (filtered-not-added, top-3) and an added criterion MUST render its raw text (the «Готово, когда…» lives only in the section label)
- **AND** the «Готовность брифа» panel MUST show the score as «{n} из 7», the checklist, the progress bar, and a next-step box reading bold «Добавьте: {Поле}» + that field's hint (complete-state «Бриф готов ✓» / «Бриф готов — отличные шансы на сильные отклики.»)
- **AND** the «Сводка» fee panel MUST compute Бюджет → Сервисный сбор (17,5%) → Итого live (`fee = floor(budget × 0.175)`), and publishing MUST call `createGig` and redirect to `/gigs/new/success`

### Requirement: Applications Reconciled To Reference
`app/(protected)/gigs/[id]/applications/ApplicationsDesign.tsx` MUST match `design-reference/screens/applications.company`, preserving the owner-gated `GigApplicationsData` wiring and the accept/reject actions.

#### Scenario: Applicant cards and accept/reject match and stay wired
- **GIVEN** the COMPANY owner on `/gigs/[id]/applications`
- **THEN** the back link, the «Отклики» header + count + «на проект «{title}»», and each applicant card (avatar + name + verify seal [16px] + level + rating + status + stack tags + Подход / Уточняющие вопросы / Оценка трудозатрат) MUST match the reference
- **AND** a PENDING applicant's status MUST read «Новый отклик» in the accent colour (overridden in the component, not the VM); accepted/rejected keep their tone colour
- **AND** «Принять» / «Отклонить» MUST render only for pending applicants while none is assigned, wired to `acceptApplication` (assigns + auto-rejects others) / `rejectApplication`; when assigned, the «Назначен …» banner shows and rejected cards dim

### Requirement: Gig Lifecycle Reconciliation Keeps The Suite Green
Reconciling these screens MUST keep the build, lint, and the affected E2E specs green; selectors/copy updated only where the markup changed; no server-action or VM changes.

#### Scenario: Build, lint, and lifecycle E2E
- **GIVEN** the reconciled gig-lifecycle screens
- **WHEN** `npm run build`, `npm run lint`, and the lifecycle E2E specs run
- **THEN** they MUST pass and the full lifecycle (create → apply → accept → submit → approve → mark-paid, plus withdraw / reject / return-for-revision) MUST work end-to-end
- **AND** the only E2E updates MUST be the intended copy changes (`compose-create-gig`: raw criterion text + the new suggestion phrase + «7 из 7»; `build-applications-screen`: «Новый отклик»)

> NOTE (capture gap): the `gigDetail.specialist.открыт-applied` reference is byte-identical to `…открыт` — the capture pipeline never toggled `applied`, so the specialist applied/awaiting UI has no captured ground truth and was left as-is (plausible, on-palette), pending a re-capture.

## Communication, Finance & Profile

> Added by change 5 (transport-chats-finance-profile, archived 2026-06-27). Reconciles `/chats`, `/finances`, and `/profile` to the captured prototype reference, and migrates profile editing from the standalone `/profile/edit` route into the prototype's on-screen modals (retiring the last kit/Tailwind route in this area). Token-NAME differences (raw CSS var vs app token) are not discrepancies — only visual value / structure / copy.

### Requirement: Chats Reconciled And Stays In /chats After Send
`app/(protected)/chats/ChatsDesign.tsx` MUST match `design-reference/screens/chats.{specialist,company}` for the dialog list and the active thread, and sending a message MUST keep the user on `/chats`. Sending MUST be **optimistic** (chat-realtime): with JS, the new message appears in the thread immediately (temporary id) without a page navigation, then persists and reconciles with the server echo (deduped by id). The legacy form-action path (`sendMessage` → `redirect(redirectTo)`) MUST remain as a no-JS progressive-enhancement fallback (landing on `/chats?gig=<id>`), and the gig-detail composer MUST still redirect to `/gigs/[id]`.

#### Scenario: Dialog list, search, and thread match
- **GIVEN** `/chats` with one or more conversations
- **THEN** the left pane MUST show «Сообщения» + count, the live client-side search, and per-conversation rows (counterparty / status / unread / subtitle / timestamp / 2-line preview) with the active row in the accent tint `rgba(0,136,255,0.08)`
- **AND** the active thread MUST show the counterparty header, day-separated bubbles with the outgoing/read ✓✓ treatment, and the composer (with the leading paperclip glyph), scrolling inside a bounded pane (short threads pinned to the bottom) so new messages do not grow the page
- **AND** typing in the search field MUST filter the list client-side, restoring the full list when cleared

#### Scenario: Optimistic send keeps the user in the conversation
- **WHEN** the user sends a message from `/chats` via Enter or the send button (JS enabled)
- **THEN** the new bubble MUST appear in the thread immediately with no page navigation, `sendMessage`/`sendMessageLive` MUST persist it, and the optimistic bubble MUST reconcile to the persisted message (no duplicate)
- **AND** with JS disabled, the form action MUST still persist and leave the user on `/chats?gig=<id>` with the new bubble shown
- **AND** sending from the gig-detail screen MUST still redirect to `/gigs/[id]` (the chats behaviour is opt-in via an additive same-origin `redirectTo`)

### Requirement: Finances Reconciled For Both Roles
`app/(protected)/finances/FinancesDesign.tsx` MUST match `design-reference/screens/finance.{specialist,company}` for the stat tiles and the «Операции» ledger (logical amounts only).

#### Scenario: Stat-tile captions and the awaiting-payment status
- **GIVEN** `/finances` for a SPECIALIST (earnings) or CLIENT (spend + fee)
- **THEN** each stat tile MUST render its third caption line (e.g. «комиссия Gigly 17,5%» / «выплачено по завершённым») via `StatVM.caption`
- **AND** a COMPLETED (work-done, payment-pending) ledger row MUST render the awaiting-payment green `rgb(52,199,89)` with the role-aware label «Ожидает оплаты» (specialist) / «К оплате» (client); a PAID row keeps «Оплачено»

### Requirement: Profile Reconciled For Both Roles
`app/(protected)/profile/ProfileDesign.tsx` MUST match `design-reference/screens/profile.{specialist,company}`.

#### Scenario: Specialist and company profile match
- **GIVEN** the `/profile` ID card
- **THEN** a SPECIALIST MUST show the name+roleTag pinned top / verified+since pinned bottom (space-between, NO name pencil), per-tag coloured stack chips (`rgba(rgb,0.12)`), and the Стек / Опыт / Избранные категории / Реализованные проекты blocks
- **AND** a CLIENT MUST show the name (with the requisites pencil), the role tag, the «about» paragraph (backed by the additive `ClientProfile.about`), and the Реквизиты (ИНН/КПП) panel

### Requirement: Profile Editing Is Modal-Based; /profile/edit Is Retired
Profile editing MUST occur via in-place modals opened from the profile pencils, persisting through the existing actions; there MUST be no standalone profile-edit screen.

#### Scenario: The four edit modals persist and don't clobber siblings
- **WHEN** the owner opens a modal and saves — bio («Редактировать описание») → `updateProfile`(bio); categories («Избранные категории») → `setFavoriteCategories`; stack («Редактировать стек», tag editor) → `updateProfile`(techStack); company («Редактировать реквизиты», design-vocab) → `updateProfile`(companyName/inn/kpp/about)
- **THEN** the value MUST persist and the modal MUST close in place (an additive `noRedirect` flag returns success so the modal refreshes client-side instead of navigating)
- **AND** each `updateProfile`-backed modal MUST carry the profile's other current fields as hidden inputs (from the owner-only `ProfileData.editFields` snapshot) so the role-branched upsert does not blank siblings

#### Scenario: The retired route redirects and pencils open modals
- **WHEN** a user navigates to `/profile/edit`
- **THEN** they MUST be redirected to `/profile`
- **AND** clicking any edit pencil on `/profile` MUST open the corresponding modal in place (no navigation); the old kit components (`ProfileEditForm` / `ProfileEditHeader`) are deleted and the in-app links (`ProfileCompletionCard`, the profile-not-set-up notice) point at `/profile`

> NOTE (documented narrowing): the captured modals cover bio / categories / stack (+ the new company requisites). `displayName` and `experienceLevel` are onboarding-time fields not exposed for post-onboarding UI editing — they are preserved through `updateProfile` but not editable. `setWorkExperience` (structured «Опыт» entries) has no captured modal and stays out of scope.

### Requirement: Communication/Finance/Profile Reconciliation Keeps The Suite Green
Reconciling these screens MUST keep the build, lint, and the affected E2E green; selectors/copy updated only where the markup or behaviour changed.

#### Scenario: Build and E2E
- **WHEN** `npm run build` and the `compose-chats` / `compose-finances` / `compose-profile` / `messaging-flow-e2e` / `loading-states` specs run
- **THEN** they MUST pass; the only E2E updates MUST be the intended behaviour changes (chats + messaging-flow assert stay-in-`/chats`; finances asserts the caption + awaiting-payment label; profile asserts the `/profile/edit` redirect + the bio/company modal round-trips + the «about» paragraph; loading-states asserts the bio modal's pending Save button)

## ADDED Requirements (transport-disputes — Phase 6 dispute flow)

> Added by change 6 (transport-disputes, archived 2026-06-27). Reconciles the four dispute screens (already built on the prototype's inline-styled markup + `tokens.css`) to the 7 captured reference states: `disputes.{specialist,company}`, `disputeNew.{specialist,company}`, `disputeDetail.{specialist,company}`, and `disputeResolve.admin`. The list and new-dispute screens already matched; the work was a targeted data-gap fix on the detail/resolve screens. The admin resolve face stays **folded into the single `/disputes/[id]` route** (no separate admin route) per the plan's decision — `DisputeDetailDesign` renders the «Решение модератора» panel only for an ADMIN on an OPEN dispute. All `app/actions/dispute.ts` semantics (`openDispute`, `resolveDispute` + the `specialist`/`company`/`split_50` verdict map) and the `Dispute` model are preserved. Verified: build (exit 0) + lint green, the dispute integration tests (`disputes-flow` + `disputes-vm`, **17 passed**) and the dispute E2E (`compose-disputes` + `reconcile-disputes-flow`, **8 passed**). The participant reply composer the prototype shows on the detail timeline is LEFT OUT OF SCOPE (no backend action exists to post a participant comment) — a parked, known gap.

### Requirement: Dispute Screens Reconciled To The Captured Reference
`app/(protected)/disputes/DisputesDesign.tsx`, `new/NewDisputeDesign.tsx`, and `DisputeDetailDesign.tsx` MUST match their captured references (`design-reference/screens/disputes.*`, `disputeNew.*`, `disputeDetail.*`, `disputeResolve.admin`), preserving the `page.tsx → VM → component` wiring. Static UI copy (headers, the moderator/frozen-funds notice, the reason chips, section labels) MUST be verbatim; only dynamic data MUST be bound.

#### Scenario: List and new-dispute match
- **GIVEN** `/disputes` (list) for a SPECIALIST or COMPANY
- **THEN** the «Споры» header + intro notice render verbatim and each row shows gig · reason · opener · status pill («Открыт»/«На рассмотрении»/«Решён») · amount, with the empty state when there are no disputes
- **AND** `/disputes/new` renders the «ОТКРЫТЬ СПОР» header, the warning banner, the six captured reason chips verbatim («Оплата не поступила», «Результат не соответствует ТЗ», «Заказчик не выходит на связь», «Исполнитель не выходит на связь», «Просрочен срок выполнения», «Другое»), the description field, and «Открыть спор» wired to `openDispute`

### Requirement: Dispute Detail Surfaces The Counterparty And Opener Role
The `/disputes/[id]` header (`DisputeDetailDesign`) MUST render, beside «Сумма по гигу», a «Контрагент» field bound to the viewer-relative counterparty, and MUST show the opener's **role** in the subtext. The counterparty is computed additively in `lib/disputes.ts#getDisputeDetail` (threaded the `viewer` through `lib/view-models.ts#getDispute`; `DisputeDetailVM.counterparty` is optional).

#### Scenario: Counterparty is viewer-relative
- **GIVEN** an authenticated viewer opens a dispute they may see
- **THEN** «Контрагент» MUST show the OTHER party — a SPECIALIST sees the client company; a CLIENT sees the assigned specialist; an ADMIN (or absent viewer) sees the client/заказчик (matching the prototype's resolve view)
- **AND** the header subtext MUST read «Причина: {reason} · открыл: {role}» where role is «Специалист»/«Заказчик» (falling back to the opener name)
- **AND** the «Ход рассмотрения» timeline (with moderator entries — the audit log) and the «Доказательства» evidence chips MUST render, with the resolution banner shown only when the dispute is resolved

### Requirement: Admin Resolve Face Folded Into The Detail Route
For an ADMIN viewing an OPEN dispute, `DisputeDetailDesign` MUST render the resolve face reconciled to `disputeResolve.admin`: the detail header + timeline (audit log) + the «Решение модератора» panel offering the three verdicts «В пользу специалиста», «В пользу заказчика», «Частичный возврат 50%», each submitting to `resolveDispute` with `specialist`/`company`/`split_50`. No separate admin resolve route MUST be created. The panel MUST be hidden for non-admins and for non-OPEN disputes.

#### Scenario: Admin resolves; participant sees read-only
- **WHEN** an ADMIN selects a verdict on an OPEN dispute
- **THEN** `resolveDispute` MUST transition the dispute to resolved, the resolution MUST carry the «В пользу …» prefix, and a moderator timeline entry MUST be appended
- **AND** a participant (non-admin) or any viewer of an already-resolved dispute MUST NOT see the «Решение модератора» panel

## ADDED Requirements (transport-admin-console — Phase 7 admin moderation surface)

> Added by change 7 (transport-admin-console, archived 2026-06-29). Reconciles the admin console (`AdminConsoleDesign`) to `design-reference/screens/dashboard.admin` (4 stat tiles + caption lines, the «Споры на модерации» queue, «Журнал модерации» log, «Пользователи» + «Гиги» lists), transports the captured `confirm.destructive` dialog (`app/_design/ConfirmDialog.tsx`) to gate block/close, and re-skins the kit `/admin/users` + `/admin/gigs` tables to the console's row vocabulary (keeping pagination + role/status filters). Additive VM gap closed: `AdminGigRow.client`. All `app/actions/moderation.ts` semantics and the `ModerationLog` / `User.suspended` / `Gig.closedByAdmin` model are unchanged. Follow-ups (same change): admins are routed to `/admin`; the admin shell renders on admin-reachable `(protected)` routes; a dedicated `/admin/disputes` screen (all statuses + filter); exclusive nav active-state; and disputes read «Решён» via `disputeLabel`. Verified: build exit 0; admin E2E **25** (`compose-admin-dashboard` + `admin-moderation` + `admin-pagination` + `admin-disputes`); `nav-active` + `admin-dashboard-vm` unit/integration **10**; dispute E2E **8**.

### Requirement: Admin Console, Confirm Dialog, And Tables Transported
`app/admin/AdminConsoleDesign.tsx` MUST match `dashboard.admin` (stat tiles with caption lines, queue, log, users, gigs). Destructive moderation (block/close) MUST be gated by the transported `confirm.destructive` dialog (centred modal · target-naming body · «Отмена» + red confirm) and fire only on confirm. `app/admin/users/AdminUsers.tsx` + `app/admin/gigs/AdminGigs.tsx` MUST drop the kit `@composed-screen`/`DataTable` markup for the console's row vocabulary while preserving offset pagination (30/pg) and the filters. Moderation actions and the data model MUST be unchanged.

#### Scenario: Console + confirm-gated moderation + paginated tables
- **GIVEN** an ADMIN on `/admin`
- **THEN** the four captioned stat tiles, queue («Рассмотреть» → `/disputes/[id]`), log, and users/gigs lists render; clicking «Заблокировать»/«Закрыть» opens the confirm dialog and the action fires only on confirm
- **AND** `/admin/users` and `/admin/gigs` render the transported rows with working role/status filters + pagination, over the unchanged `suspendUser`/`unsuspendUser`/`closeGig`

### Requirement: Admin Home, Shell, Disputes Screen, And Dispute Label
ADMINs MUST be routed to `/admin` (login + middleware), MUST see the admin shell on admin-reachable `(protected)` routes (e.g. `/disputes/[id]`), and MUST have exactly one active sidebar item (longest-path match). A dedicated `/admin/disputes` screen MUST list all disputes with a status filter and an entry-point-aware «Назад». Resolved disputes MUST read «Решён» (`disputeLabel`) everywhere.

#### Scenario: Admin reaches and navigates the moderation surface
- **WHEN** an ADMIN logs in, opens «Споры», and clicks a dispute
- **THEN** they land on `/admin`, the «Споры» screen lists every status (filterable), and the dispute detail shows the admin shell (not «Финансы»/«Компания») with «Назад к спорам» returning to `/admin/disputes`
- **AND** a resolved dispute's status pill reads «Решён»; only the current section is highlighted in the sidebar

### Requirement: Dispute Reconciliation Keeps The Suite Green
The reconciliation MUST keep the build and the dispute test suite green, with no changes to `openDispute`, `resolveDispute`, or the `Dispute` data model.

#### Scenario: Build and dispute tests
- **WHEN** `npm run build` and the `disputes-flow` / `disputes-vm` / `compose-disputes` / `reconcile-disputes-flow` specs run
- **THEN** they MUST pass (build exit 0; 17 integration + 8 E2E), with no selector changes needed beyond the additive «Контрагент» field

## ADDED Requirements (transport-auth — Phase 8 auth surface, final change)

> Added by change 8 (transport-auth, archived 2026-06-29) — the final change of the transport initiative (**8/8**). A reconcile + verification pass: the substance shipped earlier in `reground-auth-to-design` (archived), which built `app/_design/AuthDesign.tsx` directly on `gigly_full_design/Auth.dc.html`. This change diffed the live component against that reference (auth was never in the `design-reference/screens/` capture pipeline — no PNG; `Auth.dc.html` is the source), found it faithful, and required **no production-code change**. One deliberate, E2E-tested divergence from the static prototype is documented and kept: the step-2 back-arrow (re-choose role) and the step-3 secondary control that skips to `/dashboard` (the account already exists from step 2) — both reflect the real two-phase flow. Verified: build exit 0 (`/login` + `/register` prerendered, no `/auth` route); auth E2E **25** (`auth-flow` + `auth-navigation` + `auth-session` + `compose-auth-onboarding`).

### Requirement: Auth Surface Transported From Auth.dc.html
`/login` and `/register` MUST render `app/_design/AuthDesign.tsx` — the `Auth.dc.html` shell (blue **G** logomark, GIGLY wordmark, Handjet/Manrope, `pixel-wave.svg` shown on login + onboarding step 1 and hidden on steps 2/3, footer) on `app/_design/tokens.css` with no `@composed-screen` kit. It MUST implement the prototype's `view: 'login' | 'onboarding'` × `step: 1 | 2 | 3` state machine: login ↔ onboarding switches, onboarding 1→2→3, the step-2 back-arrow returning to step 1 (re-choose role). The two-phase wiring MUST be preserved — `registerUser` creates the account + session at step 2 «Зарегистрироваться»; `updateProfile` persists the role-specific profile at step 3 «Продолжить»; `loginUser` for login. The legacy `/auth` route MUST stay removed and the homepage MUST link to `/login`.

#### Scenario: Login, onboarding, and the removed /auth route
- **GIVEN** an unauthenticated visitor
- **WHEN** they open `/login` («ВХОД В GIGLY») and switch via «Создать аккаунт», then complete onboarding (role → credentials «Зарегистрироваться» → setup «Продолжить»)
- **THEN** the shared shell renders, the account is created at step 2 (auto-login) and the profile persists at step 3 landing on `/dashboard`; login errors surface in Russian within the view
- **AND** `/auth` returns 404 (no route, no middleware reference) and the homepage links to `/login`

## ADDED Requirements (transport-settings — Figma settings popup `3121:2609`)

> Added by change transport-settings (archived 2026-06-29) — the deferred settings work from `openspec/planning/transport-design-from-prototype.md` (Decision 1). Transports the Figma settings popup (node `3121:2609`, captured at `design-reference/screens/settings.popup.png`) into the app as a true modal overlay rendered on `app/_design/tokens.css`, with each control either live-and-wired or grayed-and-inert. Verified: `npm run build` exit 0; `settings-vm` + `settings-actions` + `timezones` + `account-preferences` (18 integration) green; `compose-settings` + `theme-switch` (10 E2E) green.
>
> **⚠️ KNOWN FUNCTIONALITY GAPS (flagged at archive — by design, not defects).** This change shipped the popup and made the wired preferences **persist**, but the rest of the app does not **consume** several of them. A full audit (2026-06-29) found three persisted-but-unconsumed controls; per owner decision each is rendered **grayed/inert** in the MVP so it doesn't masquerade as functional, with consumption tracked as follow-up planning queries:
> - **Currency** — `lib/utils/currency.ts:formatCurrency` hardcodes `ru-RU` / `RUB` and takes no preference, so all money renders in rubles regardless of `user.currency`. Honest consumption requires an FX-rate decision (amounts are stored in rubles; relabelling without conversion would fabricate value). → `currency-display`.
> - **Language** — the app has no i18n layer; UI strings are hardcoded Russian literals, so `user.locale` changes nothing visible. Consumption requires a translation catalog + lookup layer. → `i18n-foundation`.
> - **Notification toggles — PARTIALLY WIRED.** Of the 5 rows, the 3 with a real bell source are now **live**: `getUnreadNotifications` reads the prefs and gates the bell at *display* time (MESSAGE→`notifyMessages`, APPLICATION→`notifyApplications`, STATUS_CHANGE→`notifyStatusChanges`), reversibly (no rows dropped at creation). The 2 sourceless rows (`notifyPlatformNews`/`notifyNewGigs`) have no event source, so they stay **grayed/inert** (a toggle would gate nothing). The «Email» label was corrected to «Уведомления в приложении» — these are in-app notifications; **no email channel exists** (real email delivery stays deferred → `notification-preferences`).
>
> The stored preference is the **seam**; the follow-ups live in the transport plan's "Follow-ups" section. Timezone has no such gap — it is both persisted AND surfaced (on the profile page). Two further fields, `showRatingInProfile`/`showOnlineStatus`, persist but are neither rendered nor consumed (orphaned; documented as Gap D for a future privacy section).

### Requirement: Settings Renders As The Design's Modal Popup
The settings surface MUST be presented as the Figma popup: a backdrop-dimmed, centred, contained card (≤900px, `max-height` bounded with the section list scrolling **inside** the window via an inset rounded scrollbar tinted like the section cards — never running off-screen) with a pinned header «Настройки» showing a section counter and an X-close. It MUST be opened from the shell gear/«Настройки» control and be deep-linkable + dismissible via a URL query param (`?settings=1`), with backdrop-click / X / Esc closing it. The 6-section body MUST be a presentational `SettingsPanel` reused by both the modal and the `/settings` route (kept as a deep-link + no-JS fallback). It MUST render on the app's existing tokens/fonts (Handjet/Manrope), not the Figma file's raw Golos Text/SF Compact.

#### Scenario: Open and close the contained settings modal
- **WHEN** an authenticated user activates the shell «Настройки»/gear control
- **THEN** the «Настройки» modal opens over the current page as a contained card (backdrop + counter + X-close) showing the 6 section cards, the body scrolls inside the window, and the URL carries `?settings=1`
- **AND** clicking X, the backdrop, or pressing Esc closes it and returns to the underlying page

#### Scenario: Deep-link and route fallback
- **WHEN** the user navigates directly to `?settings=1` (or to `/settings`)
- **THEN** the same 6-section `SettingsPanel` renders (modal over the page for the query param; full-page for the route)

### Requirement: Every Settings Control Is Live-And-Wired Or Grayed-And-Inert
`SettingsPanel` MUST render all six design sections 1:1, where each control is EITHER fully wired (mutating visible state on interaction + persisting where backed) OR rendered grayed and inert. No control may be a static look-alike that masquerades as functional, and none fabricates a backend. **Wired:** «Имя» (`updateAccountName` — partial-safe, no clobber); per-row session terminate (`terminateSession`) + «Завершить все неактивные сеансы» (`terminateInactiveSessions`); «Часовой пояс» (`updateTimezone` — partial-safe, also surfaced on the profile); «Удалить аккаунт навсегда» (`deleteAccount` email-gate); «Выйти» (`logoutUser`); **the 3 «Уведомления в приложении» rows that have a real bell source** (`notifyApplications`/`notifyMessages`/`notifyStatusChanges` via `updatePreferences`) — they gate the bell live (`getUnreadNotifications` display-time filter). **Grayed + inert** (muted, `cursor:not-allowed`, `pointer-events:none`, no handler) — both the never-backed controls AND the persisted-but-unconsumed MVP controls, so neither pretends to work: «Двухфакторность» (no `twoFactorEnabled` field), Email, Password, avatar «Загрузить фото»/remove, **currency ₽/$/€** (persists `currency` but money still renders ₽), **«Язык интерфейса»** (persists `locale` but no i18n), and **the 2 sourceless notification rows** (`notifyPlatformNews`/`notifyNewGigs` — no event source generates them). Wired controls autosave and surface the outcome — a transient «Сохранено» on success and «Не удалось сохранить» on error (errors are not swallowed). The session-row description MUST be the device + relative time only — it MUST NOT fabricate a per-session location, nor derive one from the timezone preference.

#### Scenario: Wired controls change and persist
- **WHEN** the user edits «Имя», picks a «Часовой пояс», terminates a session, or toggles a sourced notification row (e.g. «Новые сообщения в чатах»)
- **THEN** the control updates immediately, the matching action persists it, and a reload reflects the change (timezone also surfaces on the profile; a disabled notification type stops appearing in the bell, reversibly)

#### Scenario: Persisted-but-unconsumed controls are grayed and cannot be changed
- **WHEN** the user views currency, «Язык интерфейса», or the two sourceless notification rows (platform news / new gigs)
- **THEN** each renders 1:1 showing its stored value but is muted + non-interactive (`aria-disabled`/`disabled`, `pointer-events:none`, no handler), so it is visibly not changeable — reflecting that the app does not yet consume those preferences (see the KNOWN FUNCTIONALITY GAPS note)

#### Scenario: Timezone persists AND surfaces on the profile
- **WHEN** the user picks a timezone
- **THEN** the dropdown updates, `updateTimezone` saves it partial-safely, and the profile page shows the same `(GMT±N) City` label (the modal calls `router.refresh()` so it updates without a reload)

#### Scenario: Grayed controls cannot be interacted with
- **WHEN** the user tries to toggle «Двухфакторность» or edit Email / Password / upload an avatar
- **THEN** those controls render muted and do not respond — no state change, no submit, no persisted effect

### Requirement: Timezone Options Cover Russian Zones + Relocation + World Hubs
The «Часовой пояс» dropdown MUST offer all 11 major Russian time zones, a curated set of popular Russian-IT relocation hubs, AND the major world business/tech hubs (LA, New York, London, Tokyo, etc.). `lib/profiles.TIMEZONES` MUST be the single source (so onboarding and `updateTimezone`/`isTimezone` validation stay in sync), each entry rendered with a Russian `(GMT±N) City` label via `TIMEZONE_LABELS`/`timezoneLabel`. Additions are validated automatically by `isTimezone` (no value drift).

#### Scenario: Dropdown lists Russian zones, relocation hubs, and major world hubs
- **WHEN** the user opens «Часовой пояс»
- **THEN** it lists the 11 Russian zones, popular relocation hubs (Тбилиси, Ереван, Алматы, Белград, Стамбул, Дубай, Кипр, Лиссабон, Бангкок, Бали, Ташкент, Бишкек, Буэнос-Айрес), and major world hubs (Лос-Анджелес, Нью-Йорк, Чикаго, Лондон, Берлин, Мумбаи, Шанхай, Сингапур, Токио, Сидней, Сан-Паулу), each with a `(GMT±N)` label, and selecting any persists via `updateTimezone`

### Requirement: Settings Schema Is Cheap + Additive And Keeps The Suite Green
The schema MUST gain `User.currency` (default `"rub"`), `notifyPlatformNews` + `notifyNewGigs` (default `true`), applied via `prisma db push` (the project mechanism); `getSettings`/`Preferences` MUST surface them and `getSettings` MUST also surface the profile `timezone` + `name`. `updatePreferences` MUST accept the new fields partial-safely. No `twoFactorEnabled` field is added (2FA is grayed). `updateAccountName`/`updateTimezone` MUST be partial-safe (write only their own field, never clobbering other profile fields the full `updateProfile` upsert would). Existing `terminateSession`/`deleteAccount`/`getSettings` signatures MUST be unchanged. `npm run build` MUST exit 0 and the `settings-vm`/`settings-actions`/`timezones`/`account-preferences`/`compose-settings` suites MUST pass with no weakened assertions.

#### Scenario: Migration + VM expose the new fields with safe defaults
- **WHEN** the schema is applied and `getSettings` runs for a user with no prior values
- **THEN** `currency="rub"`, `notifyPlatformNews=true`, `notifyNewGigs=true` are returned, `timezone`/`name` are surfaced from the profile, and `updatePreferences` round-trips changes to each

## ADDED Requirements (chat-realtime — optimistic send + live delta polling)

> Added by change chat-realtime (archived 2026-07-03). Brings `/chats` to a modern messenger bar — optimistic send + live delta-polling — with **no new runtime dependency and no external service**, behind a swappable client seam so SSE/a managed bus can drop in later with no UI change. Preserves the gig-scoped model and hardens the message gate (finished gigs become read-only). Verified: `npm run build` exit 0; `messaging` + `chats-vm` integration (incl. `getMessagesSince`/`sendMessageLive`/terminal-state gates); `compose-chats` (9) + `messaging-flow-e2e` (2) E2E incl. optimistic-no-navigation, the disappearing-message regression, cross-context live receive, and the read-only completed-gig. The `sendMessage` MODIFIED requirement above carries the optimistic/no-JS-fallback behavior.

### Requirement: Chat Thread Updates Live Via Delta Polling Behind A Swappable Seam
The open `/chats` thread MUST update with the counterparty's new messages **without a manual reload**. The client MUST subscribe through a single hook `useThread(gigId, initialThread)`; the receive contract MUST be the single server action `getMessagesSince(gigId, afterIso)`, which returns only messages newer than the supplied timestamp. The hook MUST poll on a bounded interval (≈3s) for the open thread only, fetch deltas (not the whole thread), dedupe by message id, **pause polling when the document is hidden** (Page Visibility API) and resume on focus, and run **no timer when no thread is open**. Every `setMessages` updater MUST be pure (dedupe against the current list; no external-ref mutation inside an updater) so React Strict Mode / concurrent rendering cannot desync the list. The transport MUST be encapsulated so that replacing polling with SSE or a managed bus later requires changing only the hook's internals and `getMessagesSince`'s producer — **no change to `ChatsDesign` or the message VM**.

#### Scenario: Counterparty message appears without reload
- **GIVEN** two participants of a started gig each viewing `/chats?gig=<id>`
- **WHEN** one sends a message
- **THEN** the other's thread MUST show the new bubble within one poll interval, without any navigation or manual reload

#### Scenario: Delta fetch and dedupe (no vanish, no duplicate)
- **WHEN** the thread polls `getMessagesSince(gigId, afterIso)`
- **THEN** it MUST return only messages with `createdAt` after `afterIso` (ordered ascending, capped), and the hook MUST append only ids not already present — an optimistic bubble MUST reconcile without vanishing and without duplicating, even when a poll lands mid-send

#### Scenario: Idle and hidden are cheap
- **WHEN** the browser tab is hidden, or no conversation is selected
- **THEN** the thread MUST NOT poll (it resumes on focus / on selecting a conversation)

### Requirement: Chat Remains Gig-Scoped, Starts Only After Gig Start, And Is Read-Only Once Finished
Chat scope and lifetime MUST NOT change. A conversation MUST remain a Gig (no `Conversation` model, no per-message `readAt`). Messaging is permitted only during the **active window**: the gig MUST have an **assigned specialist**, MUST NOT be `closedByAdmin`, and MUST be in an active status (`OPEN`…`REVIEW`) — the **terminal states `COMPLETED` and `PAID` are read-only** (history shows, composing is refused). The actor MUST be a participant (gig owner or assigned specialist). `persistMessage` (shared by `sendMessage` + `sendMessageLive`) MUST enforce this gate; `getChatThread` MUST surface it as `composer.canSend` (+ a `closedReason`) so the UI hides the composer and shows a read-only notice instead of a control that would error on submit. No pre-assignment chat.

#### Scenario: Non-participant, pre-assignment, and finished gigs are refused
- **WHEN** a non-participant calls `getMessagesSince`/`sendMessageLive`, or any actor targets a gig with no assigned specialist, a `closedByAdmin` gig, or a **`COMPLETED`/`PAID`** gig
- **THEN** the write MUST be refused (no message created), identically for both send paths

#### Scenario: A finished conversation is read-only in the UI
- **WHEN** a participant opens a `COMPLETED`/`PAID` (or admin-closed) conversation
- **THEN** the message history MUST render, but the composer MUST be replaced by a read-only notice («…только для просмотра») — no text input, no send button — reflecting `composer.canSend === false`

### Requirement: Send Guards Are Preserved By A Shared Core
The message-write guards MUST be shared by both send paths via a single core (`persistMessage`): authentication, rate limiting (30/hour/user), input sanitization, length validation (≤2000, non-empty after trim), the participant/assignment/closed/terminal gates, and the `Notification` upsert. `sendMessageLive` MUST apply the identical core and return the created message; `sendMessage` MUST apply the identical core and keep its `redirect(redirectTo)` semantics. No guard may be weakened or duplicated.

#### Scenario: Both paths enforce the same rules
- **WHEN** a message is sent via the optimistic path (`sendMessageLive`) or the form path (`sendMessage`)
- **THEN** both MUST enforce the same auth, rate-limit, sanitize, validation, and gating, and both MUST upsert the recipient's unread `Notification`

### Requirement: Russian Pluralization of Counted Nouns
All user-facing strings that render a count followed by a Russian noun (e.g. days «день», stages «этап») MUST select the correct plural form for the count using a shared helper, rather than a single hardcoded form. The helper MUST implement the standard Russian one/few/many rule.

#### Scenario: Day counts select the correct form
- GIVEN a helper that pluralizes «день»
- WHEN it renders counts 1, 2, 5, 11, 21, 22, 25
- THEN the output MUST be «1 день», «2 дня», «5 дней», «11 дней», «21 день», «22 дня», «25 дней»
- AND no count MUST ever render the incorrect «1 дней» form

#### Scenario: Stage counts select the correct form
- GIVEN a helper that pluralizes «этап»
- WHEN it renders counts 1, 2, 5, 11
- THEN the output MUST be «1 этап», «2 этапа», «5 этапов», «11 этапов»

#### Scenario: Render sites use the shared helper
- GIVEN the gig deadline («срок выполнения»), the stage note («[N этап]»), gig-card deadlines, and terms/negotiation deadline figures
- WHEN each is rendered with an arbitrary count
- THEN each MUST produce the grammatically correct form via the shared helper
- AND no render site MUST emit a fixed `${n} дней` / `${n} этап` string for all counts

### Requirement: Category Chips Signal Selection, Not Error
Selected category chips in the «Избранные категории» modal MUST present a "selected" affordance (filled or tinted pill) and MUST NOT present a thin colored (red/green) border that reads as a form-validation error state.

#### Scenario: A selected category reads as selected
- GIVEN the «Избранные категории» modal is open
- WHEN a user selects a category (e.g. «Дизайн» or «Программирование»)
- THEN the chip MUST show a filled/tinted selected treatment using the category's accent hue
- AND the chip MUST NOT show a 1px colored inset outline that resembles an invalid/valid field border

#### Scenario: An unselected category is visually distinct and neutral
- GIVEN the modal is open
- WHEN a category is not selected
- THEN the chip MUST use a neutral (non-hued, non-error) resting style clearly distinct from the selected style

### Requirement: Acceptance-Criteria Placeholder Fully Visible
The «Критерии приёмки» input on the create-gig and edit-gig forms MUST display its full example placeholder text without truncation or occlusion by the adjacent «Добавить» button.

#### Scenario: Placeholder is readable on the create-gig form
- GIVEN the create-gig form is displayed at desktop width
- WHEN the «Критерии приёмки» input is empty
- THEN the full example placeholder MUST be visible and not clipped behind the «Добавить» button

#### Scenario: Edit-gig form matches
- GIVEN the edit-gig form is displayed
- WHEN the «Критерии приёмки» input is empty
- THEN it MUST present the same non-truncated placeholder layout as the create-gig form

### Requirement: Comfortable «Назад» Back Control
The back control on the gig-detail screen MUST be a comfortably sized, legible target, whichever destination it points at.

> Generalized by `examples-for-clients`: the label is no longer the fixed string «← Назад к гигам». It reads
> «← Назад к примерам» when the gig was opened from the examples (`?from=examples`) — reachable by either role, since
> the examples page is not role-gated. The sizing/affordance guarantee below is unchanged and applies to both labels.

#### Scenario: Back control is a comfortable hit target
- GIVEN any viewer on a gig-detail screen
- WHEN the back control renders (whether «← Назад к гигам» or «← Назад к примерам»)
- THEN it MUST have an enlarged, legible label and a hit area with a minimum height of at least 32px
- AND it MUST provide a clear interactive (hover) affordance

### Requirement: App shell reflows and collapses the sidebar at narrow viewports
The protected app shell (`AppShellDesign`) MUST reflow below a `1024px` breakpoint so the sidebar no longer occupies fixed horizontal space beside the content, giving the main column the full viewport width. The shell MUST NOT introduce horizontal overflow at phone widths. (Source change: `responsive-my-gigs` — Гигли баги #5.)

#### Scenario: Sidebar does not force horizontal overflow at 390px
- GIVEN an authenticated user on any protected route at a 390px-wide viewport
- WHEN the app shell renders
- THEN the sidebar MUST NOT sit as a fixed-width (283px/76px) column in a row beside the content
- AND the sidebar MUST be collapsed/adapted (e.g. a top bar, off-canvas drawer, or icon-only rail)
- AND `document.documentElement.scrollWidth` MUST be within ~2px of `document.documentElement.clientWidth`
- AND all sidebar affordances (nav, notification bell, settings, logout) MUST remain reachable

#### Scenario: Header search/filter row wraps instead of overflowing
- GIVEN the dashboard, browse, or «Мои гиги» route at a 390px-wide viewport
- WHEN the header search + filter-chip row renders
- THEN the four filter chips MUST NOT remain `flex: "none"` in a single non-wrapping row that exceeds the viewport
- AND the row MUST wrap (or move filters behind a control) so no horizontal overflow results
- AND the search input and filter controls MUST remain usable

#### Scenario: Shell is unchanged at desktop widths
- GIVEN an authenticated user at a `≥1024px` viewport (e.g. 1280px)
- WHEN the app shell renders
- THEN the sidebar MUST render as today (283px expanded / 76px collapsed, in-row)
- AND the header, paddings, and search/filter row MUST match the current desktop layout

### Requirement: Dashboard reflows to a single column at narrow viewports
The dashboard (`DashboardDesign`) MUST stack its multi-column regions and collapse its gig grids to a single column below `1024px`, using fluid widths, so all content fits within 360–414px with no horizontal overflow and is reachable by vertical scroll. (Source change: `responsive-my-gigs` — Гигли баги #5.)

#### Scenario: Dashboard has no horizontal overflow at 390px
- GIVEN an authenticated user on `/dashboard` at a 390px-wide viewport
- WHEN the dashboard renders
- THEN the WELCOME row MUST NOT keep its fixed 317px left column beside the tiles
- AND the BOARD MUST stack the feed column and the 400px right rail vertically at full width
- AND each gig feed grid MUST collapse from `1fr 1fr` to a single column (`minmax(0, 1fr)`)
- AND `document.documentElement.scrollWidth` MUST be within ~2px of `clientWidth`
- AND all sections (WELCOME, «Мои гиги», role panel, «Сообщения», «Требует внимания») MUST be reachable by vertical scroll

#### Scenario: Attention rail keeps its intentional horizontal scroll
- GIVEN the specialist dashboard at a 390px-wide viewport with «Требует внимания» cards
- WHEN the attention rail renders
- THEN the rail MAY scroll horizontally within its own `overflowX: auto` container
- AND this MUST NOT cause the page (`documentElement`) to overflow horizontally

#### Scenario: Dashboard is unchanged at desktop widths
- GIVEN an authenticated user on `/dashboard` at a `≥1024px` viewport
- WHEN the dashboard renders
- THEN the WELCOME row, the two-column BOARD (feed + 400px rail), and the `1fr 1fr` gig grids MUST match the current desktop layout

### Requirement: Specialist «Мои гиги» reflows to a single column at narrow viewports
The specialist «Мои гиги» screen (`MyGigsDesign`) MUST collapse its `1fr 1fr` card grid to a single column (`minmax(0, 1fr)`) below `1024px` so cards fit within 360–414px with no horizontal overflow and all cards are reachable by vertical scroll. (Source change: `responsive-my-gigs` — Гигли баги #5.)

#### Scenario: «Мои гиги» has no horizontal overflow at 390px
- GIVEN an authenticated specialist on `/my-gigs` at a 390px-wide viewport
- WHEN the screen renders with gig cards
- THEN the card grid MUST collapse from `1fr 1fr` to a single column
- AND `document.documentElement.scrollWidth` MUST be within ~2px of `clientWidth`
- AND every gig card MUST be reachable by vertical scroll
- AND the status tab row MUST remain usable (it already wraps)

#### Scenario: «Мои гиги» is unchanged at desktop widths
- GIVEN an authenticated specialist on `/my-gigs` at a `≥1024px` viewport
- WHEN the screen renders
- THEN the card grid MUST render as the current two-column `1fr 1fr` layout

### Requirement: No horizontal overflow across the phone-width range
The dashboard and specialist «Мои гиги» MUST have no page-level horizontal overflow across the full 360–414px range, not only at 390px. (Source change: `responsive-my-gigs` — Гигли баги #5.)

#### Scenario: No horizontal overflow at the range edges
- GIVEN the dashboard and `/my-gigs` rendered at 360px and again at 414px
- WHEN each screen is measured
- THEN `document.documentElement.scrollWidth` MUST be within ~2px of `clientWidth` at both widths
- AND no element MUST extend beyond the right viewport edge
