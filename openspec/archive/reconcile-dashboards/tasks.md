# Tasks — reconcile-dashboards

Reconcile both `/dashboard` screens to Дашборд/specialist (`2860:3751`) + Дашборд/company (`3371:5387`): WELCOME
(greeting + `OnboardingCard ×2`) replacing `BannerCard`, a 2-col BOARD (Активные задачи ‖ Сообщения), the specialist
6× `AttentionCard` strip (company: hidden), no page-title. All blocks already exist — this is a screen + VM/builder
re-composition. Sources: `docs/figma-screens-export.md` §2. Friction: **high** (2 screens + the data layer + 2 E2E +
2 integration VM tests; `getProfile`-style live binding).

## 1. Extend the dashboard VMs + builders (live data)
- [x] In `lib/view-models.ts`: replaced `banner: BannerCardVM` with `greeting: string` + `onboarding:
      OnboardingCardVM[]` on both VMs; added `attention: AttentionCardVM[]` to `SpecialistDashboardData`. Imports
      updated (`OnboardingCardVM`/`AttentionCardVM`/`AttentionType`; dropped `BannerCardVM`).
- [x] `getClientDashboard`/`getSpecialistDashboard`: `greeting` = «Здравствуйте, {companyName|displayName|email}»;
      `onboarding` = `dashboardOnboarding(completion)` (card 1 «Заполните профиль» `progress: completion` + CTA, card 2
      «Как это работает» progress 0). Dropped `banner`. `completion`/`gigCards`/`tabs`/`messages` preserved.
- **Test:** ✅ both VM tests assert `greeting` truthy, `onboarding.length >= 2`, `onboarding[0].progress === completion`; no `banner`.

## 2. Attention helper (specialist) — getDashboardAttention
- [x] Added `getDashboardAttention(userId)` mapping recent `Notification`s (newest-first, cap 6) → `AttentionCardVM`s:
      `type` via the `ATTENTION_TYPE` eventType map (else MESSAGE→message / status-change), glyph/title from
      `lib/notification-utils`, `embed` = the linked gig as a `GigCardVM` (every notification carries a gig). `[]` when none.
- [x] Wired `attention` into `getSpecialistDashboard` (specialist only, via the `Promise.all`).
- **Test:** ✅ specialist VM test: `attention` ≤6, seeded `work_approved` → 1 card `type: 'accepted'` + `embed.kind: 'gig'`; no notifications → `[]`.

## 3. SpecialistDashboard screen — WELCOME + 2-col BOARD + attention strip
- [x] Rewrote `SpecialistDashboard.tsx` (`@composed-screen`, no className/style): dropped the page-title; **WELCOME**
      = greeting `SectionHeader` + `Grid columns={2}` of 2 `OnboardingCard`s (card 0 onCta → `/profile/edit`);
      **BOARD** = `Split ratio="2:1"` — col1 («Активные задачи» `SectionHeader` + `Tabs` + the `GigCard` feed) ‖
      col2 («Найти гиг» `SearchPanel` + «Сообщения» `MessagesPanel`); **WELCOME-2** = `SectionHeader` «Уведомления»
      + `Grid columns={3}` of the `AttentionCard`s, rendered only when `attention.length > 0`. gig-link + search preserved.
- **Test:** ✅ E2E renders greeting + OnboardingCard + 5 tabs + the «Уведомления» strip + a GigCard; search → `/gigs`; gig opens; no «Дашборд» heading.

## 4. ClientDashboard screen — WELCOME + 2-col BOARD (no attention strip)
- [x] Rewrote `ClientDashboard.tsx` similarly: page-title dropped; WELCOME greeting + 2 `OnboardingCard`s; BOARD
      `Split` — col1 («Активные задачи» `SectionHeader` + `Tabs` + `GigCard` feed) ‖ col2 («Найти новый проект»
      `CreateGigCTA` → `/gigs/new` + «Сообщения» `MessagesPanel`). **No** `AttentionCard` strip (company hidden). Tabs preserved.
- **Test:** ✅ E2E renders greeting + OnboardingCard + 4 tabs + «Создать гиг» → `/gigs/new`; gig opens; no «Дашборд» heading; **no** «Уведомления» strip.

## 5. Record the reconciliation decisions
- [x] Added §10.7 to `docs/DESIGN_SYSTEM_SPEC.md`: RC-S9 (`BannerCard` → WELCOME greeting + OnboardingCard×2,
      page-title dropped, 2-col BOARD) + RC-S10 (specialist attention strip binds live notifications, company hides it,
      Tabs retained as the col1 Menu-switcher / sanctioned variant for specialist).
- **Test:** ✅ the note records both decisions with the node ids (`2860:3751` / `3371:5387`).

## 6. Update the affected tests to the reconciled composition
- [x] `compose-specialist-dashboard.spec.ts`: seeded a notification; replaced the `BannerCard` assertion with greeting
      + OnboardingCard + «Уведомления»-strip + no-page-title; kept the 5-tab, gig-open, Заявки, search→`/gigs`
      assertions. (Gig title appears in both feed + attention embed → used `.first()`.)
- [x] `compose-client-dashboard.spec.ts`: replaced `BannerCard` with greeting + OnboardingCard + «Активные задачи» +
      no-attention-strip + no-page-title; kept tabs + create-gig assertions.
- [x] `{specialist,client}-dashboard-vm.test.ts`: assert `greeting`/`onboarding`(/`attention`); dropped `banner`.
- **Test:** ✅ updated specs pass; no test asserts `banner`, the «Дашборд» page-title, or a company attention strip.

## 7. Quality gates (run, assert green)
- [x] `npm run validate:tokens` — ✅ PASS (39 colours; in sync).
- [x] `npm run lint:tokens` — ✅ PASS (no new off-token literals).
- [x] `node scripts/design-system/validate-composition.js` — ✅ PASS (18 composed screens).
- [x] `npm run build` — ✅ PASS (`/dashboard` builds).
- [x] `npm run clean:test-db && npm run test:unit` — ✅ 936 pass + 1 known `gig-browse-access` flake (passes 10/10 in isolation).
- [x] Dashboard E2E green: `compose-specialist-dashboard` 4/4 + `compose-client-dashboard` 3/3.
- **Acceptance (Fidelity DoD):** ✅ F2 token-pure (lint green), F3 logical/flow parity (WELCOME + 2-col BOARD + tabs +
  counts + specialist strip + role navigation), F5 composition-pure (composition lint green). F1 absolute pixel gate
  deferred to Phase 2 (`refidelity-from-figma-references`); here F1 = structural/overlay match to each node.

## 8. Update the planning doc status
- [x] Checked `reconcile-dashboards` under "Phase 1 — Reconcile screens"; bumped progress to `8/13`.
- **Test:** ✅ the Status checkbox reads `[x]`; progress reads `8/13`.
