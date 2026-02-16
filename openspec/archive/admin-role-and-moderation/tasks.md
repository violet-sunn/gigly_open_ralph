# Admin Role & Moderation - Implementation Tasks

## Task 1: Update Database Schema
Add moderation-related fields to User and Gig models, and create ModerationLog model.

### Implementation Notes
- Add `suspended Boolean @default(false)` to User model
- Add `closedByAdmin Boolean @default(false)` and `closedAt DateTime?` to Gig model
- Create new ModerationLog model with fields:
  - `id String @id @default(cuid())`
  - `action String` (enum-like: SUSPEND_USER, UNSUSPEND_USER, CLOSE_GIG)
  - `reason String`
  - `adminId String` (relation to User)
  - `targetUserId String?` (optional relation to User)
  - `targetGigId String?` (optional relation to Gig)
  - `createdAt DateTime @default(now())`
- Add relations: `admin User @relation("AdminActions")`, `targetUser User? @relation("UserModerations")`, `targetGig Gig? @relation("GigModerations")`
- Run `npx prisma migrate dev --name add-moderation-fields`

### Test Plan
```bash
# Verify migration created successfully
npx prisma migrate status

# Verify schema is valid
npx prisma validate

# Check that tables exist in SQLite
npx prisma studio
# Navigate to User table, verify 'suspended' column exists
# Navigate to Gig table, verify 'closedByAdmin' and 'closedAt' columns exist
# Verify ModerationLog table exists with all fields
```

---

## Task 2: Update Authentication for ADMIN Role and Suspended Users
Modify login action to check suspended status and ensure ADMIN role is handled correctly.

### Implementation Notes
- In `app/actions/auth.ts`, update `loginUser` action:
  - After password verification, check `user.suspended`
  - If suspended, return `{ error: 'Your account has been suspended. Please contact support.' }`
  - Ensure ADMIN role is passed to `createSession()` correctly
- In `app/actions/auth.ts`, update `registerUser` action:
  - Explicitly reject "ADMIN" role during registration
  - Update validation to only allow "CLIENT" or "SPECIALIST"
- Verify `lib/session.ts` types include "ADMIN" in role union type

### Test Plan
```bash
# Create a test script: scripts/test-suspended-login.ts
# 1. Create a user with suspended=true
# 2. Attempt to log in with correct credentials
# 3. Assert error message contains "suspended"

npx tsx scripts/test-suspended-login.ts

# Create a test script: scripts/test-admin-registration.ts
# 1. Attempt to register with role="ADMIN"
# 2. Assert error message is returned
# 3. Assert no user was created

npx tsx scripts/test-admin-registration.ts

# Manually create an ADMIN user via Prisma Studio
# 1. Open Prisma Studio: npx prisma studio
# 2. Create user with role="ADMIN"
# 3. Attempt to log in via UI at http://localhost:3000/login
# 4. Verify successful login and session creation
```

---

## Task 3: Update Middleware for Admin Route Protection
Add /admin route protection to middleware, allowing only ADMIN role access.

### Implementation Notes
- In `middleware.ts`, update matcher to include `/admin/:path*`
- Add logic to check session role:
  - If path starts with `/admin` and role is not "ADMIN", redirect to `/dashboard`
  - If path starts with `/admin` and no session, redirect to `/login`
  - ADMIN users can access both `/dashboard` and `/admin` routes
- Ensure middleware runs on Edge runtime (no Node.js-specific APIs)

### Test Plan
```bash
# Test 1: Unauthenticated access to /admin
# Navigate to http://localhost:3000/admin
# Assert redirect to /login

# Test 2: CLIENT user access to /admin
# Log in as CLIENT user
# Navigate to http://localhost:3000/admin
# Assert redirect to /dashboard

# Test 3: SPECIALIST user access to /admin
# Log in as SPECIALIST user
# Navigate to http://localhost:3000/admin
# Assert redirect to /dashboard

# Test 4: ADMIN user access to /admin
# Log in as ADMIN user (created via Prisma Studio)
# Navigate to http://localhost:3000/admin
# Assert page loads successfully (no redirect)

# Test 5: ADMIN user access to /dashboard
# While logged in as ADMIN
# Navigate to http://localhost:3000/dashboard
# Assert page loads successfully (ADMIN can access both)
```

---

## Task 4: Create Moderation Server Actions
Implement suspendUser, unsuspendUser, and closeGig server actions.

### Implementation Notes
- Create `app/actions/moderation.ts` with `'use server'` directive
- Implement `suspendUser(prevState, formData)`:
  - Get session, verify role is "ADMIN"
  - Extract userId and reason from formData
  - Validate reason is not empty
  - Check user exists and is not already suspended
  - Use Prisma transaction to:
    - Update User.suspended = true
    - Create ModerationLog with action="SUSPEND_USER"
  - Redirect to `/admin/users` on success
- Implement `unsuspendUser(prevState, formData)`:
  - Similar to suspendUser but sets suspended = false
  - Check user is currently suspended
  - ModerationLog action="UNSUSPEND_USER"
- Implement `closeGig(prevState, formData)`:
  - Get session, verify role is "ADMIN"
  - Extract gigId and reason from formData
  - Validate reason is not empty
  - Check gig exists and is not already closed
  - Use Prisma transaction to:
    - Update Gig.closedByAdmin = true, closedAt = new Date()
    - Create ModerationLog with action="CLOSE_GIG"
  - Redirect to `/admin/gigs` on success

### Test Plan
```bash
# Create test script: scripts/test-moderation-actions.ts
# Test suspendUser:
# 1. Create ADMIN user and CLIENT user
# 2. Call suspendUser with CLIENT userId
# 3. Assert CLIENT user.suspended = true
# 4. Assert ModerationLog record created with correct fields
# 5. Attempt to call suspendUser again (idempotency)
# 6. Assert error returned

# Test unsuspendUser:
# 1. Unsuspend the CLIENT user
# 2. Assert CLIENT user.suspended = false
# 3. Assert new ModerationLog record created

# Test closeGig:
# 1. Create a gig
# 2. Call closeGig with gigId
# 3. Assert gig.closedByAdmin = true and closedAt is set
# 4. Assert ModerationLog record created

npx tsx scripts/test-moderation-actions.ts
```

---

## Task 5: Update applyToGig to Prevent Applications to Closed Gigs
Modify the applyToGig action to reject applications to admin-closed gigs.

### Implementation Notes
- In `app/actions/gig.ts`, update `applyToGig` action:
  - After fetching the gig, check `gig.closedByAdmin`
  - If true, return `{ error: 'This gig has been closed by administrators.' }`
  - Existing status check (OPEN) should remain

### Test Plan
```bash
# Create test script: scripts/test-closed-gig-application.ts
# 1. Create ADMIN, CLIENT, and SPECIALIST users
# 2. CLIENT creates a gig
# 3. ADMIN closes the gig
# 4. SPECIALIST attempts to apply
# 5. Assert error message about admin closure

npx tsx scripts/test-closed-gig-application.ts
```

---

## Task 6: Create Admin Dashboard Page
Build the main admin dashboard at /admin with overview statistics.

### Implementation Notes
- Create `app/admin/page.tsx` as a server component
- Fetch statistics using Prisma:
  - Total users: `prisma.user.count()`
  - Total gigs: `prisma.gig.count()`
  - Suspended users: `prisma.user.count({ where: { suspended: true } })`
  - Closed gigs: `prisma.gig.count({ where: { closedByAdmin: true } })`
- Display stats in a grid layout with cards
- Add navigation links to `/admin/users` and `/admin/gigs`
- Use Tailwind CSS for styling, consistent with existing dashboard design

### Test Plan
```bash
# Manual UI test:
# 1. Log in as ADMIN user
# 2. Navigate to http://localhost:3000/admin
# 3. Verify all statistics display correctly
# 4. Verify links to /admin/users and /admin/gigs work
# 5. Check responsive design on mobile viewport

# Create test data script: scripts/seed-admin-test-data.ts
# Create multiple users (some suspended) and gigs (some closed)
# Verify counts on dashboard match database

npx tsx scripts/seed-admin-test-data.ts
```

---

## Task 7: Create Admin User Management Page
Build the user management page at /admin/users with filtering and moderation actions.

### Implementation Notes
- Create `app/admin/users/page.tsx` as a server component
- Accept searchParams for filters: `role`, `status`
- Fetch users with Prisma:
  - Build where clause based on filters
  - Include related ClientProfile and SpecialistProfile for display
  - Order by createdAt desc
- Display users in a table with columns:
  - Email, Role, Suspended status (badge), Registration date
  - Actions column with Suspend/Unsuspend buttons
- Create filter UI with dropdowns for role and status
- Use URL search params for filter state
- Suspend/Unsuspend buttons open a modal/form with reason textarea
- Use `useActionState` for form handling

### Test Plan
```bash
# Manual UI test:
# 1. Navigate to http://localhost:3000/admin/users
# 2. Verify all users display in table
# 3. Test role filter (CLIENT, SPECIALIST, ADMIN, All)
# 4. Test status filter (Active, Suspended, All)
# 5. Click Suspend button, enter reason, submit
# 6. Verify user is suspended and badge updates
# 7. Click Unsuspend button, enter reason, submit
# 8. Verify user is unsuspended
# 9. Check that URL params update with filters

# Integration test script: scripts/test-user-management-ui.ts
# Use Playwright or similar to automate UI testing
```

---

## Task 8: Create Admin Gig Management Page
Build the gig management page at /admin/gigs with filtering and close action.

### Implementation Notes
- Create `app/admin/gigs/page.tsx` as a server component
- Accept searchParams for filters: `status`, `closed`
- Fetch gigs with Prisma:
  - Build where clause based on filters
  - Include client relation for company name display
  - Order by createdAt desc
- Display gigs in a table with columns:
  - Title, Client company, Status, Budget (formatted in roubles), Closed badge, Created date
  - Actions column with Close button (if not closed)
- Create filter UI with dropdowns for status and closure status
- Use URL search params for filter state
- Close button opens a modal/form with reason textarea
- Use `useActionState` for form handling
- Title column links to gig detail page (`/dashboard/gigs/[id]`)

### Test Plan
```bash
# Manual UI test:
# 1. Navigate to http://localhost:3000/admin/gigs
# 2. Verify all gigs display in table
# 3. Test status filter (OPEN, IN_PROGRESS, REVIEW, COMPLETED, PAID, All)
# 4. Test closed filter (Open, Closed by Admin, All)
# 5. Click Close button, enter reason, submit
# 6. Verify gig is closed and badge appears
# 7. Verify Close button disappears for closed gigs
# 8. Click gig title link, verify navigation to detail page
# 9. Check that URL params update with filters

# Integration test script: scripts/test-gig-management-ui.ts
```

---

## Task 9: Add Moderation Log Display (Optional Enhancement)
Display moderation history on user and gig detail pages for ADMIN users.

### Implementation Notes
- In `app/admin/users/[id]/page.tsx` (create if needed):
  - Fetch user with related ModerationLog records
  - Display logs in chronological order (newest first)
  - Show: action, reason, admin email, timestamp
- In `app/dashboard/gigs/[id]/page.tsx`:
  - If session role is ADMIN, fetch and display ModerationLog for the gig
  - Show closure history if applicable

### Test Plan
```bash
# Manual UI test:
# 1. Suspend a user multiple times (suspend, unsuspend, suspend)
# 2. Navigate to user detail page
# 3. Verify all moderation actions are listed
# 4. Close a gig
# 5. Navigate to gig detail page as ADMIN
# 6. Verify closure log is displayed
```

---

## Summary

After completing all tasks:
1. Database schema supports moderation (suspended users, closed gigs, audit logs)
2. ADMIN role is fully integrated into authentication and authorization
3. Admins can suspend/unsuspend users and close gigs
4. All moderation actions are logged for audit purposes
5. Admin UI provides easy access to moderation tools
6. Non-admin users cannot access admin routes or perform moderation actions
7. Suspended users cannot log in
8. Closed gigs cannot receive new applications

## Next Steps

After implementation, run:
```bash
# Run all test scripts
npx tsx scripts/test-suspended-login.ts
npx tsx scripts/test-admin-registration.ts
npx tsx scripts/test-moderation-actions.ts
npx tsx scripts/test-closed-gig-application.ts

# Manual testing checklist:
# - Create ADMIN user via Prisma Studio
# - Log in as ADMIN and verify /admin access
# - Test all moderation actions via UI
# - Verify non-admin users cannot access /admin
# - Verify suspended users cannot log in
# - Verify closed gigs cannot receive applications
```

To implement this change, run:
```bash
/ralphy-implement admin-role-and-moderation
```
