# Dashboard Messages and Profile Edit Improvements

## Problem Statement

Two UX issues were identified after the recent UI design system overhaul:

### 1. Dashboard Messages Section is Non-Functional
The "Сообщения" (Messages) section in the dashboard sidebar was added as part of the design system implementation but currently displays only a placeholder ("No recent messages"). The notification system already tracks messages via the Notification model, but this sidebar section doesn't leverage that functionality. Users have no quick way to see recent message activity from the dashboard.

### 2. Profile Edit Flow is Disconnected from Profile View
The profile page was recently redesigned with a 2-column grid layout featuring a header card with avatar, stats, and structured sections. However, the profile edit page still uses the old simple vertical form layout. This creates a jarring experience when users navigate from the modern profile view to the outdated edit form and back. The visual disconnect makes the edit flow feel "broken" or like it "sends us back to the previous state."

## Proposed Solution

### Dashboard Messages Section
Implement functional message display in the dashboard sidebar:
- Query ALL gigs where the user is involved (owner or assigned specialist)
- For each gig, get the most recent message
- Display one entry per gig showing: gig title, sender name, message preview (first 50 chars), and relative timestamp
- Sort by most recent message timestamp (gigs with newest activity first)
- Make each entry clickable to navigate to the gig detail page
- Show empty state when no messages exist
- Make the entire section scrollable (no hard limit) so users can see all gigs with message activity

### Profile Edit Page Redesign
Redesign the profile edit form to match the new profile page layout:
- Use the same 2-column grid structure as the profile view page
- Include header card with avatar display (read-only during edit)
- Organize form fields into the same sections as the profile view
- Maintain visual consistency with the profile page design
- Ensure smooth transitions between view and edit modes

## Constraints

- **No new database models**: Use existing Message and Notification models
- **No breaking changes**: All existing functionality must continue to work
- **Performance**: Message queries must be efficient (indexed, limited results)
- **Responsive**: Both features must work on mobile devices
- **Accessibility**: Maintain keyboard navigation and screen reader support

## Success Criteria

1. Dashboard sidebar displays actual recent messages with sender and preview
2. Clicking a message navigates to the correct gig detail page
3. Profile edit page visually matches the profile view page layout
4. Navigation between profile view and edit feels smooth and consistent
5. All existing tests continue to pass
6. No performance degradation on dashboard or profile pages

## Non-Goals

- Email notifications for messages (deferred to post-MVP)
- Real-time message updates (deferred to post-MVP)
- Message search or filtering (deferred to post-MVP)
- Profile photo upload (deferred to post-MVP)
- Advanced profile fields (portfolio, certifications, etc.)
