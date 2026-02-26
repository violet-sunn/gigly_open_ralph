# Implementation Tasks: Restrict Browse Gigs to Specialists

## Task 1: Create dedicated example gigs page
**File:** `app/dashboard/gigs/examples/page.tsx` (new file)

**Implementation:**
Create a new server component that displays only example gigs, accessible to both CLIENT and SPECIALIST roles.

**Code structure:**
```typescript
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

function formatRoubles(kopecks: number): string {
  return new Intl.NumberFormat('ru-RU').format(kopecks / 100)
}

export default async function ExampleGigsPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  // No role check - accessible to both CLIENT and SPECIALIST

  const exampleGigs = await prisma.gig.findMany({
    where: {
      isExample: true,
      status: 'OPEN'
    },
    orderBy: { createdAt: 'desc' },
    include: {
      client: {
        select: {
          email: true,
          clientProfile: true
        }
      }
    },
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Example Gigs</h2>
          <p className="mt-2 text-sm text-gray-600">
            These are example gigs to help you understand what makes a good gig description.
            Use them as inspiration when creating your own gigs.
          </p>
        </div>

        {exampleGigs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-sm text-gray-500">No example gigs available.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {exampleGigs.map((gig) => (
              <li key={gig.id}>
                <Link
                  href={`/dashboard/gigs/${gig.id}?from=examples`}
                  className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">{gig.title}</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        ✨ Example
                      </span>
                    </div>
                    <span className="text-sm font-medium text-green-700">{formatRoubles(gig.budget)} ₽</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{gig.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex gap-2">
                      {gig.tags && gig.tags.split(',').map((tag) => tag.trim()).filter(Boolean).map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">{gig.createdAt.toLocaleDateString('ru-RU')}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
```

**Key points:**
- No role-based access control (accessible to both roles)
- Query filters by `isExample: true` and `status: 'OPEN'`
- No pagination (small number of example gigs)
- Styling matches existing browse page
- Each gig links to detail page with `?from=examples` parameter

**Test plan:**
- Manual test: Login as CLIENT user, navigate to `/dashboard/gigs/examples`
- Verify page loads and displays example gigs
- Manual test: Login as SPECIALIST user, navigate to `/dashboard/gigs/examples`
- Verify page loads and displays same example gigs
- Click on an example gig and verify detail page loads
- Verify all 5 example gigs from seed data are displayed

---

## Task 2: Add role-based access control to gig browse page
**File:** `app/dashboard/gigs/page.tsx`

**Implementation:**
- After session check, add role validation
- If `session.role === 'CLIENT'`, redirect to `/dashboard?error=browse-gigs-specialists-only`
- Use Next.js `redirect()` function
- Place check immediately after authentication check, before any database queries

**Code location:**
```typescript
// After line 21: if (!session) redirect('/login')
// Add:
if (session.role === 'CLIENT') {
  redirect('/dashboard?error=browse-gigs-specialists-only')
}
```

**Test plan:**
- Manual test: Login as CLIENT user, navigate to `/dashboard/gigs`
- Verify redirect to `/dashboard` occurs
- Verify URL contains `?error=browse-gigs-specialists-only`
- Manual test: Login as SPECIALIST user, navigate to `/dashboard/gigs`
- Verify page loads normally with gig list
- Verify example gigs are visible in the list

---

## Task 3: Update gig creation form link to point to examples page
**File:** `app/dashboard/gigs/new/gig-form.tsx`

**Implementation:**
Find the link in the "Requirements & Success Criteria" section header and update the href.

**Code change:**
```typescript
// Find this line (around line 200-250):
<Link href="/dashboard/gigs" target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:text-indigo-800 underline">
  💡 View example gigs for inspiration
</Link>

// Change to:
<Link href="/dashboard/gigs/examples" target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:text-indigo-800 underline">
  💡 View example gigs for inspiration
</Link>
```

**Test plan:**
- Manual test: Login as CLIENT user, navigate to `/dashboard/gigs/new`
- Click "💡 View example gigs for inspiration" link
- Verify new tab opens to `/dashboard/gigs/examples`
- Verify example gigs page displays correctly
- Verify no error message is shown
- Close new tab and verify gig creation form is still intact (form state preserved)

---

## Task 4: Add error message display to dashboard
**File:** `app/dashboard/page.tsx`

**Implementation:**
- Update function signature to accept `searchParams`
- Extract `error` query parameter
- Map error codes to user-friendly messages
- Display error message in a dismissible alert banner (yellow/warning style)
- Position banner above role-specific dashboard content

**Code changes:**
1. Update function signature:
```typescript
export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
```

2. Extract and map error parameter (add after session check):
```typescript
const params = await searchParams
const errorParam = typeof params.error === 'string' ? params.error : undefined

const errorMessages: Record<string, string> = {
  'browse-gigs-specialists-only': 'Browse Gigs is only available for specialists. As a client, you can post gigs and manage applications. To view example gigs, visit the Examples page.',
}

const errorMessage = errorParam ? errorMessages[errorParam] : null
```

3. Add error banner in JSX (after line 86 for CLIENT, after line 148 for SPECIALIST):
```typescript
{errorMessage && (
  <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
    <p className="text-sm text-yellow-800">{errorMessage}</p>
  </div>
)}
```

**Test plan:**
- Navigate to `/dashboard?error=browse-gigs-specialists-only` as CLIENT
- Verify error message displays correctly
- Verify message styling matches profile completion hint
- Navigate to `/dashboard` without error parameter
- Verify no error message displays
- Test with invalid error code (e.g., `?error=invalid`)
- Verify no error message displays (graceful handling)

---

## Task 5: Add integration tests for example gigs page
**File:** `__tests__/integration/example-gigs-page.test.ts` (new file)

**Implementation:**
Create comprehensive integration tests covering:

1. **CLIENT access to example gigs page**
   - Login as CLIENT
   - Navigate to `/dashboard/gigs/examples`
   - Verify page loads successfully
   - Verify only example gigs are displayed
   - Verify no error message

2. **SPECIALIST access to example gigs page**
   - Login as SPECIALIST
   - Navigate to `/dashboard/gigs/examples`
   - Verify page loads successfully
   - Verify same example gigs as CLIENT

3. **Example gigs filtering**
   - Create test gigs with `isExample: true` and `isExample: false`
   - Verify only `isExample: true` gigs are displayed
   - Verify correct count

4. **Empty state**
   - Database with no example gigs
   - Verify "No example gigs available." message

**Test structure:**
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { prisma } from '@/lib/prisma'
import { getTestPrismaClient, withAuthContext, withTestTransaction } from '../helpers/test-helpers'

describe('Example Gigs Page', () => {
  describe('CLIENT access', () => {
    it('should allow CLIENT to view example gigs', async () => {
      // Test implementation
    })

    it('should display only example gigs', async () => {
      // Test implementation
    })
  })

  describe('SPECIALIST access', () => {
    it('should allow SPECIALIST to view example gigs', async () => {
      // Test implementation
    })
  })

  describe('Empty state', () => {
    it('should display empty message when no example gigs exist', async () => {
      // Test implementation
    })
  })
})
```

**Test plan:**
- Run `npm run test:unit` and verify all tests pass
- Verify test coverage includes new page logic
- Verify tests use existing test helpers

---

## Task 6: Add integration tests for browse page access control
**File:** `__tests__/integration/gig-browse-access.test.ts` (new file)

**Implementation:**
Create comprehensive integration tests covering:

1. **SPECIALIST access (positive case)**
   - Login as SPECIALIST
   - Navigate to `/dashboard/gigs`
   - Verify page loads successfully
   - Verify gig list is displayed (including example gigs)

2. **CLIENT redirect (negative case)**
   - Login as CLIENT
   - Attempt to navigate to `/dashboard/gigs`
   - Verify redirect to `/dashboard?error=browse-gigs-specialists-only`

3. **Unauthenticated redirect**
   - No session
   - Attempt to navigate to `/dashboard/gigs`
   - Verify redirect to `/login`

4. **Error message display**
   - Navigate to `/dashboard?error=browse-gigs-specialists-only` as CLIENT
   - Verify error message displays
   - Navigate to `/dashboard` without error param
   - Verify no error message

**Test structure:**
```typescript
describe('Gig Browse Page Access Control', () => {
  describe('SPECIALIST access', () => {
    it('should allow SPECIALIST to access browse page', async () => {
      // Test implementation
    })
  })

  describe('CLIENT access restriction', () => {
    it('should redirect CLIENT to dashboard with error', async () => {
      // Test implementation
    })

    it('should display error message on dashboard', async () => {
      // Test implementation
    })
  })

  describe('Unauthenticated access', () => {
    it('should redirect to login', async () => {
      // Test implementation
    })
  })
})
```

**Test plan:**
- Run `npm run test:unit` and verify all tests pass
- Verify test coverage includes new role check logic
- Verify tests use existing test helpers

---

## Task 7: Add E2E tests for complete user flows
**File:** `__tests__/e2e/gig-browse-access.spec.ts` (new file)

**Implementation:**
Create E2E tests using Playwright covering:

1. **CLIENT user flow with example gigs**
   - Register/login as CLIENT
   - Navigate to `/dashboard/gigs/new` (gig creation form)
   - Click "💡 View example gigs for inspiration" link
   - Verify new tab opens to `/dashboard/gigs/examples`
   - Verify example gigs are displayed
   - Verify no error message
   - Close tab and verify form is still intact

2. **CLIENT blocked from browse page**
   - Login as CLIENT
   - Attempt to navigate to `/dashboard/gigs` via URL bar
   - Verify redirect to `/dashboard`
   - Verify error message is visible

3. **SPECIALIST user flow**
   - Register/login as SPECIALIST
   - Navigate to `/dashboard/gigs`
   - Verify gig list displays (including example gigs)
   - Verify no error message
   - Navigate to `/dashboard/gigs/examples`
   - Verify example gigs page displays
   - Verify can navigate between both pages

**Test structure:**
```typescript
import { test, expect } from '@playwright/test'

test.describe('Gig Browse Access Control', () => {
  test('CLIENT can view example gigs from gig creation form', async ({ page, context }) => {
    // Test implementation with new tab handling
  })

  test('CLIENT cannot access main browse page', async ({ page }) => {
    // Test implementation
  })

  test('SPECIALIST can access both browse and examples pages', async ({ page }) => {
    // Test implementation
  })
})
```

**Test plan:**
- Run `npm run test:e2e` and verify all tests pass
- Verify tests cover both direct URL access and link navigation
- Verify new tab handling works correctly

---

## Task 8: Manual verification and documentation update
**Files:**
- Manual testing checklist
- Update `openspec/project.md` "Current State" section

**Implementation:**

**Manual testing checklist:**
1. ✅ Login as CLIENT user
2. ✅ Navigate to `/dashboard/gigs/examples`
3. ✅ Verify example gigs page displays correctly
4. ✅ Click on an example gig and verify detail page loads
5. ✅ Navigate to `/dashboard/gigs/new` (gig creation form)
6. ✅ Click "💡 View example gigs for inspiration" link
7. ✅ Verify new tab opens to `/dashboard/gigs/examples`
8. ✅ Verify no error message is shown
9. ✅ Close tab and verify form state is preserved
10. ✅ Navigate to `/dashboard/gigs` directly
11. ✅ Verify redirect to `/dashboard` with error message
12. ✅ Login as SPECIALIST user
13. ✅ Navigate to `/dashboard/gigs`
14. ✅ Verify gig list displays normally (including example gigs)
15. ✅ Verify pagination, filtering, and search work
16. ✅ Navigate to `/dashboard/gigs/examples`
17. ✅ Verify example gigs page displays
18. ✅ Click on a gig and verify detail page loads
19. ✅ Apply to a gig and verify application succeeds

**Documentation update:**
Update `openspec/project.md` "Completed Changes" section:
```markdown
31. **restrict-browse-gigs-to-specialists** — Role-based access control for gig browse page with dedicated example gigs page. Created `/dashboard/gigs/examples` page accessible to both CLIENT and SPECIALIST users for viewing example gigs. CLIENT users are redirected from `/dashboard/gigs` to dashboard with helpful error message. SPECIALIST users retain full access to main browse page. Updated gig creation form link to point to examples page, eliminating UX contradiction where users clicking "inspiration" link would see access error. Comprehensive test coverage with integration and E2E tests. Clean separation of concerns: `/dashboard/gigs` for specialists to find work, `/dashboard/gigs/examples` for everyone to learn from examples.
```

**Test plan:**
- Complete all manual testing steps
- Verify no regressions in existing functionality
- Verify error messages are clear and helpful
- Verify example gig workflow is smooth for both roles

---

## Summary

**Total tasks:** 8
**Estimated effort:** 3-4 hours
**Files modified:** 2 (`app/dashboard/gigs/page.tsx`, `app/dashboard/page.tsx`, `app/dashboard/gigs/new/gig-form.tsx`)
**Files created:** 1 page (`app/dashboard/gigs/examples/page.tsx`) + 3 test files
**Breaking changes:** None (only restricts unintended access and improves UX)
**Risk level:** Low (simple role check with new dedicated page for examples)
**UX improvement:** High (eliminates contradiction where "inspiration" link shows error)
