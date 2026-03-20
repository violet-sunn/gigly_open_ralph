# Implementation Tasks: UI Navigation Layout Token Migration

## Task 1: Update MainNav component to use design tokens

**Implementation:**
- Open `app/components/MainNav.tsx`
- Replace hardcoded color classes with design tokens:
  - `bg-navy-800` → `bg-surface-level-1` (header background)
  - `border-gray-700` → `border-neutral-weak` (header border)
  - `text-gray-300` → keep as-is (no direct token equivalent for navigation text)
  - `hover:bg-navy-700` → keep as-is (no hover token available)
  - Active state `text-blue-500` and `border-blue-500` → keep as-is (brand colors)
- Preserve all navigation link text exactly as-is
- Maintain all active/hover state logic (isActive function)
- Keep all className logic unchanged except color values

**Test Plan:**
```bash
# Run E2E tests to verify navigation functionality
npm run test:e2e -- navigation

# Manual verification:
# 1. Navigate to /dashboard - verify header displays correctly
# 2. Click each navigation link - verify navigation works
# 3. Verify active state highlights current page
# 4. Hover over links - verify hover states work
# 5. Test on mobile (320px width) - verify responsive behavior
```

**Expected Result:**
- Navigation header uses `bg-surface-level-1` background
- All links navigate correctly
- Active/hover states work as before
- No visual regressions except intentional token-based color updates

---

## Task 2: Update NotificationBell component styling

**Implementation:**
- Open `app/components/NotificationBell.tsx`
- Replace hardcoded badge color:
  - `bg-error-500` → keep as-is (semantic error color is appropriate for notification badge)
  - Verify badge positioning and styling remain unchanged
- No changes to notification logic or functionality
- Preserve all event handlers and state management

**Test Plan:**
```bash
# Run E2E tests for notification bell
npm run test:e2e -- notification

# Manual verification:
# 1. Login as CLIENT or SPECIALIST user
# 2. Verify notification bell displays in header
# 3. Check badge shows correct unread count
# 4. Click bell - verify dropdown opens
# 5. Click outside dropdown - verify it closes
# 6. Click notification item - verify navigation to gig page
```

**Expected Result:**
- Notification bell displays correctly in navigation
- Badge shows unread count with red background
- Dropdown functionality works as before
- No functional regressions

---

## Task 3: Verify layout containers use token-based spacing

**Implementation:**
- Open `app/(protected)/layout.tsx`
- Verify background color uses design token:
  - Check `style={{ backgroundColor: 'var(--bg-surface-level-0)' }}` is present
- Verify MainNav is wrapped in Suspense with proper fallback
- No changes needed if already using tokens

**Test Plan:**
```bash
# Visual verification:
# 1. Navigate to any protected page (/dashboard, /gigs, /profile)
# 2. Verify page background color is consistent
# 3. Verify navigation header is positioned correctly
# 4. Check spacing between header and page content
# 5. Test on multiple viewport sizes (320px, 768px, 1024px, 1440px)
```

**Expected Result:**
- Layout uses `var(--bg-surface-level-0)` for page background
- Navigation header positioned correctly with proper spacing
- Responsive behavior works across all viewport sizes

---

## Task 4: Run comprehensive E2E navigation tests

**Implementation:**
- No code changes - verification only
- Run full E2E test suite focusing on navigation flows

**Test Plan:**
```bash
# Run all E2E tests
npm run test:e2e

# Specifically test navigation scenarios:
# 1. User login → dashboard navigation
# 2. CLIENT user: Dashboard → Post Gig → Browse (should redirect)
# 3. SPECIALIST user: Dashboard → Browse Gigs → Gig Detail
# 4. Profile navigation from any page
# 5. Notification bell interactions
# 6. Sign out functionality
# 7. Active state highlighting on each page
# 8. Hover states on all navigation links
```

**Expected Result:**
- All E2E tests pass without modification
- All navigation links work correctly
- Active/hover states function as expected
- Notification bell interactions work
- No functional regressions detected

---

## Task 5: Visual regression testing against Figma prototype

**Implementation:**
- Compare implemented navigation with Figma prototype (node-id=4032-181)
- Verify visual alignment:
  - Header background color matches design intent
  - Navigation structure matches prototype
  - Notification badge positioning matches design
  - Spacing and typography align with design system

**Test Plan:**
```bash
# Manual visual comparison:
# 1. Open Figma prototype: https://www.figma.com/design/Nexptl0M63VM62lPVkjxxx/gigli?node-id=4032-181
# 2. Open local app at http://localhost:3000/dashboard
# 3. Compare header layout, colors, spacing
# 4. Verify notification badge matches design
# 5. Check navigation link styling and hover states
# 6. Verify responsive behavior matches design intent
```

**Expected Result:**
- Navigation header visually matches Figma prototype
- Token-based colors align with design system
- Spacing and layout match design specifications
- No unintended visual differences

---

## Task 6: Update documentation (if needed)

**Implementation:**
- Review `docs/DESIGN_SYSTEM.md` to ensure navigation component patterns are documented
- Add navigation component example if not present
- Document token usage for header/navigation components

**Test Plan:**
```bash
# Verification:
# 1. Read docs/DESIGN_SYSTEM.md
# 2. Verify navigation component patterns are documented
# 3. Check token usage examples include navigation
# 4. Ensure migration guide covers navigation components
```

**Expected Result:**
- Documentation includes navigation component patterns
- Token usage for navigation is clearly documented
- Migration examples help future developers

---

## Summary

All tasks focus on styling updates only - no behavioral changes. The implementation preserves all existing functionality while migrating to the design token system for better maintainability and design consistency.
