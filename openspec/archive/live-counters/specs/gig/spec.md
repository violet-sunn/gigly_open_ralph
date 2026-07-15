# Gig — Spec Delta (live-counters)

> Scope note: this is **insurance, not a bug fix**. The notification write was verified live (dev + a real prod
> build) to persist immediately — the count going 7→8 in the DB — so the fire-and-forget pattern is NOT the cause
> of the stale counters. Awaiting removes a latent timing risk (a serverless/edge runtime can tear down the
> invocation at `redirect()`, dropping an un-awaited promise) at negligible cost.

## ADDED Requirements

### Requirement: Notification Writes Are Awaited Before Redirect
Server actions that create notifications and then `redirect()` MUST await the notification write before redirecting, so the write cannot be dropped by a runtime that ends the invocation at the redirect boundary.

#### Scenario: An action that notifies-then-redirects persists the notification
- GIVEN a gig server action that creates a notification and then redirects (e.g. a specialist applying to a gig)
- WHEN the action runs to completion
- THEN the notification row MUST be persisted before the redirect is issued
- AND the recipient's unread count MUST include it on the next read

#### Scenario: A notification failure does not fail the user's action
- GIVEN a notification write that throws (e.g. the notification backend is unavailable)
- WHEN the surrounding action runs
- THEN the user's primary action (apply / status change / message) MUST still succeed and redirect
- AND the failure MUST be logged, not surfaced as a user-facing error
- AND this MUST match the existing fan-out behavior already specified for `updateGig` ("a notification fan-out failure does not fail the edit")

**Acceptance Criteria:**
- The `createNotification(...)` / `createNotificationsBulk(...)` calls in `app/actions/gig.ts` that precede a `redirect()` are awaited
- Each awaited call is failure-isolated (a rejected notification promise MUST NOT reject the action) — matching the existing fan-out contract
- No change to notification content, type, recipients, or the unread derivation
- `redirect()` is still called outside any `try` that would swallow Next.js's control-flow redirect error
