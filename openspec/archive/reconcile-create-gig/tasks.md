# Tasks — reconcile-create-gig

Rebuild `/gigs/new` as the prototype **«Создать гиг» guided brief** (`Gigly App.dc.html` createGig ~L643–816): a
two-column composed screen — a DoD form + a live readiness meter + a live fee panel — then a dedicated success screen.
The `createGig` validation + 10% fee math + Gig schema are reused (only the success redirect target changes). Friction:
**high** (full form rebuild + 3 new blocks; the backend is untouched bar one redirect).

## 1. New blocks — ReadinessMeter, FeePanel, CriteriaEditor
- [x] `view-models.ts`: add `ReadinessMeterVM` (`{ pct: number; tone: 'amber'|'brand'|'green'; checks: {label,done}[];
      nudge?: string }`), `FeePanelVM` (`{ budget: Money; fee: Money; total: Money }`), `CriteriaEditorVM`
      (`{ items: string[]; suggestions: string[] }`).
- [x] `ReadinessMeter.tsx` — a `ProgressBar` (value=pct) + the checklist (✓/○ + label per check) + a nudge line.
- [x] `FeePanel.tsx` — Бюджет + «Сервисный сбор (10%)» + «Итого к оплате» (brand) + a `children` actions slot for the
      publish button.
- [x] `CriteriaEditor.tsx` — an `Input` + «Добавить» button, suggestion pills, and removable rows
      (`onAdd`/`onRemove`/`onPick` callbacks). Export all three from `index.ts`; add fixtures.
- **Test:** `domain-blocks.test.tsx` — each renders (ReadinessMeter bar+checklist; FeePanel Бюджет/Сервисный сбор/Итого;
  CriteriaEditor input+«Добавить»+rows).

## 2. Rebuild the create-gig screen
- [x] `app/(protected)/gigs/new/CreateGig.tsx` (`/* @composed-screen */`, 'use client'): a two-column `Split` — left:
      the 4 DoD sections (`SectionHeader` + controlled `Input`/`Textarea`; category via `CheckField`; the
      `CriteriaEditor`); right: `ReadinessMeter` (computed from the live field state) + `FeePanel` (computed budget→10%→
      total) with the «Опубликовать гиг» submit. One `<form action={createGig}>`; controlled named inputs (+ hidden
      `acceptanceCriteria` = criteria.join('\n'), hidden `category`). No className/style.
- [x] `app/(protected)/gigs/new/page.tsx`: render `<CreateGig … />` (keep the CLIENT gate; pass the category options).
      Remove `gig-form.tsx`.
- **Test:** E2E — the four sections render; filling fields advances the readiness meter; the fee panel shows the live
  Бюджет/Сервисный сбор (10%)/Итого.

## 3. The criteria editor wiring + readiness/fee computation
- [x] In `CreateGig.tsx`: hold the criteria list + all field state; compute the 7 readiness checks (Название/Категория/
      Описание≥20/Цель/Ожидаемый результат/Критерии приёмки≥1/Бюджет и срок) → pct + tone (≥6 green / ≥4 brand / amber) +
      the first-gap nudge; compute fee = floor(budget×0.10), total = budget+fee (mirroring the server's 10%).
- **Test:** E2E — adding/removing a criterion updates the list + the «Критерии приёмки» check; the fee updates with the
  budget.

## 4. Success screen + the createGig redirect
- [x] `app/(protected)/gigs/new/success/page.tsx` + `CreateGigSuccess.tsx` (`@composed-screen`): the «Гиг опубликован»
      card (SectionHeader + Notice) + «К моим гигам» (→ `/my-gigs`) + «Создать ещё» (→ `/gigs/new`) buttons.
- [x] `app/actions/gig.ts` `createGig`: change the success redirect `'/dashboard'` → `'/gigs/new/success'` (the ONLY
      action change; validation + fee math untouched).
- **Test:** E2E — publishing a valid gig lands on `/gigs/new/success` showing «Гиг опубликован».

## 5. Token-purity + composition-purity (F2 / F5)
- [x] No `className=`/`style=`/hex literals in `CreateGig.tsx` / `CreateGigSuccess.tsx` beyond layout-primitive props;
      the 3 new blocks stay token-pure (block-level className OK).
- **Test:** `lint:composition` PASS (CreateGig + success F5-pure, screen count +2); `lint:tokens` PASS (no new literal).

## 6. Record the decision
- [x] `docs/DESIGN_SYSTEM_SPEC.md` §10.x: the guided-brief two-column layout, the ReadinessMeter/FeePanel/CriteriaEditor
      blocks, the live-10%-fee mirror, the success route (createGig redirect change), and the category-via-CheckField +
      ≥50-char-floor decisions. Check the Phase-3 item in `full-design-reground.md`.
- **Test:** the note records the structure + the decisions.

## 7. Tests (add/update)
- [x] `gig-creation.test.ts`: update the 7 `NEXT_REDIRECT:/dashboard` assertions → `/gigs/new/success`; KEEP all
      validation + the 10% fee + roubles→kopecks assertions.
- [x] `compose-create-gig.spec.ts` (new E2E): readiness meter advances; live fee (Бюджет/Сервисный сбор 10%/Итого);
      criteria add/remove; publish → `/gigs/new/success` «Гиг опубликован».
- [x] `domain-blocks.test.tsx`: ReadinessMeter + FeePanel + CriteriaEditor render.
- **Test:** all pass.

## 8. Quality gates (run, assert green)
- [x] `npm run validate:tokens` + `npm run lint:tokens` — PASS.
- [x] `npm run lint:composition` — PASS (new screens counted).
- [x] `npm run build` — PASS (`/gigs/new` + `/gigs/new/success`).
- [x] `npm run clean:test-db && npm run test:unit` — green (incl. the updated `gig-creation.test.ts` + the new blocks).
- [x] `compose-create-gig` E2E green.
- **Acceptance (Fidelity DoD):** F2 token-pure, F1 structural/overlay match to the prototype createGig, F3 flow parity
  (validation + 10% fee math + readiness + publish → success), F5 composition-pure. F1 ≤1% deferred to Phase 4.

## 9. Planning-status (Phase 3)
- [x] Check `reconcile-create-gig` in `full-design-reground.md` Phase 3.
- **Test:** the Phase-3 item reads `[x]`.
