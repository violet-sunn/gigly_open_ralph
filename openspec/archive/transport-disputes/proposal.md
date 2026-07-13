# transport-disputes

**Plan:** `openspec/planning/transport-design-from-prototype.md` (change 6 of 8 — the dispute flow: list, new, detail, and the admin resolve face).

## Why

The dispute screens already exist and are **already built on the prototype's own inline-styled markup + `app/_design/tokens.css`** (same vocabulary as the change-3/4/5 screens), wired to `lib/disputes.ts` view-models and the `app/actions/dispute.ts` actions (`openDispute`, `resolveDispute`). But they were last grounded by-eye / against the older design, not the authoritative captured reference. Now that change 1 produced `design-reference/screens/`, this change **reconciles them to the 7 captured dispute states**, preserving all data/action wiring.

This is a **reconcile** (diff-and-fix against the reference), NOT a rebuild and NOT a new component variant.

## Reference mapping (CRITICAL — use these exact files)

| App route / role | App component (EXISTING — reconcile in place) | Captured reference |
|---|---|---|
| `/disputes` (list) — SPECIALIST & COMPANY | `app/(protected)/disputes/DisputesDesign.tsx` | `disputes.specialist` / `disputes.company` |
| `/disputes/new` — SPECIALIST & COMPANY | `app/(protected)/disputes/new/NewDisputeDesign.tsx` | `disputeNew.specialist` / `disputeNew.company` |
| `/disputes/[id]` participant view — SPECIALIST & COMPANY | `app/(protected)/disputes/DisputeDetailDesign.tsx` | `disputeDetail.specialist` / `disputeDetail.company` |
| `/disputes/[id]` ADMIN × OPEN (resolve face) | `app/(protected)/disputes/DisputeDetailDesign.tsx` (the `canResolve` branch) | `disputeResolve.admin` |

7 captured states, all present (none pending): 2 list + 2 new + 2 detail + 1 admin-resolve.

## Key decision — admin resolve stays folded into `/disputes/[id]` (recommended)

The prototype captures `disputeResolve.admin` as a **distinct route-state**, but the app deliberately **folds the resolve panel into the single `/disputes/[id]` route**: `DisputeDetailDesign` renders the «Решение модератора» panel (3 verdicts → `resolveDispute`) only when `isAdmin && status === 'open'`, and the participant header/timeline/evidence the rest of the time.

**Recommendation: keep the combined route.** Reconcile the admin-OPEN face of `DisputeDetailDesign` against `disputeResolve.admin`, and the participant/resolved face against `disputeDetail.{specialist,company}`. Rationale: (a) preserves the existing `page.tsx → VM → component` wiring and the `resolveDispute` action with zero route churn; (b) the resolve screen *is* the detail screen plus a verdict panel — the prototype's `disputeResolve.admin` markup is the detail header + «Ход рассмотрения» timeline + the moderator panel, so it reconciles naturally onto the same component; (c) avoids standing up a competing admin dispute route that would overlap change 7 (admin console). The alternative — a separate `/admin/disputes/[id]/resolve` route — is **not** taken here.

The PRD's "audit log" maps to the prototype's «Ход рассмотрения» timeline (it already renders; on `disputeResolve.admin` it includes the moderator-intervention entry, e.g. «Запросил подтверждение транзакции у платёжного провайдера…»). No new audit data model is introduced.

## What

Reconcile to the captured reference, preserving all existing data/action wiring:

- **Disputes list** (`DisputesDesign.tsx`): diff vs `disputes.{specialist,company}` and fix the header/intro copy («Споры» + the "разногласия рассматривает модератор / средства заморожены" notice), the row cards (gig · reason · opener · **status** pill «Открыт / На рассмотрении / Разрешён» · **amount**), the empty state, and the «Открыть спор» entry affordance.
- **New dispute** (`NewDisputeDesign.tsx`): diff vs `disputeNew.{specialist,company}` and fix the guided copy, the **4 reason chips** (verbatim: «Оплата не поступила», «Результат не соответствует ТЗ», «Просрочен срок выполнения», «Другое»), the description field, and the «Открыть спор» submit → `openDispute`.
- **Dispute detail** (`DisputeDetailDesign.tsx`): diff each face and fix the header card (gig · reason · opener · status · amount · resolution banner), the «Ход рассмотрения» timeline (party roles/colours, moderator entries — the "audit log"), the evidence chips, and — for ADMIN on an OPEN dispute — the «Решение модератора» panel (the 3 verdicts «В пользу специалиста / В пользу заказчика / Частичный возврат 50%» → `resolveDispute`). Reconcile against `disputeDetail.*` (participant) and `disputeResolve.admin` (admin-open).

## Constraints / Non-goals

- **Reconcile, don't rebuild; keep filenames.** Keep `DisputesDesign.tsx`, `NewDisputeDesign.tsx`, `DisputeDetailDesign.tsx` as-is by name; do NOT create new component variants or a new admin resolve route. Preserve the `page.tsx → VM → component` wiring.
- **No action / data-model changes.** `openDispute` and `resolveDispute` (incl. the `specialist` / `company` / `split_50` verdict map) and the `Dispute` model stay exactly as they are. Data gaps are **additive only** (Method §3) — touch `lib/disputes.ts` / `app/components/blocks/view-models.ts` only if the design shows a field the VM genuinely lacks.
- **Participant reply composer stays out of scope.** The prototype shows a reply affordance on the detail timeline, but there is **no backend action** for a participant to post to a dispute. The current component already omits it; it stays omitted (a known gap, parked — would be additive backend work, not a markup swap).
- **Admin reach is unchanged.** How an admin lands on `/disputes/[id]` (the dispute queue / links) is **change 7 (admin console)**, not here; this change only reconciles the resolve *face* of the detail screen.
- **Orphaned kit blocks.** `app/components/blocks/DisputeList.tsx` and `DisputeDetail.tsx` are pre-transport kit leftovers with no importers — deleting them is an **optional cleanup**, not a requirement; confirm they are unreferenced before removing (per the "don't auto-restore deleted work" guardrail, do not recreate if already gone).
- Desktop-only (1512px); reuse existing tokens; no new UI system. Transport against dark theme first, confirm light still themes via existing tokens.
- **Out of scope:** dashboards/browse/my-gigs (3), gig lifecycle (4), chats/finance/profile (5), admin console (7), auth (8).

## Impact

- Modifies: `app/(protected)/disputes/DisputesDesign.tsx`, `app/(protected)/disputes/new/NewDisputeDesign.tsx`, `app/(protected)/disputes/DisputeDetailDesign.tsx` (+ their inline sub-blocks).
- Possibly: `lib/disputes.ts` / `app/components/blocks/view-models.ts` only if a real data gap surfaces.
- Optional cleanup: delete orphaned `app/components/blocks/DisputeList.tsx` + `DisputeDetail.tsx` if unreferenced.
- No data-model or server-action changes. Existing E2E for these routes (`compose-disputes` / `e2e-disputes` specs) must stay green; selectors updated only where markup changed.
