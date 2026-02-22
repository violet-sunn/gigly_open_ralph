# Implementation Tasks: Seed Gigs in Various Workflow States

## Task 1: Create IN_PROGRESS gigs with applications and messages

**Implementation:**
- Add 2 new gigs to `prisma/seed.ts` with status "IN_PROGRESS"
- Gig 1: "Mobile App UI/UX Design" (120k ₽)
  - Client: client1 (ТехКорп)
  - Assigned specialist: alexey.ivanov@mail.ru
  - Tags: React, TypeScript, UI/UX, Figma
  - **Chronological timeline**: createdAt ~7 days ago
  - Create 2-3 applications: 1 ACCEPTED (from Alexey, createdAt ~6 days ago), others REJECTED
  - Create 1-2 messages with deterministic IDs (msg-mobile-ui-1, msg-mobile-ui-2)
  - Message timestamps: ~5 days ago, ~2 days ago
- Gig 2: "Microservices Migration" (250k ₽)
  - Client: client2 (ДиджиталПро)
  - Assigned specialist: dmitry.volkov@yandex.ru
  - Tags: Python, Docker, Microservices, PostgreSQL
  - **Chronological timeline**: createdAt ~8 days ago
  - Create 2 applications: 1 ACCEPTED (from Dmitry, createdAt ~7 days ago), 1 REJECTED
  - Create 1-2 messages with deterministic IDs (msg-microservices-1, msg-microservices-2)
  - Message timestamps: ~6 days ago, ~3 days ago
- Use deterministic IDs: `workflow-gig-mobile-ui`, `workflow-gig-microservices`
- Set `assignedSpecialistId` to the accepted specialist's userId
- Calculate serviceFee as Math.floor(budget * 0.10)
- Include realistic Russian descriptions with goal, deliverables, constraints, acceptanceCriteria
- **Application creation**: Use `prisma.application.findFirst({ where: { gigId, specialistId } })` to check existence before creating (@@unique constraint prevents standard upsert)
- **Message creation**: Use deterministic IDs and `prisma.message.upsert({ where: { id: 'msg-mobile-ui-1' }, ... })` to prevent duplicates
- **Chronological consistency**: Explicitly set createdAt for Gig, Applications, and Messages to maintain logical order

**Test Plan:**
```bash
# Reset and run seed
npm run db:reset
npm run seed

# Verify in Prisma Studio
npx prisma studio
# Check: 2 gigs with status "IN_PROGRESS"
# Check: Each has assignedSpecialistId set
# Check: Each has 1 ACCEPTED application and rejected applications

# Verify in UI
# Login as ivan.petrov@techcorp.ru
# Navigate to /dashboard
# Expected: See "Mobile App UI/UX Design" in IN_PROGRESS state

# Login as alexey.ivanov@mail.ru
# Navigate to /dashboard
# Expected: See accepted application for "Mobile App UI/UX Design"
```

---

## Task 2: Create REVIEW gig with application and messages

**Implementation:**
- Add 1 new gig to `prisma/seed.ts` with status "REVIEW"
- Gig: "Kubernetes Cluster Setup" (200k ₽)
  - Client: client1 (ТехКорп)
  - Assigned specialist: sergey.morozov@gmail.com
  - Tags: Kubernetes, Docker, DevOps, CI/CD
  - **Chronological timeline**: createdAt ~9 days ago
  - Create 1 ACCEPTED application (from Sergey, createdAt ~8 days ago)
  - Create 2-3 messages with deterministic IDs (msg-k8s-1, msg-k8s-2, msg-k8s-3)
  - Message timestamps: ~7 days ago, ~4 days ago, ~2 days ago (last message: work submission)
- Use deterministic ID: `workflow-gig-k8s-setup`
- Set `assignedSpecialistId` to Sergey's userId
- Include realistic Russian description
- **Application creation**: Check existence with findFirst before creating
- **Message creation**: Use deterministic IDs and upsert to prevent duplicates
- **Message content**: Include messages like "Работа завершена, отправил на проверку" (Work completed, submitted for review)
- **Chronological consistency**: Gig created → Application created → Messages sent in logical order

**Test Plan:**
```bash
# After running seed
npx prisma studio
# Check: 1 gig with status "REVIEW"
# Check: Has assignedSpecialistId set to Sergey's userId
# Check: Has 1 ACCEPTED application

# Verify in UI
# Login as ivan.petrov@techcorp.ru
# Navigate to /dashboard/gigs/workflow-gig-k8s-setup
# Expected: See "Approve Work" button (CLIENT can approve)

# Login as sergey.morozov@gmail.com
# Navigate to /dashboard/gigs/workflow-gig-k8s-setup
# Expected: See status "REVIEW", no "Submit Work" button (already submitted)
```

---

## Task 3: Create COMPLETED gig with application and messages

**Implementation:**
- Add 1 new gig to `prisma/seed.ts` with status "COMPLETED"
- Gig: "API Documentation with Swagger" (80k ₽)
  - Client: client2 (ДиджиталПро)
  - Assigned specialist: alexey.ivanov@mail.ru
  - Tags: REST API, Swagger, Documentation, OpenAPI
  - **Chronological timeline**: createdAt ~10 days ago
  - Create 1 ACCEPTED application (from Alexey, createdAt ~9 days ago)
  - Create 2-3 messages with deterministic IDs (msg-api-docs-1, msg-api-docs-2, msg-api-docs-3)
  - Message timestamps: ~8 days ago, ~5 days ago, ~1 day ago (last message: approval confirmation)
- Use deterministic ID: `workflow-gig-api-docs`
- Set `assignedSpecialistId` to Alexey's userId
- Include realistic Russian description
- **Application creation**: Check existence with findFirst before creating
- **Message creation**: Use deterministic IDs and upsert to prevent duplicates
- **Message content**: Include messages like "Отлично, работа принята!" (Excellent, work approved!)
- **Chronological consistency**: Most recent event is approval message (~1 day ago), no paidAt yet

**Test Plan:**
```bash
# After running seed
npx prisma studio
# Check: 1 gig with status "COMPLETED"
# Check: Has assignedSpecialistId set to Alexey's userId
# Check: paidAt is NULL (not yet paid)

# Verify in UI
# Login as maria.sokolova@digitalpro.ru
# Navigate to /dashboard/gigs/workflow-gig-api-docs
# Expected: See "Mark as Paid" button (CLIENT can mark as paid)

# Login as alexey.ivanov@mail.ru
# Navigate to /dashboard/gigs/workflow-gig-api-docs
# Expected: See status "COMPLETED", awaiting payment
```

---

## Task 4: Create PAID gig with application, messages, and paidAt timestamp

**Implementation:**
- Add 1 new gig to `prisma/seed.ts` with status "PAID"
- Gig: "Redis Caching Implementation" (110k ₽)
  - Client: client1 (ТехКорп)
  - Assigned specialist: dmitry.volkov@yandex.ru
  - Tags: Redis, Node.js, Caching, Performance
  - **Chronological timeline**:
    - Gig createdAt: ~12 days ago
    - Application createdAt: ~11 days ago
    - Messages: ~10 days ago, ~7 days ago, ~4 days ago
    - paidAt: ~2 days ago (MUST be after all messages)
  - Create 1 ACCEPTED application (from Dmitry)
  - Create 2-3 messages with deterministic IDs (msg-redis-1, msg-redis-2, msg-redis-3)
  - Messages show complete conversation history (start, progress, completion, payment confirmation)
- Use deterministic ID: `workflow-gig-redis-caching`
- Set `assignedSpecialistId` to Dmitry's userId
- Set `paidAt` to new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) for 2 days ago
- Include realistic Russian description
- **Application creation**: Check existence with findFirst before creating
- **Message creation**: Use deterministic IDs and upsert to prevent duplicates
- **Message content**: Include messages showing complete workflow (start, progress, completion, payment confirmation)
- **CRITICAL - Chronological consistency**: Gig createdAt (~12 days ago) MUST be earlier than paidAt (~2 days ago). All timestamps must maintain logical order: Gig → Application → Messages → paidAt

**Test Plan:**
```bash
# After running seed
npx prisma studio
# Check: 1 gig with status "PAID"
# Check: Has assignedSpecialistId set to Dmitry's userId
# Check: paidAt is set to a valid timestamp

# Verify in UI
# Login as ivan.petrov@techcorp.ru
# Navigate to /dashboard/gigs/workflow-gig-redis-caching
# Expected: See status "PAID" with payment date displayed
# Expected: No action buttons (workflow complete)

# Login as dmitry.volkov@yandex.ru
# Navigate to /dashboard/gigs/workflow-gig-redis-caching
# Expected: See status "PAID", gig marked as complete
```

---

## Task 5: Add console logging and summary

**Implementation:**
- Add console.log statements for each created workflow gig
- Update the seed summary section to mention workflow gigs
- Format: "Created/updated workflow gig: [Gig Title] ([Status])"

**Test Plan:**
```bash
# Run seed and check console output
npm run seed

# Expected output includes:
# Created/updated workflow gig: Mobile App UI/UX Design (IN_PROGRESS)
# Created/updated workflow gig: Microservices Migration (IN_PROGRESS)
# Created/updated workflow gig: Kubernetes Cluster Setup (REVIEW)
# Created/updated workflow gig: API Documentation with Swagger (COMPLETED)
# Created/updated workflow gig: Redis Caching Implementation (PAID)
```

---

## Task 6: End-to-end verification

**Implementation:**
- Run complete seed script
- Verify all gig states are represented
- Verify data integrity (foreign keys, calculations)

**Test Plan:**
```bash
# Full reset and seed
npm run db:reset
npm run seed

# Count gigs by status in Prisma Studio
# Expected:
# - OPEN: 5 gigs (existing example gigs)
# - IN_PROGRESS: 2 gigs
# - REVIEW: 1 gig
# - COMPLETED: 1 gig
# - PAID: 1 gig
# Total: 10 gigs

# Verify in UI - Browse gigs page
# Login as dmitry.volkov@yandex.ru
# Navigate to /dashboard/gigs
# Expected: See mix of OPEN gigs (can apply) and other states (cannot apply)

# Verify in UI - Client dashboard
# Login as ivan.petrov@techcorp.ru
# Navigate to /dashboard
# Expected: See gigs in multiple states (OPEN, IN_PROGRESS, REVIEW, PAID)

# Verify in UI - Specialist dashboard
# Login as alexey.ivanov@mail.ru
# Navigate to /dashboard
# Expected: See accepted applications for IN_PROGRESS and COMPLETED gigs

# Verify calculations
# For each new gig, verify:
# serviceFee = Math.floor(budget * 0.10)
# totalAmount = budget + serviceFee
```

---

## Summary

Total tasks: 6
Estimated time: 2-3 hours

**Dependencies:**
- Tasks 1-4 can be implemented in parallel (independent gigs)
- Task 5 should be done after tasks 1-4
- Task 6 is final verification

**Files modified:**
- `prisma/seed.ts` (extend with new gigs and applications)

**No new files created** - this change only extends existing seed data.
