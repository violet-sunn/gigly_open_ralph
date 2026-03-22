# Change Proposal: auth-landing-page

## Summary

Create a dedicated `/auth` landing page that serves as the entry point for authentication flows, allowing users to select their role (Specialist or Client) before proceeding to login or registration. This page implements the Figma design with pixel-perfect accuracy and provides a clear, visually appealing first impression of the platform.

## Problem Statement

Currently, users must navigate directly to `/login` or `/register` without a clear entry point that explains the two distinct user roles (Specialist and Client). New users may not understand which role applies to them or what the difference is. The authentication flow lacks a welcoming landing page that:

1. Introduces the platform's dual-role model
2. Guides users to select their role before authentication
3. Provides a visually polished first impression matching the Figma design system
4. Maintains role context through the authentication flow via query parameters

## Proposed Solution

Implement a new `/auth` route with a full-screen landing page that:

1. **Visual Design**: Matches the Figma design (node 4100-385) with exact spacing, colors, and layout
2. **Role Selection**: Displays two interactive RoleCard components (Specialist with user icon, Client with briefcase icon)
3. **Action Buttons**: Provides two AuthButton components (primary "Войти"/"Login", secondary "Зарегестрироватся"/"Register")
4. **Navigation Flow**: On role selection + button click, navigates to `/login?role=X` or `/register?role=X`
5. **Responsive Design**: Adapts to mobile devices (card width 90vw, vertical stacking)
6. **Unauthenticated Access**: Middleware allows access to `/auth` without authentication

## Design Constraints

1. **Pixel-Perfect Implementation**: All spacing, colors, and layout must match Figma design exactly
   - Background: #01030e (full-screen dark)
   - Card: centered, 418px width, 540px height, 40px padding, 25px border-radius
   - Logo to content gap: 47px
   - Role cards gap: 17px
   - Buttons gap: 21px
   - Sections gap: 30px

2. **Component Reusability**: Create reusable RoleCard and AuthButton components for potential future use

3. **State Management**: Use React state to track selected role, enable/disable buttons based on selection

4. **Accessibility**: All interactive elements must be keyboard-navigable and screen-reader friendly

5. **Design Token Compliance**: Use design tokens from `openspec/specs/ui/design-tokens.json` where applicable, fallback to exact Figma values for new colors

6. **Russian Language**: All text content in Russian (primary) with English fallback in code comments

## Non-Goals

1. **Authentication Logic**: This page does not perform authentication, only routes to existing flows
2. **Role Validation**: Role validation happens in `/login` and `/register`, not on this page
3. **Multi-Language Support**: Russian only for MVP (i18n deferred)
4. **Complex Animations**: Simple hover states only, no complex transitions
5. **Role Descriptions**: No detailed explanations of roles (keep UI clean and simple)

## Success Criteria

1. **Visual Accuracy**: Side-by-side comparison with Figma shows exact match (spacing, colors, typography)
2. **Navigation Flow**: E2E test verifies role selection → login navigation with correct query params
3. **Navigation Flow**: E2E test verifies role selection → register navigation with correct query params
4. **Query Parameters**: URL contains `?role=SPECIALIST` or `?role=CLIENT` after navigation
5. **Responsive Layout**: Mobile view (< 768px) shows card at 90vw width with vertical stacking
6. **Middleware Access**: Unauthenticated users can access `/auth` without redirect
7. **Authenticated Redirect**: Authenticated users accessing `/auth` are redirected to `/dashboard`

## Implementation Phases

1. **Phase 1: Component Creation** - Build RoleCard and AuthButton components with exact Figma styling
2. **Phase 2: Page Layout** - Create `/auth` page with full layout, state management, and navigation logic
3. **Phase 3: Middleware Update** - Update middleware to allow unauthenticated access to `/auth`
4. **Phase 4: Testing** - Write E2E tests for all navigation flows and responsive behavior

## Risks and Mitigations

**Risk**: Figma design uses hardcoded colors not in design token system
**Mitigation**: Document new colors in code comments, consider adding to design tokens in future iteration

**Risk**: Role query parameter could be manipulated or lost during navigation
**Mitigation**: Validate role parameter in `/login` and `/register` pages, fallback to no role if invalid

**Risk**: Decorative background pattern (node 4111:399) may not export cleanly from Figma
**Mitigation**: Use Figma MCP tool to export as image asset, optimize for web, use as background-image

## Dependencies

- Figma MCP tool for asset export (logo, icons, background pattern)
- Existing `/login` and `/register` pages must accept `?role=` query parameter
- Design token system for consistent styling
