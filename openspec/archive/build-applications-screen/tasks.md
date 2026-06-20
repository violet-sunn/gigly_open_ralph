# Tasks — build-applications-screen

Lift the company applicants list out of gig-detail into a dedicated, gig-scoped **«Отклики»** screen at
`/gigs/[id]/applications` (prototype `applications`, `Gigly App.dc.html` ~L1115–1184), add a first-class `ApplicantCard`
block, and turn gig-detail's owner affordance into «Смотреть отклики (N)». Accept/reject reused verbatim. Friction:
**medium** (new route + block + VM; the lifecycle/actions are untouched).

## 1. Add the ApplicantCard block + VM
- [x] `app/components/blocks/view-models.ts`: add `ApplicantCardVM` (id, name, level?, rating, verified?, tags[],
      approach?, questions?, estimate?, status: { label, tone: Status }). `app/components/blocks/ApplicantCard.tsx`:
      identity row (avatar + name + verify + level + ★ rating) + status pill, tags, then Подход / Уточняющие вопросы /
      Оценка трудозатрат sections, + a `children` actions slot (rendered for pending). Token-pure, presentational (NO
      server-action imports). Export from `index.ts`; add `applicantCardFixtures` to `fixtures.ts`.
- **Test:** `domain-blocks.test.tsx` — ApplicantCard renders identity + the three sections + the actions slot.

## 2. Add the getGigApplications VM
- [x] `lib/view-models.ts`: `getGigApplications(gigId, viewer)` → `{ title, count, assignedName?: string,
      applicants: ApplicantCardVM[] } | null`. Owner-gated (return null when `gig.clientId !== viewer.userId`). Reuse the
      existing `GigDetailApplication` mapping (names, ratings, level, tags, approach/questions/estimate, status →
      tone). `assignedName` = the accepted applicant's name when the gig is assigned.
- **Test:** `gig-applications-vm.test.ts` — owner gets title/count/applicants; non-owner gets null; assigned gig exposes
  `assignedName`.

## 3. Create the /gigs/[id]/applications route + screen
- [x] `app/(protected)/gigs/[id]/applications/page.tsx` (server): resolve the viewer, call `getGigApplications`; if null
      → `redirect('/gigs/[id]')` (owner gate). Render `<Applications … />`.
- [x] `app/(protected)/gigs/[id]/applications/Applications.tsx` (`/* @composed-screen */`, 'use client'): «← Назад к
      проекту» link (→ `/gigs/[id]`), `SectionHeader` «Отклики» (count) + the «на проект «{title}»» subtitle, a derived
      success `Notice` «Назначен {assignedName} — гиг переходит «В работу». Остальные отклики отклонены автоматически.»
      when `assignedName`, the `ApplicantCard` list (each with the inline Принять/Отклонić forms for pending applicants
      via `useActionState(acceptApplication/rejectApplication)`), and an empty state when there are no applicants.
      Template + blocks + data only — no className/style/hex; action forms inlined (compose-screen-inline-islands).
- **Test:** E2E — owner sees «Отклики» + the cards (approach/questions/estimate) + the back link; non-owner redirected.

## 4. Rewire gig-detail to the link
- [x] `GigDetail.tsx`: replace the owner inline list (`ApplicationEntry` + «Отклики: N») with the «Смотреть отклики (N)»
      link → `/gigs/[id]/applications` (owner only). Remove the now-unused `ApplicationEntry` owner block from gig-detail.
      Keep every other flow verbatim (apply/withdraw, lifecycle, messaging, dispute, admin).
- **Test:** E2E `compose-gig-detail-apply.spec.ts` — gig-detail shows «Смотреть отклики» link; the inline applicant list
  assertions are replaced (no inline list).

## 5. Accept/reject lifecycle (reused) + the assigned notice
- [x] Wire the screen's Принять/Отклонить to the existing `acceptApplication` / `rejectApplication` (no changes). Accept
      → assign + `IN_PROGRESS` + auto-reject others + notify (existing redirect to `/gigs/[id]` kept). The «Назначен …»
      success notice is **derived** on the applications screen from the assigned gig state (shown on revisit) — the shared
      action's redirect is NOT changed (flagged decision).
- **Test:** E2E — Принять → gig becomes IN_PROGRESS + the other applicant auto-rejected; revisiting the screen shows the
  «Назначен …» notice; Отклонить rejects one (gig stays OPEN).

## 6. Token-purity + composition-purity (F2 / F5)
- [x] No `className=`/`style=`/hex literals in `Applications.tsx` / `ApplicantCard.tsx` beyond layout-primitive props.
- **Test:** `lint:composition` PASS (Applications F5-pure, screen count +1); `lint:tokens` PASS (no new literal).

## 7. Record the decision
- [x] `docs/DESIGN_SYSTEM_SPEC.md` §10.x: the gig-scoped «Отклики» screen + the lift from gig-detail + the new
      `ApplicantCard` block + the derived-success-notice decision (action redirect unchanged). Check the Phase-3 item in
      `full-design-reground.md`.
- **Test:** the note records the structure + provenance.

## 8. Tests (add/update)
- [x] `build-applications-screen.spec.ts` (new E2E): owner list + approach/questions/estimate; accept → IN_PROGRESS +
      auto-reject + assigned notice; reject; non-owner redirect; empty state.
- [x] `gig-applications-vm.test.ts` (new): owner-gated shape + assignedName.
- [x] `domain-blocks.test.tsx`: ApplicantCard render.
- [x] `compose-gig-detail-apply.spec.ts`: gig-detail «Смотреть отклики» link (drop inline-list assertions).
- **Test:** all pass.

## 9. Quality gates (run, assert green)
- [x] `npm run validate:tokens` + `npm run lint:tokens` — PASS.
- [x] `npm run lint:composition` — PASS (new screen counted).
- [x] `npm run build` — PASS (`/gigs/[id]/applications`).
- [x] `npm run clean:test-db && npm run test:unit` — green (incl. `gig-applications-vm` + domain-blocks).
- [x] `build-applications-screen` + `compose-gig-detail-apply` E2E green.
- **Acceptance (Fidelity DoD):** F2 token-pure, F1 structural/overlay match to the prototype `applications`, F3 flow
  parity (accept → IN_PROGRESS + auto-reject + notify; reject; owner gate), F5 composition-pure. F1 ≤1% deferred to Phase 4.

## 10. Planning-status (Phase 3)
- [x] Check `build-applications-screen` in `full-design-reground.md` Phase 3.
- **Test:** the Phase-3 item reads `[x]`.
