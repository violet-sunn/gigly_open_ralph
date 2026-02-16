# Admin Role & Moderation - Proposal

## Change Name
`admin-role-and-moderation`

## Why

The platform currently has no moderation capabilities. As mentioned in `project.md`, the ADMIN role exists conceptually but is not implemented. Without admin tools, the platform cannot:

- Handle disputes between clients and specialists
- Remove fraudulent or abusive users
- Close problematic gigs
- Monitor platform health and user activity

This change implements the ADMIN role and provides basic moderation tools to ensure platform integrity and safety.

## What

This change adds:

1. **ADMIN Role Implementation**
   - ADMIN role is recognized by authentication and session management
   - ADMIN users can access admin-specific routes (`/admin/*`)
   - ADMIN role is NOT selectable during registration (security constraint)
   - ADMIN can only be assigned via direct database manipulation or by existing admins

2. **Admin Dashboard**
   - Admin-only route at `/admin` with overview statistics
   - List all users (clients and specialists) with filtering
   - List all gigs (all statuses) with filtering
   - Quick access to moderation actions

3. **User Moderation**
   - Suspend user accounts (prevents login)
   - Unsuspend user accounts (restores access)
   - View user activity (gigs created, applications submitted)
   - Suspended users cannot log in or perform any actions

4. **Gig Moderation**
   - Close gigs (admin-initiated closure for policy violations)
   - View all gigs regardless of owner or status
   - Closed gigs cannot receive applications or progress through lifecycle

5. **Audit Trail**
   - ModerationLog model to track all moderation actions
   - Records: action type, target (user/gig), admin who performed it, timestamp, reason

## Constraints

- **Security**: ADMIN role cannot be self-assigned during registration
- **Non-destructive**: Admins suspend/close rather than delete (data preservation)
- **Auditability**: All moderation actions must be logged
- **Role hierarchy**: ADMIN can perform all CLIENT and SPECIALIST actions (view-only)
- **No financial control**: Admins cannot modify budgets, fees, or payment status

## Non-Goals

- Email notifications for moderation actions (future enhancement)
- Dispute resolution workflow with multi-step processes
- Content moderation for messages or comments (not yet implemented)
- Escrow or financial management tools
- User appeals process
- Bulk moderation actions

## Impact

- **Database**: New `suspended` field on User, new `ModerationLog` model
- **Authentication**: Middleware must handle ADMIN role and `/admin/*` routes
- **UI**: New admin dashboard and moderation pages
- **Existing features**: No breaking changes to client/specialist flows

## Success Criteria

- Admins can log in and access `/admin` dashboard
- Admins can suspend users, preventing their login
- Admins can close gigs, preventing further applications
- All moderation actions are logged with reason and timestamp
- Non-admin users cannot access admin routes
- Suspended users receive clear error messages when attempting to log in
