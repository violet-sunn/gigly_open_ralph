# Change Proposal: Improved Seed Data

## Problem Statement

The current seed script creates only 10 gigs and 6 users (2 clients, 3 specialists, 1 admin), which makes the platform look unrealistic during demos and testing. With such limited data:

- The platform appears inactive and unconvincing
- It's difficult to demonstrate filtering, search, and pagination features effectively
- The gig browse page looks sparse and doesn't showcase platform activity
- Admin dashboard statistics are not meaningful with such small numbers
- It's hard to demonstrate the full lifecycle of gigs across different statuses
- Testing edge cases (e.g., specialists with many applications, clients with many gigs) is not possible

This undermines the credibility of demos and makes it harder to validate that the platform can handle realistic data volumes.

## Proposed Solution

Expand the seed script to generate **30-50 gigs** across all lifecycle stages and **20-30 specialist profiles** with diverse backgrounds, creating a realistic and active marketplace environment.

### Key Changes

1. **Expanded User Base**
   - 5-7 client companies with realistic Russian company names
   - 20-30 specialist profiles with diverse tech stacks (frontend, backend, DevOps, QA, mobile, data engineering)
   - Varied experience levels (MIDDLE and SENIOR)
   - Realistic Russian names and professional bios

2. **Diverse Gig Portfolio**
   - 30-50 gigs distributed across all statuses:
     - OPEN: 15-20 gigs (active marketplace)
     - IN_PROGRESS: 8-12 gigs (ongoing work)
     - REVIEW: 4-6 gigs (pending approval)
     - COMPLETED: 3-5 gigs (recently finished)
     - PAID: 5-8 gigs (completed transactions)
   - Realistic budgets: 50,000 - 300,000 RUB (50k-300k range)
   - Varied tech stacks: React, Vue, Angular, Python, Go, Rust, Java, Kotlin, Swift, DevOps, QA, etc.
   - Realistic Russian gig titles and descriptions

3. **Active Application Activity**
   - 3-5 applications per OPEN gig
   - Accepted applications for IN_PROGRESS/REVIEW/COMPLETED/PAID gigs
   - Rejected applications showing selection process
   - Realistic technical approaches and clarifying questions

4. **Message Threads**
   - 2-5 messages per active gig (IN_PROGRESS, REVIEW, COMPLETED)
   - Realistic conversation flow between clients and specialists
   - Questions, updates, feedback, and approvals

5. **Lifecycle Representation**
   - Show gigs at different stages of completion
   - Demonstrate progression from OPEN → PAID
   - Include recent timestamps to show active platform

## Constraints

- **Backward Compatibility**: Existing example gigs (with `isExample: true`) MUST remain unchanged for documentation purposes
- **Performance**: Seed script MUST complete in under 60 seconds
- **Idempotency**: Running seed multiple times MUST NOT create duplicates (use upsert operations)
- **Data Quality**: All generated data MUST be realistic and professional (no lorem ipsum or placeholder text)
- **Russian Context**: Company names, specialist names, and gig descriptions MUST reflect Russian IT market
- **Budget Realism**: Budgets MUST be in the 50k-300k RUB range (realistic for Middle+/Senior specialists)

## Non-Goals

- Real payment integration (still logical status tracking)
- Automated data generation from external APIs
- User authentication for seed users beyond existing TestPass123
- Notification records (can be generated on-demand by user actions)
- Admin moderation logs (not needed for seed data)

## Success Criteria

1. Seed script generates 30-50 gigs across all statuses
2. Seed script generates 20-30 specialist profiles with diverse tech stacks
3. Each OPEN gig has 3-5 applications
4. Active gigs (IN_PROGRESS, REVIEW, COMPLETED) have 2-5 message threads
5. All data uses realistic Russian names, company names, and descriptions
6. Budgets are in the 50k-300k RUB range
7. Seed script completes in under 60 seconds
8. Running `npm run seed` multiple times does not create duplicates
9. Platform appears active and credible during demos
10. Filtering, search, and pagination features can be effectively demonstrated

## Implementation Approach

The implementation will follow a modular approach:

1. **Phase 1**: Expand user base (clients and specialists)
2. **Phase 2**: Generate diverse gigs across all statuses
3. **Phase 3**: Create applications for gigs
4. **Phase 4**: Add message threads to active gigs
5. **Phase 5**: Verify data quality and performance

Each phase will use upsert operations to ensure idempotency and maintain existing example gigs.
