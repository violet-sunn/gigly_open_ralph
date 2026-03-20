# Implementation Tasks: UI Profile Pages Token Migration

## Task 1: Migrate CLIENT Profile View to Token-Based Styling

**Objective:** Update CLIENT profile view page to use design tokens, matching the visual hierarchy established in SPECIALIST profile view and Dashboard pages.

**Implementation Notes:**
- File: `app/(protected)/profile/page.tsx` (CLIENT section only, lines 182-311)
- Replace hardcoded colors with design tokens:
  - Page background: `bg-navy-900` → `bg-[var(--bg-surface-level-0)]`
  - Cards: `bg-navy-800 border-gray-700` → `bg-surface-level-1 border-neutral-weak`
  - Text colors: maintain existing hierarchy with `text-white`, `text-gray-300`, `text-gray-400`
- Update button styling:
  - "Edit Profile" button: ensure `bg-blue-500 hover:bg-blue-600` with focus states
  - Edit links: ensure `text-blue-500 hover:text-blue-400`
- Preserve all existing functionality:
  - Stats display (rating, orders, completed)
  - Navigation links
  - Avatar generation logic
  - Profile data display
- Do NOT modify SPECIALIST section (lines 12-181) - already migrated

**Test Plan:**
1. Login as CLIENT user with complete profile
2. Navigate to `/profile`
3. Verify visual consistency:
   - Page background matches SPECIALIST profile view
   - Cards use same hierarchy as Dashboard
   - Spacing matches rhythm (gap-6, p-6)
4. Test navigation:
   - Click "Edit Profile" → navigates to `/profile/edit`
   - Click "Редактировать" links → navigates to `/profile/edit`
   - Click "Создать заказ" → navigates to `/gigs/new`
5. Test with incomplete profile (no clientProfile record)
6. Verify responsive behavior on mobile (< 1024px)
7. Run accessibility audit (keyboard navigation, screen reader)

**Acceptance Criteria:**
- [ ] Page background uses `bg-[var(--bg-surface-level-0)]`
- [ ] All cards use `bg-surface-level-1 border border-neutral-weak`
- [ ] Card spacing uses `gap-6` and `mb-6`
- [ ] Primary button uses solid blue with focus states
- [ ] Edit links use text blue styling
- [ ] All navigation works identically
- [ ] Profile data displays correctly
- [ ] No hardcoded navy/gray colors remain in CLIENT section
- [ ] SPECIALIST section unchanged

---

## Task 2: Create Profile Edit Header Card Component

**Objective:** Create a reusable header card component for the profile edit page that matches the visual structure of profile view pages.

**Implementation Notes:**
- Create new component: `app/(protected)/profile/edit/ProfileEditHeader.tsx`
- Component props:
  ```typescript
  interface ProfileEditHeaderProps {
    displayName: string | null
    email: string
    role: 'CLIENT' | 'SPECIALIST'
  }
  ```
- Component structure:
  - Avatar circle with user initial (read-only)
  - Display name or email
  - Role label ("Specialist" or "Client")
- Styling:
  - Container: `bg-surface-level-1 border border-neutral-weak rounded-lg p-6 shadow-md`
  - Avatar: circular, same size as view pages
  - Text: `text-white` for name, `text-gray-300` for role
- Match visual structure of:
  - SPECIALIST profile view header (lines 66-121 in profile/page.tsx)
  - CLIENT profile view header (lines 217-253 in profile/page.tsx)

**Test Plan:**
1. Verify component renders correctly for SPECIALIST role
2. Verify component renders correctly for CLIENT role
3. Verify avatar displays correct initial
4. Verify fallback to email when displayName is null
5. Verify responsive behavior on mobile

**Acceptance Criteria:**
- [ ] Component created with correct TypeScript interface
- [ ] Avatar displays user initial correctly
- [ ] Display name or email shown correctly
- [ ] Role label displays correctly
- [ ] Styling matches view page headers
- [ ] Component is reusable for both roles

---

## Task 3: Migrate Profile Edit Form to 2-Column Layout with Token-Based Styling

**Objective:** Update ProfileEditForm component to use 2-column grid layout matching view pages, with token-based styling for all form elements.

**Implementation Notes:**
- Files:
  - `app/(protected)/profile/edit/page.tsx` (wrapper page)
  - `app/(protected)/profile/edit/ProfileEditForm.tsx` (form component)
- Layout changes:
  - Add ProfileEditHeader component at top
  - Wrap form fields in 2-column grid: `grid grid-cols-1 lg:grid-cols-2 gap-6`
  - SPECIALIST: left column (Display Name, Tech Stack, Experience Level), right column (Bio textarea)
  - CLIENT: left column (Company Name, INN, KPP), right column (Contact Person, Phone Number)
  - Each column wrapped in card: `bg-surface-level-1 border border-neutral-weak rounded-lg p-6 shadow-md`
- Form field styling:
  - Inputs: `border-gray-600 focus:border-blue-500 focus:ring-blue-500 bg-navy-800 text-white`
  - Textareas: same as inputs
  - Labels: `text-gray-300` or `text-gray-400`
  - Placeholders: `placeholder:text-gray-400`
- Button styling:
  - Save button: `bg-blue-500 hover:bg-blue-600 text-white focus:ring-2 focus:ring-blue-500`
  - Cancel link: `text-gray-400 hover:text-gray-300`
  - Position buttons below grid in full-width row
- Preserve all existing functionality:
  - Form field names unchanged
  - Validation logic unchanged
  - `updateProfile` server action unchanged
  - Error display unchanged
  - Pre-fill logic unchanged

**Test Plan:**
1. Login as SPECIALIST user with existing profile
2. Navigate to `/profile/edit`
3. Verify layout:
   - Header card displays correctly
   - 2-column grid renders correctly
   - Fields positioned in correct columns
   - Cards use token-based styling
4. Test form functionality:
   - Fields pre-filled with existing data
   - Can edit all fields
   - Validation works (no changes expected)
   - Submit form → redirects to `/profile`
   - Cancel link → navigates to `/profile`
5. Test error handling:
   - Submit with invalid data → error displays correctly
6. Repeat tests for CLIENT user
7. Test responsive behavior on mobile (columns stack)
8. Test with user who has no profile yet
9. Run accessibility audit (form labels, keyboard navigation)

**Acceptance Criteria:**
- [ ] ProfileEditHeader component integrated
- [ ] 2-column grid layout implemented
- [ ] Form fields positioned correctly for both roles
- [ ] All form fields use token-based styling
- [ ] Save button uses solid blue with focus states
- [ ] Cancel link uses text gray styling
- [ ] All form field names preserved
- [ ] All validation logic preserved
- [ ] Form submission works identically
- [ ] Error display works identically
- [ ] Pre-fill logic works identically
- [ ] Responsive layout works on mobile
- [ ] No changes to `updateProfile` server action

---

## Task 4: Migrate Public Profile Pages to Token-Based Styling

**Objective:** Update public profile pages for both SPECIALIST and CLIENT roles to use design tokens, maintaining consistency with authenticated profile views.

**Implementation Notes:**
- File: `app/(protected)/profile/[userId]/page.tsx`
- Update SPECIALIST public profile section (lines 42-69):
  - Container: `bg-[var(--bg-surface-level-0)]` or `bg-navy-900`
  - Card: `bg-navy-800 border-gray-700` → `bg-surface-level-1 border border-neutral-weak`
  - Labels: ensure `text-gray-300` or `text-gray-400`
  - Values: ensure `text-white`
- Update CLIENT public profile section (lines 72-90):
  - Same token-based styling as SPECIALIST section
- Update error states (lines 33-39, 93-100):
  - Error card: `bg-error-500/10 border-error-500/20 text-error-500` (already using tokens)
  - "Not available" card: `bg-navy-800 border-gray-700` → `bg-surface-level-1 border border-neutral-weak`
- Preserve all existing functionality:
  - Sensitive information hiding (email, INN, KPP, phone)
  - Own profile redirect logic
  - User not found handling
  - No profile available handling

**Test Plan:**
1. Login as SPECIALIST user
2. Navigate to another SPECIALIST's public profile
3. Verify styling:
   - Page background uses token-based color
   - Profile card uses token-based styling
   - Text colors consistent
4. Verify sensitive info hidden (email not shown)
5. Navigate to own public profile URL → verify redirect to `/profile`
6. Navigate to non-existent user → verify error display
7. Repeat tests for CLIENT viewing CLIENT public profile
8. Test cross-role viewing (CLIENT viewing SPECIALIST, vice versa)
9. Test user with no profile → verify "not available" message

**Acceptance Criteria:**
- [ ] SPECIALIST public profile uses token-based styling
- [ ] CLIENT public profile uses token-based styling
- [ ] Error states use token-based styling
- [ ] Sensitive information hiding preserved
- [ ] Own profile redirect preserved
- [ ] User not found handling preserved
- [ ] No profile available handling preserved
- [ ] All existing functionality works identically

---

## Task 5: Verification and Testing

**Objective:** Comprehensive verification that all profile pages use token-based styling and all functionality is preserved.

**Implementation Notes:**
- Run full test suite
- Visual verification against reference implementations
- Accessibility audit
- Cross-browser testing

**Test Plan:**
1. Run existing E2E test suites:
   - `npm run test:e2e` (all profile-related tests)
   - Verify all tests pass without modification
2. Visual verification:
   - Compare CLIENT profile view with SPECIALIST profile view (consistency)
   - Compare profile edit pages with view pages (layout consistency)
   - Compare with Dashboard pages (design system consistency)
   - Verify spacing rhythm matches (gap-6, p-6, mb-6)
3. Manual testing flows:
   - CLIENT journey: register → complete profile → view profile → edit profile → save
   - SPECIALIST journey: register → complete profile → view profile → edit profile → save
   - Public profile viewing: view other users' profiles
   - Profile completion hints: verify dashboard hints still work
4. Accessibility audit:
   - Keyboard navigation (tab through all interactive elements)
   - Screen reader testing (form labels, button labels, error messages)
   - Color contrast verification (WCAG AA minimum)
   - Focus states visible and functional
5. Responsive testing:
   - Mobile (320px, 375px, 414px)
   - Tablet (768px, 1024px)
   - Desktop (1280px, 1440px, 1920px)
6. Cross-browser testing:
   - Chrome
   - Firefox
   - Safari
   - Edge

**Acceptance Criteria:**
- [ ] All existing E2E tests pass without modification
- [ ] Visual consistency verified across all profile pages
- [ ] Spacing rhythm consistent (gap-6, p-6, mb-6)
- [ ] All manual testing flows pass
- [ ] Keyboard navigation works correctly
- [ ] Screen reader announces all elements correctly
- [ ] Color contrast meets WCAG AA standards
- [ ] Focus states visible and functional
- [ ] Responsive layouts work on all viewport sizes
- [ ] Cross-browser compatibility verified
- [ ] No functional regressions identified
- [ ] Profile completion hints still work on dashboard

---

## Implementation Order

1. **Task 1** (CLIENT profile view) - Establishes token-based styling pattern
2. **Task 2** (Header card component) - Creates reusable component for edit pages
3. **Task 3** (Profile edit form) - Implements 2-column layout with tokens
4. **Task 4** (Public profiles) - Completes token migration for all profile pages
5. **Task 5** (Verification) - Ensures quality and no regressions

## Rollback Plan

If critical issues are discovered:
1. Revert commits in reverse order (Task 4 → Task 3 → Task 2 → Task 1)
2. Each task is self-contained and can be reverted independently
3. SPECIALIST profile view remains unchanged (already migrated)

## Notes

- **IMPORTANT:** Do NOT modify SPECIALIST profile view page (already migrated in `specialist-profile-ui-tokens`)
- Preserve all form field names and validation logic
- Maintain profile completion logic for dashboard hints
- Follow spacing rhythm established in Dashboard pages (gap-6, p-6, mb-6)
- Use solid blue (#1379f3) for primary CTAs
- Use text blue for edit links
- Ensure all existing tests pass without modification
