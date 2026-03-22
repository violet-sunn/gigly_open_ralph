# UI Specification: Empty States

## ADDED Requirements

### Requirement: Gig Browse Page Empty State Enhancement
The gig browse page MUST use the EmptyState component when no gigs match filters or when no gigs are available.

#### Scenario: No gigs match active filters
- GIVEN a SPECIALIST user is on `/dashboard/gigs` with active filters
- WHEN no gigs match the filter criteria
- THEN the page MUST display an EmptyState component with:
  - icon: "🔍"
  - heading: "No Gigs Match Your Filters"
  - description: "Try adjusting your search criteria, tags, or budget range to find more opportunities."
  - primaryAction: { label: "Clear Filters", href: "/gigs" }

#### Scenario: No open gigs available at all
- GIVEN a SPECIALIST user is on `/dashboard/gigs` with no active filters
- WHEN no OPEN gigs exist in the system
- THEN the page MUST display an EmptyState component with:
  - icon: "📭"
  - heading: "No Open Gigs Available"
  - description: "There are no open gigs at the moment. Check back soon for new opportunities, or view example gigs to see what projects look like."
  - primaryAction: { label: "View Example Gigs", href: "/gigs/examples" }

### Requirement: Admin Gigs Page Empty State Enhancement
The admin gigs management page MUST use the EmptyState component when no gigs are found.

#### Scenario: No gigs found with filters
- GIVEN an ADMIN user is on `/admin/gigs` with active filters
- WHEN no gigs match the filter criteria
- THEN the page MUST display an EmptyState component with:
  - icon: "🔍"
  - heading: "No Gigs Found"
  - description: "No gigs match your current filters. Try adjusting the status or closed filters to see more results."
  - primaryAction: { label: "Clear Filters", href: "/admin/gigs" }

#### Scenario: No gigs exist in system
- GIVEN an ADMIN user is on `/admin/gigs` with no active filters
- WHEN no gigs exist in the database
- THEN the page MUST display an EmptyState component with:
  - icon: "📋"
  - heading: "No Gigs Yet"
  - description: "No gigs have been created yet. Once clients start posting gigs, they will appear here for moderation."

### Requirement: Admin Users Page Empty State Enhancement
The admin users management page MUST use the EmptyState component when no users are found.

#### Scenario: No users found with filters
- GIVEN an ADMIN user is on `/admin/users` with active filters
- WHEN no users match the filter criteria
- THEN the page MUST display an EmptyState component with:
  - icon: "🔍"
  - heading: "No Users Found"
  - description: "No users match your current filters. Try adjusting the role or status filters to see more results."
  - primaryAction: { label: "Clear Filters", href: "/admin/users" }

#### Scenario: No users exist in system
- GIVEN an ADMIN user is on `/admin/users` with no active filters
- WHEN no users exist in the database (excluding the admin themselves)
- THEN the page MUST display an EmptyState component with:
  - icon: "👥"
  - heading: "No Users Yet"
  - description: "No users have registered yet. Once users sign up, they will appear here for moderation."

### Requirement: Example Gigs Page Empty State Enhancement
The example gigs page MUST use the EmptyState component when no example gigs are available.

#### Scenario: No example gigs available
- GIVEN a user (CLIENT or SPECIALIST) is on `/gigs/examples`
- WHEN no example gigs exist in the database
- THEN the page MUST display an EmptyState component with:
  - icon: "✨"
  - heading: "No Example Gigs Available"
  - description: "Example gigs haven't been set up yet. Check back later for inspiration on creating great gig descriptions."

### Requirement: Dashboard Messages Empty State Enhancement
The dashboard messages card MUST use the EmptyState component when no recent messages exist.

#### Scenario: No recent messages for CLIENT
- GIVEN a CLIENT user views their dashboard
- WHEN no recent messages exist for their gigs
- THEN the messages card MUST display an EmptyState component with:
  - icon: "💬"
  - heading: "No Messages Yet"
  - description: "Messages with specialists will appear here once you accept applications and start communicating."

#### Scenario: No recent messages for SPECIALIST
- GIVEN a SPECIALIST user views their dashboard
- WHEN no recent messages exist for their active gigs
- THEN the messages card MUST display an EmptyState component with:
  - icon: "💬"
  - heading: "No Messages Yet"
  - description: "Messages with clients will appear here once your applications are accepted and work begins."

### Requirement: Empty State Design Token Compliance
All empty states MUST use design tokens for styling to ensure consistency with the design system.

#### Scenario: EmptyState component uses design tokens
- GIVEN any page renders an EmptyState component
- WHEN the component is inspected
- THEN it MUST use design tokens for:
  - Background: `bg-surface-level-1`
  - Border: `border-neutral-weak`
  - Heading text: `text-white`
  - Description text: `text-neutral-default`
  - Primary button: `bg-blue-500 hover:bg-blue-600 text-white`
  - Secondary link: `text-blue-600 hover:text-blue-800`
- AND it MUST NOT use hardcoded color values

### Requirement: Empty State Accessibility
All empty states MUST be accessible to screen readers and keyboard navigation.

#### Scenario: Empty state is accessible
- GIVEN any page renders an EmptyState component
- WHEN a user navigates with keyboard or screen reader
- THEN the heading MUST be properly structured (h3 or appropriate level)
- AND action buttons MUST be keyboard accessible
- AND links MUST have descriptive text (not just "Click here")
- AND the empty state MUST have sufficient color contrast

### Requirement: Role-Specific Empty State Testing
Empty states MUST be tested for both CLIENT and SPECIALIST roles to ensure appropriate messaging.

#### Scenario: CLIENT sees appropriate empty states
- GIVEN a CLIENT user navigates through the application
- WHEN they encounter empty states on their dashboard
- THEN empty states MUST reference CLIENT-specific actions (e.g., "Post New Gig", "Accept Applications")
- AND empty states MUST NOT reference SPECIALIST actions (e.g., "Browse Gigs", "Apply to Gigs")

#### Scenario: SPECIALIST sees appropriate empty states
- GIVEN a SPECIALIST user navigates through the application
- WHEN they encounter empty states on their dashboard or gig browsing
- THEN empty states MUST reference SPECIALIST-specific actions (e.g., "Browse Gigs", "Apply to Projects")
- AND empty states MUST NOT reference CLIENT actions (e.g., "Post Gig", "Review Applications")
