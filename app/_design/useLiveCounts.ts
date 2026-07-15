'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { getLiveCounts } from '@/app/actions/counts'

/**
 * Keeps the shell's counters fresh without a manual reload (Round-3 «счётчики не работают»).
 *
 * The shell (app/(protected)/layout.tsx → AppShellDesign) is persistent: it does NOT re-mount on client-side
 * navigation, so a mount-only fetch freezes every counter for the life of the tab. That was the whole bug — the
 * notification write and the read path were both verified correct.
 *
 * Refresh triggers: pathname change (the high-value one — the user is already doing something), tab re-focus, and a
 * ~30s interval as an idle backstop. `getLiveCounts()` returns all three counters in one round trip, so this is a
 * single poll for the whole shell rather than one per counter.
 */
const POLL_MS = 30_000

export interface LiveCountsState {
  gigs?: number
  chats?: number
  notifications: number
  /** True once a real read has landed — the bell stays badge-less until then rather than flashing a zero. */
  loaded: boolean
  refresh: () => void
}

export function useLiveCounts(initial: { gigs?: number; chats?: number }, enabled = true): LiveCountsState {
  const pathname = usePathname() ?? ''
  const [counts, setCounts] = useState<{ gigs?: number; chats?: number; notifications: number }>({
    gigs: initial.gigs,
    chats: initial.chats,
    notifications: 0,
  })
  const [loaded, setLoaded] = useState(false)
  const alive = useRef(true)
  // Once we learn the tab has no session, stop asking. Otherwise a logged-out tab left open would keep hitting the
  // (non-trivial) unread query every 30s forever.
  const stopped = useRef(false)

  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
    }
  }, [])

  const refresh = useCallback(async () => {
    if (!enabled || stopped.current) return
    try {
      const next = await getLiveCounts()
      if (!alive.current) return
      // A logged-out tab (session expired, or logout in another tab) — stand down rather than zeroing the UI or
      // spamming the console from a background interval.
      if (!next.authenticated) {
        stopped.current = true
        return
      }
      setCounts({ gigs: next.gigs, chats: next.chats, notifications: next.notifications })
      setLoaded(true)
    } catch {
      // A failed background refresh is not worth surfacing: the counters keep their last known value.
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled) return

    refresh()

    const id = setInterval(refresh, POLL_MS)
    const onVisible = () => {
      if (document.visibilityState === 'visible') refresh()
    }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVisible)
    }
    // pathname in the deps is the fix for the persistent shell: every client-side navigation re-runs the fetch.
  }, [pathname, enabled, refresh])

  return { ...counts, loaded, refresh }
}
