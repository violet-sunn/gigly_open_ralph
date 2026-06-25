# testing — e2e-cross-cutting delta

## REMOVED Requirements

### Requirement: Confirmation dialog E2E coverage

**Reason:** The kit `ConfirmDialog` / `useConfirmDialog` (`app/components/ui/ConfirmDialog.tsx`, `app/hooks/useConfirmDialog.ts`) are orphaned — no rebuilt screen imports them. The reground removed the `[role="dialog"]` confirm modal: `GigDetail` «Отозвать заявку» and `ApplicationsDesign` «Принять»/«Отклонить» now submit directly. The direct Reject/Withdraw behaviour is covered by the `e2e-applications` and `e2e-gig-detail` specs. `__tests__/e2e/confirmation-dialogs.spec.ts` is deleted (it also used a broken 4-arg `createTestSession` call).

### Requirement: Mobile responsive E2E coverage

**Reason:** The design is desktop-first (1512px prototype) and `AppShellDesign` is desktop-only. `__tests__/e2e/mobile-responsive.spec.ts` asserted the deleted kit's responsive layouts (hamburger `button[aria-label="Toggle menu"]`, `nav div.hidden.md:flex`, `div.md:hidden.space-y-4` admin table-to-card, English nav) — none of which exist. The spec is deleted as out-of-scope, matching the deleted `shell-cutover` / `back-button-navigation` specs.

## MODIFIED Requirements

### Requirement: Cross-cutting E2E coverage on the rebuilt shell

The cross-screen E2E specs SHALL assert the rebuilt `AppShellDesign` shell and rebuilt screens rather than the deleted kit. Specifically: the theme toggle SHALL be exercised via the settings `Segmented` «Тема» control AND the header «Вид» button (`aria-label="Переключить тему"`), not a Select dropdown; keyboard navigation SHALL target the rebuilt skip link «Перейти к основному содержимому» → `#main-content` (`tabIndex={-1}`), the header search by `placeholder="Поиск чего угодно..."`, and the nav `aria-label="Навигация"`, with the removed kit modal focus-trap scenarios dropped; loading-state assertions SHALL match the rebuilt forms' real Russian pending labels; and the accessibility audit SHALL re-run axe (WCAG 2 A/AA) on the rebuilt screens. App/lib behaviour MUST NOT change, except a minimal aria/label fix if axe surfaces a genuine a11y violation.

#### Scenario: the settings «Тема» segmented control switches theme and persists

- **GIVEN** a seeded CLIENT signed in (via `setE2ESession`) on `/settings`, default `data-theme="dark"`
- **WHEN** the user picks «Светлая» on the «Тема» segmented control under the `ВНЕШНИЙ ВИД` section
- **THEN** the root `data-theme` becomes `light`, the body background switches to the light surface, and `localStorage['gigly-theme']` is `light`
- **WHEN** the page reloads
- **THEN** `data-theme` is still `light` (the boot script applies it before paint — no flash)
- **WHEN** the user picks «Тёмная»
- **THEN** `data-theme` returns to `dark` and `localStorage['gigly-theme']` is `dark`

#### Scenario: the header «Вид» button toggles the theme

- **GIVEN** a seeded user signed in on a protected route with the shell rendered, default `data-theme="dark"`
- **WHEN** the user clicks the header theme button (`aria-label="Переключить тему"`, `title="Вид"`)
- **THEN** the root `data-theme` flips to `light` and `localStorage['gigly-theme']` persists `light`
- **WHEN** the user clicks it again
- **THEN** `data-theme` returns to `dark`

#### Scenario: the skip link is first focusable and moves focus to main content

- **GIVEN** a seeded user signed in on a protected route
- **WHEN** the user presses Tab once
- **THEN** the skip link «Перейти к основному содержимому» is focused and visible
- **WHEN** the user activates it (Enter)
- **THEN** focus moves to `#main-content`

#### Scenario: the header search is reachable and routes a query

- **GIVEN** a seeded user signed in with the shell header rendered
- **WHEN** the user focuses the header search input (`placeholder="Поиск чего угодно..."`), types a query, and presses Enter
- **THEN** the app navigates to `/gigs` with the `?search=` query applied

#### Scenario: rebuilt form submissions show the real pending state

- **GIVEN** a seeded user on a rebuilt form (e.g. create-gig `/gigs/new` or profile edit `/profile/edit`)
- **WHEN** the user submits the form
- **THEN** the submit button enters its disabled/pending state (the rebuilt form's actual Russian label or `disabled` attribute) until the action redirects — no English «Posting gig...»/«Saving profile...» assertion remains

#### Scenario: the rebuilt screens pass the accessibility audit

- **GIVEN** the public `/`, `/login`, `/register` and the seeded authenticated `/dashboard`, `/gigs`
- **WHEN** axe runs with the `wcag2a` + `wcag2aa` tags on each
- **THEN** there are no violations — or any genuine violation surfaced by the rebuild is fixed with a minimal aria/label change in the design component (or the route is descoped with a recorded rationale)

#### Scenario: every key screen still renders in both themes (theme-coverage PASS-AS-IS)

- **GIVEN** the public routes (`/login`, `/register`, `/auth`) and the seeded SPECIALIST protected routes (`/dashboard`, `/gigs`, `/profile`, `/settings`)
- **WHEN** each is loaded under `gigly-theme=dark` and `gigly-theme=light`
- **THEN** the root `data-theme` matches and the body background is the expected dark/light surface, with no console error — confirming `theme-coverage.spec.ts` stays green without edits
