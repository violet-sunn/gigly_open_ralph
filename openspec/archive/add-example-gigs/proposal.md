# Change Proposal: Add Example Gigs

## Problem Statement

Clients struggle to articulate clear requirements when posting gigs. The platform provides structured fields (goal, deliverables, constraints, acceptance criteria), but many clients don't know what "good" looks like. This leads to:

- Poorly specified gigs that receive few or low-quality applications
- Scope creep and disputes due to unclear expectations
- Specialists wasting time on gigs with fuzzy requirements
- Clients feeling overwhelmed by the gig creation form

## Proposed Solution

Create 3-5 **example gigs** that demonstrate excellent requirements across different project types (backend, frontend, DevOps, etc.). These example gigs will:

1. **Teach by example**: Show clients what clear acceptance criteria, well-defined goals, specific deliverables, and realistic constraints look like
2. **Be visible on gig browsing**: Display with a visual "Example" indicator so they're easy to identify
3. **Cover diverse use cases**: Backend API development, frontend component work, DevOps automation, database optimization, etc.
4. **Be read-only**: Example gigs do not accept real applications (they're for demonstration only)

## Scope

### In Scope
- Add `isExample` boolean field to Gig model
- Create database seed with 3-5 high-quality example gigs
- Display "Example" badge on gig browsing and detail pages
- Prevent applications to example gigs (hide apply form, show informational message)
- Example gigs remain in OPEN status permanently (not part of real gig lifecycle)

### Out of Scope
- Admin UI for creating/editing example gigs (use seed data for MVP)
- Filtering/sorting by example status (can be added later if needed)
- Example applications (just example gigs for now)
- Localization of example content (Russian only for MVP)

## Constraints

- Example gigs must be realistic and representative of actual platform use cases
- Example gigs must demonstrate ALL structured requirement fields (goal, deliverables, constraints, acceptance criteria)
- Example gigs should have realistic budgets (150k-200k RUB range)
- Example gigs must not interfere with real gig browsing (clear visual distinction)
- No real applications should be created for example gigs

## Non-Goals

- This is NOT a tutorial system or onboarding flow
- This is NOT a template system (clients still write their own requirements)
- This is NOT a gig duplication feature (clients can read examples but must create their own gigs)

## Success Metrics

- % of new clients who view at least one example gig before posting their first gig
- Improvement in average acceptance criteria length for new gigs (after example gigs are added)
- Reduction in gigs with empty optional fields (goal, deliverables, constraints)
- Qualitative feedback from clients: "I understood what to write after seeing the examples"
