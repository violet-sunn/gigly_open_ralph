# Implementation Tasks

## Task 1: Audit Interactive Elements for Keyboard Accessibility

**Implementation:**
- Create a comprehensive audit document listing all interactive elements across the application
- Test each element for keyboard accessibility:
  - Can it be reached via Tab key?
  - Can it be activated via Enter/Space?
  - Does it have a visible focus indicator?
- Identify elements that need fixes:
  - Custom components using `<div>` or `<span>` with click handlers
  - Elements with `tabIndex={-1}` that should be focusable
  - Elements missing keyboard event handlers
- Document findings in a checklist format

**Key files to audit:**
- `app/components/**/*.tsx` - All reusable components
- `app/(protected)/**/*.tsx` - All protected pages and page-specific components
- `app/auth/page.tsx`, `app/login/page.tsx`, `app/register/page.tsx` - Auth pages
- `app/page.tsx` - Homepage

**Test Plan:**
- Manual keyboard-only navigation through entire application
- Use Tab key to navigate, Enter/Space to activate
- Document any elements that cannot be reached or activated
- Verify audit document is complete and accurate
- Run: Manual testing with keyboard only (no mouse)
- Assert: All interactive elements are documented with accessibility status

## Task 2: Add Visible Focus Indicators Using Design Tokens

**Implementation:**
- Add global focus indicator styles to `app/globals.css`:
  ```css
  /* Ensure all focusable elements have visible focus indicators */
  *:focus-visible {
    @apply ring-2 ring-blue-500 ring-offset-2 outline-none;
  }

  /* Specific focus styles for buttons */
  button:focus-visible,
  [role="button"]:focus-visible {
    @apply ring-2 ring-blue-500 ring-offset-2 outline-none;
  }

  /* Specific focus styles for links */
  a:focus-visible {
    @apply ring-2 ring-blue-500 ring-offset-2 outline-none;
  }

  /* Specific focus styles for form inputs */
  input:focus-visible,
  textarea:focus-visible,
  select:focus-visible {
    @apply ring-2 ring-blue-500 ring-offset-2 outline-none;
  }
  ```
- Remove any existing `outline: none` rules without replacement focus styles
- Test focus indicators on all background colors (light, dark, colored)
- Verify 3:1 contrast ratio using browser DevTools or contrast checker
- Update custom components that override focus styles (e.g., AuthButton, RoleCard)

**Test Plan:**
- Navigate through application using Tab key
- Verify focus indicator is visible on every focusable element
- Test on different background colors (white, dark navy, colored buttons)
- Use browser DevTools to measure contrast ratio (minimum 3:1)
- Run: Manual testing with keyboard navigation
- Assert: All focusable elements have visible focus indicators with sufficient contrast

## Task 3: Fix Tab Order to Follow Logical Reading Order

**Implementation:**
- Review tab order on all pages by pressing Tab repeatedly
- Identify pages where tab order doesn't follow visual layout
- Fix tab order issues:
  - Remove positive `tabIndex` values (tabIndex > 0)
  - Reorder DOM elements if necessary to match visual layout
  - Use CSS flexbox/grid `order` property if DOM reordering is not feasible
  - Ensure form fields are in logical order
- Key pages to verify:
  - Dashboard pages (client and specialist)
  - Gig creation form (`/dashboard/gigs/new`)
  - Gig detail page (`/dashboard/gigs/[id]`)
  - Application form
  - Profile edit form
  - Login/register pages
  - Admin pages

**Test Plan:**
- Navigate each page using Tab key only
- Verify focus moves in logical order (top to bottom, left to right)
- Verify no unexpected jumps between distant elements
- Verify form fields are in logical order
- Run: Manual keyboard navigation testing on all pages
- Assert: Tab order follows visual/logical reading order on all pages

## Task 4: Implement Keyboard Shortcuts (Esc and /)

**Implementation:**

### 4a. Esc key closes modals
- Update `WelcomeModal` component to handle Esc key:
  ```tsx
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);
  ```
- Apply same pattern to any other modal components

### 4b. Esc key closes dropdowns
- Update `NotificationDropdown` component to handle Esc key:
  ```tsx
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        // Return focus to trigger button
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);
  ```

### 4c. Forward slash focuses search input
- Update gig browse page (`app/(protected)/gigs/page.tsx`) to handle / key:
  ```tsx
  useEffect(() => {
    const handleSlashKey = (e: KeyboardEvent) => {
      // Don't activate if already in a text input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === '/') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleSlashKey);
    return () => document.removeEventListener('keydown', handleSlashKey);
  }, []);
  ```
- Add ref to search input in GigFilters component

**Test Plan:**
- Open WelcomeModal, press Esc, verify it closes
- Open NotificationDropdown, press Esc, verify it closes and focus returns to trigger
- Navigate to gig browse page, press /, verify search input receives focus
- Type in a text input, press /, verify / character is inserted (not shortcut)
- Run: E2E tests for keyboard shortcuts
- Assert: Esc closes modals/dropdowns, / focuses search, no conflicts with text inputs

## Task 5: Implement Focus Management After Navigation

**Implementation:**

### 5a. Skip to main content link
- Add skip link component (`app/components/SkipToMainContent.tsx`):
  ```tsx
  export function SkipToMainContent() {
    return (
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded"
      >
        Skip to main content
      </a>
    );
  }
  ```
- Add skip link to protected layout (`app/(protected)/layout.tsx`) as first element
- Add `id="main-content"` and `tabIndex={-1}` to main content container

### 5b. Focus management after page navigation
- Update protected layout to manage focus on route changes:
  ```tsx
  useEffect(() => {
    // Focus main content after navigation
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
    }
  }, [pathname]);
  ```

### 5c. Focus returns to trigger after modal close
- Update modal components to store trigger element reference
- Return focus to trigger element when modal closes
- Handle case where trigger element is removed from DOM

### 5d. Focus moves to first error after form validation
- Update form components to focus first error field on validation failure
- Add refs to form fields
- Use `fieldRef.current?.focus()` after validation error

**Test Plan:**
- Press Tab on any page, verify skip link appears and is first focusable element
- Activate skip link, verify focus moves to main content
- Navigate between pages, verify focus moves to main content
- Open and close modal, verify focus returns to trigger
- Submit form with errors, verify focus moves to first error field
- Run: E2E tests for focus management
- Assert: Focus is managed correctly in all scenarios

## Task 6: Implement Focus Trap for Modal Dialogs

**Implementation:**
- Create reusable focus trap hook (`app/hooks/useFocusTrap.ts`):
  ```tsx
  export function useFocusTrap(isActive: boolean) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!isActive || !containerRef.current) return;

      const container = containerRef.current;
      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      const handleTab = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      };

      container.addEventListener('keydown', handleTab);
      firstElement?.focus();

      return () => container.removeEventListener('keydown', handleTab);
    }, [isActive]);

    return containerRef;
  }
  ```
- Apply focus trap to WelcomeModal and any other modal components
- Ensure focus moves to first focusable element when modal opens
- Ensure Tab wraps from last to first element and Shift+Tab wraps from first to last

**Test Plan:**
- Open modal, press Tab repeatedly, verify focus cycles within modal only
- Verify focus does not move to elements behind modal
- Verify Tab on last element moves to first element
- Verify Shift+Tab on first element moves to last element
- Run: E2E tests for focus trap
- Assert: Focus is trapped within modal, wraps around correctly

## Task 7: Fix Custom Interactive Components

**Implementation:**
- Review audit from Task 1 for custom components needing fixes
- Common fixes for custom interactive components:
  - Add `tabIndex={0}` to make focusable
  - Add `role="button"` for non-button clickable elements
  - Add keyboard event handlers:
    ```tsx
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    };
    ```
  - Ensure focus indicators are visible
- Key components to review:
  - `RoleCard` - ensure keyboard activation works
  - `NotificationBell` - ensure keyboard accessible
  - `PaginationControls` - ensure page buttons are keyboard accessible
  - Custom cards with click handlers
  - Any `<div>` or `<span>` with `onClick` handlers

**Test Plan:**
- Navigate to each custom component using Tab key
- Verify component receives focus and has visible focus indicator
- Press Enter and Space, verify component activates
- Run: Manual keyboard testing on all custom components
- Assert: All custom interactive components are keyboard accessible

## Task 8: Add Comprehensive E2E Tests for Keyboard Navigation

**Implementation:**
- Create E2E test file (`__tests__/e2e/keyboard-navigation.spec.ts`)
- Test critical user flows with keyboard only:
  - User registration flow (Tab through form, Enter to submit)
  - Login flow (Tab through form, Enter to submit)
  - Gig creation flow (Tab through form fields, Enter to submit)
  - Gig browsing (Tab to search, / shortcut, Tab to filters, Tab to gig cards)
  - Application submission (Tab through form, Enter to submit)
  - Messaging (Tab to message input, type message, Enter to send)
- Test keyboard shortcuts:
  - Esc closes modals
  - Esc closes dropdowns
  - / focuses search input
- Test focus management:
  - Focus moves to main content after navigation
  - Focus returns to trigger after modal close
  - Focus moves to first error after validation failure
- Test focus indicators:
  - Verify focus indicators are visible (check computed styles)
  - Verify focus indicators have sufficient contrast
- Test tab order:
  - Verify tab order follows logical reading order
  - Verify no unexpected focus jumps

**Test Plan:**
- Run: `npm run test:e2e -- keyboard-navigation.spec.ts`
- Assert: All keyboard navigation tests pass
- Assert: Test coverage includes all critical user flows
- Assert: Tests verify focus indicators, tab order, shortcuts, and focus management

## Task 9: Manual Keyboard-Only Testing and Documentation

**Implementation:**
- Perform comprehensive manual testing using keyboard only (no mouse)
- Test all user flows:
  - Homepage → Auth → Register → Dashboard
  - Login → Dashboard → Browse Gigs → Apply
  - Create Gig → Review Applications → Accept → Message
  - Profile Edit → Save
  - Admin pages (if applicable)
- Document findings:
  - Any elements that cannot be reached via keyboard
  - Any elements with invisible focus indicators
  - Any unexpected tab order issues
  - Any keyboard traps
  - Any missing keyboard shortcuts
- Create checklist document (`docs/KEYBOARD_NAVIGATION_TESTING.md`)
- Fix any issues found during manual testing

**Test Plan:**
- Disconnect mouse or use keyboard only
- Navigate through entire application using Tab, Enter, Space, Esc, Arrow keys
- Complete all critical user flows
- Document any issues found
- Verify all issues are fixed
- Run: Manual keyboard-only testing
- Assert: All user flows can be completed with keyboard only
- Assert: No keyboard traps exist
- Assert: Focus indicators are visible throughout
- Assert: Tab order is logical throughout

## Task 10: Update Documentation

**Implementation:**
- Update `README.md` or create `docs/ACCESSIBILITY.md` with keyboard navigation documentation:
  - List of keyboard shortcuts (Esc, /, Tab, Enter, Space, Arrow keys)
  - Explanation of focus indicators
  - Explanation of skip to main content link
  - Guidance for developers on maintaining keyboard accessibility
- Update component documentation with keyboard interaction patterns
- Add keyboard accessibility section to testing documentation

**Test Plan:**
- Review documentation for completeness and accuracy
- Verify all keyboard shortcuts are documented
- Verify developer guidance is clear
- Run: Manual review of documentation
- Assert: Documentation is complete and accurate
