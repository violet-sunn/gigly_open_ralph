# Change Proposal: Onboarding Flow

## Problem Statement

Users successfully register on Gigly but experience high drop-off rates immediately after registration. The current implementation redirects users directly to an empty dashboard without guidance, leaving them uncertain about what actions to take next. This lack of direction is particularly problematic for:

- **New CLIENT users** who don't know they should complete their profile, create a gig, or review applications
- **New SPECIALIST users** who don't understand the flow of completing profile → browsing gigs → applying
- **All users** who encounter empty states (no gigs, no applications) without clear calls-to-action
- **First-time users** of key features (gig creation, applications, messaging) who lack contextual guidance

This results in:
- High abandonment rates after registration
- Users leaving without completing their profile
- Confusion about the platform's core workflows
- Reduced engagement and conversion to active users

## Proposed Solution

Implement a comprehensive onboarding flow that guides users through their first actions on the platform using:

1. **Welcome Screen**: Role-specific post-registration screen showing clear next steps
2. **Profile Completion Indicator**: Visual progress bar showing profile completeness
3. **First-Time Tooltips**: Contextual, dismissible tooltips on key features (gig creation, application, messaging)
4. **Enhanced Empty States**: Empty state screens with actionable CTAs instead of passive messages
5. **localStorage Tracking**: Client-side flags to track which onboarding elements have been seen

## Scope

### In Scope
- Welcome screen component with role-specific step lists
- Profile completion progress indicator on dashboard
- First-time tooltips for: gig creation form, application form, messaging interface
- Enhanced empty states for: no gigs (CLIENT), no applications (SPECIALIST), no messages
- localStorage-based tracking of onboarding state
- Dismissible UI for all onboarding elements

### Out of Scope
- Backend database tracking of onboarding progress (using localStorage only for MVP)
- Email-based onboarding sequences
- Interactive product tours or walkthroughs
- Onboarding analytics dashboard
- Multi-step wizard-style onboarding
- Video tutorials or help documentation

## Constraints

- **No Backend Changes**: All onboarding state MUST be tracked in localStorage (no database schema changes)
- **Non-Intrusive**: Onboarding elements MUST be dismissible and not block core functionality
- **Performance**: Onboarding checks MUST not add noticeable latency to page loads
- **Mobile-Friendly**: All onboarding UI MUST work on mobile devices
- **Accessibility**: Tooltips and modals MUST be keyboard-navigable and screen-reader friendly

## Success Criteria

- New users see welcome screen immediately after registration
- Profile completion indicator displays accurate progress percentage
- First-time tooltips appear exactly once per feature per user
- Empty states include clear, actionable CTAs
- Returning users (who have seen onboarding) do not see repeated elements
- All onboarding elements can be dismissed permanently
- Onboarding state persists across browser sessions (localStorage)

## Non-Goals

- Tracking onboarding completion rates (analytics deferred)
- Forcing users to complete onboarding steps (all optional)
- Personalizing onboarding based on user behavior
- A/B testing different onboarding flows
- Integration with external onboarding tools (Intercom, Pendo, etc.)
