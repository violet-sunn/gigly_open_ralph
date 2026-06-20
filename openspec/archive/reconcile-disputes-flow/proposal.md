# reconcile-disputes-flow

**Type:** Regular change (UI reconciliation — disputes: a dedicated «Открыть спор» screen + the admin verdict resolve UI
+ the dispute timeline)
**Created:** 2026-06-20
**Plan:** `openspec/planning/full-design-reground.md` — Phase 3 (authored fresh from the prototype)
**Capability:** `disputes`
**Depends on:** `reconcile-data-model-to-design` (archived — it enriched `Dispute` with `openerRole`/frozen `amount`/
`evidence`/the 6-reason enum/the `DisputeEntry` timeline + the resolve verdict & `ModerationLog` link) and
`compose-disputes` (archived — the list/detail screens + blocks). The `openDispute` / `resolveDispute` actions, the
`getDisputeList` / `getDisputeDetail` mappers, and the VMs already exist.

## Why

The dispute **backend is complete** (model + both actions + mappers + VMs from the data-model change) but the **UI is
behind the prototype**. The prototype (`ROUTES.md` L14/L19–21/L45; `DATA-MODEL.md`) has:
- **`disputeNew` — «ОТКРЫТЬ СПОР»** (specialist + company): a dedicated open-dispute screen with a **reason enum**
  (6 values) + a **description**.
- **`disputeDetail` — «СПОР»** (specialist + company): the dispute with parties, the **frozen amount**, **evidence**, and
  a **timeline** of entries (specialist / company / moderator).
- **`disputeResolve` — «РЕШЕНИЕ СПОРА»** (admin only): the moderator picks a **verdict** — в пользу специалиста / в
  пользу заказчика / частичный возврат 50% — → the dispute is resolved + a moderation-log entry + a moderator timeline
  entry.

Today: the open-dispute form is an **inline free-text «reason» textarea on gig-detail** (`OpenDisputeAction`, not the
enum+description screen); `DisputeDetail` renders only gig/status/opener/reason/resolution — **no timeline, evidence, or
amount** (though the VM already carries them); and the admin resolve panel (`DisputeView.ResolveAction`) has status +
note but **no verdict selector** (even though `resolveDispute` already reads + maps `verdict`). This change reconciles
the **UI** to the prototype; the actions are reused verbatim.

## What

- **New `disputeNew` screen** at `/disputes/new?gig=<gigId>` (`app/(protected)/disputes/new/`) — a participant-gated,
  F5-pure `@composed-screen`: a `SectionHeader` «Открыть спор» + the gig context («по проекту «{title}»»), a
  **reason `CheckField`** (the 6 enum values) + a **description `Textarea`**, wired to the existing `openDispute` (which
  already validates the participant, freezes the amount, normalizes the reason enum, and writes the opening timeline
  entry). gig-detail's inline `OpenDisputeAction` becomes the prototype **«Открыть спор»** link → this screen.
- **Enhance the `DisputeDetail` block** to render the prototype detail in full: the **frozen amount** (Заморожено), the
  **parties** (opener role), the **evidence** list (Доказательства), and the **timeline** (Хронология) — each
  `DisputeEntry` as author (role-labelled: Специалист / Заказчик / Модератор) + text + date. The VM already supplies
  `amount`, `openerRole`, `evidence[]`, `timeline[]`; this is render-only (no VM change).
- **Add the verdict selector to the admin resolve UI** (`DisputeView.ResolveAction`) — a **`CheckField`** with the three
  verdicts (specialist / company / split_50), submitted as `verdict` to the existing `resolveDispute` (which already
  prefixes the verdict onto the resolution + writes the `ModerationLog` + the moderator timeline entry). The admin
  resolve panel stays inline on `/disputes/[id]` (admin-gated via the existing `isAdmin`), which is the prototype's
  admin-only «РЕШЕНИЕ СПОРА» content.
- **Reuse `openDispute` / `resolveDispute` verbatim** — no action/lifecycle/moderation-log changes (the verdict mapping
  + timeline writes already exist).

No screen carries off-token literals (F2) or bespoke markup (F5). All on-screen text is Russian, exactly as the
prototype shows it.

## Key facts / decisions (derived from the prototype + the existing backend)

- **The backend is done** — `openDispute` (reason enum + description + evidence + opening timeline entry + frozen
  amount), `resolveDispute` (admin gate + verdict map + `ModerationLog` + moderator timeline entry + opener
  notification), `getDisputeDetail` (timeline/evidence/amount/openerRole). This change only wires the UI to it.
- **`disputeNew` = `/disputes/new?gig=<gigId>`** (sibling of the list `/disputes` + detail `/disputes/[id]`), reached
  from gig-detail's «Открыть спор». Participant-gated (the screen redirects non-participants; `openDispute` re-validates
  server-side). The reason is the **6-value enum** (CheckField), not free text.
- **`disputeResolve` = the admin resolve panel on `/disputes/[id]`** (admin-gated, inline) — a sanctioned consolidation
  faithful to the prototype's admin-only «РЕШЕНИЕ СПОРА» content (nothing is displaced; consistent with the existing
  `isAdmin` panel). A separate `/disputes/[id]/resolve` route is **not** added (flagged decision).
- **`DisputeDetail` enhancement is render-only** — the VM already carries timeline/evidence/amount/openerRole; no
  mapper/VM change.
- **F1 baselines on the prototype frames** (`Gigly Развёртка.dc.html` disputeNew/disputeDetail/disputeResolve); fonts
  resolved. F1 = structural/overlay match; the absolute ≤1% gate is Phase 4 (`refidelity-from-full-design`).

## Scope

- **New screen:** `app/(protected)/disputes/new/page.tsx` (participant-gated; fetches the gig context) + `NewDispute.tsx`
  (`@composed-screen`).
- **Data layer:** `lib/disputes.ts` — a light `getNewDisputeContext(gigId, viewer)` → `{ gigId, gigTitle } | null`
  (participant-gated) for the screen's gig context. (`getDisputeDetail` is unchanged — it already returns the timeline.)
- **Block:** `app/components/blocks/DisputeDetail.tsx` — render the amount + parties + evidence + timeline.
- **Screen:** `app/(protected)/disputes/DisputeView.tsx` — add the verdict `CheckField` to `ResolveAction`. gig-detail
  (`GigDetail.tsx`) — `OpenDisputeAction` → the «Открыть спор» link.
- **Tests:** `__tests__/integration/disputes-flow.test.ts` (add the `verdict` to the resolve form + assert the
  resolution carries «В пользу …»); `__tests__/e2e/reconcile-disputes-flow.spec.ts` (open via `/disputes/new` with a
  reason + description → the dispute appears; admin resolves with a verdict → RESOLVED + the moderator timeline entry +
  the resolution); `__tests__/unit/components/domain-blocks.test.tsx` (DisputeDetail renders the timeline + evidence +
  amount); update `compose-disputes.spec.ts` if it asserts the old detail shape.
- **Docs:** the note in `docs/DESIGN_SYSTEM_SPEC.md`; check the Phase-3 item in `full-design-reground.md`.

## Non-goals

- Changing `openDispute` / `resolveDispute`, the dispute lifecycle, the moderation-log write, or the notifications.
- A real file-upload backend for evidence (the screen renders the existing `evidence[]`; capture stays the current
  CSV/none — not invented here).
- A separate `/disputes/[id]/resolve` route (the admin resolve panel stays inline, admin-gated).
- The absolute F1 ≤1% pixel gate (Phase 4).

## References

`gigly_full_design/ROUTES.md` (L14/L19–21/L45 — disputes/disputeNew/disputeDetail/disputeResolve + roles);
`DATA-MODEL.md` (the 6 reasons + 3 verdicts + the timeline/evidence/amount). The schema `Dispute` + `DisputeEntry`
(`prisma/schema.prisma` L188–223); `app/actions/dispute.ts` (`openDispute`, `resolveDispute` — the `VERDICTS` map +
the moderator timeline entry); `lib/disputes.ts` (`getDisputeList`/`getDisputeDetail`); the `DisputeListVM`/
`DisputeDetailVM`/`DisputeEntryVM` VMs; the `DisputeList`/`DisputeDetail` blocks; the `OpenDisputeAction` /
`ResolveAction` islands in `GigDetail.tsx` / `DisputeView.tsx`; `CheckField`/`Textarea`/`Notice`/`SectionHeader`.
