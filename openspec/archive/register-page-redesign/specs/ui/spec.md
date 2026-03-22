# UI Specification Delta

## ADDED Requirements

### Requirement: Registration Page Figma Design Implementation
The registration page MUST implement the exact visual specifications from the approved Figma design.

#### Scenario: Registration page uses AuthContainer with exact dimensions
- GIVEN a user views the registration page
- WHEN the page renders
- THEN the AuthContainer MUST be 418px wide on desktop
- AND the AuthContainer MUST be 90vw wide on mobile (viewport < 768px)
- AND the AuthContainer MUST have min-height of 540px
- AND the AuthContainer MUST have 25px border-radius
- AND the AuthContainer MUST have 40px padding on desktop
- AND the AuthContainer MUST have 20px padding on mobile

#### Scenario: Registration page displays LogoHeader with correct styling
- GIVEN a user views the registration page
- WHEN the LogoHeader renders
- THEN it MUST have rgba(49,54,67,0.5) background
- AND it MUST have 10px border-radius
- AND it MUST have 7px/9px padding
- AND the logo MUST be 29px height

#### Scenario: Registration page heading uses correct typography
- GIVEN a user views the registration page
- WHEN the heading renders
- THEN it MUST display "Регистрация" text
- AND it MUST use 22px font size
- AND it MUST use font-semibold weight (Manrope SemiBold or fallback)
- AND it MUST be white color
- AND it MUST be center-aligned

#### Scenario: Registration page input fields use exact styling
- GIVEN a user views the registration page
- WHEN input fields render
- THEN they MUST have #10121c background color
- AND they MUST have #242935 border color (1px solid)
- AND they MUST have 20px border-radius
- AND they MUST have 20px padding
- AND they MUST have white text color
- AND placeholder text MUST use neutral-weak token color
- AND focus state MUST show 2px #0088ff ring

#### Scenario: Registration page submit button uses exact styling
- GIVEN a user views the registration page
- WHEN the submit button renders
- THEN it MUST be 50px height
- AND it MUST have #0088FF background color
- AND it MUST display "Зарегестрироватся" text
- AND it MUST use 19px bold font
- AND it MUST have 10px border-radius
- AND it MUST have white text color

#### Scenario: Registration page secondary link uses exact styling
- GIVEN a user views the registration page
- WHEN the secondary link renders
- THEN it MUST be 50px height
- AND it MUST have rgba(0,136,255,0.24) background color
- AND it MUST display "Войти" text
- AND it MUST use 15px medium font
- AND it MUST have 10px border-radius
- AND it MUST link to `/login`

#### Scenario: Registration page displays decorative background pattern
- GIVEN a user views the registration page
- WHEN the page renders
- THEN a decorative pattern MUST be visible at the bottom of the page
- AND the pattern MUST be a checkerboard design
- AND the pattern MUST use #0088ff color at 0.3 opacity
- AND the pattern MUST be 327px height
- AND the pattern MUST span full width
- AND the pattern MUST be positioned absolutely at bottom
- AND the pattern MUST have z-index 0 (behind content)
- AND the pattern MUST have pointer-events-none

#### Scenario: Registration page role cards maintain visual consistency
- GIVEN a user views the registration page
- WHEN role cards render
- THEN they MUST have #10121c background
- AND they MUST have 20px border-radius
- AND they MUST have 20px padding
- AND they MUST have 24px gap between icon and text
- AND selected card MUST have 2px border with #0265dc color
- AND unselected card MUST have 2px transparent border
- AND there MUST be 17px gap between role cards

#### Scenario: Registration page layout uses correct spacing
- GIVEN a user views the registration page
- WHEN the page renders
- THEN there MUST be 47px gap between logo and content sections
- AND there MUST be 30px gap between heading and form
- AND there MUST be 21px gap between form elements
- AND there MUST be 17px gap between role cards
- AND there MUST be 21px gap between buttons

**Acceptance Criteria:**
- All dimensions match Figma specifications exactly
- All color values match Figma specifications exactly (#10121c, #242935, #0088FF, etc.)
- All spacing values match Figma specifications exactly (47px, 30px, 21px, 17px, etc.)
- Typography matches Figma specifications (22px heading, 19px button, 15px link)
- Decorative pattern renders correctly at bottom with checkerboard design
- Responsive design adapts container width and padding for mobile viewports
- Visual comparison with Figma shows exact match
- All components use existing auth components (AuthContainer, LogoHeader, RoleCard, AuthButton)
