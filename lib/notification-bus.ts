import { EventEmitter } from 'events'

/**
 * In-process notification bus. When a notification changes for a user (a lifecycle event, a chat message, or a read),
 * the writer emits on that user's channel; the SSE stream (`app/api/live`) is subscribed and pushes fresh counts to the
 * browser immediately — so the bell updates in real time instead of on the ~30s poll.
 *
 * SINGLE-INSTANCE by design: this is a per-process emitter, which is correct because the app runs as one instance on
 * Amvera (one SQLite database). If the deployment ever scales to multiple instances, a cross-process bus (e.g. Redis
 * pub/sub) would replace this module behind the same emit/subscribe API — a post-MVP change. The SSE stream also keeps
 * a slow poll fallback, so a missed emit degrades to poll latency, never to a lost notification.
 *
 * Hung off `globalThis` so Next.js dev HMR (which re-evaluates modules) does not orphan subscribers on a fresh emitter.
 */
const globalForBus = globalThis as unknown as { __giglyNotifBus?: EventEmitter }
const bus =
  globalForBus.__giglyNotifBus ??
  (() => {
    const e = new EventEmitter()
    e.setMaxListeners(0) // one listener per open SSE connection; do not warn at 10
    return e
  })()
if (!globalForBus.__giglyNotifBus) globalForBus.__giglyNotifBus = bus

const channel = (userId: string) => `notif:${userId}`

/** Signal that `userId`'s notifications changed. Fire-and-forget: never throws into the caller (a write path). */
export function emitNotificationChange(userId: string | null | undefined): void {
  if (!userId) return
  try {
    bus.emit(channel(userId))
  } catch {
    /* a broken listener must never break a notification write */
  }
}

/** Subscribe to `userId`'s changes. Returns an unsubscribe function to call on disconnect. */
export function subscribeNotifications(userId: string, listener: () => void): () => void {
  const ch = channel(userId)
  bus.on(ch, listener)
  return () => {
    bus.off(ch, listener)
  }
}
