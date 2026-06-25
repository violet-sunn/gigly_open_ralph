# e2e-my-gigs

## Why

Reconciliation change #5 of the E2E reconciliation plan (`openspec/planning/e2e-reconciliation.md`). The `/my-gigs` route was rebuilt directly on the `gigly_full_design` prototype's «МОИ ГИГИ» block (`app/(protected)/my-gigs/MyGigsDesign.tsx` + the shared `app/_design/GigCard.tsx`), but `__tests__/e2e/compose-my-gigs.spec.ts` still asserts the old kit DOM. It now fails on three independent counts:

1. **`getByRole('tab', …)`** — the status filters are no longer ARIA tabs. `MyGigsDesign` renders them as plain `<div onClick>` chips (`Все/Заявки/В работе/На проверке/Завершённые`), so `getByRole('tab')` finds nothing.
2. **`#main-content` → `getByText('Мои гиги')`** — there is no in-content title anymore; the shell header supplies the page title («МОИ ГИГИ»). The assertion has no target inside `#main-content`.
3. **`getByRole('button', { name: 'К проекту' })`** — the `full` `GigCard` footer renders «К проекту» as a `<span>` inside the card-wide `<Link href="/gigs/[id]">`, not a `<button>`. Navigation happens by clicking the card link.

The data layer (`getMyGigs` in `lib/view-models.ts`), the route's role-awareness, and the seed are unchanged — only the assertions point at markup that no longer exists. Restoring the spec green re-arms regression protection for `/my-gigs`.

## What Changes

- **REWRITE** `__tests__/e2e/compose-my-gigs.spec.ts` to assert the rebuilt `MyGigsDesign` screen:
  - The five status filter chips by visible text (`Все/Заявки/В работе/На проверке/Завершённые`) — selected via the chip row, **not** `role="tab"`.
  - A 2-column grid of `full` `GigCard`s for the viewer's OWN gigs, each card carrying the `full` footer labels «Фикс. цена» / «Срок выполнения» / «К проекту».
  - The prototype empty state for an empty tab: heading «Здесь пока пусто» + body «Гигов с таким статусом нет. Они появятся здесь, когда изменится статус работ.».
  - Card navigation by clicking the card link (whole card → `/gigs/[id]`), not a button.
  - **No** in-content page-title assertion (the title is shell-supplied «МОИ ГИГИ»).
- Reuse the existing harness: `setE2ESession` + direct Prisma seeding into `file:./test.db`; the seed (one CLIENT + one `IN_PROGRESS` gig) is kept — it already exercises a populated tab (`В работе`) and an empty tab (`Заявки`).

## Impact

- **Affected:** `__tests__/e2e/compose-my-gigs.spec.ts` only.
- **Not touched:** `app/`/`lib/` behaviour (incl. `MyGigsDesign.tsx`, `GigCard.tsx`, `getMyGigs`), the unit/integration suite (951/951 — must stay green), the canonical testing spec's documentary stance on per-screen E2E.
- **Plan:** advances `openspec/planning/e2e-reconciliation.md` from 4/16 → 5/16.
