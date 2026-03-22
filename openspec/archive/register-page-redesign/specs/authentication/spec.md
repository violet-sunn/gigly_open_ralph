# Authentication Specification Delta

## MODIFIED Requirements

### Requirement: Registration Page UI Design
The registration page MUST match the approved Figma design specifications while maintaining all existing authentication functionality.

#### Scenario: Registration page displays bilingual heading
- GIVEN a user navigates to `/register`
- WHEN the page renders
- THEN the heading MUST display "Регистрация" (Russian)
- AND the page MUST be accessible to English-speaking users through visual context

#### Scenario: Registration page uses exact Figma styling
- GIVEN a user navigates to `/register`
- WHEN the page renders
- THEN the container MUST be 418px wide on desktop, 90vw on mobile
- AND the container MUST have 25px border-radius
- AND the container MUST have 40px padding on desktop, 20px on mobile
- AND input fields MUST have #10121c background and #242935 border
- AND input fields MUST have 20px border-radius and 20px padding
- AND the submit button MUST be 50px height with #0088FF background
- AND the submit button text MUST be "Зарегестрироватся" (Russian)
- AND the secondary link text MUST be "Войти" (Russian)

#### Scenario: Registration page displays decorative background pattern
- GIVEN a user navigates to `/register`
- WHEN the page renders
- THEN a decorative checkerboard pattern MUST be visible at the bottom
- AND the pattern MUST use #0088ff color at 0.3 opacity
- AND the pattern MUST be 327px height and full width
- AND the pattern MUST NOT interfere with form interaction

#### Scenario: Registration page pre-selects role from query parameter
- GIVEN a user navigates to `/register?role=SPECIALIST`
- WHEN the page renders
- THEN the SPECIALIST role card MUST be pre-selected with blue border
- AND the CLIENT role card MUST be visible but not selected
- AND this behavior MUST match the existing implementation

#### Scenario: Registration page shows both roles when no parameter provided
- GIVEN a user navigates to `/register` without role parameter
- WHEN the page renders
- THEN both CLIENT and SPECIALIST role cards MUST be visible
- AND neither card MUST be pre-selected
- AND the user MUST be able to select either role
- AND this behavior MUST match the existing implementation

#### Scenario: Registration page is responsive on mobile
- GIVEN a user views `/register` on a mobile device (viewport < 768px)
- WHEN the page renders
- THEN the container width MUST be 90vw
- AND the container padding MUST be 20px
- AND all form elements MUST remain functional and readable
- AND the decorative pattern MUST scale appropriately

**Acceptance Criteria:**
- Registration page at `/register` matches Figma design (node-id=4100-385)
- Heading displays "Регистрация" in 22px font
- Input fields use exact color values (#10121c, #242935) with 20px border-radius and padding
- Submit button displays "Зарегестрироватся" with 50px height and #0088FF background
- Secondary link displays "Войти" with rgba(0,136,255,0.24) background
- Decorative checkerboard pattern renders at bottom (327px height, full width)
- Role pre-selection from query parameter works correctly
- Both role cards display when no parameter provided
- Responsive design works on mobile viewports (90vw width, 20px padding)
- All existing authentication functionality preserved (validation, rate limiting, session creation)
- All existing E2E tests pass without modification
