# Tasks: dispute-cta-button

## 1. Restyle the dispute CTA into a real button affordance
- [x] In `app/(protected)/gigs/[id]/GigDetail.tsx`, locate the `showDisputeLink` block (currently L738–755:
      an inline-flex `<div>` with `onClick={() => router.push(`/disputes/new?gig=${data.gigId}`)}`,
      `color: var(--text-3)`, `fontSize: 13`, `paddingTop: 2`).
- [x] Replace the bare `<div>` with a real button/link affordance that:
      - is an actual `<button type="button">` (or an anchor styled as a button) for keyboard/AT semantics,
      - has an interactive height ≥ ~44px (reuse the `primaryBtn` height idiom / add padding),
      - has a visible boundary or filled surface (e.g. a bordered/tinted amber-tinged surface consistent
        with the ⚖ cue colour `#f59e0b`, or a `noticeBox`-style bounded container wrapping the button),
      - renders «Открыть спор» at actionable contrast (NOT `var(--text-3)` muted grey),
      - keeps the ⚖ cue span and the «Возникли разногласия?» lead-in (lead-in may be quiet supporting text
        with «Открыть спор» as the prominent button label).
- [x] Keep the design language: `fontFamily: "'Handjet',monospace"` / `'Manrope',sans-serif` and
      fig-token colours; no Tailwind `className`, no kit-component import (this is a composed screen —
      inline style idiom only, matching `primaryBtn`/`noticeBox`).
- [x] Added a new `disputeBtn` inline-style builder beside `primaryBtn`/`noticeBox`.
- [x] Preserve exactly: the `router.push(`/disputes/new?gig=${data.gigId}`)` handler and the outer
      `{showDisputeLink && (...)}` gate. Do not touch the gate's boolean derivation.

**Result:** `<button type="button" style={disputeBtn}>` — `minHeight: 44`, `border: 1px solid
rgba(245,158,11,0.45)`, `background: rgba(245,158,11,0.10)`, `alignSelf: flex-start`; inside it the ⚖ cue,
the «Возникли разногласия?» lead-in as quiet `var(--text-3)` 11px supporting text, and «Открыть спор» as a
15px `#f59e0b` Handjet 600-weight label. `router.push`/gate untouched.
- Verified: `lint:contrast` PASS; `lint:generativity` fails only on the pre-existing unrelated
  `AdminDashboard.tsx` item (confirmed identical with this change stashed); `tsc --noEmit` clean for GigDetail.
  (No `lint:tokens`/`lint:composition` scripts exist in this repo.) Skipped `npm run build` — a dev server is
  live on :3000 and building over it corrupts `.next`.

**Implementation notes:**
- The sibling chat-entry button (L728–736) already uses `primaryBtn("#0088FF")` with `alignSelf:
  "flex-start"`, `padding: "0 20px"`, `display: "inline-flex"`, `gap: 8` — a good structural reference for
  a comparably-sized dispute button (use the amber ⚖ accent rather than a full primary-blue fill so the
  dispute CTA stays secondary in weight but clearly a button).
- Keep the whole control `alignSelf: "flex-start"` so it does not stretch full width.

**Test plan:**
- `npm run lint:tokens` and `npm run lint:composition` (if present) MUST stay green — no `className`/hex
  drift introduced into the composed screen.
- `npm run build` MUST pass.

## 2. Verify live (required — Гигли баги #7 acceptance)
- [x] Dev server already live on :3000 (did NOT build over it). Verified against seed gig
      `seed-inprogress-gig-4` (IN_PROGRESS, client `maria.sokolova@digitalpro.ru`, assigned specialist
      `alexey.ivanov@mail.ru`) via a headless Playwright drive.
- [x] As the assigned specialist: the «Открыть спор» control renders as an obvious button — measured
      **height 47px** (≥44 ✓), width 183px, visible amber boundary + tinted surface, CTA label computed
      colour **rgb(245,158,11)** (amber, NOT muted grey ✓), ⚖ cue + «Возникли разногласия?» lead-in
      retained ✓.
- [x] As the owning client: identical control (47px, amber, lead-in present) ✓.
- [x] Clicking it navigates to **`/disputes/new?gig=seed-inprogress-gig-4`** for both roles ✓.
- [x] Gate preserved verbatim (unchanged boolean derivation): `!closed && (isOwner || isAssignedSpecialist)
      && messaging.assigned && !isExample && (IN_PROGRESS || REVIEW)`.
- [x] Screenshot captured (`_dispute-closeup.png`) — button clearly reads as a secondary control beneath
      the primary blue «Написать заказчику».

**Test plan:**
- Live click-through as both roles per the scenarios in `specs/disputes/spec.md`; the CTA is an obvious,
  comfortably-sized button that opens the new-dispute flow; gate behavior unchanged. ✅ PASS

## 3. Reconcile & archive (after live verification passes)
- [x] Merged the ADDED requirement into the canonical `openspec/specs/disputes/spec.md`
      (new section «Gig-Detail Dispute CTA (dispute-cta-button, 2026-07-14)»).
- [x] Disputes domain tests green (17/17: `disputes-flow` + `disputes-vm`) after `clean:test-db`.
- [x] Archived this change folder to `openspec/archive/dispute-cta-button/`.
