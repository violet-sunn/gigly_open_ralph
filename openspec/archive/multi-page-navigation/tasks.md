# Implementation Tasks

## Phase 1: Create New Route Structure with Route Groups

### Task 1: Create protected route group with shared layout
**Implementation:**
- Create `app/(protected)/` route group directory
- Create `app/(protected)/layout.tsx` with:
  - Session verification (redirect to `/login` if not authenticated)
  - `MainNav` component (to be created in Task 4)
  - Shared layout wrapper for all authenticated routes
- This single layout replaces the current `app/dashboard/layout.tsx` and provides navigation to all authenticated routes

**Test Plan:**
```bash
# Manual verification after completing Task 2-4
npm run dev
# Navigate to any authenticated route
# Verify navigation bar appears on all pages
# Verify unauthenticated users are redirected to /login
```

**Acceptance Criteria:**
- Route group `app/(protected)/` created
- Single shared layout provides navigation to all authenticated routes
- Authentication check redirects unauthenticated users
- No duplicate layout files in subdirectories

---

### Task 2: Create dashboard route
**Implementation:**
- Create `app/(protected)/dashboard/` directory
- Create `app/(protected)/dashboard/page.tsx` by copying content from `app/dashboard/page.tsx`
- Keep all existing logic:
  - Profile completion checks
  - Role-based dashboards (CLIENT/SPECIALIST)
  - Error message display via query parameters
  - Gig lists for CLIENTs
  - Application tabs for SPECIALISTs (using existing `SpecialistDashboardTabs` component)
- Update import paths as needed
- Do NOT create a separate layout.tsx (inherits from route group)

**Test Plan:**
```bash
# Manual verification
npm run dev
# Navigate to /dashboard after login
# Verify CLIENT sees "Client Dashboard" with gigs list
# Verify SPECIALIST sees "Specialist Dashboard" with application tabs
# Verify profile completion hints display correctly
# Verify error messages display when query parameter present
```

**Acceptance Criteria:**
- `/dashboard` route accessible to authenticated users
- Page displays identical content to current `/dashboard`
- Inherits navigation from route group layout
- All role-based logic works correctly
- Application tabs remain on dashboard page for SPECIALISTs

---

### Task 3: Create gigs routes
**Implementation:**
- Create `app/(protected)/gigs/` directory structure:
  - `app/(protected)/gigs/page.tsx` (browse page, from `app/dashboard/gigs/page.tsx`)
  - `app/(protected)/gigs/[id]/page.tsx` (detail page, from `app/dashboard/gigs/[id]/page.tsx`)
  - `app/(protected)/gigs/new/page.tsx` (creation page, from `app/dashboard/gigs/new/page.tsx`)
  - `app/(protected)/gigs/examples/page.tsx` (examples page, from `app/dashboard/gigs/examples/page.tsx`)
- Move components to appropriate locations:
  - `app/(protected)/gigs/new/gig-form.tsx` (from `app/dashboard/gigs/new/gig-form.tsx`)
  - Keep filter components in same relative location
- Update all import paths
- Do NOT create a separate layout.tsx (inherits from route group)
- Keep all existing server actions unchanged

**Test Plan:**
```bash
# Integration tests (will need URL updates in Phase 3)
npm run test:unit -- gig-browse-access.test.ts
npm run test:unit -- gig-creation.test.ts

# Manual verification
# As SPECIALIST: navigate to /gigs - should show browse page
# As CLIENT: navigate to /gigs - should redirect to /dashboard (middleware will handle in Task 5)
# Navigate to /gigs/[id] - should show detail page
# As CLIENT: navigate to /gigs/new - should show creation form
# Navigate to /gigs/examples - should show example gigs
```

**Acceptance Criteria:**
- All gig routes accessible at `/gigs/*`
- Browse page shows filters and pagination
- Detail page shows gig details and role-appropriate actions
- Creation page shows form for CLIENTs
- Examples page accessible to all authenticated users
- Inherits navigation from route group layout

---

### Task 4: Create profile routes and refactor navigation
**Implementation:**
- Create `app/(protected)/profile/` directory structure:
  - `app/(protected)/profile/page.tsx` (view own profile, from `app/dashboard/profile/page.tsx`)
  - `app/(protected)/profile/edit/page.tsx` (edit profile, from `app/dashboard/profile/edit/page.tsx`)
  - `app/(protected)/profile/[userId]/page.tsx` (public profile, from `app/dashboard/profile/[userId]/page.tsx`)
- Move `ProfileEditForm.tsx` component to appropriate location
- Do NOT create a separate layout.tsx (inherits from route group)
- Rename `app/components/DashboardNav.tsx` to `app/components/MainNav.tsx`
- Update `MainNav` component:
  - Change gig and profile route references to new structure
  - `/dashboard/gigs` → `/gigs`
  - `/dashboard/gigs/new` → `/gigs/new`
  - `/dashboard/profile` → `/profile`
  - Keep `/dashboard` link unchanged
  - Update `isActive()` logic for new routes
  - Remove "Browse Gigs" link for CLIENT role (don't show link that will redirect)
- Update `app/(protected)/layout.tsx` to import `MainNav` instead of `DashboardNav`

**Test Plan:**
```bash
# Integration tests
npm run test:unit -- profile.test.ts

# Manual verification
# Navigate to /profile - should show own profile
# Navigate to /profile/edit - should show edit form
# Navigate to /profile/[userId] - should show public profile
# Verify CLIENT profile shows company info
# Verify SPECIALIST profile shows tech stack
# Check navigation on all pages:
#   - Dashboard link points to /dashboard
#   - Gigs links point to /gigs/*
#   - Profile links point to /profile/*
#   - Active link highlighting works
#   - As CLIENT: "Browse Gigs" link NOT shown
#   - As SPECIALIST: "Browse Gigs" link shown
```

**Acceptance Criteria:**
- All profile routes accessible at `/profile/*`
- View page shows role-appropriate profile data
- Edit page allows updating profile fields
- Public profile page shows user information
- Navigation component renamed to `MainNav`
- Gig and profile navigation links point to new route structure
- Dashboard link remains at `/dashboard`
- Role-based link visibility works correctly

---

### Task 5: Update middleware with granular matchers and role-based protection
**Implementation:**
- Update `middleware.ts`:
  - Change matcher from `['/dashboard/:path*', ...]` to `['/dashboard', '/gigs/:path*', '/profile/:path*', '/login', '/register', '/admin/:path*']`
  - Add role-based checks:
    - `/gigs` (browse page only) → SPECIALIST only, redirect CLIENT to `/dashboard?error=gigs-specialists-only`
    - `/gigs/new` → CLIENT only, redirect SPECIALIST to `/dashboard?error=gig-creation-clients-only`
    - `/gigs/[id]` and `/gigs/examples` → allow both roles
  - Update redirects from auth pages: authenticated users accessing `/login` or `/register` → redirect to `/dashboard`
  - Keep existing admin route protection unchanged (redirect to `/dashboard`)
- Add helper function to distinguish between `/gigs` (browse) and `/gigs/*` (other pages)

**Test Plan:**
```bash
# Integration tests - create new file
# __tests__/integration/route-protection.test.ts

# Test scenarios:
# - Unauthenticated user accessing /dashboard → redirect to /login
# - Unauthenticated user accessing /gigs → redirect to /login
# - CLIENT accessing /gigs → redirect to /dashboard?error=gigs-specialists-only
# - SPECIALIST accessing /gigs/new → redirect to /dashboard?error=gig-creation-clients-only
# - Authenticated user accessing /login → redirect to /dashboard
# - SPECIALIST accessing /gigs → allow
# - CLIENT accessing /gigs/new → allow
# - Both roles accessing /gigs/[id] → allow
# - Both roles accessing /gigs/examples → allow

# Manual verification
# Test all scenarios above in browser
# Verify error messages display on /dashboard page
```

**Acceptance Criteria:**
- Middleware protects all new routes
- Role-based access control enforced at routing level (before page load)
- Error messages passed via query parameters
- All redirects point to `/dashboard` (not `/home`)
- Browse gigs blocked for CLIENTs at middleware level
- Gig creation blocked for SPECIALISTs at middleware level

---

## Phase 2: Update Internal Links and Redirects

### Task 6: Update all internal links in components
**Implementation:**
- Search for all hardcoded `/dashboard/gigs` and `/dashboard/profile` links:
  ```bash
  grep -r "href=\"/dashboard/gigs\|href=\"/dashboard/profile" app --include="*.tsx"
  ```
- Update each link to new route structure:
  - `/dashboard/gigs` → `/gigs`
  - `/dashboard/gigs/[id]` → `/gigs/[id]`
  - `/dashboard/gigs/new` → `/gigs/new`
  - `/dashboard/gigs/examples` → `/gigs/examples`
  - `/dashboard/profile` → `/profile`
  - `/dashboard/profile/edit` → `/profile/edit`
  - `/dashboard/profile/[userId]` → `/profile/[userId]`
  - Keep `/dashboard` links unchanged
- Files to update:
  - `app/(protected)/dashboard/page.tsx` (gig links, profile edit links)
  - `app/(protected)/dashboard/SpecialistDashboardTabs.tsx` (browse gigs link)
  - `app/(protected)/gigs/new/gig-form.tsx` (examples link)
  - `app/(protected)/profile/page.tsx` (edit profile link)
  - `app/(protected)/profile/edit/ProfileEditForm.tsx` (back to profile link)
  - `app/admin/page.tsx` (dashboard link - keep as `/dashboard`)
  - Any other components with nested dashboard links

**Test Plan:**
```bash
# Verify no old nested links remain in new route files
grep -r "href=\"/dashboard/gigs\|href=\"/dashboard/profile" app/\(protected\) --include="*.tsx"
# Should return no results

# Manual verification
# Click all links in the application
# Verify they navigate to correct routes
# Verify query parameters are preserved (e.g., ?from=dashboard)
```

**Acceptance Criteria:**
- All internal links updated to new route structure
- No hardcoded `/dashboard/gigs` or `/dashboard/profile` links in `app/(protected)/` directory
- `/dashboard` links remain unchanged
- All links navigate correctly
- Query parameters preserved in links

---

### Task 7: Update redirects in server actions
**Implementation:**
- Search for all `redirect('/dashboard/gigs')` and `redirect('/dashboard/profile')` calls:
  ```bash
  grep -r "redirect.*dashboard" app/actions --include="*.ts"
  ```
- Update each redirect to new route structure:
  - `redirect('/dashboard/gigs')` → `redirect('/gigs')`
  - `redirect('/dashboard/profile')` → `redirect('/profile')`
  - Keep `redirect('/dashboard')` unchanged
- Files to update:
  - `app/actions/auth.ts` (login, register redirects - should already be `/dashboard`)
  - `app/actions/gig.ts` (gig creation redirect, if any)
  - `app/actions/profile.ts` (profile update redirect, if any)

**Test Plan:**
```bash
# Integration tests (will pass after URL updates in Phase 3)
npm run test:unit -- auth.test.ts
npm run test:unit -- gig-creation.test.ts
npm run test:unit -- profile.test.ts

# Manual verification
# Register new user - should redirect to /dashboard
# Login - should redirect to /dashboard
# Create gig - should redirect to /gigs/[id]
# Update profile - should redirect to /profile
```

**Acceptance Criteria:**
- All server action redirects updated for nested routes
- No `redirect('/dashboard/gigs')` or `redirect('/dashboard/profile')` calls in server actions
- `redirect('/dashboard')` calls remain unchanged
- All redirects navigate to correct routes
- Integration tests pass

---

### Task 8: Implement backward compatibility redirects in next.config.ts
**Implementation:**
- Create or update `next.config.ts` (or `next.config.js` if using JS)
- Add `redirects` function with permanent redirects (HTTP 308) for nested routes only:
  ```typescript
  async redirects() {
    return [
      {
        source: '/dashboard/gigs',
        destination: '/gigs',
        permanent: true,
      },
      {
        source: '/dashboard/gigs/new',
        destination: '/gigs/new',
        permanent: true,
      },
      {
        source: '/dashboard/gigs/examples',
        destination: '/gigs/examples',
        permanent: true,
      },
      {
        source: '/dashboard/gigs/:id',
        destination: '/gigs/:id',
        permanent: true,
      },
      {
        source: '/dashboard/profile',
        destination: '/profile',
        permanent: true,
      },
      {
        source: '/dashboard/profile/edit',
        destination: '/profile/edit',
        permanent: true,
      },
      {
        source: '/dashboard/profile/:userId',
        destination: '/profile/:userId',
        permanent: true,
      },
    ]
  }
  ```
- Redirects preserve query parameters automatically
- NO redirect for `/dashboard` itself (it stays at the same URL)

**Test Plan:**
```bash
# E2E tests - create new file
# __tests__/e2e/backward-compatibility.spec.ts

# Test scenarios:
# - Navigate to /dashboard → NO redirect, shows dashboard page
# - Navigate to /dashboard/gigs → redirects to /gigs
# - Navigate to /dashboard/gigs/123 → redirects to /gigs/123
# - Navigate to /dashboard/gigs?search=react → redirects to /gigs?search=react
# - Navigate to /dashboard/profile → redirects to /profile
# - Navigate to /dashboard/profile/edit → redirects to /profile/edit

# Manual verification
# Test all old nested URLs in browser
# Verify they redirect to new URLs
# Verify query parameters are preserved
# Check Network tab for HTTP 308 status
# Verify /dashboard itself does NOT redirect
```

**Acceptance Criteria:**
- Old nested `/dashboard/gigs/*` and `/dashboard/profile/*` URLs redirect to new equivalents
- Redirects configured in `next.config.ts` (not dummy pages)
- Query parameters preserved automatically
- HTTP 308 (Permanent Redirect) status used
- `/dashboard` itself does NOT redirect (stays at same URL)
- Redirects work for all users (authenticated and unauthenticated)

---

## Phase 3: Update Test Suite

### Task 9: Update integration tests
**Implementation:**
- Update all test files that reference nested `/dashboard` routes:
  ```bash
  grep -r "/dashboard/gigs\|/dashboard/profile" __tests__/integration --include="*.test.ts"
  ```
- Update route references in test files:
  - `gig-browse-access.test.ts` - update `/dashboard/gigs` to `/gigs`
  - `gig-creation.test.ts` - update `/dashboard/gigs/new` to `/gigs/new`
  - `gig-lifecycle.test.ts` - update `/dashboard/gigs/[id]` to `/gigs/[id]`
  - `application-*.test.ts` - update `/dashboard/gigs/[id]` to `/gigs/[id]`
  - `messaging.test.ts` - update `/dashboard/gigs/[id]` to `/gigs/[id]`
  - `profile.test.ts` - update `/dashboard/profile/*` to `/profile/*`
  - `suspended-user-login.test.ts` - keep `/dashboard` unchanged
  - Any other tests with nested dashboard references
- Keep `/dashboard` references unchanged (not nested routes)
- Run tests after each file update to verify changes

**Test Plan:**
```bash
# Run all integration tests
npm run test:unit

# Verify all tests pass
# Check for any remaining nested /dashboard references in test output
```

**Acceptance Criteria:**
- All integration tests updated to new route structure
- All integration tests pass
- No `/dashboard/gigs` or `/dashboard/profile` references in test files (except backward compatibility tests)
- `/dashboard` references remain unchanged

---

### Task 10: Update E2E tests
**Implementation:**
- Update all E2E test files that reference nested `/dashboard` routes:
  ```bash
  grep -r "/dashboard/gigs\|/dashboard/profile" __tests__/e2e --include="*.spec.ts"
  ```
- Update route references in E2E test files:
  - `client-journey.spec.ts` - update nested routes to new structure
  - `specialist-journey.spec.ts` - update nested routes to new structure (if exists)
  - `gig-browse-access.spec.ts` - update `/dashboard/gigs` to `/gigs`
  - `application-withdrawal.spec.ts` - update `/dashboard/gigs/[id]` to `/gigs/[id]`
  - `admin-moderation.spec.ts` - keep `/dashboard` redirects unchanged
  - `error-scenarios.spec.ts` - update nested routes to new structure
  - `pagination.spec.ts` - update `/dashboard/gigs` to `/gigs`
  - Any other E2E tests with nested dashboard references
- Keep `/dashboard` references unchanged (not nested routes)
- Run E2E tests after each file update

**Test Plan:**
```bash
# Run all E2E tests
npm run test:e2e

# Verify all tests pass
# Check for any remaining nested /dashboard references in test output
```

**Acceptance Criteria:**
- All E2E tests updated to new route structure
- All E2E tests pass
- No `/dashboard/gigs` or `/dashboard/profile` references in E2E test files (except backward compatibility tests)
- `/dashboard` references remain unchanged

---

## Phase 4: Cleanup and Documentation

### Task 11: Remove old dashboard directory and update documentation
**Implementation:**
- Delete the old `app/dashboard/` directory completely:
  ```bash
  rm -rf app/dashboard
  ```
- Verify no broken imports:
  ```bash
  npm run build
  ```
- Update `openspec/project.md`:
  - Add this change to "Completed Changes" section
  - Update "Current State" with new route structure
  - Update any route references in existing completed changes
- Update `README.md` (if exists):
  - Update route structure documentation
  - Update any examples with new URLs
- Update `TESTING.md`:
  - Update route references in testing examples
  - Document new route structure for test writers

**Test Plan:**
```bash
# Verify build succeeds
npm run build

# Verify application works correctly
npm run dev
# Test all major user flows
# Verify redirects still work (configured in next.config.ts)

# Run full test suite
npm test
npm run test:e2e

# Manual documentation review
# Read through all documentation
# Verify nested /dashboard routes are updated (except in "Completed Changes" history)
# Verify /dashboard itself remains as the main authenticated hub
```

**Acceptance Criteria:**
- Old `app/dashboard/` directory deleted
- Application builds successfully
- All tests pass
- No broken imports or references
- Project documentation updated with new route structure
- Testing documentation updated
- Backward compatibility redirects continue working via `next.config.ts`
- Documentation clearly shows `/dashboard` remains as main hub, with gigs and profile un-nested

---

## Summary

**Total Tasks**: 11
**Estimated Time**: 7-10 days

**Critical Path**:
1. Tasks 1-5 (Phase 1): Create new routes with Route Groups and middleware - 3-4 days
2. Tasks 6-8 (Phase 2): Update internal links and add redirects - 2 days
3. Tasks 9-10 (Phase 3): Update tests - 2-3 days
4. Task 11 (Phase 4): Cleanup and documentation - 1 day

**Key Architectural Decisions**:
- Use Next.js Route Groups `app/(protected)/` with single shared layout (no duplication)
- Implement redirects in `next.config.ts` (no dummy redirect pages)
- Applications remain on `/dashboard` page in tabs (no separate `/applications` route)
- `/dashboard` stays at same URL as main authenticated hub
- Gigs and profile routes un-nested to top level (`/gigs/*`, `/profile/*`)
- Middleware enforces role-based access before page load

**Risk Mitigation**:
- Implement new routes in parallel to existing routes (no breaking changes until Phase 4)
- Test each phase thoroughly before proceeding
- Keep redirects permanently in `next.config.ts` for backward compatibility
- Update tests incrementally to catch issues early

**Success Criteria**:
- All functionality works identically to before
- All tests pass (integration and E2E)
- Old nested URLs redirect to new structure via `next.config.ts`
- `/dashboard` remains at same URL as main authenticated hub
- No performance degradation
- Clean, maintainable route structure using Next.js best practices
- Single shared layout eliminates duplication
