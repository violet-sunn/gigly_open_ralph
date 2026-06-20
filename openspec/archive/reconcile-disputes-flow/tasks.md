# Tasks — reconcile-disputes-flow

Reconcile the dispute **UI** to the `gigly_full_design` prototype: a dedicated **«Открыть спор»** screen
(`/disputes/new?gig=<id>`, reason enum + description), the dispute **timeline** + evidence + frozen amount in
`DisputeDetail`, and the admin **verdict** resolve UI. The `openDispute` / `resolveDispute` actions are reused verbatim
(they already do the enum normalization, frozen amount, verdict map, `ModerationLog`, and timeline writes). Friction:
**low–medium** (pure UI wiring over a complete backend).

## 1. New-dispute context VM
- [x] `lib/disputes.ts`: add `getNewDisputeContext(gigId, viewer)` → `{ gigId, gigTitle } | null` — participant-gated
      (owner or assigned specialist; null otherwise) with a light gig fetch (title + clientId + assignedSpecialistId).
- **Test:** covered via the E2E participant-gate (a non-participant is redirected).

## 2. The /disputes/new screen
- [x] `app/(protected)/disputes/new/page.tsx` (server): read `?gig=<id>`, call `getNewDisputeContext`; if null →
      `redirect('/disputes')` (or the gig). Render `<NewDispute … />`.
- [x] `app/(protected)/disputes/new/NewDispute.tsx` (`/* @composed-screen */`, 'use client'): `SectionHeader` «Открыть
      спор» + the «по проекту «{title}»» context, a reason `CheckField` (the 6 `DisputeReason` enum values; the selected
      key → a hidden `reason` input), a description `Textarea` (name=`description`), a hidden `gigId`, and a submit wired
      to `openDispute` via `useActionState`. Template + blocks/primitives + data only — no className/style.
- **Test:** E2E — a participant opens a dispute (reason + description) → it is created and visible in the list/detail.

## 3. Enhance DisputeDetail (timeline + evidence + amount + parties)
- [x] `app/components/blocks/DisputeDetail.tsx`: render the **frozen amount** (Заморожено), the **opener role** party,
      the **evidence** list (Доказательства, when present), and the **timeline** (Хронология) — each `DisputeEntry` as a
      role-labelled author (Специалист / Заказчик / Модератор) + text + date. Render-only (the VM already carries them);
      token-pure (block-level className OK).
- **Test:** `domain-blocks.test.tsx` — DisputeDetail (open + resolved fixtures) renders the amount + an evidence file +
  the timeline entries (incl. the moderator entry in the resolved fixture).

## 4. Admin verdict resolve UI
- [x] `app/(protected)/disputes/DisputeView.tsx` `ResolveAction`: add a verdict `CheckField` (options
      specialist→«В пользу специалиста» / company→«В пользу заказчика» / split_50→«Частичный возврат 50%»; the selected
      key → a hidden `verdict` input) alongside the existing status + resolution note. Submit `verdict` to the
      (unchanged) `resolveDispute`. Keep the panel admin-gated + OPEN-only.
- **Test:** E2E — an admin resolves with a verdict → RESOLVED + the resolution carries «В пользу …» + the moderator
  timeline entry appears.

## 5. gig-detail entry point → the «Открыть спор» link
- [x] `GigDetail.tsx`: replace the inline `OpenDisputeAction` (free-text ApplyPanel reason) with a «Открыть спор» link
      (Button → `router.push('/disputes/new?gig=' + data.gigId)`) for a participant once a specialist is assigned. Remove
      the now-unused `OpenDisputeAction` + the `openDispute` import from gig-detail.
- **Test:** E2E (gig-detail) — a participant sees «Открыть спор» → navigates to `/disputes/new?gig=<id>`.

## 6. Token-purity + composition-purity (F2 / F5)
- [x] No `className=`/`style=`/hex literals in `NewDispute.tsx` / `DisputeView.tsx` / `GigDetail.tsx` beyond
      layout-primitive props; `DisputeDetail` (a block) stays token-pure.
- **Test:** `lint:composition` PASS (NewDispute F5-pure, screen count +1); `lint:tokens` PASS (no new literal).

## 7. Record the decision
- [x] `docs/DESIGN_SYSTEM_SPEC.md` §10.x: the disputeNew screen (reason enum + description) + the DisputeDetail
      timeline/evidence/amount + the admin verdict resolve (inline on `/disputes/[id]`, not a separate route) + the
      gig-detail «Открыть спор» link. Check the Phase-3 item in `full-design-reground.md`.
- **Test:** the note records the structure + the inline-resolve decision.

## 8. Tests (add/update)
- [x] `disputes-flow.test.ts`: add `verdict` to the resolve form helper + assert the resolution carries the verdict text
      («В пользу специалиста — …») and the moderator timeline entry; keep all existing scenarios.
- [x] `reconcile-disputes-flow.spec.ts` (new E2E): open via `/disputes/new` (reason + description) → appears; admin
      resolves with a verdict → RESOLVED + the timeline shows the moderator entry; non-participant redirect from
      `/disputes/new`.
- [x] `domain-blocks.test.tsx`: DisputeDetail timeline/evidence/amount render.
- [x] update `compose-disputes.spec.ts` if it asserts the old detail shape.
- **Test:** all pass.

## 9. Quality gates (run, assert green)
- [x] `npm run validate:tokens` + `npm run lint:tokens` — PASS.
- [x] `npm run lint:composition` — PASS (new screen counted).
- [x] `npm run build` — PASS (`/disputes/new`).
- [x] `npm run clean:test-db && npm run test:unit` — green (incl. the verdict assertion).
- [x] `reconcile-disputes-flow` (+ `compose-disputes`) E2E green.
- **Acceptance (Fidelity DoD):** F2 token-pure, F1 structural/overlay match to the prototype dispute frames, F3 flow
  parity (open → resolve lifecycle with the verdict + moderation log + timeline), F5 composition-pure. F1 ≤1% deferred to
  Phase 4.

## 10. Planning-status (Phase 3)
- [x] Check `reconcile-disputes-flow` in `full-design-reground.md` Phase 3.
- **Test:** the Phase-3 item reads `[x]`.
