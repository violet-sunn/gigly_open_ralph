# Breadcrumb Navigation - Test Plan

## Regression Testing

### Unit Tests
```bash
npm run test:unit -- breadcrumb.test.tsx
```
**Expected:** 7/7 tests passing
- Component renders correct number of items
- Links have correct href attributes
- Current item has aria-current="page"
- Long labels are truncated
- Separators rendered between items
- CSS classes applied correctly
- Two-level breadcrumb handled

### Full Test Suite
```bash
npm run test:unit
```
**Expected:** 704/704 tests passing (no regressions)

### Build Verification
```bash
npm run build
```
**Expected:** Successful compilation with no errors

---

## Manual Testing

### Gig Detail Pages
1. **As SPECIALIST:**
   - Navigate to `/gigs` → click any gig
   - Verify breadcrumb: "Dashboard > Browse Gigs > [Gig Title]"
   - Click "Dashboard" → verify navigation to `/dashboard`
   - Click "Browse Gigs" → verify navigation to `/gigs`

2. **As CLIENT:**
   - Navigate to a gig detail page
   - Verify breadcrumb: "Dashboard > [Gig Title]"
   - Click "Dashboard" → verify navigation

3. **As ADMIN:**
   - Navigate to a gig detail page
   - Verify breadcrumb: "Dashboard > [Gig Title]"

### Profile Pages
1. Navigate to `/profile`
   - Verify breadcrumb: "Dashboard > Profile"

2. Navigate to `/profile/edit`
   - Verify breadcrumb: "Dashboard > Profile > Edit"
   - Click "Profile" → verify navigation to `/profile`

3. Navigate to `/profile/[userId]` (another user)
   - Verify breadcrumb: "Dashboard > Profile > [User Name]"

### Admin Pages
1. **As ADMIN:**
   - Navigate to `/admin/users`
   - Verify breadcrumb: "Admin > Users"
   - Click "Admin" → verify navigation to `/admin`

2. Navigate to `/admin/gigs`
   - Verify breadcrumb: "Admin > Gigs"

3. Navigate to `/admin`
   - Verify NO breadcrumb present (top-level page)

---

## Responsive Testing

### Desktop (>= 768px)
- Open any page with 3-level breadcrumb
- Verify all levels visible
- Verify no ellipsis shown

### Mobile (< 768px)
- Open any page with 3-level breadcrumb
- Verify shows: "First > ... > Last"
- Verify middle items hidden
- Open any page with 2-level breadcrumb
- Verify both levels visible (no ellipsis)

---

## Accessibility Testing

### Keyboard Navigation
1. Tab to breadcrumb links
2. Verify each link is focusable
3. Press Enter on focused link
4. Verify navigation occurs

### Screen Reader
1. Use screen reader (NVDA/JAWS/VoiceOver)
2. Navigate to breadcrumb
3. Verify announced as "Breadcrumb navigation"
4. Verify current page announced with "current page"

### ARIA Attributes
- Inspect breadcrumb nav element
- Verify `aria-label="Breadcrumb"` present
- Verify current item has `aria-current="page"`

---

## Visual Verification

### Design Tokens
- Inspect breadcrumb styles
- Verify links use `text-neutral-strong`
- Verify current page uses `text-neutral-weak`
- Verify hover state uses `hover:text-white`
- Verify separator uses `text-neutral-weak`
- Verify font size is `text-sm`

### Spacing
- Verify bottom margin is `mb-6`
- Verify separator spacing is `mx-2`
- Verify consistent spacing across all pages

### Truncation
- Create/find a gig with title > 50 characters
- Verify title truncated with "..."
- Hover over truncated title
- Verify tooltip shows full title

---

## E2E Testing (Optional)

```bash
npm run test:e2e -- breadcrumb-navigation.spec.ts
```

**Note:** E2E tests may require stopping dev server on port 3000 first.

**Expected:** 18/18 tests passing covering:
- Gig detail breadcrumbs (SPECIALIST, CLIENT, ADMIN)
- Profile breadcrumbs (view, edit, public)
- Admin breadcrumbs (users, gigs)
- Breadcrumb navigation
- Responsive behavior
- Accessibility

---

## Smoke Test Checklist

- [ ] Unit tests pass (7/7)
- [ ] Full test suite passes (704/704)
- [ ] Build succeeds
- [ ] Breadcrumbs appear on gig detail pages
- [ ] Breadcrumbs appear on profile pages
- [ ] Breadcrumbs appear on admin pages
- [ ] Admin dashboard has NO breadcrumbs
- [ ] Breadcrumb links navigate correctly
- [ ] Responsive behavior works on mobile
- [ ] Keyboard navigation works
- [ ] Design tokens used consistently
- [ ] No visual regressions
