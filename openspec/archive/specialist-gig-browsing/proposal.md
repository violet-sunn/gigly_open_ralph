# Proposal: Specialist Gig Browsing & Application Flow

## Why
Specialists currently see a disabled "Browse Gigs" placeholder on their dashboard. To close the marketplace loop, Specialists need to discover OPEN gigs and submit applications. This is the demand side of the Gigly marketplace — without it, Clients post gigs into a void.

## What
1. Add an `Application` model to the database (specialist applies to a gig).
2. Create a gig browsing page at `/dashboard/gigs` showing all OPEN gigs.
3. Create a gig detail page at `/dashboard/gigs/[id]` with full description and an "Apply" form.
4. Create an `applyToGig` server action that validates and persists applications.
5. Update the Specialist Dashboard to link to browse page and list their applications.
6. Update the Client Dashboard gig list to show application count per gig.
7. Add integration tests for the application flow.

## Constraints
- Only SPECIALIST role can apply to gigs.
- A specialist can apply to a gig only once (unique constraint on gigId + specialistId).
- Applications start with status `PENDING`.
- Only gigs with status `OPEN` are shown in the browse list.
- Cover letter is optional (free-text message with the application).
- Gig detail page is accessible to both CLIENT and SPECIALIST (but only SPECIALIST sees the apply form).

## Non-Goals
- Accepting/rejecting applications (future change).
- Application status transitions beyond `PENDING`.
- Messaging between client and specialist.
- Search/filter/pagination on the browse page (future enhancement).
- Gig status transitions (e.g., OPEN → IN_PROGRESS when application accepted).
