# Change Proposal: Role Selection & Role-Based Dashboards

## Why
Gigly is a B2B freelance marketplace with two distinct user types: Clients (legal entities posting gigs) and Specialists (freelancers applying to gigs). Currently, all users register with a generic `"USER"` role and see an identical dashboard. Users need to choose their role at registration, and the dashboard must reflect their role with relevant content and actions.

## What
1. **Prisma schema update** — change the `role` field default from `"USER"` to require explicit selection. Valid values: `"CLIENT"`, `"SPECIALIST"`, `"ADMIN"`.
2. **Registration form** — add a role selector (Client or Specialist) before the email/password fields.
3. **`registerUser` action** — accept and persist the selected role.
4. **Session payload** — include `role` alongside `userId` and `email` in the JWT and session utilities.
5. **Middleware** — include `role` in the decoded session type.
6. **Dashboard** — render role-specific views:
   - Client dashboard: "Post a Gig" CTA, placeholder for "My Gigs" list.
   - Specialist dashboard: "Browse Gigs" CTA, placeholder for "My Applications" list.
7. **`loginUser` action** — include `role` in the session created on login.
8. **Integration test** — extend `scripts/test-auth-flow.ts` to verify role is persisted and present in the session flow.

## Constraints
- No new dependencies.
- Role is immutable after registration (no role-switching UI in this change).
- `ADMIN` role is not selectable during registration — it can only be set directly in the database.
- No actual Gig model or CRUD in this change — dashboard shows placeholders only.

## Non-Goals
- Gig creation / browsing (separate change).
- Admin dashboard.
- Profile pages (Company Name, INN/KPP for Clients; Tech Stack for Specialists).
- Role-based middleware route restrictions beyond what already exists.
