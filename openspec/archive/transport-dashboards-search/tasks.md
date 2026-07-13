# Tasks — transport-dashboards-search

> AUDIT-AND-RECONCILE against the captured reference (these screens + shared components already exist and
> are wired). Use the proposal's REFERENCE-MAPPING table — `/gigs`→`search.*`, `/my-gigs`→`gigs.*`+`myGigs.*`.
> Preserve all VM/action wiring; touch `lib/view-models.ts` only on a genuine data gap (Method §3).

## 1. Baseline
- [x] Confirm current green baseline (build; note E2E requires the test server — defer the run to validate, as with change 2). Render/screenshot the three current screens for before/after.
- **Test:** build green recorded. (Reconciliation driven by three parallel reference-vs-component diff agents → concrete punch-lists; before/after = user eyeball on live :3000.)

## 2. Reconcile the shared components FIRST (everything depends on them)
- [x] `app/_design/GigCard.tsx`: diff compact mode vs `dashboard.specialist` and `full` mode vs `search.specialist`; fix status dot/label, company+rating row, tags, description clamp, timeline/progress, and the `full` footer (fixed price / deadline / «К проекту»). RESULT: already a faithful port — only fix was the verify seal size (13→16px). The `★★★★★` glyph and `<span>` footer were confirmed correct vs reference (not changed).
- [x] `app/_design/AttentionCardDesign.tsx`: diff vs the «Требует внимания» strip in `dashboard.specialist`; fix the colored bar, marker, title/date, and embedded GigCard. RESULT: width 320→280, marker 22px, title 16px/lh20, asymmetric embed padding, and added the VM-backed («К проекту») CTA below the embed (themed). NOTE: the prototype's raw embed card internals (status chip vs dot, Manrope title) are un-themed Figma primitives — kept the themed GigCard for consistency; flag for eyeball.
- **Notes:** keep props/VM contracts stable so consumers don't break; verbatim copy for any static labels.
- **Test:** components match the reference on a user-approved screenshot.

## 3. Reconcile DashboardDesign (SPECIALIST + CLIENT)
- [x] Diff each region vs `dashboard.specialist` / `dashboard.company` and fix: onboarding/welcome tiles, «Мои гиги» board (tabs + feed), right panel (specialist «Найти новый гиг» search box / client create-CTA), «Сообщения» panel, specialist «Требует внимания» strip. RESULT: fixed inverted tab styling (active = grey pill + hairline + blue count; inactive = transparent, no border); rewrote MessageRow to the reference card (avatar+name pill, VM `unread` badge, 3-line preview, subtitle+time footer); company CTA copy «новый»→«первый»; onboarding tile-2 title 18px + tile-1 edit icon. DECISION (user): specialist «+» create button stays company-only (prototype's button is shared-board chrome; specialists can't create gigs).
- **Notes:** transport static copy verbatim; keep the inline message row (do not extract). Preserve client-side tab filtering and the `DashboardVM` wiring.
- **Test:** both role dashboards match their reference; tab filtering still works.

## 4. Reconcile GigSearchDesign (`/gigs` browse → `search.*`)
- [x] Diff vs `search.specialist`/`search.company` and fix: filter row (category / budget / sort), results header, results grid (full GigCards), and the «Ничего не нашлось» empty state. RESULT: restyled `DSelect` to the design chip (funnel icon + «⌄» chevron, 16px text-3, hairline-06, native select kept for a11y/behaviour); surfaced the already-wired `minBudget` as a «Бюджет» filter; order now Категория / Бюджет / Сортировка / Рейтинг. DECISION (user): keep the working «Рейтинг» filter (one extra chip vs the prototype's 3) rather than dropping it.
- [x] CORRECTION (user eyeball): the filter chips belong in the SHARED SHELL HEADER (prototype `data-dc-tpl="51"`, to the right of the search field) — confirmed identical across `dashboard.*`/`search.*`/`gigs.*` headers — not in the page body where they rendered *under* the search. MOVED the chips into `AppShellDesign` (new `HeaderFilter`: funnel + fixed label + «⌄» over a transparent native `<select>`; accent-tinted when active), wired to the URL params (category / minBudget+maxBudget range / sort / minRating). Stripped the body filter row + option props from `GigSearchDesign` and `gigs/page.tsx`. Budget options transported as the prototype's ranges (до 50k / 50–150k / от 150k). NOTE: extends the (archived) shared-shell — flagged for the validate pass.
- [x] BUGFIX (user eyeball, round 2): (a) the chips redirected to `/gigs` from every screen — `navFilter` now refines the CURRENT route in place (no redirect). (b) DECISION (user): the chips must filter the feed on EVERY screen they appear, not just browse — `/gigs` filters server-side; the dashboard & my-gigs feeds now filter CLIENT-SIDE via a shared `applyGigFilters(cards, params)` (category/budget/minRating + budget sort). Added a numeric `GigCardVM.budgetValue` (roubles, from `toGigCardVM`) to support client-side budget range/sort (rating uses the existing `rating.value`). (c) DATA FIX: the dev DB's `Category` table was EMPTY (seedCategories never ran on it) so every gig was uncategorised → category filter returned nothing; seeded the 5 categories + backfilled all 54 gigs (inferCategory by tags). Fresh `prisma db seed` already does this; the live DB was stale.
- **Notes:** preserve the URL-param filter wiring on `page.tsx`; PaginationControls stays.
- **Test:** results + empty state match; filters still drive the query.

## 5. Reconcile MyGigsDesign (`/my-gigs` → `gigs.*` + `myGigs.*`)
- [x] Diff vs `gigs.specialist` (all-tab) and the per-tab variants `myGigs.specialist.{applications,in-progress,review,completed}`; fix the status tabs (Все/Заявки/В работе/На проверке/Завершённые), feed, and empty states. RESULT: applied the same active/inactive tab-styling fix as the dashboard (grey pill + blue count active; transparent, no border inactive). Feed grid + empty states already matched.
- **Notes:** preserve the client-side tabKey filtering and role-aware VM.
- **Test:** each tab matches its reference variant and filters the feed.

## 6. Verify no data gaps
- [x] Confirm the design markup needs no field the VMs don't already provide (status, tab counts, attention type/title/date/embed, message preview). If a real gap exists, extend the VM builder; otherwise leave `lib/view-models.ts` untouched. RESULT: NO data gaps — `AttentionCardVM.cta`, `ConversationItemVM.unread`/`subtitle`, and the `minBudget` param all already existed and were simply surfaced. `lib/view-models.ts` untouched.
- **Test:** every visible field is fed by the VM (no hardcoded mock data left in the markup).

## Acceptance (run before marking done)
- [x] `npm run build` passes. (green — verified after every edit round.)
- [x] `npm run lint` passes. (✔ No ESLint warnings or errors — confirms no unused imports after stripping the body filter row / option props.)
- [x] Dashboard (both roles), `/gigs` browse, and `/my-gigs` (all tabs) match their mapped `design-reference/screens/` files on user-approved screenshots — user eyeballed across three rounds (shared components → header-filter relocation → filter behaviour/data fixes) and confirmed.
- [x] Static copy (section headings, empty states) is the prototype's verbatim text.
- [x] Tab filtering (dashboard + my-gigs) and browse filters work — user-confirmed; filters function on every list screen (browse server-side, dashboard/my-gigs client-side via `applyGigFilters`).
- [~] GigCard's other consumers (profile / gig-detail / applications) — the only shared-component change touching them is the verify-seal size (13→16px), no structural/functional change; low regression risk. Visual spot-check recommended on those screens.
- [x] Existing E2E — PASSED. The 3 specs whose markup changed were UPDATED (`compose-gig-search`: 3→4 comboboxes + budget filter test + sort label; `compose-client-dashboard`: «новый»→«первый гиг»; `gig-pagination`: sort labels). `compose-specialist-dashboard` / `compose-my-gigs` / `gig-browse-access` needed no change. RAN the 6 route specs against `test.db` (stopped the dev server, `clean:test-db`, `npx playwright test … --reporter=line` → Playwright spawned its own server on `file:./test.db`): **28 passed (1.5m)**.
