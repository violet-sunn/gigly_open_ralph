# Disputes Specification (delta)

## ADDED Requirements

### Requirement: Gig-Detail «Открыть спор» CTA Is a Legible, Comfortably-Sized Control
On the gig-detail screen (`/gigs/[id]`), when the dispute entry point is shown to a participant (the
gig's owner/client or the assigned specialist on an `IN_PROGRESS`/`REVIEW` gig, per the existing
`showDisputeLink` gate), the «Открыть спор» control MUST present as a clearly clickable, legible control —
a real button/link affordance, not muted caption text. It MUST:
- have an adequate interactive target (≥ ~44px tall),
- have a visible boundary or button chrome (a border or a filled/tinted surface, distinct from the page
  background),
- render the «Открыть спор» CTA text at sufficient contrast that it reads as actionable (NOT the
  disabled-looking muted-grey `var(--text-3)` caption tone),
- keep the ⚖ cue and the «Возникли разногласия?» lead-in, and
- keep the prototype's inline-styled token design language (Handjet/Manrope + fig-tokens) — no Tailwind
  `className`, kit-component import, or raw hard-coded palette drift beyond the existing inline-style idiom.

The control MUST preserve the existing behavior: activating it navigates to `/disputes/new?gig=<gigId>`
via `router.push`, and it is shown/hidden by the unchanged `showDisputeLink` gate.

#### Scenario: The assigned specialist sees an obvious dispute button
- GIVEN an `IN_PROGRESS` (or `REVIEW`) gig with an assigned specialist
- WHEN the assigned specialist views the gig-detail screen
- THEN they MUST see an «Открыть спор» control that reads as a button (visible boundary/chrome), is
  comfortably sized (≥ ~44px interactive height), and shows the CTA text at actionable contrast (not the
  muted-grey caption tone), with the ⚖ cue and the «Возникли разногласия?» lead-in retained

#### Scenario: The owning client sees the same obvious dispute button
- GIVEN an `IN_PROGRESS` (or `REVIEW`) gig they own
- WHEN the owning client views the gig-detail screen
- THEN they MUST see the same obvious, comfortably-sized «Открыть спор» control

#### Scenario: Activating the CTA opens the new-dispute flow for that gig
- GIVEN a participant viewing the «Открыть спор» control on gig `<gigId>`
- WHEN they click/tap it
- THEN the app MUST navigate to `/disputes/new?gig=<gigId>` (behavior unchanged from the prior inline link)

#### Scenario: The gate is unchanged
- GIVEN a gig where the dispute entry point should not show (e.g. no assigned specialist, or a
  non-participant viewer, or a status outside `IN_PROGRESS`/`REVIEW`)
- WHEN the gig-detail screen renders
- THEN the «Открыть спор» control MUST NOT appear (the `showDisputeLink` gate is preserved verbatim)

**Acceptance Criteria:**
- The gig-detail «Открыть спор» control renders as a real button/link affordance: ≥ ~44px target,
  visible boundary/chrome, actionable-contrast CTA text (not `var(--text-3)` muted grey)
- The ⚖ cue and «Возникли разногласия?» lead-in are retained; inline-styled token language preserved
  (no `className`/kit import)
- `router.push('/disputes/new?gig=<id>')` navigation and the `showDisputeLink` gate are unchanged
- Verified live: on an `IN_PROGRESS`/`REVIEW` gig, both the assigned specialist and the owning client see
  an obvious, comfortably-sized button that opens the new-dispute flow for that gig
