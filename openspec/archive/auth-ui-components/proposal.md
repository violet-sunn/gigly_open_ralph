# Proposal: Auth UI Components

## Why

The current authentication pages (login, register) use ad-hoc styling without reusable components. This creates:
- **Inconsistency**: Auth UI doesn't match the Figma design system
- **Duplication**: Similar UI patterns (buttons, containers, role cards) are rebuilt per page
- **Maintenance burden**: Changes to auth UI require updates across multiple files
- **Design drift**: Without component-level design token usage, auth pages diverge from design specs

A Figma design exists (https://www.figma.com/design/Nexptl0M63VM62lPVkjxxx/gigli?node-id=4100-385) with precise specifications for auth UI components. Building reusable components matching this design will:
- Ensure pixel-perfect implementation of the design system
- Enable rapid iteration on auth flows (role selection, onboarding, etc.)
- Establish patterns for future component development
- Improve accessibility through consistent ARIA labels and keyboard navigation

## What

Build 4 reusable auth UI components matching the Figma design:

1. **RoleCard** - Selectable card for role selection (CLIENT/SPECIALIST)
   - 32px icon, 17px text, 20px padding, 24px gap, 20px border-radius
   - Hover state and selected state with 2px #0265dc border
   - Nodes: 4113:481, 4116:396

2. **AuthContainer** - Centered container for auth forms
   - 418px width, 540px height, 25px border-radius
   - #060813 background, #242935 border, centered layout

3. **LogoHeader** - Semi-transparent header with logo
   - rgba(49,54,67,0.5) background, 10px border-radius, 7px/9px padding
   - Node: 4106:615

4. **AuthButton** - Primary and secondary button variants
   - Primary: 50px height, #0088FF background, 10px border-radius
   - Secondary: rgba(0,136,255,0.24) background

All components MUST:
- Use design tokens from `openspec/specs/ui/design-tokens.json`
- Be accessible (keyboard navigation, ARIA labels, focus states)
- Match Figma design pixel-perfect (verified via visual comparison)
- Include Storybook stories for all states

## Constraints

- **Design fidelity**: Components MUST match Figma specs exactly (measurements, colors, spacing)
- **Design tokens**: All styling MUST use design tokens, not hardcoded values
- **Accessibility**: Components MUST pass accessibility audit (keyboard nav, ARIA, focus states)
- **Reusability**: Components MUST be framework-agnostic (no business logic, pure UI)
- **Testing**: Each component MUST have Storybook stories demonstrating all states
- **Figma integration**: MUST use Figma MCP tool to fetch exact specs (not manual measurement)

## Non-Goals

- Refactoring existing auth pages to use new components (separate change)
- Building additional auth components beyond the 4 specified
- Implementing auth business logic (validation, API calls, etc.)
- Creating a full component library (focus on auth components only)
- Mobile-specific variants (responsive design within existing breakpoints)

## Success Criteria

1. All 4 components implemented and exported from `components/auth/` directory
2. Visual comparison with Figma shows pixel-perfect match
3. Storybook stories exist for each component with all states (default, hover, selected, disabled)
4. Accessibility audit passes (keyboard navigation, ARIA labels, focus states)
5. All components use design tokens (zero hardcoded colors/spacing)
6. Components are used in at least one auth page (e.g., role selection)
