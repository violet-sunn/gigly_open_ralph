# Tasks: UI Consistency Audit

## Task 1: Set up audit infrastructure and checklist

**Implementation:**
- Create audit checklist document with all consistency criteria
- Set up axe-core for automated accessibility testing
- Prepare test environment for responsive testing (browser dev tools)
- Document baseline patterns from Dashboard (Phase 5) as reference

**Checklist items:**
- [ ] Spacing rhythm (gap-6, p-5/p-6, gap-9 to gap-12)
- [ ] Status badge colors (semantic system)
- [ ] Interactive states (hover/focus)
- [ ] Primary CTA styling (blue buttons)
- [ ] Responsive behavior (320px, 1920px)
- [ ] Text contrast ratios (WCAG AA)
- [ ] Token usage vs ad-hoc styles

**Test plan:**
- Verify checklist covers all audit dimensions from proposal
- Verify axe-core is installed and runnable: `npm install -D @axe-core/playwright`
- Verify browser dev tools can simulate 320px and 1920px viewports

---

## Task 2: Audit authentication pages (3 pages)

**Pages:**
1. Homepage (`/`)
2. Registration (`/register`)
3. Login (`/login`)

**Implementation:**
- Review each page against audit checklist
- Document inconsistencies in findings document
- Take screenshots for visual reference
- Run axe-core accessibility audit on each page
- Test responsive behavior on 320px and 1920px viewports

**Findings to document:**
- Spacing inconsistencies (specific elements and current values)
- Missing or incorrect hover/focus states
- Button styling inconsistencies
- Contrast ratio violations
- Ad-hoc styles that should use tokens

**Test plan:**
- Manual QA: Navigate to each page and verify against checklist
- Automated: Run axe-core on each page, verify zero violations
- Responsive: Test on 320px (mobile) and 1920px (desktop), verify no horizontal scroll
- Verify all existing tests pass: `npm test -- auth`

---

## Task 3: Audit dashboard pages (2 pages)

**Pages:**
1. Dashboard - Client (`/dashboard` with CLIENT role)
2. Dashboard - Specialist (`/dashboard` with SPECIALIST role)

**Implementation:**
- Review each dashboard variant against audit checklist
- Verify status badge colors match semantic system
- Verify card spacing and padding consistency
- Verify tab styling (Specialist dashboard)
- Document any inconsistencies

**Specific checks:**
- Client dashboard: "My Gigs" card spacing, status badges, hover states
- Specialist dashboard: Tab styling, "Active Work" / "Pending Applications" / "Archive" sections
- Both: Profile completion hints, navigation links, sign-out button

**Test plan:**
- Manual QA: Log in as CLIENT and SPECIALIST, verify against checklist
- Automated: Run axe-core on both dashboard variants
- Responsive: Test on 320px and 1920px viewports
- Verify all existing tests pass: `npm test -- dashboard`

---

## Task 4: Audit gig pages (4 pages)

**Pages:**
1. Gig Creation (`/dashboard/gigs/new`)
2. Gig Browse (`/dashboard/gigs`)
3. Gig Examples (`/dashboard/gigs/examples`)
4. Gig Detail (`/dashboard/gigs/[id]`)

**Implementation:**
- Review each page against audit checklist
- Verify form styling consistency (gig creation)
- Verify card hierarchy and spacing (browse, examples)
- Verify two-column layout and action forms (detail)
- Verify status badges across all gig pages

**Specific checks:**
- Gig Creation: Form section styling, field spacing, button prominence, character counters
- Gig Browse: Filter panel, card spacing, pagination controls, status badges
- Gig Examples: Example badges (blue accent), card layout
- Gig Detail: Main content cards, sidebar, application cards, action forms, status badges

**Test plan:**
- Manual QA: Navigate through gig creation, browse, and detail flows
- Automated: Run axe-core on all 4 pages
- Responsive: Test on 320px and 1920px viewports
- Verify all existing tests pass: `npm test -- gig`

---

## Task 5: Audit profile pages (3 pages)

**Pages:**
1. Profile View (`/dashboard/profile`)
2. Profile Edit (`/dashboard/profile/edit`)
3. Public Profile (`/dashboard/profile/[userId]`)

**Implementation:**
- Review each page against audit checklist
- Verify header card consistency across view and edit
- Verify 2-column grid layout (edit page)
- Verify form styling consistency (edit page)
- Verify responsive stacking on mobile

**Specific checks:**
- Profile View: Header card, info cards, 2-column layout
- Profile Edit: Header card, form grid, field styling, Save/Cancel buttons
- Public Profile: Read-only display, hidden sensitive fields

**Test plan:**
- Manual QA: Navigate through profile view, edit, and public profile
- Automated: Run axe-core on all 3 pages
- Responsive: Test on 320px and 1920px viewports
- Verify all existing tests pass: `npm test -- profile`

---

## Task 6: Audit admin pages (2 pages)

**Pages:**
1. Admin Dashboard (`/admin`)
2. Admin User/Gig Management (`/admin/users`, `/admin/gigs`)

**Implementation:**
- Review each page against audit checklist
- Verify statistics cards styling (admin dashboard)
- Verify table styling and pagination (user/gig management)
- Verify action buttons (suspend, close) styling
- Verify filter controls consistency

**Specific checks:**
- Admin Dashboard: Statistics cards, spacing, navigation links
- User Management: Table layout, pagination, filter controls, action buttons
- Gig Management: Table layout, pagination, filter controls, close button

**Test plan:**
- Manual QA: Log in as ADMIN, navigate through admin pages
- Automated: Run axe-core on all admin pages
- Responsive: Test on 320px and 1920px viewports
- Verify all existing tests pass: `npm test -- admin`

---

## Task 7: Apply consistency fixes to all pages

**Implementation:**
- Based on audit findings from Tasks 2-6, apply fixes page by page
- Update spacing to match Dashboard patterns (gap-6, p-5/p-6, gap-9 to gap-12)
- Update status badge colors to match semantic system
- Add missing hover/focus states
- Fix any contrast ratio violations
- Update button styling to match primary CTA patterns

**Approach:**
- Fix one page at a time, commit after each page
- Run tests after each page to catch regressions early
- Use git commits with clear messages: "fix: apply consistent spacing to [page]"
- If a fix breaks tests, investigate and adjust (but tests should not break for visual-only changes)

**Test plan:**
- After each page fix: Run full test suite, verify zero regressions
- After each page fix: Manual QA against checklist
- After all fixes: Run full test suite one final time
- After all fixes: Manual QA all 14 pages against checklist

---

## Task 8: Document ad-hoc styles and token recommendations

**Implementation:**
- Review all pages for hardcoded color/spacing values
- Document ad-hoc styles that should use design tokens
- Provide recommendations for appropriate token equivalents
- Create a migration plan document (if needed for future work)

**Documentation format:**
```markdown
## Ad-hoc Styles Audit

### Page: [Page Name]
- **Location:** [Component/file path]
- **Current style:** `bg-gray-800` (hardcoded)
- **Recommended token:** `bg-surface-level-1`
- **Priority:** Low/Medium/High
- **Notes:** [Any context or considerations]
```

**Test plan:**
- Review documentation for completeness
- Verify all ad-hoc styles are documented
- Verify recommendations are actionable

---

## Task 9: Run comprehensive accessibility audit

**Implementation:**
- Install and configure axe-core for Playwright
- Create automated accessibility test script
- Run axe-core on all 14 pages
- Document any violations
- Fix critical and serious violations
- Document moderate/minor violations for future work

**Test script:**
```typescript
// __tests__/e2e/accessibility-audit.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Audit', () => {
  test('Homepage meets WCAG AA standards', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  // ... repeat for all 14 pages
});
```

**Test plan:**
- Run accessibility test suite: `npm run test:e2e -- accessibility-audit`
- Verify zero critical/serious violations
- Document moderate/minor violations
- Manual verification of contrast ratios with browser dev tools

---

## Task 10: Create visual regression test baseline (optional)

**Implementation:**
- Set up Playwright screenshot testing
- Capture baseline screenshots of all 14 pages
- Store baselines in `__tests__/e2e/screenshots/baseline/`
- Create visual regression test script
- Document how to update baselines when intentional changes are made

**Test script:**
```typescript
// __tests__/e2e/visual-regression.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('Homepage matches baseline', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveScreenshot('homepage.png');
  });

  // ... repeat for all 14 pages
});
```

**Test plan:**
- Run visual regression tests: `npm run test:e2e -- visual-regression`
- Verify all screenshots are captured
- Verify baselines are stored correctly
- Document baseline update process in TESTING.md

---

## Task 11: Final verification and documentation

**Implementation:**
- Run full test suite one final time: `npm test`
- Verify all 493+ tests pass with zero regressions
- Complete manual QA checklist for all 14 pages
- Document audit findings and fixes in change summary
- Update CHANGELOG.md with consistency improvements
- Create PR with detailed description

**Manual QA checklist:**
- [ ] All 14 pages use consistent spacing rhythm
- [ ] All status badges use semantic color system
- [ ] All interactive elements have proper hover/focus states
- [ ] All pages are responsive on 320px and 1920px
- [ ] All text meets WCAG AA contrast ratios
- [ ] All primary CTAs use consistent blue styling
- [ ] No horizontal scrolling on any viewport
- [ ] No functional regressions

**Test plan:**
- Full test suite: `npm test` (all 493+ tests passing)
- E2E test suite: `npm run test:e2e` (all tests passing)
- Accessibility audit: Zero critical/serious violations
- Manual QA: All checklist items verified
- Build verification: `npm run build` (successful build)

---

## Summary

**Total tasks:** 11
**Estimated effort:** 2-3 days
**Risk level:** Low (visual-only changes, comprehensive test coverage)

**Dependencies:**
- Tasks 2-6 can be done in parallel (audit phase)
- Task 7 depends on Tasks 2-6 (fix phase)
- Tasks 8-10 can be done in parallel after Task 7
- Task 11 depends on all previous tasks (verification phase)

**Success criteria:**
- All 14 pages audited and fixed
- Full test suite passes (493+ tests)
- Zero accessibility violations (critical/serious)
- Manual QA checklist completed
- Documentation updated
