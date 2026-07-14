# Change: dispute-cta-button

## Why

Production stress-test feedback (Гигли баги #7) flagged the «Возникли разногласия? Открыть спор»
control on the gig-detail screen as unusable: it does not read as a button and is hard to hit.

Verified in `app/(protected)/gigs/[id]/GigDetail.tsx` (`showDisputeLink` block, L738–755): the CTA is
rendered as an inline-flex `<div>` of 13px muted-grey text (`color: var(--text-3)` ≈ rgb(138,143,153))
on a transparent background, with no border, no button chrome, and ~2px top padding. The measured hit
target is ≈ 22px tall — well under the ~44px touch-target minimum — and the low-contrast grey reads as
disabled caption text, not an actionable control. It shows for the gig owner (client) and the assigned
specialist on `IN_PROGRESS`/`REVIEW` gigs.

Disputes are a trust-critical escape hatch (see `project.md` — dispute context prevents Telegram leakage
and preserves resolution history). A participant who cannot find or tap "open a dispute" is stranded at
exactly the moment the platform must feel reliable.

## What Changes

- Restyle the `showDisputeLink` control in `GigDetail.tsx` from a bare inline-flex `<div>` into a clearly
  clickable, legible control (a real button/link affordance) with:
  - an adequate touch target (≥ ~44px tall),
  - a visible boundary / button chrome (border or subtle filled surface),
  - sufficient contrast so the CTA text is unmistakably actionable (not muted-grey caption).
- Keep the ⚖ cue and the prototype's inline-styled token design language (Handjet/Manrope + fig-tokens);
  do **not** introduce Tailwind `className`/kit imports into this composed screen.
- Keep the «Возникли разногласия?» lead-in but make the «Открыть спор» CTA unmistakable (e.g. lead-in as
  quiet supporting text with «Открыть спор» as the prominent button label).
- Preserve exactly:
  - the `router.push(`/disputes/new?gig=${data.gigId}`)` navigation behavior, and
  - the `showDisputeLink` gate (owner/assigned specialist on `IN_PROGRESS`/`REVIEW` only).

## Non-Goals

- No change to the `openDispute` server action, the `/disputes/new` screen, or dispute data/lifecycle.
- No change to the `showDisputeLink` gating logic (which roles/statuses see it) — only its presentation.
- No change to the sibling chat-entry button or other notice blocks.
- No broader design-token or shell refactor.

## Impact

- Affected spec: `disputes` (adds a UI requirement for the gig-detail dispute CTA affordance).
- Affected code: `app/(protected)/gigs/[id]/GigDetail.tsx` (`showDisputeLink` block, L738–755; may add a
  local inline-style builder alongside `primaryBtn`/`noticeBox`).
- No schema, action, or route changes.
