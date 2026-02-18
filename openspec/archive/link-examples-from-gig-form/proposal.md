# Change Proposal: Link Examples from Gig Form

## Problem Statement

Users creating their first gig often don't know what good requirements look like or how detailed they should be. While example gigs exist on the platform (created in iteration 15.4), new users may not discover them before posting their first gig. This leads to:

- Poorly specified first gigs due to lack of reference examples
- Users feeling uncertain about what to write in structured fields (goal, deliverables, constraints, acceptance criteria)
- Missed opportunity to educate users at the point of need (during gig creation)
- Lower quality gigs that could have been improved with inspiration from examples

## Proposed Solution

Add a discoverable, non-intrusive link to example gigs directly on the gig creation form at `/dashboard/gigs/new`. The link will:

1. **Be positioned strategically**: Placed in the "Requirements & Success Criteria" section header, where users need the most guidance
2. **Communicate purpose clearly**: Use text like "💡 View example gigs for inspiration" to signal its educational intent
3. **Preserve form progress**: Open in a new browser tab so users don't lose their work
4. **Feel optional and helpful**: Styled as a subtle secondary link, not a prominent CTA that feels mandatory

## Scope

### In Scope
- Add a link to `/dashboard/gigs` in the gig creation form
- Position link in the "Requirements & Success Criteria" section header
- Style link as subtle, helpful, and non-intrusive (secondary styling)
- Link opens in new tab (`target="_blank"` with `rel="noopener noreferrer"`)
- Clear, friendly text that explains the purpose

### Out of Scope
- Modal/overlay implementation (too complex for MVP, new tab is simpler)
- Filtering to show only example gigs (browse page already has example badges)
- Form state persistence in localStorage (new tab preserves state naturally)
- Tracking analytics on link clicks (can be added later)
- Inline example previews or tooltips (keep it simple)

## Constraints

- Link must not distract from the primary task (creating a gig)
- Link must not feel like a required step or blocker
- Link must preserve user's form progress (no navigation away from form)
- Link must work on mobile devices (new tab behavior is standard)
- Link text must be clear and actionable (no vague "Learn more" text)

## Non-Goals

- This is NOT a tutorial system or guided onboarding flow
- This is NOT a template/duplication feature (users still write their own content)
- This is NOT a filter or search feature for examples (browse page handles that)
- This is NOT a form validation enhancement (separate concern)

## Success Metrics

- % of new clients who click the example link before submitting their first gig
- Improvement in first-gig quality metrics (acceptance criteria length, optional fields filled)
- Qualitative feedback: "I found the examples helpful when creating my gig"
- Reduction in support requests about "what to write in requirements"

## Design Decisions

### Link Placement
**Decision**: Place in the "Requirements & Success Criteria" section header, aligned to the right.

**Rationale**: This section contains the fields where users need the most guidance (acceptance criteria, goal, deliverables, constraints). Placing the link here provides help at the exact moment of need.

**Alternatives considered**:
- Top of form: Too early, users haven't encountered the problem yet
- Bottom of form: Too late, users have already struggled
- Multiple links per field: Too repetitive and intrusive

### Link Text
**Decision**: "💡 View example gigs for inspiration"

**Rationale**:
- Lightbulb emoji signals "helpful tip" without being pushy
- "View example gigs" is clear and specific (not vague "Learn more")
- "for inspiration" frames it as optional and helpful, not mandatory

**Alternatives considered**:
- "See examples": Too vague, doesn't explain what examples
- "Need help? View examples": Implies user is struggling, might feel condescending
- "Example gigs": Too terse, doesn't explain purpose

### Navigation Approach
**Decision**: Open in new tab (`target="_blank"`)

**Rationale**:
- Preserves form state naturally (no complex state management needed)
- Standard web pattern users understand
- Works reliably on mobile and desktop
- Simple to implement

**Alternatives considered**:
- Modal/overlay: Complex to implement, heavy UX, might feel intrusive
- Same-tab navigation: Loses form progress, frustrating for users
- Inline expansion: Clutters the form, breaks visual hierarchy

### Link Styling
**Decision**: Secondary link styling (text-sm, text-indigo-600, hover:text-indigo-800, underline)

**Rationale**:
- Subtle enough to not distract from primary task
- Visible enough to be discoverable
- Indigo color matches "Example" badge color (visual consistency)
- Small text size signals "optional helper" not "primary action"

**Alternatives considered**:
- Button styling: Too prominent, feels mandatory
- Gray text: Too subtle, might be missed
- Icon-only: Not clear enough what it does
