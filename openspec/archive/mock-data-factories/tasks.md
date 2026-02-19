# Implementation Tasks

## Task 1: Add Russian Data Generator Functions

**Description:** Create utility functions that generate realistic Russian names, companies, gig titles, descriptions, messages, and INN values.

**Implementation Notes:**
- Add to `__tests__/helpers/seed.ts` at the top of the file (before factory functions)
- Create arrays of Russian data:
  - `RUSSIAN_NAMES`: Array of 20+ Russian full names (male and female)
  - `RUSSIAN_COMPANIES`: Array of 15+ Russian company names with ООО prefix
  - `RUSSIAN_GIG_TITLES`: Array of 20+ Russian gig titles covering various tech domains
  - `RUSSIAN_GIG_DESCRIPTIONS`: Array of 15+ multi-sentence Russian descriptions
  - `RUSSIAN_MESSAGES`: Array of 15+ Russian message texts
  - `RUSSIAN_INNS`: Array of 5-10 realistic 10-digit INN values (e.g., "7743013902", "7707083893", "5004002123")
- Create generator functions:
  - `generateRussianName()`: Returns random name from RUSSIAN_NAMES
  - `generateRussianCompany()`: Returns random company from RUSSIAN_COMPANIES
  - `generateRussianGigTitle()`: Returns random title from RUSSIAN_GIG_TITLES
  - `generateRussianGigDescription()`: Returns random description from RUSSIAN_GIG_DESCRIPTIONS
  - `generateRussianMessage()`: Returns random message from RUSSIAN_MESSAGES
  - `generateRussianINN()`: Returns random INN from RUSSIAN_INNS
- Each generator uses `Math.floor(Math.random() * array.length)` for selection
- Export all generator functions for use in tests

**Test Plan:**
1. Create test file `__tests__/helpers/russian-data.test.ts`
2. Test each generator returns non-empty string
3. Test generators return different values on multiple calls (randomness)
4. Test all returned values are valid Russian text (contain Cyrillic characters where applicable)
5. Test `generateRussianINN()` returns 10-digit strings
6. Test INN values are realistic (all digits, length 10)
7. Run `npm run test:unit` and verify all tests pass

---

## Task 2: Enhance User Factory with Russian Data

**Description:** Update `createTestUser()` to use Russian names for specialists and Russian company names for clients by default.

**Implementation Notes:**
- Modify `createTestUser()` in `__tests__/helpers/seed.ts`
- For SPECIALIST role:
  - Change `displayName` default from `''` to `generateRussianName()`
  - Keep techStack as "React, TypeScript" (international tech terms)
  - Ensure experienceLevel defaults to "SENIOR" (valid value)
  - Keep hourlyRate as 5000 (already in kopecks)
- For CLIENT role:
  - Change `companyName` default from `'Test Company'` to `generateRussianCompany()`
  - Change `inn` default from `'1234567890'` to `generateRussianINN()`
- Maintain all override functionality
- Keep email generation unchanged (already unique: `test-${Date.now()}-${Math.random()}@example.com`)
- Keep password hashing unchanged

**Test Plan:**
1. Add tests to `__tests__/helpers/seed.test.ts`
2. Test SPECIALIST user has Russian displayName by default
3. Test CLIENT user has Russian companyName by default
4. Test CLIENT user has realistic INN by default (10 digits)
5. Test overrides still work for all fields
6. Test experienceLevel is "SENIOR" (valid value)
7. Test created users can be saved to database without errors
8. Test no unique constraint violations on email in parallel execution:
   - Run 50 parallel tests, each creating 5 users
   - Verify all 250 users created successfully
   - Verify no "Unique constraint failed on the fields: (`email`)" errors
9. Run existing tests to ensure backward compatibility
10. Run `npm run test:unit` and verify all tests pass

---

## Task 3: Enhance Gig Factory with Russian Content

**Description:** Update `createTestGig()` to use Russian titles and descriptions by default.

**Implementation Notes:**
- Modify `createTestGig()` in `__tests__/helpers/seed.ts`
- Change `title` default from `'Test Gig'` to `generateRussianGigTitle()`
- Change `description` default from `'Test gig description'` to `generateRussianGigDescription()`
- Keep tags as 'React,TypeScript' (international tech terms)
- Update budget default to 150000 (1500 RUB, more realistic)
- Update serviceFee calculation to 10% of budget (15000)
- Update totalAmount to budget + serviceFee (165000)
- Keep all other defaults and override functionality unchanged

**Test Plan:**
1. Add tests to `__tests__/helpers/seed.test.ts`
2. Test gig has Russian title by default
3. Test gig has Russian description by default
4. Test budget/serviceFee/totalAmount calculations are correct
5. Test overrides work for all fields
6. Test created gigs can be saved to database without errors
7. Test gig with structured requirements (goal, deliverables, constraints)
8. Run `npm run test:unit` and verify all tests pass

---

## Task 4: Enhance Application Factory with Russian Content

**Description:** Update `createTestApplication()` to use Russian text for approach and questions fields.

**Implementation Notes:**
- Modify `createTestApplication()` in `__tests__/helpers/seed.ts`
- Create Russian application text constants:
  - `RUSSIAN_APPROACHES`: Array of 10+ Russian technical approach texts (100-500 chars each)
  - `RUSSIAN_QUESTIONS`: Array of 10+ Russian clarifying question texts (50-200 chars each)
  - `RUSSIAN_EFFORTS`: Array of 10+ Russian effort estimates ("2 недели", "40 часов", etc.)
- Add generator functions:
  - `generateRussianApproach()`: Returns random approach
  - `generateRussianQuestions()`: Returns random questions
  - `generateRussianEffort()`: Returns random effort estimate
- Update defaults:
  - `approach`: `generateRussianApproach()` instead of 'Test technical approach'
  - `questions`: `generateRussianQuestions()` instead of 'Test clarifying questions'
  - `estimatedEffort`: `generateRussianEffort()` instead of '2 weeks'
- Keep coverLetter as empty string (legacy field)
- Maintain all override functionality

**Test Plan:**
1. Add tests to `__tests__/helpers/seed.test.ts`
2. Test application has Russian approach by default
3. Test application has Russian questions by default
4. Test application has Russian estimatedEffort by default
5. Test approach length is 100-2000 chars (validation compliance)
6. Test questions length is 50-1000 chars (validation compliance)
7. Test coverLetter is empty string
8. Test overrides work for all fields
9. Test created applications can be saved without validation errors
10. Run `npm run test:unit` and verify all tests pass

---

## Task 5: Add Message Factory

**Description:** Create `createTestMessage()` factory function for Message entities with Russian content.

**Implementation Notes:**
- Add `createTestMessage()` function to `__tests__/helpers/seed.ts`
- Function signature:
  ```typescript
  export async function createTestMessage(
    tx: PrismaClient,
    overrides?: {
      gigId?: string
      senderId?: string
      content?: string
    }
  )
  ```
- Implementation:
  - If gigId not provided, create gig using `createTestGig(tx)`
  - If senderId not provided, create user using `createTestUser(tx, { role: 'CLIENT' })`
  - Default content: `generateRussianMessage()`
  - Create message with `tx.message.create()`
  - Include gig and sender relations in return
- Return type: Message with nested gig and sender

**Test Plan:**
1. Add tests to `__tests__/helpers/seed.test.ts`
2. Test message created with defaults (auto-creates gig and sender)
3. Test message created with existing gigId
4. Test message created with existing senderId
5. Test message created with custom content
6. Test message has Russian content by default
7. Test message relations are correctly loaded (gig, sender)
8. Test content passes validation (non-empty, max 2000 chars)
9. Test message can be saved to database without errors
10. Run `npm run test:unit` and verify all tests pass

---

## Task 6: Add Factory Composability Examples

**Description:** Create example tests demonstrating how to compose factories to create complex related data graphs.

**Implementation Notes:**
- Add new test file `__tests__/integration/factory-composability.test.ts`
- Create examples for common scenarios:
  1. **Gig with multiple applications:**
     - Create one gig
     - Create 3 applications with same gigId but different specialists
     - Verify all applications linked to same gig
  2. **Complete gig workflow:**
     - Create client user
     - Create gig with clientId
     - Create specialist user
     - Create application with gigId and specialistId
     - Accept application (update gig status to IN_PROGRESS)
     - Create messages between client and specialist
     - Verify entire workflow with Russian data
  3. **Message conversation:**
     - Create gig with assigned specialist
     - Create 5 messages alternating between client and specialist
     - Verify messages are ordered by createdAt
- Each example should use `withTestTransaction()` for isolation
- Add comments explaining the pattern

**Test Plan:**
1. Run `npm run test:unit` and verify all composability tests pass
2. Verify tests demonstrate realistic scenarios
3. Verify all data is Russian and validation-compliant
4. Verify tests are well-commented and easy to understand
5. Check that examples can be copied as templates for new tests

---

## Task 7: Update Testing Documentation

**Description:** Add comprehensive documentation for factory functions to TESTING.md.

**Implementation Notes:**
- Add new section "Mock Data Factories" to `TESTING.md`
- Document structure:
  1. **Overview:** Explain purpose of factories (create realistic test data)
  2. **Russian Data Generators:** List all generator functions with examples
  3. **Factory Functions:** Document each factory with signature and usage
     - `createTestUser(tx, overrides?)`
     - `createTestGig(tx, overrides?)`
     - `createTestApplication(tx, overrides?)`
     - `createTestMessage(tx, overrides?)`
  4. **Common Patterns:** Show examples for:
     - Creating user with defaults
     - Creating user with overrides
     - Creating gig with applications
     - Creating complete workflow
     - Using Russian data generators directly
  5. **Validation Compliance:** Explain that factories guarantee valid data
  6. **Composability:** Show how to create related data graphs
- Include code examples for each pattern
- Add table of default values for each factory

**Test Plan:**
1. Review documentation for completeness
2. Verify all factory functions are documented
3. Verify all examples are accurate and runnable
4. Test examples by copying into test file and running
5. Ask another developer to review for clarity

---

## Task 8: Verify Validation Compliance and Parallel Execution Safety

**Description:** Create comprehensive tests verifying that all factory-generated data passes model validations, database constraints, and handles parallel execution without unique constraint violations.

**Implementation Notes:**
- Add test file `__tests__/integration/factory-validation.test.ts`
- Test each factory:
  1. **User factory validation:**
     - Email is unique across multiple calls
     - Password is hashed (not plaintext)
     - Role is valid ("CLIENT", "SPECIALIST", or "ADMIN")
     - SPECIALIST has valid experienceLevel ("MIDDLE" or "SENIOR")
     - CLIENT has non-empty companyName and inn
     - INN is realistic 10-digit string
  2. **Gig factory validation:**
     - Budget > 0
     - serviceFee = budget * 0.10
     - totalAmount = budget + serviceFee
     - Status is valid ("OPEN", "IN_PROGRESS", etc.)
     - Tags are non-empty
  3. **Application factory validation:**
     - approach length is 100-2000 chars
     - questions length is 50-1000 chars
     - Unique constraint (gigId, specialistId) is respected
     - Status is valid ("PENDING", "ACCEPTED", "REJECTED")
  4. **Message factory validation:**
     - content is non-empty
     - content length <= 2000 chars
     - gigId references existing gig
     - senderId references existing user
- **Parallel execution safety tests:**
  - Create 50 users in parallel, verify no email collisions (email has @unique)
  - Create 20 gigs with applications in parallel, verify no (gigId, specialistId) violations
- Use `withTestTransaction()` for all tests
- Test both defaults and overrides

**Test Plan:**
1. Run `npm run test:unit` and verify all validation tests pass
2. Verify tests cover all validation rules from specs
3. Test with invalid overrides to ensure validation catches errors
4. Verify no database constraint violations occur
5. **Run parallel execution tests with `fileParallelism: true`:**
   - 50 parallel user creations → verify no "Unique constraint failed on the fields: (`email`)"
   - 20 parallel gig+application creations → verify no unique constraint violations
   - Verify all entities created successfully
6. Run tests 10 times to ensure consistency (no random failures)
7. **Stress test:** Run 100 parallel tests, each creating 5 users → verify 500 users created without errors

---

## Summary

**Total Tasks:** 8

**Estimated Effort:** 6-8 hours

**Dependencies:**
- Task 2 depends on Task 1 (Russian generators)
- Task 3 depends on Task 1
- Task 4 depends on Task 1
- Task 5 depends on Task 1
- Task 6 depends on Tasks 2-5 (all factories enhanced)
- Task 7 depends on Tasks 1-5 (document what exists)
- Task 8 depends on Tasks 2-5 (validate what exists)

**Critical Path:** Task 1 → Tasks 2-5 (parallel) → Tasks 6-8 (parallel)

**Files Modified:**
- `__tests__/helpers/seed.ts` (Tasks 1-5)
- `TESTING.md` (Task 7)

**Files Created:**
- `__tests__/helpers/russian-data.test.ts` (Task 1)
- `__tests__/integration/factory-composability.test.ts` (Task 6)
- `__tests__/integration/factory-validation.test.ts` (Task 8)
