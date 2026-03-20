# Change Proposal: UI Navigation Layout Token Migration

## Change Name
`ui-navigation-layout`

## Problem Statement

The navigation and layout components currently use hardcoded color values (e.g., `bg-navy-800`, `text-gray-300`, `border-gray-700`) instead of the design token system established in the project. This creates several issues:

1. **Design inconsistency**: Hardcoded values can drift from the design system over time
2. **Maintenance burden**: Color updates require manual changes across multiple files
3. **Figma sync gap**: The Figma prototype (node-id=4032-181) shows updated navigation patterns that aren't reflected in code
4. **Token system underutilization**: The project has a comprehensive design token system that isn't being used in navigation components

The Figma prototype shows a dark header background (#060813) with specific navigation structure, notification badge with count, and profile avatar positioning that should be implemented using design tokens.

## Proposed Solution

Migrate the MainNav and NotificationBell components to use token-based styling while preserving all existing functionality:

1. **MainNav component**: Replace hardcoded colors with design tokens
   - Header background: `bg-navy-800` → `bg-surface-level-1`
   - Text colors: `text-gray-300` → token-based equivalents
   - Border colors: `border-gray-700` → `border-neutral-weak`
   - Hover states: maintain with token-based colors where available

2. **NotificationBell component**: Update badge styling to use design tokens
   - Badge background: `bg-error-500` → semantic token equivalent
   - Text colors: align with token system

3. **Layout containers**: Ensure consistent spacing and max-width using token-based values

## Constraints

- **MUST preserve all navigation link text exactly as-is** (no text changes)
- **MUST maintain active/hover states** for navigation items (functionality unchanged)
- **MUST keep notification badge functionality unchanged** (only styling updates)
- **MUST maintain responsive behavior** on mobile devices
- **MUST pass existing E2E navigation tests** without modification

## Non-Goals

- Changing navigation structure or adding/removing links
- Modifying notification bell functionality or logic
- Updating other UI components beyond MainNav and NotificationBell
- Implementing new features or behaviors

## Success Criteria

1. All hardcoded color values in MainNav replaced with design tokens
2. NotificationBell uses token-based styling
3. All navigation links navigate correctly (verified by E2E tests)
4. Active/hover states work as before
5. Notification badge displays count correctly
6. Responsive behavior works on mobile (320px width)
7. Visual appearance matches Figma prototype reference

## Testing Strategy

- Run existing E2E navigation tests (should pass without changes)
- Manual verification of all navigation links
- Test notification bell interactions (click, dropdown, badge count)
- Responsive testing on mobile viewports (320px, 768px, 1024px)
- Visual regression testing against Figma prototype

## Implementation Approach

This is a styling-only change with no behavioral modifications. The implementation will:
1. Update MainNav.tsx to use design tokens
2. Update NotificationBell.tsx to use design tokens
3. Verify layout containers use consistent token-based spacing
4. Run tests to ensure no regressions
