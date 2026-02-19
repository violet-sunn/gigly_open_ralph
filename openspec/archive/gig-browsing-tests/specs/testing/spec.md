# Testing Specification Delta: Gig Browsing, Filtering, and Detail View Tests

## ADDED Requirements

### Requirement: Gig Browsing Integration Tests

The platform SHALL provide comprehensive integration tests for gig browsing functionality covering role-based access, data display, and empty states.

#### Scenario: SPECIALIST browses OPEN gigs

**Given** a SPECIALIST user is authenticated
**And** multiple gigs exist with different statuses (OPEN, IN_PROGRESS, COMPLETED)
**When** the browsing logic is executed
**Then** only gigs with status "OPEN" SHALL be returned
**And** each gig SHALL include title, description, budget, tags, and client information
**And** gigs SHALL be ordered by createdAt descending (newest first)

**Acceptance Criteria**:
- Test creates gigs with various statuses
- Query filters for status: 'OPEN' only
- Verify returned gigs match expected count
- Verify gig data structure includes all required fields
- Run test: `npm run test:unit` passes

#### Scenario: CLIENT browses all their gigs

**Given** a CLIENT user is authenticated
**And** the CLIENT owns multiple gigs with different statuses
**When** the CLIENT's gig list is queried
**Then** all gigs owned by the CLIENT SHALL be returned regardless of status
**And** gigs SHALL include application count

**Acceptance Criteria**:
- Test creates CLIENT user with multiple gigs
- Query filters by clientId
- Verify all statuses are included
- Verify application count is accurate
- Run test: verify correct gig count and data

#### Scenario: Empty gig list

**Given** a SPECIALIST user is authenticated
**And** no OPEN gigs exist in the database
**When** the browsing logic is executed
**Then** an empty array SHALL be returned
**And** no errors SHALL occur

**Acceptance Criteria**:
- Test with empty database (no gigs)
- Verify empty array returned
- Verify no exceptions thrown
- Run test: passes without errors

#### Scenario: Gig includes client information

**Given** a gig exists with an associated client
**When** the gig is queried for browsing
**Then** the client's company name SHALL be included
**And** the client's email SHALL be included (if profile exists)

**Acceptance Criteria**:
- Test creates gig with client profile
- Query includes client relation
- Verify client data is present in result
- Run test: verify client fields populated

---

### Requirement: Gig Filtering Integration Tests

The platform SHALL provide comprehensive integration tests for gig filtering functionality covering text search, tag filtering, budget range, sorting, and combined filters.

#### Scenario: Text search filters by title (case-insensitive)

**Given** multiple gigs exist with different titles
**And** one gig has title "React Developer Needed"
**When** filtering with search parameter "react"
**Then** the gig with "React" in title SHALL be returned
**And** search SHALL be case-insensitive

**Acceptance Criteria**:
- Test creates gigs with various titles
- Apply search filter with lowercase "react"
- Verify gig with "React" in title is returned
- Verify case-insensitive matching works
- Run test: `npm run test:unit` passes

#### Scenario: Text search filters by description (case-insensitive)

**Given** multiple gigs exist with different descriptions
**And** one gig has "Python" in description but not in title
**When** filtering with search parameter "python"
**Then** the gig with "Python" in description SHALL be returned

**Acceptance Criteria**:
- Test creates gigs with "Python" only in description
- Apply search filter "python"
- Verify gig is found via description match
- Run test: verify correct gig returned

#### Scenario: Tag filtering with single tag

**Given** multiple gigs exist with different tags
**And** one gig has tags "React,TypeScript"
**When** filtering with tag parameter "React"
**Then** the gig with "React" tag SHALL be returned

**Acceptance Criteria**:
- Test creates gigs with various tags
- Apply single tag filter
- Verify gigs with matching tag are returned
- Run test: verify correct filtering

#### Scenario: Tag filtering with multiple tags (OR logic)

**Given** multiple gigs exist with different tags
**And** gig A has tags "React,TypeScript"
**And** gig B has tags "Python,Django"
**When** filtering with tags "React,Python"
**Then** both gig A and gig B SHALL be returned
**And** gigs without either tag SHALL NOT be returned

**Acceptance Criteria**:
- Test creates gigs with different tag combinations
- Apply multiple tag filter
- Verify OR logic: gigs matching ANY tag are returned
- Verify gigs without any matching tags are excluded
- Run test: verify correct gig set returned

#### Scenario: Budget range filtering (minimum only)

**Given** multiple gigs exist with budgets 50000, 100000, 150000 (in kopecks)
**When** filtering with minBudget 100000 (kopecks)
**Then** only gigs with budget >= 100000 SHALL be returned

**Acceptance Criteria**:
- Test creates gigs with various budgets
- Apply minBudget filter
- Verify only gigs meeting minimum are returned
- Run test: verify budget filtering works

#### Scenario: Budget range filtering (maximum only)

**Given** multiple gigs exist with budgets 50000, 100000, 150000 (in kopecks)
**When** filtering with maxBudget 100000 (kopecks)
**Then** only gigs with budget <= 100000 SHALL be returned

**Acceptance Criteria**:
- Test creates gigs with various budgets
- Apply maxBudget filter
- Verify only gigs meeting maximum are returned
- Run test: verify budget filtering works

#### Scenario: Budget range filtering (both min and max)

**Given** multiple gigs exist with budgets 50000, 100000, 150000, 200000 (in kopecks)
**When** filtering with minBudget 100000 and maxBudget 150000
**Then** only gigs with budget >= 100000 AND budget <= 150000 SHALL be returned

**Acceptance Criteria**:
- Test creates gigs with various budgets
- Apply both min and max budget filters
- Verify only gigs in range are returned
- Run test: verify range filtering works

#### Scenario: Budget filter currency conversion (RUB → kopecks)

**Given** multiple gigs exist with budgets stored in kopecks:
- Gig A: budget = 5000000 kopecks (50,000 RUB)
- Gig B: budget = 10000000 kopecks (100,000 RUB)
- Gig C: budget = 15000000 kopecks (150,000 RUB)
**When** filtering with minBudget parameter in RUB (e.g., minBudget=100000 RUB)
**Then** the filter MUST convert RUB to kopecks before querying (100000 RUB × 100 = 10000000 kopecks)
**And** only gigs with budget >= 10000000 kopecks SHALL be returned (Gig B and Gig C)
**And** Gig A (5000000 kopecks) SHALL NOT be returned

**Acceptance Criteria**:
- Test creates gigs with budgets in kopecks (DB storage format)
- Apply budget filter with value in RUB (user-facing format)
- Verify conversion: filter value × 100 before comparison
- Verify correct gigs are returned based on kopecks comparison
- **CRITICAL**: Test must catch bug where RUB is compared directly to kopecks (e.g., 100000 RUB compared to 5000000 kopecks would incorrectly exclude Gig A)
- Run test: verify currency conversion is correct

#### Scenario: Sort by newest first (default)

**Given** multiple gigs exist created at different times
**When** no sort parameter is provided OR sort is "newest"
**Then** gigs SHALL be ordered by createdAt descending

**Acceptance Criteria**:
- Test creates gigs with different timestamps
- Query without sort parameter
- Verify gigs are in descending createdAt order
- Run test: verify default sorting

#### Scenario: Sort by highest budget

**Given** multiple gigs exist with budgets 50000, 100000, 150000
**When** sorting with parameter "budget-desc"
**Then** gigs SHALL be ordered by budget descending (150000, 100000, 50000)

**Acceptance Criteria**:
- Test creates gigs with various budgets
- Apply sort "budget-desc"
- Verify gigs are in descending budget order
- Run test: verify sorting works

#### Scenario: Sort by lowest budget

**Given** multiple gigs exist with budgets 50000, 100000, 150000
**When** sorting with parameter "budget-asc"
**Then** gigs SHALL be ordered by budget ascending (50000, 100000, 150000)

**Acceptance Criteria**:
- Test creates gigs with various budgets
- Apply sort "budget-asc"
- Verify gigs are in ascending budget order
- Run test: verify sorting works

#### Scenario: Combined filters with AND logic

**Given** multiple gigs exist with various attributes
**And** gig A: title "React Developer", tags "React,TypeScript", budget 150000
**And** gig B: title "Python Backend", tags "Python,Django", budget 120000
**And** gig C: title "React Frontend", tags "React,CSS", budget 80000
**When** filtering with search "React", tags "React", minBudget 100000
**Then** only gig A SHALL be returned
**And** gig C SHALL be excluded (budget too low)
**And** gig B SHALL be excluded (no "React" in title/description)

**Acceptance Criteria**:
- Test creates gigs with specific combinations
- Apply multiple filters simultaneously
- Verify AND logic between filter types
- Verify OR logic within tag filter
- Run test: verify complex filtering works

#### Scenario: Invalid filter parameters are ignored

**Given** gigs exist in the database
**When** filtering with invalid parameters (minBudget: "invalid", maxBudget: -1000)
**Then** invalid parameters SHALL be ignored
**And** all OPEN gigs SHALL be returned with default sorting
**And** no errors SHALL occur

**Acceptance Criteria**:
- Test with invalid filter values
- Verify graceful handling (no exceptions)
- Verify fallback to default behavior
- Run test: passes without errors

---

### Requirement: Gig Detail View Integration Tests

The platform SHALL provide comprehensive integration tests for gig detail view functionality covering information display, role-based visibility, and authorization.

#### Scenario: Gig detail includes all basic information

**Given** a gig exists with complete data
**When** the gig detail is queried
**Then** the response SHALL include title, description, budget, serviceFee, totalAmount, status, tags, createdAt
**And** the response SHALL include client information

**Acceptance Criteria**:
- Test creates gig with all fields populated
- Query gig by ID with includes
- Verify all fields are present
- Run test: verify data structure

#### Scenario: Gig detail includes structured requirement fields

**Given** a gig exists with goal, deliverables, and constraints populated
**When** the gig detail is queried
**Then** the response SHALL include goal, deliverables, and constraints fields

**Acceptance Criteria**:
- Test creates gig with structured requirements
- Query gig detail
- Verify optional fields are included
- Run test: verify structured fields present

#### Scenario: Gig detail shows applications for owner

**Given** a CLIENT user owns a gig
**And** multiple SPECIALIST users have applied to the gig
**When** the owner queries the gig detail
**Then** the response SHALL include all applications
**And** each application SHALL include specialist information, approach, questions, status

**Acceptance Criteria**:
- Test creates gig with multiple applications
- Query as gig owner
- Verify applications are included
- Verify application data structure
- Run test: verify applications visible to owner

#### Scenario: Gig detail hides applications from non-owner

**Given** a gig exists with applications
**And** a user is NOT the gig owner
**When** the non-owner queries the gig detail
**Then** applications SHALL NOT be included in the response (or authorization check prevents access)

**Acceptance Criteria**:
- Test creates gig with applications
- Query as different user
- Verify applications are not exposed
- Run test: verify authorization works

#### Scenario: SPECIALIST can see if they already applied

**Given** a SPECIALIST user has applied to a gig
**When** the SPECIALIST queries the gig detail
**Then** the response SHALL indicate the SPECIALIST has already applied
**And** the SPECIALIST's application SHALL be included

**Acceptance Criteria**:
- Test creates application for specialist
- Query gig as same specialist
- Verify application status is retrievable
- Run test: verify specialist can see own application

#### Scenario: Gig detail shows messages for authorized users

**Given** a gig has an assigned specialist
**And** messages exist between client and specialist
**When** the gig owner OR assigned specialist queries the gig
**Then** messages SHALL be included in the response

**Acceptance Criteria**:
- Test creates gig with messages
- Query as owner and as assigned specialist
- Verify messages are included for both
- Run test: verify message visibility

#### Scenario: Gig detail hides messages from unauthorized users

**Given** a gig has messages
**And** a user is NOT the owner AND NOT the assigned specialist
**When** the unauthorized user queries the gig
**Then** messages SHALL NOT be included (or authorization prevents access)

**Acceptance Criteria**:
- Test creates gig with messages
- Query as unauthorized user
- Verify messages are not exposed
- Run test: verify authorization works

---

### Requirement: Gig Lifecycle Integration Tests

The platform SHALL provide comprehensive integration tests for gig state transitions covering the full lifecycle from OPEN to PAID.

#### Scenario: Transition OPEN → IN_PROGRESS on application acceptance

**Given** a gig with status "OPEN"
**And** a PENDING application exists
**When** the gig owner accepts the application
**Then** the gig status SHALL transition to "IN_PROGRESS"
**And** the gig assignedSpecialistId SHALL be set
**And** all other PENDING applications SHALL be auto-rejected

**Acceptance Criteria**:
- Test creates gig with multiple applications
- Call acceptApplication as owner
- Verify gig status is "IN_PROGRESS"
- Verify assignedSpecialistId is set
- Verify other applications are "REJECTED"
- Run test: `npm run test:unit` passes

#### Scenario: Transition IN_PROGRESS → REVIEW on work submission

**Given** a gig with status "IN_PROGRESS"
**And** a specialist is assigned
**When** the assigned specialist submits work
**Then** the gig status SHALL transition to "REVIEW"

**Acceptance Criteria**:
- Test creates gig in IN_PROGRESS state
- Call submitWork as assigned specialist
- Verify gig status is "REVIEW"
- Run test: verify transition works

#### Scenario: Transition REVIEW → COMPLETED on work approval

**Given** a gig with status "REVIEW"
**When** the gig owner approves the work
**Then** the gig status SHALL transition to "COMPLETED"

**Acceptance Criteria**:
- Test creates gig in REVIEW state
- Call approveWork as owner
- Verify gig status is "COMPLETED"
- Run test: verify transition works

#### Scenario: Transition COMPLETED → PAID on payment marking

**Given** a gig with status "COMPLETED"
**When** the gig owner marks the gig as paid
**Then** the gig status SHALL transition to "PAID"
**And** the paidAt timestamp SHALL be set

**Acceptance Criteria**:
- Test creates gig in COMPLETED state
- Call markAsPaid as owner
- Verify gig status is "PAID"
- Verify paidAt is set to current timestamp
- Run test: verify transition works

#### Scenario: Invalid transition is rejected (OPEN → REVIEW)

**Given** a gig with status "OPEN"
**When** attempting to transition directly to "REVIEW" (skipping IN_PROGRESS)
**Then** the operation SHALL fail with an error
**And** the gig status SHALL remain "OPEN"

**Acceptance Criteria**:
- Test creates gig in OPEN state
- Attempt invalid transition
- Verify error is returned
- Verify status unchanged
- Run test: verify validation works

#### Scenario: Non-owner cannot transition gig state

**Given** a gig owned by CLIENT A
**And** CLIENT B is authenticated
**When** CLIENT B attempts to accept an application or approve work
**Then** the operation SHALL fail with authorization error
**And** the gig state SHALL remain unchanged

**Acceptance Criteria**:
- Test creates gig owned by one client
- Attempt state transition as different client
- Verify authorization error
- Verify state unchanged
- Run test: verify authorization works

#### Scenario: Non-assigned specialist cannot submit work

**Given** a gig with assigned specialist A
**And** specialist B is authenticated
**When** specialist B attempts to submit work
**Then** the operation SHALL fail with authorization error
**And** the gig state SHALL remain unchanged

**Acceptance Criteria**:
- Test creates gig with assigned specialist
- Attempt submitWork as different specialist
- Verify authorization error
- Verify state unchanged
- Run test: verify authorization works

---

### Requirement: Test Data Quality and Realism

The platform SHALL use realistic Russian data in gig browsing and filtering tests to ensure tests reflect production scenarios.

#### Scenario: Tests use Russian gig titles and descriptions

**Given** test factories create gigs
**When** tests execute
**Then** gig titles SHALL be in Russian (e.g., "Разработка REST API")
**And** gig descriptions SHALL be in Russian

**Acceptance Criteria**:
- Use `generateRussianGigTitle()` in test factories
- Use `generateRussianGigDescription()` in test factories
- Verify test data is realistic
- Run test: verify Russian content is generated

#### Scenario: Tests use realistic budget values

**Given** test factories create gigs
**When** tests execute
**Then** budget values SHALL be realistic (e.g., 150000 kopecks = 1500 RUB)
**And** serviceFee SHALL be calculated correctly (20% of budget)

**Acceptance Criteria**:
- Use realistic budget ranges in tests
- Verify serviceFee calculation
- Run test: verify budget values are realistic

---

### Requirement: Test Coverage and Documentation

The platform SHALL achieve comprehensive test coverage for gig browsing, filtering, and detail view features.

#### Scenario: All spec scenarios are covered by tests

**Given** the archived change specs define scenarios
**When** test suites are executed
**Then** each scenario from the specs SHALL have a corresponding test
**And** test names SHALL clearly indicate which scenario is being tested

**Acceptance Criteria**:
- specialist-gig-browsing: 13+ scenarios covered
- gig-filtering-and-search: 15+ scenarios covered
- gig-detail-view: 7+ scenarios covered
- gig-lifecycle: 7+ scenarios covered
- Run test: `npm run test:unit` shows all tests passing
- Test coverage report shows high coverage for gig-related code

#### Scenario: Tests serve as documentation

**Given** a developer wants to understand gig browsing behavior
**When** they read the test files
**Then** test names and structure SHALL clearly document expected behavior
**And** tests SHALL include comments explaining complex scenarios

**Acceptance Criteria**:
- Test names use descriptive language
- Complex tests include explanatory comments
- Test structure follows TESTING.md patterns
- Tests are organized by feature area
