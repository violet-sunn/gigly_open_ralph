# Implementation Tasks: compose-specialist-dashboard

> **Phase-2 screen composition.** Compose the SPECIALIST `/dashboard` body from kit blocks (`BannerCard` + `Tabs` +
> `GigCard·grid` + `SearchPanel` + `MessagesPanel`) inside the layout's `AppShell`, bound to real data (completion %,
> applications + assigned gigs across the **exact 5 tabs** Все/Заявки/В работе/На проверке/Завершённые, messages). Fill
> the missing `SearchPanel` block; extend `lib/view-models.ts` with `getSpecialistDashboard` (reusing `toGigCardVM`);
> F5 composition-pure, F3 logical parity; **F1 ≤1% deferred** (substitute font + cosmic banner raster). Mirror
> `app/(protected)/dashboard/ClientDashboard.tsx` + `lib/view-models.ts::getClientDashboard` (the just-archived
> compose-client-dashboard precedent). Friction: high.

---

## Task 1: [x] `SearchPanel` block (fill the composition gap)

**Implementation Notes:**
- Create `app/components/blocks/SearchPanel.tsx` — composing the `SearchInput` primitive + a primary "Найти проект"
  action (a block, so token classes / layout primitives are fine; it is NOT a `@composed-screen`). It owns its
  ephemeral input value and calls `onSubmit(query)` (the screen navigates) — the `GigCard.onOpen` callback pattern:
  ```tsx
  'use client'
  import { useState } from "react";
  import { Stack } from "@/app/components/layout/Stack";
  import { SearchInput } from "@/app/components/primitives/SearchInput";
  import { Button } from "@/app/components/primitives";

  export function SearchPanel({
    placeholder = "Найти проект", actionLabel = "Найти проект", onSubmit,
  }: { placeholder?: string; actionLabel?: string; onSubmit: (query: string) => void }) {
    const [q, setQ] = useState("");
    return (
      <Stack gap={3}>
        <SearchInput value={q} placeholder={placeholder} onChange={(e) => setQ(e.target.value)} onClear={() => setQ("")} />
        <Button variant="primary" onClick={() => onSubmit(q)}>{actionLabel}</Button>
      </Stack>
    );
  }
  ```
  (Confirm the `Button` variant prop name from `primitives/Button` (`ButtonVariant` is exported). Token-pure — no raw
  colour/spacing literals; arrange via `Stack` or token classes. Optionally wrap in a `<form>` so Enter submits.)
- Add `searchPanelFixture = { placeholder: "Найти проект", actionLabel: "Найти проект" }` to `fixtures.ts`; export
  `SearchPanel` from `app/components/blocks/index.ts`.

**Test Plan:**
```bash
test -f app/components/blocks/SearchPanel.tsx && grep -qE 'SearchPanel' app/components/blocks/index.ts && echo "block + export"
npm run lint:tokens && echo "token-pure"
```
Expected: `SearchPanel` token-pure block over `SearchInput`, fixture + barrel export; token lint green.

---

## Task 2: [x] `getSpecialistDashboard` mapper (`lib/view-models.ts`)

**Implementation Notes:**
- Extend `lib/view-models.ts` (server-only) — **reuse the existing `toGigCardVM`**; add a `tabKey` to each card so the
  screen can filter, and build the five-tab counts from the tagged set:
  ```ts
  export type SpecialistGigCard = GigCardVM & { tabKey: string }

  export interface SpecialistDashboardData {
    completion: number
    banner: BannerCardVM
    gigCards: SpecialistGigCard[]
    tabs: { value: string; label: string; count?: number }[]
    messages: MessagesPanelVM
  }

  export async function getSpecialistDashboard(userId: string): Promise<SpecialistDashboardData> {
    const [user, applications, assignedGigs, recent] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, include: { specialistProfile: true } }),
      prisma.application.findMany({ where: { specialistId: userId }, include: { gig: true }, orderBy: { createdAt: 'desc' } }),
      prisma.gig.findMany({ where: { assignedSpecialistId: userId, status: { in: ['IN_PROGRESS', 'REVIEW', 'COMPLETED', 'PAID'] } }, orderBy: { updatedAt: 'desc' } }),
      getRecentMessages(),
    ])

    // Заявки — PENDING applications; the card reflects the pending application (→ 'review' / На рассмотрении).
    const pendingCards: SpecialistGigCard[] = await Promise.all(
      applications.filter((a) => a.status === 'PENDING')
        .map(async (a) => ({ ...(await toGigCardVM(a.gig)), status: 'review' as Status, tabKey: 'applications' })),
    )
    // Rejected/withdrawn — surfaced under Все only (status 'rejected' / Отклонён). Reconciliation: no data lost.
    const archivedCards: SpecialistGigCard[] = await Promise.all(
      applications.filter((a) => a.status === 'REJECTED' || a.status === 'WITHDRAWN')
        .map(async (a) => ({ ...(await toGigCardVM(a.gig)), status: 'rejected' as Status, tabKey: 'archive' })),
    )
    // Assigned gigs — В работе / На проверке / Завершённые (standard toGigCardVM status mapping).
    const assignedCards: SpecialistGigCard[] = await Promise.all(
      assignedGigs.map(async (g) => ({
        ...(await toGigCardVM(g)),
        tabKey: g.status === 'IN_PROGRESS' ? 'in-progress' : g.status === 'REVIEW' ? 'verification' : 'completed',
      })),
    )
    const gigCards = [...pendingCards, ...assignedCards, ...archivedCards]

    const sp = user?.specialistProfile
    const fields = [sp?.displayName, sp?.techStack, sp?.experienceLevel, sp?.bio] // pick the specialist completion fields present
    const filled = fields.filter((f) => f && String(f).trim() !== '').length
    const completion = Math.round((filled / fields.length) * 100)

    const countByTab = (key: string) => gigCards.filter((c) => c.tabKey === key).length
    const tabs = [
      { value: 'all', label: 'Все', count: gigCards.length },
      { value: 'applications', label: 'Заявки', count: countByTab('applications') },
      { value: 'in-progress', label: 'В работе', count: countByTab('in-progress') },
      { value: 'verification', label: 'На проверке', count: countByTab('verification') },
      { value: 'completed', label: 'Завершённые', count: countByTab('completed') },
    ]

    const conversations: ConversationItemVM[] = recent.map((m) => ({
      id: m.gigId, avatar: '', name: m.senderName, preview: m.contentPreview,
      timestamp: new Date(m.createdAt).toLocaleDateString('ru-RU'), unread: 0,
    }))
    const banner: BannerCardVM = {
      headline: 'Находите интересные гиги и зарабатывайте больше',
      body: `Профиль заполнен на ${completion}%`,
      cta: { label: 'Найти проект', href: '/gigs' },
    }
    return { completion, banner, gigCards, tabs, messages: { conversations } }
  }
  ```
  Confirm the `specialistProfile` field names for completion (mirror `getClientDashboard`'s client-field approach;
  profile-evolution added avatar/position/specialization/location/timezone — pick the displayed ones). `import type`
  only (no runtime UI coupling). The `application.gig` include must carry the full gig so `toGigCardVM` has
  `categorySlug/tags/budget/deadlineDays/assignedSpecialistId`.

**Test Plan:**
```bash
grep -qE 'getSpecialistDashboard' lib/view-models.ts && grep -qE 'SpecialistGigCard' lib/view-models.ts && grep -qE 'tabKey' lib/view-models.ts && echo "mapper + tabKey"
for t in "Все" "Заявки" "В работе" "На проверке" "Завершённые"; do grep -q "$t" lib/view-models.ts && echo "tab: $t"; done
```
Expected: `getSpecialistDashboard` reusing `toGigCardVM`; five RU tabs; `tabKey` on each card.

---

## Task 3: [x] `SpecialistDashboard` composed screen

**Implementation Notes:**
- Create `app/(protected)/dashboard/SpecialistDashboard.tsx` (`'use client'`, marked `/* @composed-screen */`). Props =
  the `getSpecialistDashboard` result (serializable). Compose via **layout primitives only** (no className/style),
  mirroring `ClientDashboard.tsx`:
  ```tsx
  /* @composed-screen */
  'use client'
  import { useState } from 'react'
  import { useRouter } from 'next/navigation'
  import { Section } from '@/app/components/layout/Section'
  import { Grid } from '@/app/components/layout/Grid'
  import { Tabs } from '@/app/components/primitives'
  import { BannerCard, GigCard, SearchPanel, MessagesPanel } from '@/app/components/blocks'
  import type { SpecialistDashboardData } from '@/lib/view-models'

  export function SpecialistDashboard({ banner, gigCards, tabs, messages }: SpecialistDashboardData) {
    const router = useRouter()
    const [tab, setTab] = useState('all')
    const shown = tab === 'all' ? gigCards : gigCards.filter((g) => g.tabKey === tab)
    return (
      <Section title="Дашборд" gap={6}>
        <BannerCard vm={banner} />
        <SearchPanel onSubmit={(q) => router.push(`/gigs?q=${encodeURIComponent(q)}`)} />
        <Tabs active={tab} onSelect={setTab} tabs={tabs} aria-label="Гиги по статусу" />
        <Grid columns={3} gap={4}>
          {shown.map((vm) => (
            <GigCard key={`${vm.tabKey}-${vm.id}`} vm={vm} onOpen={() => router.push(`/gigs/${vm.id}?from=dashboard`)} />
          ))}
        </Grid>
        <MessagesPanel vm={messages} variant="preview" />
      </Section>
    )
  }
  ```
  The active tab `value` matches the card `tabKey` (`all`/`applications`/`in-progress`/`verification`/`completed`);
  `all` shows everything (incl. the `archive` cards). Key by `tabKey-id` to avoid any cross-set key collision. No
  `className`/`style`.

**Test Plan:**
```bash
grep -qE '@composed-screen' app/\(protected\)/dashboard/SpecialistDashboard.tsx && echo "composed screen"
grep -qE 'className=|style=' app/\(protected\)/dashboard/SpecialistDashboard.tsx && echo "CHECK raw styling" || echo "OK no raw styling"
npm run lint:composition && echo "F5 green"
```
Expected: F5-pure client composition (BannerCard + SearchPanel + Tabs + GigCard grid + MessagesPanel).

---

## Task 4: [x] Wire `SpecialistDashboard` into the dashboard page (SPECIALIST branch) + remove `SpecialistDashboardTabs`

**Implementation Notes:**
- In `app/(protected)/dashboard/page.tsx`: for `session.role === 'SPECIALIST'`, call
  `getSpecialistDashboard(session.userId)` (server) and render `<SpecialistDashboard {...data} />` (early return,
  surfacing the `?error=` notice the same way the CLIENT branch does), **replacing** the bespoke SPECIALIST branch
  (welcome card, `ProfileCompletionCard`, `SpecialistDashboardTabs`, the Найти-проект/Финансы/Сообщения sidebar cards,
  `DashboardOnboarding` for SPECIALIST). Keep the `getSession` redirect; leave the **CLIENT branch** and the
  **unknown-role fallback** unchanged.
- Delete `app/(protected)/dashboard/SpecialistDashboardTabs.tsx` (superseded by the composed `Tabs` + `GigCard·grid`).
- Drop now-unused imports/queries from `page.tsx` (`SpecialistDashboardTabs`, `DashboardOnboarding`,
  `ProfileCompletionCard`, `EmptyState`, `Suspense`, the page-level `getRecentMessages`, `formatDistanceToNow`, the
  `activeGigs`/`applications`/`user` prisma queries) — keep only what the unknown-role fallback still needs. After both
  dashboards are composed the page is thin: session → error param → CLIENT early return → SPECIALIST early return →
  unknown-role fallback.

**Test Plan:**
```bash
grep -qE 'getSpecialistDashboard|SpecialistDashboard' app/\(protected\)/dashboard/page.tsx && echo "SPECIALIST branch composed"
grep -qE "role === 'CLIENT'" app/\(protected\)/dashboard/page.tsx && echo "CLIENT branch retained"
test ! -f app/\(protected\)/dashboard/SpecialistDashboardTabs.tsx && echo "legacy tabs removed"
```
Expected: SPECIALIST branch renders `SpecialistDashboard` with real data; CLIENT branch + unknown-role fallback unchanged; redirect preserved; `SpecialistDashboardTabs` deleted.

---

## Task 5: [x] Mapper unit tests + SPECIALIST dashboard E2E

**Implementation Notes:**
- `__tests__/integration/specialist-dashboard-vm.test.ts` (mock `@/lib/prisma`/`next/*`; `createTestUser`/
  `createTestGig`/`createTestApplication`): `getSpecialistDashboard` returns the **five tabs** Все/Заявки/В работе/
  На проверке/Завершённые with **correct counts**; a PENDING application → a card with `tabKey: 'applications'` and
  `status: 'review'`; an assigned `IN_PROGRESS`/`REVIEW`/`COMPLETED`/`PAID` gig → `tabKey`
  `in-progress`/`verification`/`completed`/`completed`; a REJECTED/WITHDRAWN application → `tabKey: 'archive'` (only
  under Все); completion % from specialist profile fields; cards assignable to `GigCardVM` (compile-time).
- `__tests__/e2e/compose-specialist-dashboard.spec.ts` (setE2ESession as SPECIALIST + seed via prisma into
  `file:./test.db`: a gig assigned to the specialist + a PENDING application on another OPEN gig — the
  `compose-client-dashboard.spec.ts` / `shell-cutover.spec.ts` seeding + `router.push` patterns): the dashboard renders
  the banner + the **5 RU tabs** + a `GigCard`; clicking a `GigCard` → `/gigs/[id]`; submitting the `SearchPanel` →
  `/gigs`; switching to **Заявки** shows the pending application; the onboarding overlay is gone for SPECIALIST.

**Test Plan:**
```bash
npm run clean:test-db && npx vitest run __tests__/integration/specialist-dashboard-vm.test.ts 2>&1 | tail -12
npx playwright test __tests__/e2e/compose-specialist-dashboard.spec.ts --project=chromium 2>&1 | tail -12
```
Expected: mapper unit tests pass (5 tabs + counts + tabKey/status mapping); E2E confirms blocks render, tabs + gig links + search work.

---

## Task 6: [x] Buildable acceptance (F3 + F5 + suite) + scope confirmation

**Implementation Notes:**
- Run F5 composition lint, token lint, build, full unit suite (~865 — update any tests asserting the old SPECIALIST
  markup: English tab labels "Active Work"/"Pending Applications"/"Archive", the welcome card, `ProfileCompletionCard`,
  the sidebar cards), and the E2E.
- Confirm scope: only the SPECIALIST dashboard composed (CLIENT branch + unknown-role fallback untouched); no
  data-model/server-action/shell change; `SearchPanel` additive; the block view-model contracts (`view-models.ts` in
  `app/components/blocks`) unchanged (the new `SpecialistGigCard`/`SpecialistDashboardData` live in `lib/view-models.ts`).

**Test Plan:**
```bash
npm run lint:composition && npm run lint:tokens && echo "F5 + tokens green"
npm run build && echo "build passes"
npm run clean:test-db && npm run test:unit && echo "unit suite green (~865)"
git diff --stat app/\(protected\)/dashboard/ lib/view-models.ts app/components/blocks/ | tail
```
Expected: F3 + F5 + build + suite + E2E green; scope held (SPECIALIST only; CLIENT/shell/models untouched).

---

## Task 7: [x] F1 fidelity diff vs specialist-dashboard (artifacts; ≤1% deferred)

**Implementation Notes:**
- Capture the SPECIALIST `/dashboard` at 1440px (a capture spec like the shell's / client dashboard's; seed a
  SPECIALIST with an assigned gig + a pending application for a populated render), then
  `node scripts/design-system/fidelity-diff.js <dashboard-actual.png> screens/specialist-dashboard.jpg
  docs/design-system/fidelity/out/specialist-dashboard` → ratio + `diff/side-by-side/overlay-50`. Review the overlay for
  composition fidelity.
- The ≤1% target is **deferred** (substitute font + the unexported cosmic banner raster — BannerCard `art`); report the
  ratio + that the residual is those documented factors, not a composition defect (per compose-shell-cutover /
  compose-client-dashboard).

**Test Plan:**
```bash
node scripts/design-system/fidelity-diff.js docs/design-system/fidelity/out/specialist-dashboard/dashboard-actual.png screens/specialist-dashboard.jpg docs/design-system/fidelity/out/specialist-dashboard
```
Expected: diff + overlay produced; composed layout visually faithful; ≤1% deferred (font + banner raster).

---

## Summary

Total tasks: 7
Estimated effort: 10–14 hours (friction: high — a new block + a two-source mapper + a composed screen + page rewrite + legacy-tabs removal + unit/E2E/fidelity)

**Deliverables:**
- `SearchPanel` block (gap fill) over `SearchInput` + fixture + export.
- `lib/view-models.ts` — contract-typed `getSpecialistDashboard` (reusing `toGigCardVM`) with `tabKey` cards + the 5-tab counts.
- `SpecialistDashboard` F5-pure `@composed-screen` (BannerCard + SearchPanel + Tabs + GigCard·grid + MessagesPanel); wired into the page for SPECIALIST; `SpecialistDashboardTabs` removed.
- Mapper unit tests + SPECIALIST dashboard E2E (5 tabs + counts + gig links + search); F1 diff produced (≤1% deferred).

**Critical path:** SearchPanel (1) → mapper (2) → SpecialistDashboard (3) → page wiring + legacy removal (4) → tests (5) → acceptance (6) → [artifacts] F1 diff (7).

**Dependencies:** compose-shell-cutover, domain-blocks, ratings-reviews-model, category-taxonomy — all complete.

---

## Implementation status (2026-06-16)

**Done + verified (Tasks 1–7):**
- **`SearchPanel` block** (`app/components/blocks/SearchPanel.tsx`) — `SearchInput` primitive + a primary "Найти
  проект" submit, presentational `onSubmit(query)`; fixture (`searchPanelFixture`) + barrel export. Token-pure.
- **`getSpecialistDashboard` mapper** (`lib/view-models.ts`) — reuses `toGigCardVM`; fetches the specialist's
  applications (full gig) + assigned gigs, tags each card with a `tabKey`, builds the five-tab counts
  (Все/Заявки/В работе/На проверке/Завершённые), computes completion %, reuses `getRecentMessages`. New
  `SpecialistGigCard`/`SpecialistDashboardData` types (block view-model contracts unchanged).
- **`SpecialistDashboard` `@composed-screen`** (`app/(protected)/dashboard/SpecialistDashboard.tsx`) — BannerCard +
  SearchPanel + Tabs + GigCard·grid + MessagesPanel via layout primitives only; tabs filter by `tabKey`; gig links +
  search via `router.push`. F5-pure (no className/style).
- **Page wiring** — `page.tsx` is now thin: session → error notice → CLIENT early return → SPECIALIST early return →
  unknown-role fallback. `SpecialistDashboardTabs.tsx` deleted; the bespoke SPECIALIST markup/overlay removed; CLIENT
  branch + unknown-role fallback preserved.
- **Tests** — `__tests__/integration/specialist-dashboard-vm.test.ts` **2/2 pass** (five tabs + counts; PENDING →
  `applications`/`review`; IN_PROGRESS/REVIEW/COMPLETED·PAID → `in-progress`/`verification`/`completed`;
  REJECTED/WITHDRAWN → `archive` under Все only; empty-state). `__tests__/e2e/compose-specialist-dashboard.spec.ts`
  **4/4 pass** in a real browser (banner, five RU tabs, search, GigCard; gig → `/gigs/[id]`; Заявки shows the pending
  application; search → `/gigs`). Superseded `specialist-active-gigs-dashboard.spec.ts` deleted; the two obsolete
  specialist-dashboard tests in `empty-states.spec.ts` updated to the composed dashboard.
- **Gates** — `lint:composition` (F5, 5 composed screens) ✓ · `lint:tokens` (F2) ✓ · `npm run build` ✓ (24 routes;
  `/dashboard` 758 B) · `npm run test:unit` **867/867 pass** (was 865; +2 new) ✓.

**Task 7 (F1 vs `specialist-dashboard`): diff produced; composed layout faithful; ≤1% deferred.** ratio = **0.1895**
(`docs/design-system/fidelity/out/specialist-dashboard-live/`: diff / side-by-side / overlay-50; produced by a
temporary capture spec, removed after — artifacts preserved, per the compose-shell-cutover / compose-client-dashboard
pattern). The residual is the **substitute font** (SF Compact unlicensed) + the **cosmic banner raster** (BannerCard
`art`, unexported) + lossy-mockup spacing — not a composition defect. ≤1% is reached once the font is licensed and the
raster exported (both outside this change).

**Scope guards (non-goals held):** no CLIENT dashboard change; no new routes (`/gigs`, `/finances`, `/chats`); no
data-model/server-action/shell change; `SearchPanel` additive; the block view-model contracts
(`app/components/blocks/view-models.ts`) unchanged — the new types live in `lib/view-models.ts`.

**Reconciliation recorded:** legacy English 3-tab (Active/Pending/Archive) → the design's five RU tabs;
rejected/withdrawn applications surface under **Все** only (`status: 'rejected'`); PENDING-application cards reflect the
pending state (`review`/«На рассмотрении»).
