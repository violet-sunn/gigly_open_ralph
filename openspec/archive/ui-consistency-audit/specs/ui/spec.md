# UI Spec Delta: UI Consistency Audit

## ADDED Requirements

### Requirement: UI Consistency Across All Pages
All pages in the application MUST apply design patterns consistently to ensure visual coherence and professional polish.

#### Scenario: Spacing rhythm is consistent across all pages
- GIVEN any authenticated page in the application
- WHEN the page renders with cards, sections, or form elements
- THEN card spacing MUST use `gap-6` (24px) between cards
- AND card padding MUST use `p-5` (20px) or `p-6` (24px) consistently
- AND section spacing MUST use `gap-9` (36px) to `gap-12` (48px) between major sections
- AND form field spacing MUST use `space-y-6` (24px) between fields
- AND the spacing pattern MUST match Dashboard reference implementation

#### Scenario: Status badges use semantic color system consistently
- GIVEN any page that displays status badges (gig status, application status, etc.)
- WHEN status badges render
- THEN "OPEN" status MUST use gray colors: `bg-gray-500/10 text-gray-400`
- AND "IN_PROGRESS" status MUST use green colors: `bg-green-500/10 text-green-400`
- AND "REVIEW" status MUST use yellow/warning colors: `bg-yellow-500/10 text-yellow-400`
- AND "COMPLETED" status MUST use yellow/warning colors: `bg-yellow-500/10 text-yellow-400`
- AND "PAID" status MUST use green/success colors: `bg-green-500/10 text-green-400`
- AND "PENDING" application status MUST use gray colors
- AND "ACCEPTED" application status MUST use green colors
- AND "REJECTED" application status MUST use red colors: `bg-red-500/10 text-red-400`
- AND "WITHDRAWN" application status MUST use gray colors
- AND the color system MUST be consistent across all pages

#### Scenario: Interactive elements have consistent hover and focus states
- GIVEN any page with interactive elements (buttons, links, cards)
- WHEN the user hovers over or focuses on an interactive element
- THEN clickable cards MUST show hover state with background color change (e.g., `hover:bg-gray-50` or `hover:bg-surface-level-2`)
- AND buttons MUST show hover state with color darkening (e.g., `hover:bg-blue-600` for `bg-blue-500`)
- AND links MUST show hover state with color change (e.g., `hover:text-blue-400` for `text-blue-500`)
- AND focus states MUST include visible focus rings: `focus:ring-2 focus:ring-blue-500`
- AND the hover/focus patterns MUST match Dashboard reference implementation

#### Scenario: Primary CTAs use prominent blue styling consistently
- GIVEN any page with primary call-to-action buttons
- WHEN primary CTA buttons render
- THEN buttons MUST use `bg-blue-500 hover:bg-blue-600 text-white`
- AND buttons MUST use `py-3 px-6 rounded-md text-sm font-semibold`
- AND buttons MUST include focus states: `focus:ring-2 focus:ring-blue-500`
- AND disabled states MUST use `disabled:opacity-50 disabled:cursor-not-allowed`
- AND the styling MUST be consistent across all forms and action areas

#### Scenario: Responsive behavior is consistent on mobile viewports
- GIVEN any page in the application
- WHEN the page is viewed on a mobile device (320px width)
- THEN the layout MUST adapt appropriately without horizontal scrolling
- AND navigation MUST remain functional and accessible
- AND cards MUST stack vertically with proper spacing
- AND form fields MUST remain fully functional
- AND text MUST remain readable (no truncation or overflow)
- AND the responsive behavior MUST match Dashboard patterns

#### Scenario: Responsive behavior is consistent on desktop viewports
- GIVEN any page in the application
- WHEN the page is viewed on a desktop device (1920px width)
- THEN the layout MUST use appropriate max-width constraints (e.g., `max-w-7xl`)
- AND content MUST be centered with proper margins
- AND multi-column layouts MUST display correctly
- AND no excessive whitespace MUST be present
- AND the responsive behavior MUST match Dashboard patterns

#### Scenario: Text contrast meets WCAG AA standards
- GIVEN any page with text content
- WHEN text is rendered on backgrounds
- THEN normal text (< 18px) MUST have contrast ratio ≥ 4.5:1
- AND large text (≥ 18px or ≥ 14px bold) MUST have contrast ratio ≥ 3:1
- AND all text MUST be readable without accessibility tools
- AND contrast ratios MUST be verified with automated tools (e.g., axe-core)

#### Scenario: Ad-hoc styles are documented for token migration
- GIVEN the audit identifies hardcoded color or spacing values
- WHEN ad-hoc styles are found that should use design tokens
- THEN the styles MUST be documented in audit findings
- AND recommendations MUST be provided for appropriate token equivalents
- AND a plan MUST be created for future token migration (if needed)

**Acceptance Criteria:**
- All 14 pages audited against consistency checklist
- Spacing rhythm consistent across all pages (gap-6, p-5/p-6, gap-9 to gap-12)
- Status badge colors consistent across all pages
- Interactive states (hover/focus) consistent across all pages
- Responsive behavior verified on mobile (320px) and desktop (1920px)
- All text meets WCAG AA contrast ratios (verified with axe-core)
- Ad-hoc styles documented with token recommendations
- Full test suite passes with zero regressions (493+ tests)
- Manual QA checklist completed for all 14 pages
- Optional: Visual regression test baseline created

---

## MODIFIED Requirements

None. This change verifies and enforces existing requirements rather than modifying them.

---

## REMOVED Requirements

None. This change does not remove any existing requirements.
