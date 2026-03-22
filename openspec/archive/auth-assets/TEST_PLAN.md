# Test Plan: auth-assets

## Overview
This test plan validates the auth-assets implementation archived on 2026-03-22.

## Automated Tests

### Unit Tests (9 tests)
Location: `__tests__/unit/assets.test.tsx`

**SpecialistIcon Component (3 tests)**
- ✅ Renders with default props (viewBox, aria-label)
- ✅ Accepts className prop
- ✅ Renders SVG elements (circle, path)

**ClientIcon Component (3 tests)**
- ✅ Renders with default props (viewBox, aria-label)
- ✅ Accepts className prop
- ✅ Renders SVG path elements

**Logo Component (3 tests)**
- ✅ Renders with default props (viewBox, aria-label)
- ✅ Accepts className prop
- ✅ Renders text element with "GIGLY"

**Run Command:**
```bash
npm run test:unit -- __tests__/unit/assets.test.tsx
```

### Integration Tests
All existing integration tests continue to pass (656 total tests).

**Run Command:**
```bash
npm test
```

---

## Manual Verification Tests

### 1. File Organization
**Objective:** Verify assets are properly organized

**Steps:**
```bash
ls -la public/assets/auth/
```

**Expected Results:**
- Directory exists
- Contains 4 files: specialist-icon.svg, client-icon.svg, background-pattern.svg, logo.svg
- All filenames use kebab-case

---

### 2. File Size Validation
**Objective:** Verify all SVG files are under 10KB

**Steps:**
```bash
ls -lh public/assets/auth/*.svg | awk '{print $9, $5}'
```

**Expected Results:**
- specialist-icon.svg: 234 bytes
- client-icon.svg: 385 bytes
- background-pattern.svg: 563 bytes
- logo.svg: 218 bytes
- All files < 10KB

---

### 3. Accessibility Validation
**Objective:** Verify proper accessibility attributes

**Steps:**
```bash
# Check icon accessibility
grep 'aria-label' public/assets/auth/specialist-icon.svg
grep 'aria-label' public/assets/auth/client-icon.svg
grep 'aria-label' public/assets/auth/logo.svg

# Check decorative element
grep 'aria-hidden="true"' public/assets/auth/background-pattern.svg
grep 'role="presentation"' public/assets/auth/background-pattern.svg
```

**Expected Results:**
- Icons have aria-label attributes with descriptive text
- Background pattern has aria-hidden="true" and role="presentation"

---

### 4. Visual Rendering Test
**Objective:** Verify assets render correctly on auth pages

**Steps:**
1. Start dev server: `npm run dev`
2. Navigate to http://localhost:3000/register
3. Navigate to http://localhost:3000/login

**Expected Results:**

**Register Page:**
- Specialist icon (person) appears next to "Specialist" role option
- Client icon (briefcase) appears next to "Client" role option
- Icons are 32x32px (w-8 h-8 classes)
- Icons are visually distinct and recognizable

**Login Page:**
- Logo appears at top of form
- Logo is properly sized (h-7 class)
- Logo displays "GIGLY" text

---

### 5. Responsive Behavior Test
**Objective:** Verify assets work across different screen sizes

**Steps:**
1. Open http://localhost:3000/register in browser
2. Open DevTools (F12)
3. Enable responsive mode
4. Test at breakpoints: 320px, 768px, 1024px, 1920px

**Expected Results:**
- Icons scale proportionally at all breakpoints
- No horizontal scrolling
- No layout shift when assets load
- Icons remain visible and recognizable

---

### 6. Screen Reader Test
**Objective:** Verify accessibility with assistive technologies

**Steps:**
1. Enable screen reader (NVDA/JAWS/VoiceOver)
2. Navigate to http://localhost:3000/register
3. Tab through role selection area

**Expected Results:**
- Screen reader announces "Specialist role icon" for specialist option
- Screen reader announces "Client role icon" for client option
- Background pattern is NOT announced (aria-hidden)

---

### 7. Import Validation
**Objective:** Verify centralized imports work correctly

**Steps:**
```typescript
// Test in any component file
import { SpecialistIcon, ClientIcon, Logo } from '@/lib/assets'

// Verify TypeScript types
<SpecialistIcon className="w-8 h-8" />
<ClientIcon className="w-10 h-10 text-blue-500" />
<Logo className="h-7" />
```

**Expected Results:**
- No TypeScript errors
- Components accept className prop
- IntelliSense shows proper types

---

### 8. Build Validation
**Objective:** Verify production build succeeds

**Steps:**
```bash
npm run build
```

**Expected Results:**
- Build completes successfully
- No errors or warnings related to assets
- Assets are included in build output

---

## Regression Tests

### Test After Future Changes
Run these tests after any changes to:
- Auth pages (login/register)
- Asset system
- Build configuration
- Accessibility features

**Quick Regression Check:**
```bash
# 1. Run full test suite
npm test

# 2. Verify file sizes
ls -lh public/assets/auth/*.svg

# 3. Check accessibility
grep -h 'aria-label\|aria-hidden' public/assets/auth/*.svg

# 4. Build verification
npm run build
```

---

## Success Criteria

All tests pass when:
- ✅ All 656 automated tests pass
- ✅ All 4 SVG files exist and are under 10KB
- ✅ All accessibility attributes are present
- ✅ Assets render correctly on login and register pages
- ✅ No layout shift occurs when loading assets
- ✅ Screen readers announce icon labels correctly
- ✅ Production build succeeds without errors

---

## Test Maintenance

**When to Update This Test Plan:**
- New auth assets are added
- Asset requirements change
- New accessibility standards are adopted
- Build process changes

**Test Plan Version:** 1.0
**Last Updated:** 2026-03-22
**Change:** auth-assets (archived)
