# Proposal: Gig Creation

## Why
Gigly's core value loop starts with Clients posting Gigs. Without the Gig model and creation form, the platform has no work units for Specialists to browse or apply to. This change introduces the database model, server action, and UI for CLIENT users to create gigs with transparent budget/fee calculation.

## What
1. Add a `Gig` model to Prisma schema with all required fields (title, description, budget, serviceFee, totalAmount, status, tags) and a relation to User.
2. Create a `createGig` server action that validates input, calculates fees, and persists the gig.
3. Build a gig creation form at `/dashboard/gigs/new` accessible only to CLIENT users.
4. Update the Client Dashboard to link to the gig creation form and list the user's gigs.
5. Add integration tests for gig creation logic.

## Constraints
- Service fee is 20% of budget (hardcoded for now).
- Only CLIENT role can create gigs.
- Gigs start with status `OPEN`.
- Budget must be a positive integer (stored in kopecks/cents to avoid floating point).
- Tags stored as comma-separated string (simple approach for SQLite).

## Non-Goals
- Specialist browsing/applying to gigs (future change).
- Gig status transitions beyond initial `OPEN`.
- Gig editing or deletion.
- Payment/escrow integration.
- Admin moderation of gigs.
