# Manual Testing Guide: Visual Regression & Accessibility

This guide provides step-by-step instructions for completing the manual validation tasks that cannot be automated.

---

## Task 4: Visual Regression Testing

### Prerequisites
- Development server must be running
- Browser with DevTools (Chrome/Firefox recommended)

### Setup
```bash
# Start the development server
npm run dev

# Server will start at http://localhost:3000
```

### Testing Procedure

For each page listed below, perform the following checks:

#### Visual Consistency Checklist
- [ ] Page renders without console errors
- [ ] Colors match design token values (dark navy backgrounds, proper text contrast)
- [ ] No visual inconsistencies or regressions
- [ ] Hover states work correctly (buttons, links, interactive elements)
- [ ] Focus states are visible (tab through interactive elements)
- [ ] Dark backgrounds use correct tokens
- [ ] Light text on dark backgrounds is readable
- [ ] Layout is responsive (test at 320px, 768px, 1024px, 1920px widths)

#### Pages to Test

1. **Landing Page**
   - URL: `http://localhost:3000/`
   - Focus: Hero section, navigation, CTA buttons

2. **Login Page**
   - URL: `http://localhost:3000/login`
   - Focus: Form inputs, error states, submit button

3. **Register Page**
   - URL: `http://localhost:3000/register`
   - Focus: Role selection cards, form inputs, validation messages

4. **Client Dashboard**
   - URL: `http://localhost:3000/dashboard` (login as CLIENT)
   - Focus: Gig cards, status badges, profile completion card

5. **Specialist Dashboard**
   - URL: `http://localhost:3000/dashboard` (login as SPECIALIST)
   - Focus: Application tabs, status badges, empty states

6. **Gig Browse Page**
   - URL: `http://localhost:3000/dashboard/gigs` (login as SPECIALIST)
   - Focus: Filter panel, gig cards, pagination controls

7. **Gig Detail Page**
   - URL: `http://localhost:3000/dashboard/gigs/[id]` (use any gig ID)
   - Focus: Gig details, application forms, messaging section

8. **Gig Creation Page**
   - URL: `http://localhost:3000/dashboard/gigs/new` (login as CLIENT)
   - Focus: Form inputs, budget preview box, validation messages

9. **Profile Page**
   - URL: `http://localhost:3000/dashboard/profile`
   - Focus: Profile form, edit mode, public profile view

10. **Admin Dashboard**
    - URL: `http://localhost:3000/admin` (login as ADMIN)
    - Focus: Statistics cards, navigation

11. **Admin User Management**
    - URL: `http://localhost:3000/admin/users`
    - Focus: User table, filter controls, action buttons

12. **Admin Gig Management**
    - URL: `http://localhost:3000/admin/gigs`
    - Focus: Gig table, filter controls, action buttons

### Known Issues to Verify

Based on the grep audit, the following components still use old colors and should be visually inspected:

- **Gig creation form**: Budget preview box (line 247)
- **Gig detail page**: Messaging section, moderation logs
- **Notification dropdown**: Background and border colors
- **Pagination controls**: Button styling
- **Gig filters**: Input fields and labels
- **Dashboard**: Status badges
- **Register page**: Role selection cards
- **Onboarding components**: Empty states, profile completion card, welcome modal

### Recording Results

Document findings in a spreadsheet or markdown table:

| Page | Console Errors | Visual Issues | Hover States | Focus States | Notes |
|------|----------------|---------------|--------------|--------------|-------|
| Landing | ✅ None | ✅ Good | ✅ Working | ✅ Visible | - |
| Login | ... | ... | ... | ... | ... |

---

## Task 5: Accessibility Audit

### Prerequisites
- Development server running
- Chrome browser (Lighthouse is built-in)

### Setup
```bash
# Start the development server (if not already running)
npm run dev
```

### Testing Procedure

For each key page, run a Lighthouse accessibility audit:

#### Steps
1. Open Chrome DevTools (F12 or Ctrl+Shift+I)
2. Navigate to the "Lighthouse" tab
3. Select "Accessibility" category only (uncheck others for faster results)
4. Select "Desktop" or "Mobile" device
5. Click "Analyze page load"
6. Wait for report to generate
7. Review score and issues

#### Target Metrics
- **Accessibility Score:** ≥90 (out of 100)
- **Color Contrast:** All text must meet WCAG AA standards
  - Normal text: 4.5:1 contrast ratio
  - Large text (18pt+): 3:1 contrast ratio
- **Focus Indicators:** All interactive elements must have visible focus states
- **Keyboard Navigation:** All functionality must be accessible via keyboard

#### Pages to Audit

1. **Landing Page** (`/`)
2. **Login Page** (`/login`)
3. **Register Page** (`/register`)
4. **Dashboard** (`/dashboard`)
5. **Gig Browse** (`/dashboard/gigs`)
6. **Gig Detail** (`/dashboard/gigs/[id]`)
7. **Gig Creation** (`/dashboard/gigs/new`)
8. **Profile Page** (`/dashboard/profile`)
9. **Admin Dashboard** (`/admin`)

#### Common Accessibility Issues to Check

- [ ] **Color Contrast**: Text on backgrounds meets minimum ratios
- [ ] **Focus Indicators**: Visible focus rings on all interactive elements
- [ ] **Form Labels**: All inputs have associated labels
- [ ] **Alt Text**: Images have descriptive alt attributes
- [ ] **Heading Hierarchy**: Proper h1 → h2 → h3 structure
- [ ] **ARIA Labels**: Interactive elements have proper ARIA attributes
- [ ] **Keyboard Navigation**: Tab order is logical, all actions accessible via keyboard
- [ ] **Link Text**: Links have descriptive text (not "click here")

### Recording Results

Document findings in a table:

| Page | Score | Color Contrast Issues | Focus Issues | Other Issues | Notes |
|------|-------|----------------------|--------------|--------------|-------|
| Landing | 95 | None | None | None | ✅ Pass |
| Login | ... | ... | ... | ... | ... |

### Automated Accessibility Testing (Optional)

For more comprehensive testing, consider using:

```bash
# Install axe-core CLI (optional)
npm install -g @axe-core/cli

# Run automated accessibility tests
axe http://localhost:3000 --save results.json
```

---

## Completing the Validation

After completing both manual testing tasks:

1. **Document all findings** in the validation report
2. **Update DESIGN_SYSTEM.md** with any new issues discovered
3. **Create follow-up tasks** for any accessibility or visual issues found
4. **Re-run automated validation** to confirm no regressions:
   ```bash
   npm run validate:tokens
   npm run test:unit
   ```

5. **Update migration status** in DESIGN_SYSTEM.md when all issues are resolved

---

## Quick Reference

### Test User Credentials

Create test users via the register page or use seed data:

```bash
# Run seed script to create example users
npm run prisma db seed
```

**Example credentials** (if using seed data):
- CLIENT: `client@example.com` / `password123`
- SPECIALIST: `specialist@example.com` / `password123`
- ADMIN: `admin@example.com` / `password123`

### Useful Browser DevTools Shortcuts

- **Open DevTools**: F12 or Ctrl+Shift+I (Windows/Linux), Cmd+Option+I (Mac)
- **Toggle Device Toolbar**: Ctrl+Shift+M (Windows/Linux), Cmd+Shift+M (Mac)
- **Inspect Element**: Ctrl+Shift+C (Windows/Linux), Cmd+Shift+C (Mac)
- **Console**: Ctrl+Shift+J (Windows/Linux), Cmd+Option+J (Mac)

### Responsive Testing Breakpoints

- **Mobile**: 320px, 375px, 414px
- **Tablet**: 768px, 1024px
- **Desktop**: 1280px, 1440px, 1920px

---

**Last Updated:** March 21, 2026
**Related Documents:**
- `VALIDATION_REPORT.md` - Detailed validation findings
- `docs/DESIGN_SYSTEM.md` - Migration status and token usage
- `openspec/changes/ui-migration-validation/tasks.md` - Task checklist
