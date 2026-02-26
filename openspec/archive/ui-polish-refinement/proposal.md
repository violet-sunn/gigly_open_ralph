# UI Polish Refinement

## Problem Statement

The current dark theme implementation does not match the visual quality and polish of the design mockups in `/screens`. Key issues:

1. **Color Mismatch**: Background colors are too light compared to mockups. Current background (#1A1F2E) vs mockup requirement (~#0A0E1A - much darker navy).
2. **Insufficient Contrast**: Card backgrounds and borders lack the subtle sophistication shown in mockups.
3. **Heavy Visual Weight**: Borders are too prominent, buttons too heavy, overall design feels cluttered rather than spacious.
4. **Inadequate Spacing**: Padding, margins, and gaps are too tight. Mockups show generous whitespace that creates breathing room.
5. **Weak Typography Hierarchy**: Text sizes and weights don't create the clear visual hierarchy shown in mockups.
6. **Missing Visual Elements**: No avatar components with colored backgrounds, no subtle design touches that make mockups feel polished.
7. **Button Styling**: Primary buttons are too heavy; mockups show lighter, more refined button treatments.

The result is a UI that feels like a "cheap rip-off" rather than a faithful implementation of the design vision.

## Solution Approach

Comprehensive UI refinement focusing on:

1. **Color System Overhaul**: Extract exact color values from mockups and update CSS variables
2. **Spacing System**: Implement generous spacing throughout (1.5-2x current values)
3. **Typography Refinement**: Strengthen hierarchy with larger titles, better line heights, improved font weights
4. **Component Polish**: Refine buttons, cards, badges, and form elements to match mockup quality
5. **Visual Lightness**: Reduce border prominence, lighten overall visual weight
6. **Avatar System**: Add colored avatar backgrounds for user identity
7. **Micro-interactions**: Subtle hover states and transitions

## Constraints

- **Logic Preservation**: Zero changes to application logic, Server Actions, Prisma queries, or state management
- **Component Structure**: Maintain existing component architecture, only update styling
- **Accessibility**: Maintain or improve WCAG AA contrast ratios despite darker backgrounds
- **Responsive Behavior**: Preserve existing responsive breakpoints and mobile layouts
- **Build Compatibility**: No breaking changes to TypeScript compilation or Next.js build

## Scope

### In Scope
- CSS variable updates in `globals.css`
- Tailwind config refinements
- Component-level className updates for spacing, typography, colors
- Button and form element styling refinements
- Card and border styling improvements
- Avatar component creation (if needed)

### Out of Scope
- New features or functionality
- Logic changes
- Database schema changes
- API modifications
- Test suite expansion (only update tests if styling changes break existing assertions)

## Success Criteria

1. Background colors match mockup darkness (~#0A0E1A)
2. Spacing feels generous and breathable (comparable to mockups)
3. Typography hierarchy is clear and strong
4. Buttons feel refined, not heavy
5. Borders are subtle, not prominent
6. Overall visual quality matches mockup polish
7. All existing functionality works identically
8. Build succeeds with zero TypeScript errors
9. Existing test suite passes (521/521 tests)
