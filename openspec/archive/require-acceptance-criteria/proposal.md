# Change Proposal: Require Acceptance Criteria

## Change ID
`require-acceptance-criteria`

## Status
Proposed

## Context

One of the core problems identified in the Product Vision is **"Fuzzy requirements and unclear 'definition of done'"**. The project.md states:

> "Most project failures stem from poorly specified tasks, not lack of talent. Non-technical stakeholders struggle to articulate clear requirements, leading to scope creep, disputes, and wasted effort."

Currently, gigs only have a `description` field, which often mixes context, requirements, deliverables, and constraints into a single unstructured text block. This makes it difficult for:
- **Clients** to clearly define what "done" looks like
- **Specialists** to understand exactly what they're committing to deliver
- **Both parties** to avoid disputes about whether work meets expectations

## Problem Statement

Without a dedicated, required "Definition of Done" field:
1. Clients create vague gigs that lead to scope creep and disputes
2. Specialists waste time applying to poorly-defined gigs
3. The platform fails to deliver on Design Principle #1: **Clarity Through Structure**
4. The core value proposition ("Clarity Upfront, Success at the End") is undermined

## Proposed Solution

Add a **required, separate `acceptanceCriteria` field** to gig creation that:
- Is clearly labeled as "Definition of Done" or "Acceptance Criteria" in the UI
- Is distinct from the general description field
- Enforces a minimum length of 50 characters to ensure meaningful content
- Is prominently displayed on gig detail pages for both clients and specialists
- Cannot be bypassed (gig creation fails without it)

This creates "good friction" that filters for quality: clients who care about outcomes will take the time to define success criteria.

## Scope

### In Scope
- Add `acceptanceCriteria` field to Gig model (required, text)
- Update `createGig` server action with validation (required, min 50 chars)
- Update gig creation form UI with dedicated field and helpful guidance
- Display acceptance criteria prominently on gig detail pages
- Add validation error messages for missing or too-short criteria

### Out of Scope
- Editing acceptance criteria after gig creation (deferred to future change)
- Structured/templated acceptance criteria (keep it free-form for MVP)
- AI-assisted criteria generation (future enhancement)
- Acceptance criteria for existing gigs (migration not required; applies to new gigs only)

## Design Constraints

1. **Minimum Length**: 50 characters enforced to prevent trivial entries like "do the work"
2. **Separate Field**: Must be distinct from description to maintain clarity
3. **Required**: Cannot create gig without acceptance criteria (hard validation)
4. **Prominent Display**: Must be visible on gig detail page before specialists apply
5. **User-Facing Label**: Use "Definition of Done" or "Acceptance Criteria" (not technical jargon)

## Success Criteria

1. Gig creation form includes dedicated acceptance criteria field with clear label
2. Form validation prevents submission with empty or <50 char acceptance criteria
3. Gig detail page displays acceptance criteria in a visually distinct section
4. Database enforces non-null constraint on acceptanceCriteria field
5. Existing tests pass; new tests validate acceptance criteria requirement

## Risks & Mitigations

**Risk**: Clients may find the required field annoying and abandon gig creation.
**Mitigation**: Provide helpful placeholder text and examples. This is intentional "good friction" that filters for quality clients.

**Risk**: 50-character minimum may be too restrictive or too lenient.
**Mitigation**: Start with 50 chars as a reasonable baseline. Can adjust based on real usage data.

**Risk**: Existing gigs in database don't have acceptance criteria.
**Mitigation**: Make field nullable in DB but required in form validation. Existing gigs display "Not specified" if null.

## Dependencies

None. This change is self-contained and does not depend on other in-flight changes.

## Estimated Effort

Small (1-2 hours):
- Schema change: 5 minutes
- Server action update: 15 minutes
- Form UI update: 30 minutes
- Detail page update: 20 minutes
- Testing: 30 minutes
