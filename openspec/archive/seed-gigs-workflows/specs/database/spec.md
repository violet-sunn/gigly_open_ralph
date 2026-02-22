# Database Specification Delta: Seed Gigs in Workflow States

## ADDED Requirements

### Requirement: Seed IN_PROGRESS Gigs
The seed script MUST create gigs in IN_PROGRESS status with assigned specialists, applications, and messages.

#### Scenario: Create IN_PROGRESS gig with accepted application
- GIVEN the seed script is executed
- WHEN IN_PROGRESS gigs are created
- THEN each gig MUST have:
  - `status` = "IN_PROGRESS"
  - `assignedSpecialistId` set to a valid specialist userId
  - At least 1 Application with status "ACCEPTED" linked to the assigned specialist
  - At least 1 Application with status "REJECTED" (optional, for realism)
  - At least 1-2 Message records between client and specialist
  - Valid `budget`, `serviceFee` (10% of budget), `totalAmount` calculations
  - Realistic Russian content (title, description, goal, deliverables, constraints, acceptanceCriteria)

#### Scenario: IN_PROGRESS gig has proper state
- GIVEN a seeded IN_PROGRESS gig
- WHEN queried with applications
- THEN it MUST have exactly 1 ACCEPTED application
- AND the ACCEPTED application's specialistId MUST match the gig's assignedSpecialistId
- AND all other applications (if any) MUST have status "REJECTED"

#### Scenario: Application creation respects unique constraint
- GIVEN the Application model has @@unique([gigId, specialistId]) constraint
- WHEN creating applications in seed script
- THEN the script MUST check for existing applications using findFirst({ where: { gigId, specialistId } })
- AND only create the application if it does not already exist
- AND this MUST prevent duplicate key errors on subsequent seed runs

**Acceptance Criteria:**
- Seed script creates at least 2 IN_PROGRESS gigs
- Each IN_PROGRESS gig has `assignedSpecialistId` not null
- Each IN_PROGRESS gig has exactly 1 ACCEPTED application
- Each IN_PROGRESS gig has at least 1 Message record
- Service fee calculated as Math.floor(budget * 0.10)
- All text content in Russian
- Run `npm run seed` succeeds without errors
- Run `npm run seed` twice in a row succeeds both times (idempotency)
- Verify in Prisma Studio: gigs exist with correct status and relations

---

### Requirement: Seed REVIEW Gig
The seed script MUST create at least one gig in REVIEW status representing work submitted and awaiting approval, with messages demonstrating communication.

#### Scenario: Create REVIEW gig with assigned specialist
- GIVEN the seed script is executed
- WHEN a REVIEW gig is created
- THEN the gig MUST have:
  - `status` = "REVIEW"
  - `assignedSpecialistId` set to a valid specialist userId
  - Exactly 1 Application with status "ACCEPTED" linked to the assigned specialist
  - At least 2-3 Message records between client and specialist (including work submission notice)
  - Valid budget calculations (serviceFee = 10% of budget)
  - Realistic Russian content

#### Scenario: REVIEW gig represents submitted work
- GIVEN a seeded REVIEW gig
- WHEN viewed by the CLIENT owner
- THEN the UI MUST show "Approve Work" button
- AND when viewed by the assigned SPECIALIST
- THEN the UI MUST NOT show "Submit Work" button (already submitted)

**Acceptance Criteria:**
- Seed script creates at least 1 REVIEW gig
- REVIEW gig has `assignedSpecialistId` not null
- REVIEW gig has exactly 1 ACCEPTED application
- REVIEW gig has at least 2 Message records
- Messages include realistic content like "Работа завершена, отправил на проверку"
- Run `npm run seed` succeeds
- Verify in UI: CLIENT sees "Approve Work" button on gig detail page

---

### Requirement: Seed COMPLETED Gig
The seed script MUST create at least one gig in COMPLETED status representing approved work awaiting payment, with messages demonstrating the approval process.

#### Scenario: Create COMPLETED gig without payment
- GIVEN the seed script is executed
- WHEN a COMPLETED gig is created
- THEN the gig MUST have:
  - `status` = "COMPLETED"
  - `assignedSpecialistId` set to a valid specialist userId
  - `paidAt` = null (not yet paid)
  - Exactly 1 Application with status "ACCEPTED"
  - At least 2-3 Message records between client and specialist (including approval confirmation)
  - Valid budget calculations
  - Realistic Russian content

#### Scenario: COMPLETED gig awaits payment
- GIVEN a seeded COMPLETED gig
- WHEN viewed by the CLIENT owner
- THEN the UI MUST show "Mark as Paid" button
- AND the payment status MUST show "Awaiting payment" or similar

**Acceptance Criteria:**
- Seed script creates at least 1 COMPLETED gig
- COMPLETED gig has `paidAt` = null
- COMPLETED gig has `assignedSpecialistId` not null
- COMPLETED gig has exactly 1 ACCEPTED application
- COMPLETED gig has at least 2 Message records
- Messages include realistic content like "Отлично, работа принята!"
- Run `npm run seed` succeeds
- Verify in UI: CLIENT sees "Mark as Paid" button on gig detail page

---

### Requirement: Seed PAID Gig
The seed script MUST create at least one gig in PAID status representing a complete workflow with payment marked and full message history.

#### Scenario: Create PAID gig with payment timestamp
- GIVEN the seed script is executed
- WHEN a PAID gig is created
- THEN the gig MUST have:
  - `status` = "PAID"
  - `assignedSpecialistId` set to a valid specialist userId
  - `paidAt` set to a valid timestamp (e.g., 3-7 days ago using Date manipulation)
  - Exactly 1 Application with status "ACCEPTED"
  - At least 2-3 Message records between client and specialist (complete conversation history)
  - Valid budget calculations
  - Realistic Russian content

#### Scenario: PAID gig shows complete workflow
- GIVEN a seeded PAID gig
- WHEN viewed by any user
- THEN the UI MUST show status "PAID"
- AND the payment date MUST be displayed
- AND no action buttons MUST be shown (workflow complete)

#### Scenario: Message timestamps are realistic
- GIVEN messages are created for workflow gigs
- WHEN message timestamps are set
- THEN they MUST be spread over time (not all at once)
- AND they MUST use Date manipulation (e.g., new Date(Date.now() - N * 24 * 60 * 60 * 1000))
- AND earlier messages MUST have older timestamps than later messages

**Acceptance Criteria:**
- Seed script creates at least 1 PAID gig
- PAID gig has `paidAt` not null
- PAID gig has `assignedSpecialistId` not null
- PAID gig has exactly 1 ACCEPTED application
- PAID gig has at least 2 Message records
- `paidAt` timestamp is realistic (recent past, not future)
- Message timestamps are spread over time (e.g., 5 days ago, 3 days ago, 1 day ago)
- Run `npm run seed` succeeds
- Verify in UI: gig shows "PAID" status with payment date

---

### Requirement: Seed Data Idempotency
The seed script MUST use upsert operations and deterministic IDs to allow multiple executions without errors.

#### Scenario: Run seed script multiple times
- GIVEN the seed script has been executed once
- WHEN the seed script is executed again
- THEN it MUST NOT throw duplicate key errors
- AND existing workflow gigs MUST be updated (not duplicated)
- AND existing messages MUST be updated (not duplicated)
- AND the final state MUST be consistent

#### Scenario: Deterministic IDs for workflow gigs
- GIVEN workflow gigs are created in seed script
- WHEN using deterministic IDs (e.g., "workflow-gig-mobile-ui")
- THEN upsert operations MUST use these IDs in the `where` clause
- AND re-running seed MUST update existing records, not create duplicates

#### Scenario: Deterministic IDs for messages
- GIVEN messages are created for workflow gigs
- WHEN using deterministic IDs (e.g., "msg-mobile-ui-1", "msg-mobile-ui-2")
- THEN upsert operations MUST use these IDs in the `where` clause
- AND re-running seed MUST update existing messages, not create duplicates
- AND this MUST prevent chat history duplication on subsequent seed runs

#### Scenario: Application idempotency with unique constraint
- GIVEN the Application model has @@unique([gigId, specialistId]) constraint
- WHEN creating applications in seed script
- THEN the script MUST check for existing applications using findFirst({ where: { gigId, specialistId } })
- AND only create the application if it does not already exist
- AND this MUST prevent duplicate key errors on subsequent seed runs

**Acceptance Criteria:**
- All workflow gigs use deterministic IDs (not auto-generated)
- All workflow messages use deterministic IDs (e.g., msg-mobile-ui-1, msg-redis-2)
- Seed script uses `prisma.gig.upsert()` for workflow gigs
- Seed script uses `prisma.message.upsert()` for messages
- Seed script uses findFirst check for applications (cannot use standard upsert due to @@unique constraint)
- Run `npm run seed` twice in a row succeeds both times
- Verify in Prisma Studio: no duplicate gigs, messages, or applications with same deterministic ID

---

### Requirement: Workflow Gig Content Quality
All seeded workflow gigs MUST have realistic, high-quality Russian content that demonstrates platform value.

#### Scenario: Realistic gig descriptions
- GIVEN a workflow gig is created in seed script
- WHEN the gig content is reviewed
- THEN it MUST include:
  - Title in Russian (clear, professional)
  - Description in Russian (detailed, realistic scenario)
  - `goal` field populated (desired outcome)
  - `deliverables` field populated (specific outputs)
  - `constraints` field populated (tech stack, timeline)
  - `acceptanceCriteria` field with at least 50 characters (specific, measurable)
  - Appropriate tags from existing tag set

#### Scenario: Varied budgets and tech stacks
- GIVEN all workflow gigs are created
- WHEN reviewing the complete set
- THEN budgets MUST range from 80k to 250k ₽
- AND tech stacks MUST be varied (React, Python, Go, Docker, Kubernetes, etc.)
- AND at least 3 different specialists MUST be assigned across gigs

**Acceptance Criteria:**
- All workflow gigs have Russian content (no English placeholders)
- All workflow gigs have acceptanceCriteria ≥ 50 characters
- All workflow gigs have goal, deliverables, constraints populated
- Budgets vary across gigs (not all the same)
- Tags vary across gigs (demonstrate different specializations)
- At least 3 different specialists assigned across all workflow gigs

---

### Requirement: Seed Script Console Output
The seed script MUST log clear messages for each workflow gig created.

#### Scenario: Console logging for workflow gigs
- GIVEN the seed script is executed
- WHEN workflow gigs are created
- THEN console MUST log for each gig:
  - "Created/updated workflow gig: [Gig Title] ([Status])"
- AND at the end, a summary MUST be displayed

**Acceptance Criteria:**
- Run `npm run seed` and verify console output includes workflow gig messages
- Console output format is consistent with existing seed logging
- Summary section mentions workflow gigs

---

### Requirement: Chronological Consistency for Workflow Gigs
The seed script MUST explicitly set createdAt timestamps for Gigs, Applications, and Messages to maintain logical chronological order.

#### Scenario: Timestamps maintain logical order
- GIVEN a workflow gig is created with explicit timestamps
- WHEN reviewing all timestamps
- THEN the chronological order MUST be:
  1. Gig createdAt (earliest)
  2. Application createdAt (after gig creation)
  3. Message createdAt timestamps (after application, spread over time)
  4. paidAt (if applicable, after all messages)
- AND no timestamp MUST be in the future
- AND no timestamp MUST violate logical order (e.g., paidAt before Gig createdAt)

#### Scenario: PAID gig has realistic timeline
- GIVEN a PAID gig is created in seed script
- WHEN timestamps are set
- THEN the timeline MUST be realistic:
  - Gig createdAt: ~12 days ago
  - Application createdAt: ~11 days ago
  - Messages: ~10 days ago, ~7 days ago, ~4 days ago
  - paidAt: ~2 days ago (MUST be after all messages)
- AND this MUST demonstrate a complete workflow over time
- AND paidAt MUST NOT be earlier than Gig createdAt (would look like a bug)

#### Scenario: COMPLETED gig timeline without payment
- GIVEN a COMPLETED gig is created in seed script
- WHEN timestamps are set
- THEN the timeline MUST be:
  - Gig createdAt: ~10 days ago
  - Application createdAt: ~9 days ago
  - Messages: ~8 days ago, ~5 days ago, ~1 day ago (last message: approval)
  - paidAt: null (not yet paid)
- AND the most recent event MUST be the approval message (~1 day ago)

#### Scenario: IN_PROGRESS and REVIEW gigs have appropriate timelines
- GIVEN IN_PROGRESS or REVIEW gigs are created
- WHEN timestamps are set
- THEN timelines MUST be adjusted so:
  - Gig createdAt is in the past (7-9 days ago)
  - Application createdAt follows gig creation
  - Messages are recent (1-5 days ago)
  - Most recent message reflects current state (work in progress or submitted for review)

**Acceptance Criteria:**
- All workflow gigs have explicit createdAt timestamps (not default now())
- All workflow applications have explicit createdAt timestamps
- All workflow messages have explicit createdAt timestamps
- Timestamps maintain logical chronological order: Gig → Application → Messages → paidAt
- PAID gig has paidAt that is later than all other timestamps
- No timestamps are in the future
- Run `npm run seed` and verify in Prisma Studio: timestamps are realistic and in logical order
- View gig detail pages in UI: dates look natural and don't show bugs (e.g., "Paid 3 days ago, Created 2 days ago")

---

### Requirement: Seed Messages for Workflow Gigs
The seed script MUST create realistic messages between clients and specialists for workflow gigs to demonstrate active communication.

#### Scenario: Messages demonstrate workflow progression
- GIVEN workflow gigs are created in seed script
- WHEN messages are created for each gig
- THEN messages MUST reflect the gig's current state:
  - IN_PROGRESS: "Здравствуйте, начал работу над задачей" (Hello, started working on the task)
  - REVIEW: "Работа завершена, отправил на проверку" (Work completed, submitted for review)
  - COMPLETED: "Отлично, работа принята!" (Excellent, work approved!)
  - PAID: Complete conversation showing progression from start to payment

#### Scenario: Messages have realistic timestamps
- GIVEN messages are created for workflow gigs
- WHEN message createdAt timestamps are set
- THEN they MUST be spread over time using Date manipulation
- AND earlier messages MUST have older timestamps (e.g., 5 days ago)
- AND later messages MUST have newer timestamps (e.g., 1 day ago)
- AND timestamps MUST be in the past (not future)

#### Scenario: Messages alternate between client and specialist
- GIVEN multiple messages exist for a gig
- WHEN reviewing the message list
- THEN messages SHOULD alternate between client (senderId = clientId) and specialist (senderId = assignedSpecialistId)
- AND this MUST demonstrate two-way communication

#### Scenario: Message content is brief and realistic
- GIVEN messages are created in seed script
- WHEN message content is set
- THEN content MUST be in Russian
- AND content MUST be brief (1-2 sentences)
- AND content MUST be realistic (not placeholder text like "Test message")
- AND content MUST be appropriate for the gig state

**Acceptance Criteria:**
- Each IN_PROGRESS gig has 1-2 messages
- Each REVIEW gig has 2-3 messages
- Each COMPLETED gig has 2-3 messages
- Each PAID gig has 2-3 messages
- All messages have Russian content
- Message timestamps are spread over time (not all identical)
- Messages alternate between client and specialist senders
- Run `npm run seed` and verify in Prisma Studio: Message records exist with correct gigId, senderId, content, createdAt
- View gig detail pages in UI: messages are visible and demonstrate realistic communication

---

## MODIFIED Requirements

None. This change extends existing seed functionality without modifying existing requirements.

---

## REMOVED Requirements

None. This change is purely additive.
