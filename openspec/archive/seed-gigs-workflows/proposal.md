# Proposal: Seed Gigs in Various Workflow States

## Change Name
`seed-gigs-workflows`

## Problem Statement

Currently, the seed data (`prisma/seed.ts`) only creates gigs in the `OPEN` status. This makes it difficult to:

1. **Demo the full platform workflow** - Stakeholders and users cannot see how gigs progress through the complete lifecycle (OPEN → IN_PROGRESS → REVIEW → COMPLETED → PAID)
2. **Test state-specific UI and logic** - Developers cannot easily verify that UI components and business logic work correctly for gigs in different states
3. **Understand the platform value proposition** - New users cannot see examples of completed work and successful transactions
4. **Validate messaging and payment tracking** - Features like gig-scoped messaging (requires assigned specialist) and payment tracking (requires COMPLETED status) cannot be demonstrated with seed data alone

## Proposed Solution

Extend the seed script to create **realistic gigs in all lifecycle states**, demonstrating the complete platform workflow from gig creation to payment.

### Gigs to Create

**OPEN Gigs (3-4 gigs)** - Already exist as example gigs, keep them
- Backend API Development (180k ₽)
- Frontend Dashboard (150k ₽)
- DevOps CI/CD (170k ₽)
- Database Optimization (160k ₽)
- E2E Testing (190k ₽)

**IN_PROGRESS Gigs (2 gigs)** - New
1. **Mobile App UI/UX Design** (120k ₽)
   - Client: ТехКорп
   - Assigned Specialist: Алексей Иванов (Frontend/React)
   - Status: IN_PROGRESS
   - Has 2-3 applications (1 accepted, others rejected)
   - Has 1-2 messages between client and specialist

2. **Microservices Migration** (250k ₽)
   - Client: ДиджиталПро
   - Assigned Specialist: Дмитрий Волков (Backend/Python)
   - Status: IN_PROGRESS
   - Has 2 applications (1 accepted, 1 rejected)
   - Has 1-2 messages between client and specialist

**REVIEW Gig (1 gig)** - New
3. **Kubernetes Cluster Setup** (200k ₽)
   - Client: ТехКорп
   - Assigned Specialist: Сергей Морозов (DevOps/Go)
   - Status: REVIEW (work submitted, awaiting client approval)
   - Has 1 application (accepted)
   - Has 2-3 messages between client and specialist (including work submission notice)

**COMPLETED Gig (1 gig)** - New
4. **API Documentation with Swagger** (80k ₽)
   - Client: ДиджиталПро
   - Assigned Specialist: Алексей Иванов (Frontend/React)
   - Status: COMPLETED (work approved, awaiting payment)
   - Has 1 application (accepted)
   - Has 2-3 messages between client and specialist (including approval confirmation)

**PAID Gig (1 gig)** - New
5. **Redis Caching Implementation** (110k ₽)
   - Client: ТехКорп
   - Assigned Specialist: Дмитрий Волков (Backend/Python)
   - Status: PAID (complete workflow, payment marked)
   - Has 1 application (accepted)
   - `paidAt` timestamp set
   - Has 2-3 messages between client and specialist (complete conversation history)

### Content Guidelines

- **Russian language** for all titles, descriptions, and requirements
- **Realistic budgets** ranging from 80k to 250k ₽ (average ~150k)
- **Varied tech stacks** using existing tags: React, Python, TypeScript, Node.js, Go, Rust, Docker, Kubernetes, PostgreSQL
- **Structured requirements** using goal, deliverables, constraints fields
- **Realistic acceptance criteria** (50+ characters, specific and measurable)
- **Minimal messaging** for workflow gigs (1-3 messages per gig to demonstrate active communication)

## Constraints

### Technical Constraints
- MUST use existing CLIENT users (ivan.petrov@techcorp.ru, maria.sokolova@digitalpro.ru)
- MUST use existing SPECIALIST users (alexey.ivanov@mail.ru, dmitry.volkov@yandex.ru, sergey.morozov@gmail.com)
- MUST follow proper state transitions (cannot create REVIEW gig without assignedSpecialistId)
- MUST create Application records for all non-OPEN gigs
- MUST handle Application idempotency: Application model has @@unique([gigId, specialistId]) constraint, so use findFirst to check existence before creating
- MUST create Message records for workflow gigs to demonstrate active communication
- Service fee MUST be 10% of budget (as per current standard)
- Schema verification: Gig model has NO additional required fields for REVIEW/COMPLETED/PAID states beyond `paidAt` (which is nullable and only set for PAID status)

### Data Integrity Constraints
- Each IN_PROGRESS/REVIEW/COMPLETED/PAID gig MUST have exactly 1 ACCEPTED application
- Each IN_PROGRESS/REVIEW/COMPLETED/PAID gig MUST have `assignedSpecialistId` set
- PAID gig MUST have `paidAt` timestamp (e.g., 3-7 days ago)
- All gigs MUST have valid `budget`, `serviceFee`, `totalAmount` calculations
- Applications MUST respect @@unique([gigId, specialistId]) constraint - check for existing applications before creating
- Messages MUST have valid gigId, senderId, and non-empty content
- Message timestamps SHOULD be realistic (spread over time, not all at once)

### Content Constraints
- All text content in Russian
- Acceptance criteria minimum 50 characters
- Realistic gig descriptions (not placeholder text)
- Varied tags across gigs

## Non-Goals

- ❌ Creating multiple applications per specialist (one application per specialist per gig)
- ❌ Creating admin-closed gigs (not needed for workflow demo)
- ❌ Creating suspended users (not needed for workflow demo)
- ❌ Modifying existing example gigs (keep them as-is)
- ❌ Creating extensive message histories (1-3 messages per gig is sufficient for demo purposes)
- ❌ Adding state-specific fields that don't exist in schema (e.g., submissionUrl, reviewNotes, completedAt - these are NOT in the Gig model)

## Success Criteria

1. **Seed script runs without errors** - `npm run seed` completes successfully
2. **All gig states represented** - Database contains gigs in OPEN, IN_PROGRESS, REVIEW, COMPLETED, PAID states
3. **Browse gigs page shows variety** - Specialists can see gigs in different states when browsing
4. **Client dashboard shows workflow** - Clients can see their gigs progressing through different states
5. **Specialist dashboard shows applications** - Specialists can see their accepted applications and assigned gigs
6. **Data integrity maintained** - All foreign keys valid, no orphaned records, proper state transitions

## Testing Strategy

Manual testing via UI:
1. Run `npm run seed` to populate database
2. Login as CLIENT (ivan.petrov@techcorp.ru) - verify dashboard shows gigs in various states
3. Login as SPECIALIST (alexey.ivanov@mail.ru) - verify dashboard shows accepted applications
4. Browse gigs at `/dashboard/gigs` - verify all states are visible
5. View individual gig details - verify status-specific UI elements (Submit Work, Approve Work, Mark as Paid buttons)

## Implementation Notes

- Extend existing `prisma/seed.ts` file (do not create new file)
- Use `upsert` operations for idempotency (can run seed multiple times)
- Use deterministic IDs for new gigs (e.g., `workflow-gig-mobile-ui`, `workflow-gig-microservices`)
- **Application creation strategy**: Use `findFirst({ where: { gigId, specialistId } })` to check existence before creating, since Application model has @@unique([gigId, specialistId]) constraint and standard upsert requires a unique field
- **Message creation strategy**:
  - Use deterministic IDs for messages (e.g., `msg-mobile-ui-1`, `msg-mobile-ui-2`)
  - Use `upsert` with deterministic IDs to prevent duplicate messages on subsequent seed runs
  - Create 1-3 messages per workflow gig with realistic timestamps (spread over time using Date manipulation)
- **Chronological consistency**:
  - Explicitly set `createdAt` timestamps for Gigs, Applications, and Messages to maintain logical chronological order
  - For PAID gigs: Gig createdAt (~10 days ago) → Application createdAt (~9 days ago) → Messages (~8, 5, 3 days ago) → paidAt (~1 day ago)
  - For COMPLETED gigs: Similar timeline but without paidAt (most recent event is approval message ~1 day ago)
  - For REVIEW/IN_PROGRESS gigs: Adjust timeline so most recent message is ~1-2 days ago
  - Never set paidAt or message timestamps to be earlier than Gig createdAt (would look like a bug)
- Follow existing seed script patterns (console.log for each created entity)
- Message content should be brief and in Russian (e.g., "Здравствуйте, начал работу над задачей")
