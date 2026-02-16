# Tasks — client-gig-detail-link

## Checklist

1. **Wrap gig list items with `<Link>` in Client Dashboard**
   - File: `app/dashboard/page.tsx`
   - Inside the `gigs.map()` block (around line 57), wrap the content of each `<li>` with `<Link href={`/dashboard/gigs/${gig.id}`}>`.
   - Apply `block hover:bg-gray-50 rounded transition-colors` (or similar) to the `<Link>` so the entire row is clickable with hover feedback.
   - Keep the `<li>` as the list container; the `<Link>` goes inside it.
   - **Test plan:**
     - Run `npx tsx scripts/test-gig-creation.ts` (or equivalent) to confirm gigs can still be created.
     - Start the dev server, log in as a CLIENT with at least one gig, visit `/dashboard`.
     - Assert: each gig in "My Gigs" renders an `<a>` tag with `href="/dashboard/gigs/{id}"`.
     - Assert: clicking a gig navigates to the detail page showing applications.
     - Assert: hovering over a gig item changes the background color.
     - Assert: all existing gig info (title, status, budget, app count, date, specialist email) still renders correctly.
