# Proposal — examples-for-clients

## Why

Round-3 stress test, item #10 (Арсений): «в экране создания заявки нет возможности вообще посмотреть примеры, несмотря на то что эти примеры есть. Однако те люди кто их должен видеть (заказчики) их не могут видеть.»

**This is a regression against a shipped requirement, not a missing feature.** `openspec/specs/ui/spec.md:2539` already says:

> *"GIVEN a user is viewing the gig creation form / WHEN they click the **«💡 View example gigs for inspiration»** link / THEN they MUST be navigated to `/gigs/examples?from=dashboard`"*

That link does not exist. `grep -i "example" CreateGigDesign.tsx` returns nothing. It was lost when the gig-creation screen was rebuilt on the `gigly_full_design` prototype.

Worse, **the loss was noticed and papered over rather than fixed**. `__tests__/e2e/gig-browse-access.spec.ts:74` carries this comment verbatim:

> *"The rebuilt CreateGigDesign dropped the «View example gigs» link; the /gigs/examples route survives and is [reachable directly]"*

— and the E2E was rewritten to `page.goto('/gigs/examples')` instead of clicking the link. The test stayed green; the feature stayed broken; the tester found the hole.

**Verified current state:**

| | |
| --- | --- |
| `/gigs/examples` route | Works. Lists `isExample: true` + `OPEN`, newest first. Seeded (3+ example gigs). |
| Discoverability from create-gig | **None.** No reference in `CreateGigDesign.tsx`. |
| Only link anywhere | `BackButton.tsx:48` — and it points at **`/dashboard/gigs/examples`, a route that does not exist** (verified: no such directory). So `?from=examples` on a gig detail renders a 404 link. |
| The page itself | English + pre-reground kit: «Example Gigs», «✨ Example», Tailwind `bg-surface-level-*` — not `gigly_full_design`. |
| Dead code | The page's Prisma query `include`s `client.email` + `clientProfile` and renders neither. |

## What

1. **Restore the specced entry point on the gig-creation screen** — a visible «💡 Посмотреть примеры» link in `CreateGigDesign.tsx`, positioned as inspiration while writing the brief. This is the whole of the tester's complaint.
2. **Open it in a new tab.** Not cosmetic: `CreateGigDesign` holds the entire brief in React `useState` (title, description, criteria chips, pending `critInput`). Navigating away in-tab silently destroys a half-written gig — which would be a worse bug than the one being fixed. The existing spec already notes the link "opens in a new tab".
3. **Localize and re-ground `/gigs/examples`** to Russian + `gigly_full_design` tokens/skin (incl. the EmptyState copy), and drop the unused `client` include.
4. **Fix the dead `BackButton` route** — `/dashboard/gigs/examples` → `/gigs/examples`, and add a `from=new` context that returns to the creation screen.

## Decisions (2026-07-15)

- **No CLIENT-only role gate.** The PRD asked to restrict `/gigs/examples` to CLIENT. Rejected on evidence: specialist access is *deliberate*, not accidental — `__tests__/integration/example-gigs-page.test.ts` has a whole `describe('SPECIALIST access')` block including *"should return same example gigs regardless of user role"*, `__tests__/e2e/gig-browse-access.spec.ts` asserts it, and `ui/spec.md:2632` scopes its scenario to *"a user (CLIENT or SPECIALIST)"*. The reported complaint is «заказчик не видит», not «специалист видит лишнее» — so we fix discoverability for the client and leave access alone. Specialists simply get no entry point pushed at them from the create flow (they have no create flow).
- **Template prefill deferred.** The PRD's optional «использовать как шаблон» is out. C5 is P2, defense is ~2026-07-19, and the complaint is discoverability, not templating. It would also mean touching `CreateGigDesign`'s state — freshly reworked in C1 (`gig-validation-ssot`) — risking the validation SSOT for an unrequested feature.

## Constraints

- **Do not disturb the C1 work in `CreateGigDesign.tsx`** — the readiness checklist, live counters, why-disabled guidance, and criteria auto-commit all landed there today. This change is additive: one link.
- Token-pure / `gigly_full_design` skin on the re-grounded page.
- Do not change what an example gig *is* (`isExample`), nor the specialist's example-gig notice on gig detail (`showExampleNotice`), nor the apply gating on examples.

## Non-goals

- Role-gating `/gigs/examples` (see Decisions).
- «Использовать как шаблон» prefill (see Decisions).
- The **specialist empty-browse entry** to examples (`ui/spec.md:2579-2586`: an EmptyState offering "View Example Gigs" when no open gigs exist). It is specced, it is a legitimate specialist use, and since we are not role-gating it is not a contradiction — leave it alone.
- Localizing the *rest* of `BackButton`'s contexts (browse/profile/dashboard/admin remain English). The component is English on a Russian app, but that is a separate content-localization sweep; touching only the contexts this change uses keeps `back-button.test.tsx`'s other assertions green.
- Fixing the other stale `/dashboard/gigs*` paths littering the UI spec.

## Risks

- **`back-button.test.tsx:70` asserts `href === '/dashboard/gigs/examples'`** — it locks in the dead route. It must be flipped, which is the second time this round a test has been found defending a defect (the first: `terms-negotiation` asserting «proposed == client»). Flip it with the reason recorded, do not "fix" the code to match the test.
- `CreateGigDesign.tsx` is the highest-traffic file of the round (C1 + C5). Land after C1 — already satisfied: C1 is shipped and archived.
- The examples page currently renders `EmptyState` with English strings that `ui/spec.md:2628` mandates verbatim; localizing it requires a MODIFIED delta, not a silent edit.
