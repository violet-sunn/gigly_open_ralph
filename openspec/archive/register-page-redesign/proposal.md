# Change Proposal: Register Page Redesign

## Overview

Redesign the `/register` page to match the Figma design specifications, ensuring exact visual fidelity with the design system while maintaining all existing authentication functionality.

## Motivation

The register page currently uses generic styling that doesn't match the approved Figma design. The login page was recently redesigned (change #32) to match Figma specifications, and the register page needs the same treatment to ensure visual consistency across the authentication flow.

## Goals

1. **Visual Fidelity**: Match Figma design specifications exactly (node-id=4100-385)
2. **Bilingual Support**: Display Russian text with English fallbacks
3. **Role Context**: Pre-select role from query parameter when provided
4. **Maintain Functionality**: Preserve all existing validation, rate limiting, and authentication logic
5. **Responsive Design**: Ensure mobile-friendly layout

## Non-Goals

- Changing authentication logic or validation rules
- Modifying rate limiting behavior
- Adding new features beyond visual redesign
- Changing the role selection mechanism

## Constraints

- MUST maintain backward compatibility with existing `registerUser` server action
- MUST preserve password validation requirements (Latin-only, 8+ chars, uppercase, lowercase, number)
- MUST preserve rate limiting (3 attempts/hour)
- MUST maintain role query parameter behavior (`?role=SPECIALIST` or `?role=CLIENT`)
- MUST use existing AuthContainer, LogoHeader, RoleCard, and AuthButton components
- MUST NOT break existing E2E tests

## Design Specifications

### Container
- Width: 418px (desktop), 90vw (mobile)
- Height: min-height 540px
- Border-radius: 25px
- Padding: 40px (desktop), 20px (mobile)
- Background: #060813
- Border: 1px solid #242935

### Logo Header
- Background: rgba(49,54,67,0.5)
- Border-radius: 10px
- Padding: 7px/9px
- Logo height: 29px

### Heading
- Text: "Регистрация" (Russian primary)
- Font: 22px Manrope SemiBold (or system fallback)
- Color: white
- Alignment: center

### Role Cards
- Display both cards when no role parameter provided
- Pre-select card when `?role=SPECIALIST` or `?role=CLIENT` provided
- Selected state: 2px blue border (#0265dc)
- Background: #10121c
- Border-radius: 20px
- Padding: 20px
- Gap between cards: 17px

### Input Fields
- Background: #10121c
- Border: 1px solid #242935
- Border-radius: 20px
- Padding: 20px
- Placeholder color: neutral-weak token
- Focus ring: 2px #0088ff

### Primary Button (Submit)
- Height: 50px
- Background: #0088FF
- Text: "Зарегестрироватся" (Russian for "Sign up")
- Font: 19px bold
- Border-radius: 10px

### Secondary Link (Login)
- Height: 50px
- Background: rgba(0,136,255,0.24)
- Text: "Войти" (Russian for "Login")
- Font: 15px medium
- Border-radius: 10px

### Decorative Pattern
- Position: bottom of page
- Pattern: checkerboard with #0088ff at 0.3 opacity
- Height: 327px
- Full width

## Implementation Approach

1. **Fetch Figma Design Context**: Use Figma MCP tool to retrieve exact specifications
2. **Update Register Page Component**: Modify `app/register/page.tsx` to match design
3. **Update Heading Text**: Change to "Регистрация" with bilingual support
4. **Update Input Styling**: Apply exact color values and dimensions
5. **Update Button Text**: Change to Russian text ("Зарегестрироватся", "Войти")
6. **Add Decorative Pattern**: Implement checkerboard background at bottom
7. **Ensure Responsive Design**: Test mobile viewport behavior
8. **Verify Functionality**: Ensure all existing features work unchanged

## Testing Strategy

1. **Visual Comparison**: Compare rendered page with Figma design side-by-side
2. **E2E Tests**:
   - Register with role parameter (`?role=SPECIALIST`, `?role=CLIENT`)
   - Register without role parameter (both cards shown)
   - Verify role pre-selection works correctly
   - Verify existing validation works (password requirements, rate limiting)
3. **Responsive Testing**: Verify mobile viewport rendering
4. **Accessibility Testing**: Verify keyboard navigation and screen reader support

## Risks & Mitigations

**Risk**: Breaking existing E2E tests
**Mitigation**: Run full test suite before and after changes, update test selectors if needed

**Risk**: Hardcoded Russian text may confuse non-Russian users
**Mitigation**: Document bilingual approach, consider i18n in future iteration

**Risk**: Decorative pattern may impact performance on low-end devices
**Mitigation**: Use CSS-based SVG pattern (lightweight), test on mobile devices

## Success Criteria

- [ ] Visual comparison with Figma shows exact match
- [ ] E2E test for register with role param passes
- [ ] E2E test for register without role param passes
- [ ] Role pre-selection works correctly
- [ ] Existing validation works (password requirements, rate limiting)
- [ ] Responsive design works on mobile viewports
- [ ] All existing E2E tests pass without modification
- [ ] Decorative background pattern renders correctly
