# UI Design Token System Integration

**Created:** 2026-03-18
**Status:** PLANNED

## Problem

The project has a comprehensive 134KB design token system (`openspec/specs/ui/design-tokens.json`) with detailed specifications for colors, typography, spacing, gradients, and component styles. However, the current implementation uses only a small subset of these tokens through manually-defined Tailwind classes (navy-900, blue-500, etc.). The gap between the rich token system and actual implementation means the UI lacks the full design fidelity intended by the token system, and future design updates won't propagate automatically across the application.

## Why This Matters

From `project.md`, "Professional B2B Experience" is a core design principle and "Quality Over Quantity" positioning requires polished UI. The current ad-hoc styling approach creates three critical problems: (1) inconsistent visual language across 14 pages and 46 components, (2) no single source of truth for design decisions, making maintenance difficult, and (3) inability to systematically update the design system without touching every file. A token-driven approach ensures design consistency, maintainability, and the professional appearance that B2B clients expect from a quality platform.

## Scope

### Systems Affected

**Foundation Layer:**
- `tailwind.config.ts` - Needs token integration from design-tokens.json
- `app/globals.css` - Needs comprehensive CSS variable definitions
- Design token parser/transformer (may need new tooling)

**Component Layer (46 TSX files):**
- Navigation: `MainNav.tsx`, `NotificationBell.tsx`
- Forms: Button components, input components, textarea components
- Cards: Gig cards, application cards, profile cards
- Badges: Status badges (OPEN, IN_PROGRESS, COMPLETED, etc.)
- Layout: Grid layouts, sidebar layouts

**Page Layer (14 pages):**
- Dashboard (CLIENT and SPECIALIST views)
- Gig browsing (`/gigs`)
- Gig detail (`/gigs/[id]`)
- Gig creation (`/gigs/new`)
- Profile pages (`/profile`, `/profile/edit`, `/profile/[userId]`)
- Admin pages (`/admin`, `/admin/users`, `/admin/gigs`)
- Auth pages (`/login`, `/register`)
- Homepage (`/`)

### Dependencies

1. **Foundation → Components → Pages**: Token system must be established before component updates
2. **Component Library → Page Layouts**: Reusable components must be updated before page-specific implementations
3. **Core Components → Specialized Components**: Basic buttons/inputs before complex composite components

### Testing Friction Assessment

**Current Test Infrastructure:**
- 46 integration tests (unit/integration in `__tests__/integration/`)
- 14 E2E tests (Playwright in `__tests__/e2e/`)
- **Zero data-testid attributes** - tests rely on semantic selectors (getByRole, getByText, getByLabel)
- No snapshot tests found
- Tests focus on functionality, not visual appearance

**Risk Levels by Change Type:**

**LOW RISK (Foundation):**
- Tailwind config updates: Tests don't check CSS classes
- CSS variable definitions: Tests don't inspect computed styles
- Token parsing/generation: No test impact

**MEDIUM RISK (Components):**
- Button/input styling: Tests use getByRole('button'), getByRole('textbox') - semantic HTML preserved
- Card layouts: Tests use getByText for content - structure changes may affect selectors
- Badge components: Tests check text content, not styling

**HIGH RISK (Pages):**
- Dashboard layout changes: Tests navigate and check content visibility
- Form layouts: Tests fill forms and submit - field order/structure matters
- Navigation changes: Tests use link text - must preserve exact text

**Mitigation Strategies:**
1. **Preserve semantic HTML**: Keep button, input, link, heading tags unchanged
2. **Maintain text content**: Don't change button labels, headings, or link text used in tests
3. **Keep form structure**: Preserve field names, labels, and submission flow
4. **Run tests incrementally**: Test after each component/page update
5. **Update selectors only when necessary**: If DOM structure must change, update test selectors in same commit

### Risks

1. **Incomplete token coverage**: design-tokens.json may not cover all current use cases
2. **Breaking visual consistency**: Partial migration could create inconsistent UI
3. **Test maintenance burden**: Some test selectors may need updates despite mitigation
4. **Performance impact**: CSS variable lookups vs. static classes (minimal, but measurable)

## Changes

Execute these changes in order:

### 1. Design Token Foundation
```bash
/ralphy-plan ui-token-foundation "Integrate design-tokens.json into Tailwind config and CSS variables. Requirements: (1) Create token parser script to extract colors, typography, spacing, and effects from design-tokens.json, (2) Update tailwind.config.ts to use parsed tokens as custom theme extensions, (3) Generate comprehensive CSS variables in globals.css for all semantic tokens, (4) Document token naming conventions and usage patterns in DESIGN_SYSTEM.md. Test: verify all tokens accessible via Tailwind classes (bg-[token], text-[token]), run full test suite to confirm zero breakage (foundation changes don't affect tests)."
```

**Why:** Establishes single source of truth for design system. All subsequent changes depend on this foundation.

**Testing Friction:** LOW - CSS variables and Tailwind config don't affect test selectors or functionality.

---

### 2. Core Component Token Migration
```bash
/ralphy-plan ui-core-components "Migrate core reusable components to use design tokens. Requirements: (1) Update button components to use token-based colors, spacing, and typography, (2) Update input/textarea components to use token-based styling, (3) Update link components to use token-based colors and hover states, (4) Preserve all semantic HTML (button, input, a tags), (5) Preserve all existing class names that tests might depend on, (6) Maintain exact text content for labels and placeholders. Test: run integration tests for form components, verify all button/input interactions work identically, check accessibility with screen reader."
```

**Why:** Core components are used across all pages. Updating them first provides consistent foundation for page updates.

**Testing Friction:** MEDIUM - Tests use semantic selectors (getByRole), but form structure must remain identical. Mitigation: preserve HTML structure and ARIA attributes.

---

### 3. Card and Badge Components
```bash
/ralphy-plan ui-card-badge-components "Migrate card and badge components to token-based styling. Requirements: (1) Update gig card components to use token-based backgrounds, borders, shadows, (2) Update application card components with token-based styling, (3) Update status badge components (OPEN, IN_PROGRESS, COMPLETED, PAID, REJECTED, WITHDRAWN) to use semantic color tokens, (4) Preserve card content structure and text, (5) Maintain hover states and interactive affordances. Test: verify card click handlers work, status badges display correct colors, run gig browsing and dashboard tests."
```

**Why:** Cards and badges are visual primitives used throughout the application. Consistent styling improves professional appearance.

**Testing Friction:** MEDIUM - Tests check card content with getByText. Mitigation: preserve text content and clickable areas.

---

### 4. Navigation and Layout Components
```bash
/ralphy-plan ui-navigation-layout "Migrate navigation and layout components to token-based styling. Requirements: (1) Update MainNav component to use token-based colors, spacing, and typography, (2) Update NotificationBell component styling, (3) Update page layout containers (max-width, padding, spacing), (4) Preserve all navigation link text exactly as-is, (5) Maintain active/hover states for navigation items, (6) Keep notification badge functionality unchanged. Test: run E2E navigation tests, verify all links navigate correctly, check notification bell interactions, test responsive behavior on mobile."
```

**Why:** Navigation is the primary wayfinding mechanism. Consistent styling improves usability and brand perception.

**Testing Friction:** HIGH - E2E tests navigate using link text. Mitigation: preserve exact link text and href attributes.

---

### 5. Dashboard Pages
```bash
/ralphy-plan ui-dashboard-pages "Migrate dashboard pages to token-based styling. Requirements: (1) Update CLIENT dashboard layout and styling (My Gigs section, Post Gig CTA), (2) Update SPECIALIST dashboard with tabs (Active Work, Pending Applications, Archive), (3) Update profile completion cards and empty states, (4) Preserve all tab labels and button text, (5) Maintain gig/application card click handlers, (6) Keep dashboard statistics and counts unchanged. Test: run client-journey and specialist-journey E2E tests, verify tab switching works, check gig/application navigation, test profile completion hints."
```

**Why:** Dashboard is the primary landing page for authenticated users. Professional appearance is critical for first impression.

**Testing Friction:** HIGH - E2E tests interact with dashboard extensively. Mitigation: preserve button text, tab labels, and card structure.

---

### 6. Gig Pages (Browse, Detail, Create)
```bash
/ralphy-plan ui-gig-pages "Migrate gig-related pages to token-based styling. Requirements: (1) Update gig browse page with filter panel and gig grid, (2) Update gig detail page layout (two-column with sidebar), (3) Update gig creation form with visual sections, (4) Preserve all form field names, labels, and placeholders, (5) Maintain filter functionality and URL parameters, (6) Keep application/message sections unchanged structurally. Test: run gig-creation, gig-filtering, and application-flow integration tests, verify form submission works, check filter state persistence, test messaging functionality."
```

**Why:** Gig pages are core to the marketplace functionality. Clear visual hierarchy improves usability for both clients and specialists.

**Testing Friction:** HIGH - Tests fill forms and interact with filters. Mitigation: preserve form structure, field names, and filter parameters.

---

### 7. Profile Pages
```bash
/ralphy-plan ui-profile-pages "Migrate profile pages to token-based styling. Requirements: (1) Update profile view page layout (already partially token-based from specialist-profile-ui-tokens), (2) Update profile edit page to match view page layout, (3) Update public profile page styling, (4) Preserve all form field names and labels, (5) Maintain profile completion logic, (6) Keep edit/save button text unchanged. Test: run profile-specialist-ui-tokens E2E test, verify profile edit form submission, check profile completion hints, test public profile access."
```

**Why:** Profile pages communicate specialist expertise and client credibility. Professional styling builds trust.

**Testing Friction:** MEDIUM - Profile edit form tested extensively. Mitigation: preserve form structure and field names.

---

### 8. Admin Pages
```bash
/ralphy-plan ui-admin-pages "Migrate admin pages to token-based styling. Requirements: (1) Update admin dashboard with statistics cards, (2) Update user management page with filters and pagination, (3) Update gig management page with filters and pagination, (4) Preserve all filter labels and button text, (5) Maintain table/list structure for users and gigs, (6) Keep moderation action buttons unchanged. Test: run admin-moderation E2E tests, verify suspend/unsuspend actions work, check gig close functionality, test pagination and filters."
```

**Why:** Admin pages need clear visual hierarchy for moderation tasks. Consistent styling improves efficiency.

**Testing Friction:** MEDIUM - Admin tests check moderation actions. Mitigation: preserve button text and action handlers.

---

### 9. Authentication Pages
```bash
/ralphy-plan ui-auth-pages "Migrate authentication pages to token-based styling. Requirements: (1) Update login page form styling, (2) Update registration page with role selector, (3) Update homepage for anonymous users, (4) Preserve all form field names and labels, (5) Maintain role selector values (CLIENT, SPECIALIST), (6) Keep error message display unchanged. Test: run login and registration integration tests, verify authentication flow works, check role selection, test error handling."
```

**Why:** Auth pages are the first touchpoint for new users. Professional appearance affects signup conversion.

**Testing Friction:** MEDIUM - Auth tests fill forms and check error messages. Mitigation: preserve form structure and error message text.

---

### 10. Visual Consistency Audit and Polish
```bash
/ralphy-plan ui-consistency-audit "Audit all pages for visual consistency and polish. Requirements: (1) Review all 14 pages for consistent spacing, typography, and color usage, (2) Verify all interactive elements have proper hover/focus states, (3) Check responsive behavior on mobile (320px) and desktop (1920px), (4) Ensure WCAG AA contrast ratios for all text, (5) Document any remaining ad-hoc styles that need token equivalents, (6) Create visual regression test baseline (optional). Test: manual QA checklist for all pages, accessibility audit with axe-core, responsive testing on multiple viewports, run full test suite to confirm zero regressions."
```

**Why:** Final audit ensures consistent application of design system and catches edge cases missed in individual changes.

**Testing Friction:** LOW - Audit and polish shouldn't change functionality. Mitigation: only fix visual issues, don't refactor logic.

## Status

- [ ] ui-token-foundation
- [ ] ui-core-components
- [ ] ui-card-badge-components
- [ ] ui-navigation-layout
- [ ] ui-dashboard-pages
- [ ] ui-gig-pages
- [ ] ui-profile-pages
- [ ] ui-admin-pages
- [ ] ui-auth-pages
- [ ] ui-consistency-audit

**Progress:** 0/10 changes completed
**Started:** Not started
**Completed:** Not completed
