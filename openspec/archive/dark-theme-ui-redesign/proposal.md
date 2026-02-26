# Change Proposal: Dark Theme UI Redesign

## Change ID
`dark-theme-ui-redesign`

## Status
Proposed

## Overview
Complete visual and structural overhaul of the Gigly UI to match new dark theme design mockups. This change rebuilds all page layouts, component structures, and styling using Tailwind CSS while maintaining 100% of existing application logic.

## Problem Statement

The current UI uses a basic light theme with minimal styling. The new design mockups provide:
- A professional dark theme optimized for developer audiences
- Modern card-based layouts with generous spacing
- Clear visual hierarchy and information architecture
- Improved readability and reduced eye strain
- Better alignment with competitor products (Upwork, Toptal, etc.)

The existing UI structure does not match the new designs and requires a complete DOM/layout rebuild.

## Solution Approach

### Phase 1: Design System Foundation
1. Extract design tokens from mockups (colors, typography, spacing, radii)
2. Update `tailwind.config.ts` with new theme configuration
3. Update `app/globals.css` with CSS variables for dark theme
4. Verify design system consistency across all mockup screens

### Phase 2: Component Restructuring
Rebuild JSX structure for all pages to match mockups:
- **Dashboard** (`/dashboard`): New card-based layout with tabs, statistics, and action cards
- **Browse Gigs** (`/gigs`): New filter sidebar, card grid layout, search bar
- **Gig Detail** (`/gigs/[id]`): New two-column layout with sidebar for actions
- **Profile** (`/profile`): New profile card layout with sections

### Phase 3: Navigation & Global Components
- Rebuild top navigation bar to match mockup header
- Update notification bell styling
- Ensure consistent spacing and typography across all pages

## Constraints

### CRITICAL: Logic Preservation Boundary
**MUST NOT CHANGE:**
- Any Server Actions in `app/actions/`
- Any Prisma queries or database operations
- Any `useState`, `useActionState`, `useFormStatus` hooks
- Any `onClick`, `onSubmit`, `onChange` handlers
- Any routing or middleware logic
- Any validation or business rules
- Any component props or data flow

**ONLY CHANGE:**
- JSX structure (HTML tags, nesting, layout)
- Tailwind CSS classes
- Component positioning and spacing
- Visual styling (colors, borders, shadows, typography)

### Design Mapping Rules
1. **Dashboard mockup** → `/dashboard` page (both CLIENT and SPECIALIST views)
2. **Browse mockup** → `/gigs` page (specialist gig browsing)
3. **Gig Detail mockup** → `/gigs/[id]` page
4. **Profile mockup** → `/profile` pages

### Mockup Hallucinations to IGNORE
- "Финансы" (Finance) tab in navigation - does not exist in our app
- Standalone "Сообщения" (Messages) tab in top nav - we have notification bell instead
- Any features shown in mockups that don't exist in current implementation

### Navigation Preservation
- Keep existing `MainNav` links exactly as defined
- Only update styling to match mockup top bar appearance
- Do not add or remove navigation items

## Success Criteria

1. **Visual Fidelity**: All pages match mockup designs in layout, spacing, and color scheme
2. **Functional Integrity**: All existing features work exactly as before (100% test pass rate)
3. **Responsive Design**: All pages remain fully responsive on mobile/tablet/desktop
4. **Accessibility**: No regression in keyboard navigation, screen reader support, or WCAG compliance
5. **Performance**: No degradation in page load times or rendering performance

## Risks & Mitigations

### Risk: Accidental Logic Changes
**Mitigation**:
- Run full test suite after each page rebuild
- Code review focused on Server Action preservation
- Explicit checklist for each component: "Did I change any handlers or state?"

### Risk: Incomplete Design Token Extraction
**Mitigation**:
- Create comprehensive design token inventory before coding
- Cross-reference all four mockup screens for consistency
- Document any ambiguities or missing specifications

### Risk: Responsive Breakage
**Mitigation**:
- Test each rebuilt page at 320px, 768px, 1024px, 1920px widths
- Use Tailwind responsive utilities consistently
- Maintain mobile-first approach

## Dependencies

- Tailwind CSS (already installed)
- Existing component structure (will be refactored)
- Design mockups in `/screens` folder

## Timeline Estimate

- Phase 1 (Design System): 1-2 hours
- Phase 2 (Component Restructuring): 8-12 hours
- Phase 3 (Navigation & Polish): 2-3 hours
- Testing & Refinement: 2-3 hours

**Total**: 13-20 hours

## Rollback Plan

If critical issues arise:
1. Git revert to commit before this change
2. All functionality preserved due to logic boundary constraint
3. No database migrations required (zero schema changes)

## Approval Required

- [ ] Product Owner: Visual design approval
- [ ] Tech Lead: Architecture review (logic preservation)
- [ ] QA: Full regression test pass
