# Onboarding System Documentation

## Overview

The onboarding system guides new users through their first actions on Gigly using localStorage-based tracking. It includes welcome screens, profile completion indicators, contextual tooltips, and enhanced empty states.

## Components

### 1. FirstTimeTooltip (`app/components/onboarding/FirstTimeTooltip.tsx`)

A reusable client component that displays a dismissible tooltip on first visit.

**Props:**
- `storageKey: string` - Unique localStorage key for tracking dismissal
- `message: string` - Tooltip message to display
- `onDismiss?: () => void` - Optional callback when dismissed

**Usage:**
```tsx
<FirstTimeTooltip
  storageKey="onboarding_gig_creation_seen"
  message="💡 Tip: Be specific about your requirements..."
/>
```

**localStorage Keys:**
- `onboarding_gig_creation_seen` - Gig creation form tooltip
- `onboarding_application_seen` - Application form tooltip
- `onboarding_messaging_seen` - Messaging interface tooltip

---

### 2. EmptyState (`app/components/onboarding/EmptyState.tsx`)

A reusable server component for displaying empty states with actionable CTAs.

**Props:**
- `icon: string` - Emoji or icon to display
- `heading: string` - Main heading text
- `description: string` - Description text
- `primaryAction?: { label: string, href: string }` - Primary action button
- `secondaryAction?: { label: string, href: string }` - Secondary action link

**Usage:**
```tsx
<EmptyState
  icon="📋"
  heading="Post Your First Gig"
  description="Get started by posting a gig..."
  primaryAction={{ label: "Create Gig", href: "/gigs/new" }}
  secondaryAction={{ label: "View Examples", href: "/gigs/examples" }}
/>
```

---

### 3. WelcomeModal (`app/components/onboarding/WelcomeModal.tsx`)

A client component that displays role-specific welcome steps after registration.

**Props:**
- `role: 'CLIENT' | 'SPECIALIST'` - User role
- `onDismiss: () => void` - Callback when modal is dismissed

**Features:**
- Role-specific step lists (CLIENT vs SPECIALIST)
- Keyboard accessible (Escape to close)
- Focus trap
- Backdrop click to dismiss
- Prevents body scroll when open

**localStorage Key:**
- `onboarding_welcome_seen` - Welcome modal dismissal

**Usage:**
```tsx
<WelcomeModal role={session.role} onDismiss={() => {}} />
```

---

### 4. ProfileCompletionCard (`app/components/onboarding/ProfileCompletionCard.tsx`)

A server component that displays profile completion progress.

**Props:**
- `role: 'CLIENT' | 'SPECIALIST'` - User role
- `profile: ClientProfile | SpecialistProfile | null` - User profile data

**Calculation:**
- **CLIENT**: Tracks `companyName`, `inn` (2 fields)
- **SPECIALIST**: Tracks `displayName`, `techStack`, `experienceLevel`, `bio` (4 fields)

**Color Coding:**
- 0-33%: Red (`bg-red-500`)
- 34-66%: Yellow (`bg-yellow-500`)
- 67-99%: Blue (`bg-blue-500`)
- 100%: Hidden (returns `null`)

**Usage:**
```tsx
<ProfileCompletionCard
  role={session.role}
  profile={user?.clientProfile || null}
/>
```

---

## Integration Points

### Dashboard (`app/(protected)/dashboard/page.tsx`)

**CLIENT Dashboard:**
1. `WelcomeModal` - Displays on first visit
2. `ProfileCompletionCard` - Shows if profile incomplete
3. `EmptyState` - Replaces "No gigs" message

**SPECIALIST Dashboard:**
1. `WelcomeModal` - Displays on first visit
2. `ProfileCompletionCard` - Shows if profile incomplete
3. `EmptyState` in tabs:
   - Active Work tab
   - Pending Applications tab
   - Archive tab

### Gig Creation (`app/(protected)/gigs/new/gig-form.tsx`)

- `FirstTimeTooltip` - Displays on first visit to gig creation form

### Application Form (`app/(protected)/gigs/[id]/apply-form.tsx`)

- `FirstTimeTooltip` - Displays on first application submission

### Messaging (`app/(protected)/gigs/[id]/message-form.tsx`)

- `FirstTimeTooltip` - Displays on first message send

### Messages List (`app/(protected)/gigs/[id]/message-list.tsx`)

- `EmptyState` - Displays when no messages exist

---

## localStorage Keys Reference

| Key | Purpose | Component |
|-----|---------|-----------|
| `onboarding_welcome_seen` | Welcome modal dismissal | WelcomeModal |
| `onboarding_gig_creation_seen` | Gig creation tooltip | FirstTimeTooltip |
| `onboarding_application_seen` | Application tooltip | FirstTimeTooltip |
| `onboarding_messaging_seen` | Messaging tooltip | FirstTimeTooltip |

---

## Resetting Onboarding State

To reset onboarding for testing or debugging:

```javascript
// Clear all onboarding flags
localStorage.removeItem('onboarding_welcome_seen')
localStorage.removeItem('onboarding_gig_creation_seen')
localStorage.removeItem('onboarding_application_seen')
localStorage.removeItem('onboarding_messaging_seen')

// Or clear all localStorage
localStorage.clear()
```

---

## Testing

### Unit Tests

Located in `__tests__/unit/components/onboarding/`:
- `FirstTimeTooltip.test.tsx` - 6 tests
- `EmptyState.test.tsx` - 7 tests
- `WelcomeModal.test.tsx` - 11 tests
- `ProfileCompletionCard.test.tsx` - 15 tests

**Run tests:**
```bash
npm test -- __tests__/unit/components/onboarding --run
```

### Integration Tests

Located in `__tests__/integration/onboarding/`:
- `dashboard-onboarding.test.ts` - Dashboard integration

---

## Design Decisions

### Why localStorage?

- **No backend changes**: Keeps MVP simple
- **Fast**: No database queries
- **Privacy-friendly**: Data stays on user's device
- **Easy to reset**: Users can clear browser data

### Limitations

- **No analytics**: Can't track completion rates
- **Per-device**: Onboarding resets on new devices/browsers
- **No server-side control**: Can't force re-onboarding

### Future Enhancements

- Move to database tracking for analytics
- Add onboarding completion metrics
- Implement progressive onboarding (show tips over time)
- Add A/B testing for different onboarding flows

---

## Troubleshooting

### Welcome modal not appearing

1. Check localStorage: `localStorage.getItem('onboarding_welcome_seen')`
2. Clear the flag: `localStorage.removeItem('onboarding_welcome_seen')`
3. Refresh the page

### Tooltip not appearing

1. Check the specific localStorage key
2. Ensure you're on the correct page (gig creation, application, etc.)
3. Clear the flag and refresh

### Profile completion card not showing

1. Verify profile data is being passed correctly
2. Check if profile is already 100% complete
3. Verify role matches profile type (CLIENT/SPECIALIST)

### Empty state not showing

1. Verify the data array is actually empty
2. Check that EmptyState component is imported correctly
3. Verify conditional rendering logic

---

## Accessibility

All onboarding components follow accessibility best practices:

- **Keyboard navigation**: All interactive elements are keyboard accessible
- **ARIA attributes**: Proper roles and labels for screen readers
- **Focus management**: Modal traps focus, tooltips don't block content
- **Color contrast**: All text meets WCAG AA standards
- **Touch targets**: Buttons are at least 44px for mobile users

---

## Performance

- **Lazy loading**: Components only render when needed
- **No API calls**: All state is localStorage-based
- **Minimal re-renders**: Components use proper React patterns
- **Small bundle size**: Components are lightweight (<5KB total)

---

## Maintenance

### Adding a new tooltip

1. Choose a unique `storageKey`
2. Add to the localStorage keys reference above
3. Import `FirstTimeTooltip` in your component
4. Add the component with appropriate message

```tsx
<FirstTimeTooltip
  storageKey="onboarding_new_feature_seen"
  message="💡 Tip: Your helpful message here"
/>
```

### Adding a new empty state

1. Import `EmptyState` component
2. Replace existing empty message with component
3. Provide appropriate icon, heading, description, and actions

```tsx
{items.length === 0 ? (
  <EmptyState
    icon="🔍"
    heading="No Items Yet"
    description="Get started by..."
    primaryAction={{ label: "Action", href: "/path" }}
  />
) : (
  // Render items
)}
```

---

## Support

For questions or issues with the onboarding system:
1. Check this documentation
2. Review unit tests for usage examples
3. Check component source code for implementation details
