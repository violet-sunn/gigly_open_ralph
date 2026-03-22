# Tasks: Add Consistent Back Button Navigation

## Task 1: Update BackButton component to handle new contexts

**Implementation:**
- Open `app/components/BackButton.tsx`
- Add new context handlers in the component logic:
  - `from=profile` → href: `/dashboard/profile`, text: `← Back to Profile`
  - `from=admin-dashboard` → href: `/admin`, text: `← Back to Admin Dashboard`
  - `from=examples` → href: `/dashboard/gigs/examples`, text: `← Back to Examples`
  - `from=dashboard` → href: `/dashboard`, text: `← Back to Dashboard`
- Preserve existing `from=browse` logic with filter/pagination preservation
- Ensure component returns null if `from` parameter is not recognized

**Test Plan:**
- Unit test: Verify each context returns correct href and text
- Unit test: Verify `from=browse` still preserves query parameters
- Unit test: Verify component returns null for unknown contexts
- Manual test: Navigate to a page with each `from` parameter and verify correct back link

---

## Task 2: Add BackButton to profile edit page

**Implementation:**
- Open `app/(protected)/profile/edit/page.tsx`
- Import BackButton component
- Add BackButton at the top of the page content (before the form)
- Wrap BackButton in Suspense boundary (required for useSearchParams)

**Test Plan:**
- Navigate to `/profile/edit?from=profile`
- Verify BackButton appears with text "← Back to Profile"
- Click BackButton and verify navigation to `/dashboard/profile`
- Navigate to `/profile/edit` without `from` param
- Verify BackButton does not render

---

## Task 3: Add BackButton to gig creation page

**Implementation:**
- Open `app/(protected)/gigs/new/page.tsx`
- Import BackButton component
- Add BackButton at the top of the page content (before the form heading)
- Wrap BackButton in Suspense boundary

**Test Plan:**
- Navigate to `/gigs/new?from=dashboard`
- Verify BackButton appears with text "← Back to Dashboard"
- Click BackButton and verify navigation to `/dashboard`
- Navigate to `/gigs/new` without `from` param
- Verify BackButton does not render

---

## Task 4: Replace manual back link in admin users page with BackButton

**Implementation:**
- Open `app/admin/users/page.tsx`
- Import BackButton component
- Replace the manual Link component (lines 172-176) with BackButton wrapped in Suspense
- Remove the hardcoded "← Back to Admin Dashboard" link

**Test Plan:**
- Navigate to `/admin/users?from=admin-dashboard`
- Verify BackButton appears with text "← Back to Admin Dashboard"
- Click BackButton and verify navigation to `/admin`
- Verify pagination and filters still work correctly
- Navigate to `/admin/users` without `from` param
- Verify BackButton does not render (graceful degradation)

---

## Task 5: Replace manual back link in admin gigs page with BackButton

**Implementation:**
- Open `app/admin/gigs/page.tsx`
- Import BackButton component
- Replace the manual Link component (lines 185-189) with BackButton wrapped in Suspense
- Remove the hardcoded "← Back to Admin Dashboard" link

**Test Plan:**
- Navigate to `/admin/gigs?from=admin-dashboard`
- Verify BackButton appears with text "← Back to Admin Dashboard"
- Click BackButton and verify navigation to `/admin`
- Verify pagination and filters still work correctly
- Navigate to `/admin/gigs` without `from` param
- Verify BackButton does not render (graceful degradation)

---

## Task 6: Add BackButton to public profile page

**Implementation:**
- Open `app/(protected)/profile/[userId]/page.tsx`
- Import BackButton component
- Add BackButton at the top of the page content (before the heading)
- Wrap BackButton in Suspense boundary

**Test Plan:**
- Navigate to `/profile/[userId]?from=dashboard`
- Verify BackButton appears with text "← Back to Dashboard"
- Click BackButton and verify navigation to `/dashboard`
- Navigate to `/profile/[userId]` without `from` param
- Verify BackButton does not render

---

## Task 7: Add BackButton to examples page

**Implementation:**
- Open `app/(protected)/gigs/examples/page.tsx`
- Import BackButton component
- Add BackButton at the top of the page content (before the heading)
- Wrap BackButton in Suspense boundary

**Test Plan:**
- Navigate to `/gigs/examples?from=dashboard`
- Verify BackButton appears with text "← Back to Dashboard"
- Click BackButton and verify navigation to `/dashboard`
- Navigate to `/gigs/examples` without `from` param
- Verify BackButton does not render

---

## Task 8: Update navigation links to include from parameter

**Implementation:**
- Update links to profile edit page to include `?from=profile`:
  - In `app/(protected)/profile/page.tsx` (multiple "Edit Profile" / "Редактировать профиль" links)
- Update links to gig creation to include `?from=dashboard`:
  - In client dashboard pages where "Post a Gig" / "Create Gig" links appear
- Update links to admin pages from admin dashboard to include `?from=admin-dashboard`:
  - In `app/admin/page.tsx` (links to `/admin/users` and `/admin/gigs`)
- Update links to public profiles to include `?from=dashboard`:
  - In application lists and gig details where specialist names link to profiles
- Update links to examples page to include `?from=dashboard`:
  - In gig creation form (existing link at line 52 of gig-form.tsx)

**Test Plan:**
- Click each updated link and verify `from` parameter is present in URL
- Verify BackButton appears on destination page
- Click BackButton and verify correct navigation back
- Test all navigation flows end-to-end

---

## Task 9: Write integration tests for BackButton contexts

**Implementation:**
- Create `__tests__/integration/back-button.test.ts`
- Test each context handler:
  - `from=profile` → correct href and text
  - `from=admin-dashboard` → correct href and text
  - `from=examples` → correct href and text
  - `from=dashboard` → correct href and text
  - `from=browse` → preserves query parameters
- Test null return for unknown contexts
- Test null return when no `from` parameter

**Test Plan:**
- Run `npm test` and verify all tests pass
- Verify test coverage includes all new contexts

---

## Task 10: Write E2E tests for back button navigation flows

**Implementation:**
- Create `__tests__/e2e/back-button-navigation.spec.ts`
- Test navigation flows:
  - Profile → Profile Edit → Back to Profile
  - Dashboard → Gig Creation → Back to Dashboard
  - Admin Dashboard → Admin Users → Back to Admin Dashboard
  - Admin Dashboard → Admin Gigs → Back to Admin Dashboard
  - Dashboard → Public Profile → Back to Dashboard
  - Dashboard → Examples → Back to Dashboard
- Test that back button preserves browse filters/pagination

**Test Plan:**
- Run `npm run test:e2e` and verify all tests pass
- Manually test each flow in browser to confirm E2E tests are accurate
