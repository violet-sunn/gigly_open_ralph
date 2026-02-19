# Implementation Tasks

## Task 1: Set up test file structure and imports

**Implementation:**
- Create `__tests__/integration/gig-creation.test.ts`
- Import required dependencies: vitest, test helpers, server actions
- Set up mocks for `@/lib/prisma`, `next/headers`, and `next/navigation`
- Add beforeEach/afterEach hooks to clear session state

**Test Plan:**
- Verify file structure follows patterns from TESTING.md
- Ensure mocks are configured correctly
- Run empty test suite to verify setup

**Acceptance:**
- Test file runs without errors
- Mocks are properly configured
- Session state is isolated between tests

---

## Task 2: Test required field validation

**Implementation:**
Write tests for the following scenarios:
- Create gig with all required fields (happy path)
- Reject gig with missing title
- Reject gig with missing description
- Reject gig with missing acceptance criteria
- Reject gig with missing budget
- Reject gig with whitespace-only title
- Reject gig with whitespace-only description
- Reject gig with whitespace-only acceptance criteria

**Test Plan:**
```typescript
describe('Required field validation', () => {
  it('creates gig with all required fields', async () => {
    // Use withTestTransaction and withAuthContext
    // Create CLIENT user
    // Submit valid FormData
    // Verify gig created in database
    // Verify redirect to /dashboard
  })

  it('rejects gig with missing title', async () => {
    // Submit FormData without title
    // Expect error: "Title, description, and acceptance criteria are required."
    // Verify no gig created
  })

  // ... similar tests for other required fields
})
```

**Acceptance:**
- All 8 tests pass
- Error messages match exactly
- No gigs created when validation fails
- Gig created successfully with valid data

---

## Task 3: Test acceptance criteria length validation

**Implementation:**
Write tests for:
- Accept acceptance criteria with exactly 50 characters
- Accept acceptance criteria with more than 50 characters (e.g., 100)
- Reject acceptance criteria with 49 characters
- Reject acceptance criteria with very short text (e.g., 10 characters)

**Test Plan:**
```typescript
describe('Acceptance criteria validation', () => {
  it('accepts acceptance criteria with exactly 50 characters', async () => {
    const criteria = 'a'.repeat(50)
    // Submit with this criteria
    // Verify gig created
  })

  it('rejects acceptance criteria with 49 characters', async () => {
    const criteria = 'a'.repeat(49)
    // Submit with this criteria
    // Expect error: "Acceptance criteria must be at least 50 characters."
  })
})
```

**Acceptance:**
- All 4 tests pass
- Boundary condition (50 chars) works correctly
- Error message matches exactly

---

## Task 4: Test budget validation and conversion

**Implementation:**
Write tests for:
- Accept valid positive budget (e.g., 100000 roubles)
- Accept budget with decimal places (e.g., 100000.50)
- Verify conversion to kopecks (multiply by 100, round)
- Reject zero budget
- Reject negative budget
- Reject non-numeric budget (e.g., "abc")
- Reject empty budget string

**Test Plan:**
```typescript
describe('Budget validation', () => {
  it('accepts valid positive budget and converts to kopecks', async () => {
    // Submit budget "100000"
    // Verify gig.budget === 10000000 (kopecks)
  })

  it('accepts budget with decimals and rounds correctly', async () => {
    // Submit budget "100000.50"
    // Verify gig.budget === 10000050
  })

  it('rejects zero budget', async () => {
    // Submit budget "0"
    // Expect error: "Budget must be a positive number."
  })

  it('rejects negative budget', async () => {
    // Submit budget "-50000"
    // Expect error
  })

  it('rejects non-numeric budget', async () => {
    // Submit budget "not-a-number"
    // Expect error
  })
})
```

**Acceptance:**
- All 7 tests pass
- Budget conversion is accurate
- All invalid budgets are rejected with correct error

---

## Task 5: Test service fee and total amount calculation

**CRITICAL NOTE:** The current implementation uses 20% service fee (`app/actions/gig.ts` line 44), which contradicts the documented 10% standard in `project.md` and `lib/utils/currency.ts`. These tests validate the ACTUAL implementation (20%). This inconsistency should be flagged for resolution in a separate change.

**Implementation:**
Write tests for:
- Service fee is 20% of budget (floored) - matching current implementation
- Total amount equals budget + service fee
- Calculations work for various budget amounts
- Verify all three values stored correctly in database

**Test Plan:**
```typescript
describe('Service fee calculation', () => {
  it('calculates 20% service fee correctly (current implementation)', async () => {
    // Create gig with budget 100000 roubles (10000000 kopecks)
    // Verify serviceFee === 2000000 (20% of 10000000)
    // Verify totalAmount === 12000000
    // NOTE: This tests actual implementation, not documented 10% standard
  })

  it('floors service fee to nearest kopeck', async () => {
    // Use budget that creates fractional kopecks
    // Verify serviceFee is floored
  })

  it('stores all monetary values correctly', async () => {
    // Create gig
    // Fetch from database
    // Verify budget, serviceFee, totalAmount all match expected
  })
})
```

**Acceptance:**
- All 3 tests pass
- Service fee calculation is accurate (20%, floored) - matching actual implementation
- Total amount is always budget + serviceFee
- Tests document the 20% vs 10% inconsistency in comments

---

## Task 6: Test default values

**Implementation:**
Write tests for:
- New gig has status "OPEN"
- Empty tags default to empty string
- Timestamps (createdAt, updatedAt) are set
- assignedSpecialistId is null
- closedByAdmin is false
- isExample is false

**Test Plan:**
```typescript
describe('Default values', () => {
  it('sets status to OPEN by default', async () => {
    // Create gig
    // Verify gig.status === 'OPEN'
  })

  it('handles empty tags correctly', async () => {
    // Create gig without tags
    // Verify gig.tags === ''
  })

  it('sets timestamps correctly', async () => {
    // Create gig
    // Verify createdAt and updatedAt are defined
  })
})
```

**Acceptance:**
- All 3 tests pass
- Default values match schema defaults

---

## Task 7: Test tags storage

**Implementation:**
Write tests for:
- Store single tag
- Store multiple comma-separated tags
- Store empty tags (no tags provided)
- Outer whitespace is trimmed from tags string
- Inner whitespace around individual tags is preserved (current behavior)

**Test Plan:**
```typescript
describe('Tags storage', () => {
  it('stores single tag correctly', async () => {
    // Create gig with tags "React"
    // Verify gig.tags === 'React'
  })

  it('stores multiple tags correctly', async () => {
    // Create gig with tags "React,TypeScript,Node.js"
    // Verify gig.tags === 'React,TypeScript,Node.js'
  })

  it('stores empty tags as empty string', async () => {
    // Create gig without tags field
    // Verify gig.tags === ''
  })

  it('trims outer whitespace from tags string', async () => {
    // Create gig with tags "  React,TypeScript  "
    // Verify gig.tags === 'React,TypeScript' (outer whitespace removed)
  })

  it('preserves inner whitespace around individual tags (current behavior)', async () => {
    // Create gig with tags "React,  TypeScript , Node.js"
    // Verify gig.tags === 'React,  TypeScript , Node.js'
    // NOTE: Documents current behavior - individual tag normalization not implemented
  })
})
```

**Acceptance:**
- All 5 tests pass
- Tags stored with outer whitespace trimmed
- Inner whitespace preserved (documents current behavior)
- Tests highlight that individual tag normalization is not implemented

---

## Task 8: Test structured requirement fields

**Implementation:**
Write tests for:
- Create gig with all structured fields (goal, deliverables, constraints)
- Create gig without any structured fields (all default to empty string)
- Create gig with only some structured fields
- Verify optional fields don't affect gig creation

**Test Plan:**
```typescript
describe('Structured requirement fields', () => {
  it('stores all structured fields when provided', async () => {
    // Create gig with goal, deliverables, constraints
    // Verify all three stored correctly
  })

  it('defaults structured fields to empty string when not provided', async () => {
    // Create gig without goal, deliverables, constraints
    // Verify gig.goal === ''
    // Verify gig.deliverables === ''
    // Verify gig.constraints === ''
  })

  it('allows partial structured fields', async () => {
    // Create gig with only goal
    // Verify goal stored, others empty
  })
})
```

**Acceptance:**
- All 3 tests pass
- Structured fields are truly optional
- Empty strings stored when not provided

---

## Task 9: Test role authorization

**Implementation:**
Write tests for:
- CLIENT can create gigs
- SPECIALIST cannot create gigs
- Unauthenticated user redirected to login

**Test Plan:**
```typescript
describe('Role authorization', () => {
  it('allows CLIENT to create gigs', async () => {
    // Create CLIENT user
    // Create gig successfully
  })

  it('rejects SPECIALIST creating gigs', async () => {
    // Create SPECIALIST user
    // Attempt to create gig
    // Expect error: "Only clients can create gigs."
  })

  it('redirects unauthenticated user to login', async () => {
    // No auth context
    // Attempt to create gig
    // Expect redirect to /login
  })
})
```

**Acceptance:**
- All 3 tests pass
- Only CLIENT role can create gigs
- Proper error messages and redirects

---

## Task 10: Test gig ownership

**Implementation:**
Write tests for:
- Gig clientId matches authenticated user ID
- Gig appears in client's gig list
- Different clients create separate gigs

**Test Plan:**
```typescript
describe('Gig ownership', () => {
  it('sets clientId to authenticated user', async () => {
    // Create CLIENT with known ID
    // Create gig
    // Verify gig.clientId === client.id
  })

  it('allows multiple clients to create separate gigs', async () => {
    // Create two CLIENT users
    // Each creates a gig
    // Verify each gig has correct clientId
  })
})
```

**Acceptance:**
- All 2 tests pass
- Gig ownership is correctly assigned

---

## Task 11: Test whitespace handling

**Implementation:**
Write tests for:
- Whitespace trimmed from title
- Whitespace trimmed from description
- Whitespace trimmed from acceptance criteria
- Whitespace trimmed from structured fields
- Whitespace-only fields treated as empty

**Test Plan:**
```typescript
describe('Whitespace handling', () => {
  it('trims whitespace from title', async () => {
    // Submit title "  Test Gig  "
    // Verify stored as "Test Gig"
  })

  it('treats whitespace-only title as empty', async () => {
    // Submit title "   "
    // Expect error: required field
  })

  // Similar tests for other fields
})
```

**Acceptance:**
- All 5 tests pass
- Whitespace correctly trimmed
- Whitespace-only treated as empty

---

## Task 12: Run full test suite and verify coverage

**Implementation:**
- Run all tests: `npm run test:unit -- gig-creation.test.ts`
- Verify all tests pass
- Check test coverage for `app/actions/gig.ts` createGig function
- Ensure all scenarios from spec are covered

**Test Plan:**
- Execute: `npm run test:unit -- gig-creation.test.ts`
- All tests should pass
- No flaky tests
- Coverage report shows high coverage for createGig

**Acceptance:**
- All tests pass consistently
- Test suite covers all requirements from spec.md
- No gaps in test coverage
- Tests are deterministic and isolated
