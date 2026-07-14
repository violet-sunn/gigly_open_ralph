# data-model — attention-feed-lifecycle delta

## ADDED Requirements

### Requirement: Attention Feed Excludes Resolved and Read Notifications

The dashboard «Требует внимания» attention feed (`getDashboardAttention`) MUST show only
notifications that still require the user's attention. A notification MUST be included in the feed
**if and only if all** of the following hold:

1. The notification is **unread** — its `lastReadAt` is `null`.
2. The linked gig's `status` is **neither** `COMPLETED` **nor** `PAID` (not in a terminal
   lifecycle state).
3. The linked gig's `closedByAdmin` is `false` (the gig has not been closed by an admin).

The filter MUST be applied in the database query **before** the newest-first cap, so the cap
returns up to N *still-actionable* notifications rather than N fetched-then-filtered rows. The
existing newest-first ordering (`createdAt desc`) and the cap of 6 MUST be preserved.

When the filtered feed is empty, the «Требует внимания» block MUST NOT render, and the count badge
MUST reflect the filtered count (not the total notification count).

#### Scenario: A completed gig's acceptance card clears from the feed

- GIVEN a specialist whose application to a gig was accepted, producing an `application_accepted` notification
- AND the notification has not been read (`lastReadAt` is `null`)
- WHEN the gig owner approves the work and the gig reaches `COMPLETED` (or later `PAID`)
- THEN `getDashboardAttention` MUST NOT return that notification
- AND the «Требует внимания» count MUST decrease by one
- AND if it was the only card, the «Требует внимания» block MUST NOT render

#### Scenario: An admin-closed gig's card clears from the feed

- GIVEN a user with an unread notification whose linked gig has `closedByAdmin = true`
- WHEN `getDashboardAttention` runs
- THEN that notification MUST NOT appear in the feed

#### Scenario: A read notification clears from the feed

- GIVEN a user with a notification whose linked gig is still `IN_PROGRESS`
- AND the user has opened/marked it read, so `lastReadAt` is non-null
- WHEN `getDashboardAttention` runs
- THEN that notification MUST NOT appear in the feed

#### Scenario: A still-actionable notification remains in the feed

- GIVEN a user with an **unread** notification whose linked gig is `OPEN` or `IN_PROGRESS` and not admin-closed
- WHEN `getDashboardAttention` runs
- THEN that notification MUST appear in the feed, newest-first, within the cap of 6

#### Scenario: The cap counts only actionable notifications

- GIVEN a user has 8 unread notifications on live gigs and 4 notifications on COMPLETED gigs, all interleaved by recency
- WHEN `getDashboardAttention` runs
- THEN the result MUST contain the 6 newest **live-gig unread** notifications
- AND MUST NOT contain any COMPLETED-gig notification, even if it is more recent than some included card
