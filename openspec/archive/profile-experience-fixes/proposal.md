# Profile Experience Fixes

**Change:** `profile-experience-fixes`
**Initiative:** Prod Feedback Fixes — Stress-Test Round 1 (change 6 of 8)
**Status:** PROPOSED
**Created:** 2026-07-14

## Why

The external stress-test pass (`Гигли_правки.pdf`, both roles) surfaced four profile-screen
defects that undercut the "high-end B2B marketplace" positioning ahead of the diploma defense
(~2026-07-19). All four live in `app/(protected)/profile/ProfileDesign.tsx`, its edit modals, and
`lib/view-models.ts` `getProfile`:

- **Спец #9 — edit affordance reads backwards.** The reviewer perceived the pencil as a *save*
  control and expected to edit by clicking the field. On the current (reground) HEAD the pencil
  already opens a modal with an explicit «Сохранить», so the literal bug does not reproduce against
  HEAD — but the pencil carries **no label, `title`, or `aria-label`**, so its meaning is genuinely
  ambiguous. The fix is to make "pencil = edit" unmistakable and confirm the explicit-Save flow live.
- **Заказчик #1 — client profile has no obvious edit entry.** The CLIENT profile exposes editing
  only through a single bare pencil beside the company name (`ProfileDesign.tsx:310`); a user cannot
  tell how to fill or edit their data. The specialist screen has visible per-block controls. Both
  roles need a clear, labeled «Редактировать» affordance.
- **Спец #15 — experience level is unreachable.** Onboarding asks for Middle+/Senior, but the
  profile never lets the user *set* or *see* it: `experienceLevel` is round-tripped as a hidden field
  (`getProfile` `editFields`) and used only as a `roleTag` fallback. No modal exposes it, nothing
  displays it explicitly.
- **Спец #16 — always "offline".** `getProfile` hardcodes `online: false` (`:919`, `:984`), and
  `ProfileDesign` hardcodes the "offline" pill directly in JSX (`:270–273`) — it never reads
  `header.online`. `Session.lastActiveAt` exists in the schema but is **never written** (only read by
  the settings "Активные сессии" list). There is no real last-seen signal anywhere.

## What

Four focused fixes, UI + one additive schema field. No third-party service: the online indicator is
100% self-hosted (a Next.js Server Action writing your existing SQLite DB).

1. **(a) Unmistakable edit affordance.** Keep the pencil → modal → explicit «Сохранить» pattern; add
   an accessible label/`title` («Редактировать») and hover affordance so the pencil clearly means
   *edit*, never *save*. Displayed fields never save on click — only the modal's Save persists.
2. **(b) Obvious client edit button.** Add a clear, labeled «Редактировать» button as the CLIENT
   profile's edit entry point (opening the existing requisites modal), aligned with the specialist's
   visible affordances. Owner-only; hidden for non-owner viewers.
3. **(c) Experience-level field.** Expose an explicit Middle/Senior selector in a specialist edit
   surface (alongside Стек/Опыт) and display the chosen level on the profile. `updateProfile` already
   validates + persists `experienceLevel`; no server-action change is required — only wiring the
   selector and a display block.
4. **(d) Real online indicator (heartbeat + `User.lastSeenAt`).** Add a nullable `lastSeenAt` column
   to `User`; a lightweight authenticated `heartbeat` Server Action touches it; a tiny client ping in
   the shell fires it every ~60s. `getProfile` computes
   `online = user.showOnlineStatus && lastSeenAt && (now − lastSeenAt) < ONLINE_WINDOW_MS` (window =
   5 min). `ProfileDesign` renders the real `header.online` state (dot colour + «онлайн»/«offline»
   text) instead of the hardcoded pill. When `showOnlineStatus` is off, the user is shown offline to
   everyone.

## Constraints

- Desktop-first; keep the existing design language (Handjet/Manrope, `app/_design/tokens.css`,
  token colours). Purely additive/behavioural — no re-grounding, no new UI kit.
- The `User.lastSeenAt` addition is backward-compatible (`DateTime?`, null default); existing rows and
  `getProfile` reads stay graceful (null ⇒ offline).
- `experienceLevel` validation stays MIDDLE/SENIOR (or empty), matching `updateProfile`.
- The heartbeat is authenticated-only and must not add a runtime dependency (plain `fetch` to your
  own Server Action; no realtime/SaaS provider).
- Verify **live in both roles** (specialist + client), not tests-only, per the initiative process.

## Non-Goals

- No presence beyond a last-seen window (no websockets, typing indicators, "last seen 3m ago" text).
- No avatar upload, no phone-verification flow, no new onboarding steps.
- No change to `updateProfile`'s validation contract or the CLIENT required-field rules.
- No reuse of `Session.lastActiveAt` for presence (decided with the user: heartbeat + `lastSeenAt`).
- The specialist experience-level *edit* reuses an existing/extended modal; no standalone edit screen.

## Impact

- **Schema:** `User` gains `lastSeenAt DateTime?` (Prisma `db push`; additive, no data migration).
- **Server:** new `heartbeat` Server Action (`app/actions/*`); `getProfile` online computation.
- **UI:** `ProfileDesign.tsx` (edit affordances, level display, real online pill, client edit button),
  its edit modals (level selector), and a shell-mounted client heartbeat ping.
- **Tests:** extend `__tests__/integration/profile-evolution.test.ts` (online computation +
  showOnlineStatus gate + level round-trip); live E2E in both roles.
