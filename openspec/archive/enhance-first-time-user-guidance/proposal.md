# Proposal: Enhance First-Time User Guidance

## Problem Statement

New users (both clients and specialists) face a steep learning curve when creating their first gig or submitting their first application. Key pain points:

1. **Unclear Expectations**: First-time clients don't understand what makes good acceptance criteria or why structured requirements matter
2. **Concept Confusion**: Terms like "acceptance criteria", "service fee", "technical approach" are not self-explanatory
3. **Quality Issues**: Poor first gigs/applications due to lack of guidance lead to bad marketplace experiences
4. **Hidden Value**: Users don't discover helpful features (example gigs, structured fields) because they're not surfaced at the right moment

This directly impacts the core value proposition: "Clarity Upfront, Success at the End" requires users to understand how to create clear requirements and demonstrate competence.

## Solution Approach

Add contextual, dismissible guidance that appears for first-time users at key decision points:

### For First-Time Gig Creators (CLIENT)
- **Contextual Help Banner**: Appears at top of gig creation form, explains the importance of clear requirements
- **Inline Tooltips**: Info icons next to key fields (acceptance criteria, service fee) with explanatory text
- **Field-Level Guidance**: Placeholder text and examples that teach by showing
- **Link to Examples**: Prominent link to example gigs (already exists, make more discoverable)

### For First-Time Applicants (SPECIALIST)
- **Application Guidance Banner**: Explains what makes a strong application (substance over sales)
- **Inline Tooltips**: Info icons explaining technical approach, clarifying questions, estimated effort
- **"What Makes a Good Application?" Link**: Opens modal or page with detailed guidance and examples
- **Field-Level Examples**: Show what good technical approaches and questions look like

### Dismissibility & User Experience
- All guidance is dismissible (close button)
- Dismissal state persisted per user (database fields)
- Guidance automatically hidden after first successful gig/application
- Returning users never see guidance (clean, professional experience)

## Constraints

1. **No Mandatory Tutorials**: No forced walkthroughs or multi-step wizards (annoying, not professional)
2. **Minimal Visual Clutter**: Guidance should be helpful, not overwhelming
3. **Performance**: No additional page loads or blocking operations
4. **Backward Compatibility**: Existing users see no changes unless they explicitly reset guidance
5. **Mobile-Friendly**: All tooltips and help text must work on mobile viewports

## Non-Goals

- Interactive tutorials or product tours (too heavy for MVP)
- Video content or rich media (adds complexity)
- Gamification or achievement systems (not aligned with B2B positioning)
- Email-based onboarding sequences (deferred to post-MVP)
- Role-specific dashboards with onboarding checklists (separate feature)

## Success Criteria

1. **Reduced Support Burden**: Fewer questions about "what is acceptance criteria?" or "how do I apply?"
2. **Higher Quality First Submissions**: First gigs have better acceptance criteria, first applications have better technical approaches
3. **Improved Completion Rates**: More first-time users complete gig creation or application submission
4. **No Negative Impact on Returning Users**: Experienced users see no guidance, no performance degradation

## Implementation Phases

### Phase 1: Core Guidance Components (This Change)
- User state tracking (hasCreatedFirstGig, hasSubmittedFirstApplication, guidanceDismissed flags)
- Reusable UI components (Tooltip, HelpBanner, InfoIcon)
- Gig creation form guidance
- Application form guidance

### Phase 2: Enhanced Content (Future)
- "What Makes a Good Application?" dedicated page with examples
- Interactive examples (click to see good vs. bad acceptance criteria)
- Contextual help for other forms (profile creation, messaging)

## Technical Approach

### Database Changes
Add fields to User model:
- `hasCreatedFirstGig: Boolean` (default false)
- `hasSubmittedFirstApplication: Boolean` (default false)
- `gigCreationGuidanceDismissed: Boolean` (default false)
- `applicationGuidanceDismissed: Boolean` (default false)

### UI Components
Create reusable components:
- `<Tooltip>` - Hover/click info icon with explanatory text
- `<HelpBanner>` - Dismissible banner with contextual guidance
- `<InfoIcon>` - Consistent info icon for tooltips

### Server Actions
Update existing actions:
- `createGig` - Set `hasCreatedFirstGig = true` on first successful gig
- `applyToGig` - Set `hasSubmittedFirstApplication = true` on first successful application
- New: `dismissGuidance(type: string)` - Persist dismissal state

### Guidance Logic
Show guidance when:
- `hasCreatedFirstGig === false` AND `gigCreationGuidanceDismissed === false` (for gig form)
- `hasSubmittedFirstApplication === false` AND `applicationGuidanceDismissed === false` (for application form)

## Risk Mitigation

**Risk**: Guidance feels patronizing to experienced users who are new to the platform
**Mitigation**: Make dismissal prominent, auto-hide after first success, use professional tone

**Risk**: Tooltips don't work well on mobile
**Mitigation**: Use click-to-open on mobile (not hover), ensure touch targets are 44x44px minimum

**Risk**: Database fields add complexity
**Mitigation**: Use simple boolean flags, no complex state machine, easy to reset for testing

**Risk**: Guidance becomes stale as product evolves
**Mitigation**: Store guidance content in components (easy to update), not in database

## Open Questions

1. Should we add guidance to other forms (profile creation)? **Decision: No, focus on core loop (gig creation, application submission)**
2. Should guidance be role-specific or generic? **Decision: Role-specific (different guidance for CLIENT vs SPECIALIST)**
3. Should we track dismissal per-field or per-form? **Decision: Per-form (simpler, less annoying)**
