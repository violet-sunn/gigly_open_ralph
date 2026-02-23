# Change Proposal: ux-architecture-fixes

## Change Name
`ux-architecture-fixes`

## Priority
**HIGH - USER EXPERIENCE & ARCHITECTURE** | **Size:** M | **Estimated Effort:** 1.5-2 days (12-16 hours)

## Problem Statement

The platform suffers from critical UX and architectural inconsistencies that degrade usability and create cognitive friction:

1. **Input Accessibility Crisis**: The `globals.css` file contains a dark mode media query that conflicts with the light-theme UI, causing severe contrast issues where input text becomes nearly invisible on white backgrounds. This creates WCAG compliance failures and poor form completion rates.

2. **Specialist Dashboard Chaos**: The dashboard displays flat, overlapping lists where PAID gigs (terminal state) appear alongside IN_PROGRESS gigs (active work), and gigs appear in both "Active Gigs" and "My Applications" simultaneously. Dashboard items are non-interactive, forcing users to navigate via separate buttons.

3. **Navigation Architecture Gap**: No persistent global navigation exists (`app/dashboard/layout.tsx` is missing). Each page implements fragile "Back" links with hardcoded destinations that break spatial context. Users cannot quickly jump between core areas.

4. **Terminal State Leakage**: Messaging remains available after gigs reach PAID status, allowing conversations to continue after financial settlement. This creates potential for scope creep and post-payment disputes.

5. **Application Lifecycle Asymmetry**: Specialists can apply to gigs but have NO ability to withdraw PENDING applications. Once submitted, applications are immutable from the specialist's perspective, creating poor user agency.

## Proposed Solution

Implement five focused architectural improvements that address each issue independently:

1. **Input Accessibility**: Remove dark mode CSS, standardize input styling for WCAG AA compliance
2. **Dashboard Reorganization**: Replace flat lists with tab-based workspace (Active Work, Pending Applications, Archive)
3. **Global Navigation**: Create `app/dashboard/layout.tsx` with role-aware persistent navigation
4. **Terminal State Enforcement**: Block messaging for PAID gigs at UI and server action layers
5. **Application Withdrawal**: Add `withdrawApplication` action with WITHDRAWN status

## Scope

### In Scope
- Remove dark mode CSS causing accessibility issues
- Implement tab-based Specialist dashboard with status-based organization
- Create persistent role-aware navigation in dashboard layout
- Enforce terminal state for PAID gigs (messaging blocked)
- Add application withdrawal capability for PENDING applications
- Make all dashboard gig cards clickable navigation elements
- Update Application model to support WITHDRAWN status

### Out of Scope (Deferred to Future Changes)
- Real-time messaging updates (WebSocket/polling)
- Email notifications for withdrawn applications
- Application withdrawal history/audit trail
- Bulk application management
- Advanced dashboard filtering/sorting beyond tabs
- Mobile-responsive navigation optimization
- Proper dark mode implementation (removed for now, can be added later)
- Notification system for lifecycle events
- Analytics/tracking for navigation patterns
- Undo functionality for withdrawn applications

## Constraints

1. **No Breaking Changes**: All changes must maintain backward compatibility with existing data
2. **Session-Based Auth**: Navigation must work with existing session management
3. **Server Actions**: All mutations must use existing server action patterns
4. **Terminal State Immutability**: PAID gigs must remain immutable (no status reversals)
5. **Access Control**: All actions must respect existing role-based permissions

## Success Criteria

1. All input fields have readable contrast (dark text on light backgrounds)
2. Specialist dashboard organized into three tabs with no duplicate visibility
3. Persistent navigation available on all dashboard pages
4. Messaging blocked for PAID gigs with clear explanation
5. Specialists can withdraw PENDING applications
6. All dashboard gig cards are clickable links
7. No visual regressions or broken functionality

## Dependencies

- Existing authentication and session management
- Existing Gig and Application models
- Existing server action patterns
- Existing Tailwind configuration
- Existing role-based access control

## Risks & Mitigations

**Risk**: Removing dark mode CSS might affect users who prefer dark mode.
**Mitigation**: Current dark mode is broken and creates accessibility issues. Removing it provides consistent experience. Proper dark mode can be implemented later with full UI support.

**Risk**: Dashboard reorganization might confuse existing users.
**Mitigation**: Tab-based structure follows common patterns (email clients, project management tools). Clear labels aid discoverability.

**Risk**: Application withdrawal might be abused (specialists withdrawing to avoid rejection).
**Mitigation**: Acceptable behavior - specialists should have agency over their pipeline. Clients can still see application history with WITHDRAWN status.

---

## Implementation Iterations (Ralph Loop)

**Each iteration should take 2-4 hours and be independently testable.**

### Iteration 1: Input Accessibility & Theme Standardization

**Estimated Time:** 2-3 hours

**Goal:** Fix severe accessibility issues caused by dark mode CSS conflicting with light-theme UI.

**Ralphy-Plan Command:**

```
/ralphy-plan input-accessibility-fix "User input text is nearly invisible across forms (login, gig creation, messaging, profile editing) due to dark mode CSS in globals.css conflicting with light-theme UI. This creates WCAG compliance failures and poor form completion rates. Remove dark mode CSS and standardize all input styling for accessibility. Requirements: (1) Remove dark mode media query from app/globals.css, (2) Audit all input fields across all forms for consistent styling, (3) Ensure all inputs use text-gray-900 or darker on bg-white/bg-gray-50 backgrounds, (4) Ensure border-gray-300 with proper focus states (focus:ring-blue-500, focus:border-blue-500), (5) Test across all forms to verify readable input text. Propose: which CSS to remove, input styling standards, testing approach. Reference: Check app/login/page.tsx, app/dashboard/gigs/new/gig-form.tsx, app/dashboard/gigs/[id]/message-form.tsx for input patterns. Test: manually type in all forms and verify text is clearly visible."
```

**Acceptance Criteria:**

- Dark mode media query removed from `app/globals.css`
- All input fields use `text-gray-900` or darker text color
- All input backgrounds are `bg-white` or `bg-gray-50`
- All inputs have `border-gray-300` with proper focus states
- Manual testing confirms readable input text across all forms (login, register, gig creation, messaging, profile editing)
- No visual regressions on existing pages

**Test:** Open each form (login, register, gig creation, message form, profile edit). Type in each input field. Verify text is clearly visible with good contrast. Check focus states work correctly.

---

### Iteration 2: Specialist Dashboard Reorganization

**Estimated Time:** 3-4 hours

**Goal:** Replace flat, overlapping lists with tab-based workspace organized by gig lifecycle stage.

**Ralphy-Plan Command:**

```
/ralphy-plan specialist-dashboard-tabs "The Specialist dashboard displays flat lists where PAID gigs (terminal state) appear alongside IN_PROGRESS gigs (active work), and gigs appear in both 'Active Gigs' and 'My Applications' simultaneously. Dashboard items are non-interactive. This creates cognitive overload and poor task completion efficiency. Reorganize dashboard into tab-based workspace organized by gig lifecycle stage. Requirements: (1) Create three tabs: 'Active Work' (IN_PROGRESS, REVIEW, COMPLETED gigs), 'Pending Applications' (PENDING applications only), 'Archive' (PAID gigs and REJECTED applications), (2) Make all gig cards clickable links to gig detail page, (3) Ensure no gig appears in multiple tabs, (4) Use client component with useState for tab switching, (5) Maintain all existing data queries and authorization. Propose: tab component structure, how to filter gigs for each tab, how to make cards clickable, visual design for tabs. Reference: app/dashboard/page.tsx lines 43-75 for current implementation. Test: verify each tab shows correct gigs, no duplicates, all cards are clickable."
```

**Acceptance Criteria:**

- Specialist dashboard displays three tabs: Active Work, Pending Applications, Archive
- Active Work tab shows only IN_PROGRESS, REVIEW, COMPLETED gigs
- Pending Applications tab shows only PENDING applications
- Archive tab shows PAID gigs and REJECTED applications
- All gig cards are wrapped in Link components and navigate to gig detail page
- No gig appears in multiple tabs simultaneously
- Tab switching is instant (client-side state)
- Dashboard loads without performance degradation

**Test:** Log in as specialist. Click each tab and verify correct gigs appear. Click on gig cards and verify navigation to detail page. Check that PAID gigs only appear in Archive, not Active Work. Verify no duplicate visibility.

---

### Iteration 3: Global Role-Aware Navigation

**Estimated Time:** 3-4 hours

**Goal:** Create persistent navigation that provides spatial context and quick access to core areas.

**Ralphy-Plan Command:**

```
/ralphy-plan global-navigation-layout "No persistent navigation exists - app/dashboard/layout.tsx is missing. Each page implements fragile 'Back' links with hardcoded destinations that break spatial context. Users cannot quickly jump between core areas (Dashboard, Browse Gigs, Profile). This creates disorientation and increased cognitive load. Create persistent role-aware navigation in dashboard layout. Requirements: (1) Create app/dashboard/layout.tsx wrapping all dashboard routes, (2) Build top navigation bar with role-specific links (CLIENT: Dashboard, Post Gig, Browse Gigs, Profile, Sign Out; SPECIALIST: Dashboard, Browse Gigs, Profile, Sign Out; ADMIN: Dashboard, Moderation, Users, Gigs, Profile, Sign Out), (3) Highlight active route using usePathname, (4) Remove standalone 'Back' links from pages now that global nav exists, (5) Use sticky positioning for persistent visibility. Propose: navigation component structure, how to read session role, how to highlight active route, styling approach. Reference: app/dashboard/gigs/[id]/page.tsx line 80-82 for 'Back' link pattern to remove. Test: verify navigation appears on all dashboard pages, correct links for each role, active route highlighted."
```

**Acceptance Criteria:**

- `app/dashboard/layout.tsx` exists and wraps all dashboard routes
- Navigation bar displays role-appropriate links
- CLIENT sees: Dashboard, Post Gig, Browse Gigs, Profile, Sign Out
- SPECIALIST sees: Dashboard, Browse Gigs, Profile, Sign Out
- ADMIN sees: Dashboard, Moderation, Users, Gigs, Profile, Sign Out (if admin pages exist)
- Active route is visually highlighted
- Navigation persists across all dashboard pages
- Standalone "Back" links removed from gig detail, profile pages
- Navigation uses sticky positioning

**Test:** Log in as CLIENT, verify correct nav links. Log in as SPECIALIST, verify correct nav links. Navigate between pages and verify active route highlighting. Verify navigation persists on all pages. Check that old "Back" links are removed.

---

### Iteration 4: Terminal State Enforcement (Messaging)

**Estimated Time:** 1-2 hours

**Goal:** Prevent post-payment disputes by blocking messaging after gigs reach terminal PAID status.

**Ralphy-Plan Command:**

```
/ralphy-plan terminal-state-messaging "Messaging remains available after gigs reach PAID status, allowing conversations to continue after financial settlement. This creates potential for scope creep and post-payment disputes. The gig detail page checks closedByAdmin but NOT gig.status === 'PAID'. The sendMessage action validates authorization but NOT terminal state. Block messaging for PAID gigs at both UI and server layers. Requirements: (1) Hide MessageForm component when gig.status === 'PAID', (2) Display explanatory message: 'This gig has been marked as paid. Messaging is no longer available.', (3) Add validation in sendMessage action to reject mutations for PAID gigs, (4) Keep existing messages visible (read-only), (5) Maintain existing closedByAdmin logic. Propose: UI conditional logic, server action validation, error message text. Reference: app/dashboard/gigs/[id]/page.tsx line 364 for current messaging conditional, app/actions/gig.ts lines 368-420 for sendMessage action. Test: mark gig as PAID, verify messaging form hidden and explanatory message shown, verify existing messages still visible."
```

**Acceptance Criteria:**

- MessageForm component hidden when `gig.status === 'PAID'`
- Explanatory message displayed: "This gig has been marked as paid. Messaging is no longer available."
- `sendMessage` action rejects mutations for PAID gigs with clear error message
- Existing messages remain visible for PAID gigs (read-only)
- Terminal state enforcement works for `closedByAdmin` as well (existing behavior maintained)
- No errors or broken UI states

**Test:** Create gig, accept application, submit work, approve work, mark as PAID. Verify messaging form disappears and explanatory message appears. Verify existing messages still visible. Try to send message via direct API call, verify server rejects it.

---

### Iteration 5: Application Withdrawal Capability

**Estimated Time:** 3-4 hours

**Goal:** Give specialists agency over their pipeline by allowing withdrawal of PENDING applications.

**Ralphy-Plan Command:**

```
/ralphy-plan application-withdrawal "Specialists can apply to gigs but have NO ability to withdraw PENDING applications. Once submitted, applications are immutable from the specialist's perspective. This creates asymmetric control (clients have full control, specialists have none) and poor user agency. Add application withdrawal capability for specialists. Requirements: (1) Add withdrawApplication server action in app/actions/gig.ts, (2) Validate: specialist owns the application, status is PENDING, (3) Update application status to 'WITHDRAWN' (soft delete, not hard delete), (4) Add 'Withdraw Application' button in UI on gig detail page for specialist's own PENDING applications, (5) Update dashboard to show WITHDRAWN applications in Archive tab, (6) Update client view to show WITHDRAWN status on applications list. Propose: server action implementation, authorization checks, UI button placement, how to handle WITHDRAWN status in queries. Reference: app/actions/gig.ts lines 70-140 for applyToGig pattern, prisma/schema.prisma lines 62-77 for Application model. Test: apply to gig, withdraw application, verify status changes to WITHDRAWN, verify appears in Archive tab, verify client sees WITHDRAWN status."
```

**Acceptance Criteria:**

- `withdrawApplication` server action exists in `app/actions/gig.ts`
- Action validates: specialist owns the application, status is PENDING
- Application status updated to "WITHDRAWN" (not deleted)
- "Withdraw Application" button appears on gig detail page for specialist's own PENDING applications
- Withdrawn applications no longer appear in "Pending Applications" tab
- Withdrawn applications appear in Archive tab
- Clients see WITHDRAWN status in applications list on gig detail page
- Cannot withdraw ACCEPTED or REJECTED applications (validation error)
- Authorization prevents withdrawing other specialists' applications

**Test:** Log in as specialist. Apply to gig. Click "Withdraw Application" button. Verify application status changes to WITHDRAWN. Check dashboard - verify application moved from Pending Applications to Archive. Log in as client, view gig detail, verify application shows WITHDRAWN status. Try to withdraw ACCEPTED application, verify error. Try to withdraw another specialist's application, verify authorization error.

---

**Total for Change:** 5 iterations × 2-4 hours = 12-16 hours (1.5-2 days)

**OUTCOME:** Accessible input fields, organized dashboard with clear information architecture, persistent role-aware navigation, terminal state enforcement preventing post-payment disputes, and complete application lifecycle with withdrawal capability.

---

## Technical Decisions

### Decision 1: Application Withdrawal - Status vs. Deletion

**Recommendation:** Add "WITHDRAWN" status (soft delete)

**Rationale:**
- Maintains audit trail for analytics
- Allows clients to see that someone was interested (even if withdrawn)
- Enables future features (withdrawal history, re-application logic)
- Consistent with existing status-based lifecycle (PENDING, ACCEPTED, REJECTED)

**Implementation:**
- Application model already uses `status String @default("PENDING")` which supports any string value
- Add "WITHDRAWN" as valid status value
- Update queries to filter out WITHDRAWN applications where appropriate
- Display WITHDRAWN applications in Archive tab

### Decision 2: Navigation Pattern - Topbar vs. Sidebar

**Recommendation:** Top navigation bar (horizontal)

**Rationale:**
- Consistent with existing horizontal layout patterns
- Less intrusive for content-heavy pages (gig detail, forms)
- Easier to implement responsively
- Matches common SaaS patterns (Stripe, GitHub, Linear)

### Decision 3: Dashboard Tabs - Client Component vs. Server Component

**Recommendation:** Client component with useState

**Rationale:**
- Faster tab switching (no server round-trip)
- Simpler implementation for MVP
- All data can be fetched once on page load
- Better UX for frequent tab switching

---

**Document Status:** Proposal - Ready for Implementation
**Created:** 2026-02-22
**Author:** Claude Opus 4.6 (via ralphy-spec methodology)
