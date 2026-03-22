# Implementation Tasks

## Task 1: Database Schema Changes
**Objective:** Add user guidance state tracking fields to User model.

**Implementation:**
1. Update `prisma/schema.prisma`:
   - Add four boolean fields to User model:
     ```prisma
     hasCreatedFirstGig              Boolean @default(false)
     hasSubmittedFirstApplication    Boolean @default(false)
     gigCreationGuidanceDismissed    Boolean @default(false)
     applicationGuidanceDismissed    Boolean @default(false)
     ```
2. Create migration: `npx prisma migrate dev --name add-user-guidance-fields`
3. Verify migration sets default values for existing users
4. Run migration: `npx prisma migrate deploy` (or dev applies automatically)
5. Regenerate Prisma client: `npx prisma generate`

**Test Plan:**
- Verify migration creates fields with correct defaults
- Check existing users have all four fields set to false
- Verify new users created after migration have default values
- Test Prisma client includes new fields in User type
- Run: `npx prisma studio` and inspect User table

**Files Modified:**
- `prisma/schema.prisma`
- `prisma/migrations/YYYYMMDDHHMMSS_add_user_guidance_fields/migration.sql` (generated)

---

## Task 2: Create UI Components (Tooltip, InfoIcon, HelpBanner)
**Objective:** Build reusable components for displaying contextual guidance.

**Implementation:**
1. Install Radix UI Tooltip (if not already installed):
   ```bash
   npm install @radix-ui/react-tooltip
   ```

2. Create `app/components/ui/InfoIcon.tsx`:
   - SVG circle with "i" icon
   - 16x16px default size
   - Neutral colors from design tokens
   - Hover state (cursor pointer, color change)
   - Keyboard accessible (tabIndex={0}, onKeyDown handlers)
   - ARIA label: "More information"

3. Create `app/components/ui/Tooltip.tsx`:
   - Wrap Radix UI Tooltip primitive
   - Props: `content: string`, `children: ReactNode`, `position?: 'top' | 'bottom' | 'left' | 'right'`
   - Hover on desktop, click on mobile
   - Max-width: 300px
   - Smooth fade animation (150ms)
   - ARIA attributes: aria-describedby, role="tooltip"
   - Viewport-aware positioning

4. Create `app/components/ui/HelpBanner.tsx`:
   - Props: `title?: string`, `children: ReactNode`, `onDismiss: () => void`
   - Light blue background (bg-blue-50), blue border
   - Dismiss button (X icon) in top-right
   - Fade-out animation on dismiss (200ms)
   - ARIA: role="region", aria-label="Help information"
   - Responsive: full width mobile, max-width desktop
   - Support ReactNode children (links, formatting)

**Test Plan:**
- Visual test: Render each component in isolation
- Accessibility test: Keyboard navigation, screen reader announcements
- Mobile test: Touch targets ≥44x44px, click behavior works
- Tooltip positioning: Test near viewport edges
- HelpBanner dismissal: Verify fade-out animation, onDismiss callback
- Run: `npm run dev` and manually test components

**Files Created:**
- `app/components/ui/InfoIcon.tsx`
- `app/components/ui/Tooltip.tsx`
- `app/components/ui/HelpBanner.tsx`

---

## Task 3: Create dismissGuidance Server Action
**Objective:** Persist user dismissal of guidance banners.

**Implementation:**
1. Create or update `app/actions/user.ts`:
   - Export `dismissGuidance` function with `'use server'`
   - Signature: `(type: 'gigCreation' | 'application') => Promise<{ error?: string }>`
   - Get session, redirect to /login if not authenticated
   - Validate type parameter (only 'gigCreation' or 'application')
   - Update corresponding field in User table:
     - 'gigCreation' → set `gigCreationGuidanceDismissed = true`
     - 'application' → set `applicationGuidanceDismissed = true`
   - Return `{}` on success, `{ error: string }` on failure
   - Handle errors gracefully (log, return error message)

**Test Plan:**
- Integration test: Call `dismissGuidance('gigCreation')`, verify field updated
- Integration test: Call `dismissGuidance('application')`, verify field updated
- Integration test: Invalid type returns error, no DB update
- Integration test: Unauthenticated user redirects to /login
- Integration test: Verify idempotency (calling twice doesn't error)
- Run: `npm run test:unit` (add tests to `__tests__/integration/user-actions.test.ts`)

**Files Created/Modified:**
- `app/actions/user.ts` (create if doesn't exist, or add to existing)
- `__tests__/integration/user-actions.test.ts` (create or add tests)

---

## Task 4: Update createGig Action to Track First Gig
**Objective:** Set `hasCreatedFirstGig = true` when user creates their first gig.

**Implementation:**
1. Update `app/actions/gig.ts` → `createGig` function:
   - After validation, before creating gig, fetch user's `hasCreatedFirstGig` value
   - If `hasCreatedFirstGig = false`, use Prisma transaction:
     ```typescript
     await prisma.$transaction([
       prisma.gig.create({ data: gigData }),
       prisma.user.update({
         where: { id: session.userId },
         data: { hasCreatedFirstGig: true }
       })
     ]);
     ```
   - If `hasCreatedFirstGig = true`, just create gig (no transaction needed)
   - Ensure error handling: if transaction fails, both operations roll back

**Test Plan:**
- Integration test: First gig creation sets `hasCreatedFirstGig = true`
- Integration test: Second gig creation leaves `hasCreatedFirstGig = true` (no change)
- Integration test: Failed gig creation (validation error) doesn't update user state
- Integration test: Transaction rollback on error (mock Prisma error)
- Run existing gig creation tests to ensure no regressions
- Run: `npm run test:unit` (update `__tests__/integration/gig-creation.test.ts`)

**Files Modified:**
- `app/actions/gig.ts`
- `__tests__/integration/gig-creation.test.ts`

---

## Task 5: Update applyToGig Action to Track First Application
**Objective:** Set `hasSubmittedFirstApplication = true` when user submits their first application.

**Implementation:**
1. Update `app/actions/gig.ts` → `applyToGig` function:
   - After validation, before creating application, fetch user's `hasSubmittedFirstApplication` value
   - If `hasSubmittedFirstApplication = false`, use Prisma transaction:
     ```typescript
     await prisma.$transaction([
       prisma.application.create({ data: applicationData }),
       prisma.user.update({
         where: { id: session.userId },
         data: { hasSubmittedFirstApplication: true }
       })
     ]);
     ```
   - If `hasSubmittedFirstApplication = true`, just create application (no transaction needed)
   - Ensure error handling: if transaction fails, both operations roll back

**Test Plan:**
- Integration test: First application sets `hasSubmittedFirstApplication = true`
- Integration test: Second application leaves `hasSubmittedFirstApplication = true` (no change)
- Integration test: Failed application (validation error) doesn't update user state
- Integration test: Transaction rollback on error (mock Prisma error)
- Run existing application tests to ensure no regressions
- Run: `npm run test:unit` (update `__tests__/integration/application.test.ts` or create if needed)

**Files Modified:**
- `app/actions/gig.ts`
- `__tests__/integration/application.test.ts` (or similar)

---

## Task 6: Add Guidance to Gig Creation Form
**Objective:** Display contextual guidance for first-time gig creators.

**Implementation:**
1. Update `app/dashboard/gigs/new/page.tsx`:
   - Fetch user's guidance state: `hasCreatedFirstGig`, `gigCreationGuidanceDismissed`
   - Pass guidance state to GigForm component as props

2. Update `app/dashboard/gigs/new/gig-form.tsx`:
   - Accept guidance state props: `showGuidance: boolean`
   - If `showGuidance = true`, render HelpBanner at top of form:
     - Text: "Creating your first gig? Clear requirements lead to better applications. Define what success looks like, provide context, and check out [example gigs](/dashboard/gigs/examples) for inspiration."
     - onDismiss: Call `dismissGuidance('gigCreation')` server action
   - Add InfoIcon + Tooltip to field labels:
     - "Acceptance Criteria": "Specific, measurable criteria that define when the work is complete. Example: 'API returns user data in JSON format with <200ms response time.'"
     - "Service Fee" preview: "Gigly charges a 10% service fee on top of your budget. You pay budget + 10%, the specialist receives the full budget amount."
     - "Goal": "What problem are you solving? Why does this work matter? Helps specialists understand the bigger picture."
     - "Deliverables": "What specific outputs do you expect? (e.g., 'Working API endpoint', 'Updated documentation', 'Test coverage report')"
     - "Constraints": "Any technical preferences, deadlines, or limitations? (e.g., 'Must use TypeScript', 'Deadline: 2 weeks', 'No external dependencies')"

**Test Plan:**
- E2E test: First-time user sees HelpBanner on gig creation form
- E2E test: User dismisses banner, banner disappears and doesn't reappear
- E2E test: User with `hasCreatedFirstGig = true` doesn't see banner
- E2E test: Tooltips appear on hover/click for all field labels
- E2E test: Mobile: tooltips work with touch, touch targets ≥44x44px
- Visual test: Banner styling matches design, doesn't break layout
- Run: `npm run test:e2e` (add tests to `__tests__/e2e/gig-creation-guidance.spec.ts`)

**Files Modified:**
- `app/dashboard/gigs/new/page.tsx`
- `app/dashboard/gigs/new/gig-form.tsx`
- `__tests__/e2e/gig-creation-guidance.spec.ts` (create)

---

## Task 7: Add Guidance to Application Form
**Objective:** Display contextual guidance for first-time applicants.

**Implementation:**
1. Update `app/dashboard/gigs/[id]/page.tsx`:
   - Fetch user's guidance state: `hasSubmittedFirstApplication`, `applicationGuidanceDismissed`
   - Pass guidance state to page component

2. Update application form section in `app/dashboard/gigs/[id]/page.tsx`:
   - If `showGuidance = true`, render HelpBanner above application form:
     - Text: "Submitting your first application? Focus on substance over sales. Explain your technical approach, ask clarifying questions, and demonstrate your expertise. [What makes a good application?](#)"
     - onDismiss: Call `dismissGuidance('application')` server action
     - Note: "What makes a good application?" link can be `#` for now (future enhancement)
   - Add InfoIcon + Tooltip to field labels:
     - "Technical Approach": "Describe your methodology and implementation plan. What technologies will you use? What's your step-by-step approach? Be specific and technical."
     - "Clarifying Questions": "What do you need to know about the requirements? Asking good questions demonstrates thoroughness and helps avoid scope creep."
     - "Estimated Effort": "How long will this take? (e.g., '2-3 days', '1 week', '20 hours'). Optional but helps set expectations."

**Test Plan:**
- E2E test: First-time applicant sees HelpBanner on application form
- E2E test: User dismisses banner, banner disappears and doesn't reappear
- E2E test: User with `hasSubmittedFirstApplication = true` doesn't see banner
- E2E test: Tooltips appear on hover/click for all field labels
- E2E test: Mobile: tooltips work with touch, touch targets ≥44x44px
- Visual test: Banner styling matches design, doesn't break layout
- Run: `npm run test:e2e` (add tests to `__tests__/e2e/application-guidance.spec.ts`)

**Files Modified:**
- `app/dashboard/gigs/[id]/page.tsx`
- `__tests__/e2e/application-guidance.spec.ts` (create)

---

## Task 8: Integration Testing and Bug Fixes
**Objective:** Ensure all guidance features work together correctly and fix any issues.

**Implementation:**
1. Run full test suite: `npm test`
2. Run E2E tests: `npm run test:e2e`
3. Manual testing checklist:
   - Create new test user (CLIENT), verify guidance appears on gig creation
   - Dismiss guidance, verify it doesn't reappear
   - Create first gig, verify `hasCreatedFirstGig` is set
   - Create second gig, verify no guidance appears
   - Create new test user (SPECIALIST), verify guidance appears on application form
   - Dismiss guidance, verify it doesn't reappear
   - Submit first application, verify `hasSubmittedFirstApplication` is set
   - Submit second application, verify no guidance appears
   - Test all tooltips on desktop (hover) and mobile (click)
   - Test keyboard navigation and screen reader accessibility
4. Fix any bugs discovered during testing
5. Update documentation if needed

**Test Plan:**
- All unit tests pass: `npm run test:unit`
- All integration tests pass: `npm run test:unit` (integration tests use Vitest)
- All E2E tests pass: `npm run test:e2e`
- Manual testing checklist completed
- No console errors or warnings
- Accessibility audit passes (Lighthouse, axe DevTools)

**Files Modified:**
- Various (bug fixes as needed)
- `CHANGELOG.md` (document changes)

---

## Summary

**Total Tasks:** 8
**Estimated Effort:** 2-3 days for experienced developer

**Dependencies:**
- Task 1 must complete before Tasks 4, 5 (database schema needed)
- Task 2 must complete before Tasks 6, 7 (UI components needed)
- Task 3 must complete before Tasks 6, 7 (dismissGuidance action needed)
- Tasks 4, 5 can be done in parallel
- Tasks 6, 7 can be done in parallel after Tasks 2, 3, 4, 5 complete
- Task 8 must be last (integration testing)

**Key Files:**
- `prisma/schema.prisma` - User model changes
- `app/actions/user.ts` - dismissGuidance action
- `app/actions/gig.ts` - createGig and applyToGig updates
- `app/components/ui/InfoIcon.tsx` - New component
- `app/components/ui/Tooltip.tsx` - New component
- `app/components/ui/HelpBanner.tsx` - New component
- `app/dashboard/gigs/new/page.tsx` - Gig creation guidance
- `app/dashboard/gigs/new/gig-form.tsx` - Gig form tooltips
- `app/dashboard/gigs/[id]/page.tsx` - Application guidance

**Testing:**
- Unit tests: `__tests__/integration/user-actions.test.ts`
- Integration tests: `__tests__/integration/gig-creation.test.ts`, `__tests__/integration/application.test.ts`
- E2E tests: `__tests__/e2e/gig-creation-guidance.spec.ts`, `__tests__/e2e/application-guidance.spec.ts`
