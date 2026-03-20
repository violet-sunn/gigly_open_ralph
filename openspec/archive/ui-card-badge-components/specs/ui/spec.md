# UI Specification Delta: Token-Based Card and Badge Styling

This spec delta describes changes to migrate card and badge components to use design token-based styling.

---

## MODIFIED Requirements

### Requirement: Gig Browse Page Card Styling
Gig cards on the browse page (`/gigs`) MUST use design token-based styling for consistency and maintainability.

#### Scenario: Gig card uses token-based background and borders
- GIVEN a specialist user is viewing the gig browse page
- WHEN gig cards are rendered
- THEN each card MUST use `bg-surface-level-1` for the card background (instead of `bg-navy-800`)
- AND each card MUST use `border-neutral-weak` for the card border (instead of `border-gray-700`)
- AND each card MUST use `hover:bg-surface-level-2` for hover state (instead of `hover:bg-navy-700`)
- AND each card MUST use `hover:border-neutral-default` for hover border (instead of `hover:border-gray-600`)
- AND the visual appearance MUST remain consistent with the current implementation

#### Scenario: Gig card maintains interactive affordances
- GIVEN a specialist user hovers over a gig card
- WHEN the hover state is triggered
- THEN the card MUST show visual feedback with token-based hover colors
- AND the transition MUST remain smooth (`transition-colors duration-200`)
- AND the card MUST remain clickable with proper cursor indication

**Acceptance Criteria:**
- `app/(protected)/gigs/page.tsx` updated to use design tokens for card styling
- Card background: `bg-surface-level-1` (replaces `bg-navy-800`)
- Card border: `border-neutral-weak` (replaces `border-gray-700`)
- Hover background: `hover:bg-surface-level-2` (replaces `hover:bg-navy-700`)
- Hover border: `hover:border-neutral-default` (replaces `hover:border-gray-600`)
- All existing functionality preserved (click handlers, navigation, filters)
- Visual consistency maintained

---

### Requirement: Dashboard Card Styling
Dashboard cards (CLIENT and SPECIALIST) MUST use design token-based styling.

#### Scenario: Client dashboard gig cards use token-based styling
- GIVEN a CLIENT user is viewing their dashboard
- WHEN "My Gigs" cards are rendered
- THEN each gig card MUST use `bg-surface-level-2` for the card background (instead of `bg-navy-900`)
- AND each gig card MUST use `border-neutral-weak` for the card border (instead of `border-gray-700`)
- AND each gig card MUST use `hover:bg-surface-level-3` for hover state (instead of `hover:bg-navy-700`)
- AND each gig card MUST use `hover:border-neutral-default` for hover border (instead of `hover:border-gray-600`)

#### Scenario: Specialist dashboard cards use token-based styling
- GIVEN a SPECIALIST user is viewing their dashboard
- WHEN Active Work, Pending Applications, or Archive cards are rendered
- THEN each card MUST use `bg-surface-level-2` for the card background (instead of `bg-navy-900`)
- AND each card MUST use `border-neutral-weak` for the card border (instead of `border-gray-700`)
- AND each card MUST use `hover:bg-surface-level-3` for hover state (instead of `hover:bg-navy-700`)
- AND each card MUST use `hover:border-neutral-default` for hover border (instead of `hover:border-gray-600`)

**Acceptance Criteria:**
- `app/(protected)/dashboard/page.tsx` updated for CLIENT gig cards
- `app/(protected)/dashboard/SpecialistDashboardTabs.tsx` updated for SPECIALIST cards
- Card backgrounds use `bg-surface-level-2` (replaces `bg-navy-900`)
- Card borders use `border-neutral-weak` (replaces `border-gray-700`)
- Hover states use `hover:bg-surface-level-3` and `hover:border-neutral-default`
- All existing functionality preserved (navigation, tab switching, status display)

---

### Requirement: Application Card Styling
Application cards on gig detail pages MUST use design token-based styling.

#### Scenario: Application cards use token-based styling
- GIVEN a CLIENT user is viewing a gig detail page with applications
- WHEN application cards are rendered
- THEN each application card MUST use `bg-surface-level-2` for the card background (instead of `bg-navy-900`)
- AND each application card MUST use `border-neutral-weak` for the card border (instead of `border-gray-700`)
- AND each application card MUST use `hover:bg-surface-level-3` for hover state (instead of `hover:bg-navy-700`)
- AND each application card MUST use `hover:border-neutral-default` for hover border (instead of `hover:border-gray-600`)

**Acceptance Criteria:**
- `app/(protected)/gigs/[id]/page.tsx` updated for application cards
- Application card backgrounds use `bg-surface-level-2`
- Application card borders use `border-neutral-weak`
- Hover states use token-based colors
- Accept/Reject buttons and application content remain unchanged

---

### Requirement: Status Badge Styling
Status badges for gigs and applications MUST use semantic design token-based styling.

#### Scenario: Gig status badges use token-based colors
- GIVEN any user is viewing a gig with a status
- WHEN the status badge is rendered
- THEN the badge MUST use semantic color tokens based on status:
  - OPEN: `bg-brand-subtle text-brand-default border-brand-default` (instead of `bg-blue-500/20 text-blue-400 border-blue-500/30`)
  - IN_PROGRESS: `bg-info-subtle text-info-default border-info-default` (instead of `bg-blue-500/20 text-blue-400 border-blue-500/30`)
  - REVIEW: `bg-warning-subtle text-warning-default border-warning-default` (instead of `bg-warning-500/20 text-warning-400 border-warning-500/30`)
  - COMPLETED: `bg-warning-subtle text-warning-default border-warning-default` (instead of `bg-warning-500/20 text-warning-400 border-warning-500/30`)
  - PAID: `bg-success-subtle text-success-default border-success-default` (instead of `bg-success-500/20 text-success-400 border-success-500/30`)
- AND the badge MUST maintain consistent padding, font size, and border radius

#### Scenario: Application status badges use token-based colors
- GIVEN a user is viewing application status badges
- WHEN the badge is rendered
- THEN the badge MUST use semantic color tokens based on status:
  - PENDING: `bg-warning-subtle text-warning-default border-warning-default`
  - ACCEPTED: `bg-success-subtle text-success-default border-success-default`
  - REJECTED: `bg-error-subtle text-error-default border-error-default`
  - WITHDRAWN: `bg-neutral-subtle text-neutral-default border-neutral-default` (instead of `bg-gray-500/20 text-gray-400 border-gray-500/30`)

**Acceptance Criteria:**
- All status badge instances updated across:
  - `app/(protected)/gigs/page.tsx` (gig browse cards)
  - `app/(protected)/dashboard/page.tsx` (client dashboard)
  - `app/(protected)/dashboard/SpecialistDashboardTabs.tsx` (specialist dashboard)
  - `app/(protected)/gigs/[id]/page.tsx` (gig detail page)
- Status badges use semantic color tokens (brand, info, warning, success, error, neutral)
- Badge structure and content remain unchanged
- Visual consistency maintained with appropriate semantic colors

---

## ADDED Requirements

### Requirement: Design Token Fallback Handling
The application MUST handle cases where design tokens are not available in the Tailwind configuration.

#### Scenario: Missing design tokens are detected
- GIVEN the design token parsing script has not been run
- WHEN the application is built
- THEN Tailwind MUST warn about missing utility classes
- AND the build MUST NOT fail silently
- AND developers MUST be able to identify missing tokens from build output

**Acceptance Criteria:**
- No silent failures when tokens are missing
- Build process validates token availability
- Clear error messages for missing tokens

---

### Requirement: Token-Based Styling Documentation
The design system documentation MUST include examples of token-based card and badge styling.

#### Scenario: Developers reference token-based card patterns
- GIVEN a developer is implementing a new card component
- WHEN they reference the design system documentation
- THEN the documentation MUST include token-based card examples
- AND the documentation MUST show before/after migration examples
- AND the documentation MUST explain semantic token naming

**Acceptance Criteria:**
- `docs/DESIGN_SYSTEM.md` includes token-based card examples
- Documentation shows migration from hardcoded to token-based classes
- Examples demonstrate proper token usage for cards and badges

---

## REMOVED Requirements

None. This change does not remove any existing requirements.
