# Change Proposal: Service Fee Fix

## Change ID
`service-fee-fix`

## Status
Proposed

## Problem Statement

There is a **critical discrepancy** between documentation and implementation regarding the platform service fee:

- **Documentation** (`openspec/project.md`): States the service fee is **10%** of the gig budget
- **Code Implementation**: Calculates service fee as **20%** of the gig budget
- **Impact**: Clients are being **overcharged by 10%** on every gig

### Evidence of Discrepancy

**Documentation (project.md, lines 61-63):**
> The platform currently uses a **10% fee on top of the gig budget**, charged to the Client. The Specialist sees and receives the full budget amount.

**Code Implementation (app/actions/gig.ts, line 44):**
```typescript
const serviceFee = Math.floor(budgetKopecks * 0.20)  // 20%!
```

**Additional Locations with 20% Implementation:**
- `app/dashboard/gigs/new/gig-form.tsx` (line 39): Client-side fee preview
- `prisma/seed.ts` (lines 33, 61, 89, 117, 145): All example gigs
- `openspec/specs/gig/spec.md`: Spec incorrectly documents 20%
- `__tests__/integration/gig-creation.test.ts`: Tests validate 20% (documents the inconsistency)

### Business Impact

1. **Financial**: Clients pay 20% instead of 10%, resulting in overcharging
2. **Trust**: Discrepancy between stated and actual fees damages credibility
3. **Legal**: Charging more than documented could have legal implications
4. **User Experience**: Clients may notice the discrepancy and lose trust

### Example Impact

For a 100,000 ₽ gig:
- **Documented fee (10%)**: 10,000 ₽ → Total: 110,000 ₽
- **Actual fee (20%)**: 20,000 ₽ → Total: 120,000 ₽
- **Overcharge**: 10,000 ₽ per gig

## Proposed Solution

**Update code to match documentation: Change service fee from 20% to 10%**

### Rationale for Choosing 10% (Not 20%)

1. **Documentation is authoritative**: `project.md` is the source of truth for business rules
2. **Client expectations**: Documentation is what clients see and agree to
3. **Market positioning**: 10% is more competitive and aligns with "not a useless middleman" philosophy
4. **Explicit statement**: Project.md states "Service fee is currently set to 10% for simplicity"

### Scope

This change affects:
1. **Server-side calculation** (`app/actions/gig.ts`)
2. **Client-side preview** (`app/dashboard/gigs/new/gig-form.tsx`)
3. **Seed data** (`prisma/seed.ts`)
4. **Specifications** (`openspec/specs/gig/spec.md`)
5. **Tests** (integration and E2E tests)
6. **UI text** (if any mentions "20%")

### Non-Goals

- This change does NOT affect existing gigs in the database (no data migration)
- This change does NOT introduce variable fee rates (remains fixed at 10%)
- This change does NOT add fee configuration (hardcoded constant)

## Constraints

1. **No breaking changes**: The calculation logic signature remains the same
2. **Backward compatibility**: Existing gigs retain their original fee calculations
3. **Test coverage**: All affected tests MUST be updated to validate 10%
4. **Consistency**: ALL occurrences of 0.20 related to service fee MUST be changed to 0.10

## Risks & Mitigations

### Risk 1: Missed Occurrences
**Risk**: Some hardcoded 0.20 values might be missed
**Mitigation**: Comprehensive grep search for all variations (0.20, 20%, serviceFee)

### Risk 2: Test Failures
**Risk**: Tests expecting 20% will fail
**Mitigation**: Update all test assertions to expect 10% calculations

### Risk 3: Existing Gigs
**Risk**: Confusion about existing gigs with 20% fee
**Mitigation**: Document that this is forward-looking; existing gigs are unaffected

## Success Criteria

1. All service fee calculations use 10% (0.10)
2. Client-side preview shows correct 10% fee
3. All example gigs in seed data use 10% fee
4. Specification documents 10% fee
5. All tests pass with 10% expectations
6. No UI text mentions "20%" in relation to service fee
7. Comprehensive grep verification returns zero service-fee-related 20% references:
   ```bash
   # Search for service/fee combined with 20 or 0.20
   git grep -iE '(service|fee).*(20%|0\.20|20 percent)' | wc -l
   # Expected: 0

   # Search for 0.20 in TypeScript/JavaScript files (fee calculations)
   git grep -E '0\.20' -- '*.ts' '*.tsx' '*.js' | wc -l
   # Expected: 0 (or only non-fee-related occurrences)

   # Search for "20%" in documentation and specs
   git grep -i '20%' -- 'openspec/**/*.md' | wc -l
   # Expected: 0 (in service fee context)
   ```

## Validation Plan

1. **Unit tests**: Verify fee calculation logic returns 10%
2. **Integration tests**: Verify gig creation stores correct serviceFee
3. **E2E tests**: Verify UI displays correct fee preview
4. **Manual testing**: Create a test gig and verify total amount
5. **Code review**: Verify all 0.20 → 0.10 changes are correct
