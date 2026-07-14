## ADDED Requirements

### Requirement: Russian Pluralization of Counted Nouns
All user-facing strings that render a count followed by a Russian noun (e.g. days «день», stages «этап») MUST select the correct plural form for the count using a shared helper, rather than a single hardcoded form. The helper MUST implement the standard Russian one/few/many rule.

#### Scenario: Day counts select the correct form
- GIVEN a helper that pluralizes «день»
- WHEN it renders counts 1, 2, 5, 11, 21, 22, 25
- THEN the output MUST be «1 день», «2 дня», «5 дней», «11 дней», «21 день», «22 дня», «25 дней»
- AND no count MUST ever render the incorrect «1 дней» form

#### Scenario: Stage counts select the correct form
- GIVEN a helper that pluralizes «этап»
- WHEN it renders counts 1, 2, 5, 11
- THEN the output MUST be «1 этап», «2 этапа», «5 этапов», «11 этапов»

#### Scenario: Render sites use the shared helper
- GIVEN the gig deadline («срок выполнения»), the stage note («[N этап]»), gig-card deadlines, and terms/negotiation deadline figures
- WHEN each is rendered with an arbitrary count
- THEN each MUST produce the grammatically correct form via the shared helper
- AND no render site MUST emit a fixed `${n} дней` / `${n} этап` string for all counts

### Requirement: Category Chips Signal Selection, Not Error
Selected category chips in the «Избранные категории» modal MUST present a "selected" affordance (filled or tinted pill) and MUST NOT present a thin colored (red/green) border that reads as a form-validation error state.

#### Scenario: A selected category reads as selected
- GIVEN the «Избранные категории» modal is open
- WHEN a user selects a category (e.g. «Дизайн» or «Программирование»)
- THEN the chip MUST show a filled/tinted selected treatment using the category's accent hue
- AND the chip MUST NOT show a 1px colored inset outline that resembles an invalid/valid field border

#### Scenario: An unselected category is visually distinct and neutral
- GIVEN the modal is open
- WHEN a category is not selected
- THEN the chip MUST use a neutral (non-hued, non-error) resting style clearly distinct from the selected style

### Requirement: Acceptance-Criteria Placeholder Fully Visible
The «Критерии приёмки» input on the create-gig and edit-gig forms MUST display its full example placeholder text without truncation or occlusion by the adjacent «Добавить» button.

#### Scenario: Placeholder is readable on the create-gig form
- GIVEN the create-gig form is displayed at desktop width
- WHEN the «Критерии приёмки» input is empty
- THEN the full example placeholder MUST be visible and not clipped behind the «Добавить» button

#### Scenario: Edit-gig form matches
- GIVEN the edit-gig form is displayed
- WHEN the «Критерии приёмки» input is empty
- THEN it MUST present the same non-truncated placeholder layout as the create-gig form

### Requirement: Comfortable «Назад к гигам» Back Control
The «← Назад к гигам» back control on the gig-detail screen MUST be a comfortably sized, legible target.

#### Scenario: Back control is a comfortable hit target
- GIVEN a specialist views a gig-detail screen
- WHEN the «← Назад к гигам» control renders
- THEN it MUST have an enlarged, legible label and a hit area with a minimum height of at least 32px
- AND it MUST provide a clear interactive (hover) affordance
