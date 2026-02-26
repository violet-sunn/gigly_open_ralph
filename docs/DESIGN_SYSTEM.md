# Gigly Design System

**Version:** 1.0
**Last Updated:** February 2026

This document defines the design tokens and component patterns for the Gigly platform UI.

---

## Color Palette

### Navy (Background Colors)

Primary background colors for the dark theme interface.

- **navy-900** `#0A0E27` - Primary page background
- **navy-800** `#141937` - Card backgrounds (slightly lighter than page)
- **navy-700** `#1E2447` - Hover states for interactive elements
- **navy-600** `#2A3158` - Borders and dividers

**Usage:**
```tsx
// Page background
<body className="bg-navy-900 text-white">

// Card container
<div className="bg-navy-800 border border-gray-700 rounded-lg p-6">
```

---

### Blue (Accent Colors)

Primary accent color for interactive elements, CTAs, and focus states.

- **blue-400** `#38BDF8` - Lighter accent (hover states)
- **blue-500** `#0EA5E9` - Primary accent (buttons, links, active states)
- **blue-600** `#0284C7` - Darker accent (pressed states)

**Usage:**
```tsx
// Primary button
<button className="bg-blue-500 hover:bg-blue-600 text-white">

// Link
<a className="text-blue-500 hover:text-blue-400">

// Focus ring
<input className="focus:ring-2 focus:ring-blue-500">
```

---

### Gray (Text & Borders)

Neutral colors for text, borders, and subtle UI elements.

- **gray-300** `#D1D5DB` - Light text (headings on dark background)
- **gray-400** `#9CA3AF` - Placeholder text
- **gray-500** `#6B7280` - Secondary text
- **gray-600** `#4B5563` - Input borders
- **gray-700** `#374151` - Subtle borders (cards)
- **gray-800** `#1F2937` - Dark elements

**Usage:**
```tsx
// Heading
<h1 className="text-white font-bold">

// Body text
<p className="text-gray-300">

// Secondary text
<span className="text-gray-500 text-sm">

// Placeholder
<input placeholder="..." className="placeholder:text-gray-400">
```

---

### Status Colors

Semantic colors for status badges and alerts.

**Success (Green):**
- **success-400** `#4ADE80`
- **success-500** `#22C55E`
- **success-600** `#16A34A`

**Warning (Amber):**
- **warning-400** `#FBBF24`
- **warning-500** `#F59E0B`
- **warning-600** `#D97706`

**Error (Red):**
- **error-400** `#F87171`
- **error-500** `#EF4444`
- **error-600** `#DC2626`

**Usage:**
```tsx
// Success badge
<span className="bg-success-500/20 text-success-400 border border-success-500/30">

// Error message
<p className="text-error-500">
```

---

## Typography

### Font Sizes

Systematic scale with consistent line heights.

| Size | Class | Font Size | Line Height | Usage |
|------|-------|-----------|-------------|-------|
| xs | `text-xs` | 0.75rem (12px) | 1rem (16px) | Badges, labels |
| sm | `text-sm` | 0.875rem (14px) | 1.25rem (20px) | Secondary text, captions |
| base | `text-base` | 1rem (16px) | 1.5rem (24px) | Body text |
| lg | `text-lg` | 1.125rem (18px) | 1.75rem (28px) | Subheadings |
| xl | `text-xl` | 1.25rem (20px) | 1.75rem (28px) | Card titles |
| 2xl | `text-2xl` | 1.5rem (24px) | 2rem (32px) | Page headings |
| 3xl | `text-3xl` | 1.875rem (30px) | 2.25rem (36px) | Hero headings |
| 4xl | `text-4xl` | 2.25rem (36px) | 2.5rem (40px) | Large display text |

### Font Weights

- **normal** `font-normal` (400) - Body text
- **medium** `font-medium` (500) - Emphasized text, buttons
- **semibold** `font-semibold` (600) - Subheadings
- **bold** `font-bold` (700) - Headings

**Usage:**
```tsx
// Page heading
<h1 className="text-2xl font-bold text-white">

// Card title
<h2 className="text-xl font-semibold text-gray-300">

// Body text
<p className="text-base font-normal text-gray-300">

// Button text
<button className="text-base font-medium">
```

---

## Spacing

Use Tailwind's default spacing scale (4px base unit):

- `p-2` = 8px
- `p-4` = 16px
- `p-6` = 24px
- `p-8` = 32px

**Common Patterns:**
- Card padding: `p-6`
- Button padding: `px-4 py-2`
- Section spacing: `space-y-6` or `gap-6`
- Page margins: `max-w-7xl mx-auto px-4`

---

## Elevation (Shadows)

Subtle shadows for depth and hierarchy.

- **sm** `shadow-sm` - Subtle elevation (badges)
- **default** `shadow` - Standard elevation (cards)
- **md** `shadow-md` - Medium elevation (dropdowns)
- **lg** `shadow-lg` - High elevation (modals)
- **xl** `shadow-xl` - Maximum elevation (overlays)

**Usage:**
```tsx
// Card
<div className="bg-navy-800 shadow-md rounded-lg">

// Dropdown
<div className="bg-navy-800 shadow-lg rounded-lg">
```

---

## Component Patterns

### Buttons

**Primary Button:**
```tsx
<button className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-navy-900 disabled:opacity-50 disabled:cursor-not-allowed">
  Primary Action
</button>
```

**Secondary Button:**
```tsx
<button className="border border-blue-500 text-blue-500 hover:bg-blue-500/10 font-medium px-4 py-2 rounded-md transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-navy-900">
  Secondary Action
</button>
```

**Danger Button:**
```tsx
<button className="bg-error-600 hover:bg-error-700 text-white font-medium px-4 py-2 rounded-md transition-colors duration-200 focus:ring-2 focus:ring-error-500 focus:ring-offset-2 focus:ring-offset-navy-900">
  Delete
</button>
```

---

### Form Inputs

**Text Input:**
```tsx
<input
  type="text"
  className="bg-navy-800 border border-gray-600 text-white px-3 py-2 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-gray-400 w-full"
  placeholder="Enter text..."
/>
```

**Textarea:**
```tsx
<textarea
  className="bg-navy-800 border border-gray-600 text-white px-3 py-2 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-gray-400 w-full"
  rows={4}
  placeholder="Enter description..."
/>
```

**Error State:**
```tsx
<input
  className="bg-navy-800 border border-error-500 text-white px-3 py-2 rounded-md focus:border-error-500 focus:ring-1 focus:ring-error-500 placeholder:text-gray-400 w-full"
/>
<p className="text-error-500 text-sm mt-1">Error message</p>
```

---

### Cards

**Standard Card:**
```tsx
<div className="bg-navy-800 border border-gray-700 rounded-lg p-6 shadow-md">
  <h3 className="text-xl font-semibold text-white mb-2">Card Title</h3>
  <p className="text-gray-300">Card content</p>
</div>
```

**Clickable Card:**
```tsx
<Link href="/path">
  <div className="bg-navy-800 border border-gray-700 rounded-lg p-6 shadow-md hover:bg-navy-700 hover:border-gray-600 cursor-pointer transition-colors duration-200">
    <h3 className="text-xl font-semibold text-white mb-2">Card Title</h3>
    <p className="text-gray-300">Card content</p>
  </div>
</Link>
```

---

### Badges

**Status Badge Pattern:**
```tsx
<span className="px-2 py-1 text-xs font-medium rounded-md border">
  Status
</span>
```

**Status-Specific Colors:**
- OPEN: `bg-blue-500/20 text-blue-400 border-blue-500/30`
- IN_PROGRESS: `bg-warning-500/20 text-warning-400 border-warning-500/30`
- COMPLETED: `bg-success-500/20 text-success-400 border-success-500/30`
- REJECTED: `bg-error-500/20 text-error-400 border-error-500/30`

---

## Layout Patterns

### 2-Column Grid (Main + Sidebar)

```tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Main content */}
  <div className="lg:col-span-2">
    {/* Content */}
  </div>

  {/* Sidebar */}
  <div className="lg:col-span-1">
    {/* Sidebar content */}
  </div>
</div>
```

### Sticky Sidebar

```tsx
<div className="lg:col-span-1 sticky top-6">
  {/* Sidebar stays visible on scroll */}
</div>
```

---

## Accessibility

### Focus States

All interactive elements MUST have visible focus indicators:
```tsx
focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-navy-900
```

### Color Contrast

All text must meet WCAG AA standards:
- White text on navy-900: ✓ Pass
- gray-300 text on navy-900: ✓ Pass
- gray-500 text on navy-900: ✓ Pass (for secondary text)

### Keyboard Navigation

All interactive elements must be keyboard accessible:
- Use semantic HTML (`<button>`, `<a>`, `<input>`)
- Ensure logical tab order
- Support Enter/Space for activation

---

## Best Practices

1. **Use design tokens**: Always use the defined color classes (navy-900, blue-500) instead of arbitrary values
2. **Consistent spacing**: Use the spacing scale (p-4, p-6, gap-6) for consistency
3. **Hover states**: All clickable elements should have hover states with `transition-colors duration-200`
4. **Focus rings**: All interactive elements need visible focus rings for accessibility
5. **Responsive design**: Use `lg:` prefix for desktop layouts that stack on mobile
6. **Test on mobile**: Verify all layouts work on 320px width

---

## Migration Guide

When updating existing components:

1. Replace background colors: `bg-white` → `bg-navy-900`, `bg-gray-50` → `bg-navy-800`
2. Replace text colors: `text-gray-900` → `text-white`, `text-gray-600` → `text-gray-300`
3. Replace accent colors: `bg-indigo-600` → `bg-blue-500`, `text-indigo-600` → `text-blue-500`
4. Update borders: `border-gray-300` → `border-gray-700`
5. Add focus rings: `focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-navy-900`
6. Test functionality: Ensure all interactions still work correctly

---

**Questions?** Refer to the Tailwind config at `tailwind.config.ts` for the complete token definitions.
