# Change Proposal: Acceptance Criteria Quality Guidance

## Problem Statement

Users sometimes write very brief acceptance criteria (just above the 50-character minimum), which leads to:
- **Disputes over deliverables**: Vague criteria like "make it work" or "fix the bug" leave room for interpretation
- **Scope creep**: Without clear boundaries, specialists may under-deliver or clients may expect more than agreed
- **Wasted time**: Both parties spend time clarifying expectations that should have been defined upfront

The current hard validation (minimum 50 characters) prevents empty submissions but doesn't encourage **quality** criteria. A specialist seeing "The API should return user data" (38 chars, but let's say padded to 51) has no clarity on:
- What fields should be returned?
- What format (JSON structure)?
- What error cases to handle?
- What performance expectations?

## Proposed Solution

Add **soft validation** that encourages more detailed acceptance criteria without blocking submission. This creates "good friction" that guides clients toward clarity while respecting their autonomy.

### Key Principles

1. **Encouraging, not punitive**: Use positive language ("Consider adding more detail") rather than negative ("This is too short")
2. **Non-blocking**: Users can always submit, even with brief criteria
3. **Contextual**: Warning appears only when criteria is above hard minimum but below quality threshold
4. **Responsive**: Warning disappears immediately when user adds sufficient detail

### Proposed Thresholds

- **Hard minimum (existing)**: 50 characters - blocks submission
- **Quality threshold (new)**: 150 characters - triggers soft warning
- **Warning range**: 50-149 characters

**Rationale for 150 characters**:
- Roughly 2-3 sentences of meaningful detail
- Enough to describe what, why, and basic success criteria
- Not so high that it feels like homework
- Aligns with product philosophy: "Clarity Through Structure (Not Bureaucracy)"

### Proposed Warning Message

**Text**: "💡 Consider adding more detail to prevent disputes. What specific deliverables, quality standards, or success metrics define 'done'?"

**Rationale**:
- Lightbulb emoji signals helpful suggestion, not error
- "Consider" is softer than "You must" or "Please"
- Explains the benefit ("prevent disputes") rather than just demanding more text
- Provides concrete examples of what to add (deliverables, standards, metrics)
- Question format invites reflection rather than commanding

### Visual Styling

- **Color**: Amber/yellow (`bg-amber-50`, `border-amber-300`, `text-amber-800`)
- **Icon**: 💡 (lightbulb) to signal helpful tip
- **Position**: Below the acceptanceCriteria textarea, above the character counter
- **Style**: Bordered box with light background, not intrusive
- **Animation**: Fade in/out smoothly (not jarring)

**Rationale**:
- Amber is "caution" not "error" (red) or "success" (green)
- Positioned near the field but doesn't block other content
- Subtle enough to ignore if user disagrees, visible enough to notice

### Show/Hide Logic

**Show warning when**:
- Character count >= 50 (above hard minimum)
- AND character count < 150 (below quality threshold)
- AND user has interacted with the field (not on initial page load)

**Hide warning when**:
- Character count >= 150
- OR character count < 50 (hard validation error takes precedence)
- OR user hasn't interacted with field yet

**Rationale**:
- Don't show warning on page load (feels naggy)
- Don't show warning when hard validation error is already showing (avoid double-messaging)
- Hide immediately when threshold is reached (positive reinforcement)

## Constraints

1. **Must not block submission**: Form submission logic unchanged
2. **Must not interfere with existing validation**: Hard minimum (50 chars) still enforced
3. **Must not impact performance**: Warning logic runs client-side only
4. **Must be accessible**: Warning must be announced to screen readers
5. **Must align with brand voice**: Encouraging and helpful, not bureaucratic

## Non-Goals

- Enforcing specific acceptance criteria formats or templates
- Analyzing content quality (semantic analysis)
- Blocking submission based on quality threshold
- Adding similar warnings to other fields (scope limited to acceptanceCriteria only)

## Success Metrics

**Leading Indicators** (can measure immediately):
- % of submitted gigs with acceptanceCriteria >= 150 characters
- Average character count of acceptanceCriteria field
- % of users who see warning and then add more detail (engagement rate)

**Lagging Indicators** (measure over time):
- Reduction in dispute rate (% of gigs requiring admin intervention)
- Reduction in scope creep complaints (qualitative feedback)
- Increase in specialist satisfaction with gig clarity (survey data)

**Target**: 60%+ of gigs submitted with acceptanceCriteria >= 150 characters (up from current baseline)

## Risks & Mitigations

**Risk**: Users find the warning annoying and ignore it
**Mitigation**: Use encouraging language, make it easy to dismiss mentally, ensure it doesn't block workflow

**Risk**: 150-character threshold is too low/high
**Mitigation**: Threshold is a constant that can be easily adjusted based on data

**Risk**: Warning feels like nagging, damages UX
**Mitigation**: Amber styling (not red), lightbulb icon (not warning triangle), positive framing

**Risk**: Users pad with meaningless text to dismiss warning
**Mitigation**: Acceptable trade-off - we're encouraging, not enforcing. Users who want to ignore it can.

## Implementation Scope

**Frontend changes**:
- Add warning component to gig creation form
- Implement show/hide logic based on character count
- Add accessibility attributes (aria-live)
- Style with Tailwind classes

**Backend changes**:
- None (soft validation is client-side only)

**Testing**:
- Verify warning appears at 50-149 characters
- Verify warning disappears at 150+ characters
- Verify warning doesn't block submission
- Verify accessibility with screen reader
- Verify warning doesn't appear on page load

## Alignment with Product Vision

This change aligns with:
- **Design Principle #1**: "Clarity Through Structure (Not Bureaucracy)" - we guide without mandating
- **Problem Statement**: "Fuzzy requirements and unclear 'definition of done'" - this directly addresses it
- **Client Persona Pain Point**: "Struggle to articulate clear requirements" - we provide helpful nudges
- **Specialist Persona Pain Point**: "Wasted time on fuzzy projects" - better criteria = less wasted time
- **MVP Philosophy**: Simple, non-intrusive, validates core value (clarity) without over-engineering
