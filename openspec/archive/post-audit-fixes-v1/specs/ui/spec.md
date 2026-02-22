# UI Specification Delta - Post-Audit Fixes

## ADDED Requirements

None - this change fixes existing functionality, does not add new features.

## MODIFIED Requirements

### Requirement: Admin Moderation Actions Cache Invalidation

Admin moderation actions SHALL invalidate Next.js server-side cache before redirecting to ensure the UI displays updated data immediately.

#### Scenario: Admin suspends user and sees immediate UI update

**Given** an admin is viewing the user management page on page 2
**When** the admin suspends a user via the SuspendUserForm
**Then** the `suspendUser` Server Action SHALL call `revalidatePath('/admin/users')`
**And** the Server Action SHALL call `revalidatePath('/admin')`
**And** the Server Action SHALL call `redirect('/admin/users')`
**And** the admin SHALL see the updated user status immediately without manual refresh
**And** the pagination state SHALL be preserved (still on page 2)

**Acceptance Criteria:**
- File: `app/actions/moderation.ts`
- Import: `import { revalidatePath } from 'next/cache'`
- Code: `revalidatePath('/admin/users')` called before `redirect('/admin/users')`
- Code: `revalidatePath('/admin')` called before `redirect('/admin/users')`
- Manual test: Suspend user on page 2, verify UI updates without F5
- Manual test: Verify pagination state preserved after mutation

#### Scenario: Admin unsuspends user and sees immediate UI update

**Given** an admin is viewing the user management page
**When** the admin unsuspends a user via the UnsuspendUserForm
**Then** the `unsuspendUser` Server Action SHALL call `revalidatePath('/admin/users')`
**And** the Server Action SHALL call `revalidatePath('/admin')`
**And** the Server Action SHALL call `redirect('/admin/users')`
**And** the admin SHALL see the updated user status immediately without manual refresh

**Acceptance Criteria:**
- File: `app/actions/moderation.ts`
- Code: `revalidatePath('/admin/users')` called before `redirect('/admin/users')`
- Code: `revalidatePath('/admin')` called before `redirect('/admin/users')`
- Manual test: Unsuspend user, verify UI updates without F5

#### Scenario: Admin closes gig and sees immediate UI update

**Given** an admin is viewing the gig management page on page 3
**When** the admin closes a gig via the CloseGigForm
**Then** the `closeGig` Server Action SHALL call `revalidatePath('/admin/gigs')`
**And** the Server Action SHALL call `revalidatePath('/admin')`
**And** the Server Action SHALL call `redirect('/admin/gigs')`
**And** the admin SHALL see the updated gig status immediately without manual refresh
**And** the pagination state SHALL be preserved (still on page 3)

**Acceptance Criteria:**
- File: `app/actions/moderation.ts`
- Code: `revalidatePath('/admin/gigs')` called before `redirect('/admin/gigs')`
- Code: `revalidatePath('/admin')` called before `redirect('/admin/gigs')`
- Manual test: Close gig on page 3, verify UI updates without F5
- Manual test: Verify pagination state preserved after mutation

## REMOVED Requirements

None - this change does not remove any functionality.
