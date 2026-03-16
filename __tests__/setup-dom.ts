import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import React from 'react'
import '@testing-library/jest-dom/vitest'

if (typeof window !== 'undefined') {
  // DOM-only setup for React Testing Library component tests.
  //
  // Convention:
  // - Place component tests under `__tests__/unit/components/**` to run in jsdom.
  // - Node-only tests remain the default (no DOM globals required).

  afterEach(() => {
    cleanup()
  })

  // Next.js Link mock (stable anchor rendering for component tests)
  vi.mock('next/link', () => {
    return {
      __esModule: true,
      default: ({ href, children, ...props }: any) => {
        const resolvedHref = typeof href === 'string' ? href : href?.pathname || ''
        return React.createElement('a', { href: resolvedHref, ...props }, children)
      }
    }
  })

  // Minimal browser API polyfills commonly required by UI components.
  if (!('matchMedia' in window)) {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false
      })
    })
  }

  if (!('ResizeObserver' in window)) {
    class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    ;(window as any).ResizeObserver = ResizeObserver
  }
}
