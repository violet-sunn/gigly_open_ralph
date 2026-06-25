# e2e-profile

## Why

Reconciliation change #12 of the E2E reconciliation plan (`openspec/planning/e2e-reconciliation.md`). The «Профиль» screen at `/profile` (and the public `/profile/[userId]`) was rebuilt on the `gigly_full_design` prototype's profile blocks (`app/(protected)/profile/ProfileDesign.tsx`): an **ID card** (avatar/initials + name + role tag + an `offline` status pill, and for a SPECIALIST a verified badge «Номер телефона верифицирован» + «На платформе с {memberSince}»; for a CLIENT a **«Реквизиты»** ИНН/КПП panel), then — SPECIALIST only — the two-column block of **«Стек»** (tags), **«Опыт»** (bio + work-experience entries), **«Избранные категории»** (favorites as `[ label ]`), and **«Реализованные проекты»** (a count badge + design `GigCard`s). The owner's edit affordance is a **Pencil `<span>`** beside the name and each block heading that routes to `/profile/edit?from=profile` (the existing, unchanged edit form). It is a thin view over the **unchanged** `getProfile` VM. The in-screen title is gone — the shell header supplies the `<h1>` «ПРОФИЛЬ».

`compose-profile.spec.ts` asserts the old kit `ProfileHeader` DOM and is red against the rebuilt component:

- It asserts the availability pill **«Не в сети»**, but the rebuilt status pill renders the literal **`offline`**.
- It asserts `getByRole('heading', { name: 'Профиль', exact: true })` has **count 0** ("no page-title heading"), but the shell header now renders an `<h1>` «ПРОФИЛЬ» — which a case-insensitive exact name-match resolves to, so the count is 1 and the assertion fails.
- It drives the edit flow via a button **«Редактировать профиль»** and asserts non-owner read-only via the absence of «Редактировать профиль»/«Редактировать» buttons — but the rebuilt edit affordance is a bare Pencil `<span>` (an `aria-hidden` svg, **no** accessible name/text); those button names never exist in the rebuild.

The parts that still match — `roleTag` «Senior Frontend Engineer» (`sp.position`), «Номер телефона верифицирован», «Стек»/«WebSocket», «Избранные категории»/«Маркетинг», «Опыт»/«Yandex», «Реализованные проекты»/«E2E Profile Realized Gig» (the `GigCard` title) — are kept. This change rewrites the broken assertions against the rebuilt component and its stable `getProfile` contract, and **adds** the PRD-called-out CLIENT «Реквизиты» (ИНН/КПП) coverage that the old spec lacked.

## What Changes

- **REWRITE `compose-profile.spec.ts`** against `ProfileDesign.tsx` (no behavioural/app change). Keep the existing seed (a SPECIALIST «Иван Иванов» with `position`/`techStack`/`bio`/work-experience/`phoneVerified` + favorite categories + a COMPLETED realized gig + a review; a CLIENT viewer «ООО Зритель» with `inn`). Cover:
  - **SPECIALIST owner ID card + blocks:** the name «Иван Иванов», the role tag «Senior Frontend Engineer», the verified «Номер телефона верифицирован», the «На платформе с …» member-since line; and the four blocks — «Стек» + a tag «WebSocket», «Опыт» + «Yandex», «Избранные категории» + «Маркетинг», «Реализованные проекты» + the realized `GigCard` title «E2E Profile Realized Gig». The shell `<h1>` «ПРОФИЛЬ» is the only page title.
  - **CLIENT owner «Реквизиты»:** as the CLIENT viewer, `/profile` shows the role tag «Заказчик» and the «Реквизиты» panel with «ИНН» + the seeded value and «КПП»; the SPECIALIST-only «Стек» block is absent.
  - **Public read-only:** `/profile/[specId]` viewed by the non-owner CLIENT renders the specialist sections («Стек»/«WebSocket», «Опыт»/«Yandex») with **no edit Pencil** (the name has no following-sibling pencil span).
  - **Owner edit round-trip (runs last — destructive):** clicking the Pencil beside the name (`getByText(name).locator('xpath=following-sibling::span')`) navigates to `/profile/edit`, and saving `#displayName` → «Save Profile» round-trips back to `/profile` with the new name visible.
  - **Remove** the «Не в сети» pill assertion, the `heading 'Профиль' count 0` assertion (replaced by asserting the shell `<h1>` «ПРОФИЛЬ»), and the «Редактировать профиль»/«Редактировать» button names.
- Reuse the existing harness (`setE2ESession` + direct Prisma seeding into `file:./test.db`, with the Category upserts for the favorites connect). **No app/lib changes** — the bare Pencil `<span>` is located by DOM position, not by adding a `role`/`aria-label`.

## Impact

- **Affected:** `__tests__/e2e/compose-profile.spec.ts` only.
- **Not touched:** `app/`/`lib/` behaviour (`ProfileDesign.tsx`, `getProfile`, `GigCard`, the `/profile/edit` form); the unit/integration suite (951/951 — must stay green); the canonical testing spec's documentary stance on per-screen E2E.
- **Plan:** advances `openspec/planning/e2e-reconciliation.md` from 11/16 → 12/16.
