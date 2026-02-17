# Change Proposal: Requirements Iteration 2 - Structured Requirement Fields

## Problem Statement

Current state: The platform requires clients to provide "Definition of Done" (acceptance criteria) with a minimum of 50 characters. While this helps prevent completely vague requirements, it doesn't actively guide non-technical clients through the process of articulating what they need.

**CLIENT persona pain points (from project.md):**
- Struggle to articulate clear requirements
- Non-technical stakeholders know what they want but can't translate it into technical specs
- Need help defining what "done" looks like without feeling like they need a technical degree
- Scope creep and disputes arise from poorly specified tasks

**The gap:** A single "acceptance criteria" field is better than nothing, but it's still a blank canvas. Non-technical clients often don't know where to start or what to include.

## Proposed Solution

Add three optional structured fields to the gig creation form that guide clients through requirement articulation:

1. **Goal/Outcome** - "What problem are you solving? What does success look like?"
2. **Deliverables** - "What specific outputs do you expect? (e.g., working feature, documentation, deployment)"
3. **Constraints/Preferences** - "Any technical preferences, timeline considerations, or other constraints?"

### Design Principles

- **Optional, not mandatory** - These fields are guidance, not bureaucracy. Clients can skip them if they already have clear requirements.
- **Helpful prompts** - Placeholder text and examples show what to include without being prescriptive.
- **Visible on gig detail** - When filled, these fields are displayed prominently to specialists, reducing back-and-forth clarification.
- **Complement existing acceptance criteria** - These fields work alongside the existing `acceptanceCriteria` field, not replacing it.

### Why This Helps

**For non-technical clients:**
- Structured prompts break down the intimidating task of "write requirements" into manageable questions
- Examples in placeholders show what good requirements look like
- Optional nature means no pressure - use what helps, skip what doesn't

**For specialists:**
- Better context upfront means fewer clarifying questions
- Clear deliverables reduce scope creep disputes
- Understanding constraints helps with realistic time estimates

**For the platform:**
- Reduces "empty bar" problem (gigs with 0 applications due to unclear requirements)
- Reduces dispute rate (clearer expectations upfront)
- Improves application quality (specialists can assess fit better)

## Scope

### In Scope
- Add three new optional text fields to Gig model: `goal`, `deliverables`, `constraints`
- Update gig creation form with new fields and helpful placeholder text
- Display new fields on gig detail page when filled (graceful handling of empty values)
- Update `createGig` server action to accept and store new fields

### Out of Scope
- Making these fields required (they are optional by design)
- Complex validation beyond basic length limits
- Structured templates or dropdowns (keep it freeform text)
- Editing existing gigs (MVP focuses on creation flow)
- AI-assisted requirement generation (future enhancement)

## Constraints

- **No "homework" feeling** - The form should feel helpful, not like a bureaucratic checklist. Use friendly language and examples.
- **Backward compatibility** - Existing gigs without these fields must display gracefully (show "Not specified" or hide empty sections).
- **Performance** - New fields are simple text, no complex queries or processing required.
- **Mobile-friendly** - Form must remain usable on mobile devices (responsive textarea sizing).

## Success Metrics

- **Adoption rate** - % of new gigs that fill at least one optional field (target: >40%)
- **Application quality** - Average applications per gig should increase (better clarity attracts more specialists)
- **Dispute rate** - % of gigs requiring admin intervention should decrease (clearer requirements reduce conflicts)
- **Client feedback** - Qualitative feedback from clients on whether the prompts were helpful

## Non-Goals

- Enforcing a specific requirement format or template
- Validating the quality or completeness of requirements (that's what specialist questions are for)
- Replacing the existing acceptance criteria field
- Adding rich text editing or file attachments (keep it simple text)
