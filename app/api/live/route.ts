import { getSession } from '@/lib/session'
import { computeLiveCountsFor } from '@/lib/counts'
import { subscribeNotifications } from '@/lib/notification-bus'

// Long-lived Server-Sent Events stream — must never be statically optimized or cached, and needs the Node runtime
// (the in-process event bus uses Node's EventEmitter, which the edge runtime does not provide).
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * `GET /api/live` — the real-time counts channel behind the bell + sidebar badges. Replaces the 30s poll as the primary
 * transport: the client opens one EventSource, and whenever a notification changes for this user (lifecycle event, chat
 * message, or a read — see `emitNotificationChange`), the stream pushes fresh counts immediately. `useLiveCounts` keeps
 * a slow poll as a fallback, so a missed push degrades to poll latency, never to a lost update.
 */
export async function GET(request: Request) {
  const session = await getSession()
  if (!session) {
    // A logged-out tab gets a terminal 401; the client stops rather than reconnecting forever.
    return new Response('Unauthorized', { status: 401 })
  }
  // Admins have no bell surface (the admin shell renders no counts and does not open this stream), but guard anyway.
  const viewer = { userId: session.userId, role: session.role }

  const encoder = new TextEncoder()
  let closed = false

  const stream = new ReadableStream({
    start(controller) {
      const push = async () => {
        if (closed) return
        try {
          const counts = await computeLiveCountsFor(viewer)
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(counts)}\n\n`))
        } catch {
          // Skip this tick; the next event or the client's fallback poll recovers.
        }
      }

      // Initial snapshot so the badge is correct the moment the stream opens.
      void push()

      // Push on every change for this user.
      const unsubscribe = subscribeNotifications(viewer.userId, () => void push())

      // SSE comment heartbeat — keeps the connection alive through idle-timeout proxies.
      const heartbeat = setInterval(() => {
        if (closed) return
        try {
          controller.enqueue(encoder.encode(`: keepalive\n\n`))
        } catch {
          /* controller already closed */
        }
      }, 25_000)

      const cleanup = () => {
        if (closed) return
        closed = true
        clearInterval(heartbeat)
        unsubscribe()
        try {
          controller.close()
        } catch {
          /* already closed */
        }
      }

      // Client disconnect (tab closed / navigated away) aborts the request.
      request.signal.addEventListener('abort', cleanup)
    },
    cancel() {
      closed = true
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      // Disable proxy buffering (nginx) so events are flushed immediately.
      'X-Accel-Buffering': 'no',
    },
  })
}
