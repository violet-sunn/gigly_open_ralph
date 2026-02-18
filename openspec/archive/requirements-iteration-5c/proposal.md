# Change Proposal: Gig Form Visual Sections

## Problem Statement

The gig creation form at `/dashboard/gigs/new` currently contains 8 input fields (title, description, acceptanceCriteria, goal, deliverables, constraints, budget, tags) that serve different purposes. While there is a basic "Additional Details (Optional)" grouping, the overall form structure makes it difficult for users to:

1. **Understand the form's logical flow** - fields are presented in a flat list without clear conceptual grouping
2. **Quickly locate specific fields** - no visual boundaries between different types of information
3. **Grasp what information goes where** - section purposes are not explicitly stated

This creates cognitive load, especially for first-time users who are unfamiliar with the platform's gig creation process.

## Solution

Organize the gig creation form into three visually distinct sections with clear headings and boundaries:

### Proposed Section Structure

1. **Basic Information**
   - Fields: title, description
   - Purpose: Core gig identity and overview
   - Heading: "Basic Information"
   - Description: "Provide a clear title and overview of the work"

2. **Requirements & Success Criteria**
   - Fields: acceptanceCriteria, goal, deliverables, constraints
   - Purpose: Define what "done" looks like and provide context
   - Heading: "Requirements & Success Criteria"
   - Description: "Define what success looks like and help specialists understand your needs"

3. **Budget & Details**
   - Fields: budget, service fee preview, tags
   - Purpose: Commercial terms and categorization
   - Heading: "Budget & Details"
   - Description: "Set your budget and add tags to help specialists find your gig"

### Visual Styling Approach

- **Section containers**: Each section wrapped in a `<div>` with border, background color, and padding
- **Section headers**: Clear heading (h3) with descriptive subtext
- **Visual hierarchy**: Use Tailwind classes for consistent spacing and borders
- **Mobile responsive**: Maintain existing responsive behavior (already using Tailwind's responsive utilities)

### Design Rationale

- **Three sections, not more**: Avoids over-segmentation while providing clear structure
- **Logical grouping**: Fields grouped by purpose (identity → requirements → commercial)
- **Progressive disclosure**: Basic info first, detailed requirements second, budget last
- **Backward compatible**: No changes to field names, validation, or server actions

## Constraints

- **No functional changes**: All existing validation, character counters, and server actions remain unchanged
- **No new dependencies**: Use existing Tailwind CSS classes only
- **Maintain accessibility**: Preserve all ARIA labels, form semantics, and keyboard navigation
- **Mobile-first**: Sections must stack cleanly on mobile devices
- **No performance impact**: Pure CSS changes, no additional JavaScript

## Non-Goals

- Changing field validation rules or error messages
- Adding new fields or removing existing fields
- Modifying the character counter components
- Changing the form submission behavior
- Adding animations or transitions (keep it simple)

## Success Metrics

- Users can quickly identify which section contains the field they need
- Visual boundaries are clear without being overwhelming
- Form remains fully functional on mobile devices (320px width and up)
- No increase in form submission errors or abandonment

## Risks & Mitigations

**Risk**: Visual changes might confuse existing users who are familiar with the current layout
**Mitigation**: Changes are purely additive (grouping), not reordering fields

**Risk**: Additional borders/backgrounds might feel cluttered
**Mitigation**: Use subtle colors (gray-50 backgrounds, gray-200 borders) and adequate spacing

**Risk**: Mobile layout might break with nested containers
**Mitigation**: Test on mobile viewport, use Tailwind's responsive utilities
