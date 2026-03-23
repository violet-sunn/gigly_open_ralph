# Proposal: Add Breadcrumb Navigation

## Problem Statement

Users navigating deep into the application (gig details, profile pages, admin sections) lack contextual awareness of their location within the site hierarchy. Without breadcrumbs, users must rely on browser back buttons or main navigation to understand where they are and navigate to parent pages, creating a suboptimal user experience.

## Solution

Implement a breadcrumb navigation component that displays the current page's hierarchical path and allows users to quickly navigate to parent pages. Breadcrumbs will be added to:

1. **Gig detail pages** (`/gigs/[id]`) - showing path from Dashboard
2. **Profile pages** (`/profile`, `/profile/edit`, `/profile/[userId]`) - showing path from Dashboard
3. **Admin pages** (`/admin/users`, `/admin/gigs`) - showing path from Admin dashboard

## Design Approach

### Component Architecture

Create a reusable `Breadcrumb` component that:
- Accepts an array of breadcrumb items (label, href, current flag)
- Renders clickable links for parent pages
- Renders non-clickable text for the current page
- Uses design tokens for consistent styling
- Implements responsive behavior (collapse on mobile)

### Integration Points

Breadcrumbs will be integrated at the page level (not in layout) to allow page-specific breadcrumb paths. Each page will render its own breadcrumb trail based on its context.

### Responsive Strategy

On mobile viewports (< 768px):
- Show only the immediate parent and current page
- Use ellipsis (...) to indicate collapsed levels
- Maintain full breadcrumb trail on tablet and desktop

## Constraints

- MUST use design tokens from `openspec/specs/ui/design-tokens.json`
- MUST NOT modify existing navigation structure
- MUST be accessible (keyboard navigation, screen readers)
- MUST handle dynamic content (gig titles, user names)
- SHOULD load breadcrumb data efficiently (no extra queries where possible)

## Non-Goals

- Breadcrumbs on top-level pages (Dashboard, Browse Gigs, Post Gig)
- Breadcrumb history tracking (browser back/forward)
- Breadcrumb customization per user
- Breadcrumb analytics or tracking

## Success Criteria

1. Breadcrumbs appear on all specified deep pages
2. Clicking breadcrumb links navigates to correct pages
3. Current page is visually distinct and non-clickable
4. Breadcrumbs collapse appropriately on mobile devices
5. All styling uses design tokens (no hardcoded colors)
6. Component passes accessibility audit (keyboard, screen reader)
