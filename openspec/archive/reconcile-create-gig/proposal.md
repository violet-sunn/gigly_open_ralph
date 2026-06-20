# reconcile-create-gig

**Type:** Regular change (UI reconciliation — the «Создать гиг» guided brief: DoD constructor + readiness meter + live
fee panel + success screen)
**Created:** 2026-06-20
**Plan:** `openspec/planning/full-design-reground.md` — Phase 3 (authored fresh from the prototype)
**Capability:** `ui`
**Depends on:** `reconcile-tokens-to-full-design` / `adopt-design-fonts` (archived — tokens/fonts), `reconcile-my-projects`
(archived — the success screen's «К моим гигам» → `/my-gigs`). The `createGig` action, the 10% fee math, and every Gig
schema field already exist.

## Why

`/gigs/new` is a **pre-redesign raw Tailwind form** (`gig-form.tsx`, not a composed-screen) — a single vertical column
of inputs. The prototype (`Gigly App.dc.html` `createGig` ~L643–816; `ROUTES.md` L17 «СОЗДАТЬ ГИГ») is a **guided
brief**: a two-column layout where the left form is organized as a Definition-of-Done constructor and the right panel
gives **live feedback** (a readiness meter + a fee summary), followed by a dedicated **success screen**.

The prototype `createGig`:
- **Left form**, four sections: **«Что нужно сделать?»** (title + category + description), **«Как поймём, что готово?»**
  (the DoD core, blue-accented: **цель** + **ожидаемый результат** + a **«Готово, когда…» criteria editor** — input +
  «Добавить» + suggestion pills + removable rows), **«Что важно учесть?»** (constraints + tags), **«Условия»** (budget ₽
  + срок).
- **Right panel**: **«Готовность брифа»** — a **readiness meter** (a `ProgressBar` % + colour + a 7-point checklist:
  Название / Категория / Описание / Цель / Ожидаемый результат / Критерии приёмки / Бюджет и срок + a nudge for the first
  gap) — and **«Сводка (комиссия)»** — a **live fee panel** (Бюджет → **Сервисный сбор (10%)** → **Итого к оплате**) +
  the «Опубликовать гиг» action.
- **Success screen** (`cgPublished`): a «Гиг опубликован» card + «К моим гигам» / «Создать ещё».

The **backend is complete** — `createGig` validates the fields, computes `serviceFee = budget × 10%` /
`totalAmount = budget + fee` (roubles→kopecks), and every DoD field exists on `Gig` (goal/deliverables/constraints/
acceptanceCriteria/budget/serviceFee/totalAmount/deadlineDays/stageCount/categorySlug). This change rebuilds the **UI**
to the guided brief; the fee math + validation are reused.

## What

- **Rebuild `/gigs/new` as a composition-pure `@composed-screen`** (`CreateGig.tsx`) — a two-column `Split`: the left
  DoD form (the four sections, controlled inputs that both compute the live feedback and submit via the `createGig`
  form) and the right panel (the readiness meter + the fee panel). All on-screen text Russian, F5-pure.
- **New `ReadinessMeter` block** — the «Готовность брифа» panel: a `ProgressBar` (the % done) + colour (≥6 green /
  ≥4 brand / else amber) + the **7-point checklist** (each ✓/○ + label) + a nudge (the first unmet check's hint).
  Reuses the existing `ProgressBar` primitive. Presentational (the screen computes the checks).
- **New `FeePanel` block** — the «Сводка (комиссия)» summary: Бюджет + **Сервисный сбор (10%)** + **Итого к оплате**
  (large, brand) + an actions slot for the «Опубликовать гиг» submit. Figures arrive pre-formatted (the screen computes
  fee = floor(budget × 0.10), total = budget + fee live from the budget input — the same 10% the server uses).
- **New `CriteriaEditor` block** — the «Готово, когда…» editor: an input + «Добавить», suggestion pills (common
  criteria), and the removable criterion rows. Interactive via callbacks (onAdd / onRemove / onPick); the screen holds
  the list and joins it into the `acceptanceCriteria` field.
- **Category selector** — reuse the existing `CheckField` (single-select) for the 5 categories (`lib/categories.ts`);
  feeds the `category` field + the readiness «Категория» check. (No new category block — `CheckField` suffices.)
- **New success screen** at `/gigs/new/success` (`CreateGigSuccess.tsx`) — the «Гиг опубликован» card + «К моим гигам»
  (→ `/my-gigs`) and «Создать ещё» (→ `/gigs/new`). `createGig` redirects here on success (changed from `/dashboard`).
- **`createGig`** — the **only** action change: the success redirect target moves from `/dashboard` to
  `/gigs/new/success` (Post/Redirect/Get). The validation + fee math are unchanged.

No screen carries off-token literals (F2) or bespoke markup (F5).

## Key facts / decisions (derived from the prototype + the existing backend)

- **The backend is complete** — `createGig` (validation + 10% fee + roubles→kopecks) and all DoD Gig fields exist. This
  is a UI rebuild; the fee math is **reused, not re-implemented** (the screen mirrors the same 10% for the live preview).
- **Success = a dedicated `/gigs/new/success` route** the action redirects to (PRG-correct; faithful to the prototype's
  «Гиг опубликован» card). `createGig`'s success redirect changes `/dashboard` → `/gigs/new/success` — its only change;
  the 7 `NEXT_REDIRECT:/dashboard` assertions in `gig-creation.test.ts` are updated to the new target. (Flagged.)
- **Readiness meter = 7 checks** (Название / Категория / Описание ≥20 / Цель / Ожидаемый результат / Критерии приёмки ≥1 /
  Бюджет и срок), reusing the `ProgressBar` primitive; it is **advisory** — `createGig` remains the gate (incl. its
  existing acceptanceCriteria ≥50-char floor, noted as a constraint independent of the «≥1 criterion» meter check).
- **Category via `CheckField`** (single-select) — no new category block (F1 structural; the readiness «Категория» check
  is satisfied).
- **3 new blocks** (`ReadinessMeter`, `FeePanel`, `CriteriaEditor`) — each a distinct, repeated prototype element worth a
  first-class, render-tested block; the criteria editor is the only interactive one (callbacks; state lives in the screen).
- **F1 baselines on the prototype frame** (`Gigly Развёртка.dc.html` createGig); fonts resolved. F1 =
  structural/overlay match; the absolute ≤1% gate is Phase 4 (`refidelity-from-full-design`).

## Scope

- **Screens:** rebuild `app/(protected)/gigs/new/` — replace `gig-form.tsx` with `CreateGig.tsx` (`@composed-screen`) +
  update `page.tsx`; new `app/(protected)/gigs/new/success/page.tsx` + `CreateGigSuccess.tsx`.
- **Blocks:** `app/components/blocks/ReadinessMeter.tsx` + `FeePanel.tsx` + `CriteriaEditor.tsx` (+ VMs in
  `view-models.ts` + barrel exports + fixtures).
- **Action:** `app/actions/gig.ts` `createGig` — success redirect `/dashboard` → `/gigs/new/success` (only change).
- **Tests:** `gig-creation.test.ts` (update the 7 redirect assertions to `/gigs/new/success`; keep all validation + fee
  assertions); `__tests__/e2e/compose-create-gig.spec.ts` (the readiness meter advances as fields fill, the live fee
  panel shows Бюджет/Сервисный сбор 10%/Итого, criteria add/remove, publish → the «Гиг опубликован» success screen);
  `__tests__/unit/components/domain-blocks.test.tsx` (the 3 new blocks render).
- **Docs:** the note in `docs/DESIGN_SYSTEM_SPEC.md`; check the Phase-3 item in `full-design-reground.md`.

## Non-goals

- Changing the `createGig` validation, the 10% fee math, or any Gig schema field (all reused; only the success redirect
  target changes).
- Lowering the server `acceptanceCriteria` ≥50-char floor (kept; the readiness «Критерии приёмки» check is ≥1 criterion,
  an advisory hint — the server stays the gate; flagged).
- A real autosave/draft backend (the form is client-state until submit).
- The absolute F1 ≤1% pixel gate (Phase 4).

## References

`gigly_full_design/Gigly App.dc.html` (the `createGig` screen ~L643–816: the four form sections L656–758, the readiness
meter L763–784, the fee panel L787–796, the success card L802–814; the readiness checks L1821–1833; the fee calc
L1853–1857); `ROUTES.md` L17. The current `app/(protected)/gigs/new/page.tsx` + `gig-form.tsx`; `app/actions/gig.ts`
`createGig` (validation + fee L46–117); `prisma/schema.prisma` Gig; `lib/categories.ts`; the `ProgressBar` primitive +
`Input`/`Textarea`/`Button`/`CheckField`/`SectionHeader`/`Notice`/`CriteriaList` blocks.
