# Change Proposal: Character Count Feedback for Gig Creation Form

## Change ID
`requirements-iteration-5a`

## Problem Statement

Users filling out the gig creation form lack real-time feedback on how much they've written in textarea fields. This creates uncertainty about:
- Whether they've met minimum character requirements (acceptanceCriteria: 50 chars)
- How much more detail they should provide in optional fields
- Progress toward completeness as they type

Without this feedback, users may:
- Submit forms that fail validation, causing frustration
- Write too little or too much without guidance
- Feel uncertain about whether their input is adequate

## Proposed Solution

Add real-time character count indicators to all textarea fields in the gig creation form:
- **acceptanceCriteria** (required, min 50 chars)
- **goal** (optional, max 1000 chars)
- **deliverables** (optional, max 1000 chars)
- **constraints** (optional, max 1000 chars)

### Display Format
- For required fields with minimums: "X / 50 characters (minimum)"
- For optional fields with maximums: "X / 1000 characters"
- Color coding:
  - Red text when under minimum (required fields only)
  - Gray text when valid
  - Orange text when approaching maximum (>90%)

### Placement
- Positioned inline with existing helper text, right-aligned
- Does not replace existing helper text, complements it

### Update Mechanism
- React `useState` hook to track character count
- `onChange` handler on each textarea
- Real-time updates as user types (no debouncing needed for simple counter)

### Styling Principles
- Subtle: small font size (text-sm), muted colors
- Non-intrusive: right-aligned, doesn't break layout
- Informative: clear visual feedback without being distracting

## Constraints

- Must not break existing form functionality
- Must not interfere with existing validation logic
- Must be accessible (screen reader friendly)
- Must work consistently across all four textarea fields
- Performance: character counting must not cause input lag

## Non-Goals

- Character count for non-textarea fields (title, tags, budget)
- Word count (only character count)
- Advanced text analysis (readability, complexity)
- Persistent storage of draft content
- Character count on application form (separate change)

## Success Criteria

1. All four textarea fields display real-time character counts
2. Counts update immediately as user types
3. Visual feedback clearly indicates when minimum requirements are met
4. Users can see progress toward maximum limits
5. No performance degradation or input lag
6. Existing form validation and submission logic unchanged
7. Accessible to screen readers (aria-live region or similar)

## Rollout Plan

1. Implement character counter component
2. Integrate into gig creation form
3. Manual testing across all four fields
4. Verify validation still works correctly
5. Deploy to production

## Risks & Mitigations

**Risk:** Character counting logic inconsistent with server-side validation
**Mitigation:** Use `.length` property consistently, document trimming behavior

**Risk:** Visual clutter distracts from form completion
**Mitigation:** Use subtle styling, right-align to keep out of primary reading flow

**Risk:** Accessibility issues for screen reader users
**Mitigation:** Use aria-live="polite" for dynamic count updates
