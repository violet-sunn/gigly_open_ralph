# Implementation Tasks: Improved Seed Data

## Task 1: Create Data Generation Helpers

**Description:** Create helper functions for generating realistic Russian names, company names, tech stacks, and gig content.

**Implementation Notes:**
- Create a new section in `prisma/seed.ts` with helper functions
- `generateRussianName()`: Returns realistic Russian first name + last name combinations
- `generateCompanyName()`: Returns realistic Russian IT company names (e.g., "ТехСтарт", "ДиджиталЛаб", "КодФабрика")
- `generateTechStack()`: Returns diverse tech stack combinations for different specializations (frontend, backend, DevOps, mobile, QA, data)
- `generateGigTitle()`: Returns realistic Russian gig titles based on tech stack
- `generateGigDescription()`: Returns realistic Russian gig descriptions (200-400 words)
- `generateApplicationApproach()`: Returns realistic technical approach text (100-500 chars)
- `generateApplicationQuestions()`: Returns realistic clarifying questions (50-200 chars)
- `generateMessageContent()`: Returns realistic message content for different conversation stages
- Use arrays of predefined realistic content and combine them randomly
- Ensure all text is in Russian and professional

**Test Plan:**
1. Run seed script and verify console output shows realistic Russian names
2. Check Prisma Studio to verify:
   - User names are realistic Russian names
   - Company names are realistic Russian IT companies
   - Tech stacks are diverse and realistic
   - Gig titles and descriptions are professional and in Russian
3. Verify no placeholder text (lorem ipsum, "test", etc.) appears in any generated data
4. Verify tech stacks cover at least 10 different technologies

---

## Task 2: Expand Client User Base

**Description:** Generate 5-7 CLIENT users with complete profiles and realistic Russian company data.

**Implementation Notes:**
- Create 5-7 CLIENT users using `prisma.user.upsert()`
- Use unique email addresses (e.g., `contact@{companyname}.ru`)
- Each user MUST have a nested `clientProfile.create` with:
  - `companyName`: Generated from `generateCompanyName()`
  - `inn`: Realistic 10-digit INN (use pattern: `77XXXXXXXX`)
  - `kpp`: Realistic 9-digit KPP (use pattern: `770101001`)
  - `contactPerson`: Generated from `generateRussianName()`
  - `phoneNumber`: Realistic Russian phone (use pattern: `+7 (495) XXX-XX-XX`)
- Keep existing client1 and client2 for backward compatibility
- Add 3-5 new clients with diverse company names

**Test Plan:**
1. Run `npm run seed`
2. Verify seed completes without errors
3. Check Prisma Studio:
   - Count CLIENT users: should be 5-7
   - Verify each CLIENT has a complete clientProfile
   - Verify company names are realistic and diverse
   - Verify INN/KPP follow correct format
   - Verify phone numbers follow Russian format
4. Run seed again and verify no duplicates are created (idempotency)

---

## Task 3: Expand Specialist User Base

**Description:** Generate 20-30 SPECIALIST users with diverse tech stacks and experience levels.

**Implementation Notes:**
- Create 20-30 SPECIALIST users using `prisma.user.upsert()`
- Use unique email addresses (e.g., `{firstname}.{lastname}@mail.ru`)
- Each user MUST have a nested `specialistProfile.create` with:
  - `displayName`: Generated from `generateRussianName()`
  - `techStack`: Generated from `generateTechStack()` - ensure diversity
  - `experienceLevel`: Randomly choose between "MIDDLE" (40%) and "SENIOR" (60%)
  - `bio`: Realistic Russian bio (50-150 chars) describing experience
- Keep existing alexey, dmitry, sergey for backward compatibility
- Distribute tech stacks across categories:
  - Frontend: React, Vue, Angular, Svelte (6-8 specialists)
  - Backend: Python, Go, Rust, Java, Kotlin, PHP (8-10 specialists)
  - DevOps: Docker, Kubernetes, CI/CD, AWS, GCP (3-4 specialists)
  - Mobile: iOS/Swift, Android/Kotlin, React Native, Flutter (2-3 specialists)
  - QA: Playwright, Selenium, Cypress, Jest (2-3 specialists)
  - Data: PostgreSQL, MongoDB, Redis, Elasticsearch (2-3 specialists)

**Test Plan:**
1. Run `npm run seed`
2. Verify seed completes without errors
3. Check Prisma Studio:
   - Count SPECIALIST users: should be 20-30
   - Verify each SPECIALIST has a complete specialistProfile
   - Verify tech stacks are diverse (at least 10 different primary technologies)
   - Verify experience level distribution: ~40% MIDDLE, ~60% SENIOR
   - Verify bios are realistic and in Russian
4. Verify at least 2 specialists for each major category (frontend, backend, DevOps, mobile, QA, data)
5. Run seed again and verify no duplicates are created

---

## Task 4: Generate OPEN Gigs

**Description:** Generate 15-20 OPEN gigs distributed across multiple clients with realistic budgets and descriptions.

**Implementation Notes:**
- Create 15-20 gigs with `status: 'OPEN'` using `prisma.gig.upsert()`
- Use unique IDs (e.g., `seed-open-gig-1`, `seed-open-gig-2`, etc.)
- Distribute gigs across all clients (not all from one client)
- For each gig:
  - `title`: Generated from `generateGigTitle()`
  - `description`: Generated from `generateGigDescription()`
  - `acceptanceCriteria`: Realistic acceptance criteria (100-300 chars)
  - `goal`, `deliverables`, `constraints`: Realistic structured requirements
  - `budget`: Random value between 5,000,000 - 30,000,000 kopecks (50k-300k RUB), multiples of 1,000,000 (10k RUB)
  - `serviceFee`: Math.floor(budget * 0.10)
  - `totalAmount`: budget + serviceFee
  - `tags`: Comma-separated tech stack tags matching gig content
  - `clientId`: Randomly assigned from available clients
  - `createdAt`: Random date 1-7 days in the past
- Ensure budget distribution: 20% < 100k, 60% 100k-200k, 20% > 200k

**Test Plan:**
1. Run `npm run seed`
2. Verify seed completes without errors
3. Check Prisma Studio:
   - Count OPEN gigs: should be 15-20 (excluding example gigs)
   - Verify all gigs have realistic Russian titles and descriptions
   - Verify budgets are in range 50k-300k RUB
   - Verify service fees are exactly 10% of budget
   - Verify gigs are distributed across multiple clients
   - Verify tags match gig content
4. Check gig browse page at `/dashboard/gigs`:
   - Verify gigs display correctly
   - Verify filtering by tags works
   - Verify budget range filtering works
5. Verify existing example gigs are unchanged (isExample: true)

---

## Task 5: Generate IN_PROGRESS Gigs

**Description:** Generate 8-12 IN_PROGRESS gigs with assigned specialists and realistic timestamps.

**Implementation Notes:**
- Create 8-12 gigs with `status: 'IN_PROGRESS'` using `prisma.gig.upsert()`
- Use unique IDs (e.g., `seed-inprogress-gig-1`, etc.)
- For each gig:
  - Set `assignedSpecialistId` to a randomly selected specialist
  - Set `createdAt` to 3-10 days in the past
  - Generate title, description, budget similar to Task 4
- Ensure each specialist is assigned to at most 2-3 gigs (realistic workload)
- Distribute across multiple clients

**Test Plan:**
1. Run `npm run seed`
2. Check Prisma Studio:
   - Count IN_PROGRESS gigs: should be 8-12
   - Verify each gig has an assignedSpecialistId
   - Verify createdAt timestamps are 3-10 days old
   - Verify no specialist is assigned to more than 3 gigs
3. Check client dashboard:
   - Verify IN_PROGRESS gigs show assigned specialist name
4. Check specialist dashboard:
   - Verify specialists see their assigned gigs

---

## Task 6: Generate REVIEW, COMPLETED, and PAID Gigs

**Description:** Generate gigs in later lifecycle stages with appropriate timestamps.

**Implementation Notes:**
- Create 4-6 REVIEW gigs (createdAt: 5-12 days ago)
- Create 3-5 COMPLETED gigs (createdAt: 7-15 days ago)
- Create 5-8 PAID gigs (createdAt: 10-20 days ago, paidAt: 1-3 days after createdAt)
- All gigs MUST have `assignedSpecialistId`
- Use realistic timestamps that show progression through lifecycle
- Distribute across multiple clients and specialists

**Test Plan:**
1. Run `npm run seed`
2. Check Prisma Studio:
   - Count REVIEW gigs: 4-6
   - Count COMPLETED gigs: 3-5
   - Count PAID gigs: 5-8
   - Verify all have assignedSpecialistId
   - Verify timestamps are realistic and progressive
   - Verify PAID gigs have paidAt timestamp
3. Check client dashboard:
   - Verify gigs show correct status badges
   - Verify PAID gigs show payment date
4. Verify total gig count is 30-50 (excluding example gigs)

---

## Task 7: Generate Applications for OPEN Gigs

**Description:** Create 3-5 PENDING applications for each OPEN gig with realistic structured content.

**Implementation Notes:**
- For each OPEN gig, create 3-5 applications using `prisma.application.upsert()`
- Use `gigId_specialistId` unique constraint for upsert
- For each application:
  - `specialistId`: Randomly selected specialist (ensure tech stack matches gig tags)
  - `approach`: Generated from `generateApplicationApproach()` (100-500 chars)
  - `questions`: Generated from `generateApplicationQuestions()` (50-200 chars)
  - `estimatedEffort`: Realistic estimate (e.g., "2-3 недели", "80-120 часов")
  - `status`: "PENDING"
  - `coverLetter`: "" (empty, not used in new applications)
  - `createdAt`: Random timestamp between gig.createdAt and now
- Ensure no specialist applies to more than 5 gigs (realistic behavior)
- Match specialist tech stack to gig requirements where possible

**Test Plan:**
1. Run `npm run seed`
2. Check Prisma Studio:
   - Verify each OPEN gig has 3-5 applications
   - Verify all applications have status "PENDING"
   - Verify approach and questions fields are filled with realistic content
   - Verify coverLetter is empty string
3. Check gig detail page for OPEN gigs:
   - Verify applications display with structured fields
   - Verify technical approach is prominent
   - Verify clarifying questions are visible
4. Verify no specialist has more than 5 applications total

---

## Task 8: Generate Applications for Non-OPEN Gigs

**Description:** Create 1 ACCEPTED and 2-4 REJECTED applications for each IN_PROGRESS, REVIEW, COMPLETED, and PAID gig.

**Implementation Notes:**
- For each non-OPEN gig:
  - Create 1 ACCEPTED application where `specialistId` matches `gig.assignedSpecialistId`
  - Create 2-4 REJECTED applications from other specialists
  - ACCEPTED application `createdAt` should be 1-2 days after gig.createdAt
  - REJECTED applications `createdAt` should be similar to ACCEPTED (same timeframe)
- Use realistic structured content (approach, questions, estimatedEffort)
- Ensure applications show realistic selection process

**Test Plan:**
1. Run `npm run seed`
2. Check Prisma Studio:
   - Verify each IN_PROGRESS/REVIEW/COMPLETED/PAID gig has 3-5 total applications
   - Verify exactly 1 ACCEPTED application per gig
   - Verify ACCEPTED application specialist matches gig.assignedSpecialistId
   - Verify 2-4 REJECTED applications per gig
3. Check gig detail page:
   - Verify ACCEPTED application shows green badge
   - Verify REJECTED applications show gray badge
4. Check specialist dashboard:
   - Verify specialists see their ACCEPTED applications in "Active" tab
   - Verify specialists see their REJECTED applications in "Archive" tab

---

## Task 9: Generate Message Threads for Active Gigs

**Description:** Create 2-5 messages for each IN_PROGRESS, REVIEW, COMPLETED, and PAID gig showing realistic conversation flow.

**Implementation Notes:**
- For each IN_PROGRESS gig: create 2-5 messages
- For each REVIEW gig: create 3-5 messages
- For each COMPLETED gig: create 2-4 messages
- For each PAID gig: create 2-3 messages
- Use `prisma.message.upsert()` with unique IDs
- Messages MUST alternate between client (gig.clientId) and specialist (gig.assignedSpecialistId)
- Message content generated from `generateMessageContent()` based on gig status:
  - IN_PROGRESS: project updates, questions, clarifications
  - REVIEW: work submission, review requests
  - COMPLETED: approval confirmation, final feedback
  - PAID: payment confirmation, thank you messages
- Timestamps MUST be sequential and realistic (spread over gig lifetime)
- First message should be 1-2 days after application accepted
- Last message should be recent (within last 1-3 days for IN_PROGRESS/REVIEW)

**Test Plan:**
1. Run `npm run seed`
2. Check Prisma Studio:
   - Verify IN_PROGRESS gigs have 2-5 messages
   - Verify REVIEW gigs have 3-5 messages
   - Verify COMPLETED gigs have 2-4 messages
   - Verify PAID gigs have 2-3 messages
   - Verify messages alternate between client and specialist
   - Verify timestamps are sequential and realistic
3. Check gig detail page:
   - Verify messages display correctly
   - Verify client messages are left-aligned (blue)
   - Verify specialist messages are right-aligned (green)
   - Verify message content is realistic and in Russian
4. Verify OPEN gigs have NO messages (no assigned specialist)

---

## Task 10: Add Progress Logging and Summary

**Description:** Add console logging to show progress during seed execution and summary statistics at the end.

**Implementation Notes:**
- Add console.log statements at the start of each major phase:
  - "Creating CLIENT users..."
  - "Creating SPECIALIST users..."
  - "Creating OPEN gigs..."
  - "Creating IN_PROGRESS gigs..."
  - etc.
- Add progress indicators (e.g., "Created 5/7 clients...")
- At the end, log summary statistics:
  - Total users by role (CLIENT, SPECIALIST, ADMIN)
  - Total gigs by status (OPEN, IN_PROGRESS, REVIEW, COMPLETED, PAID)
  - Total applications by status (PENDING, ACCEPTED, REJECTED)
  - Total messages
  - Execution time
- Use clear formatting with separators and emojis for readability

**Test Plan:**
1. Run `npm run seed`
2. Verify console output shows:
   - Progress messages for each phase
   - Clear section separators
   - Summary statistics at the end
   - Execution time
3. Verify summary numbers match Prisma Studio counts
4. Verify execution time is under 60 seconds

---

## Task 11: Verify Data Quality and Idempotency

**Description:** Test that seed data is realistic, complete, and running seed multiple times doesn't create duplicates.

**Implementation Notes:**
- Review all generated data in Prisma Studio
- Verify no placeholder text or unrealistic data
- Test running seed script multiple times
- Verify upsert operations prevent duplicates
- Check that existing example gigs are unchanged

**Test Plan:**
1. Run `npm run seed` first time:
   - Note total counts for users, gigs, applications, messages
2. Run `npm run seed` second time:
   - Verify counts are identical (no duplicates)
   - Verify existing data is updated, not duplicated
3. Check Prisma Studio:
   - Verify all user emails are unique
   - Verify all gig IDs are unique
   - Verify all application (gigId, specialistId) pairs are unique
   - Verify all message IDs are unique
4. Verify example gigs (isExample: true) are unchanged:
   - Check titles, descriptions, budgets match original
5. Manual review of data quality:
   - All text is in Russian and professional
   - No lorem ipsum or placeholder text
   - Tech stacks are realistic and diverse
   - Budgets are in realistic range
   - Timestamps are logical and progressive

---

## Task 12: Test Platform Features with New Data

**Description:** Verify that all platform features work correctly with the expanded seed data.

**Implementation Notes:**
- Test all major user flows with new seed data
- Verify filtering, search, and pagination work correctly
- Verify dashboards display correctly with realistic data
- Test edge cases (e.g., specialists with many applications)

**Test Plan:**
1. **Gig Browse Page** (`/dashboard/gigs`):
   - Verify 15-20 OPEN gigs display
   - Test text search (should find relevant gigs)
   - Test tag filtering (should filter correctly)
   - Test budget range filtering (should filter correctly)
   - Test sorting (newest, highest budget, lowest budget)
   - Test pagination (should show 25 gigs per page)
2. **Client Dashboard**:
   - Login as a client with multiple gigs
   - Verify "My Gigs" shows all gigs across different statuses
   - Verify application counts are correct
   - Click into gig detail and verify applications display
3. **Specialist Dashboard**:
   - Login as a specialist with multiple applications
   - Verify "My Applications" shows all applications
   - Verify "Active" tab shows PENDING and ACCEPTED applications
   - Verify "Archive" tab shows REJECTED and WITHDRAWN applications
4. **Admin Dashboard** (`/admin`):
   - Verify statistics show correct counts
   - Verify user management page shows all users
   - Verify gig management page shows all gigs
   - Test pagination on both pages
5. **Messaging**:
   - Open an IN_PROGRESS gig
   - Verify message thread displays correctly
   - Verify messages alternate between client and specialist
6. **Performance**:
   - Verify all pages load in under 2 seconds
   - Verify no performance degradation with 30-50 gigs

---

## Summary

Total tasks: 12

**Estimated effort:** 4-6 hours

**Dependencies:**
- Task 1 must be completed before all other tasks (provides helper functions)
- Tasks 2-3 (users) must be completed before Tasks 4-6 (gigs)
- Tasks 4-6 (gigs) must be completed before Tasks 7-8 (applications)
- Tasks 7-8 (applications) must be completed before Task 9 (messages)
- Tasks 10-12 (logging, verification, testing) can be done in parallel after core data generation

**Risk areas:**
- Performance: Generating 30-50 gigs with applications and messages may take time
- Data quality: Ensuring all generated text is realistic and professional
- Idempotency: Ensuring upsert operations work correctly for all entities
