# Implementation Tasks: UI Text Color Token Migration

## Task 1: Pre-Migration Audit
**Objective**: Document current state and create baseline for comparison

**Steps:**
1. Run grep to count exact instances:
   ```bash
   grep -r "text-gray-300" --include="*.tsx" --include="*.jsx" app/ | wc -l
   grep -r "text-gray-400" --include="*.tsx" --include="*.jsx" app/ | wc -l
   grep -r "text-gray-500" --include="*.tsx" --include="*.jsx" app/ | wc -l
   ```
2. Generate list of affected files:
   ```bash
   grep -r "text-gray-[345]00" --include="*.tsx" --include="*.jsx" app/ -l > affected-files.txt
   ```
3. Take screenshots of key pages for visual comparison:
   - Dashboard (client and specialist)
   - Gig detail page
   - Gig browse page
   - Profile page
   - Admin dashboard
4. Run baseline test suite:
   ```bash
   npm test
   npm run test:e2e
   ```
5. Document baseline: all tests passing, 196 instances across 32 files

**Test Plan:**
- Verify grep commands return expected counts
- Confirm screenshots capture all key UI states
- Verify all 493 tests pass in baseline

**Expected Outcome:**
- Documented baseline: 196 instances in 32 files
- Screenshots saved for comparison
- All tests passing (493/493)

---

## Task 2: Automated Text Color Replacement
**Objective**: Replace all text-gray classes with text-neutral tokens

**Steps:**
1. Replace `text-gray-300` with `text-neutral-strong`:
   ```bash
   find app/ -type f \( -name "*.tsx" -o -name "*.jsx" \) -exec sed -i 's/text-gray-300/text-neutral-strong/g' {} +
   ```
2. Replace `text-gray-400` with `text-neutral-weak`:
   ```bash
   find app/ -type f \( -name "*.tsx" -o -name "*.jsx" \) -exec sed -i 's/text-gray-400/text-neutral-weak/g' {} +
   ```
3. Replace `text-gray-500` with `text-neutral-weak`:
   ```bash
   find app/ -type f \( -name "*.tsx" -o -name "*.jsx" \) -exec sed -i 's/text-gray-500/text-neutral-weak/g' {} +
   ```
4. Verify zero remaining instances:
   ```bash
   grep -r "text-gray-[345]00" --include="*.tsx" --include="*.jsx" app/
   # Should return no results
   ```
5. Check for any dynamic class usage that may have been missed:
   ```bash
   grep -r "gray-[345]00" --include="*.tsx" --include="*.jsx" app/
   # Review any template literals or conditional classes
   ```

**Test Plan:**
- Run grep verification after each replacement
- Confirm zero instances of text-gray-300/400/500 remain
- Check git diff to ensure only text color classes changed
- Verify no unintended replacements (e.g., in comments, strings)

**Expected Outcome:**
- All 196 instances replaced
- Zero remaining text-gray-300/400/500 in component files
- Git diff shows only className changes, no logic changes

---

## Task 3: Manual Review and Semantic Verification
**Objective**: Verify semantic correctness of token usage

**Steps:**
1. Review dashboard pages (`app/(protected)/dashboard/page.tsx`):
   - Verify headings use `text-neutral-strong` or `text-white`
   - Verify metadata (dates, counts) use `text-neutral-weak`
   - Check sidebar labels and helper text use `text-neutral-weak`

2. Review gig pages:
   - `app/(protected)/gigs/page.tsx` - browse page
   - `app/(protected)/gigs/[id]/page.tsx` - detail page
   - `app/(protected)/gigs/new/page.tsx` - creation form
   - Verify gig titles use strong tokens
   - Verify descriptions, metadata use appropriate tokens

3. Review profile pages:
   - `app/(protected)/profile/page.tsx`
   - `app/(protected)/profile/edit/page.tsx`
   - `app/(protected)/profile/[userId]/page.tsx`
   - Verify profile field labels and values use appropriate hierarchy

4. Review auth pages:
   - `app/login/page.tsx`
   - `app/register/page.tsx`
   - Verify form labels, helper text, links use appropriate tokens

5. Review admin pages:
   - `app/admin/page.tsx`
   - `app/admin/users/page.tsx`
   - `app/admin/gigs/page.tsx`
   - Verify table headers, data, and metadata use appropriate hierarchy

6. Review shared components:
   - `app/components/MainNav.tsx`
   - `app/components/NotificationBell.tsx`
   - `app/components/NotificationDropdown.tsx`
   - `app/components/PaginationControls.tsx`
   - Verify navigation text, notification text use appropriate tokens

7. Check for edge cases:
   - Conditional classes (e.g., `${isActive ? 'text-neutral-strong' : 'text-neutral-weak'}`)
   - Template literals with dynamic classes
   - Commented-out code that may need updating

**Test Plan:**
- Visual inspection of each file in code editor
- Run dev server and manually test each page
- Verify text hierarchy is visually clear
- Check for any obvious contrast issues

**Expected Outcome:**
- All text colors semantically correct
- Primary content uses strong tokens
- Secondary/tertiary content uses weak tokens
- No visual hierarchy issues identified

---

## Task 4: Build and Type Check
**Objective**: Ensure no build errors or type issues

**Steps:**
1. Run TypeScript type check:
   ```bash
   npx tsc --noEmit
   ```
2. Run Next.js build:
   ```bash
   npm run build
   ```
3. Check for any Tailwind CSS warnings:
   - Review build output for unknown classes
   - Verify all token classes are recognized
4. Start production build locally:
   ```bash
   npm run start
   ```
5. Smoke test key pages in production mode

**Test Plan:**
- TypeScript compilation succeeds with zero errors
- Next.js build completes successfully
- No Tailwind CSS warnings about unknown classes
- Production build starts and serves pages correctly

**Expected Outcome:**
- Clean build with no errors
- No type errors
- All token classes recognized by Tailwind
- Production build functional

---

## Task 5: Automated Test Suite
**Objective**: Verify all existing tests pass

**Steps:**
1. Run unit and integration tests:
   ```bash
   npm test
   ```
2. Run E2E tests:
   ```bash
   npm run test:e2e
   ```
3. Review any failing tests:
   - Check if failures are related to color class changes
   - Update test selectors if needed (should use semantic selectors, not color classes)
   - Verify no functional regressions
4. Run coverage report:
   ```bash
   npm run test:coverage
   ```
5. Compare coverage to baseline (should be identical)

**Test Plan:**
- All 493 tests must pass
- No new test failures introduced
- Coverage percentage unchanged
- Test execution time similar to baseline

**Expected Outcome:**
- 493/493 tests passing
- Zero test failures related to color changes
- Coverage report identical to baseline
- No functional regressions detected

---

## Task 6: Visual Regression Testing
**Objective**: Verify no visual degradation in text readability

**Steps:**
1. Start dev server:
   ```bash
   npm run dev
   ```
2. Take screenshots of key pages (same as baseline):
   - Dashboard (client view) - `/dashboard` as CLIENT
   - Dashboard (specialist view) - `/dashboard` as SPECIALIST
   - Gig browse page - `/dashboard/gigs`
   - Gig detail page - `/dashboard/gigs/[id]`
   - Gig creation form - `/dashboard/gigs/new`
   - Profile page - `/dashboard/profile`
   - Admin dashboard - `/admin`
3. Compare side-by-side with baseline screenshots:
   - Check text readability
   - Verify hierarchy is clear
   - Look for any contrast issues
4. Test on different backgrounds:
   - `bg-surface-level-0` (primary page background)
   - `bg-surface-level-1` (card backgrounds)
   - `bg-surface-level-2` (nested cards)
5. Test in different browsers:
   - Chrome
   - Firefox
   - Safari (if available)

**Test Plan:**
- Visual comparison shows no degradation
- Text is readable on all backgrounds
- Hierarchy is clear and consistent
- No contrast issues identified

**Expected Outcome:**
- Text readability maintained or improved
- Clear visual hierarchy
- No contrast issues
- Consistent appearance across browsers

---

## Task 7: Contrast Ratio Verification
**Objective**: Verify WCAG AA compliance for all text colors

**Steps:**
1. Calculate contrast ratios:
   - `text-neutral-strong` (rgba(255, 255, 255, 1.00)) on `bg-surface-level-0` (rgba(1, 3, 14, 1.00))
   - `text-neutral-weak` (rgba(178, 178, 178, 1.00)) on `bg-surface-level-0` (rgba(1, 3, 14, 1.00))
   - `text-neutral-weak` on `bg-surface-level-1` (rgba(6, 8, 19, 1.00))
   - `text-neutral-weak` on `bg-surface-level-2` (rgba(16, 18, 28, 1.00))

2. Use online contrast checker (e.g., WebAIM Contrast Checker):
   - https://webaim.org/resources/contrastchecker/
   - Input foreground and background colors
   - Verify WCAG AA compliance (4.5:1 for normal text, 3:1 for large text)

3. Run automated accessibility tests:
   ```bash
   # If axe-core or similar is available
   npm run test:a11y
   ```

4. Document contrast ratios in change archive

**Test Plan:**
- All text colors meet WCAG AA standards
- Normal text (< 18pt): minimum 4.5:1 contrast ratio
- Large text (≥ 18pt): minimum 3:1 contrast ratio
- No accessibility violations detected

**Expected Outcome:**
- `text-neutral-strong` on all backgrounds: ≥ 4.5:1 (PASS)
- `text-neutral-weak` on all backgrounds: ≥ 4.5:1 (PASS)
- All text meets WCAG AA standards
- Zero accessibility violations

---

## Task 8: Documentation Update
**Objective**: Update design system documentation with text color guidelines

**Steps:**
1. Update `docs/DESIGN_SYSTEM.md`:
   - Add section on text color token usage
   - Document `text-neutral-strong` vs `text-neutral-weak` guidelines
   - Provide examples of correct usage
   - Add migration notes for future reference

2. Update `openspec/project.md`:
   - Add completed change to "Completed Changes" section
   - Document token migration completion

3. Update `openspec/specs/ui/spec.md`:
   - Add requirement for text color token usage
   - Document scenarios for text hierarchy

4. Create migration guide snippet for future reference:
   ```markdown
   ## Text Color Migration (Completed)

   All text colors now use design tokens:
   - Primary text: `text-neutral-strong` (white)
   - Secondary text: `text-neutral-weak` (light gray)

   Do NOT use manual gray classes for text:
   - ❌ `text-gray-300`, `text-gray-400`, `text-gray-500`
   - ✅ `text-neutral-strong`, `text-neutral-weak`
   ```

**Test Plan:**
- Documentation is clear and accurate
- Examples are correct and helpful
- Migration notes are complete

**Expected Outcome:**
- DESIGN_SYSTEM.md updated with text color guidelines
- project.md includes completed change entry
- Clear guidance for future developers

---

## Task 9: Final Verification and Commit
**Objective**: Final checks before committing changes

**Steps:**
1. Run final grep verification:
   ```bash
   grep -r "text-gray-[345]00" --include="*.tsx" --include="*.jsx" app/
   # Should return zero results
   ```

2. Review git diff:
   ```bash
   git diff --stat
   # Should show ~32 files changed
   git diff
   # Review all changes for correctness
   ```

3. Run full test suite one more time:
   ```bash
   npm test && npm run test:e2e
   ```

4. Build production bundle:
   ```bash
   npm run build
   ```

5. Create atomic commit:
   ```bash
   git add app/
   git commit -m "$(cat <<'EOF'
   Migrate text colors to design token system

   Replace manual text-gray-* classes with semantic text-neutral-* tokens:
   - text-gray-300 → text-neutral-strong (primary text)
   - text-gray-400 → text-neutral-weak (secondary text)
   - text-gray-500 → text-neutral-weak (tertiary text)

   Changes:
   - Updated 32 component files across auth, dashboard, gig, profile, admin pages
   - Replaced 196 instances of manual gray classes
   - Verified WCAG AA contrast compliance
   - All 493 tests passing
   - Visual regression testing completed

   Benefits:
   - Consistent with existing token system (bg-surface-level-*, border-neutral-*)
   - Clear semantic hierarchy (strong vs weak)
   - Single source of truth in design-tokens.json
   - Easier to maintain and update

   Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
   EOF
   )"
   ```

6. Push to remote (if applicable):
   ```bash
   git push origin main
   ```

**Test Plan:**
- Zero remaining text-gray instances
- Git diff shows only expected changes
- All tests passing
- Build successful
- Commit message is clear and complete

**Expected Outcome:**
- Clean commit with all changes
- Zero remaining manual text-gray classes
- All tests passing
- Production build successful
- Change fully documented and committed
