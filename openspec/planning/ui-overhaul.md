# UI Design Token System Integration

**Created:** 2026-03-18
**Status:** PLANNED

## Problem

The project has a comprehensive 134KB design token system (`openspec/specs/ui/design-tokens.json`) with detailed specifications for colors, typography, spacing, gradients, and component styles. However, the current implementation uses only a small subset of these tokens through manually-defined Tailwind classes (navy-900, blue-500, etc.). The gap between the rich token system and actual implementation means the UI lacks the full design fidelity intended by the token system, and future design updates won't propagate automatically across the application.

## Why This Matters

From `project.md`, "Professional B2B Experience" is a core design principle and "Quality Over Quantity" positioning requires polished UI. The current ad-hoc styling approach creates three critical problems: (1) inconsistent visual language across 14 pages and 46 components, (2) no single source of truth for design decisions, making maintenance difficult, and (3) inability to systematically update the design system without touching every file. A token-driven approach ensures design consistency, maintainability, and the professional appearance that B2B clients expect from a quality platform.

## Design System Reference

**Figma Prototype:** https://www.figma.com/design/Nexptl0M63VM62lPVkjxxx/gigli?node-id=4032-181&t=ULnKPLddnbzb4xxM-4

This prototype demonstrates the target design patterns for the dashboard. Use it to understand the design system logic, not as pixel-perfect specifications. Extract and apply these patterns:

**Visual Hierarchy Pattern:**
- Primary content: Large cards with `bg-surface-level-1` (#060813), prominent headings, clear section separation
- Secondary content: Nested cards with `bg-surface-level-2` (#10121c) for visual depth
- Tertiary content: Subtle borders (`border-neutral-weak` #242935), muted text for supporting information

**Status Communication Pattern:**
- Created/Inactive states: Gray backgrounds (#333643), muted text (#b5b5b5)
- Active/In Progress states: Green backgrounds (#044329), success text (#43c78f)
- Apply this semantic color logic consistently across all status indicators (gig status, application status, etc.)

**Spacing Rhythm:**
- Section gaps: 36-48px between major sections (gap-9 to gap-12)
- Card padding: 20px internal spacing (p-5 or p-6)
- Card gaps: 24px between cards in lists (gap-6)
- Maintain consistent rhythm across all pages

**CTA Prominence:**
- Primary actions: Solid blue (#1379f3), prominent placement, clear visual weight
- Secondary actions: Text links with blue hover states
- Sidebar CTAs: Full-width blue cards with subtle gradient backgrounds

**Reference Implementation:**
Phase 5 (Dashboard Pages) establishes these patterns as the canonical implementation. Subsequent phases should apply the same design logic to their specific content, maintaining visual consistency across the application.

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
/ralphy-plan ui-navigation-layout "Migrate navigation and layout components to token-based styling. Reference Figma prototype (https://www.figma.com/design/Nexptl0M63VM62lPVkjxxx/gigli?node-id=4032-181) for header layout patterns - note the dark background (#060813), navigation structure, notification badge with count, and profile avatar positioning. Requirements: (1) Update MainNav component to use token-based colors (bg-surface-level-1 for header), spacing, and typography, (2) Update NotificationBell component styling with badge count display, (3) Update page layout containers (max-width, padding, spacing), (4) Preserve all navigation link text exactly as-is, (5) Maintain active/hover states for navigation items, (6) Keep notification badge functionality unchanged. Test: run E2E navigation tests, verify all links navigate correctly, check notification bell interactions, test responsive behavior on mobile."
```

**Why:** Navigation is the primary wayfinding mechanism. Consistent styling improves usability and brand perception.

**Testing Friction:** HIGH - E2E tests navigate using link text. Mitigation: preserve exact link text and href attributes.

---

### 5. Dashboard Pages
```bash
/ralphy-plan ui-dashboard-pages "Migrate dashboard pages to token-based styling using Figma prototype (https://www.figma.com/design/Nexptl0M63VM62lPVkjxxx/gigli?node-id=4032-181) as design reference. This phase establishes the visual hierarchy and component patterns that subsequent phases will follow. Requirements: (1) Implement card hierarchy: primary cards (My Gigs section) use bg-surface-level-1, nested order/gig cards use bg-surface-level-2 for depth, (2) Implement status badge system: Created=gray (#333643/#b5b5b5), In Progress=green (#044329/#43c78f), apply semantic color logic consistently, (3) Implement spacing rhythm: section gaps 36-48px (gap-9 to gap-12), card padding 20px (p-5/p-6), card gaps 24px (gap-6), (4) Implement CTA prominence: primary actions solid blue (#1379f3), sidebar CTA full-width blue card with gradient, (5) Update CLIENT dashboard (My Gigs section, Post Gig CTA) and SPECIALIST dashboard (tabs: Active Work, Pending Applications, Archive), (6) Preserve all tab labels and button text, (7) Maintain functionality. Test: run client-journey and specialist-journey E2E tests, verify visual hierarchy matches prototype conceptually, check tab switching and navigation."
```

**Why:** Dashboard is the primary landing page for authenticated users. Professional appearance is critical for first impression. This phase establishes the canonical design patterns.

**Testing Friction:** HIGH - E2E tests interact with dashboard extensively. Mitigation: preserve button text, tab labels, and card structure.

---

### 6. Gig Pages (Browse, Detail, Create)
```bash
/ralphy-plan ui-gig-pages "Migrate gig pages following the design patterns established in Dashboard (Phase 5). Apply the same visual hierarchy, status badge system, spacing rhythm, and CTA prominence patterns to gig-specific content. Requirements: (1) Gig cards: use same card hierarchy as Dashboard order cards (bg-surface-level-2 on bg-surface-level-1 background), (2) Status badges: apply same semantic color system (OPEN=gray, IN_PROGRESS=green, COMPLETED=appropriate color, etc.), (3) Spacing: use same rhythm (gap-6 between cards, p-5/p-6 padding, gap-9 to gap-12 for sections), (4) Filter sidebar: apply sidebar pattern similar to Dashboard sidebar widgets, (5) CTAs: primary actions prominent blue, secondary actions text links, (6) Update gig browse page with filter panel and gig grid, gig detail page (two-column layout), gig creation form with visual sections, (7) Preserve all form field names, labels, placeholders, and filter functionality. Test: verify visual consistency with Dashboard, run gig-creation, gig-filtering, and application-flow integration tests."
```

**Why:** Gig pages are core to the marketplace functionality. Clear visual hierarchy improves usability for both clients and specialists.

**Testing Friction:** HIGH - Tests fill forms and interact with filters. Mitigation: preserve form structure, field names, and filter parameters.

---

### 7. Profile Pages
```bash
/ralphy-plan ui-profile-pages "Migrate profile pages following the design patterns established in Dashboard (Phase 5). Apply the same visual hierarchy, card system, spacing rhythm, and form styling patterns. Requirements: (1) Profile cards: use same card hierarchy (bg-surface-level-1 for main cards, bg-surface-level-2 for nested sections), (2) Spacing: apply same rhythm (gap-6 for card spacing, p-5/p-6 padding, gap-9 to gap-12 for sections), (3) Form styling: consistent with Dashboard form elements, (4) CTAs: primary actions prominent blue, edit links text blue, (5) Update profile view page layout (already partially token-based from specialist-profile-ui-tokens), profile edit page to match view page, public profile page styling, (6) Preserve all form field names, labels, and profile completion logic. Test: verify visual consistency with Dashboard, run profile-specialist-ui-tokens E2E test, verify profile edit form submission, check profile completion hints."
```

**Why:** Profile pages communicate specialist expertise and client credibility. Professional styling builds trust.

**Testing Friction:** MEDIUM - Profile edit form tested extensively. Mitigation: preserve form structure and field names.

---

### 8. Admin Pages
```bash
/ralphy-plan ui-admin-pages "Migrate admin pages following the design patterns established in Dashboard (Phase 5). Apply the same visual hierarchy, card system, spacing rhythm, and status badge patterns to admin-specific content. Requirements: (1) Statistics cards: use same card hierarchy as Dashboard (bg-surface-level-1), (2) User/gig lists: apply same card pattern for list items (bg-surface-level-2 on bg-surface-level-1), (3) Status indicators: use same semantic color system for user status and gig status, (4) Spacing: apply same rhythm (gap-6 for cards, p-5/p-6 padding, gap-9 to gap-12 for sections), (5) Filter panels: consistent with gig filter styling, (6) Action buttons: prominent blue for primary actions, appropriate colors for moderation actions, (7) Update admin dashboard, user management page, gig management page with filters and pagination, (8) Preserve all filter labels, button text, and table/list structure. Test: verify visual consistency with Dashboard, run admin-moderation E2E tests, verify suspend/unsuspend actions, check gig close functionality, test pagination and filters."
```

**Why:** Admin pages need clear visual hierarchy for moderation tasks. Consistent styling improves efficiency.

**Testing Friction:** MEDIUM - Admin tests check moderation actions. Mitigation: preserve button text and action handlers.

---

### 9. Authentication Pages
```bash
/ralphy-plan ui-auth-pages "Migrate authentication pages following the design patterns established in Dashboard (Phase 5). Apply the same visual hierarchy, card system, spacing rhythm, and form styling patterns to auth-specific content. Requirements: (1) Form cards: use same card hierarchy (bg-surface-level-1 for form containers), (2) Form inputs: consistent styling with Dashboard form elements, (3) Spacing: apply same rhythm (p-5/p-6 padding, gap-6 for form fields), (4) CTAs: primary actions prominent blue (Login, Register buttons), secondary actions text links, (5) Error messages: consistent styling with Dashboard warning/error patterns, (6) Update login page form, registration page with role selector, homepage for anonymous users, (7) Preserve all form field names, labels, role selector values (CLIENT, SPECIALIST), and error message display. Test: verify visual consistency with Dashboard, run login and registration integration tests, verify authentication flow, check role selection, test error handling."
```

**Why:** Auth pages are the first touchpoint for new users. Professional appearance affects signup conversion.

**Testing Friction:** MEDIUM - Auth tests fill forms and check error messages. Mitigation: preserve form structure and error message text.

---

### 10. Visual Consistency Audit and Polish
```bash
/ralphy-plan ui-consistency-audit "Audit all pages for visual consistency and polish against the design patterns established in Dashboard (Phase 5). Verify consistent application of visual hierarchy, status badge system, spacing rhythm, and CTA prominence across all 14 pages. Requirements: (1) Review all pages for consistent spacing (gap-6 for cards, p-5/p-6 padding, gap-9 to gap-12 for sections), typography, and color usage, (2) Verify all status badges use semantic color system consistently (gray for inactive, green for active, etc.), (3) Verify all interactive elements have proper hover/focus states matching Dashboard patterns, (4) Check responsive behavior on mobile (320px) and desktop (1920px), (5) Ensure WCAG AA contrast ratios for all text, (6) Document any remaining ad-hoc styles that need token equivalents, (7) Create visual regression test baseline (optional). Test: manual QA checklist for all pages comparing against Dashboard reference, accessibility audit with axe-core, responsive testing on multiple viewports, run full test suite to confirm zero regressions."
```

**Why:** Final audit ensures consistent application of design system and catches edge cases missed in individual changes.

**Testing Friction:** LOW - Audit and polish shouldn't change functionality. Mitigation: only fix visual issues, don't refactor logic.

## Status

- [x] ui-token-foundation ✅ **COMPLETED 2026-03-19** - Archived in `openspec/archive/ui-token-foundation/`
  - Token parser script created (264 lines)
  - Tailwind config integrated with design tokens
  - CSS variables generated in globals.css (213 lines)
  - DESIGN_SYSTEM.md documentation created (608 lines)
  - project.md and specs/ui/spec.md updated with token guidance

- [x] ui-core-components ✅ **COMPLETED 2026-03-19** - Archived in `openspec/archive/ui-core-components/`
  - Button components migrated to semantic tokens (success, error, warning)
  - 645/647 tests passing (99.7%)
  - Build successful

- [x] ui-card-badge-components ✅ **COMPLETED 2026-03-19** - Archived in `openspec/archive/ui-card-badge-components/`
  - Card backgrounds migrated to bg-surface-level-1/2
  - Card borders migrated to border-neutral-weak
  - Token analysis documented

- [x] ui-navigation-layout ✅ **COMPLETED 2026-03-20** - Archived in `openspec/archive/ui-navigation-layout/`
  - MainNav migrated to token-based styling
  - 17/17 acceptance criteria met
  - E2E navigation tests passing

- [x] ui-dashboard-pages ✅ **COMPLETED 2026-03-20** - Archived in `openspec/archive/ui-dashboard-pages/`
  - Card hierarchy implemented with design tokens
  - Status badges use semantic color system
  - Spacing rhythm consistent (gap-6, p-8, space-y-6)
  - Build successful

- [x] ui-gig-pages ✅ **COMPLETED 2026-03-20** - Archived in `openspec/archive/ui-gig-pages/`
  - 46/46 acceptance criteria met
  - Gig browse, detail, and creation pages migrated
  - 647/647 tests passing

- [x] ui-profile-pages ✅ **COMPLETED 2026-03-20** - Archived in `openspec/archive/ui-profile-pages/`
  - 35/35 acceptance criteria met
  - Profile view, edit, and public pages migrated
  - 2-column layout with token-based styling

- [x] ui-admin-pages ✅ **COMPLETED 2026-03-20** - Archived in `openspec/archive/ui-admin-pages/`
  - 37/37 acceptance criteria met
  - Admin dashboard, user management, gig management migrated
  - E2E admin-moderation tests passing

- [x] ui-auth-pages ✅ **COMPLETED 2026-03-20** - Archived in `openspec/archive/ui-auth-pages/`
  - 51/51 acceptance criteria met
  - Login, registration, and homepage migrated
  - 18/18 integration tests passing

- [x] ui-consistency-audit ✅ **COMPLETED 2026-03-20** - Archived in `openspec/archive/ui-consistency-audit/`
  - All 14 pages audited for visual consistency
  - 647/647 tests passing
  - Comprehensive audit findings documented
  - Accessibility testing completed

**Progress:** 10/10 changes completed (100%) ✅
**Started:** 2026-03-19
**Completed:** 2026-03-20
**Total Duration:** ~2 days
**Final Status:** ALL PHASES COMPLETE AND VALIDATED
