# Moderation Specification

## Requirements

### Requirement: Suspend User Server Action
The system MUST provide a `suspendUser` server action that allows ADMIN users to suspend user accounts.

#### Scenario: Successful user suspension
- GIVEN an authenticated user with role "ADMIN"
- WHEN `suspendUser` is called with a valid userId and reason
- THEN the User `suspended` field MUST be set to `true`
- AND a ModerationLog record MUST be created with:
  - `action` = "SUSPEND_USER"
  - `targetUserId` = suspended user's ID
  - `adminId` = session userId
  - `reason` = provided reason
  - `createdAt` = current timestamp
- AND the action MUST redirect to `/admin/users`

#### Scenario: Non-ADMIN user attempts to suspend
- GIVEN an authenticated user with role "CLIENT" or "SPECIALIST"
- WHEN `suspendUser` is called
- THEN it MUST return `{ error: 'Only admins can perform moderation actions.' }`
- AND no records MUST be modified

#### Scenario: Unauthenticated user attempts to suspend
- GIVEN no valid session
- WHEN `suspendUser` is called
- THEN it MUST redirect to `/login`

#### Scenario: Suspend non-existent user
- GIVEN a userId that does not exist
- WHEN `suspendUser` is called
- THEN it MUST return `{ error: 'User not found.' }`

#### Scenario: Suspend already suspended user (idempotency)
- GIVEN a user with `suspended = true`
- WHEN `suspendUser` is called
- THEN it MUST return `{ error: 'User is already suspended.' }`
- AND no new ModerationLog record MUST be created

#### Scenario: Missing suspension reason
- GIVEN an ADMIN user calls `suspendUser` without a reason
- WHEN the action is processed
- THEN it MUST return `{ error: 'Reason is required for suspension.' }`

**Acceptance Criteria:**
- `suspendUser` is exported from `app/actions/moderation.ts` with `'use server'`
- Signature is `(prevState: { error?: string } | null, formData: FormData)` (useActionState-compatible)
- formData includes `userId` (hidden field) and `reason` (textarea, required)
- User update and ModerationLog creation MUST happen in a single Prisma transaction
- On success: redirects to `/admin/users`
- On failure: returns `{ error: string }`

---

### Requirement: Unsuspend User Server Action
The system MUST provide an `unsuspendUser` server action that allows ADMIN users to restore suspended user accounts.

#### Scenario: Successful user unsuspension
- GIVEN an authenticated user with role "ADMIN"
- WHEN `unsuspendUser` is called with a valid userId and reason
- THEN the User `suspended` field MUST be set to `false`
- AND a ModerationLog record MUST be created with:
  - `action` = "UNSUSPEND_USER"
  - `targetUserId` = unsuspended user's ID
  - `adminId` = session userId
  - `reason` = provided reason
  - `createdAt` = current timestamp
- AND the action MUST redirect to `/admin/users`

#### Scenario: Non-ADMIN user attempts to unsuspend
- GIVEN an authenticated user with role "CLIENT" or "SPECIALIST"
- WHEN `unsuspendUser` is called
- THEN it MUST return `{ error: 'Only admins can perform moderation actions.' }`
- AND no records MUST be modified

#### Scenario: Unauthenticated user attempts to unsuspend
- GIVEN no valid session
- WHEN `unsuspendUser` is called
- THEN it MUST redirect to `/login`

#### Scenario: Unsuspend non-existent user
- GIVEN a userId that does not exist
- WHEN `unsuspendUser` is called
- THEN it MUST return `{ error: 'User not found.' }`

#### Scenario: Unsuspend already active user
- GIVEN a user with `suspended = false`
- WHEN `unsuspendUser` is called
- THEN it MUST return `{ error: 'User is not suspended.' }`
- AND no new ModerationLog record MUST be created

#### Scenario: Missing unsuspension reason
- GIVEN an ADMIN user calls `unsuspendUser` without a reason
- WHEN the action is processed
- THEN it MUST return `{ error: 'Reason is required for unsuspension.' }`

**Acceptance Criteria:**
- `unsuspendUser` is exported from `app/actions/moderation.ts` with `'use server'`
- Signature is `(prevState: { error?: string } | null, formData: FormData)` (useActionState-compatible)
- formData includes `userId` (hidden field) and `reason` (textarea, required)
- User update and ModerationLog creation MUST happen in a single Prisma transaction
- On success: redirects to `/admin/users`
- On failure: returns `{ error: string }`

---

### Requirement: Close Gig Server Action
The system MUST provide a `closeGig` server action that allows ADMIN users to close gigs for policy violations.

#### Scenario: Successful gig closure
- GIVEN an authenticated user with role "ADMIN"
- WHEN `closeGig` is called with a valid gigId and reason
- THEN the Gig `closedByAdmin` field MUST be set to `true`
- AND the Gig `closedAt` field MUST be set to current timestamp
- AND a ModerationLog record MUST be created with:
  - `action` = "CLOSE_GIG"
  - `targetGigId` = closed gig's ID
  - `adminId` = session userId
  - `reason` = provided reason
  - `createdAt` = current timestamp
- AND the action MUST redirect to `/admin/gigs`

#### Scenario: Non-ADMIN user attempts to close gig
- GIVEN an authenticated user with role "CLIENT" or "SPECIALIST"
- WHEN `closeGig` is called
- THEN it MUST return `{ error: 'Only admins can perform moderation actions.' }`
- AND no records MUST be modified

#### Scenario: Unauthenticated user attempts to close gig
- GIVEN no valid session
- WHEN `closeGig` is called
- THEN it MUST redirect to `/login`

#### Scenario: Close non-existent gig
- GIVEN a gigId that does not exist
- WHEN `closeGig` is called
- THEN it MUST return `{ error: 'Gig not found.' }`

#### Scenario: Close already closed gig (idempotency)
- GIVEN a gig with `closedByAdmin = true`
- WHEN `closeGig` is called
- THEN it MUST return `{ error: 'Gig is already closed.' }`
- AND no new ModerationLog record MUST be created

#### Scenario: Missing closure reason
- GIVEN an ADMIN user calls `closeGig` without a reason
- WHEN the action is processed
- THEN it MUST return `{ error: 'Reason is required for closing a gig.' }`

**Acceptance Criteria:**
- `closeGig` is exported from `app/actions/moderation.ts` with `'use server'`
- Signature is `(prevState: { error?: string } | null, formData: FormData)` (useActionState-compatible)
- formData includes `gigId` (hidden field) and `reason` (textarea, required)
- Gig update and ModerationLog creation MUST happen in a single Prisma transaction
- On success: redirects to `/admin/gigs`
- On failure: returns `{ error: string }`
- Closed gigs MUST NOT accept new applications (enforced in `applyToGig` action)

---

### Requirement: Admin Dashboard
The system MUST provide an admin dashboard at `/admin` with platform overview and quick access to moderation tools.

#### Scenario: ADMIN user accesses dashboard
- GIVEN an authenticated user with role "ADMIN"
- WHEN the user navigates to `/admin`
- THEN the page MUST display:
  - Total user count (all roles)
  - Total gig count (all statuses)
  - Suspended user count
  - Admin-closed gig count
  - Links to `/admin/users` and `/admin/gigs`

#### Scenario: Non-ADMIN user attempts to access dashboard
- GIVEN an authenticated user with role "CLIENT" or "SPECIALIST"
- WHEN the user navigates to `/admin`
- THEN they MUST be redirected to `/dashboard` (handled by middleware)

**Acceptance Criteria:**
- Page exists at `app/admin/page.tsx`
- Uses server component to fetch statistics
- Displays counts using Prisma aggregation queries
- Includes navigation links to user and gig management pages

---

### Requirement: Admin User Management Page
The system MUST provide a user management page at `/admin/users` for viewing and moderating users.

#### Scenario: ADMIN views all users
- GIVEN an authenticated user with role "ADMIN"
- WHEN the user navigates to `/admin/users`
- THEN the page MUST display a list of all users with:
  - Email
  - Role (CLIENT / SPECIALIST / ADMIN)
  - Suspended status (badge or indicator)
  - Registration date
  - Actions: Suspend / Unsuspend buttons

#### Scenario: ADMIN filters users by role
- GIVEN the `/admin/users` page with a role filter dropdown
- WHEN the ADMIN selects "CLIENT" from the filter
- THEN only users with role "CLIENT" MUST be displayed

#### Scenario: ADMIN filters users by suspension status
- GIVEN the `/admin/users` page with a status filter
- WHEN the ADMIN selects "Suspended"
- THEN only users with `suspended = true` MUST be displayed

**Acceptance Criteria:**
- Page exists at `app/admin/users/page.tsx`
- Uses server component to fetch users with optional filters
- URL search params for filters (e.g., `?role=CLIENT&status=suspended`)
- Suspend button shown for active users, Unsuspend button for suspended users
- Each action button opens a form with reason textarea

---

### Requirement: Admin Gig Management Page
The system MUST provide a gig management page at `/admin/gigs` for viewing and moderating gigs.

#### Scenario: ADMIN views all gigs
- GIVEN an authenticated user with role "ADMIN"
- WHEN the user navigates to `/admin/gigs`
- THEN the page MUST display a list of all gigs with:
  - Title
  - Client company name
  - Status (OPEN / IN_PROGRESS / REVIEW / COMPLETED / PAID)
  - Budget (in roubles)
  - Closed status (badge if closedByAdmin = true)
  - Created date
  - Actions: Close button (if not already closed)

#### Scenario: ADMIN filters gigs by status
- GIVEN the `/admin/gigs` page with a status filter dropdown
- WHEN the ADMIN selects "OPEN" from the filter
- THEN only gigs with status "OPEN" MUST be displayed

#### Scenario: ADMIN filters gigs by closure status
- GIVEN the `/admin/gigs` page with a closure filter
- WHEN the ADMIN selects "Closed by Admin"
- THEN only gigs with `closedByAdmin = true` MUST be displayed

**Acceptance Criteria:**
- Page exists at `app/admin/gigs/page.tsx`
- Uses server component to fetch gigs with optional filters
- URL search params for filters (e.g., `?status=OPEN&closed=true`)
- Close button shown for gigs with `closedByAdmin = false`
- Close action button opens a form with reason textarea
- Gigs link to their detail pages (`/dashboard/gigs/[id]`)

---

### Requirement: Moderation Log Model
The system MUST track all moderation actions in a ModerationLog table for audit purposes.

#### Scenario: Moderation log creation
- GIVEN any moderation action (suspend, unsuspend, close gig)
- WHEN the action is successfully performed
- THEN a ModerationLog record MUST be created with all required fields

#### Scenario: Moderation log retrieval
- GIVEN an ADMIN user views a user or gig detail page
- WHEN moderation logs exist for that entity
- THEN the logs MUST be displayed in chronological order (newest first)

**Acceptance Criteria:**
- `ModerationLog` model exists in `prisma/schema.prisma` with fields:
  - `id` (String, @id, @default(cuid()))
  - `action` (String: "SUSPEND_USER" | "UNSUSPEND_USER" | "CLOSE_GIG")
  - `reason` (String)
  - `adminId` (String, relation to User)
  - `targetUserId` (String?, optional, relation to User)
  - `targetGigId` (String?, optional, relation to Gig)
  - `createdAt` (DateTime, @default(now()))
- Relations: `admin` (User), `targetUser` (User?), `targetGig` (Gig?)
- At least one of `targetUserId` or `targetGigId` MUST be set
