# Database Specification: Seed Applications and Messages

## ADDED Requirements

### Requirement: Seed Applications for OPEN Example Gigs
The seed script MUST create 2-3 applications for each OPEN example gig to demonstrate the application review workflow.

#### Scenario: Backend API gig has multiple applications
- GIVEN the OPEN example gig "REST API для системы управления пользователями" (example-gig-backend-api)
- WHEN the seed script runs
- THEN the gig MUST have 2-3 Application records with status "PENDING"
- AND applications MUST be from different specialists (alexey, dmitry, sergey)
- AND each application MUST have realistic Russian content in `approach` field (100-2000 chars)
- AND each application MUST have realistic Russian content in `questions` field (50-1000 chars)
- AND applications MUST demonstrate varying quality levels (strong vs generic)

#### Scenario: Frontend Dashboard gig has multiple applications
- GIVEN the OPEN example gig "React дашборд с визуализацией данных" (example-gig-frontend-dashboard)
- WHEN the seed script runs
- THEN the gig MUST have 2-3 Application records with status "PENDING"
- AND applications MUST be from different specialists
- AND content MUST be relevant to frontend/React work

#### Scenario: DevOps CI/CD gig has multiple applications
- GIVEN the OPEN example gig "CI/CD pipeline для Node.js приложения" (example-gig-devops-cicd)
- WHEN the seed script runs
- THEN the gig MUST have 2-3 Application records with status "PENDING"
- AND applications MUST be from different specialists
- AND content MUST be relevant to DevOps/CI/CD work

#### Scenario: Database Optimization gig has multiple applications
- GIVEN the OPEN example gig "Оптимизация производительности PostgreSQL" (example-gig-db-optimization)
- WHEN the seed script runs
- THEN the gig MUST have 2-3 Application records with status "PENDING"
- AND applications MUST be from different specialists
- AND content MUST be relevant to database/SQL work

#### Scenario: E2E Testing gig has multiple applications
- GIVEN the OPEN example gig "E2E тесты с Playwright для веб-приложения" (example-gig-e2e-testing)
- WHEN the seed script runs
- THEN the gig MUST have 2-3 Application records with status "PENDING"
- AND applications MUST be from different specialists
- AND content MUST be relevant to testing/QA work

#### Scenario: Applications use realistic Russian content
- GIVEN any new application created by the seed script
- WHEN the application is viewed
- THEN the `approach` field MUST contain realistic Russian technical content (100-2000 chars)
- AND the `questions` field MUST contain realistic Russian clarifying questions (50-1000 chars)
- AND the `estimatedEffort` field MAY contain effort estimate in Russian (e.g., "2 недели", "80 часов")
- AND content MUST use appropriate IT terminology in Russian
- AND content MUST reflect the specialist's experience level (SENIOR vs MIDDLE)

#### Scenario: Applications demonstrate quality variation
- GIVEN multiple applications on the same gig
- WHEN applications are compared
- THEN at least one application MUST demonstrate strong technical approach (detailed methodology, specific tools, risk mitigation)
- AND at least one application MUST demonstrate weaker approach (generic statements, less detail)
- AND this variation MUST help developers understand how clients evaluate applications

**Acceptance Criteria:**
- Run `npm run seed` successfully
- Query `SELECT COUNT(*) FROM Application WHERE gigId = 'example-gig-backend-api'` returns 2 or 3
- Query `SELECT COUNT(*) FROM Application WHERE gigId = 'example-gig-frontend-dashboard'` returns 2 or 3
- Query `SELECT COUNT(*) FROM Application WHERE gigId = 'example-gig-devops-cicd'` returns 2 or 3
- Query `SELECT COUNT(*) FROM Application WHERE gigId = 'example-gig-db-optimization'` returns 2 or 3
- Query `SELECT COUNT(*) FROM Application WHERE gigId = 'example-gig-e2e-testing'` returns 2 or 3
- All new applications have `approach` length >= 100 characters
- All new applications have `questions` length >= 50 characters
- All new applications have status "PENDING"
- No duplicate applications (unique constraint on gigId + specialistId is respected)

---

### Requirement: Enhanced Message Threads for Workflow Gigs
The seed script MUST create 3-5 messages for each workflow gig to demonstrate realistic client-specialist communication.

#### Scenario: IN_PROGRESS gigs have realistic message threads
- GIVEN workflow gigs with status "IN_PROGRESS" (mobile-ui, microservices)
- WHEN the seed script runs
- THEN each gig MUST have 3-5 Message records
- AND messages MUST alternate between client and assigned specialist
- AND messages MUST demonstrate realistic conversation flow (kickoff → progress updates → questions → responses)
- AND messages MUST use natural Russian language appropriate for B2B IT communication

#### Scenario: REVIEW gig has realistic message thread
- GIVEN workflow gig with status "REVIEW" (k8s-setup)
- WHEN the seed script runs
- THEN the gig MUST have 3-5 Message records
- AND messages MUST include work submission notification and client review feedback
- AND messages MUST demonstrate professional communication during review phase

#### Scenario: COMPLETED gig has realistic message thread
- GIVEN workflow gig with status "COMPLETED" (api-docs)
- WHEN the seed script runs
- THEN the gig MUST have 3-5 Message records
- AND messages MUST include work completion, client review, and acceptance
- AND final message MUST indicate work approval

#### Scenario: PAID gig has realistic message thread
- GIVEN workflow gig with status "PAID" (redis-caching)
- WHEN the seed script runs
- THEN the gig MUST have 3-5 Message records
- AND messages MUST demonstrate full lifecycle communication
- AND messages MUST show professional closure

#### Scenario: Messages use realistic timestamps
- GIVEN messages in a conversation thread
- WHEN messages are ordered by createdAt
- THEN timestamps MUST be chronologically ordered
- AND timestamps MUST be realistic (spread over days, not all at once)
- AND timestamps MUST align with gig lifecycle (older messages for older gigs)

**Acceptance Criteria:**
- Run `npm run seed` successfully
- Query `SELECT COUNT(*) FROM Message WHERE gigId = 'workflow-gig-mobile-ui'` returns 3-5
- Query `SELECT COUNT(*) FROM Message WHERE gigId = 'workflow-gig-microservices'` returns 3-5
- Query `SELECT COUNT(*) FROM Message WHERE gigId = 'workflow-gig-k8s-setup'` returns 3-5
- Query `SELECT COUNT(*) FROM Message WHERE gigId = 'workflow-gig-api-docs'` returns 3-5
- Query `SELECT COUNT(*) FROM Message WHERE gigId = 'workflow-gig-redis-caching'` returns 3-5
- All messages have content length > 0
- Messages are ordered chronologically within each gig
- Messages alternate between client and specialist (realistic conversation)

---

### Requirement: Seed Script Idempotency
The seed script MUST be idempotent and safe to run multiple times without creating duplicate records.

#### Scenario: Re-running seed script does not create duplicates
- GIVEN the seed script has been run once
- WHEN the seed script is run again
- THEN no duplicate Application records MUST be created
- AND no duplicate Message records MUST be created
- AND existing records MUST be preserved
- AND the script MUST complete successfully

#### Scenario: Applications use compound unique constraint for idempotency
- GIVEN new Application records in the seed script
- WHEN the seed script creates these records
- THEN upsert operations MUST use `where: { gigId_specialistId: { gigId: '...', specialistId: userId } }` to prevent duplicates
- AND this leverages the existing `@@unique([gigId, specialistId])` constraint on the Application model

#### Scenario: Messages use explicit IDs for idempotency
- GIVEN new Message records in the seed script
- WHEN the seed script creates these records
- THEN each message MUST use an explicit `id` field (e.g., 'msg-mobile-ui-3')
- AND upsert operations MUST use `where: { id: '...' }` to prevent duplicates

#### Scenario: Workflow gig messages are added inline
- GIVEN existing workflow gig code blocks in seed.ts
- WHEN adding new messages for these gigs
- THEN new messages MUST be added directly within the existing gig block
- AND NOT in separate/parallel code blocks at the end of the file
- AND this maintains the principle: one gig = one code block with all its data

**Acceptance Criteria:**
- Run `npm run seed` twice in succession
- Query `SELECT COUNT(*) FROM Application` returns the same count both times
- Query `SELECT COUNT(*) FROM Message` returns the same count both times
- No Prisma unique constraint errors occur
- Script completes in < 30 seconds
- Applications use compound unique constraint (gigId_specialistId) for upsert
- Messages use explicit IDs for upsert
- No duplicate code blocks for workflow gigs (one gig = one block)
