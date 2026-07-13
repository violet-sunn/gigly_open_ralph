'use server'

// chat-realtime — the client-driven messaging actions behind the `useThread` seam. `sendMessageLive` is the optimistic
// send (returns the persisted bubble, no redirect); `getMessagesSince` is the delta-poll receive contract. Both apply the
// SAME auth + guards as the form-based `sendMessage` (via the shared `persistMessage` core / the gated `getNewMessages`),
// so neither weakens the rules nor permits pre-assignment or non-participant access. Swapping polling for SSE later only
// changes `getMessagesSince`'s producer — the action signature (and the UI) stay put.

import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { persistMessage } from '@/lib/messaging'
import { getNewMessages, toMessageBubble } from '@/lib/view-models'
import type { MessageBubbleVM } from '@/app/components/blocks/view-models'

export async function sendMessageLive(
  gigId: string,
  content: string,
): Promise<{ message: MessageBubbleVM } | { error: string }> {
  const session = await getSession()
  if (!session) redirect('/login')

  const result = await persistMessage(session.userId, gigId, content)
  if ('error' in result) return { error: result.error }

  // The echo: sender is the viewer → direction 'out', author «Вы» (no sender relation needed).
  return { message: toMessageBubble(result.message, session.userId) }
}

export async function getMessagesSince(
  gigId: string,
  afterIso: string,
): Promise<{ messages: MessageBubbleVM[] }> {
  const session = await getSession()
  if (!session) redirect('/login')

  const messages = await getNewMessages(gigId, afterIso, { userId: session.userId, role: session.role })
  return { messages }
}
