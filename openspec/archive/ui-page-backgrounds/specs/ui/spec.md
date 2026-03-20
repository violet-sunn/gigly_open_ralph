# UI Specification Delta: Page Background Token Migration

## MODIFIED Requirements

### Requirement: Homepage

**Modified Scenario: Anonymous user visits homepage with token-based styling**
- GIVEN no valid session cookie exists
- WHEN a user visits `/`
- THEN it MUST display the application name "Gigly"
- AND it MUST display a "Get Started" link to `/register`
- AND it MUST display a "Sign in" link to `/login`
- AND the page background MUST use `bg-surface-level-0` ← **CHANGED from bg-navy-900**
- AND the "Get Started" button MUST use `bg-blue-500 hover:bg-blue-600 text-white`
- AND the "Sign in" link MUST use `text-blue-500 hover:text-blue-400`

**Modified Scenario: Authenticated user visits homepage with token-based styling**
- GIVEN a user is logged in (valid session cookie)
- WHEN they visit `/`
- THEN it MUST display their email address
- AND it MUST display a logout button/form
- AND it MUST NOT show the "Get Started" CTA
- AND the "Go to Dashboard" button MUST use `bg-blue-500 hover:bg-blue-600 text-white`
- AND the "Sign out" button MUST use `text-blue-500 border border-blue-500 hover:bg-blue-500/10`
- AND the page background MUST use `bg-surface-level-0` ← **CHANGED from bg-navy-900**

**Modified Acceptance Criteria:**
- `app/page.tsx` calls `getSession()` to check auth state
- Authenticated: shows email + logout form with token-based button styling
- Anonymous: shows "Get Started" link + "Sign in" link with token-based styling
- Page background uses `bg-surface-level-0` ← **CHANGED from bg-navy-900**
- Primary CTA uses `bg-blue-500 hover:bg-blue-600`
- Secondary actions use text link styling or outlined button styling

---

### Requirement: Registration Form with Role Selection

**Modified Scenario: Registration page renders with token-based styling**
- GIVEN a user navigates to `/register`
- WHEN the page loads
- THEN the form container MUST use `bg-surface-level-1 border border-neutral-weak rounded-lg shadow-md`
- AND the form container MUST use `p-8` (32px) padding
- AND form fields MUST use `space-y-6` (24px) vertical spacing
- AND the page background MUST use `bg-surface-level-0` ← **CHANGED from bg-navy-900**

**Modified Acceptance Criteria:**
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
- Page background uses `bg-surface-level-0` ← **CHANGED from bg-navy-900**
- On success: user is redirected to `/dashboard` with session set
- On error: an error message is displayed inline on the registration page
- A loading/pending indicator is shown while the form submits
- Registration page includes a `<Link href="/login">` ("Already have an account? Sign in")
- Role selector values (CLIENT, SPECIALIST) preserved exactly
- All form field names preserved exactly

---

### Requirement: Login Page

**Modified Scenario: Login page renders with token-based styling**
- GIVEN a user navigates to `/login`
- WHEN the page loads
- THEN it MUST display a form with email and password inputs
- AND it MUST display a "Sign in" submit button
- AND it MUST display a link to `/register` for users without an account
- AND the form container MUST use `bg-surface-level-1 border border-neutral-weak rounded-lg shadow-md`
- AND the form container MUST use `p-8` (32px) padding
- AND form fields MUST use `space-y-6` (24px) vertical spacing
- AND the page background MUST use `bg-surface-level-0` ← **CHANGED from bg-navy-900**

**Modified Acceptance Criteria:**
- `app/login/page.tsx` exists as a `'use client'` component
- Uses `useActionState` with `loginUser` action
- Uses `useFormStatus` for pending state on submit button
- Form container uses `bg-surface-level-1 border border-neutral-weak rounded-lg shadow-md p-8`
- Form fields use `space-y-6` vertical spacing
- Input fields use `bg-navy-800 border border-gray-600 text-white` with token-based focus states
- Submit button uses `bg-blue-500 hover:bg-blue-600 text-white w-full`
- Error messages use `text-error-500 text-sm`
- Registration link uses `text-blue-500 hover:text-blue-400`
- Page background uses `bg-surface-level-0` ← **CHANGED from bg-navy-900**
- Includes a `<Link>` to `/register`
- Displays `state?.error` when present

---

### Requirement: Layout Container Token-Based Background

**Modified Scenario: Protected layout uses token-based background**
- GIVEN an authenticated user navigates to any protected page
- WHEN the layout renders
- THEN the page background MUST use `bg-surface-level-0` ← **CHANGED from var(--bg-surface-level-0)**
- AND the background color MUST be consistent across all protected pages
- AND the MainNav component MUST be wrapped in Suspense boundary
- AND the layout MUST provide proper fallback during loading

**Modified Acceptance Criteria:**
- Protected layout uses `bg-surface-level-0` for page background ← **CHANGED from var(--bg-surface-level-0)**
- MainNav wrapped in Suspense with proper fallback
- Layout is responsive across all viewport sizes
- No horizontal scrolling on any viewport
- Consistent visual appearance across all protected pages

---

### Requirement: Role-Based Dashboard

**Modified Acceptance Criteria:**
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
- Dashboard page background uses `bg-surface-level-0` ← **ADDED**
- Navigation header uses token-based styling (see Navigation Header Token-Based Styling requirement)
- All dashboard functionality remains unchanged
- Token migration does not affect dashboard behavior or data display
- "My Profile" link remains accessible

---

### Requirement: Gig Browse Page Card Hierarchy

**Modified Scenario: Gig cards use token-based hierarchy**
- GIVEN a SPECIALIST user views `/dashboard/gigs`
- WHEN the page renders with gig cards
- THEN each gig card MUST use `bg-surface-level-1` background token
- AND on hover, cards MUST use `bg-surface-level-2` for visual feedback
- AND borders MUST use `border-neutral-weak` token for subtle separation
- AND hover borders MUST use `border-neutral-strong` for emphasis
- AND the page background MUST use `bg-surface-level-0` ← **CHANGED from bg-navy-900 (from layout)**

**Modified Acceptance Criteria:**
- Gig cards use `bg-surface-level-1` with `border-neutral-weak`
- Hover states use `bg-surface-level-2` and `border-neutral-strong`
- Filter panel maintains light theme styling for contrast
- Card spacing uses `space-y-4` (16px gaps)
- Card padding uses `p-6` (24px)
- All existing filter functionality preserved
- Pagination controls remain functional
- Page background uses `bg-surface-level-0` ← **ADDED**

---

### Requirement: Admin Pages Background Consistency

**New Scenario: Admin layout uses token-based background**
- GIVEN an authenticated ADMIN user navigates to any admin page
- WHEN the admin layout renders
- THEN the page background MUST use `bg-surface-level-0`
- AND the background color MUST be consistent across all admin pages (/admin, /admin/users, /admin/gigs)
- AND all admin page content MUST remain fully functional

**New Scenario: Admin dashboard uses token-based background**
- GIVEN an authenticated ADMIN user views `/admin`
- WHEN the page renders
- THEN the page background MUST use `bg-surface-level-0`
- AND all statistics cards MUST remain visible and functional
- AND navigation to user/gig management pages MUST work correctly

**New Scenario: Admin user management page uses token-based background**
- GIVEN an authenticated ADMIN user views `/admin/users`
- WHEN the page renders
- THEN the page background MUST use `bg-surface-level-0`
- AND the user table MUST remain fully functional
- AND pagination MUST work correctly
- AND suspend/unsuspend actions MUST work correctly

**New Acceptance Criteria:**
- `app/admin/layout.tsx` uses `bg-surface-level-0` for page background
- `app/admin/page.tsx` inherits background from layout
- `app/admin/users/page.tsx` inherits background from layout
- All admin functionality preserved (suspend, unsuspend, close gigs, pagination)
- Admin table headers and rows maintain proper contrast
- All existing admin tests pass without modification

---

### Requirement: Pagination Controls Component Consistency

**New Scenario: Pagination disabled buttons use token-based styling**
- GIVEN pagination controls render with disabled Previous or Next buttons
- WHEN the buttons are in disabled state
- THEN disabled buttons MUST use `bg-surface-level-0` for background consistency
- AND disabled buttons MUST maintain proper visual distinction from enabled buttons
- AND disabled buttons MUST use `opacity-50` and `cursor-not-allowed` classes

**New Acceptance Criteria:**
- `app/components/PaginationControls.tsx` uses `bg-surface-level-0` for disabled button backgrounds
- Disabled buttons maintain visual distinction with opacity and cursor styles
- Pagination functionality remains unchanged
- Component works correctly on all pages (gig browse, admin users, admin gigs)

---

### Requirement: Admin Form Components Background Consistency

**New Scenario: Admin form inputs use token-based backgrounds**
- GIVEN an admin views suspend/unsuspend user forms
- WHEN form inputs render
- THEN textarea inputs MUST use `bg-surface-level-0` for background consistency with page
- AND inputs MUST maintain proper border and focus states
- AND form submission functionality MUST remain unchanged

**New Acceptance Criteria:**
- `app/admin/users/SuspendUserForm.tsx` textarea uses `bg-surface-level-0`
- `app/admin/users/UnsuspendUserForm.tsx` textarea uses `bg-surface-level-0`
- Form inputs maintain proper contrast with text and borders
- All form validation and submission logic preserved
- Forms remain accessible and keyboard-navigable
