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
