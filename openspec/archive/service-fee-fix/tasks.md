# Implementation Tasks

## Task Checklist

### Task 1: Update Server-Side Fee Calculation
**File**: `app/actions/gig.ts`

**Implementation**:
- Locate line 44: `const serviceFee = Math.floor(budgetKopecks * 0.20)`
- Change to: `const serviceFee = Math.floor(budgetKopecks * 0.10)`
- Verify no other occurrences of 0.20 related to service fee in this file

**Test Plan**:
- Run integration tests: `npm run test:unit -- gig-creation.test.ts`
- Expected: Tests will initially FAIL (they expect 20%)
- After updating tests (Task 5), they should PASS

**Verification**:
```bash
# Verify the change
grep -n "serviceFee.*0\." app/actions/gig.ts
# Should show: const serviceFee = Math.floor(budgetKopecks * 0.10)
```

---

### Task 2: Update Client-Side Fee Preview
**File**: `app/dashboard/gigs/new/gig-form.tsx`

**Implementation**:
- Locate line 39: `const fee = showPreview ? Math.floor(budgetNum * 0.20) : 0`
- Change to: `const fee = showPreview ? Math.floor(budgetNum * 0.10) : 0`
- Verify the preview text doesn't mention "20%" anywhere

**Test Plan**:
- Manual test: Navigate to `/dashboard/gigs/new` (as CLIENT)
- Enter budget: 100000
- Expected preview:
  - Budget: 100 000 ₽
  - Service Fee (10%): 10 000 ₽
  - Total: 110 000 ₽
- Run E2E tests: `npm run test:e2e`

**Verification**:
```bash
# Verify the change
grep -n "Math.floor(budgetNum" app/dashboard/gigs/new/gig-form.tsx
# Should show: const fee = showPreview ? Math.floor(budgetNum * 0.10) : 0
```

---

### Task 3: Update Seed Data
**File**: `prisma/seed.ts`

**Implementation**:
- Update all 5 example gigs:
  - Line 33: `const gig1ServiceFee = Math.floor(gig1Budget * 0.20);` → `* 0.10`
  - Line 61: `const gig2ServiceFee = Math.floor(gig2Budget * 0.20);` → `* 0.10`
  - Line 89: `const gig3ServiceFee = Math.floor(gig3Budget * 0.20);` → `* 0.10`
  - Line 117: `const gig4ServiceFee = Math.floor(gig4Budget * 0.20);` → `* 0.10`
  - Line 145: `const gig5ServiceFee = Math.floor(gig5Budget * 0.20);` → `* 0.10`

**Test Plan**:
- Reset database and re-seed:
  ```bash
  npm run db:reset
  npm run db:seed
  ```
- Verify example gigs have correct fees:
  ```bash
  # Open Prisma Studio
  npx prisma studio
  # Check any example gig (isExample = true)
  # Verify: serviceFee = budget * 0.10
  # Verify: totalAmount = budget + serviceFee
  ```

**Verification**:
```bash
# Verify all changes
grep -n "ServiceFee.*0\." prisma/seed.ts
# Should show 5 lines, all with * 0.10
```

---

### Task 4: Update Main Gig Specification
**File**: `openspec/specs/gig/spec.md`

**Implementation**:
- Locate "Requirement: Fee Calculation" section (around line 79)
- Update line 80: "The system MUST calculate service fee as 20% of the budget."
  - Change to: "The system MUST calculate service fee as 10% of the budget."
- Update line 82-86 (Scenario: Fee calculation for 100,000 ₽ budget):
  - Change serviceFee from 2000000 to 1000000 kopecks
  - Change totalAmount from 12000000 to 11000000 kopecks
- Update line 88-92 (Scenario: Fee calculation rounds down):
  - Change serviceFee calculation from `Math.floor(33300 × 0.20) = 6660` to `Math.floor(33300 × 0.10) = 3330`
  - Change totalAmount from 39960 to 36630 kopecks
- Update line 95: Change `serviceFee = Math.floor(budgetKopecks * 0.20)` to `* 0.10`
- Update line 13: Change `serviceFee` = budget × 0.20` to `× 0.10`
- Update line 73: Change "Service fee is 20% of budget" to "Service fee is 10% of budget"

**Test Plan**:
- Review the specification document for consistency
- Ensure all scenarios reflect 10% calculations
- No mentions of "20%" should remain in fee-related contexts

**Verification**:
```bash
# Check for any remaining 20% references
grep -i "20%" openspec/specs/gig/spec.md
grep "0\.20" openspec/specs/gig/spec.md
# Should return no results related to service fee
```

---

### Task 5: Update Integration Tests
**File**: `__tests__/integration/gig-creation.test.ts`

**Implementation**:
- Locate test: "calculates service fee as 20% of budget" (around line 150)
  - Rename to: "calculates service fee as 10% of budget"
- Update all serviceFee assertions:
  - Find all `expect(gig.serviceFee).toBe(...)` assertions
  - Recalculate expected values using 10% formula
  - Example: If budget is 10000000 kopecks, serviceFee should be 1000000 (not 2000000)
- Update all totalAmount assertions:
  - Recalculate as: budget + (budget * 0.10)
- Check test comments that mention "20%" and update to "10%"

**Test Plan**:
- Run integration tests:
  ```bash
  npm run test:unit -- gig-creation.test.ts
  ```
- Expected: All 40 tests should PASS
- Verify the specific fee calculation test passes

**Verification**:
```bash
# Check for any remaining 20% references in tests
grep -i "20%" __tests__/integration/gig-creation.test.ts
grep "0\.20" __tests__/integration/gig-creation.test.ts
# Should return no results
```

---

### Task 6: Update E2E Tests
**File**: `__tests__/e2e/specialist-journey.spec.ts`

**Implementation**:
- Locate line 299: `expect(finalGig?.serviceFee).toBe(15000)`
- Determine the budget used in this test (look earlier in the test)
- Recalculate expected serviceFee as 10% of that budget
- Update the assertion with the correct value

**Test Plan**:
- Run E2E tests:
  ```bash
  npm run test:e2e
  ```
- Expected: All E2E tests should PASS
- Specifically verify the specialist journey test passes

**Verification**:
```bash
# Check for any remaining 20% references in E2E tests
grep -i "20%" __tests__/e2e/*.spec.ts
grep "0\.20" __tests__/e2e/*.spec.ts
# Should return no results related to service fee
```

---

### Task 7: Update Other Test Files (If Any)
**Files**: Check all test files for hardcoded fee expectations

**Implementation**:
- Search for other test files that might have hardcoded serviceFee values:
  ```bash
  grep -r "serviceFee" __tests__/ --include="*.ts" --include="*.tsx"
  grep -r "0\.20" __tests__/ --include="*.ts" --include="*.tsx"
  ```
- Update any found occurrences to use 10% calculations

**Test Plan**:
- Run full test suite:
  ```bash
  npm test
  ```
- Expected: All tests should PASS

---

### Task 8: Comprehensive Verification
**Goal**: Ensure no 20% references remain in the codebase

**Implementation**:
- Run comprehensive grep searches:
  ```bash
  # Search for 0.20 in source files
  grep -r "0\.20" app/ prisma/ --include="*.ts" --include="*.tsx"

  # Search for "20%" in all relevant files
  grep -r "20%" app/ prisma/ openspec/ __tests__/ --include="*.ts" --include="*.tsx" --include="*.md"

  # Search for serviceFee calculations
  grep -r "serviceFee.*\*" app/ prisma/ --include="*.ts" --include="*.tsx"
  ```
- Review each result to ensure it's not service-fee-related
- If any service-fee-related 20% references are found, update them

**Test Plan**:
- Run full test suite: `npm test`
- Run E2E tests: `npm run test:e2e`
- Expected: All tests PASS

---

### Task 9: Manual End-to-End Verification
**Goal**: Verify the fix works in the actual application

**Implementation**:
1. Start the development server: `npm run dev`
2. Register/login as a CLIENT user
3. Navigate to "Create Gig" page
4. Enter test data:
   - Title: "Test Gig for Fee Verification"
   - Description: "Testing 10% service fee calculation"
   - Acceptance Criteria: "Service fee should be exactly 10% of budget, not 20%"
   - Budget: 100000 (100,000 ₽)
5. Observe the fee preview:
   - Should show: Service Fee: 10 000 ₽
   - Should show: Total: 110 000 ₽
6. Submit the gig
7. Verify in database (Prisma Studio):
   - budget: 10000000 kopecks
   - serviceFee: 1000000 kopecks (10,000 ₽)
   - totalAmount: 11000000 kopecks (110,000 ₽)

**Test Plan**:
- Manual verification checklist:
  - [ ] Fee preview shows 10% in UI
  - [ ] Created gig has serviceFee = budget * 0.10
  - [ ] Created gig has totalAmount = budget + serviceFee
  - [ ] No console errors
  - [ ] Gig appears correctly in dashboard

---

### Task 10: Update Documentation (If Needed)
**Goal**: Ensure all documentation is consistent

**Implementation**:
- Review `openspec/project.md` - should already state 10% (no changes needed)
- Review `TESTING.md` - check if it mentions service fee calculations
- Review `README.md` - check if it mentions service fee
- Update any found references to ensure consistency

**Test Plan**:
- Read through documentation
- Verify no contradictions exist
- Verify 10% is consistently stated

---

## Summary

**Total Tasks**: 10
**Estimated Time**: 2-3 hours
**Risk Level**: Low (straightforward constant change)

**Critical Success Factors**:
1. All occurrences of 0.20 related to service fee are changed to 0.10
2. All tests are updated and passing
3. Manual verification confirms correct behavior
4. No regressions in other functionality
