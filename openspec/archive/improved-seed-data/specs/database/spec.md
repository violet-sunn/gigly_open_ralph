# Database Specification Delta: Improved Seed Data

## ADDED Requirements

### Requirement: Comprehensive Seed Data for Realistic Demo Environment
The seed script MUST generate a realistic dataset that demonstrates an active marketplace with diverse users, gigs, applications, and messages.

#### Scenario: Seed script generates expanded user base
- GIVEN the seed script is executed
- WHEN user creation completes
- THEN the database MUST contain:
  - 5-7 CLIENT users with realistic Russian company names
  - 20-30 SPECIALIST users with diverse tech stacks
  - 1 ADMIN user
- AND all CLIENT users MUST have complete ClientProfile records with companyName, inn, kpp
- AND all SPECIALIST users MUST have complete SpecialistProfile records with displayName, techStack, experienceLevel, bio
- AND tech stacks MUST cover diverse technologies: React, Vue, Angular, Python, Go, Rust, Java, Kotlin, Swift, DevOps, QA, Data Engineering, Mobile
- AND experience levels MUST be distributed between MIDDLE and SENIOR
- AND all names MUST be realistic Russian names (e.g., "Алексей Иванов", "Мария Петрова")

#### Scenario: Seed script generates diverse gig portfolio
- GIVEN the seed script is executed
- WHEN gig creation completes
- THEN the database MUST contain 30-50 gigs (excluding example gigs)
- AND gigs MUST be distributed across statuses:
  - OPEN: 15-20 gigs (50-60% of total)
  - IN_PROGRESS: 8-12 gigs (25-30% of total)
  - REVIEW: 4-6 gigs (10-15% of total)
  - COMPLETED: 3-5 gigs (8-10% of total)
  - PAID: 5-8 gigs (12-18% of total)
- AND all gigs MUST have realistic Russian titles and descriptions
- AND budgets MUST be in the range 5,000,000 - 30,000,000 kopecks (50,000 - 300,000 RUB)
- AND service fees MUST be calculated as 10% of budget
- AND tags MUST reflect diverse tech stacks
- AND gigs MUST be distributed across multiple clients (not all from one client)
- AND existing example gigs (isExample: true) MUST remain unchanged

#### Scenario: Seed script generates realistic application activity
- GIVEN the seed script is executed
- WHEN application creation completes
- THEN each OPEN gig MUST have 3-5 PENDING applications
- AND each IN_PROGRESS gig MUST have 1 ACCEPTED application and 2-4 REJECTED applications
- AND each REVIEW gig MUST have 1 ACCEPTED application and 2-4 REJECTED applications
- AND each COMPLETED gig MUST have 1 ACCEPTED application and 2-4 REJECTED applications
- AND each PAID gig MUST have 1 ACCEPTED application and 2-4 REJECTED applications
- AND all applications MUST use structured fields (approach, questions, estimatedEffort)
- AND approach field MUST contain realistic technical methodology (100-500 characters)
- AND questions field MUST contain realistic clarifying questions (50-200 characters)
- AND estimatedEffort field MUST contain realistic time estimates (e.g., "2-3 недели", "80-120 часов")
- AND applications MUST be from different specialists (no specialist applies to all gigs)

#### Scenario: Seed script generates message threads for active gigs
- GIVEN the seed script is executed
- WHEN message creation completes
- THEN each IN_PROGRESS gig MUST have 2-5 messages
- AND each REVIEW gig MUST have 3-5 messages
- AND each COMPLETED gig MUST have 2-4 messages
- AND each PAID gig MUST have 2-3 messages
- AND messages MUST alternate between client and assigned specialist
- AND message content MUST be realistic Russian conversation (project updates, questions, feedback)
- AND messages MUST have realistic timestamps (spread over the gig's lifetime)
- AND OPEN gigs MUST NOT have messages (no assigned specialist yet)

#### Scenario: Seed script maintains idempotency
- GIVEN the seed script has been run once
- WHEN the seed script is run again
- THEN no duplicate users MUST be created (upsert by email)
- AND no duplicate gigs MUST be created (upsert by id)
- AND no duplicate applications MUST be created (upsert by gigId_specialistId)
- AND no duplicate messages MUST be created (upsert by id)
- AND existing data MUST be updated, not duplicated

#### Scenario: Seed script completes within performance threshold
- GIVEN the seed script is executed
- WHEN all data generation completes
- THEN the total execution time MUST be less than 60 seconds
- AND the script MUST log progress for each major phase (users, gigs, applications, messages)
- AND the script MUST log a summary of created records at the end

#### Scenario: Gig lifecycle timestamps are realistic
- GIVEN a gig with status IN_PROGRESS
- WHEN the gig record is examined
- THEN createdAt MUST be 3-10 days in the past
- AND the accepted application createdAt MUST be 1-2 days after gig createdAt
- GIVEN a gig with status REVIEW
- THEN createdAt MUST be 5-12 days in the past
- GIVEN a gig with status COMPLETED
- THEN createdAt MUST be 7-15 days in the past
- GIVEN a gig with status PAID
- THEN createdAt MUST be 10-20 days in the past
- AND paidAt MUST be 1-3 days after createdAt

#### Scenario: Budget distribution is realistic
- GIVEN all generated gigs
- WHEN budget values are analyzed
- THEN the average budget MUST be approximately 150,000 - 200,000 RUB
- AND budgets MUST be distributed across the range (not all the same value)
- AND at least 20% of gigs MUST have budgets < 100,000 RUB
- AND at least 20% of gigs MUST have budgets > 200,000 RUB
- AND all budgets MUST be multiples of 10,000 RUB (for realism)

**Acceptance Criteria:**
- Seed script generates 30-50 gigs across all statuses
- Seed script generates 20-30 specialist profiles with diverse tech stacks
- Each OPEN gig has 3-5 applications
- Active gigs (IN_PROGRESS, REVIEW, COMPLETED, PAID) have message threads
- All data uses realistic Russian names, company names, and descriptions
- Budgets are in the 50k-300k RUB range with realistic distribution
- Seed script completes in under 60 seconds
- Running seed multiple times does not create duplicates
- Existing example gigs remain unchanged
- Console output shows progress and summary statistics
