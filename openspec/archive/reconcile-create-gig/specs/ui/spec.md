# Spec delta — ui (reconcile-create-gig)

Rebuilds `/gigs/new` as the prototype **«Создать гиг» guided brief**: a two-column composed screen — a Definition-of-Done
form (title/category/description · цель/ожидаемый результат/«Готово, когда…» criteria editor · constraints/tags ·
budget/срок) with a live **readiness meter** + **fee panel**, then a dedicated **success screen**. The `createGig`
validation + 10% fee math are reused (only the success redirect target changes). Token-pure (F2) + composition-pure (F5).

## MODIFIED Requirements

### Requirement: Gig Creation Screen Is the Guided Brief
The `/gigs/new` screen MUST be a composition-pure `@composed-screen` inside `AppShell` (CLIENT-only), reconciled to the
prototype `createGig` as a two-column layout: a left Definition-of-Done form and a right feedback panel. The left form
MUST present four sections — **«Что нужно сделать?»** (title + a category selector + description), **«Как поймём, что
готово?»** (цель + ожидаемый результат + a «Готово, когда…» criteria editor), **«Что важно учесть?»** (constraints +
tags), **«Условия»** (budget ₽ + срок) — all controlled, submitting via the existing `createGig`. The screen MUST be
token-pure (F2) and composition-pure (F5); all on-screen text MUST be Russian.

#### Scenario: The guided-brief form renders and submits
- GIVEN a CLIENT on `/gigs/new`
- WHEN it renders
- THEN it MUST show the four DoD sections (title/category/description, цель/результат/criteria, constraints/tags,
  budget/срок) and the right feedback panel
- AND filling the required fields + publishing MUST call `createGig` (which creates the gig with the 10% fee)
- AND the screen MUST contain no `className=`/`style=`/hex literals (F5)

### Requirement: Gig Creation Redirects to a Success Screen
On a successful create, `createGig` MUST redirect to a dedicated success screen at `/gigs/new/success` (changed from
`/dashboard`). The success screen MUST render a «Гиг опубликован» confirmation card with **«К моим гигам»** (→ `/my-gigs`)
and **«Создать ещё»** (→ `/gigs/new`). The validation + fee math are unchanged.

#### Scenario: Publishing shows the success screen
- GIVEN a valid gig submitted from `/gigs/new`
- WHEN `createGig` succeeds
- THEN it MUST redirect to `/gigs/new/success`, which MUST show «Гиг опубликован» + «К моим гигам» + «Создать ещё»

## ADDED Requirements

### Requirement: Readiness Meter
The right panel MUST render a **«Готовность брифа»** readiness meter: a `ProgressBar` showing the share of completed
checks, colour-coded (≥6 of 7 green / ≥4 brand / else amber), over a **7-point checklist** — Название, Категория,
Описание (≥20 chars), Цель, Ожидаемый результат, Критерии приёмки (≥1), Бюджет и срок — each shown done (✓) or not (○),
plus a nudge for the first unmet check. It MUST update **live** as the form fields change. The meter is advisory;
`createGig` remains the validation gate.

#### Scenario: The meter advances as fields are filled
- GIVEN the create-gig screen
- WHEN the user fills the title, category, a ≥20-char description, цель, результат, ≥1 criterion, and budget + срок
- THEN the readiness meter MUST advance toward 7/7 and each corresponding checklist item MUST flip to done

### Requirement: Live Fee Panel
The right panel MUST render a **«Сводка (комиссия)»** fee panel showing **Бюджет**, **Сервисный сбор (10%)**, and
**Итого к оплате** (budget + 10%), computed **live** from the budget input using the same 10% the server applies, plus
the «Опубликовать гиг» action.

#### Scenario: The fee updates live and matches the server
- GIVEN a budget entered in roubles
- WHEN it changes
- THEN the panel MUST show Сервисный сбор = floor(budget × 0.10) and Итого = budget + fee
- AND on publish the created gig's `serviceFee` / `totalAmount` MUST equal those figures (the server's 10%)

### Requirement: «Готово, когда…» Criteria Editor
The DoD section MUST provide a `CriteriaEditor` to build the acceptance criteria: an input + «Добавить», suggestion pills
(common criteria), and removable criterion rows. The collected criteria MUST be submitted as the gig's
`acceptanceCriteria`. (The server's existing ≥50-char floor still applies as the gate.)

#### Scenario: Criteria are added, removed, and submitted
- GIVEN the criteria editor
- WHEN the user adds criteria (typing or via a suggestion) and removes one
- THEN the list MUST update, and publishing MUST submit the joined criteria as `acceptanceCriteria`

### Requirement: Create-Gig Blocks Render
The new `ReadinessMeter`, `FeePanel`, and `CriteriaEditor` blocks MUST render from fixtures (token-pure; `ReadinessMeter`
reuses `ProgressBar`; `CriteriaEditor` exposes add/remove/pick callbacks).

#### Scenario: The three blocks render from fixtures
- GIVEN the block fixtures
- WHEN each renders
- THEN `ReadinessMeter` MUST show the bar + the checklist, `FeePanel` MUST show Бюджет/Сервисный сбор (10%)/Итого, and
  `CriteriaEditor` MUST show the input + «Добавить» + the rows
- AND none MUST contain `className=`/`style=`/hex literals beyond their kit primitives

### Requirement: Create-Gig Reconciliation Keeps the Suite Green
The change MUST update `gig-creation.test.ts` (the success redirect target) + add E2E + block-render tests, keeping the
build, token-purity, composition, and unit/E2E suites green.

#### Scenario: Tests green
- GIVEN `gig-creation.test.ts`, `compose-create-gig.spec.ts`, `domain-blocks.test.tsx`
- WHEN they run
- THEN `gig-creation.test.ts` MUST assert the success redirect to `/gigs/new/success` (validation + 10% fee assertions
  preserved), the E2E MUST assert the readiness meter + live fee + criteria add/remove + the success screen, and the
  block renders MUST pass
- AND `npm run build`, `npm run lint:tokens`, `npm run lint:composition`, and `npm run test:unit` MUST pass

**Acceptance Criteria:**
- `/gigs/new` rebuilt as a two-column F5 `@composed-screen`: DoD form (4 sections, category via `CheckField`, `CriteriaEditor`) + readiness meter + live fee panel
- `ReadinessMeter` (ProgressBar + 7-check checklist + nudge), `FeePanel` (Бюджет/Сервисный сбор 10%/Итого + publish), `CriteriaEditor` (input + «Добавить» + suggestions + removable rows) — new blocks + fixtures + render tests
- live fee mirrors the server's 10% (floor(budget×0.10)); validation + fee math reused unchanged
- `createGig` success redirect `/dashboard` → `/gigs/new/success` (only action change); success screen «Гиг опубликован» + «К моим гигам»/«Создать ещё»
- `gig-creation.test.ts` updated to the new redirect (validation + fee assertions kept); F2 + F5 lints + `build` + `test:unit` + `compose-create-gig` E2E green; F1 = structural (≤1% Phase 4)
