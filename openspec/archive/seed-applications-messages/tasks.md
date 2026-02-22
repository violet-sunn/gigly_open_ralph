# Implementation Tasks: Seed Applications and Messages

## CRITICAL ARCHITECTURAL PRINCIPLE

**One Gig = One Code Block**

- Each workflow gig (IN_PROGRESS, REVIEW, COMPLETED, PAID) already has a code block in seed.ts that creates the gig, its accepted application, and initial messages
- **DO NOT create separate/parallel upsert blocks for Tasks 6-10**
- **DO locate existing workflow gig blocks and append new messages directly there**
- This prevents code duplication and maintains chronological message order

**Idempotency Strategy:**

- **Applications (Tasks 1-5):** Use compound unique constraint `gigId_specialistId` for upsert
  ```typescript
  where: {
    gigId_specialistId: {
      gigId: 'example-gig-backend-api',
      specialistId: dmitry.id
    }
  }
  ```
- **Messages (Tasks 6-10):** Use explicit IDs with `where: { id: 'msg-mobile-ui-3' }`

---

## Task 1: Add Applications for Backend API Gig

**Implementation:**
- Add 2-3 applications to `example-gig-backend-api` gig
- Use specialists: alexey (SENIOR, React/TS), dmitry (MIDDLE, Python), sergey (SENIOR, DevOps/Go)
- **Use compound unique constraint for upsert:**
  ```typescript
  await prisma.application.upsert({
    where: {
      gigId_specialistId: {
        gigId: 'example-gig-backend-api',
        specialistId: dmitry.id
      }
    },
    update: {},
    create: { gigId: 'example-gig-backend-api', specialistId: dmitry.id, ... }
  })
  ```
- Create NEW section in seed.ts after example gigs, before workflow gigs

**Content Guidelines:**
- **Strong application (dmitry)**: Detailed technical approach mentioning specific tools (Express/Fastify, Prisma, JWT libraries), security considerations, testing strategy, timeline breakdown
- **Weaker application (sergey)**: Generic approach, mentions experience but lacks specifics, fewer clarifying questions
- **Medium application (alexey)**: Good approach but outside primary expertise (frontend dev applying to backend gig)

**Example approach (strong):**
```
Предлагаю следующий подход: использую Fastify для высокой производительности, Prisma ORM для типобезопасной работы с PostgreSQL. JWT реализую через библиотеку jsonwebtoken с refresh token rotation. Для ролевой модели создам middleware с декораторами @RequireRole(). Архитектура: слой контроллеров → сервисы → репозитории. Тесты: Jest для unit, Supertest для integration. Swagger генерирую автоматически из TypeScript типов через tsoa или swagger-jsdoc.
```

**Test Plan:**
- Run `npm run seed`
- Query: `SELECT * FROM Application WHERE gigId = 'example-gig-backend-api'`
- Verify: 2-3 applications exist, all have status "PENDING"
- Verify: `approach` field length >= 100 chars for all
- Verify: `questions` field length >= 50 chars for all
- Verify: No duplicate applications (unique constraint respected)

---

## Task 2: Add Applications for Frontend Dashboard Gig

**Implementation:**
- Add 2-3 applications to `example-gig-frontend-dashboard` gig
- Use specialists: alexey (SENIOR, React/TS - strong match), dmitry (MIDDLE, Python - weak match), sergey (SENIOR, DevOps - medium match)
- **Use compound unique constraint for upsert:**
  ```typescript
  where: {
    gigId_specialistId: {
      gigId: 'example-gig-frontend-dashboard',
      specialistId: alexey.id
    }
  }
  ```
- Add to same NEW section as Task 1

**Content Guidelines:**
- **Strong application (alexey)**: Mentions specific charting libraries (Recharts, Chart.js), performance optimization techniques (virtualization, memoization), responsive design patterns, Storybook experience
- **Weaker application (dmitry)**: Backend dev trying frontend, mentions basic React knowledge but lacks depth
- **Medium application (sergey)**: Has some frontend experience, mentions Docker for dev environment but less detail on React specifics

**Example questions (strong):**
```
Какие конкретно метрики нужно визуализировать? Есть ли дизайн-макеты или нужно предложить свой вариант? Какая частота обновления данных (real-time или по запросу)? Нужна ли поддержка экспорта графиков в PDF/PNG? Есть ли требования к accessibility (WCAG)?
```

**Test Plan:**
- Run `npm run seed`
- Query: `SELECT * FROM Application WHERE gigId = 'example-gig-frontend-dashboard'`
- Verify: 2-3 applications exist, all PENDING
- Verify: Content is relevant to frontend/React work
- Verify: alexey's application demonstrates strongest technical depth

---

## Task 3: Add Applications for DevOps CI/CD Gig

**Implementation:**
- Add 2-3 applications to `example-gig-devops-cicd` gig
- Use specialists: sergey (SENIOR, DevOps - strong match), dmitry (MIDDLE, Python - medium match), alexey (SENIOR, React - weak match)
- **Use compound unique constraint for upsert:**
  ```typescript
  where: {
    gigId_specialistId: {
      gigId: 'example-gig-devops-cicd',
      specialistId: sergey.id
    }
  }
  ```
- Add to same NEW section as Tasks 1-2

**Content Guidelines:**
- **Strong application (sergey)**: Detailed GitHub Actions workflow structure, Docker multi-stage builds, secrets management, rollback strategies, monitoring setup
- **Medium application (dmitry)**: Has CI/CD experience from Python projects, knows basics but less DevOps depth
- **Weaker application (alexey)**: Frontend dev with limited DevOps experience, generic approach

**Example approach (strong):**
```
Настрою GitHub Actions с тремя workflow: CI (lint + test), Build (Docker image), Deploy (staging/prod). Использую multi-stage Dockerfile для оптимизации размера образа. Secrets через GitHub Secrets + Vault для production. Деплой на VPS через SSH с использованием docker-compose. Rollback через тегирование образов и быстрый откат на предыдущую версию. Мониторинг деплоев через Sentry + уведомления в Telegram через webhook. Документация в README с диаграммами pipeline.
```

**Test Plan:**
- Run `npm run seed`
- Query: `SELECT * FROM Application WHERE gigId = 'example-gig-devops-cicd'`
- Verify: 2-3 applications exist, all PENDING
- Verify: sergey's application shows strongest DevOps expertise
- Verify: Content mentions relevant tools (GitHub Actions, Docker, etc.)

---

## Task 4: Add Applications for Database Optimization Gig

**Implementation:**
- Add 2-3 applications to `example-gig-db-optimization` gig
- Use specialists: dmitry (MIDDLE, Python/PostgreSQL - strong match), sergey (SENIOR, DevOps - medium match), alexey (SENIOR, React - weak match)
- **Use compound unique constraint for upsert:**
  ```typescript
  where: {
    gigId_specialistId: {
      gigId: 'example-gig-db-optimization',
      specialistId: dmitry.id
    }
  }
  ```
- Add to same NEW section as Tasks 1-3

**Content Guidelines:**
- **Strong application (dmitry)**: Mentions EXPLAIN ANALYZE, index strategies (B-tree, GiST, GIN), query optimization techniques, partitioning, connection pooling
- **Medium application (sergey)**: DevOps perspective - knows about database performance from infrastructure side, less SQL depth
- **Weaker application (alexey)**: Frontend dev with basic SQL knowledge, generic approach

**Example questions (strong):**
```
Какой текущий размер базы и темп роста? Есть ли проблемы с конкретными таблицами или запросами? Используется ли connection pooling (PgBouncer)? Какие индексы уже существуют? Можно ли получить доступ к staging БД для анализа? Есть ли ограничения на downtime для применения миграций?
```

**Test Plan:**
- Run `npm run seed`
- Query: `SELECT * FROM Application WHERE gigId = 'example-gig-db-optimization'`
- Verify: 2-3 applications exist, all PENDING
- Verify: dmitry's application demonstrates strongest database expertise
- Verify: Content mentions PostgreSQL-specific techniques

---

## Task 5: Add Applications for E2E Testing Gig

**Implementation:**
- Add 2-3 applications to `example-gig-e2e-testing` gig
- Use specialists: alexey (SENIOR, React/TS - strong match for frontend testing), dmitry (MIDDLE, Python - medium match), sergey (SENIOR, DevOps - medium match for CI integration)
- **Use compound unique constraint for upsert:**
  ```typescript
  where: {
    gigId_specialistId: {
      gigId: 'example-gig-e2e-testing',
      specialistId: alexey.id
    }
  }
  ```
- Add to same NEW section as Tasks 1-4

**Content Guidelines:**
- **Strong application (alexey)**: Playwright experience, Page Object Model, test stability patterns, CI integration, visual regression testing
- **Medium application (sergey)**: DevOps angle - strong on CI/CD integration, less on test writing
- **Medium application (dmitry)**: Backend testing experience (pytest), learning Playwright, good questions

**Example approach (strong):**
```
Использую Playwright с TypeScript и Page Object Model для переиспользования кода. Структура: tests/ (сценарии), pages/ (POM), fixtures/ (тестовые данные). Для стабильности: auto-waiting, retry logic, изоляция тестов через beforeEach. Настрою запуск в 3 браузерах параллельно. CI интеграция через GitHub Actions с артефактами (screenshots, videos, HTML report). Добавлю visual regression testing через Playwright screenshots. Документация: contributing guide для новых тестов, troubleshooting для flaky tests.
```

**Test Plan:**
- Run `npm run seed`
- Query: `SELECT * FROM Application WHERE gigId = 'example-gig-e2e-testing'`
- Verify: 2-3 applications exist, all PENDING
- Verify: alexey's application shows strongest testing expertise
- Verify: Content mentions Playwright, test patterns, CI integration

---

## Task 6: Enhance Messages for Mobile UI Gig (IN_PROGRESS)

**CRITICAL: DO NOT create new code block. Locate EXISTING workflow gig block for `workflow-gig-mobile-ui` and add messages there.**

**Implementation:**
- **Find existing code block** in seed.ts (around line 409-497) where `workflow-gig-mobile-ui` is created
- Current messages: 2 (msg-mobile-ui-1, msg-mobile-ui-2)
- **Add 1-3 more messages directly in that same block** showing: design iteration, feedback, progress update
- Use explicit IDs: `msg-mobile-ui-3`, `msg-mobile-ui-4`, `msg-mobile-ui-5`
- Use `prisma.message.upsert()` with `where: { id: '...' }`
- **Maintain chronological order:** new messages should have timestamps between existing messages and present day

**Content Guidelines:**
- Message 3 (alexey): Shares Figma link with initial wireframes, asks for feedback
- Message 4 (client): Provides feedback on wireframes, requests adjustments
- Message 5 (alexey): Confirms adjustments, provides timeline for final designs

**Example message:**
```
Подготовил первые wireframes в Figma (ссылка в личке). Проработал основные экраны: онбординг, авторизация, главный экран с задачами. Использовал ваши корпоративные цвета. Прошу посмотреть и дать обратную связь по структуре и навигации. После согласования перейду к детальной отрисовке UI компонентов.
```

**Test Plan:**
- Run `npm run seed`
- Query: `SELECT * FROM Message WHERE gigId = 'workflow-gig-mobile-ui' ORDER BY createdAt`
- Verify: 3-5 messages exist
- Verify: Messages alternate between alexey and client1
- Verify: Timestamps are chronologically ordered
- Verify: Content demonstrates realistic design iteration conversation

---

## Task 7: Enhance Messages for Microservices Gig (IN_PROGRESS)

**CRITICAL: DO NOT create new code block. Locate EXISTING workflow gig block for `workflow-gig-microservices` and add messages there.**

**Implementation:**
- **Find existing code block** in seed.ts (around line 499-592) where `workflow-gig-microservices` is created
- Current messages: 2 (msg-microservices-1, msg-microservices-2)
- **Add 1-3 more messages directly in that same block** showing: architecture review, implementation progress, technical questions
- Use explicit IDs: `msg-microservices-3`, `msg-microservices-4`, `msg-microservices-5`
- Use `prisma.message.upsert()` with `where: { id: '...' }`
- **Maintain chronological order:** timestamps should continue from existing messages

**Content Guidelines:**
- Message 3 (dmitry): Shares architecture diagram, proposes migration order
- Message 4 (client): Approves architecture, asks about timeline
- Message 5 (dmitry): Provides detailed timeline, mentions first service deployment

**Test Plan:**
- Run `npm run seed`
- Query: `SELECT * FROM Message WHERE gigId = 'workflow-gig-microservices' ORDER BY createdAt`
- Verify: 3-5 messages exist
- Verify: Messages alternate between dmitry and client2
- Verify: Content demonstrates realistic microservices migration discussion

---

## Task 8: Enhance Messages for K8s Gig (REVIEW)

**CRITICAL: DO NOT create new code block. Locate EXISTING workflow gig block for `workflow-gig-k8s-setup` and add messages there.**

**Implementation:**
- **Find existing code block** in seed.ts (around line 594-681) where `workflow-gig-k8s-setup` is created
- Current messages: 3 (msg-k8s-1, msg-k8s-2, msg-k8s-3)
- **Already at minimum 3 messages, optionally add 0-2 more** if needed for realism
- If adding: use explicit IDs `msg-k8s-4`, `msg-k8s-5`
- **Add directly in that same block**, maintaining chronological order
- Content should demonstrate review phase communication

**Content Guidelines:**
- If adding messages: client testing feedback, sergey addressing concerns, final approval pending

**Test Plan:**
- Run `npm run seed`
- Query: `SELECT * FROM Message WHERE gigId = 'workflow-gig-k8s-setup' ORDER BY createdAt`
- Verify: 3-5 messages exist
- Verify: Final messages indicate work is under review
- Verify: Content demonstrates review phase communication

---

## Task 9: Enhance Messages for API Docs Gig (COMPLETED)

**CRITICAL: DO NOT create new code block. Locate EXISTING workflow gig block for `workflow-gig-api-docs` and add messages there.**

**Implementation:**
- **Find existing code block** in seed.ts (around line 683-770) where `workflow-gig-api-docs` is created
- Current messages: 3 (msg-api-docs-1, msg-api-docs-2, msg-api-docs-3)
- **Already at minimum 3 messages, optionally add 0-2 more** if needed for realism
- If adding: use explicit IDs `msg-api-docs-4`, `msg-api-docs-5`
- **Add directly in that same block**, maintaining chronological order
- Content should demonstrate completion and acceptance phase

**Content Guidelines:**
- If adding messages: client requests minor revisions, alexey implements, client final approval

**Test Plan:**
- Run `npm run seed`
- Query: `SELECT * FROM Message WHERE gigId = 'workflow-gig-api-docs' ORDER BY createdAt`
- Verify: 3-5 messages exist
- Verify: Final message indicates work approval
- Verify: Content demonstrates completion and acceptance

---

## Task 10: Enhance Messages for Redis Gig (PAID)

**CRITICAL: DO NOT create new code block. Locate EXISTING workflow gig block for `workflow-gig-redis-caching` and add messages there.**

**Implementation:**
- **Find existing code block** in seed.ts (around line 772-861) where `workflow-gig-redis-caching` is created
- Current messages: 3 (msg-redis-1, msg-redis-2, msg-redis-3)
- **Add 0-2 more messages directly in that same block** showing: final testing, client approval, payment confirmation
- Use explicit IDs: `msg-redis-4`, `msg-redis-5`
- Use `prisma.message.upsert()` with `where: { id: '...' }`
- **Maintain chronological order:** timestamps should align with paidAt date (2 days ago)
- Content should demonstrate full lifecycle including payment and professional closure

**Content Guidelines:**
- Message 4 (client): Approves work, confirms payment will be processed
- Message 5 (dmitry): Thanks client, offers post-launch support

**Test Plan:**
- Run `npm run seed`
- Query: `SELECT * FROM Message WHERE gigId = 'workflow-gig-redis-caching' ORDER BY createdAt`
- Verify: 3-5 messages exist
- Verify: Messages demonstrate full lifecycle including payment
- Verify: Professional closure of the gig

---

## Task 11: Test Idempotency and Verify All Data

**Implementation:**
- Run seed script twice in succession
- Verify no duplicate records created
- Verify all counts match expected values
- Test in clean database and existing database scenarios

**Test Plan:**
1. **Clean database test:**
   - Drop database: `rm prisma/dev.db`
   - Run migrations: `npx prisma migrate dev`
   - Run seed: `npm run seed`
   - Verify counts:
     - `SELECT COUNT(*) FROM Application WHERE gigId LIKE 'example-gig-%'` = 10-15
     - `SELECT COUNT(*) FROM Message WHERE gigId LIKE 'workflow-gig-%'` = 15-25

2. **Idempotency test:**
   - Run seed again: `npm run seed`
   - Verify counts unchanged
   - Verify no Prisma errors
   - Verify script completes in < 30 seconds

3. **Data quality checks:**
   - All applications have `approach` length >= 100
   - All applications have `questions` length >= 50
   - All applications have status "PENDING"
   - All messages have content length > 0
   - Messages are chronologically ordered within each gig
   - No orphaned records (all foreign keys valid)

4. **Manual verification:**
   - Open Prisma Studio: `npx prisma studio`
   - Browse Application table, verify realistic Russian content
   - Browse Message table, verify conversation flow
   - Check gig detail pages in running app to see applications and messages

**Acceptance Criteria:**
- Seed script runs successfully twice without errors
- All 5 OPEN gigs have 2-3 applications each
- All 5 workflow gigs have 3-5 messages each
- Content is realistic and in Russian
- No duplicate records created
- Application quality varies (strong vs weak)
- Message threads show natural conversation flow
