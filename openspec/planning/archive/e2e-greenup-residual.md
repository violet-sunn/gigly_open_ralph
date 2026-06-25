# E2E Greenup — Flagged Residual (pre-existing genuine failures)

**Created:** 2026-06-24 (during `e2e-journeys-and-greenup`, reconciliation #16)
**Status:** ✅ RESOLVED 2026-06-24 by the `e2e-greenup-residual` change — the whole E2E suite is now green (**199 passed, 0 failures**).

> **Resolution.** All 13 were fixed tests-only: the auth/register-wizard cluster needed the wizard step-3 submit «Зарегистрироваться» → «Продолжить» + auth-flow's `/login` border `rgb(2,101,220)` → `rgb(0,136,255)` — **but most of that cluster was actually a STALE DEV-SERVER artifact** (a session-long reused `npm run dev` with a stale `test.db` handle after repeated `clean:test-db` → login/register couldn't see seeded users; restarting the :3000 listener fixed it — see the `e2e-stale-dev-server` memory). `csrf-protection` → the `CreateGigDesign` fill (criteria editor, not `textarea[name=acceptanceCriteria]`). `gig-browse-access` → both the CLIENT-gating (`/gigs` → `/dashboard` redirect) and the `/gigs/examples` route SURVIVE, reconciled to the rebuilt behaviour (no deletion). Below is the original analysis, kept for the record.

## Context

Reconciliation #16 ran the **whole** E2E suite for the first time post-reground. The first run showed **47 failures**; investigation found the dominant cause was **FK-unsafe `deleteMany()` cleanup** in ~10 legacy specs (unscoped deletes that throw once the shared `file:./test.db` holds disputes/reviews/notifications/moderation-logs from other specs that don't clean up). That was fixed tests-only via a shared **FK-safe `resetE2EDb()`** helper (`__tests__/helpers/seed.ts`) + a reset-before-seed in the count-sensitive specs. After the fix: **47 → 13 failures (186 passed)**.

The remaining **13 failures all fail in ISOLATION on a clean DB** — they are pre-existing content drift in specs the reconciliation plan marked PASS-AS-IS but which were never actually re-verified. They are **not** caused by the #16 rewrites and **not** pollution. Per the user's decision they are flagged here for a dedicated follow-up rather than expanded into change #16.

## The 13 flagged failures

### A. Auth / register-wizard cluster (9) — the auth UI is now a multi-step `RegisterWizard`
- **`auth-flow.spec.ts`** (5): `:40`, `:72` (auth→login/register→dashboard flow), `:140`, `:145` (role pre-selection — role-card `toHaveCSS` border assertion resolves to `rgb(0,136,255)` brand-default, mismatched), `:250` (weak-password rejection).
- **`auth-navigation.spec.ts`** (3): `:111`, `:118`, `:125` — authenticated user redirected from `/auth` · `/login` · `/register` to dashboard.
- **`compose-auth-onboarding.spec.ts`** (1): `:40` — a full CLIENT registration lands on `/dashboard` with the company profile.

### B. Stale create-gig form fill (1)
- **`csrf-protection.spec.ts`** (1): `:26` — "Server Actions work with same-origin requests" fills `textarea[name="acceptanceCriteria"]`, which in the rebuilt `CreateGigDesign` is a hidden input populated by the criteria editor (the same stale pattern fixed in the journeys). **Trivial reconciliation** — replace the flat-form fill with the `CreateGigDesign` sequence (category chip + criteria editor «Добавить»).

### C. Old-kit browse-access UI (3)
- **`gig-browse-access.spec.ts`** (3): `:40` (`a:has-text("💡 View example gigs for inspiration")`), `:111` (`text=Browse Gigs is only available for specialists`), `:150` — asserts old-kit English browse/examples UI that the reground replaced. Needs reconciliation to the rebuilt browse-access / examples behaviour (or deletion if the examples affordance was removed by design).

## Proposed follow-up

```
/ralphy-plan e2e-greenup-residual "Reconcile the genuinely-stale PASS-AS-IS specs surfaced by the #16 full-suite greenup. AUTH WIZARD: rewrite auth-flow.spec.ts + auth-navigation.spec.ts + compose-auth-onboarding.spec.ts to the rebuilt multi-step RegisterWizard (step 0 role → step 1 credentials → step 2 profile) + the auth redirect/role-preselect behaviour; the role card uses border-2 border-brand-default (rgb(0,136,255)). CSRF: fix csrf-protection.spec.ts to fill the rebuilt CreateGigDesign (category chip + criteria editor «Добавить» → hidden acceptanceCriteria) instead of textarea[name=acceptanceCriteria]. BROWSE: reconcile gig-browse-access.spec.ts to the rebuilt browse/examples UI (or delete the example-gig affordance assertions if removed by design). Decide WITH THE USER whether the examples feature still exists. Test: npm run clean:test-db && npm run test:e2e → 0 failures."
```

## Note

The shared `file:./test.db` mixes two isolation models — the reconciled `compose-*` specs (unique per-test seeding, no cleanup) and the legacy specs (now FK-safe `resetE2EDb`). This is now consistent enough for a deterministic full run; the follow-up only needs to reconcile the stale **content** above, not the isolation.
