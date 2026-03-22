# Tasks: Auth UI Components

## Task 1: Fetch Figma Design Specifications
**Implementation:**
- Use Figma MCP tool (`mcp__figma__get_design_context`) to fetch exact specs for each component node:
  - RoleCard: nodes 4113:481, 4116:396
  - LogoHeader: node 4106:615
  - AuthContainer and AuthButton: node 4100:385 (parent container)
- Extract measurements (width, height, padding, margin, gap, border-radius)
- Extract colors (background, border, text) and map to design tokens
- Document all specs in implementation notes for reference

**Test Plan:**
- Verify Figma MCP tool returns design context for all specified nodes
- Verify extracted measurements match user-provided requirements
- Verify color values are documented with hex codes and opacity values

---

## Task 2: Set Up Storybook (if not already configured)
**Implementation:**
- Check if Storybook is already configured in the project
- If not, install Storybook: `npx storybook@latest init`
- Configure Storybook for Next.js 15 and Tailwind CSS
- Ensure Storybook can access design tokens (import Tailwind config)
- Create `.storybook/main.ts` and `.storybook/preview.ts` if needed

**Test Plan:**
- Run `npm run storybook` and verify Storybook starts without errors
- Verify Tailwind CSS styles are applied in Storybook
- Verify design tokens are available in Storybook stories

---

## Task 3: Create RoleCard Component
**Implementation:**
- Create `components/auth/RoleCard.tsx` with TypeScript interface:
  ```typescript
  interface RoleCardProps {
    icon: React.ReactNode;
    label: string;
    selected?: boolean;
    onClick?: () => void;
    disabled?: boolean;
  }
  ```
- Implement layout: 32px icon, 17px text, 20px padding, 24px gap, 20px border-radius
- Use design tokens for all colors (background, border, text)
- Implement hover state with CSS transition
- Implement selected state with 2px #0265dc border (or equivalent design token)
- Add keyboard accessibility: focusable, Enter/Space activation
- Add ARIA attributes: role="button", aria-pressed, aria-label

**Test Plan:**
- Render RoleCard in Storybook and verify dimensions match Figma specs (use browser DevTools)
- Verify hover state appears on mouse hover
- Verify selected state shows blue border when selected={true}
- Verify Tab key focuses the card and shows focus indicator
- Verify Enter/Space key triggers onClick handler
- Run axe-core accessibility audit and verify zero violations

---

## Task 4: Create AuthContainer Component
**Implementation:**
- Create `components/auth/AuthContainer.tsx` with TypeScript interface:
  ```typescript
  interface AuthContainerProps {
    children: React.ReactNode;
    className?: string;
  }
  ```
- Implement dimensions: 418px width, 540px height, 25px border-radius
- Use design tokens for background (#060813) and border (#242935)
- Implement centering: flex container with justify-center and items-center
- Support custom className for additional styling

**Test Plan:**
- Render AuthContainer in Storybook with sample content
- Verify dimensions match Figma specs (418px × 540px, 25px border-radius)
- Verify background and border colors match design tokens
- Verify container is centered horizontally and vertically
- Verify child elements render correctly inside container

---

## Task 5: Create LogoHeader Component
**Implementation:**
- Create `components/auth/LogoHeader.tsx` with TypeScript interface:
  ```typescript
  interface LogoHeaderProps {
    logoSrc?: string;
    logoAlt?: string;
  }
  ```
- Implement styling: rgba(49,54,67,0.5) background, 10px border-radius, 7px/9px padding
- Use design token for semi-transparent background (or create custom CSS variable)
- Display logo image with proper alt text
- Handle missing logo gracefully (show placeholder or text)

**Test Plan:**
- Render LogoHeader in Storybook with logo image
- Verify background color is rgba(49,54,67,0.5) or equivalent
- Verify border-radius is 10px
- Verify padding is 7px vertical, 9px horizontal
- Verify logo image displays with correct alt text
- Verify component renders gracefully without logo prop

---

## Task 6: Create AuthButton Component
**Implementation:**
- Create `components/auth/AuthButton.tsx` with TypeScript interface:
  ```typescript
  interface AuthButtonProps {
    variant: 'primary' | 'secondary';
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
  }
  ```
- Implement dimensions: 50px height, 10px border-radius
- Implement primary variant: #0088FF background (or design token)
- Implement secondary variant: rgba(0,136,255,0.24) background (or design token)
- Add keyboard accessibility: focusable, Enter/Space activation
- Add ARIA attributes: aria-disabled when disabled
- Add hover and active states

**Test Plan:**
- Render AuthButton in Storybook with both variants
- Verify height is 50px and border-radius is 10px for both variants
- Verify primary variant has #0088FF background
- Verify secondary variant has rgba(0,136,255,0.24) background
- Verify Tab key focuses the button and shows focus indicator
- Verify Enter/Space key triggers onClick handler
- Verify disabled state prevents interaction and shows aria-disabled="true"
- Run axe-core accessibility audit and verify zero violations

---

## Task 7: Create Storybook Stories for All Components
**Implementation:**
- Create `components/auth/RoleCard.stories.tsx` with stories:
  - Default state
  - Hover state (using Storybook pseudo-states addon or documentation)
  - Selected state
  - Disabled state
- Create `components/auth/AuthContainer.stories.tsx` with story showing sample content
- Create `components/auth/LogoHeader.stories.tsx` with story showing logo
- Create `components/auth/AuthButton.stories.tsx` with stories:
  - Primary variant
  - Secondary variant
  - Disabled state
  - Loading state (if implemented)

**Test Plan:**
- Run `npm run storybook` and navigate to each component
- Verify all stories render without errors
- Verify all states are visually distinct and match Figma design
- Verify stories are documented with descriptions and controls

---

## Task 8: Run Accessibility Audits
**Implementation:**
- Install axe-core or @storybook/addon-a11y if not already installed
- Configure Storybook a11y addon in `.storybook/main.ts`
- Run accessibility audits on all component stories
- Fix any critical or serious violations
- Document accessibility features in component documentation

**Test Plan:**
- Open Storybook and navigate to each component story
- Check the Accessibility tab in Storybook
- Verify zero critical or serious violations for all components
- Verify all interactive elements are keyboard accessible
- Verify all interactive elements have proper ARIA attributes
- Test keyboard navigation manually: Tab, Enter, Space keys

---

## Task 9: Visual Comparison with Figma
**Implementation:**
- Open Figma design (https://www.figma.com/design/Nexptl0M63VM62lPVkjxxx/gigli?node-id=4100-385)
- Render each component in Storybook side-by-side with Figma
- Use browser DevTools to inspect dimensions, colors, spacing
- Compare measurements with Figma specs (within 1px tolerance)
- Document any discrepancies and adjust component styling

**Test Plan:**
- For each component, verify:
  - Dimensions match Figma specs (width, height, padding, margin, gap)
  - Border-radius values match exactly
  - Font sizes match exactly
  - Colors match exactly (or use equivalent design tokens)
  - Spacing between elements matches exactly
- Take screenshots of Storybook components and compare with Figma design
- Verify visual match is pixel-perfect (or within 1px tolerance)

---

## Task 10: Integrate Components into Auth Page
**Implementation:**
- Choose one auth page for integration (e.g., `/register` for role selection)
- Import auth components: RoleCard, AuthContainer, AuthButton
- Replace existing ad-hoc UI with new components
- Ensure functionality remains unchanged (form submission, validation, etc.)
- Test the integrated page in the browser

**Test Plan:**
- Navigate to the integrated auth page (e.g., `/register`)
- Verify components render correctly with proper styling
- Verify all interactions work (role selection, form submission, etc.)
- Verify keyboard navigation works throughout the page
- Verify the page matches Figma design
- Run existing E2E tests to ensure no regressions
- Run `npm run test:e2e` and verify all auth-related tests pass

---

## Task 11: Export Components from Auth Module
**Implementation:**
- Create `components/auth/index.ts` barrel export file
- Export all auth components: RoleCard, AuthContainer, LogoHeader, AuthButton
- Add JSDoc comments to each component for documentation
- Ensure TypeScript types are properly exported

**Test Plan:**
- Verify components can be imported from `components/auth`:
  ```typescript
  import { RoleCard, AuthContainer, LogoHeader, AuthButton } from '@/components/auth';
  ```
- Verify TypeScript autocomplete works for all components
- Verify TypeScript types are available for all component props
- Run `npm run build` and verify no TypeScript errors

---

## Summary

After completing all tasks:
1. All 4 auth components are implemented and exported
2. All components use design tokens (zero hardcoded values)
3. All components match Figma design pixel-perfect
4. All components have Storybook stories demonstrating all states
5. All components pass accessibility audits
6. Components are integrated into at least one auth page
7. All existing tests pass with no regressions

**Next Steps:**
- Run `/ralphy-implement auth-ui-components` to begin implementation
- After implementation, consider creating a follow-up change to refactor all auth pages to use the new components
