# Testing Specification Delta

## ADDED Requirements

### Requirement: Russian Data Generators

The platform SHALL provide utility functions that generate realistic Russian data for test entities.

#### Scenario: Generate Russian person name

**Given** a test needs a realistic Russian person name
**When** the test calls `generateRussianName()`
**Then** a realistic Russian full name SHALL be returned
**And** the name SHALL be randomly selected from a predefined list
**And** the list SHALL include both male and female names

**Acceptance Criteria:**
- `generateRussianName()` function exists in `__tests__/helpers/seed.ts`
- Returns strings like "Александр Петров", "Мария Иванова", "Дмитрий Соколов"
- List includes at least 20 different names
- Names are realistic and commonly used in Russia

#### Scenario: Generate Russian company name

**Given** a test needs a realistic Russian company name
**When** the test calls `generateRussianCompany()`
**Then** a realistic Russian company name SHALL be returned
**And** the name SHALL follow Russian business naming conventions (ООО, ИП, etc.)

**Acceptance Criteria:**
- `generateRussianCompany()` function exists
- Returns strings like "ООО \"ТехноСтарт\"", "ООО \"Цифровые Решения\""
- List includes at least 15 different company names
- Names reflect IT/tech industry context

#### Scenario: Generate realistic INN

**Given** a test needs a realistic INN (Individual Taxpayer Number)
**When** the test calls `generateRussianINN()`
**Then** a realistic 10-digit INN SHALL be returned
**And** the INN SHALL be randomly selected from a predefined pool

**Acceptance Criteria:**
- `generateRussianINN()` function exists
- Returns 10-digit string (e.g., "7743013902", "7707083893")
- Pool includes 5-10 realistic INN values
- Random selection provides variety in test data
- Format is realistic (all digits, length 10)

#### Scenario: Generate Russian gig title

**Given** a test needs a realistic gig title
**When** the test calls `generateRussianGigTitle()`
**Then** a realistic Russian gig title SHALL be returned
**And** the title SHALL describe a concrete technical task

**Acceptance Criteria:**
- `generateRussianGigTitle()` function exists
- Returns strings like "Разработка REST API для мобильного приложения"
- List includes at least 20 different titles
- Titles cover various tech domains (backend, frontend, DevOps, etc.)

#### Scenario: Generate Russian gig description

**Given** a test needs a realistic gig description
**When** the test calls `generateRussianGigDescription()`
**Then** a realistic Russian gig description SHALL be returned
**And** the description SHALL provide context and requirements

**Acceptance Criteria:**
- `generateRussianGigDescription()` function exists
- Returns multi-sentence descriptions in Russian
- Descriptions are 2-4 sentences long
- Content is technically realistic

#### Scenario: Generate Russian message content

**Given** a test needs realistic message content
**When** the test calls `generateRussianMessage()`
**Then** a realistic Russian message SHALL be returned
**And** the message SHALL be appropriate for gig communication

**Acceptance Criteria:**
- `generateRussianMessage()` function exists
- Returns strings like "Добрый день! Уточните, пожалуйста, требования к производительности."
- List includes at least 15 different messages
- Messages cover common scenarios (questions, updates, confirmations)

---

### Requirement: Enhanced User Factory with Russian Data

The platform SHALL enhance `createTestUser()` to use realistic Russian data by default while maintaining backward compatibility.

#### Scenario: Create user with Russian name

**Given** a test calls `createTestUser(tx)` without overrides
**When** the user is created
**Then** the user SHALL have a unique email address
**And** if role is SPECIALIST, the displayName SHALL be a Russian name
**And** if role is CLIENT, the companyName SHALL be a Russian company name
**And** if role is CLIENT, the inn SHALL be a realistic Russian INN

**Acceptance Criteria:**
- Default SPECIALIST users have Russian displayName
- Default CLIENT users have Russian companyName and realistic INN
- Email remains unique (test-{timestamp}-{random}@example.com pattern)
- INN is realistic (from predefined pool, not necessarily unique)
- Overrides still work for all fields
- Existing tests continue to pass

#### Scenario: Create user with validation-compliant data

**Given** a test calls `createTestUser(tx, { role: 'SPECIALIST' })`
**When** the user is created
**Then** the experienceLevel SHALL be either "MIDDLE" or "SENIOR"
**And** the techStack SHALL contain realistic tech stack items
**And** all data SHALL pass model validations

**Acceptance Criteria:**
- experienceLevel defaults to "SENIOR" (valid value)
- techStack defaults to realistic Russian-context stack
- hourlyRate is in kopecks (e.g., 500000 for 5000 RUB)
- No validation errors when saving to database

#### Scenario: Create user with unique email

**Given** multiple tests create users in parallel
**When** each test calls `createTestUser(tx)`
**Then** each user SHALL have a unique email address
**And** no "Unique constraint failed" errors SHALL occur on email field

**Acceptance Criteria:**
- Email is automatically unique (timestamp + random suffix)
- No collisions in parallel test execution
- Overrides still allow setting specific email values
- Run 100 users in parallel, verify no unique constraint errors on email

---

### Requirement: Enhanced Gig Factory with Russian Content

The platform SHALL enhance `createTestGig()` to use realistic Russian gig data by default.

#### Scenario: Create gig with Russian content

**Given** a test calls `createTestGig(tx)` without overrides
**When** the gig is created
**Then** the title SHALL be a Russian gig title
**And** the description SHALL be a Russian gig description
**And** the tags SHALL contain realistic tech stack tags

**Acceptance Criteria:**
- Default title is Russian (e.g., "Разработка REST API")
- Default description is Russian (2-4 sentences)
- Default tags are "React,TypeScript" or similar realistic stack
- Budget defaults to realistic value (e.g., 150000 kopecks = 1500 RUB)
- serviceFee calculated correctly (10% of budget)
- totalAmount = budget + serviceFee

#### Scenario: Create gig with structured requirements

**Given** a test calls `createTestGig(tx, { goal: '...', deliverables: '...', constraints: '...' })`
**When** the gig is created
**Then** the structured requirement fields SHALL be populated
**And** the fields SHALL contain Russian content if provided

**Acceptance Criteria:**
- goal, deliverables, constraints fields are settable
- Default values are empty strings (optional fields)
- Overrides work for all fields

---

### Requirement: Enhanced Application Factory with Russian Content

The platform SHALL enhance `createTestApplication()` to use realistic Russian application data by default.

#### Scenario: Create application with Russian structured fields

**Given** a test calls `createTestApplication(tx)` without overrides
**When** the application is created
**Then** the approach field SHALL contain Russian technical approach text
**And** the questions field SHALL contain Russian clarifying questions
**And** the estimatedEffort field SHALL contain realistic effort estimate

**Acceptance Criteria:**
- Default approach is Russian (e.g., "Буду использовать архитектуру REST с валидацией через Zod")
- Default questions is Russian (e.g., "Какие требования к производительности? Нужна ли документация API?")
- Default estimatedEffort is realistic (e.g., "2 недели", "40 часов")
- coverLetter remains empty (legacy field)
- All fields pass validation (approach 100-2000 chars, questions 50-1000 chars)

---

### Requirement: Message Factory

The platform SHALL provide a factory function for creating Message entities with realistic Russian content.

#### Scenario: Create message with defaults

**Given** a test needs a message entity
**When** the test calls `createTestMessage(tx)`
**Then** a message SHALL be created with Russian content
**And** a gig SHALL be created automatically if not provided
**And** a sender user SHALL be created automatically if not provided
**And** the message SHALL be associated with the gig

**Acceptance Criteria:**
- `createTestMessage(tx, overrides?)` function exists in `__tests__/helpers/seed.ts`
- Default content is Russian message text
- Creates gig if gigId not provided
- Creates sender if senderId not provided
- Returns message with gig and sender relations included
- Content passes validation (non-empty, max 2000 chars)

#### Scenario: Create message with specific sender and gig

**Given** a test has existing gig and user
**When** the test calls `createTestMessage(tx, { gigId, senderId, content })`
**Then** a message SHALL be created linking to the provided gig and sender
**And** the custom content SHALL be used

**Acceptance Criteria:**
- Accepts gigId override to use existing gig
- Accepts senderId override to use existing sender
- Accepts content override for custom message text
- Does not create duplicate gigs or users when IDs provided

---

### Requirement: Factory Composability Patterns

The platform SHALL support composing factories to create complex related data graphs efficiently.

#### Scenario: Create gig with applications

**Given** a test needs a gig with multiple applications
**When** the test creates a gig and then creates applications referencing it
**Then** all applications SHALL be linked to the same gig
**And** each application SHALL have a different specialist

**Acceptance Criteria:**
- Can call `createTestGig(tx)` once, then `createTestApplication(tx, { gigId })` multiple times
- Each application gets unique specialist automatically
- No unique constraint violations
- All relations are correctly established

#### Scenario: Create complete gig workflow

**Given** a test needs to simulate full gig lifecycle
**When** the test creates client, gig, specialist, application, and messages
**Then** all entities SHALL be correctly related
**And** the data SHALL be realistic and validation-compliant

**Acceptance Criteria:**
- Can create: client → gig → application → accept → messages in sequence
- All Russian data is realistic and consistent
- No validation errors at any step
- Example documented in TESTING.md

---

### Requirement: Factory Documentation

The platform SHALL provide comprehensive documentation for factory functions with usage examples.

#### Scenario: Developer reads factory documentation

**Given** a developer wants to write tests with realistic data
**When** they read TESTING.md
**Then** documentation SHALL explain all factory functions
**And** documentation SHALL include examples for common scenarios
**And** documentation SHALL explain Russian data generators

**Acceptance Criteria:**
- TESTING.md includes "Mock Data Factories" section
- Each factory function is documented with signature and purpose
- Examples show: creating users, gigs, applications, messages
- Examples show: overriding fields, creating related data
- Examples show: using Russian data generators directly

#### Scenario: Example tests demonstrate factory usage

**Given** example tests exist
**When** a developer reads `__tests__/helpers/seed.test.ts`
**Then** examples SHALL demonstrate all factory functions
**And** examples SHALL show realistic test scenarios
**And** all examples SHALL pass

**Acceptance Criteria:**
- `seed.test.ts` includes tests for all factories
- Tests demonstrate overrides and defaults
- Tests verify Russian data is generated
- Tests verify validation compliance
- Run `npm run test:unit` and verify all pass

---

### Requirement: Validation Compliance Verification

The platform SHALL ensure all factory-generated data passes model validations.

#### Scenario: Factory data passes database constraints

**Given** any factory function is called with defaults
**When** the entity is saved to the database
**Then** no validation errors SHALL occur
**And** no constraint violations SHALL occur

**Acceptance Criteria:**
- User factory: email unique (auto-generated), password hashed, role valid
- User factory: CLIENT users have realistic INN (from pool)
- Gig factory: budget > 0, status valid, serviceFee calculated correctly
- Application factory: approach 100-2000 chars, questions 50-1000 chars, unique (gigId, specialistId)
- Message factory: content non-empty, valid gigId and senderId
- Test by creating entities and verifying no errors

#### Scenario: Parallel factory calls do not cause unique constraint violations

**Given** multiple tests run in parallel using factories
**When** each test creates users, gigs, applications, and messages
**Then** no "Unique constraint failed" errors SHALL occur on fields with unique constraints
**And** all entities SHALL be created successfully

**Acceptance Criteria:**
- Run 50 parallel tests, each creating 5 users
- Verify no unique constraint errors on email (has @unique)
- Verify no unique constraint errors on (gigId, specialistId) for applications (has @@unique)
- All 250 users created successfully
- Run with `fileParallelism: true` in vitest config

#### Scenario: Factory data passes business logic validations

**Given** factory-generated data is used in server actions
**When** server actions validate the data
**Then** no business logic validation errors SHALL occur

**Acceptance Criteria:**
- SPECIALIST experienceLevel is "MIDDLE" or "SENIOR" (not "JUNIOR")
- CLIENT companyName and inn are non-empty
- Gig budget meets minimum threshold (if enforced)
- Application approach and questions are non-empty
- Test by calling server actions with factory data
