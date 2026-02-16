# Change: client-gig-detail-link

## Summary

The Client Dashboard's "My Gigs" list renders each gig as a plain `<li>` element with no navigation link. Clients cannot click through to `/dashboard/gigs/[id]` to view gig details or manage applications. This breaks the core workflow: a client posts a gig, sees it listed, but has no way to reach the detail page where Accept/Reject buttons live.

## Motivation

- The gig detail page (`/dashboard/gigs/[id]`) already supports CLIENT users — it shows applications with Accept/Reject controls for the gig owner.
- The Specialist dashboard's "Browse Gigs" page already links each gig to its detail page.
- The only missing piece is the navigation link from the Client Dashboard's gig list items.

## Scope

- Wrap each gig item in the Client Dashboard's "My Gigs" section with a `<Link>` to `/dashboard/gigs/{gig.id}`.
- Add visual affordance (hover style) so clients know the item is clickable.

## Non-Goals

- No changes to the gig detail page itself.
- No changes to the Specialist dashboard.
- No new routes or server actions.
- No changes to data fetching or Prisma queries.
