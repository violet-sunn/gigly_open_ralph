# Implementation Tasks

## Task 1: Add Missing Role Validation Tests to gig-authorization.test.ts

**Implementation Notes:**
- Open existing file: `__tests__/integration/gig-authorization.test.ts`
- Add 2 new test cases to fill role validation gaps:

**Test 1: CLIENT cannot submit work**
```typescript
it('CLIENT cannot submit work', async () => {
  // Gap-fill: Spec scenario "Non-SPECIALIST user attempts to submit work"
  const prisma = getTestPrismaClient()
  const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)

  const client = await prisma.user.create({
    data: {
      email: `client-${Date.now()}@example.com`,
      password: hashedPassword,
      role: 'CLIENT'
    }
  })

  const specialist = await prisma.user.create({
    data: {
      email: `specialist-${Date.now()}@example.com`,
      password: hashedPassword,
      role: 'SPECIALIST'
    }
  })

  const gig = await prisma.gig.create({
    data: {
      title: 'Test Gig',
      description: 'Description',
      acceptanceCriteria: 'Criteria',
      budget: 10000000,
      serviceFee: 2000000,
      totalAmount: 12000000,
      tags: 'React',
      clientId: client.id,
      status: 'IN_PROGRESS',
      assignedSpecialistId: specialist.id
    }
  })

  const formData = new FormData()
  formData.append('gigId', gig.id)

  await withAuthContext(client, async () => {
    const result = await submitWork(null, formData)
    expect(result).toEqual({ error: 'Only specialists can submit work.' })
  })

  // Verify gig status unchanged
  const unchangedGig = await prisma.gig.findUnique({ where: { id: gig.id } })
  expect(unchangedGig?.status).toBe('IN_PROGRESS')

  // Cleanup
  await prisma.gig.delete({ where: { id: gig.id } })
  await prisma.user.delete({ where: { id: client.id } })
  await prisma.user.delete({ where: { id: specialist.id } })
})
```

**Test 2: SPECIALIST cannot approve work**
```typescript
it('SPECIALIST cannot approve work', async () => {
  // Gap-fill: Spec scenario "Non-CLIENT user attempts to approve work"
  const prisma = getTestPrismaClient()
  const hashedPassword = await (await import('bcryptjs')).hash('password123', 10)

  const client = await prisma.user.create({
    data: {
      email: `client-${Date.now()}@example.com`,
      password: hashedPassword,
      role: 'CLIENT'
    }
  })

  const specialist = await prisma.user.create({
    data: {
      email: `specialist-${Date.now()}@example.com`,
      password: hashedPassword,
      role: 'SPECIALIST'
    }
  })

  const gig = await prisma.gig.create({
    data: {
      title: 'Test Gig',
      description: 'Description',
      acceptanceCriteria: 'Criteria',
      budget: 10000000,
      serviceFee: 2000000,
      totalAmount: 12000000,
      tags: 'React',
      clientId: client.id,
      status: 'REVIEW',
      assignedSpecialistId: specialist.id
    }
  })

  const formData = new FormData()
  formData.append('gigId', gig.id)

  await withAuthContext(specialist, async () => {
    const result = await approveWork(null, formData)
    expect(result).toEqual({ error: 'Only clients can approve work.' })
  })

  // Verify gig status unchanged
  const unchangedGig = await prisma.gig.findUnique({ where: { id: gig.id } })
  expect(unchangedGig?.status).toBe('REVIEW')

  // Cleanup
  await prisma.gig.delete({ where: { id: gig.id } })
  await prisma.user.delete({ where: { id: client.id } })
  await prisma.user.delete({ where: { id: specialist.id } })
})
```

**Test Plan:**
```bash
# Run gig-authorization tests
npm test gig-authorization.test.ts
```

**Test Assertions:**
- ✓ CLIENT user attempting submitWork returns exact error message
- ✓ SPECIALIST user attempting approveWork returns exact error message
- ✓ Gig status remains unchanged in both cases
- ✓ Tests follow existing patterns in the file
- ✓ All created data is cleaned up

---

## Task 2: Add Edge Case Tests to gig-authorization.test.ts

**Implementation Notes:**
- Continue in the same file: `__tests__/integration/gig-authorization.test.ts`
- Add 4 new test cases for edge cases:

**Test 3: Submit work on non-existent gig**
**Test 4: Approve work on non-existent gig**
**Test 5: Unauthenticated user redirected on submitWork**
**Test 6: Unauthenticated user redirected on approveWork**

- Follow the same pattern as existing tests
- Use exact error message matching: `expect(result).toEqual({ error: '...' })`
- For auth tests, verify redirect: `expect(error.message).toContain('NEXT_REDIRECT:/login')`

**Test Plan:**
```bash
# Run gig-authorization tests
npm test gig-authorization.test.ts
```

**Test Assertions:**
- ✓ Non-existent gig returns "Gig not found." error
- ✓ Unauthenticated users are redirected to /login
- ✓ Tests use exact error message matching
- ✓ All created data is cleaned up

---

## Task 3: Add State Validation Tests to gig-lifecycle.test.ts

**Implementation Notes:**
- Open existing file: `__tests__/integration/gig-lifecycle.test.ts`
- Add new `describe` block: "Invalid state transitions - Complete coverage"
- Add 5 new test cases to cover all invalid state combinations:

**Test 1: Cannot submit work on REVIEW gig**
**Test 2: Cannot submit work on COMPLETED gig**
**Test 3: Cannot submit work on PAID gig**
**Test 4: Cannot approve work on COMPLETED gig**
**Test 5: Cannot approve work on PAID gig**

- Note: Tests for "cannot submit on OPEN" and "cannot approve on OPEN/IN_PROGRESS" already exist
- Each test should:
  - Include comment: `// Gap-fill: Spec scenario "Submit/Approve work on [STATUS] gig"`
  - Create gig in the specific status
  - Attempt the invalid action
  - Verify exact error message
  - Verify status remains unchanged
  - Clean up data

**Example pattern:**
```typescript
it('cannot submit work on REVIEW gig', async () => {
  // Gap-fill: Spec scenario "Submit work on gig with wrong status"
  const prisma = getTestPrismaClient()

  const client = await createTestUser(prisma, { role: 'CLIENT' })
  const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

  const gig = await createTestGig(prisma, {
    clientId: client.id,
    status: 'REVIEW',
    assignedSpecialistId: specialist.id
  })

  const formData = new FormData()
  formData.append('gigId', gig.id)

  await withAuthContext(specialist, async () => {
    const result = await submitWork(null, formData)
    expect(result).toEqual({ error: 'Work can only be submitted for gigs in progress.' })
  })

  // Verify gig status unchanged
  const updatedGig = await prisma.gig.findUnique({ where: { id: gig.id } })
  expect(updatedGig!.status).toBe('REVIEW')

  // Cleanup
  await prisma.gig.delete({ where: { id: gig.id } })
  await prisma.user.delete({ where: { id: client.id } })
  await prisma.user.delete({ where: { id: specialist.id } })
})
```

**Test Plan:**
```bash
# Run gig-lifecycle tests
npm test gig-lifecycle.test.ts
```

**Test Assertions:**
- ✓ All 5 invalid state transitions return correct error messages
- ✓ Gig status remains unchanged in all cases
- ✓ Tests use exact error message matching
- ✓ Tests follow existing patterns in the file
- ✓ All created data is cleaned up

---

## Task 4: Verify Complete Coverage and No Regressions

**Implementation Notes:**
- Run full test suite to ensure no regressions
- Verify all new tests pass
- Check that existing tests still pass
- Review test coverage report
- Document coverage improvements

**Test Plan:**
```bash
# Run all tests
npm test

# Run specific test files
npm test gig-authorization.test.ts
npm test gig-lifecycle.test.ts

# Run with coverage
npm test -- --coverage
```

**Test Assertions:**
- ✓ All 11 new tests pass
- ✓ All existing tests continue to pass (no regressions)
- ✓ Coverage for submitWork and approveWork is complete
- ✓ All spec scenarios from archived spec are now covered
- ✓ Error messages match spec exactly

---

## Summary

**Total tasks:** 4
- Task 1: Add 2 role validation tests to gig-authorization.test.ts
- Task 2: Add 4 edge case tests to gig-authorization.test.ts
- Task 3: Add 5 state validation tests to gig-lifecycle.test.ts
- Task 4: Verify coverage and no regressions

**Total new test cases:** 11 (gap-filling tests only)

**Files modified:**
- `__tests__/integration/gig-authorization.test.ts` (6 new tests)
- `__tests__/integration/gig-lifecycle.test.ts` (5 new tests)

**Estimated complexity:** Low
- Tests follow existing patterns in the codebase
- No new test infrastructure needed
- Focus on filling specific coverage gaps
- Minimal risk of breaking existing tests

**Dependencies:**
- Existing test helpers and infrastructure
- Existing `submitWork` and `approveWork` implementations
- Archived `gig-work-submission-and-approval` spec for reference

**Success criteria:**
- All 11 new tests pass
- All existing tests continue to pass
- Complete coverage of all spec scenarios
- No test duplication or maintenance overhead
