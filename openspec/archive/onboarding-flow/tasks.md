# Implementation Tasks: Onboarding Flow

## Task 1: Create Reusable FirstTimeTooltip Component
**Description**: Build a reusable tooltip component that displays on first visit and stores dismissal state in localStorage.

**Implementation Notes**:
- Create `app/components/onboarding/FirstTimeTooltip.tsx` as a client component (`'use client'`)
- Props: `storageKey: string`, `message: string`, `onDismiss?: () => void`
- Use `useState` to track visibility
- Use `useEffect` to check localStorage on mount: `!localStorage.getItem(storageKey)`
- Render conditionally based on visibility state
- Include "Got it" button and "×" close button
- Both buttons call handler that:
  - Sets `localStorage.setItem(storageKey, 'true')`
  - Calls optional `onDismiss` callback
  - Sets visibility to false
- Style with Tailwind: `bg-blue-50 border border-blue-300 rounded-lg p-4 shadow-md`
- Position with `relative` or `absolute` to avoid layout disruption
- Include lightbulb emoji (💡) in message display

**Test Plan**:
- Unit test: Component renders when localStorage key is not set
- Unit test: Component does not render when localStorage key is set to 'true'
- Unit test: Clicking "Got it" sets localStorage and hides tooltip
- Unit test: Clicking "×" sets localStorage and hides tooltip
- Integration test: Tooltip persists dismissal across page reloads
- E2E test: Tooltip appears on first visit, disappears after dismissal, stays hidden on return visit

---

## Task 2: Create Reusable EmptyState Component
**Description**: Build a reusable empty state component with icon, heading, description, and optional action buttons.

**Implementation Notes**:
- Create `app/components/onboarding/EmptyState.tsx` as a server component (no client interactivity)
- Props:
  - `icon: string` (emoji or SVG)
  - `heading: string`
  - `description: string`
  - `primaryAction?: { label: string, href: string }`
  - `secondaryAction?: { label: string, href: string }`
- Render centered card with:
  - Large icon at top (text-4xl or text-5xl)
  - Heading (text-xl font-semibold)
  - Description (text-gray-600, text-center)
  - Primary button (if provided): `<Link>` with `bg-blue-500 hover:bg-blue-600` styling
  - Secondary link (if provided): `<Link>` with `text-blue-600 hover:text-blue-800` styling
- Card styling: `border border-gray-200 rounded-lg p-8 text-center bg-gray-50`
- Use flexbox for vertical centering: `flex flex-col items-center gap-4`

**Test Plan**:
- Unit test: Component renders with all props provided
- Unit test: Component renders without optional actions
- Unit test: Primary action link has correct href
- Unit test: Secondary action link has correct href
- Visual test: Component is centered and visually appealing
- Accessibility test: Links are keyboard-navigable

---

## Task 3: Create WelcomeModal Component
**Description**: Build a modal that displays role-specific welcome steps after registration.

**Implementation Notes**:
- Create `app/components/onboarding/WelcomeModal.tsx` as a client component
- Props: `role: 'CLIENT' | 'SPECIALIST'`, `onDismiss: () => void`
- Use `useState` to track modal visibility
- Use `useEffect` to check localStorage on mount: `!localStorage.getItem('onboarding_welcome_seen')`
- Render modal with:
  - Backdrop overlay: `fixed inset-0 bg-black bg-opacity-50 z-50`
  - Modal card: `fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 max-w-md w-full z-50`
  - Heading: "Welcome to Gigly!" (text-2xl font-bold)
  - Role-specific step list (numbered, with descriptions)
  - "Get Started" button (primary styling)
  - "Skip for now" link (secondary styling)
- Both actions call handler that:
  - Sets `localStorage.setItem('onboarding_welcome_seen', 'true')`
  - Calls `onDismiss()`
- Implement focus trap (trap focus within modal)
- Handle Escape key to dismiss
- Add ARIA attributes: `role="dialog"`, `aria-modal="true"`, `aria-labelledby="modal-title"`
- Mobile responsive: `max-w-md` on desktop, `max-w-[90vw]` on mobile

**Role-Specific Steps**:
- CLIENT:
  1. Complete your profile (company details)
  2. Create your first gig
  3. Review applications from specialists
- SPECIALIST:
  1. Complete your profile (skills and experience)
  2. Browse available gigs
  3. Apply to gigs that match your skills

**Test Plan**:
- Unit test: Modal renders when localStorage key is not set
- Unit test: Modal does not render when localStorage key is set
- Unit test: CLIENT role shows CLIENT-specific steps
- Unit test: SPECIALIST role shows SPECIALIST-specific steps
- Unit test: "Get Started" button sets localStorage and calls onDismiss
- Unit test: "Skip for now" link sets localStorage and calls onDismiss
- Unit test: Escape key dismisses modal
- Accessibility test: Focus is trapped within modal
- Accessibility test: Modal has proper ARIA attributes
- E2E test: Modal appears after registration, disappears after dismissal

---

## Task 4: Create ProfileCompletionCard Component
**Description**: Build a card that displays profile completion progress with a visual progress bar.

**Implementation Notes**:
- Create `app/components/onboarding/ProfileCompletionCard.tsx` as a server component
- Props: `role: 'CLIENT' | 'SPECIALIST'`, `profile: ClientProfile | SpecialistProfile | null`
- Calculate completion percentage:
  - CLIENT: `(filled fields / 2) * 100` where fields are `companyName`, `inn`
  - SPECIALIST: `(filled fields / 4) * 100` where fields are `displayName`, `techStack`, `experienceLevel`, `bio`
  - Field is "filled" if it's a non-empty string (trim whitespace)
- Return `null` if completion is 100% (hide card when complete)
- Render card with:
  - Heading: "Complete Your Profile"
  - Progress bar container: `w-full bg-gray-200 rounded-full h-4`
  - Progress bar fill: `h-4 rounded-full transition-all duration-300` with dynamic width and color
  - Percentage text: "X% complete"
  - "Complete Profile" button linking to `/profile/edit`
- Color coding for progress bar:
  - 0-33%: `bg-red-500`
  - 34-66%: `bg-yellow-500`
  - 67-99%: `bg-blue-500`
  - 100%: `bg-green-500` (but card is hidden)
- Card styling: `border border-gray-200 rounded-lg p-6 bg-white shadow-sm mb-6`

**Test Plan**:
- Unit test: CLIENT with 0 fields filled shows 0%
- Unit test: CLIENT with 1 field filled shows 50%
- Unit test: CLIENT with 2 fields filled returns null (100%, hidden)
- Unit test: SPECIALIST with 0 fields filled shows 0%
- Unit test: SPECIALIST with 2 fields filled shows 50%
- Unit test: SPECIALIST with 4 fields filled returns null (100%, hidden)
- Unit test: Progress bar color is red for 0-33%
- Unit test: Progress bar color is yellow for 34-66%
- Unit test: Progress bar color is blue for 67-99%
- Unit test: Whitespace-only fields are treated as empty
- Integration test: Card displays on dashboard when profile incomplete
- Integration test: Card hidden on dashboard when profile complete

---

## Task 5: Integrate WelcomeModal into Dashboard
**Description**: Add the welcome modal to the dashboard page to display after registration.

**Implementation Notes**:
- Update `app/(protected)/dashboard/page.tsx` to import and render `WelcomeModal`
- Pass `session.role` as the `role` prop
- Implement `onDismiss` handler (can be empty function, localStorage handles persistence)
- Position modal at top level of page component (renders above all content)
- No changes to existing dashboard logic or layout
- Modal is client component, so wrap in a client wrapper if needed or convert dashboard to client component for this section

**Test Plan**:
- Integration test: Dashboard renders welcome modal on first visit
- Integration test: Dashboard does not render welcome modal on subsequent visits
- Integration test: Modal displays correct role-specific content for CLIENT
- Integration test: Modal displays correct role-specific content for SPECIALIST
- E2E test: Complete registration flow and verify modal appears
- E2E test: Dismiss modal and reload page, verify modal does not reappear

---

## Task 6: Integrate ProfileCompletionCard into Dashboard
**Description**: Add the profile completion indicator to the dashboard page.

**Implementation Notes**:
- Update `app/(protected)/dashboard/page.tsx` to import and render `ProfileCompletionCard`
- Query user with profile relation: `include: { clientProfile: true, specialistProfile: true }`
- Pass `session.role` and appropriate profile object to component
- Position card at top of dashboard content, below welcome modal, above existing sections
- Card should be full-width within dashboard container
- No changes to existing dashboard sections

**Test Plan**:
- Integration test: CLIENT dashboard shows profile completion card when profile incomplete
- Integration test: CLIENT dashboard hides profile completion card when profile complete
- Integration test: SPECIALIST dashboard shows profile completion card when profile incomplete
- Integration test: SPECIALIST dashboard hides profile completion card when profile complete
- Integration test: Card displays accurate percentage based on filled fields
- E2E test: Complete profile fields and verify card disappears

---

## Task 7: Add FirstTimeTooltip to Gig Creation Page
**Description**: Integrate the first-time tooltip into the gig creation form.

**Implementation Notes**:
- Update `app/(protected)/gigs/new/page.tsx` (or the form component) to import `FirstTimeTooltip`
- Convert to client component if currently server component (or create client wrapper)
- Render tooltip near form heading (before or after "Create a Gig" heading)
- Use storageKey: `'onboarding_gig_creation_seen'`
- Use message: "💡 Tip: Be specific about your requirements and Definition of Done to attract quality specialists. Check out example gigs for inspiration!"
- Position tooltip with `mb-4` to add spacing below it
- Tooltip should not block form inputs or submission

**Test Plan**:
- Integration test: Tooltip renders on first visit to gig creation page
- Integration test: Tooltip does not render on subsequent visits
- Integration test: Dismissing tooltip sets localStorage correctly
- E2E test: Navigate to gig creation, see tooltip, dismiss it, reload page, verify tooltip gone
- E2E test: Tooltip does not prevent form submission

---

## Task 8: Add FirstTimeTooltip to Application Form
**Description**: Integrate the first-time tooltip into the application form on gig detail pages.

**Implementation Notes**:
- Update `app/(protected)/gigs/[id]/page.tsx` to import `FirstTimeTooltip`
- Render tooltip near application form (above the form, below gig details)
- Use storageKey: `'onboarding_application_seen'`
- Use message: "💡 Tip: Focus on your technical approach and ask clarifying questions. Clients value substance over sales pitches!"
- Only render tooltip when application form is visible (SPECIALIST role, gig is OPEN, user hasn't applied)
- Position tooltip with `mb-4` to add spacing

**Test Plan**:
- Integration test: Tooltip renders on first visit to gig with application form
- Integration test: Tooltip does not render on subsequent visits
- Integration test: Tooltip only renders for SPECIALIST users
- Integration test: Tooltip only renders when application form is visible
- E2E test: SPECIALIST user sees tooltip on first application, dismisses it, verifies it's gone

---

## Task 9: Add FirstTimeTooltip to Messaging Interface
**Description**: Integrate the first-time tooltip into the messaging section on gig detail pages.

**Implementation Notes**:
- Update `app/(protected)/gigs/[id]/page.tsx` to import `FirstTimeTooltip`
- Render tooltip near message composition form (above the form)
- Use storageKey: `'onboarding_messaging_seen'`
- Use message: "💡 Tip: Keep communication professional and on-topic. All messages are visible to both parties and may be reviewed in disputes."
- Only render tooltip when messaging is available (user is owner or assigned specialist, gig has assigned specialist)
- Position tooltip with `mb-4` to add spacing

**Test Plan**:
- Integration test: Tooltip renders on first visit to gig with messaging
- Integration test: Tooltip does not render on subsequent visits
- Integration test: Tooltip only renders when user is authorized to message
- Integration test: Tooltip only renders when gig has assigned specialist
- E2E test: User sees tooltip on first message, dismisses it, verifies it's gone

---

## Task 10: Add EmptyState to CLIENT Dashboard (No Gigs)
**Description**: Replace the "No gigs posted yet." text with an enhanced empty state component.

**Implementation Notes**:
- Update `app/(protected)/dashboard/page.tsx` CLIENT section
- Replace simple text with `EmptyState` component when `gigs.length === 0`
- Props:
  - `icon`: "📋"
  - `heading`: "Post Your First Gig"
  - `description`: "Get started by posting a gig. Describe what you need, set your budget, and receive applications from qualified specialists."
  - `primaryAction`: `{ label: "Create Gig", href: "/gigs/new" }`
  - `secondaryAction`: `{ label: "View Example Gigs", href: "/gigs/examples" }`
- Position within "My Gigs" section container

**Test Plan**:
- Integration test: Empty state renders when CLIENT has zero gigs
- Integration test: Empty state does not render when CLIENT has gigs
- Integration test: "Create Gig" button links to correct page
- Integration test: "View Example Gigs" link links to correct page
- E2E test: New CLIENT user sees empty state, clicks "Create Gig", navigates correctly

---

## Task 11: Add EmptyState to SPECIALIST Dashboard Tabs
**Description**: Replace simple "No X" messages with enhanced empty states in all three tabs.

**Implementation Notes**:
- Update `app/(protected)/dashboard/SpecialistDashboardTabs.tsx` (or wherever tabs are implemented)
- Replace "No active work." with `EmptyState`:
  - `icon`: "🔍"
  - `heading`: "No Active Work Yet"
  - `description`: "Browse available gigs and apply to projects that match your skills. Once accepted, your work will appear here."
  - `primaryAction`: `{ label: "Browse Gigs", href: "/gigs" }`
- Replace "No pending applications." with `EmptyState`:
  - `icon`: "📝"
  - `heading`: "No Pending Applications"
  - `description`: "You haven't applied to any gigs yet. Browse open gigs and submit applications to get started."
  - `primaryAction`: `{ label: "Browse Gigs", href: "/gigs" }`
- Replace "No archived items." with `EmptyState`:
  - `icon`: "📦"
  - `heading`: "No Archived Items"
  - `description`: "Completed gigs and rejected applications will appear here once you start working on projects."
  - No action buttons (passive state)

**Test Plan**:
- Integration test: Active Work tab shows empty state when no active gigs
- Integration test: Pending Applications tab shows empty state when no pending applications
- Integration test: Archive tab shows empty state when no archived items
- Integration test: Each empty state has correct icon, heading, description
- Integration test: Active Work and Pending Applications empty states have "Browse Gigs" button
- Integration test: Archive empty state has no action button
- E2E test: New SPECIALIST user sees empty states in all tabs

---

## Task 12: Add EmptyState to Messages Section
**Description**: Replace the "No messages yet." text with an enhanced empty state component.

**Implementation Notes**:
- Update `app/(protected)/gigs/[id]/page.tsx` messages section
- Replace simple text with `EmptyState` component when `messages.length === 0`
- Props:
  - `icon`: "💬"
  - `heading`: "No Messages Yet"
  - `description`: "Start the conversation! Use messages to clarify requirements, share updates, and coordinate work."
  - No action buttons (message form is already visible below)
- Position above message composition form

**Test Plan**:
- Integration test: Empty state renders when gig has zero messages
- Integration test: Empty state does not render when gig has messages
- Integration test: Empty state positioned above message form
- E2E test: User sees empty state, sends first message, empty state disappears

---

## Task 13: Write Unit Tests for Components
**Description**: Create comprehensive unit tests for all new onboarding components.

**Implementation Notes**:
- Create `__tests__/unit/components/onboarding/FirstTimeTooltip.test.tsx`
- Create `__tests__/unit/components/onboarding/EmptyState.test.tsx`
- Create `__tests__/unit/components/onboarding/WelcomeModal.test.tsx`
- Create `__tests__/unit/components/onboarding/ProfileCompletionCard.test.tsx`
- Use Vitest and React Testing Library
- Mock localStorage for tooltip and modal tests
- Test all scenarios from spec requirements
- Aim for 100% code coverage on new components

**Test Plan**:
- All unit tests pass
- Code coverage > 90% for new components
- Tests are fast (< 100ms per test)
- Tests are isolated (no dependencies between tests)

---

## Task 14: Write Integration Tests
**Description**: Create integration tests verifying onboarding components work correctly within pages.

**Implementation Notes**:
- Create `__tests__/integration/onboarding/dashboard-onboarding.test.ts`
- Create `__tests__/integration/onboarding/gig-creation-onboarding.test.ts`
- Create `__tests__/integration/onboarding/application-onboarding.test.ts`
- Test welcome modal display on dashboard after registration
- Test profile completion card display and calculation
- Test tooltips display on first visit to each feature
- Test empty states display when no data exists
- Use test database with isolated transactions
- Mock localStorage where needed

**Test Plan**:
- All integration tests pass
- Tests verify localStorage persistence
- Tests verify role-specific behavior (CLIENT vs SPECIALIST)
- Tests verify conditional rendering based on data state

---

## Task 15: Write E2E Tests
**Description**: Create end-to-end tests verifying complete onboarding user flows.

**Implementation Notes**:
- Create `__tests__/e2e/onboarding-flow.spec.ts`
- Test complete flow:
  1. Register new CLIENT user
  2. Verify welcome modal appears
  3. Dismiss modal
  4. Verify profile completion card appears
  5. Complete profile
  6. Verify profile completion card disappears
  7. Navigate to gig creation
  8. Verify tooltip appears
  9. Dismiss tooltip
  10. Reload page, verify tooltip gone
- Test complete flow for SPECIALIST user
- Test empty states by creating users with no data
- Use Playwright for E2E tests
- Clean up localStorage between tests

**Test Plan**:
- All E2E tests pass
- Tests run in isolated browser contexts
- Tests clean up data after execution
- Tests verify visual appearance (screenshots if needed)
- Tests verify accessibility (keyboard navigation, screen reader labels)

---

## Task 16: Update Documentation
**Description**: Document the onboarding system for future developers.

**Implementation Notes**:
- Update `README.md` or create `docs/ONBOARDING.md`
- Document localStorage keys used:
  - `onboarding_welcome_seen`
  - `onboarding_gig_creation_seen`
  - `onboarding_application_seen`
  - `onboarding_messaging_seen`
- Document component APIs (props, usage examples)
- Document how to add new onboarding elements
- Document how to reset onboarding state (clear localStorage)
- Add troubleshooting section

**Test Plan**:
- Documentation is clear and accurate
- Code examples are correct and runnable
- All localStorage keys are documented
- Component APIs are fully documented

---

## Summary

**Total Tasks**: 16

**Estimated Effort**:
- Tasks 1-4 (Reusable Components): 4-6 hours
- Tasks 5-12 (Integration): 6-8 hours
- Tasks 13-15 (Testing): 8-10 hours
- Task 16 (Documentation): 1-2 hours
- **Total**: 19-26 hours

**Dependencies**:
- Tasks 1-4 can be done in parallel (reusable components)
- Tasks 5-12 depend on Tasks 1-4 (integration requires components)
- Tasks 13-15 can be done in parallel with integration (TDD approach)
- Task 16 should be done last (after implementation is complete)

**Critical Path**:
1. Build reusable components (Tasks 1-4)
2. Integrate into pages (Tasks 5-12)
3. Test thoroughly (Tasks 13-15)
4. Document (Task 16)
