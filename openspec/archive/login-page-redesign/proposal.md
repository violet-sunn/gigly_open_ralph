# Change Proposal: login-page-redesign

## Problem Statement

The current login page (`/login`) has a basic, generic design that doesn't align with the Figma design system. It lacks visual polish, role context awareness, and the branded aesthetic defined in the design files. Users arriving from the `/auth` landing page with a pre-selected role see no visual continuity or role confirmation on the login page.

## Proposed Solution

Redesign the `/login` page to match the Figma design specification at `https://www.figma.com/design/Nexptl0M63VM62lPVkjxxx/gigli?node-id=4100-385`. The redesign will:

1. **Use Figma MCP tool** to fetch exact design specifications for the login variant
2. **Apply AuthContainer styling** with precise dimensions (418x540px, 25px border-radius, 40px padding)
3. **Add LogoHeader component** with bilingual heading ('Вход'/'Login') using 22px Manrope SemiBold or fallback
4. **Implement role card display** that reads `?role=SPECIALIST` or `?role=CLIENT` query parameter and displays:
   - Selected role card with 2px blue border
   - Unselected role card without border
   - Graceful fallback when no role parameter provided
5. **Update input field styling** with exact specifications (#10121c background, #242935 border, 20px border-radius, 20px padding)
6. **Add AuthButton component** for submit (50px height, #0088FF background, 'Войти'/'Login' text)
7. **Add secondary link** to `/register` ('Зарегестрироватся'/'Register')
8. **Add decorative background pattern** at bottom of container
9. **Maintain existing functionality**: auth action, validation, rate limiting, session creation
10. **Ensure responsive design** for mobile and desktop viewports

## Why This Change

- **Brand consistency**: Aligns login page with design system and `/auth` landing page
- **User experience**: Role context from `/auth` page carries through to login, reducing cognitive load
- **Visual polish**: Professional, polished UI increases trust and perceived quality
- **Design-to-code workflow**: Demonstrates Figma MCP integration for future design implementations

## Constraints

- **MUST maintain existing auth logic**: `loginUser` server action, password validation, rate limiting, session creation
- **MUST NOT break existing tests**: All authentication integration and E2E tests must pass
- **MUST support both Russian and English text**: Bilingual UI labels
- **MUST handle missing role parameter gracefully**: No errors if `?role=` is absent
- **MUST remain accessible**: Keyboard navigation, screen reader support, ARIA labels
- **SHOULD use design tokens where possible**: Prefer tokens over hardcoded values for maintainability

## Non-Goals

- Changing authentication logic or security measures
- Adding new authentication methods (OAuth, SSO, etc.)
- Implementing password reset or forgot password flows
- Modifying registration page (separate change if needed)
- Adding animations or transitions (can be added later)

## Success Criteria

1. Visual comparison with Figma design shows exact match for:
   - Container dimensions and styling
   - Logo and heading typography
   - Role card layout and selection state
   - Input field styling
   - Button styling
   - Background pattern
2. E2E test: Login with `?role=SPECIALIST` parameter shows specialist role card selected
3. E2E test: Login with `?role=CLIENT` parameter shows client role card selected
4. E2E test: Login without role parameter shows graceful fallback (both cards unselected or hidden)
5. Existing login functionality works: successful login, invalid credentials, rate limiting
6. All existing authentication tests pass
7. Responsive design verified on mobile (375px) and desktop (1440px) viewports
