# Testing Specification Delta

## ADDED Requirements

### Requirement: My-Gigs Reconciled E2E Coverage

The E2E suite SHALL verify the rebuilt `/my-gigs` (`app/(protected)/my-gigs/MyGigsDesign.tsx`, rendering the shared `app/_design/GigCard.tsx` in `full` mode) against its current `gigly_full_design` markup — using the Prisma-seed (`file:./test.db`) + `setE2ESession` harness — covering the five status filter chips (`Все/Заявки/В работе/На проверке/Завершённые`), the 2-column grid of own-gig `full` `GigCard`s, the `full` footer labels (`Фикс. цена` / `Срок выполнения` / `К проекту`), the prototype empty state, and card-link navigation to the gig detail. The spec SHALL select the filter chips by visible text (the `<div>` chip row), NOT `role="tab"`/`role="tablist"`; SHALL navigate via the card-wide `<Link>` (the `«К проекту»` footer is a `<span>`, NOT a `<button>`); and SHALL NOT assert an in-content page title (the title is shell-supplied `«МОИ ГИГИ»`).

#### Scenario: My-gigs renders the chips and the own-gig grid

- **Given** an authenticated CLIENT with one `IN_PROGRESS` gig seeded into `file:./test.db`
- **When** they open `/my-gigs`
- **Then** the five filter chips (`Все/Заявки/В работе/На проверке/Завершённые`) SHALL be visible
- **And** the seeded gig's `full` `GigCard` SHALL render (title + the footer labels `Фикс. цена`, `Срок выполнения`, and `К проекту`)
- **And** no in-content page-title element SHALL be required (the title lives in the shell header `«МОИ ГИГИ»`)

#### Scenario: A gig card opens the gig detail

- **Given** an authenticated CLIENT on `/my-gigs` with a seeded gig
- **When** they click the gig card link (the card is a `<Link>`; `«К проекту»` is a `<span>`, not a button)
- **Then** the browser SHALL navigate to `/gigs/[id]`

#### Scenario: An empty tab shows the prototype empty state

- **Given** an authenticated CLIENT on `/my-gigs` whose only gig is `IN_PROGRESS` (so the `«Заявки»` chip is empty)
- **When** they activate the `«Заявки»` filter chip
- **Then** the empty-state heading `«Здесь пока пусто»` and the body `«Гигов с таким статусом нет. Они появятся здесь, когда изменится статус работ.»` SHALL be visible
- **And** the seeded `IN_PROGRESS` gig's card SHALL NOT be present

## REMOVED Requirements

### Requirement: Kit My-Gigs E2E Coverage

**Reason for removal:** `compose-my-gigs.spec.ts` asserted the **kit** `/my-gigs`: an in-content `«Мои гиги»` `SectionHeader` (scoped to `#main-content`), ARIA `role="tab"` status filters, and a `«К проекту»` `<button>` to open a gig. The rebuild (`MyGigsDesign.tsx`) moved the page title into the shell header (`«МОИ ГИГИ»`), made the status filters plain `<div>` chips, and made the whole `full` `GigCard` a `<Link>` with a `«К проекту»` `<span>` footer — so all three selectors now miss. The coverage is re-expressed against the rebuilt screen under the reconciled requirement above.

The platform previously SHALL have verified the kit my-gigs screen: an in-content `«Мои гиги»` header inside `#main-content`, `role="tab"` chips for the five statuses, and a `«К проекту»` button that navigates to `/gigs/[id]`.

#### Scenario: Kit my-gigs renders the header, tabs, and grid

- **Given** an authenticated CLIENT on the kit `/my-gigs` with one own gig
- **When** the page loads
- **Then** an in-content `«Мои гиги»` header, five `role="tab"` chips, and the own-gig grid render, and a `«К проекту»` button opens the gig detail

> Removed: the in-content `«Мои гиги»` title, the `role="tab"` chips, and the `«К проекту»` button selector are gone; the title now lives in the shell `«МОИ ГИГИ»` header, the chips are `<div>`s selected by text, and navigation is the card-wide `<Link>`. Covered by the reconciled requirement above.
