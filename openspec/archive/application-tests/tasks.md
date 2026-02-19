# Tasks: Comprehensive Application Flow Tests

## Task 1: Create test file structure and setup ✅ COMPLETE
**Implementation:**
- Create `__tests__/integration/application-flow.test.ts`
- Import required dependencies: vitest, test helpers (db, auth), server actions
- Set up mocks for `@/lib/prisma`, `next/headers`, `next/navigation`
- Import `applyToGig`, `acceptApplication`, `rejectApplication` from `@/app/actions/gig`
- Add beforeEach/afterEach hooks to clear session tokens

**Test Plan:**
- File structure follows existing patterns from `gig-creation.test.ts`
- Mocks are properly configured
- No import errors when running tests

---

## Task 2: Write application submission validation tests ✅ COMPLETE
**Implementation:**
Create test suite "Application Submission Tests" with scenarios:

1. **Successful application** - Create CLIENT with gig, SPECIALIST applies with valid fields (approach ≥100, questions ≥50, optional estimatedEffort), verify application created in DB
2. **Missing approach** - Apply without approach field, expect error "Technical approach is required."
3. **Missing questions** - Apply without questions field, expect error "Clarifying questions are required."
4. **Approach too short** - Apply with approach <100 chars, expect error about minimum length
5. **Questions too short** - Apply with questions <50 chars, expect error about minimum length
6. **Approach too long** - Apply with approach >2000 chars, expect error "Technical approach is too long"
7. **Questions too long** - Apply with questions >1000 chars, expect error "Clarifying questions are too long"
8. **Estimated effort too long** - Apply with estimatedEffort >200 chars, expect error "Estimated effort is too long"
9. **Duplicate application** - Apply twice to same gig, expect error "You have already applied to this gig."
10. **Non-existent gig** - Apply to invalid gigId, expect error "Gig not found."
11. **Example gig** - Apply to gig with isExample=true, expect error about example gig
12. **Closed gig** - Apply to gig with closedByAdmin=true, expect error "This gig has been closed by administrators."

**Test Plan:**
```bash
npm run test:unit -- application-flow
```
- All 12 scenarios pass
- Error messages match expected strings
- No applications created when validation fails
- Applications created with correct field values when validation passes

---

## Task 3: Write application submission status tests ✅ COMPLETE
**Implementation:**
Create test suite "Application Submission - Gig Status Tests" with scenarios:

1. **Cannot apply to IN_PROGRESS gig** - Create gig with status IN_PROGRESS, apply, expect error "This gig is no longer accepting applications."
2. **Cannot apply to REVIEW gig** - Create gig with status REVIEW, apply, expect error
3. **Cannot apply to COMPLETED gig** - Create gig with status COMPLETED, apply, expect error
4. **Cannot apply to PAID gig** - Create gig with status PAID, apply, expect error

**Test Plan:**
```bash
npm run test:unit -- application-flow
```
- All 4 scenarios pass
- No applications created for non-OPEN gigs
- Error message is consistent across all non-OPEN statuses

---

## Task 4: Write application submission authorization tests ✅ COMPLETE
**Implementation:**
Create test suite "Application Submission - Authorization Tests" with scenarios:

1. **Only SPECIALIST can apply** - Create CLIENT user, attempt to apply, expect error "Only specialists can apply to gigs."
2. **Unauthenticated user redirects** - Call applyToGig without session, expect NEXT_REDIRECT to /login

**Test Plan:**
```bash
npm run test:unit -- application-flow
```
- CLIENT cannot apply to gigs
- Unauthenticated requests redirect to login
- No applications created when authorization fails

---

## Task 5: Write application acceptance tests ✅ COMPLETE
**Implementation:**
Create test suite "Application Acceptance Tests" with scenarios:

1. **Successful acceptance** - Create gig with PENDING application, accept it, verify:
   - Application status = ACCEPTED
   - Gig status = IN_PROGRESS
   - Gig assignedSpecialistId = specialist's userId
2. **Auto-reject other applications** - Create gig with 3 PENDING applications, accept one, verify:
   - Accepted application status = ACCEPTED
   - Other 2 applications status = REJECTED
   - No PENDING applications remain
3. **Only gig owner can accept** - Create CLIENT who doesn't own gig, attempt to accept, expect error "Only the gig owner can manage applications."
4. **Only CLIENT role can accept** - Create SPECIALIST, attempt to accept, expect error "Only clients can manage applications."
5. **Cannot accept on non-OPEN gig** - Create gig with status IN_PROGRESS, attempt to accept, expect error "This gig is no longer accepting applications."
6. **Cannot accept second application after first is accepted (race condition protection)** - Create gig with 2 PENDING applications, accept Application A (gig → IN_PROGRESS), immediately attempt to accept Application B, verify:
   - Second accept returns error "This gig is no longer accepting applications."
   - Application B status = REJECTED (auto-rejected by first accept)
   - Gig assignedSpecialistId = Specialist A (not overwritten)
   - Gig status = IN_PROGRESS (unchanged)
7. **Cannot accept non-PENDING application** - Create REJECTED application, attempt to accept, expect error "This application is no longer pending."
8. **Cannot accept non-existent application** - Use invalid applicationId, expect error "Application not found."

**Test Plan:**
```bash
npm run test:unit -- application-flow
```
- All 8 scenarios pass
- Gig lifecycle transitions correctly (OPEN → IN_PROGRESS)
- Auto-rejection works in transaction (all or nothing)
- Race condition protection verified (second accept fails after first succeeds)
- Authorization checks prevent unauthorized access

---

## Task 6: Write application rejection tests ✅ COMPLETE
**Implementation:**
Create test suite "Application Rejection Tests" with scenarios:

1. **Successful rejection** - Create gig with PENDING application, reject it, verify:
   - Application status = REJECTED
   - Gig status = OPEN (unchanged)
   - Gig assignedSpecialistId = null (unchanged)
2. **Rejection does not affect other applications** - Create gig with 2 PENDING applications, reject one, verify:
   - Rejected application status = REJECTED
   - Other application status = PENDING (unchanged)
   - Gig status = OPEN
3. **Only gig owner can reject** - Create CLIENT who doesn't own gig, attempt to reject, expect error "Only the gig owner can manage applications."
4. **Only CLIENT role can reject** - Create SPECIALIST, attempt to reject, expect error "Only clients can manage applications."
5. **Cannot reject non-PENDING application** - Create ACCEPTED application, attempt to reject, expect error "This application is no longer pending."
6. **Cannot reject non-existent application** - Use invalid applicationId, expect error "Application not found."

**Test Plan:**
```bash
npm run test:unit -- application-flow
```
- All 6 scenarios pass
- Gig status remains unchanged after rejection
- Other applications are not affected
- Authorization checks prevent unauthorized access

---

## Task 7: Run full test suite and validate coverage ✅ COMPLETE
**Implementation:**
- Run all tests: `npm run test:unit -- application-flow`
- Run with coverage: `npm run test:coverage -- application-flow`
- Verify all scenarios from archived specs are covered
- Count total test scenarios and compare to spec requirements

**Test Plan:**
```bash
npm run test:unit -- application-flow
npm run test:coverage -- application-flow
```
- All tests pass consistently
- Coverage includes:
  - 16 application submission scenarios (validation + status + authorization)
  - 8 application acceptance scenarios (including race condition protection)
  - 6 application rejection scenarios
  - Total: 30 test scenarios
- All scenarios from specialist-gig-browsing, application-management, and structured-application-fields specs are covered
- No flaky tests (run multiple times to verify)

---

## Task 8: Document test suite and update project ✅ COMPLETE
**Implementation:**
- Add summary comment at top of test file explaining coverage
- Update project.md "Completed Changes" section if needed
- Create VALIDATION_REPORT.md documenting test results

**Test Plan:**
- Test file has clear documentation
- All tests pass in CI/local environments
- Coverage report shows comprehensive validation of application flow
