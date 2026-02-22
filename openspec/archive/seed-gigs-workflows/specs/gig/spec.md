# Gig Specification Delta: Seed Gigs in Workflow States

## ADDED Requirements

### Requirement: Demonstrate Complete Gig Lifecycle in Seed Data
The seed script MUST create gigs that demonstrate all stages of the gig lifecycle from creation to payment, including realistic communication between parties.

#### Scenario: All lifecycle states represented
- GIVEN the seed script has been executed
- WHEN browsing gigs or viewing dashboards
- THEN users MUST be able to see examples of gigs in each state:
  - OPEN (accepting applications)
  - IN_PROGRESS (specialist assigned, work in progress, active communication)
  - REVIEW (work submitted, awaiting approval, submission messages)
  - COMPLETED (work approved, awaiting payment, approval messages)
  - PAID (complete workflow, payment marked, full conversation history)

#### Scenario: OPEN gigs accept applications
- GIVEN seeded OPEN gigs exist
- WHEN a SPECIALIST views these gigs
- THEN they MUST be able to apply (no assigned specialist)
- AND the gigs MUST show "Apply" functionality

#### Scenario: IN_PROGRESS gigs show active work and communication
- GIVEN seeded IN_PROGRESS gigs exist
- WHEN the assigned SPECIALIST views these gigs
- THEN they MUST see "Submit Work" button
- AND they MUST see 1-2 messages in the gig chat
- AND when the CLIENT owner views these gigs
- THEN they MUST see the assigned specialist information
- AND messaging MUST be available (specialist is assigned)
- AND they MUST see 1-2 messages demonstrating active communication

#### Scenario: REVIEW gigs show pending approval with submission messages
- GIVEN seeded REVIEW gigs exist
- WHEN the CLIENT owner views these gigs
- THEN they MUST see "Approve Work" button
- AND they MUST see 2-3 messages including work submission notice
- AND when the assigned SPECIALIST views these gigs
- THEN they MUST NOT see "Submit Work" button (already submitted)
- AND they MUST see the conversation history

#### Scenario: COMPLETED gigs show pending payment with approval messages
- GIVEN seeded COMPLETED gigs exist
- WHEN the CLIENT owner views these gigs
- THEN they MUST see "Mark as Paid" button
- AND they MUST see 2-3 messages including approval confirmation
- AND the payment status MUST indicate awaiting payment

#### Scenario: PAID gigs show completed workflow with full message history
- GIVEN seeded PAID gigs exist
- WHEN any user views these gigs
- THEN they MUST see "PAID" status
- AND the payment date MUST be displayed
- AND no action buttons MUST be shown (workflow complete)
- AND they MUST see 2-3 messages showing the complete conversation arc

**Acceptance Criteria:**
- Run `npm run seed` to populate database
- Login as CLIENT (ivan.petrov@techcorp.ru)
- Navigate to `/dashboard` - verify gigs in multiple states are visible
- Login as SPECIALIST (alexey.ivanov@mail.ru)
- Navigate to `/dashboard` - verify accepted applications and assigned gigs are visible
- Browse gigs at `/dashboard/gigs` - verify OPEN gigs show "Apply" button, other states do not
- View individual gig details - verify state-specific UI elements are present
- View gig detail pages for IN_PROGRESS/REVIEW/COMPLETED/PAID gigs - verify messages are visible and demonstrate realistic communication

---

### Requirement: Realistic Workflow Gig Content
Seeded workflow gigs MUST use realistic Russian content that demonstrates platform value proposition.

#### Scenario: Professional Russian gig descriptions
- GIVEN workflow gigs are created in seed script
- WHEN reviewing gig content
- THEN all titles MUST be in Russian and professionally written
- AND all descriptions MUST be in Russian with realistic scenarios
- AND structured requirement fields (goal, deliverables, constraints) MUST be populated
- AND acceptance criteria MUST be specific and measurable (≥50 characters)

#### Scenario: Varied budgets demonstrate market positioning
- GIVEN all workflow gigs are seeded
- WHEN reviewing budgets
- THEN budgets MUST range from 80,000 ₽ to 250,000 ₽
- AND average budget MUST be approximately 150,000 ₽
- AND this MUST align with "high-end B2B marketplace" positioning

#### Scenario: Varied tech stacks demonstrate specialist diversity
- GIVEN all workflow gigs are seeded
- WHEN reviewing tags and requirements
- THEN tech stacks MUST include:
  - Frontend: React, TypeScript, UI/UX
  - Backend: Python, Node.js, Microservices
  - DevOps: Docker, Kubernetes, CI/CD
  - Database: PostgreSQL, Redis
- AND at least 3 different specialists MUST be assigned across workflow gigs

**Acceptance Criteria:**
- All workflow gigs have Russian content (no placeholder text)
- All workflow gigs have acceptanceCriteria ≥ 50 characters
- All workflow gigs have goal, deliverables, constraints fields populated
- Budgets range from 80k to 250k ₽
- Tags demonstrate variety (React, Python, Go, Docker, Kubernetes, etc.)
- At least 3 different specialists assigned across workflow gigs

---

### Requirement: Workflow Gigs Include Realistic Messages
Workflow gigs MUST include messages between clients and specialists to demonstrate active communication and make the demo UI feel alive.

#### Scenario: Messages make the UI feel alive
- GIVEN a workflow gig is viewed in the UI
- WHEN the gig detail page is loaded
- THEN the messaging section MUST NOT be empty
- AND messages MUST demonstrate realistic communication between client and specialist
- AND this MUST make the platform feel active and used (not empty/dead)

#### Scenario: Message content reflects gig state
- GIVEN messages are created for workflow gigs
- WHEN reviewing message content
- THEN IN_PROGRESS gigs MUST have messages like "Здравствуйте, начал работу над задачей"
- AND REVIEW gigs MUST have messages like "Работа завершена, отправил на проверку"
- AND COMPLETED gigs MUST have messages like "Отлично, работа принята!"
- AND PAID gigs MUST have a complete conversation arc from start to payment

#### Scenario: Messages demonstrate two-way communication
- GIVEN multiple messages exist for a workflow gig
- WHEN viewing the message list
- THEN messages MUST alternate between client and specialist
- AND this MUST demonstrate active collaboration (not one-sided communication)

#### Scenario: Message idempotency prevents duplicates
- GIVEN messages are created with deterministic IDs
- WHEN the seed script is run multiple times
- THEN messages MUST use upsert operations with deterministic IDs (e.g., msg-mobile-ui-1)
- AND re-running seed MUST NOT duplicate chat history
- AND existing messages MUST be updated, not duplicated

#### Scenario: Message timestamps maintain chronological order
- GIVEN messages are created for workflow gigs
- WHEN message timestamps are set
- THEN they MUST be explicitly set (not default now())
- AND they MUST be later than the gig's createdAt timestamp
- AND they MUST be spread over time (not all identical)
- AND for PAID gigs, all message timestamps MUST be earlier than paidAt

**Acceptance Criteria:**
- Each IN_PROGRESS gig has 1-2 messages
- Each REVIEW gig has 2-3 messages
- Each COMPLETED gig has 2-3 messages
- Each PAID gig has 2-3 messages
- All messages are in Russian
- All messages use deterministic IDs (e.g., msg-mobile-ui-1, msg-redis-2)
- Messages alternate between client and specialist senders
- Message timestamps are explicitly set and maintain chronological order
- Run `npm run seed` twice: no duplicate messages created
- View gig detail pages in UI: messaging section is populated and looks natural

---

### Requirement: Workflow Gigs Use Example Flag
Workflow gigs SHOULD NOT use the `isExample` flag to distinguish them from tutorial/example gigs.

#### Scenario: Workflow gigs are not marked as examples
- GIVEN workflow gigs are created in seed script
- WHEN the gigs are created
- THEN `isExample` MUST be false or omitted (default)
- AND only the 5 original tutorial gigs MUST have `isExample = true`

#### Scenario: Example gigs remain unchanged
- GIVEN the seed script is executed
- WHEN example gigs are processed
- THEN the 5 existing example gigs MUST remain with `isExample = true`:
  - Backend API Development
  - Frontend Dashboard
  - DevOps CI/CD
  - Database Optimization
  - E2E Testing
- AND these MUST remain in OPEN status

**Acceptance Criteria:**
- Workflow gigs have `isExample = false` or field omitted
- Original 5 example gigs retain `isExample = true`
- Run `npm run seed` and verify in Prisma Studio: 5 gigs with isExample=true, 5 gigs with isExample=false

---

### Requirement: Applications Demonstrate Structured Fields
Applications created for workflow gigs MUST use structured fields (approach, questions, estimatedEffort) to demonstrate the platform's application format.

#### Scenario: Applications use structured fields
- GIVEN workflow gigs with applications are created
- WHEN applications are created
- THEN each application MUST have:
  - `approach` field populated (100-2000 characters, technical methodology)
  - `questions` field populated (50-1000 characters, clarifying questions)
  - `estimatedEffort` field optionally populated (max 200 characters)
  - `coverLetter` field empty (legacy field, not used)
  - `status` = "ACCEPTED" for the assigned specialist
  - `status` = "REJECTED" for other applications (if any)

#### Scenario: Accepted applications match assigned specialists
- GIVEN a workflow gig with status IN_PROGRESS, REVIEW, COMPLETED, or PAID
- WHEN querying the gig with applications
- THEN exactly 1 application MUST have status "ACCEPTED"
- AND the ACCEPTED application's specialistId MUST equal the gig's assignedSpecialistId
- AND all other applications (if any) MUST have status "REJECTED"

**Acceptance Criteria:**
- All workflow gig applications have `approach` and `questions` populated
- All workflow gig applications have `coverLetter` = "" (empty string)
- Each IN_PROGRESS/REVIEW/COMPLETED/PAID gig has exactly 1 ACCEPTED application
- ACCEPTED application's specialistId matches gig's assignedSpecialistId
- Run `npm run seed` and verify in Prisma Studio: applications have structured fields

---

## MODIFIED Requirements

None. This change extends existing gig functionality without modifying existing requirements.

---

## REMOVED Requirements

None. This change is purely additive.
