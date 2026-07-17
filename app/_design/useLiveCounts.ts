'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { getLiveCounts } from '@/app/actions/counts'

/**
 * Keeps the shell's counters fresh without a manual reload (Round-3 «счётчики не работают»).
 *
 * The shell (app/(protected)/layout.tsx → AppShellDesign) is persistent: it does NOT re-mount on client-side
 * navigation, so a mount-only fetch freezes every counter for the life of the tab.
 *
 * PRIMARY transport is a Server-Sent Events stream (`/api/live`): the server pushes fresh counts the instant a
 * notification changes (see `emitNotificationChange`), so the bell updates in real time — no 30s wait. The poll below
 * is now only a FALLBACK/backstop (a missed push, an SSE-hostile proxy, or a stale count) at a relaxed interval, plus
 * the always-useful pathname-change and tab-focus refreshes. `getLiveCounts()`/`/api/live` both return all three
 * counters in one payload, so this is one channel for the whole shell.
 */
const POLL_MS = 60_000

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

  // The live push stream, held in a ref so the poll can close it on a confirmed logout.
  const esRef = useRef<EventSource | null>(null)

  const refresh = useCallback(async () => {
    if (!enabled || stopped.current) return
    try {
      const next = await getLiveCounts()
      if (!alive.current) return
      // A logged-out tab (session expired, or logout in another tab) — stand down rather than zeroing the UI or
      // spamming the console from a background interval. Also tear down the push stream.
      if (!next.authenticated) {
        stopped.current = true
        esRef.current?.close()
        esRef.current = null
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

    // FALLBACK poll (backstop only — SSE below is the primary transport) + focus refresh.
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

  // PRIMARY transport: subscribe to the server-push stream. Counts land the instant they change, not on the poll.
  useEffect(() => {
    if (!enabled || stopped.current) return
    if (typeof window === 'undefined' || typeof EventSource === 'undefined') return

    const es = new EventSource('/api/live')
    esRef.current = es
    es.onmessage = (ev) => {
      if (!alive.current) return
      try {
        const next = JSON.parse(ev.data) as { notifications: number; gigs?: number; chats?: number }
        setCounts({ gigs: next.gigs, chats: next.chats, notifications: next.notifications })
        setLoaded(true)
      } catch {
        /* ignore a malformed frame */
      }
    }
    // Do NOT close the stream on every error: EventSource already auto-reconnects on a transient network blip, and it
    // auto-closes (without reconnecting) on a non-2xx like the 401 a logged-out tab gets. Closing here on any error was
    // the bug — one blip killed the real-time channel for the life of the tab. A real logout is torn down by `refresh`
    // above (via esRef) when it observes `authenticated: false`.
    return () => {
      es.close()
      if (esRef.current === es) esRef.current = null
    }
  }, [enabled])

  return { ...counts, loaded, refresh }
}
