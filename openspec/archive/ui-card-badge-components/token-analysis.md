# Design Token Analysis for Card and Badge Migration

## Task 1: Token Availability Analysis

**Date:** 2026-03-19
**Status:** Complete

### Available Design Tokens

#### Surface/Background Tokens
- `bg-surface-level-0`: rgba(1, 3, 14, 1.00) - Darkest surface
- `bg-surface-level-1`: rgba(6, 8, 19, 1.00) - Medium surface
- `bg-surface-level-2`: rgba(16, 18, 28, 1.00) - Lightest surface

#### Border Tokens
- `border-neutral-weak`: rgba(36, 41, 53, 1.00)
- `border-neutral-strong`: rgba(36, 41, 53, 1.00) - Same as weak

#### Semantic Background Tokens
- `bg-success-weak-default`: rgba(4, 67, 41, 1.00)
- `bg-warning-weak-default`: rgba(251, 191, 36, 1.00)
- `bg-danger-weak-default`: rgba(123, 0, 0, 1.00)

#### Semantic Text Tokens
- `text-brand-default`: rgba(19, 121, 243, 1.00)
- `text-success-default`: rgba(67, 199, 143, 1.00)
- `text-warning-default`: rgba(254, 154, 46, 1.00)
- `text-danger-default`: rgba(255, 149, 129, 1.00)

#### Semantic Border Tokens
- `border-brand-default`: rgba(2, 101, 220, 1.00)
- `border-success-default`: rgba(67, 199, 143, 1.00)
- `border-warning-default`: rgba(245, 158, 11, 1.00)
- `border-danger-default`: rgba(255, 149, 129, 1.00)

### Current Implementation Colors (for comparison)

- `bg-navy-900`: rgba(10, 14, 39) - Page background
- `bg-navy-800`: rgba(20, 25, 55) - Card background
- `bg-navy-700`: rgba(30, 36, 71) - Hover state
- `border-gray-700`: rgba(55, 65, 81) - Card borders

### Token Gaps Identified

1. **No hover state tokens**: Design tokens don't provide hover variants for surface levels
2. **Limited surface levels**: Only 3 surface levels (0, 1, 2), no level 3
3. **No border-neutral-default**: Only weak and strong variants (which are identical)
4. **No subtle semantic backgrounds**: No tokens like `bg-success-subtle` with opacity

### Proposed Token Mapping Strategy

Given the token limitations, we'll use a **hybrid approach**:

#### Card Backgrounds
- `bg-navy-800` → `bg-surface-level-1` (cards on page background)
- `bg-navy-900` (nested cards) → `bg-surface-level-2` (cards within cards)

#### Card Borders
- `border-gray-700` → `border-neutral-weak`

#### Hover States (NO TOKENS AVAILABLE)
- `hover:bg-navy-700` → **KEEP AS IS** (no token available)
- `hover:border-gray-600` → **KEEP AS IS** (no token available)

#### Status Badges (Semantic Colors)

Since design tokens don't provide subtle background variants with opacity (like `bg-success-500/20`), we'll need to:
1. Use the weak background tokens where available
2. Keep opacity-based classes where tokens don't provide suitable alternatives

**Badge Mapping:**
- OPEN/IN_PROGRESS: Keep `bg-blue-500/20 text-blue-400 border-blue-500/30` (no suitable token)
- COMPLETED: Keep `bg-warning-500/20 text-warning-400 border-warning-500/30` (no suitable token)
- PAID/SUCCESS: Keep `bg-success-500/20 text-success-400 border-success-500/30` (no suitable token)
- REJECTED/ERROR: Keep `bg-error-500/20 text-error-400 border-error-500/30` (no suitable token)
- WITHDRAWN: Keep `bg-gray-500/20 text-gray-400 border-gray-500/30` (no suitable token)

### Conclusion

**Token Coverage: ~40%**
- ✅ Static card backgrounds: Can use tokens
- ✅ Card borders: Can use tokens
- ❌ Hover states: No tokens available
- ❌ Status badge backgrounds: No suitable tokens (need opacity variants)

### Recommendation

**Option 1: Partial Migration (Recommended)**
- Migrate card backgrounds and borders to tokens
- Keep hover states and badge colors as hardcoded classes
- Document the need for additional tokens in the design system

**Option 2: Full Migration (Requires Token Updates)**
- Add hover state tokens to design-tokens.json
- Add subtle semantic background tokens with opacity
- Re-run token parser
- Then perform full migration

**Decision: Proceed with Option 1** - Partial migration using available tokens, keeping hardcoded classes where tokens don't exist. This maintains visual consistency while making progress toward token-based styling.

### Updated Token Mapping for Implementation

```
Card Backgrounds:
  bg-navy-800 → bg-surface-level-1
  bg-navy-900 (nested) → bg-surface-level-2

Card Borders:
  border-gray-700 → border-neutral-weak

Hover States (keep as is):
  hover:bg-navy-700 → hover:bg-navy-700 (no token)
  hover:border-gray-600 → hover:border-gray-600 (no token)

Status Badges (keep as is):
  All status badge colors remain unchanged (no suitable tokens)
```

This approach satisfies the constraint: "If tokens don't exist with expected names, identify alternative tokens or document the need to use existing hardcoded classes with semantic naming."
