# Tasks: content-cosmetic-fixes

## 1. Shared Russian plural helper (Заказчик #4)

- [x] 1.1 Create `lib/utils/plural.ts` exporting:
  - `pluralRu(n: number, forms: [one: string, few: string, many: string]): string` — implements the standard rule: `mod10===1 && mod100!==11 → one`; `mod10 in 2..4 && mod100 not in 12..14 → few`; else `many`.
  - `days(n: number): string` → `` `${n} ${pluralRu(n, ["день","дня","дней"])}` ``
  - `stages(n: number): string` → `` `${n} ${pluralRu(n, ["этап","этапа","этапов"])}` ``
  - Implementation note: keep pure/side-effect-free; no dependency on locale libs.
- [x] 1.2 **Test plan:** add `__tests__/unit/plural.test.ts`. Assert `days(1)==="1 день"`, `days(2)==="2 дня"`, `days(5)==="5 дней"`, `days(11)==="11 дней"`, `days(21)==="21 день"`, `days(22)==="22 дня"`, `days(25)==="25 дней"`; `stages(1)==="1 этап"`, `stages(2)==="2 этапа"`, `stages(5)==="5 этапов"`, `stages(11)==="11 этапов"`. Run `npm run test:unit -- plural`.

## 2. Apply plural helper at every count+noun render site (Заказчик #4)

- [x] 2.1 `lib/view-models.ts` — replace the hardcoded `${...} дней` strings (proposedDeadline, `gigDeadline`, terms tables, `client`/`proposed` deadline) with `days(...)`, and `` `${gig.stageCount} этап` `` (line ~719 `deadlineNote`) with `stages(gig.stageCount)`.
- [x] 2.2 `lib/terms.ts` — replace the local `days` helper (`` `${n} дней` ``) with the shared `days()` import (remove the duplicate).
- [x] 2.3 `app/components/blocks/GigCard.tsx` (line ~47) and `app/_design/GigCard.tsx` (line ~141) — render deadline via `days(vm.deadlineDays)` instead of `{vm.deadlineDays} дней`.
- [x] 2.4 `app/components/blocks/fixtures.ts` — update static demo strings that show counted nouns («14 дней», «10 дней», «1 этап», estimate «10/12 дней») to correct forms for their literal counts, for visual consistency (these are static, so just correct the literals).
- [x] 2.5 Grep-audit: `grep -rn "дней\|} этап" app lib --include=*.tsx --include=*.ts | grep -v __tests__` returns no remaining `${...} дней` / `${...} этап` template render (placeholders like «Напр.: 14 дней» and validation messages «…от 1 до 365 дней» are fixed prose and stay as-is).
- [x] 2.6 **Test plan:** `npm run build` clean; existing VM tests still pass (`npm run test:unit`).

## 3. Category chips: selected ≠ error (Спец #4a)

- [x] 3.1 `app/(protected)/profile/ProfileDesign.tsx` (chip render ~line 262) — change the selected state so it does **not** use `boxShadow: rgba(rgb,0.6) 0 0 0 1px inset` (the error-like colored border). Selected chip: filled/tinted pill using the hue as background tint + accent text (e.g. keep `background: rgba(${rgb},0.15)` and `color: rgb(${rgb})`, drop the 1px colored inset ring — optionally add a subtle same-tint fill or checkmark). Unselected chip: neutral resting style (existing `inset 0 0 0 1px var(--hairline-10)`, `--text-3`).
- [x] 3.2 Ensure selected vs unselected remain clearly distinguishable without relying on a thin colored outline.
- [x] 3.3 **Non-goal reminder:** do NOT add a custom-category write-in input (deferred).
- [x] 3.4 **Test plan:** live verify — open profile → «Избранные категории» modal; select «Дизайн» and «Программирование»; confirm chips look "selected" (filled/tinted), not like red/green invalid fields. Screenshot.

## 4. Criteria placeholder fully visible (Заказчик #2)

- [x] 4.1 `app/(protected)/gigs/new/CreateGigDesign.tsx` (criteria row ~lines 196–221) — fix the layout so the full placeholder «…например: память не растёт при 500 подключениях за 6 часов» is visible: give the input more room (e.g. put «Добавить» on its own line below the input, or make the input full-width with the button beneath), rather than a cramped flex row that clips the placeholder behind the button.
- [x] 4.2 Apply the identical fix to `app/(protected)/gigs/[id]/edit/EditGigDesign.tsx` (criteria row ~lines 217–240) so create/edit match.
- [x] 4.3 (Optional) if a shared `CriteriaEditor` block is used elsewhere (`app/components/blocks/CriteriaEditor.tsx`), apply the same layout fix there.
- [x] 4.4 **Test plan:** live verify — open create-gig at desktop width; the empty «Критерии приёмки» input shows its whole example placeholder, nothing hidden behind «Добавить». Repeat on edit-gig. Screenshot.

## 5. Enlarge «← Назад к гигам» control (Спец #8)

- [x] 5.1 `app/(protected)/gigs/[id]/GigDetail.tsx` (~line 118–130) — enlarge: bump `fontSize` (e.g. 14 → 16), add real padding (e.g. `6px 10px` with negative left margin to keep alignment, or `minHeight: 36`), and a clear hover affordance. Keep the «← Назад к гигам» label.
- [x] 5.2 For consistency, apply the same enlarged sizing to the matching «← Назад к гигам» control on `app/(protected)/gigs/new/CreateGigDesign.tsx` (~line 98–104).
- [x] 5.3 **Test plan:** live verify — the back control on gig-detail is visibly larger/legible and comfortable to click; hover state is obvious. Screenshot.

## 6. Full verification

- [x] 6.1 `npm run build` — clean.
- [x] 6.2 `npm run test:unit` — all pass (new plural test + no regressions).
- [x] 6.3 Live click-through per the PRD test plan: «1 день / 2 дня / 5 дней» render correctly across counts; category chips no longer look like errors; criteria placeholder fully readable; «Назад к гигам» comfortable. Capture screenshots. (Follow [[playwright-verify-script-location]]: put any ad-hoc verify `.mjs` inside the project dir; seed login `TestPass123`, spec=`alexey.ivanov@mail.ru`, client=`ivan.petrov@techcorp.ru`.)

## Verification notes

- **2.4 was a no-op:** every `fixtures.ts` counted-noun literal was already grammatically correct for its literal count («14 дней», «10 дней», «1 этап», «12 дней») — no edit needed.
- **4.3 was a no-op:** the shared `CriteriaEditor` block uses a short placeholder («Готово, когда…») that does not truncate; the long example only lives on the Create/Edit gig screens (fixed in 4.1/4.2).
- **E2E specs corrected:** `__tests__/e2e/terms-negotiation.spec.ts` asserted the *old buggy* grammar («21 дней», «22 дней»); updated to the now-correct «21 день» / «22 дня» to match the fix.
- **Unit suite:** new `plural.test.ts` (5 tests) passes; `npm run build` clean. The 90 pre-existing failures are the documented `test-suite-english-string-drift` baseline (auth/moderation/session integration specs asserting English error strings) — stable at 90 on a freshly-cleaned db, none in files this change touched. Every suite that exercises the changed code (gig-detail-vm, gig-applications-vm, domain-blocks, terms-negotiation, gig-deadline-milestones) passes.
- **Live verification:** 10/10 automated Playwright checks passed + screenshots confirm all four fixes (plural «11 дней» on gig card, filled ✓ category chips with no error-ring, full criteria placeholder with stacked «Добавить», 40px/16px back control with hover).
