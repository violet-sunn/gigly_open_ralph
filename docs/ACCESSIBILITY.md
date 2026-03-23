# Keyboard Navigation and Accessibility

## Overview

Gigly implements comprehensive keyboard navigation to ensure the platform is accessible to all users, including those who rely on keyboard-only navigation due to motor disabilities or personal preference.

## Keyboard Shortcuts

### Global Shortcuts

| Shortcut | Action | Context |
|----------|--------|---------|
| `Tab` | Move focus forward | All pages |
| `Shift + Tab` | Move focus backward | All pages |
| `Enter` | Activate focused element | Buttons, links, custom components |
| `Space` | Activate focused element | Buttons, custom components |
| `Esc` | Close modal or dropdown | Modals, dropdowns |
| `/` | Focus search input | Gig browse page |

### Skip to Main Content

Press `Tab` on any page to reveal a "Skip to main content" link as the first focusable element. Activating this link moves focus directly to the main content area, bypassing navigation elements.

## Focus Indicators

All interactive elements display a visible focus indicator when focused via keyboard navigation:

- **Color**: Blue ring using design token `--border-other-focusring`
- **Style**: 2px ring with 2px offset
- **Contrast**: Meets WCAG 2.1 Level AA requirements (3:1 minimum)

Focus indicators are implemented globally in `app/globals.css` and apply to:
- Buttons
- Links
- Form inputs (text, textarea, select)
- Custom interactive components

## Tab Order

Tab order follows the visual and logical reading order on all pages:

1. Skip to main content link (first)
2. Logo
3. Navigation links
4. Main content area
5. Form fields (in visual order)
6. Action buttons

No positive `tabindex` values are used to ensure natural DOM order is respected.

## Focus Management

### Page Navigation

When navigating between pages, focus automatically moves to the main content area (`#main-content`). This ensures keyboard users don't have to tab through navigation elements on every page load.

### Modal Dialogs

Modal dialogs implement focus trapping:

1. Focus moves to the first focusable element when modal opens
2. `Tab` cycles through focusable elements within the modal only
3. `Shift + Tab` cycles backward through modal elements
4. `Tab` on the last element wraps to the first element
5. `Esc` closes the modal and returns focus to the trigger element

### Dropdowns

Dropdown menus (e.g., notification dropdown):

1. `Enter` or `Space` on trigger button opens dropdown
2. `Esc` closes dropdown and returns focus to trigger button
3. Focus remains within dropdown while open

### Form Validation

When form validation fails:

1. Focus moves to the first field with an error
2. Error messages are associated with fields via `aria-describedby`
3. Error messages are announced to screen readers

## Custom Interactive Components

### RoleCard

The role selection cards on the registration page are fully keyboard accessible:

- Focusable via `Tab`
- Activatable with `Enter` or `Space`
- Visual focus indicator
- `aria-pressed` attribute indicates selection state

### NotificationBell

The notification bell in the header:

- Focusable via `Tab`
- Activatable with `Enter` or `Space` to open dropdown
- `Esc` closes dropdown and returns focus to bell
- Visual focus indicator

### PaginationControls

Pagination controls on list pages:

- Page number links are focusable via `Tab`
- Previous/Next buttons are focusable
- Disabled buttons are not focusable (skipped in tab order)
- Activatable with `Enter`
- Visual focus indicators

## Testing

### Automated Tests

Keyboard navigation is tested with Playwright E2E tests in `__tests__/e2e/keyboard-navigation.spec.ts`:

- Focus indicator visibility
- Skip to main content functionality
- Keyboard shortcuts (Esc, /)
- Tab order on all pages
- Focus trap in modals
- Complete user flows with keyboard only
- Custom interactive components

Run tests with:

```bash
npm run test:e2e -- keyboard-navigation.spec.ts
```

### Manual Testing

A comprehensive manual testing checklist is available in `docs/KEYBOARD_NAVIGATION_TESTING.md`. This checklist covers:

- All critical user flows
- All keyboard shortcuts
- Focus indicators on all elements
- Tab order on all pages
- Focus management in all scenarios
- Custom interactive components

## Developer Guidelines

### Adding New Interactive Elements

When adding new interactive elements:

1. **Use semantic HTML**: Prefer `<button>` and `<a>` over `<div>` with click handlers
2. **Add keyboard handlers**: If using non-semantic elements, add `onKeyDown` handlers for `Enter` and `Space`
3. **Make focusable**: Add `tabIndex={0}` to custom interactive elements
4. **Add ARIA attributes**: Use appropriate ARIA roles and attributes (e.g., `role="button"`, `aria-pressed`)
5. **Test with keyboard**: Verify the element is reachable and activatable with keyboard only

Example:

```tsx
const CustomButton = ({ onClick, children }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className="custom-button"
    >
      {children}
    </div>
  );
};
```

### Adding New Modals

When adding new modal dialogs:

1. **Use focus trap hook**: Import and use `useFocusTrap` from `app/hooks/useFocusTrap.ts`
2. **Add Esc handler**: Listen for `Escape` key to close modal
3. **Store trigger element**: Save reference to element that opened modal
4. **Return focus**: Return focus to trigger element when modal closes
5. **Add ARIA attributes**: Use `role="dialog"`, `aria-modal="true"`, `aria-labelledby`

Example:

```tsx
import { useFocusTrap } from '@/app/hooks/useFocusTrap';

const MyModal = ({ isOpen, onClose }) => {
  const modalRef = useFocusTrap(isOpen);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleClose = () => {
    onClose();
    triggerRef.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <h2 id="modal-title">Modal Title</h2>
      {/* Modal content */}
      <button onClick={handleClose}>Close</button>
    </div>
  );
};
```

### Adding New Keyboard Shortcuts

When adding new keyboard shortcuts:

1. **Check for conflicts**: Ensure shortcut doesn't conflict with browser shortcuts
2. **Document shortcut**: Add to this document and in-app help
3. **Respect context**: Don't activate shortcuts when focus is in text inputs
4. **Provide escape hatch**: Ensure users can always navigate away

Example:

```tsx
useEffect(() => {
  const handleShortcut = (e: KeyboardEvent) => {
    // Don't activate in text inputs
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }

    if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      // Handle shortcut
    }
  };

  document.addEventListener('keydown', handleShortcut);
  return () => document.removeEventListener('keydown', handleShortcut);
}, []);
```

## WCAG Compliance

Gigly's keyboard navigation implementation meets WCAG 2.1 Level AA standards:

- **2.1.1 Keyboard**: All functionality is available via keyboard
- **2.1.2 No Keyboard Trap**: Users can navigate away from all elements
- **2.4.3 Focus Order**: Tab order follows logical sequence
- **2.4.7 Focus Visible**: Focus indicators are visible on all elements

## Browser Support

Keyboard navigation is tested and supported in:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

Potential improvements for future releases:

- Arrow key navigation for dropdown menus
- More keyboard shortcuts (e.g., Ctrl+K for global search)
- Customizable keyboard shortcuts
- Keyboard shortcut help overlay (press `?` to view)
- Vim-style navigation mode (j/k for up/down)

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Keyboard Accessibility](https://webaim.org/techniques/keyboard/)
- [Focus Management](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
