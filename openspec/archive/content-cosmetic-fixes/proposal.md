# Change: content-cosmetic-fixes

## Why

Four small content/styling defects surfaced in the production stress-test feedback (Заказчик #2/#4, Спец #4a/#8). Each individually reads as low-polish and undermines the "high-end B2B" positioning:

- **Заказчик #4 — broken Russian pluralization.** Counted nouns are rendered as `${n} дней` / `${n} этап` regardless of `n`, producing grammatically wrong strings like «1 дней», «2 дней», «1 этап» for any count. Russian requires three plural forms (one / few / many). There is no shared helper, so every render site hardcodes a single form.
- **Спец #4a — category chips read as validation errors.** In the «Избранные категории» modal, selected category chips get a 1px per-category colored inset border (Дизайн → red/rose, Программирование → green). A thin red/green outline on a form control is the universal signal for "invalid/valid field", so users misread selected categories as errors.
- **Заказчик #2 — criteria placeholder truncated.** On the create-gig form, the «Критерии приёмки» input sits in a flex row next to the «Добавить» button; the long example placeholder («…например: память не растёт при 500 подключениях за 6 часов») is clipped and hidden behind the button, defeating its purpose as guidance.
- **Спец #8 — «← Назад к гигам» too small.** The back control on the gig-detail screen is a 14px Handjet text link with `padding: 4px 0` — a small, hard-to-hit target that is easy to miss.

## What Changes

- **(a)** Add a shared Russian plural helper (`lib/utils/plural.ts`) covering `день/дня/дней`, `этап/этапа/этапов`, and a generic `pluralRu(n, [one, few, many])`. Apply it at every count+noun render site (deadline «срок выполнения», stage note «[N этап]», gig cards, terms/negotiation view-models).
- **(b)** Restyle the selected/hue state of the «Избранные категории» chips so the "selected" affordance reads as a filled/tinted pill, **not** an outlined field. The per-category hue is preserved as an accent (tint + text color), but the 1px colored inset border that reads as an error is removed or replaced with a non-error selected treatment.
- **(c)** Fix the «Критерии приёмки» row layout so the full example placeholder is visible (widen the input / reposition the «Добавить» button, e.g. stack the button below or shrink/soften the placeholder so it fits). The same row exists on the edit-gig screen and is fixed identically.
- **(d)** Enlarge the «← Назад к гигам» control to a comfortable, legible hit target (larger font, real padding / min height ≥ 32px, clear hover affordance).

## Non-Goals

- **Custom-category write-in** in the categories modal is explicitly **deferred** (not part of this change).
- No changes to gig/category data models, server actions, or validation logic.
- No broader design-system token refactor; these are targeted content/layout fixes on the existing `*Design.tsx` screens.
- Demo/fixture strings (`app/components/blocks/fixtures.ts`) are static prototype data; they are updated only where they display counted nouns, for visual consistency.

## Impact

- Affected specs: `ui`
- Affected code:
  - New: `lib/utils/plural.ts` (+ unit test)
  - `lib/view-models.ts`, `lib/terms.ts` — apply plural helper to deadline/stage strings
  - `app/components/blocks/GigCard.tsx`, `app/_design/GigCard.tsx` — plural deadline
  - `app/(protected)/profile/ProfileDesign.tsx` — category chip selected-state restyle
  - `app/(protected)/gigs/new/CreateGigDesign.tsx`, `app/(protected)/gigs/[id]/edit/EditGigDesign.tsx` — criteria row layout
  - `app/(protected)/gigs/[id]/GigDetail.tsx` — back-control sizing (and the matching CreateGig back link for consistency)
