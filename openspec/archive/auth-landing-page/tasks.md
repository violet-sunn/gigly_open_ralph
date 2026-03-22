# Implementation Tasks: auth-landing-page

## Task 1: Export Figma Assets

**Description:** Export all required assets from Figma design using the Figma MCP tool.

**Implementation Notes:**
- Use `mcp__figma__get_design_context` to get the full design context for node 4100-385
- Export logo image (node 4116:427) as optimized PNG or SVG
- Export user icon (node 4116:399) for Specialist role card
- Export briefcase icon (node 4113:535) for Client role card
- Export decorative background pattern (node 4111:399) as optimized PNG
- Save all assets to `public/images/auth/` directory
- Optimize images for web (use WebP format if possible, fallback to PNG)
- Document asset URLs and dimensions in code comments

**Test Plan:**
- Verify all assets are exported and saved to correct directory
- Verify images load correctly in browser
- Verify image file sizes are optimized (< 100KB each)
- Run `ls -lh public/images/auth/` and verify all files exist

---

## Task 2: Create RoleCard Component

**Description:** Create a reusable RoleCard component for displaying selectable user roles.

**Implementation Notes:**
- Create file at `app/components/auth/RoleCard.tsx`
- Component props: `role: 'SPECIALIST' | 'CLIENT'`, `selected: boolean`, `onClick: () => void`
- Use Tailwind classes for styling:
  - Default: `bg-[#10121c] rounded-[20px] px-[20px] py-[20px]`
  - Selected: add `border-2 border-[#0265dc]`
- Icon size: 32px × 32px
- Text size: 17px, color: white, font: LINE Seed JP Regular
- Gap between icon and text: 24px (use `gap-[24px]`)
- Use `<button>` element for accessibility
- Add hover state: slight opacity change (0.9)
- Add focus state: outline for keyboard navigation
- Conditional rendering for icon based on role prop
- Conditional rendering for text based on role prop

**Test Plan:**
- Create integration test at `__tests__/integration/role-card.test.ts`
- Test: Component renders with SPECIALIST role (user icon, "Профиль специалиста")
- Test: Component renders with CLIENT role (briefcase icon, "Профиль Компании")
- Test: Component shows default styling when selected={false}
- Test: Component shows selected styling when selected={true}
- Test: onClick handler is called when component is clicked
- Test: Component is keyboard accessible (Tab, Enter, Space)
- Run `npm run test:unit` and verify all tests pass

---

## Task 3: Create AuthButton Component

**Description:** Create a reusable AuthButton component for authentication actions.

**Implementation Notes:**
- Create file at `app/components/auth/AuthButton.tsx`
- Component props: `variant: 'primary' | 'secondary'`, `children: ReactNode`, `onClick: () => void`, `disabled?: boolean`
- Primary styling:
  - Background: `bg-[#0088ff]`
  - Text: `text-white text-[16px] font-medium`
  - Height: `h-[50px]`
  - Border radius: `rounded-[10px]`
- Secondary styling:
  - Background: `bg-[rgba(0,136,255,0.24)]` (use Tailwind arbitrary value)
  - Text: `text-[#1379f3] text-[15px] font-medium`
  - Height: `h-[50px]`
  - Border radius: `rounded-[10px]`
- Disabled styling: `opacity-50 cursor-not-allowed`
- Use `<button>` element with `disabled` attribute
- Full width: `w-full`
- Center text: `flex items-center justify-center`

**Test Plan:**
- Create integration test at `__tests__/integration/auth-button.test.ts`
- Test: Component renders with primary variant (correct colors)
- Test: Component renders with secondary variant (correct colors)
- Test: Component shows disabled styling when disabled={true}
- Test: onClick handler is called when enabled and clicked
- Test: onClick handler is NOT called when disabled and clicked
- Run `npm run test:unit` and verify all tests pass

---

## Task 4: Create Auth Landing Page

**Description:** Create the main auth landing page at `/auth` with full layout and state management.

**Implementation Notes:**
- Create file at `app/auth/page.tsx`
- Use `'use client'` directive (needs state and navigation)
- Import RoleCard and AuthButton components
- State: `const [selectedRole, setSelectedRole] = useState<'SPECIALIST' | 'CLIENT' | null>(null)`
- Use Next.js `useRouter()` for navigation
- Layout structure:
  ```tsx
  <div className="bg-[#01030e] min-h-screen flex items-center justify-center relative">
    {/* Decorative background pattern */}
    <div className="absolute bottom-0 left-0 right-0 z-0">
      <Image src="/images/auth/pattern.png" alt="" />
    </div>

    {/* Main card */}
    <div className="bg-[#060813] border border-[#242935] rounded-[25px] w-[418px] md:w-[90vw] p-[40px] z-10">
      <div className="flex flex-col gap-[47px]">
        {/* Logo header */}
        <div className="flex justify-center">
          <Image src="/images/auth/logo.png" alt="Gigly" />
        </div>

        {/* Content section */}
        <div className="flex flex-col gap-[30px]">
          {/* Title */}
          <h1 className="text-[22px] font-semibold text-white text-center">Вход</h1>

          {/* Role cards */}
          <div className="flex flex-col gap-[17px]">
            <RoleCard
              role="SPECIALIST"
              selected={selectedRole === 'SPECIALIST'}
              onClick={() => setSelectedRole('SPECIALIST')}
            />
            <RoleCard
              role="CLIENT"
              selected={selectedRole === 'CLIENT'}
              onClick={() => setSelectedRole('CLIENT')}
            />
          </div>
        </div>

        {/* Buttons section */}
        <div className="flex flex-col gap-[21px]">
          <AuthButton
            variant="primary"
            disabled={!selectedRole}
            onClick={() => router.push(`/login?role=${selectedRole}`)}
          >
            Войти
          </AuthButton>
          <AuthButton
            variant="secondary"
            disabled={!selectedRole}
            onClick={() => router.push(`/register?role=${selectedRole}`)}
          >
            Зарегестрироватся
          </AuthButton>
        </div>
      </div>
    </div>
  </div>
  ```
- Add responsive classes: `w-[418px] md:w-[90vw]` for mobile adaptation
- Ensure decorative pattern has lower z-index than card

**Test Plan:**
- Manual test: Navigate to `http://localhost:3000/auth` and verify page loads
- Manual test: Verify logo, role cards, and buttons are visible
- Manual test: Verify buttons are disabled initially
- Manual test: Click Specialist card, verify it shows selected state (blue border)
- Manual test: Verify buttons become enabled after selection
- Manual test: Click Login button, verify navigation to `/login?role=SPECIALIST`
- Manual test: Go back, select Client, click Register, verify navigation to `/register?role=CLIENT`
- Manual test: Resize browser to mobile width, verify card adapts to 90vw
- Visual comparison: Compare with Figma design, verify spacing matches exactly

---

## Task 5: Update Middleware for /auth Route

**Description:** Update Next.js middleware to allow unauthenticated access to `/auth` and redirect authenticated users to dashboard.

**Implementation Notes:**
- Edit `middleware.ts` file
- Add `/auth` to the matcher config (if not already included)
- Add logic to handle `/auth` route:
  ```typescript
  // In middleware function
  const session = await verifySession(token);

  // If accessing /auth
  if (pathname === '/auth') {
    // If authenticated, redirect to dashboard
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // If not authenticated, allow access
    return NextResponse.next();
  }
  ```
- Ensure matcher includes `/auth` in the list of routes to check
- Test both authenticated and unauthenticated scenarios

**Test Plan:**
- Manual test: Clear cookies, navigate to `/auth`, verify page loads (no redirect)
- Manual test: Login as any user, navigate to `/auth`, verify redirect to `/dashboard`
- Integration test: Create test in `__tests__/integration/middleware.test.ts`
- Test: Unauthenticated access to `/auth` is allowed
- Test: Authenticated access to `/auth` redirects to `/dashboard`
- Run `npm run test:unit` and verify middleware tests pass

---

## Task 6: Update Login Page to Handle Role Query Parameter

**Description:** Update the login page to read and handle the `role` query parameter from the URL.

**Implementation Notes:**
- Edit `app/login/page.tsx`
- Add `useSearchParams()` hook to read query parameters:
  ```typescript
  'use client';
  import { useSearchParams } from 'next/navigation';

  export default function LoginPage() {
    const searchParams = useSearchParams();
    const role = searchParams.get('role'); // 'SPECIALIST' | 'CLIENT' | null

    // Optional: Display role-specific messaging
    // Optional: Store role in state for context

    // Rest of login page logic...
  }
  ```
- Validate role parameter: check if it's 'SPECIALIST' or 'CLIENT', ignore if invalid
- No UI changes required for MVP (role context is informational only)
- Role parameter is preserved through login flow (no action needed, Next.js handles this)

**Test Plan:**
- Manual test: Navigate to `/login?role=SPECIALIST`, verify page loads without errors
- Manual test: Navigate to `/login?role=CLIENT`, verify page loads without errors
- Manual test: Navigate to `/login?role=INVALID`, verify page loads without errors (ignores invalid value)
- Manual test: Complete login flow, verify redirect to dashboard works correctly
- Console check: Verify no errors or warnings in browser console

---

## Task 7: Update Register Page to Handle Role Query Parameter

**Description:** Update the register page to read the `role` query parameter and pre-select the role in the registration form.

**Implementation Notes:**
- Edit `app/register/page.tsx`
- Add `useSearchParams()` hook to read query parameters
- Use `useEffect` to set initial role state based on query parameter:
  ```typescript
  'use client';
  import { useSearchParams } from 'next/navigation';
  import { useEffect } from 'react';

  export default function RegisterPage() {
    const searchParams = useSearchParams();
    const roleParam = searchParams.get('role');
    const [role, setRole] = useState<'CLIENT' | 'SPECIALIST' | ''>('');

    useEffect(() => {
      if (roleParam === 'SPECIALIST' || roleParam === 'CLIENT') {
        setRole(roleParam);
      }
    }, [roleParam]);

    // Rest of register page logic...
  }
  ```
- Validate role parameter: only accept 'SPECIALIST' or 'CLIENT'
- Pre-select role radio button/selector based on query parameter
- User can still change role selection manually
- If role is CLIENT, show client-specific fields (companyName, inn) immediately

**Test Plan:**
- Manual test: Navigate to `/register?role=SPECIALIST`, verify Specialist role is pre-selected
- Manual test: Navigate to `/register?role=CLIENT`, verify Client role is pre-selected and client fields are visible
- Manual test: Navigate to `/register?role=INVALID`, verify no role is pre-selected (default behavior)
- Manual test: Pre-select role via query param, manually change to other role, verify form updates correctly
- Manual test: Complete registration with pre-selected role, verify user is created with correct role
- Console check: Verify no errors or warnings in browser console

---

## Task 8: Create E2E Tests for Auth Landing Page

**Description:** Create comprehensive E2E tests for all auth landing page navigation flows.

**Implementation Notes:**
- Create file at `__tests__/e2e/auth-landing.spec.ts`
- Use Playwright for browser automation
- Test structure:
  ```typescript
  import { test, expect } from '@playwright/test';

  test.describe('Auth Landing Page', () => {
    test('loads correctly for unauthenticated user', async ({ page }) => {
      await page.goto('http://localhost:3000/auth');

      // Verify logo is visible
      await expect(page.locator('img[alt="Gigly"]')).toBeVisible();

      // Verify role cards are visible
      await expect(page.getByText('Профиль специалиста')).toBeVisible();
      await expect(page.getByText('Профиль Компании')).toBeVisible();

      // Verify buttons are visible and disabled
      const loginButton = page.getByRole('button', { name: 'Войти' });
      const registerButton = page.getByRole('button', { name: 'Зарегестрироватся' });
      await expect(loginButton).toBeVisible();
      await expect(registerButton).toBeVisible();
      await expect(loginButton).toBeDisabled();
      await expect(registerButton).toBeDisabled();
    });

    test('navigates to login with Specialist role', async ({ page }) => {
      await page.goto('http://localhost:3000/auth');

      // Click Specialist role card
      await page.getByText('Профиль специалиста').click();

      // Verify buttons are enabled
      const loginButton = page.getByRole('button', { name: 'Войти' });
      await expect(loginButton).toBeEnabled();

      // Click login button
      await loginButton.click();

      // Verify navigation to /login?role=SPECIALIST
      await expect(page).toHaveURL(/\/login\?role=SPECIALIST/);
    });

    // Add more tests for other scenarios...
  });
  ```
- Test all 8 scenarios from testing spec:
  1. Page loads correctly
  2. User selects Specialist role
  3. User selects Client role
  4. User changes role selection
  5. Navigate to login with Specialist role
  6. Navigate to login with Client role
  7. Navigate to register with Specialist role
  8. Navigate to register with Client role
  9. Authenticated user is redirected from /auth
  10. Responsive layout on mobile

**Test Plan:**
- Run `npm run test:e2e -- auth-landing.spec.ts` and verify all tests pass
- Verify tests are idempotent (can run multiple times)
- Verify tests clean up after themselves (no stale data)
- Verify tests run in under 30 seconds total
- Manual review: Check test coverage matches all scenarios in spec

---

## Task 9: Visual Verification and Polish

**Description:** Perform final visual verification against Figma design and polish any discrepancies.

**Implementation Notes:**
- Open Figma design (node 4100-385) side-by-side with implemented page
- Use browser DevTools to measure spacing:
  - Logo to content gap: 47px
  - Role cards gap: 17px
  - Buttons gap: 21px
  - Sections gap: 30px
  - Card padding: 40px
- Verify colors match exactly:
  - Background: #01030e
  - Card background: #060813
  - Card border: #242935
  - Selected border: #0265dc
  - Primary button: #0088ff
  - Secondary button background: rgba(0, 136, 255, 0.24)
  - Secondary button text: #1379f3
- Verify typography:
  - Title: 22px, font-semibold
  - Role card text: 17px
  - Button text: 16px (primary), 15px (secondary)
- Verify responsive behavior on mobile (375px width)
- Fix any discrepancies found

**Test Plan:**
- Manual visual comparison with Figma design
- Measure spacing with DevTools ruler tool
- Sample colors with DevTools color picker
- Test on multiple browsers (Chrome, Firefox, Safari)
- Test on multiple devices (desktop, tablet, mobile)
- Take screenshots for documentation
- Document any intentional deviations from Figma design

---

## Task 10: Documentation and Cleanup

**Description:** Update documentation and clean up any temporary code or comments.

**Implementation Notes:**
- Update `openspec/project.md` to add auth-landing-page to "Completed Changes" section
- Add entry to "Current State" section describing the new /auth route
- Document any new design tokens or colors used
- Add code comments explaining complex logic (if any)
- Remove any console.log statements or debug code
- Verify all TypeScript types are correct (no `any` types)
- Run linter and fix any warnings: `npm run lint`
- Run formatter: `npm run format` (if available)

**Test Plan:**
- Run `npm run lint` and verify no errors or warnings
- Run `npm run build` and verify successful build
- Run `npm run test:unit` and verify all tests pass (100% of existing tests)
- Run `npm run test:e2e` and verify all tests pass
- Manual review: Read through all new code and verify it's clean and well-documented
- Git status: Verify no unintended files are staged for commit
