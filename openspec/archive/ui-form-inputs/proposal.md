# Proposal: Migrate Form Input Styling to Token-Based Colors

## Problem Statement

Form inputs across the application currently use hardcoded Tailwind color classes (`bg-navy-800`, `border-gray-600`, `border-gray-700`, `placeholder:text-gray-400`) instead of design tokens. This creates inconsistency with the design system and makes it difficult to maintain a cohesive visual language.

The current implementation violates the design token system established in `openspec/specs/ui/design-tokens.json` and documented in `docs/DESIGN_SYSTEM.md`. Forms are critical user interaction points, and their styling should follow the token-based approach to ensure:

1. **Visual consistency** across all form inputs (auth, gig creation, applications, messages, admin filters)
2. **Maintainability** through centralized token management
3. **Accessibility** through proper contrast ratios defined in tokens
4. **Future flexibility** for theme changes without touching component code

## Scope

This change migrates form input styling to use design tokens in the following areas:

### In Scope
- **Input backgrounds**: Replace `bg-navy-800` with appropriate surface token (11 files)
- **Input borders**: Replace `border-gray-600` and `border-gray-700` with `border-neutral-weak` (14 files)
- **Placeholder text**: Replace `placeholder:text-gray-400` with `placeholder:text-neutral-weak` (9 files)
- **Form types**: Auth forms (login, register), gig forms (create, apply, submit work, approve work), message forms, admin forms (filters, moderation), profile edit forms

### Out of Scope
- Button styling (already uses token-based colors)
- Non-form input elements (cards, badges, navigation)
- Focus states (already use semantic blue colors)
- Form validation logic or functionality
- Form layout or structure changes

## Affected Components

### Authentication Forms (2 files)
- `app/register/page.tsx` - Registration form with role selector
- `app/login/page.tsx` - Login form

### Gig Forms (4 files)
- `app/(protected)/gigs/new/gig-form.tsx` - Gig creation form
- `app/(protected)/gigs/[id]/apply-form.tsx` - Application submission form
- `app/(protected)/gigs/[id]/message-form.tsx` - Message composition form
- `app/(protected)/gigs/[id]/page.tsx` - Work submission and approval forms

### Admin Forms (5 files)
- `app/admin/users/UserFilters.tsx` - User management filters
- `app/admin/users/SuspendUserForm.tsx` - User suspension form
- `app/admin/users/UnsuspendUserForm.tsx` - User unsuspension form
- `app/admin/gigs/GigFilters.tsx` - Gig management filters
- `app/admin/gigs/CloseGigForm.tsx` - Gig closure form

### Profile Forms (1 file)
- `app/(protected)/profile/edit/ProfileEditForm.tsx` - Profile edit form

### Other Components (2 files)
- `app/components/PaginationControls.tsx` - Page number input
- `app/components/NotificationDropdown.tsx` - (if contains form inputs)

## Token Mapping

| Current Class | New Token | Rationale |
|--------------|-----------|-----------|
| `bg-navy-800` | `bg-surface-level-1` | Input backgrounds should use surface-level-1 for proper hierarchy on surface-level-0 pages |
| `border-gray-600` | `border-neutral-weak` | Neutral weak provides subtle borders that don't compete with content |
| `border-gray-700` | `border-neutral-weak` | Consolidate to single border token for consistency |
| `placeholder:text-gray-400` | `placeholder:text-neutral-weak` | Placeholder text should use weak neutral for secondary text hierarchy |

## Constraints

1. **Zero functional changes**: All form validation, submission logic, accessibility attributes, and keyboard navigation MUST remain unchanged
2. **Test compatibility**: All existing integration tests MUST pass without modification
3. **Visual consistency**: All forms MUST have identical input styling after migration
4. **Accessibility**: WCAG AA contrast ratios MUST be maintained for all text/background combinations
5. **Focus states preserved**: Existing `focus:ring-blue-500` and `focus:border-blue-500` MUST remain unchanged

## Success Criteria

1. All form inputs use `bg-surface-level-1` instead of `bg-navy-800`
2. All form input borders use `border-neutral-weak` instead of `border-gray-600` or `border-gray-700`
3. All placeholder text uses `placeholder:text-neutral-weak` instead of `placeholder:text-gray-400`
4. All existing integration tests pass without modification
5. Visual regression testing confirms consistent appearance across all forms
6. No functional regressions in form submission, validation, or accessibility

## Non-Goals

- Redesigning form layouts or structure
- Changing form validation rules or error messages
- Modifying button styling (already token-based)
- Updating non-form components
- Creating new form components
