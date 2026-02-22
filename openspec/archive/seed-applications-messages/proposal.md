# Change Proposal: Seed Applications and Messages

## Problem Statement

The current seed data (`prisma/seed.ts`) provides a realistic development environment with users and gigs, but lacks sufficient applications and messages to demonstrate the full marketplace dynamics:

- **5 OPEN example gigs have zero applications** - This makes it impossible to test the application review workflow, and the gig browsing experience looks empty for clients.
- **Workflow gigs have minimal message threads** - Current workflow gigs (IN_PROGRESS, REVIEW, COMPLETED, PAID) have only 2-3 messages each, which doesn't demonstrate realistic client-specialist communication patterns.
- **No diversity in application quality** - Without multiple applications per gig, we can't demonstrate how clients compare and choose between specialists.

This creates a poor development experience where developers must manually create test data to work on application-related features.

## Proposed Solution

Enhance the seed script to create a complete, realistic marketplace environment:

1. **Add 2-3 applications to each OPEN example gig** (5 gigs × 2-3 applications = 10-15 new applications)
   - Applications from different specialists with varying experience levels
   - Realistic Russian content for technical approach and clarifying questions
   - Mix of strong and weaker applications to demonstrate selection criteria

2. **Add more messages to workflow gigs** (expand from 2-3 to 3-5 messages per gig)
   - Realistic conversation flow between client and assigned specialist
   - Cover different phases: kickoff, progress updates, clarifications, completion
   - Demonstrate professional communication patterns in Russian IT market

3. **Ensure accepted applications exist for all non-OPEN gigs**
   - Already implemented for workflow gigs, verify completeness

## Implementation Approach

**CRITICAL: Avoid Code Duplication**

- **For OPEN gigs (new applications):** Create a NEW section in seed.ts between example gigs and workflow gigs
  - Use compound unique constraint `gigId_specialistId` for idempotent upserts
  - This is safe because these gigs currently have zero applications

- **For workflow gigs (additional messages):** DO NOT create new code blocks
  - Locate EXISTING workflow gig blocks (mobile-ui, microservices, k8s-setup, api-docs, redis-caching)
  - Add new messages directly within those existing blocks
  - Maintain chronological timestamp order
  - This prevents parallel pipelines and keeps all data for one gig in one place

**Architectural Principle:** One gig = one code block with all its data (gig + applications + messages)

## Constraints

- **No schema changes** - This is purely a data seeding enhancement
- **Idempotent seed script** - Must use upsert patterns to avoid duplicates on re-run
- **Realistic Russian content** - All applications and messages must use natural Russian language appropriate for B2B IT marketplace
- **Respect existing data** - Don't modify or delete existing seed data, only add new records
- **Performance** - Seed script should complete in reasonable time (<30 seconds)

## Success Criteria

- All 5 OPEN example gigs have 2-3 applications from different specialists
- All workflow gigs (IN_PROGRESS, REVIEW, COMPLETED, PAID) have 3-5 messages demonstrating realistic communication
- Applications demonstrate varying quality levels (strong technical approach vs generic)
- Messages show natural conversation flow with Russian IT terminology
- Seed script runs without errors and is idempotent
- Developers can immediately test application review and messaging features without manual data creation

## Non-Goals

- Creating additional gigs (5 OPEN + 5 workflow gigs is sufficient)
- Creating additional users (3 specialists + 2 clients is sufficient)
- Implementing new features (this is data-only)
- Translating existing content (keep existing English where it exists)
- Adding admin moderation logs or other entities

## Risks & Mitigations

**Risk:** Seed script becomes too slow with many records
**Mitigation:** Use batch operations where possible, limit to essential data

**Risk:** Non-idempotent operations create duplicates
**Mitigation:** Use upsert with explicit IDs for all new records

**Risk:** Unrealistic content quality
**Mitigation:** Base content on real Russian IT freelance platforms (FL.ru, Habr Freelance)
