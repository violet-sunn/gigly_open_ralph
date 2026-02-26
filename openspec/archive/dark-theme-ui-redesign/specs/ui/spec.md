# UI Specification Deltas - Dark Theme Redesign

## MODIFIED Requirements

### Requirement: Design System Foundation
The application MUST use a dark theme design system with consistent color palette, typography, and spacing.

#### Scenario: Dark theme color palette applied globally
- GIVEN any page in the application
- WHEN the page renders
- THEN the background MUST use deep dark blue-gray (hsl(222 47% 11%))
- AND card surfaces MUST use slightly lighter dark blue-gray (hsl(224 47% 14%))
- AND primary interactive elements MUST use bright blue accent (hsl(217 91% 60%))
- AND text MUST use light foreground color (hsl(210 40% 98%))
- AND borders MUST use subtle dark borders (hsl(217 33% 17%))

#### Scenario: Typography system applied consistently
- GIVEN any page with text content
- WHEN the page renders
- THEN headings MUST use appropriate font weights (600-700)
- AND body text MUST use readable font size (14-16px base)
- AND muted text MUST use gray color (hsl(215 20% 65%))
- AND all text MUST have sufficient contrast ratio for WCAG AA compliance

#### Scenario: Spacing system applied consistently
- GIVEN any page with multiple elements
- WHEN the page renders
- THEN card padding MUST use generous spacing (p-6 or p-8)
- AND section gaps MUST use consistent spacing (space-y-6 or gap-6)
- AND page margins MUST provide breathing room (max-w-7xl mx-auto px-4)

**Acceptance Criteria:**
- `tailwind.config.ts` defines all color tokens as HSL values
- `app/globals.css` defines CSS variables for dark theme
- All colors use semantic naming (background, foreground, primary, secondary, muted, accent)
- Border radius uses consistent scale (0.75rem default)
- No hardcoded color values in components (all use Tailwind theme tokens)

---

### Requirement: Homepage
The homepage at `/` MUST display the application name and adapt based on authentication state with dark theme styling.

#### Scenario: Anonymous user visits homepage
- GIVEN no valid session cookie exists
- WHEN a user visits `/`
- THEN it MUST display the application name "GIGLY" in large, bold typography
- AND it MUST use dark background with card-based layout
- AND it MUST display a prominent "Get Started" button with primary blue styling
- AND it MUST display a "Sign in" link with secondary styling

#### Scenario: Authenticated user visits homepage
- GIVEN a user is logged in (valid session cookie)
- WHEN they visit `/`
- THEN it MUST display their email address in a dark card
- AND it MUST display a logout button with appropriate styling
- AND the layout MUST match the dark theme design system

**Acceptance Criteria:**
- Homepage uses dark background (bg-background)
- Cards use card background color (bg-card)
- Buttons use primary color for CTAs
- Typography follows design system hierarchy
- Layout is centered with max-width container

---

### Requirement: Navigation Bar
The application MUST provide a top navigation bar matching the mockup design with logo, navigation links, notification bell, and user avatar.

#### Scenario: Navigation bar renders for authenticated users
- GIVEN an authenticated user (CLIENT or SPECIALIST)
- WHEN they view any page
- THEN the top navigation bar MUST display:
  - "GIGLY" logo on the left (white text, bold)
  - Navigation links in the center (Дашборд, Проекты, Сообщения if applicable)
  - Notification bell icon on the right
  - User avatar/profile picture on the far right
- AND the navigation bar MUST use dark background (bg-card or bg-background)
- AND the navigation bar MUST have subtle bottom border
- AND navigation links MUST have hover states with blue accent

#### Scenario: Active navigation link highlighted
- GIVEN a user is on the dashboard page
- WHEN they view the navigation bar
- THEN the "Дашборд" link MUST be visually highlighted (blue background or underline)
- AND other links MUST use muted styling

**Acceptance Criteria:**
- Navigation bar uses fixed or sticky positioning
- Logo uses large, bold typography
- Navigation links use flex layout with gap spacing
- Active link uses primary color accent
- Notification bell and avatar aligned to right
- Responsive: collapses to hamburger menu on mobile

---

### Requirement: Dashboard - CLIENT View
The CLIENT dashboard MUST use a card-based layout with statistics, action cards, and gig list matching the mockup design.

#### Scenario: CLIENT views dashboard with dark theme layout
- GIVEN a user with role "CLIENT" is logged in
- WHEN they visit `/dashboard`
- THEN the page MUST display:
  - Welcome card with user name and "Перейти в профиль" link
  - "Найти проект" action card with search icon and description
  - "ЗАКАЗЫ В РАБОТЕ" section with count badge
  - "ВСЕ ЗАКАЗЫ" link
  - Gig list with card-based layout
- AND all cards MUST use dark card background (bg-card)
- AND cards MUST have rounded corners (rounded-lg)
- AND cards MUST have subtle borders (border-border)
- AND spacing between cards MUST be consistent (gap-6)

#### Scenario: Gig cards display with new styling
- GIVEN a CLIENT has posted gigs
- WHEN they view the dashboard
- THEN each gig card MUST display:
  - Company logo/avatar on the left
  - Gig title in prominent typography
  - Status badge with appropriate color (green for active, gray for completed)
  - Budget amount in large, bold text
  - Date in muted text
- AND cards MUST have hover state (subtle background change)
- AND cards MUST be clickable links to gig detail

**Acceptance Criteria:**
- Dashboard uses two-column layout on desktop (main content + sidebar)
- Welcome card shows user greeting and profile link
- Action cards use icon + text layout
- Gig list uses card grid or vertical stack
- All cards have consistent padding (p-6)
- Status badges use color-coded styling
- Budget amounts formatted with ₽ symbol

---

### Requirement: Dashboard - SPECIALIST View
The SPECIALIST dashboard MUST use a tabbed layout with statistics, action cards, and work lists matching the mockup design.

#### Scenario: SPECIALIST views dashboard with dark theme layout
- GIVEN a user with role "SPECIALIST" is logged in
- WHEN they visit `/dashboard`
- THEN the page MUST display:
  - Welcome card with user name and role
  - Statistics section (completed orders, repeat orders percentage)
  - "Поделиться профилем" button
  - Three tabs: "ЗАКАЗЫ В РАБОТЕ", "Pending Applications", "Archive"
  - Tab content with card-based gig/application list
- AND the layout MUST use dark theme colors
- AND tabs MUST have active state styling (blue underline or background)
- AND statistics MUST use large, bold numbers with icons

#### Scenario: Active Work tab displays with new card layout
- GIVEN a SPECIALIST has active gigs
- WHEN they view the "Active Work" tab
- THEN each gig card MUST display:
  - Client company logo/avatar
  - Gig title
  - Status badge
  - Budget amount
  - Action button ("Откликнуться" or status indicator)
- AND cards MUST use dark card background
- AND cards MUST have hover states

**Acceptance Criteria:**
- Dashboard uses card-based layout
- Statistics use large typography with icons
- Tabs use horizontal layout with active state
- Tab content uses card grid or vertical stack
- All interactive elements have hover states
- Profile share button uses secondary styling

---

### Requirement: Gig Browse Page
The gig browse page at `/gigs` MUST use a filter sidebar + card grid layout matching the mockup design.

#### Scenario: Browse page renders with new layout
- GIVEN an authenticated SPECIALIST user
- WHEN they navigate to `/gigs`
- THEN the page MUST display:
  - Search bar at the top with icon
  - Filter tabs below search (Все, Разработка, Дизайн, Маркетинг)
  - Filter dropdowns (Бюджет, Срок)
  - Gig card grid (2-3 columns on desktop)
- AND the layout MUST use dark theme colors
- AND the search bar MUST have dark input styling with border
- AND filter tabs MUST have active state styling

#### Scenario: Gig cards display in grid layout
- GIVEN there are open gigs to browse
- WHEN the page renders
- THEN each gig card MUST display:
  - Company avatar/logo at top
  - Gig title in prominent typography
  - Description preview (truncated)
  - Technology tags as pills/badges
  - Budget amount in large text
  - "Откликнуться →" button at bottom
- AND cards MUST use consistent height
- AND cards MUST have hover state (border color change or shadow)
- AND tags MUST use blue background with rounded styling

**Acceptance Criteria:**
- Page uses full-width layout with max-width container
- Search bar uses dark input styling (bg-input, border-input)
- Filter tabs use horizontal layout with active state
- Gig grid uses CSS Grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Cards have consistent padding and spacing
- Technology tags use badge styling (bg-primary/10 text-primary)
- Pagination controls styled to match theme

---

### Requirement: Gig Detail Page
The gig detail page at `/gigs/[id]` MUST use a two-column layout with main content and sidebar matching the mockup design.

#### Scenario: Gig detail renders with new layout
- GIVEN an authenticated user views a gig detail page
- WHEN the page renders
- THEN the page MUST display:
  - Back button "← К списку задач" at top
  - Main content area (left column, 2/3 width):
    - Company avatar and gig title
    - Technology tags
    - "Суть задачи" section with description
    - "Технические требования" section
    - "Формат и сроки" section
  - Sidebar (right column, 1/3 width):
    - "Бюджет проекта" card with price
    - "Условия Vercel" button
    - "Мои условия" button
    - "ОТПРАВИТЬ ОТКЛИК →" button
    - Company info card
- AND all sections MUST use dark card backgrounds
- AND the layout MUST be responsive (stacks on mobile)

#### Scenario: Budget sidebar card displays prominently
- GIVEN a user views a gig detail page
- WHEN they see the sidebar
- THEN the budget card MUST display:
  - "Бюджет проекта" heading
  - Large price amount ($2,500 or ₽ equivalent)
  - "fixed" label
  - Dark card background with border
- AND the price MUST use extra-large, bold typography
- AND the card MUST be visually prominent

#### Scenario: Application section displays with new styling
- GIVEN a CLIENT owner views their gig with applications
- WHEN they scroll to the applications section
- THEN each application card MUST display:
  - Specialist avatar
  - Specialist name and role
  - Technical approach section
  - Clarifying questions section
  - Estimated effort
  - Accept/Reject buttons with appropriate styling
- AND cards MUST use dark background with borders
- AND buttons MUST use primary (accept) and secondary (reject) colors

**Acceptance Criteria:**
- Page uses two-column layout (grid-cols-1 lg:grid-cols-3)
- Main content spans 2 columns, sidebar spans 1 column
- All sections use card styling (bg-card, border, rounded-lg, p-6)
- Budget card uses prominent typography (text-4xl font-bold)
- Action buttons use full-width styling in sidebar
- Application cards use nested card layout
- Messages section uses chat-like styling with sender distinction

---

### Requirement: Profile Page
The profile page at `/profile` MUST use a card-based layout with profile header and information sections matching the mockup design.

#### Scenario: Profile page renders with new layout
- GIVEN an authenticated user views their profile
- WHEN the page renders
- THEN the page MUST display:
  - Profile header card with:
    - Large avatar on the left
    - Name and role badge
    - Bio/description
    - Contact information
    - "Поделиться профилем" button
  - Statistics card (if SPECIALIST):
    - Rating with star icon
    - Completed orders count
    - Repeat orders percentage
  - "Опыт работы" section with job cards
  - "Избранные проекты" section
- AND all cards MUST use dark theme styling
- AND the layout MUST be responsive

#### Scenario: Profile header card displays prominently
- GIVEN a user views a profile
- WHEN they see the profile header
- THEN the card MUST display:
  - Large circular avatar (128px or larger)
  - Name in large, bold typography
  - Role badge with orange background
  - Bio text with preserved whitespace
  - Contact details with icons
  - Online status indicator (green dot)
- AND the card MUST use dark background with border
- AND the layout MUST use flex with avatar on left, info on right

**Acceptance Criteria:**
- Profile uses single-column layout with max-width container
- Profile header uses horizontal layout (avatar + info)
- Avatar uses large size (w-32 h-32 or larger)
- Role badge uses colored background (bg-orange-500 or similar)
- Statistics use card layout with large numbers
- Experience cards use timeline or list layout
- All cards have consistent styling (bg-card, border, rounded-lg, p-6)

---

### Requirement: Forms and Inputs
All forms MUST use dark theme input styling with consistent appearance across the application.

#### Scenario: Text inputs use dark theme styling
- GIVEN any form with text inputs
- WHEN the form renders
- THEN each input MUST use:
  - Dark background (bg-input)
  - Light text color (text-foreground)
  - Subtle border (border-input)
  - Focus state with blue ring (focus:ring-primary)
  - Placeholder text in muted color (placeholder:text-muted-foreground)

#### Scenario: Buttons use consistent styling
- GIVEN any form with buttons
- WHEN the form renders
- THEN primary buttons MUST use:
  - Blue background (bg-primary)
  - White text (text-primary-foreground)
  - Hover state (hover:bg-primary/90)
  - Rounded corners (rounded-md)
- AND secondary buttons MUST use:
  - Transparent background with border (border-input)
  - Muted text (text-foreground)
  - Hover state (hover:bg-accent)

**Acceptance Criteria:**
- All inputs use consistent Tailwind classes
- Focus states use ring utilities (focus:ring-2 focus:ring-primary)
- Disabled states use opacity (disabled:opacity-50)
- Error states use destructive color (border-destructive)
- Labels use appropriate typography (text-sm font-medium)
- Helper text uses muted color (text-muted-foreground)

---

## ADDED Requirements

### Requirement: Status Badges
The application MUST use color-coded status badges for gig and application statuses.

#### Scenario: Gig status badges display with appropriate colors
- GIVEN a gig with a specific status
- WHEN the status is displayed
- THEN the badge MUST use:
  - OPEN: Blue background (bg-blue-500/10 text-blue-500)
  - IN_PROGRESS: Yellow background (bg-yellow-500/10 text-yellow-500)
  - REVIEW: Orange background (bg-orange-500/10 text-orange-500)
  - COMPLETED: Green background (bg-green-500/10 text-green-500)
  - PAID: Green background with checkmark icon
- AND badges MUST use rounded styling (rounded-full px-3 py-1)
- AND badges MUST use small text (text-xs font-medium)

**Acceptance Criteria:**
- Status badge component created with color mapping
- All status displays use badge component
- Badges use semi-transparent backgrounds (color/10)
- Badges use appropriate text colors
- Icons included where appropriate (checkmark for PAID)

---

### Requirement: Loading States
All interactive elements MUST show loading states during async operations.

#### Scenario: Buttons show loading state
- GIVEN a user clicks a button that triggers an async action
- WHEN the action is processing
- THEN the button MUST display:
  - Loading spinner icon
  - "Loading..." or action-specific text ("Applying...", "Sending...")
  - Disabled state (opacity-50 cursor-not-allowed)

**Acceptance Criteria:**
- All form submit buttons use loading states
- Loading spinner uses consistent styling
- Button text changes to indicate action in progress
- Buttons are disabled during loading

---

## REMOVED Requirements

None. All existing functional requirements are preserved. Only visual styling and layout structure are modified.
