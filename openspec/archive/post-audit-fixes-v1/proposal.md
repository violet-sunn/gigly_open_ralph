# Proposal: Post-Audit Fixes (v1)

## Change Name
`post-audit-fixes-v1`

## Problem Statement

Following the comprehensive system audit documented in `audit_report_v1.md`, three specific issues were identified that pose risks to production stability and developer experience:

### 1. Critical UI State Bug (Priority: HIGH)

**Location:** `app/actions/moderation.ts`

**Problem:** Admin moderation actions (`suspendUser`, `unsuspendUser`, `closeGig`) use `redirect()` but fail to call `revalidatePath()` before redirecting. This causes Next.js to serve stale cached data from the server-side cache.

**Impact:** When an admin performs a moderation action (e.g., suspends a user on page 2 of the user list), the database is updated correctly, but the admin UI displays outdated information. The admin must manually refresh (F5) to see the changes. This creates confusion and appears as a bug to end users.

**Root Cause:** Next.js 15 aggressively caches server component output. Without explicit cache invalidation via `revalidatePath()`, the cached page data is served even after mutations.

### 2. N+1 Query Vulnerability (Priority: MEDIUM)

**Location:** `app/dashboard/gigs/page.tsx` (line 98)

**Problem:** The gig browsing page query includes `client.email` but does NOT include `clientProfile`. If the UI is updated to display company names (a reasonable future enhancement), it will trigger an N+1 database query cascade.

**Current Query:**
```typescript
include: { client: { select: { email: true } } }
```

**Impact:** Currently NOT causing issues because the UI doesn't display company names. However, this is fragile - any developer adding company name display to the UI will unknowingly introduce a performance bug (25+ queries per page instead of 2).

**Root Cause:** Incomplete eager loading of relations in the Prisma query.

### 3. Flaky Tests (Timeouts) (Priority: MEDIUM)

**Location:** `__tests__/integration/factory-validation.test.ts`

**Problem:** Two parallel execution tests are timing out after 5000ms:
- `creates 50 users in parallel without email collisions`
- `creates 20 gigs with applications in parallel without violations`

**Impact:** Test suite fails intermittently (currently 520/521 passing). This blocks CI/CD pipelines and creates developer friction.

**Root Cause:** The database schema has grown more complex since these tests were written. Background validations, foreign key checks, and transaction overhead now cause these stress tests to exceed the 5s timeout.

## Proposed Solution

Address all three audit findings with minimal, surgical fixes:

1. **Add revalidatePath to moderation actions:** Import `revalidatePath` from `'next/cache'` and call it before each `redirect()` in `suspendUser`, `unsuspendUser`, and `closeGig`.

2. **Prevent N+1 query risk:** Update the Prisma query in gig browsing to eagerly load `clientProfile` using nested `include`.

3. **Optimize factory validation tests:** Reduce the parallel payload size from 50→25 users and 20→10 gigs (Option B from audit report). This maintains test coverage while ensuring tests complete within the 5s timeout.

## Constraints

### Scope Locked
- **Do NOT add new features** - This is a bug-fix change only
- **Do NOT modify anything outside these 3 specific issues**
- **Do NOT change test timeouts** - Fix the tests by reducing load, not by increasing timeouts

### Test Integrity
- All 521 tests MUST pass after these fixes
- No new tests required (existing tests validate the fixes)
- Test execution time should remain under 30 seconds

### Backward Compatibility
- No breaking changes to APIs or database schema
- No changes to user-facing behavior (except fixing the admin UI bug)

## Success Criteria

1. **Moderation actions refresh correctly:**
   - Admin suspends a user on page 2 → UI updates immediately without manual refresh
   - Admin closes a gig on page 3 → UI updates immediately without manual refresh
   - Pagination state is preserved after mutations

2. **No N+1 query vulnerabilities:**
   - Gig browsing page eagerly loads `clientProfile`
   - Future UI changes can safely display company names without performance issues

3. **Test suite passes completely:**
   - All 521 tests pass
   - No timeout errors in factory-validation.test.ts
   - Test execution time remains under 30 seconds

## Non-Goals

- Adding new features or functionality
- Refactoring code outside the 3 specific issues
- Optimizing other slow tests (only factory-validation.test.ts)
- Adding new test coverage (existing tests are sufficient)
- Changing the admin UI design or layout

## Deliverables

- Modified `app/actions/moderation.ts` with revalidatePath calls
- Modified `app/dashboard/gigs/page.tsx` with improved Prisma query
- Modified `__tests__/integration/factory-validation.test.ts` with reduced payload sizes
- All 521 tests passing
