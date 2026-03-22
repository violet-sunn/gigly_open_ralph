# Implementation Tasks: Add Loading Indicators

## Task 1: Audit all server actions and forms for loading state presence

**Implementation:**
- Create a comprehensive inventory of all server actions in `app/actions/`
- Identify all forms that call these server actions
- Document which forms already have loading states (using `useFormStatus()`)
- Document which forms are missing loading states
- Create a checklist of forms requiring updates

**Test Plan:**
```bash
# List all server action files
find app/actions -name "*.ts" -type f

# List all form components
find app -name "*form*.tsx" -o -name "*Form*.tsx" | grep -v node_modules

# Verify each form component for useFormStatus usage
grep -r "useFormStatus" app --include="*.tsx"
```

**Acceptance Criteria:**
- Complete list of all server actions documented
- Complete list of all forms documented
- Each form marked as "has loading state" or "missing loading state"
- Checklist created for implementation tasks

---

## Task 2: Add loading indicators to profile edit form

**Implementation:**
- Update `app/(protected)/profile/edit/ProfileEditForm.tsx` to use `useFormStatus()` hook
- Create a `SubmitButton` component that shows loading state
- Display "Saving profile..." text when `pending` is true
- Disable submit button when `pending` is true
- Ensure button styling matches existing design tokens

**Code Pattern:**
```tsx
function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex justify-center py-3 px-6 rounded-md text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Saving profile...' : 'Save Profile'}
    </button>
  )
}
```

**Test Plan:**
```typescript
// Integration test: __tests__/integration/profile-edit-loading.test.ts
describe('Profile Edit Loading States', () => {
  it('should show loading state during profile update', async () => {
    // Arrange: Create test user and authenticate
    // Act: Submit profile form
    // Assert: Button shows "Saving profile..." and is disabled
  })

  it('should prevent duplicate submissions', async () => {
    // Arrange: Create test user and authenticate
    // Act: Click submit button twice rapidly
    // Assert: Only one profile update occurs
  })
})
```

**E2E Test:**
```typescript
// __tests__/e2e/profile-edit-loading.spec.ts
test('profile edit shows loading indicator', async ({ page }) => {
  // Login as specialist
  // Navigate to profile edit page
  // Fill form and submit
  // Verify button shows "Saving profile..." during submission
  // Verify button is disabled during submission
})
```

**Acceptance Criteria:**
- Profile edit form shows "Saving profile..." during submission
- Submit button is disabled during submission
- Button styling uses design tokens
- No duplicate profile updates possible
- Integration test passes
- E2E test passes

---

## Task 3: Add loading indicators to admin moderation forms

**Implementation:**
- Update `app/admin/users/SuspendUserForm.tsx` to show loading state
- Update `app/admin/users/UnsuspendUserForm.tsx` to show loading state
- Update `app/admin/gigs/CloseGigForm.tsx` to show loading state
- Use consistent pattern: "Suspending...", "Unsuspending...", "Closing..."
- Disable buttons during pending state

**Test Plan:**
```typescript
// Integration test: __tests__/integration/admin-moderation-loading.test.ts
describe('Admin Moderation Loading States', () => {
  it('should show loading state when suspending user', async () => {
    // Arrange: Create admin and target user
    // Act: Submit suspend form
    // Assert: Button shows "Suspending..." and is disabled
  })

  it('should show loading state when unsuspending user', async () => {
    // Arrange: Create admin and suspended user
    // Act: Submit unsuspend form
    // Assert: Button shows "Unsuspending..." and is disabled
  })

  it('should show loading state when closing gig', async () => {
    // Arrange: Create admin and open gig
    // Act: Submit close gig form
    // Assert: Button shows "Closing..." and is disabled
  })
})
```

**Acceptance Criteria:**
- All admin moderation forms show contextual loading text
- All buttons are disabled during submission
- No duplicate moderation actions possible
- Integration tests pass for all three forms

---

## Task 4: Audit and add loading states to remaining forms

**Implementation:**
- Review forms identified in Task 1 audit
- Add loading states to any forms missing them:
  - Message form (`app/(protected)/gigs/[id]/message-form.tsx`)
  - Submit work form (`app/(protected)/gigs/[id]/submit-work-form.tsx`)
  - Approve work form (`app/(protected)/gigs/[id]/approve-work-form.tsx`)
  - Mark as paid form (if exists as separate component)
  - Withdraw application button (if exists as form)
- Ensure consistent loading text patterns

**Test Plan:**
```bash
# Verify all forms have useFormStatus
grep -r "useFormStatus" app --include="*.tsx" | wc -l

# Verify all forms have disabled state on submit buttons
grep -r "disabled={pending}" app --include="*.tsx"
```

**Acceptance Criteria:**
- All forms with server actions have loading indicators
- Loading text is contextual and consistent
- All submit buttons are disabled during pending state
- Code review confirms no forms are missing loading states

---

## Task 5: Add Suspense boundaries to pages with async data fetching

**Implementation:**
- Identify pages that fetch data asynchronously (server components with database queries)
- Add `<Suspense>` boundaries with loading fallbacks where missing
- Focus on high-traffic pages:
  - Gig detail page (`app/(protected)/gigs/[id]/page.tsx`)
  - Gig browse page (`app/(protected)/gigs/page.tsx`)
  - Dashboard pages (`app/(protected)/dashboard/page.tsx`)
  - Admin pages (`app/admin/users/page.tsx`, `app/admin/gigs/page.tsx`)
- Use simple loading fallback: `<div>Loading...</div>` or skeleton component

**Code Pattern:**
```tsx
import { Suspense } from 'react'

export default function GigDetailPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div className="p-8 text-neutral-strong">Loading gig details...</div>}>
      <GigDetailContent gigId={params.id} />
    </Suspense>
  )
}
```

**Test Plan:**
```typescript
// E2E test: __tests__/e2e/page-loading-states.spec.ts
test('gig detail page shows loading state', async ({ page }) => {
  // Navigate to gig detail page
  // Verify loading fallback appears briefly
  // Verify content loads after data fetch
})
```

**Acceptance Criteria:**
- All pages with async data fetching have Suspense boundaries
- Loading fallbacks are visible during data fetch
- Loading fallbacks use consistent styling
- E2E tests verify loading states appear

---

## Task 6: Standardize loading UI patterns

**Implementation:**
- Create a shared `LoadingButton` component in `app/components/LoadingButton.tsx`
- Component accepts props: `loadingText`, `defaultText`, `variant` (primary/secondary)
- Uses design tokens for styling
- Internally uses `useFormStatus()` hook
- Update all forms to use the shared component

**Code:**
```tsx
// app/components/LoadingButton.tsx
'use client'

import { useFormStatus } from 'react-dom'

interface LoadingButtonProps {
  loadingText: string
  defaultText: string
  variant?: 'primary' | 'secondary' | 'danger'
  className?: string
}

export function LoadingButton({
  loadingText,
  defaultText,
  variant = 'primary',
  className = ''
}: LoadingButtonProps) {
  const { pending } = useFormStatus()

  const variantClasses = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-surface-level-1 hover:bg-surface-level-2 text-white border border-neutral-weak',
    danger: 'bg-error-500 hover:bg-error-600 text-white'
  }

  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full flex justify-center py-3 px-6 rounded-md text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ${variantClasses[variant]} ${className}`}
    >
      {pending ? loadingText : defaultText}
    </button>
  )
}
```

**Test Plan:**
```typescript
// Unit test: __tests__/unit/loading-button.test.ts
describe('LoadingButton', () => {
  it('should show default text when not pending', () => {
    // Render button with mocked useFormStatus returning { pending: false }
    // Assert: Button shows defaultText
  })

  it('should show loading text when pending', () => {
    // Render button with mocked useFormStatus returning { pending: true }
    // Assert: Button shows loadingText
  })

  it('should be disabled when pending', () => {
    // Render button with mocked useFormStatus returning { pending: true }
    // Assert: Button has disabled attribute
  })
})
```

**Acceptance Criteria:**
- LoadingButton component created and exported
- Component uses design tokens for styling
- Component supports primary, secondary, and danger variants
- Unit tests pass
- At least 3 forms refactored to use LoadingButton

---

## Task 7: Test loading states under slow network conditions

**Implementation:**
- Create E2E test that simulates slow network using Playwright's `page.route()` API
- Test all critical forms: gig creation, application submission, profile edit
- Verify loading indicators appear and remain visible during delay
- Verify buttons are disabled during delay
- Verify no duplicate submissions occur

**Test Code:**
```typescript
// __tests__/e2e/slow-network-loading.spec.ts
import { test, expect } from '@playwright/test'

test('loading indicators appear during slow network', async ({ page }) => {
  // Simulate slow network (2 second delay)
  await page.route('**/api/**', async (route) => {
    await new Promise(resolve => setTimeout(resolve, 2000))
    await route.continue()
  })

  // Login as client
  await page.goto('http://localhost:3000/login')
  // ... login steps ...

  // Navigate to gig creation
  await page.goto('http://localhost:3000/gigs/new')

  // Fill form
  await page.fill('input[name="title"]', 'Test Gig')
  await page.fill('textarea[name="description"]', 'Test description')
  await page.fill('textarea[name="acceptanceCriteria"]', 'Test criteria with at least 50 characters to meet minimum requirement')
  await page.fill('input[name="budget"]', '100000')

  // Submit form
  const submitButton = page.locator('button[type="submit"]')
  await submitButton.click()

  // Verify loading state appears
  await expect(submitButton).toContainText('Posting...')
  await expect(submitButton).toBeDisabled()

  // Wait for submission to complete
  await page.waitForURL('**/dashboard', { timeout: 5000 })
})

test('duplicate submissions prevented during slow network', async ({ page }) => {
  // Simulate slow network
  await page.route('**/api/**', async (route) => {
    await new Promise(resolve => setTimeout(resolve, 2000))
    await route.continue()
  })

  // ... setup and navigate to form ...

  // Click submit button multiple times rapidly
  const submitButton = page.locator('button[type="submit"]')
  await submitButton.click()
  await submitButton.click() // Second click should be ignored
  await submitButton.click() // Third click should be ignored

  // Verify button is disabled (preventing duplicate clicks)
  await expect(submitButton).toBeDisabled()

  // Wait for completion
  await page.waitForURL('**/dashboard', { timeout: 5000 })

  // Verify only one gig was created (check database or UI)
  // ... verification logic ...
})
```

**Acceptance Criteria:**
- E2E tests simulate slow network conditions (2+ second delay)
- Loading indicators appear and remain visible during delay
- Buttons are disabled during delay
- No duplicate submissions occur when clicking multiple times
- All E2E tests pass

---

## Task 8: Update documentation

**Implementation:**
- Update `openspec/specs/ui/spec.md` with loading state requirements
- Document the LoadingButton component usage
- Add examples to component documentation
- Update TESTING.md with loading state testing patterns

**Acceptance Criteria:**
- UI spec includes loading state requirements
- LoadingButton component is documented
- Testing documentation includes loading state test examples
- Documentation is clear and includes code examples
