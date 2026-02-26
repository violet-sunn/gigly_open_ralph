# Implementation Tasks

## Task 1: Create getRecentMessages Server Action

**Implementation:**
- Create new server action `getRecentMessages` in `app/actions/message.ts`
- Query ALL gigs where user is owner (CLIENT) or assigned specialist (SPECIALIST)
- For each gig, get only the most recent message (not all messages)
- Implementation approach:
  - Query gigs with messages where user is involved
  - Use Prisma to include messages with `orderBy: { createdAt: 'desc' }` and `take: 1`
  - This gives us the most recent message per gig
- Transform results to return: `{ gigId, gigTitle, senderName, contentPreview, createdAt }`
- Content preview: first 50 characters with "..." if truncated
- Sender name: use `specialistProfile.displayName` or `clientProfile.companyName` or fallback to email
- Sort final results by message timestamp (most recent first)

**Test Plan:**
```bash
# Create integration test: __tests__/integration/dashboard-messages.test.ts
npm test dashboard-messages

# Test scenarios:
# 1. CLIENT user sees one message per owned gig
# 2. SPECIALIST user sees one message per assigned gig
# 3. Returns most recent message for each gig (not all messages)
# 4. Multiple messages on same gig: only latest is returned
# 5. Content preview truncates at 50 chars
# 6. Sender name uses display name when available
# 7. Returns empty array when no messages
# 8. Only includes gigs with assigned specialist
# 9. Results sorted by message timestamp (newest first)
```

---

## Task 2: Update Dashboard Messages Card Component

**Implementation:**
- Update `app/(protected)/dashboard/page.tsx` to call `getRecentMessages()`
- Pass messages data to Messages card in sidebar
- Update Messages card JSX to map over messages array
- Each message item should display:
  - Gig title in bold white text (primary info)
  - Sender name in smaller gray text
  - Content preview in gray text (truncated)
  - Relative timestamp using `formatDistanceToNow` from `date-fns`
- Wrap message items in `Link` component to `/gigs/[gigId]#messages` (with hash fragment)
- Add hover state: `hover:bg-navy-700 transition-colors`
- Use `max-h-80 overflow-y-auto` for scrolling (allows viewing all gigs, no hard limit)
- Keep empty state: "No recent messages" when array is empty
- Visual hierarchy: gig title most prominent, then sender/preview/time

**Test Plan:**
```bash
# Manual testing:
# 1. Navigate to dashboard as CLIENT with messages on multiple gigs
# 2. Verify one entry per gig (not multiple messages from same gig)
# 3. Verify gig title is prominently displayed
# 4. Click message item, verify navigation to gig detail page
# 5. Verify page automatically scrolls to messages section
# 6. Navigate to dashboard as SPECIALIST with messages
# 7. Verify messages from assigned gigs only
# 8. Test with user who has no messages (empty state)
# 9. Test with user who has many gigs with messages (scrolling works)
# 10. Test responsive behavior on mobile

# E2E test: __tests__/e2e/dashboard-messages.spec.ts
npm run test:e2e dashboard-messages
```

---

## Task 2.5: Add ID Attribute to Gig Detail Messages Section

**Implementation:**
- Update `app/(protected)/gigs/[id]/page.tsx`
- Find the messages section container (the div wrapping MessageList and MessageForm)
- Add `id="messages"` attribute to the messages section container
- This enables hash fragment navigation from dashboard messages
- Example: `<div id="messages" className="bg-navy-800 border border-gray-700 rounded-lg p-8 shadow-md">`

**Test Plan:**
```bash
# Manual testing:
# 1. Navigate to any gig detail page
# 2. Inspect the messages section in browser dev tools
# 3. Verify the container has id="messages" attribute
# 4. Navigate to /gigs/[id]#messages in browser
# 5. Verify page automatically scrolls to messages section
# 6. Click message from dashboard, verify auto-scroll works
```

---

## Task 3: Redesign Profile Edit Form Header Card

**Implementation:**
- Update `app/(protected)/profile/edit/ProfileEditForm.tsx`
- Add header card section above the form
- Header card structure:
  ```tsx
  <div className="flex items-start gap-6 bg-navy-800 border border-gray-700 rounded-lg p-6 mb-6 shadow-md">
    {/* Avatar */}
    <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
      {/* Display first letter of name or email */}
    </div>

    {/* Info */}
    <div className="flex-1">
      <h1 className="text-2xl font-bold text-white">{name}</h1>
      <p className="text-gray-300 mt-1">{role}</p>
    </div>
  </div>
  ```
- Extract name from profile data (displayName/companyName or email)
- Display role as "Specialist" or "Client"

**Test Plan:**
```bash
# Manual testing:
# 1. Navigate to /profile/edit as SPECIALIST
# 2. Verify header card displays with avatar initial
# 3. Verify display name or email shown
# 4. Navigate to /profile/edit as CLIENT
# 5. Verify company name or email shown
# 6. Compare visually with /profile page header
# 7. Test responsive behavior on mobile
```

---

## Task 4: Implement 2-Column Grid Layout for Edit Form

**Implementation:**
- Update `ProfileEditForm` component to use 2-column grid
- Wrap form fields in grid container: `<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">`
- **SPECIALIST layout:**
  - Left column card: Display Name, Tech Stack, Experience Level
  - Right column card: Bio (full height textarea)
- **CLIENT layout:**
  - Left column card: Company Name, INN, KPP
  - Right column card: Contact Person, Phone Number
- Each column wrapped in card: `<div className="bg-navy-800 border border-gray-700 rounded-lg p-6 shadow-md">`
- Move Save/Cancel buttons outside grid (below, full width)
- Maintain all existing field names, validation, and defaultValue props
- Keep error display at top of form (above grid)

**Test Plan:**
```bash
# Manual testing:
# 1. Navigate to /profile/edit as SPECIALIST
# 2. Verify 2-column layout on desktop (>1024px)
# 3. Verify fields organized correctly in columns
# 4. Verify single column on mobile (<1024px)
# 5. Fill out form and submit, verify save works
# 6. Test validation errors display correctly
# 7. Click Cancel, verify navigation to /profile
# 8. Repeat for CLIENT user
# 9. Compare layout with /profile page visually

# Integration test: __tests__/integration/profile-edit-layout.test.ts
npm test profile-edit-layout

# Test scenarios:
# 1. Form renders with 2-column grid structure
# 2. Header card displays correctly
# 3. All form fields present and functional
# 4. Save button submits form successfully
# 5. Cancel button navigates to /profile
```

---

## Task 5: Add date-fns Dependency for Relative Timestamps

**Implementation:**
- Install date-fns: `npm install date-fns`
- Import `formatDistanceToNow` in dashboard page
- Use for message timestamps: `formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })`
- This will display "2 hours ago", "3 days ago", etc.

**Test Plan:**
```bash
# Verify installation:
npm list date-fns

# Manual testing:
# 1. View dashboard with messages
# 2. Verify timestamps display as relative time
# 3. Verify "ago" suffix is present
```

---

## Task 6: Update Page Container Width for Consistency

**Implementation:**
- Update `app/(protected)/profile/edit/page.tsx` or `ProfileEditForm.tsx`
- Change container from `max-w-2xl` to `max-w-7xl` to match profile view page
- Ensure consistent padding: `px-4 py-8`
- This allows the 2-column grid to have proper spacing

**Test Plan:**
```bash
# Manual testing:
# 1. Navigate to /profile and /profile/edit
# 2. Compare container widths (should be identical)
# 3. Verify proper spacing on both pages
# 4. Test on various screen sizes (mobile, tablet, desktop)
```

---

## Task 7: Integration Testing and Verification

**Implementation:**
- Run full test suite to ensure no regressions
- Verify all existing tests pass
- Add new integration tests for dashboard messages (one message per gig)
- Add new tests for profile edit layout
- Manual QA checklist:
  - Dashboard messages display one entry per gig (not multiple from same gig)
  - All gigs with messages are visible (scrollable, no hard limit)
  - Message navigation works correctly
  - Profile edit layout matches profile view
  - Form submission still works
  - Validation still works
  - Responsive behavior correct on all pages

**Test Plan:**
```bash
# Run full test suite:
npm test

# Expected: All existing tests pass + new tests pass

# Run E2E tests:
npm run test:e2e

# Manual QA:
# 1. Test dashboard messages for both roles (CLIENT and SPECIALIST)
# 2. Verify one message per gig (create multiple messages on same gig, verify only latest shows)
# 3. Verify scrolling works with many gigs
# 4. Test profile edit for both roles
# 5. Test navigation flows
# 6. Test form submission and validation
# 7. Test responsive behavior on mobile
# 8. Verify visual consistency between profile view and edit
```

---

## Completion Checklist

- [ ] Task 1: getRecentMessages server action created and tested
- [ ] Task 2: Dashboard messages card displays actual messages
- [ ] Task 3: Profile edit header card implemented
- [ ] Task 4: Profile edit 2-column grid layout implemented
- [ ] Task 5: date-fns installed and used for timestamps
- [ ] Task 6: Container widths consistent across profile pages
- [ ] Task 7: All tests passing, manual QA complete
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors: `npm run type-check` (if available)
- [ ] Visual regression testing complete
