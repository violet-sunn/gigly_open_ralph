import { useEffect, useRef } from 'react'

/**
 * Hook to trap focus within a container (e.g., modal dialog)
 * @param isActive - Whether the focus trap is active
 * @returns A ref to attach to the container element
 */
export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    // Store the element that had focus before the trap was activated
    const previouslyFocusedElement = document.activeElement as HTMLElement

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        // Shift+Tab: wrap from first to last
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        // Tab: wrap from last to first
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    container.addEventListener('keydown', handleTab)

    // Focus the first element when trap activates
    firstElement?.focus()

    return () => {
      container.removeEventListener('keydown', handleTab)
      // Return focus to previously focused element when trap deactivates
      previouslyFocusedElement?.focus()
    }
  }, [isActive])

  return containerRef
}
