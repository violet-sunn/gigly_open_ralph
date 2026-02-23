# Implementation Tasks: Specialist Active Gigs Dashboard

## Task 1: Add Active Gigs Query to Specialist Dashboard

**Implementation:**
- Modify `app/dashboard/page.tsx` in the SPECIALIST role section
- Add Prisma query to fetch active gigs where `assignedSpecialistId === session.userId`
- Include client relation with clientProfile for company name display
- Filter by status: IN_PROGRESS, REVIEW, COMPLETED, PAID
- Order by `updatedAt DESC` to show most recent activity first

**Code Location:**
- File: `app/dashboard/page.tsx`
- Section: Inside the `if (session.role === 'SPECIALIST')` block, before the applications query

**Query Structure:**
```typescript
const activeGigs = await prisma.gig.findMany({
  where: {
    assignedSpecialistId: session.userId,
    status: { in: ['IN_PROGRESS', 'REVIEW', 'COMPLETED', 'PAID'] }
  },
  include: {
    client: {
      select: {
        email: true,
        clientProfile: true
      }
    }
  },
  orderBy: { updatedAt: 'desc' }
});
```

**Test Plan:**
- Unit test: Verify query returns only gigs where user is assigned specialist
- Unit test: Verify query filters by correct statuses (excludes OPEN)
- Unit test: Verify query orders by updatedAt DESC
- Unit test: Verify query includes client and clientProfile relations
- Integration test: Create test gigs with different statuses and verify correct filtering
- Integration test: Verify specialist sees only their assigned gigs, not others

---

## Task 2: Create Active Gigs Section UI Component

**Implementation:**
- Add "Active Gigs" section to specialist dashboard JSX
- Position above "My Applications" section
- Create section heading: "Active Gigs" or "My Active Gigs"
- Implement empty state with helpful message and link to `/dashboard/gigs`
- Use consistent styling with existing dashboard sections

**Code Location:**
- File: `app/dashboard/page.tsx`
- Section: Inside the SPECIALIST dashboard return statement, before "My Applications"

**UI Structure:**
```tsx
<div className="mb-8">
  <h2 className="text-2xl font-bold mb-4">Active Gigs</h2>
  {activeGigs.length === 0 ? (
    <p className="text-gray-600">
      No active gigs yet.{' '}
      <Link href="/dashboard/gigs" className="text-indigo-600 hover:text-indigo-800">
        Browse and apply to gigs
      </Link>{' '}
      to get started.
    </p>
  ) : (
    <ul className="space-y-4">
      {/* Gig items will be added in Task 3 */}
    </ul>
  )}
</div>
```

**Test Plan:**
- E2E test: Verify "Active Gigs" section appears on specialist dashboard
- E2E test: Verify section is positioned above "My Applications"
- E2E test: Verify empty state message when no active gigs
- E2E test: Verify empty state link navigates to `/dashboard/gigs`
- Visual test: Verify section styling matches existing dashboard sections

---

## Task 3: Implement Active Gig List Items

**Implementation:**
- Map over `activeGigs` array to render individual gig items
- Each item wrapped in `<Link>` to `/dashboard/gigs/[id]`
- Display: title, budget (formatted), status badge, client name, date
- Add hover styling for clickable affordance
- Convert budget from kopecks to roubles with formatting
- Show client company name if available, otherwise email

**Code Location:**
- File: `app/dashboard/page.tsx`
- Section: Inside the `<ul>` element in the Active Gigs section

**UI Structure:**
```tsx
{activeGigs.map((gig) => (
  <li key={gig.id}>
    <Link
      href={`/dashboard/gigs/${gig.id}`}
      className="block p-4 border rounded hover:bg-gray-50 transition"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{gig.title}</h3>
          <p className="text-sm text-gray-600">
            Client: {gig.client.clientProfile?.companyName || gig.client.email}
          </p>
          <p className="text-sm text-gray-500">
            Updated: {new Date(gig.updatedAt).toLocaleDateString('ru-RU')}
          </p>
        </div>
        <div className="text-right">
          <p className="font-semibold">{(gig.budget / 100).toLocaleString('ru-RU')} ₽</p>
          {/* Status badge will be added in Task 4 */}
        </div>
      </div>
    </Link>
  </li>
))}
```

**Test Plan:**
- E2E test: Verify each active gig displays title, budget, client, and date
- E2E test: Verify clicking gig item navigates to gig detail page
- E2E test: Verify hover state changes background color
- E2E test: Verify budget formatted correctly with thousands separators
- E2E test: Verify client company name displayed when available
- E2E test: Verify client email displayed when company name not available
- E2E test: Verify date formatted with 'ru-RU' locale
- Integration test: Verify budget conversion from kopecks to roubles

---

## Task 4: Add Status Badges with Color Coding

**Implementation:**
- Create status badge component or inline badge rendering
- Map gig status to badge text and color classes
- Use consistent color scheme:
  - IN_PROGRESS: blue (bg-blue-100 text-blue-800)
  - REVIEW: amber (bg-amber-100 text-amber-800)
  - COMPLETED: green (bg-green-100 text-green-800)
  - PAID: green (bg-green-100 text-green-800)
- For PAID status, also display payment date

**Code Location:**
- File: `app/dashboard/page.tsx`
- Section: Inside the gig list item, in the right column

**Badge Implementation:**
```tsx
{/* Status badge */}
<span className={`
  inline-block px-2 py-1 text-xs font-semibold rounded
  ${gig.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' : ''}
  ${gig.status === 'REVIEW' ? 'bg-amber-100 text-amber-800' : ''}
  ${gig.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : ''}
  ${gig.status === 'PAID' ? 'bg-green-100 text-green-800' : ''}
`}>
  {gig.status === 'IN_PROGRESS' && 'In Progress'}
  {gig.status === 'REVIEW' && 'Under Review'}
  {gig.status === 'COMPLETED' && 'Completed - Awaiting Payment'}
  {gig.status === 'PAID' && 'Paid'}
</span>
{gig.status === 'PAID' && gig.paidAt && (
  <p className="text-xs text-gray-500 mt-1">
    Paid: {new Date(gig.paidAt).toLocaleDateString('ru-RU')}
  </p>
)}
```

**Test Plan:**
- E2E test: Verify IN_PROGRESS gigs show blue "In Progress" badge
- E2E test: Verify REVIEW gigs show amber "Under Review" badge
- E2E test: Verify COMPLETED gigs show green "Completed - Awaiting Payment" badge
- E2E test: Verify PAID gigs show green "Paid" badge
- E2E test: Verify PAID gigs display payment date
- E2E test: Verify payment date formatted with 'ru-RU' locale
- Visual test: Verify badge colors match design specification

---

## Task 5: Add Integration Tests for Active Gigs Query

**Implementation:**
- Create test file: `__tests__/integration/specialist-active-gigs.test.ts`
- Test active gigs query with various scenarios
- Test filtering by assignedSpecialistId
- Test status filtering (includes IN_PROGRESS, REVIEW, COMPLETED, PAID; excludes OPEN)
- Test ordering by updatedAt DESC
- Test client relation includes

**Test Cases:**
1. Specialist with no active gigs returns empty array
2. Specialist with one IN_PROGRESS gig returns that gig
3. Specialist with multiple active gigs returns all in correct order
4. Query excludes OPEN gigs (even if specialist applied)
5. Query excludes gigs assigned to other specialists
6. Query includes client and clientProfile relations
7. Query orders by updatedAt DESC (most recent first)

**Test Plan:**
```typescript
describe('Specialist Active Gigs Query', () => {
  it('returns empty array when specialist has no active gigs', async () => {
    // Create specialist user
    // Query active gigs
    // Assert empty array
  });

  it('returns IN_PROGRESS gig assigned to specialist', async () => {
    // Create specialist and client
    // Create gig with assignedSpecialistId = specialist.id, status = IN_PROGRESS
    // Query active gigs
    // Assert gig is returned
  });

  it('excludes OPEN gigs even if specialist applied', async () => {
    // Create specialist, client, OPEN gig
    // Create application from specialist
    // Query active gigs
    // Assert empty array (OPEN gigs not included)
  });

  it('excludes gigs assigned to other specialists', async () => {
    // Create two specialists
    // Create gig assigned to specialist A
    // Query active gigs for specialist B
    // Assert empty array
  });

  it('returns gigs in all active statuses', async () => {
    // Create specialist and client
    // Create gigs with statuses: IN_PROGRESS, REVIEW, COMPLETED, PAID
    // Query active gigs
    // Assert all 4 gigs returned
  });

  it('orders gigs by updatedAt DESC', async () => {
    // Create specialist and client
    // Create 3 gigs with different updatedAt timestamps
    // Query active gigs
    // Assert order is most recent first
  });

  it('includes client and clientProfile relations', async () => {
    // Create specialist, client with profile
    // Create gig assigned to specialist
    // Query active gigs
    // Assert client and clientProfile are included
  });
});
```

---

## Task 6: Add E2E Tests for Specialist Dashboard

**Implementation:**
- Create or modify test file: `__tests__/e2e/specialist-dashboard.spec.ts`
- Test Active Gigs section rendering and interaction
- Test navigation from dashboard to gig detail page
- Test empty state display
- Test status badge display

**Test Cases:**
1. Active Gigs section appears on specialist dashboard
2. Empty state shows when no active gigs
3. Active gigs display with correct information
4. Clicking active gig navigates to gig detail page
5. Status badges display with correct colors
6. PAID gigs show payment date
7. Client company name displayed when available
8. Client email displayed when company name not available

**Test Plan:**
```typescript
test.describe('Specialist Dashboard - Active Gigs', () => {
  test('shows Active Gigs section above My Applications', async ({ page }) => {
    // Register and login as specialist
    // Navigate to dashboard
    // Assert "Active Gigs" heading exists
    // Assert section is above "My Applications"
  });

  test('shows empty state when no active gigs', async ({ page }) => {
    // Register and login as specialist
    // Navigate to dashboard
    // Assert empty state message displayed
    // Assert link to browse gigs exists
  });

  test('displays active gig with all information', async ({ page }) => {
    // Create specialist, client, and IN_PROGRESS gig
    // Login as specialist
    // Navigate to dashboard
    // Assert gig title, budget, status, client, date displayed
  });

  test('navigates to gig detail when clicking active gig', async ({ page }) => {
    // Create specialist and active gig
    // Login as specialist
    // Click on active gig
    // Assert navigated to /dashboard/gigs/[id]
  });

  test('shows correct status badges for different statuses', async ({ page }) => {
    // Create specialist and gigs with different statuses
    // Login as specialist
    // Assert IN_PROGRESS shows blue badge
    // Assert REVIEW shows amber badge
    // Assert COMPLETED shows green badge
    // Assert PAID shows green badge with date
  });
});
```

---

## Task 7: Manual Testing and QA

**Implementation:**
- Perform manual testing of the complete feature
- Test on different screen sizes (desktop, tablet, mobile)
- Test with various data scenarios
- Verify accessibility with keyboard navigation and screen readers

**Test Scenarios:**
1. **Empty State:**
   - New specialist with no applications → shows empty state
   - Specialist with only PENDING applications → shows empty state

2. **Single Active Gig:**
   - Specialist with one IN_PROGRESS gig → displays correctly
   - Click gig → navigates to detail page
   - Verify messaging and work submission available on detail page

3. **Multiple Active Gigs:**
   - Specialist with 5+ active gigs in different statuses
   - Verify all displayed in correct order (most recent first)
   - Verify status badges correct for each

4. **Client Name Display:**
   - Gig with client that has companyName → shows company name
   - Gig with client without companyName → shows email

5. **PAID Gigs:**
   - Verify PAID badge displays
   - Verify payment date displays and is formatted correctly

6. **Responsive Design:**
   - Test on mobile (320px width) → layout stacks correctly
   - Test on tablet (768px width) → layout adapts
   - Test on desktop (1920px width) → layout looks good

7. **Accessibility:**
   - Tab through dashboard with keyboard → all links focusable
   - Use screen reader → headings and links announced correctly
   - Verify color contrast meets WCAG standards

**Test Plan:**
- [ ] Empty state displays correctly
- [ ] Single active gig displays all information
- [ ] Multiple active gigs display in correct order
- [ ] Status badges show correct colors and text
- [ ] PAID gigs show payment date
- [ ] Client company name displays when available
- [ ] Client email displays when company name not available
- [ ] Clicking gig navigates to detail page
- [ ] Layout responsive on mobile, tablet, desktop
- [ ] Keyboard navigation works correctly
- [ ] Screen reader announces content correctly
- [ ] Color contrast meets accessibility standards

---

## Summary

**Total Tasks:** 7
**Estimated Effort:** 4-6 hours
**Risk Level:** Low (additive change, no modifications to existing functionality)

**Dependencies:**
- All required database fields and relations already exist
- All required server actions already exist (messaging, work submission)
- Gig detail page already has full functionality

**Rollout:**
1. Implement Tasks 1-4 (core functionality)
2. Implement Task 5 (integration tests)
3. Implement Task 6 (E2E tests)
4. Perform Task 7 (manual QA)
5. Deploy to production
6. Monitor for issues or user feedback
