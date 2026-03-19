# Token Mapping Document: ui-core-components

## Overview

This document maps current hardcoded color classes to semantic color names from the Tailwind config. The goal is to improve semantic clarity while maintaining pixel-perfect visual appearance.

## Strategy

- Use semantic color names (success, error, warning) instead of generic names (green, red, amber)
- Keep brand colors (blue) as-is since they represent the primary brand color
- Maintain exact visual appearance by using the manual colors defined in Tailwind config
- The design tokens from `design-tokens.json` have different color values, so we use the manual semantic colors for backward compatibility

## Color Mapping

### Buttons

#### Primary/Brand Buttons
```
Current: bg-blue-500 hover:bg-blue-600
Target:  bg-blue-500 hover:bg-blue-600
Change:  KEEP AS-IS (brand color)
```

#### Success Buttons (Accept, Approve, Mark as Paid)
```
Current: bg-green-500 hover:bg-green-600
Target:  bg-success-500 hover:bg-success-600
Change:  green → success
Visual:  IDENTICAL (#22C55E → #22C55E)
```

#### Danger/Destructive Buttons (Reject, Delete, Withdraw)
```
Current: bg-red-500 hover:bg-red-600
Target:  bg-error-500 hover:bg-error-600
Change:  red → error
Visual:  IDENTICAL (#EF4444 → #EF4444)
```

#### Focus Rings (All Buttons)
```
Current: focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-navy-900
Target:  focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-navy-900
Change:  KEEP AS-IS
```

### Inputs & Textareas

#### Standard Input/Textarea
```
Current: bg-navy-800 border-gray-600 text-white placeholder:text-gray-400
Target:  bg-navy-800 border-gray-600 text-white placeholder:text-gray-400
Change:  KEEP AS-IS (already semantic)
```

#### Focus States
```
Current: focus:border-blue-500 focus:ring-blue-500
Target:  focus:border-blue-500 focus:ring-blue-500
Change:  KEEP AS-IS
```

#### Error States
```
Current: border-red-500 focus:border-red-500 focus:ring-red-500
Target:  border-error-500 focus:border-error-500 focus:ring-error-500
Change:  red → error
Visual:  IDENTICAL
```

#### Error Text
```
Current: text-red-400, text-red-500, text-red-600
Target:  text-error-400, text-error-500, text-error-600
Change:  red → error
Visual:  IDENTICAL
```

### Links

#### Standard Links
```
Current: text-blue-500 hover:text-blue-400
Target:  text-blue-500 hover:text-blue-400
Change:  KEEP AS-IS (brand color)
```

#### Secondary Links
```
Current: text-blue-600 hover:text-blue-800
Target:  text-blue-600 hover:text-blue-800
Change:  KEEP AS-IS
```

#### Focus States
```
Current: focus:ring-blue-500
Target:  focus:ring-blue-500
Change:  KEEP AS-IS
```

### Warning/Alert Components

#### Warning Backgrounds
```
Current: bg-amber-50 border-amber-300 text-amber-800
Target:  bg-warning-50 border-warning-300 text-warning-800
Change:  amber → warning
Note:    Need to verify warning-50 exists in Tailwind config
```

#### Warning Text
```
Current: text-amber-600, text-amber-800
Target:  text-warning-600, text-warning-800
Change:  amber → warning
```

## Files to Update

### High Priority (Buttons)
1. `app/components/MarkAsPaidButton.tsx` - green → success
2. `app/(protected)/gigs/[id]/application-actions.tsx` - green → success, red → error
3. `app/(protected)/gigs/[id]/withdraw-application-button.tsx` - red → error
4. `app/(protected)/gigs/[id]/submit-work-form.tsx` - Check for color usage
5. `app/(protected)/gigs/[id]/approve-work-form.tsx` - Check for color usage
6. `app/admin/users/SuspendUserForm.tsx` - Likely red → error
7. `app/admin/users/UnsuspendUserForm.tsx` - Likely green → success

### Medium Priority (Error Messages)
8. `app/login/page.tsx` - Error text: red → error
9. `app/register/page.tsx` - Error text: red → error
10. `app/(protected)/gigs/new/gig-form.tsx` - Error text: red → error
11. `app/(protected)/gigs/[id]/apply-form.tsx` - Error text: red → error
12. `app/(protected)/gigs/[id]/message-form.tsx` - Error text: red → error

### Low Priority (Warning Components)
13. `app/components/AcceptanceCriteriaQualityWarning.tsx` - amber → warning
14. Other files with amber colors

## Verification Checklist

After each file update:
- [ ] Visual appearance unchanged (side-by-side comparison)
- [ ] All button interactions work (click, hover, focus)
- [ ] All form validations work
- [ ] Error messages display correctly
- [ ] No test failures

## Color Reference

### Current Manual Colors (Tailwind Config)
```typescript
blue: {
  400: "#38BDF8",
  500: "#0EA5E9", // Primary brand
  600: "#0284C7",
}
success: {
  400: "#4ADE80",
  500: "#22C55E", // Same as green-500
  600: "#16A34A",
}
error: {
  400: "#F87171",
  500: "#EF4444", // Same as red-500
  600: "#DC2626",
}
warning: {
  400: "#FBBF24",
  500: "#F59E0B", // Same as amber-500
  600: "#D97706",
}
```

## Notes

- The design tokens from `design-tokens.json` have different color values and would cause visual regressions
- We're using the manual semantic colors (success, error, warning) which maintain visual appearance
- This approach improves semantic clarity while maintaining backward compatibility
- Future work could involve updating design tokens to match current colors, then migrating to those
