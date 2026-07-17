import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act, waitFor, fireEvent } from '@testing-library/react'

/**
 * Freshness contract for the shell's counters. The PRIMARY transport is now the SSE stream (`/api/live`); these tests
 * cover the FALLBACK path — the 60s backstop poll, tab re-focus, standing down when logged out, and not disturbing an
 * open dropdown. jsdom provides no `EventSource`, so the hook's SSE effect no-ops here and the poll path is exercised
 * in isolation, which is exactly what we want to pin. (The SSE push itself is proven live.)
 */

const getLiveCounts = vi.fn()
let pathname = '/dashboard'

vi.mock('@/app/actions/counts', () => ({
  getLiveCounts: (...args: unknown[]) => getLiveCounts(...args),
}))

vi.mock('next/navigation', () => ({
  usePathname: () => pathname,
}))

// The dropdown does its own data fetching; stub it so these tests isolate the bell's count/refresh behavior.
vi.mock('@/app/components/NotificationDropdown', () => ({
  NotificationDropdown: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="dropdown">
      <button onClick={onClose}>close</button>
    </div>
  ),
}))

import { NotificationBell } from '@/app/components/NotificationBell'

const authed = (n: number) => ({ authenticated: true, notifications: n, gigs: 0, chats: 0 })

const badge = () => {
  const bell = screen.getByLabelText('Уведомления')
  const span = bell.querySelector('span')
  return span?.textContent?.trim() ?? null
}

describe('NotificationBell freshness (live-counters)', () => {
  beforeEach(() => {
    pathname = '/dashboard'
    getLiveCounts.mockReset()
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows no badge until the first real read lands (no flash of a stale zero)', async () => {
    let resolve: (v: unknown) => void = () => {}
    getLiveCounts.mockReturnValue(new Promise((r) => (resolve = r)))

    render(<NotificationBell />)
    // In flight: the badge must not be rendered at all.
    expect(badge()).toBeNull()

    await act(async () => {
      resolve(authed(3))
    })
    await waitFor(() => expect(badge()).toBe('3'))
  })

  it('refetches when the tab is re-focused', async () => {
    getLiveCounts.mockResolvedValue(authed(2))
    render(<NotificationBell />)
    await waitFor(() => expect(badge()).toBe('2'))
    expect(getLiveCounts).toHaveBeenCalledTimes(1)

    getLiveCounts.mockResolvedValue(authed(4))
    await act(async () => {
      Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true })
      document.dispatchEvent(new Event('visibilitychange'))
    })

    await waitFor(() => expect(badge()).toBe('4'))
    expect(getLiveCounts).toHaveBeenCalledTimes(2)
  })

  it('does NOT refetch when the tab becomes hidden', async () => {
    getLiveCounts.mockResolvedValue(authed(2))
    render(<NotificationBell />)
    await waitFor(() => expect(getLiveCounts).toHaveBeenCalledTimes(1))

    await act(async () => {
      Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true })
      document.dispatchEvent(new Event('visibilitychange'))
    })
    expect(getLiveCounts).toHaveBeenCalledTimes(1)
  })

  it('polls on an interval as an idle backstop (60s fallback)', async () => {
    getLiveCounts.mockResolvedValue(authed(1))
    render(<NotificationBell />)
    await waitFor(() => expect(badge()).toBe('1'))

    getLiveCounts.mockResolvedValue(authed(7))
    await act(async () => {
      await vi.advanceTimersByTimeAsync(61_000)
    })
    await waitFor(() => expect(badge()).toBe('7'))
  })

  it('stands down permanently once it observes an unauthenticated response', async () => {
    getLiveCounts.mockResolvedValue(authed(5))
    render(<NotificationBell />)
    await waitFor(() => expect(badge()).toBe('5'))

    // Session ends.
    getLiveCounts.mockResolvedValue({ authenticated: false, notifications: 0, gigs: 0, chats: 0 })
    await act(async () => {
      await vi.advanceTimersByTimeAsync(61_000)
    })
    const callsAfterLogout = getLiveCounts.mock.calls.length

    // The last known value is kept — it must NOT flash to zero.
    expect(badge()).toBe('5')

    // Several more intervals: no further requests.
    await act(async () => {
      await vi.advanceTimersByTimeAsync(120_000)
    })
    expect(getLiveCounts.mock.calls.length).toBe(callsAfterLogout)
  })

  it('clears its interval on unmount (no leaked timers)', async () => {
    getLiveCounts.mockResolvedValue(authed(1))
    const { unmount } = render(<NotificationBell />)
    await waitFor(() => expect(getLiveCounts).toHaveBeenCalledTimes(1))

    unmount()
    await act(async () => {
      await vi.advanceTimersByTimeAsync(120_000)
    })
    expect(getLiveCounts).toHaveBeenCalledTimes(1)
  })

  it('a background refresh does not close an open dropdown', async () => {
    getLiveCounts.mockResolvedValue(authed(2))
    render(<NotificationBell />)
    await waitFor(() => expect(badge()).toBe('2'))

    fireEvent.click(screen.getByLabelText('Уведомления'))
    expect(screen.getByTestId('dropdown')).toBeInTheDocument()

    getLiveCounts.mockResolvedValue(authed(9))
    await act(async () => {
      await vi.advanceTimersByTimeAsync(61_000)
    })

    // Count updated underneath, dropdown still open.
    await waitFor(() => expect(badge()).toBe('9'))
    expect(screen.getByTestId('dropdown')).toBeInTheDocument()
  })

  it('when the shell drives it, the bell does not open its own poll', async () => {
    render(<NotificationBell count={4} loaded onRefresh={() => {}} />)
    expect(badge()).toBe('4')
    await act(async () => {
      await vi.advanceTimersByTimeAsync(90_000)
    })
    expect(getLiveCounts).not.toHaveBeenCalled()
  })

  it('refetches on client-side navigation (pathname change)', async () => {
    getLiveCounts.mockResolvedValue(authed(1))
    const { rerender } = render(<NotificationBell />)
    await waitFor(() => expect(getLiveCounts).toHaveBeenCalledTimes(1))

    getLiveCounts.mockResolvedValue(authed(6))
    pathname = '/my-gigs'
    await act(async () => {
      rerender(<NotificationBell />)
    })
    await waitFor(() => expect(badge()).toBe('6'))
  })
})
