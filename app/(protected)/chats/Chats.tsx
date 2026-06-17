/* @composed-screen */
'use client'

import { useState, useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { Section } from '@/app/components/layout/Section'
import { Split } from '@/app/components/layout/Split'
import { Stack } from '@/app/components/layout/Stack'
import { ConversationItem, ChatPanel, SearchPanel, Notice } from '@/app/components/blocks'
import { sendMessage } from '@/app/actions/gig'
import type { ConversationItemVM, ChatHeaderVM, ChatPanelVM } from '@/app/components/blocks/view-models'

/**
 * Chats — the /chats inbox, composed purely from the kit (compose-chats, Phase 2). Renders inside the layout's
 * AppShell. Template + slotted blocks + data only — no styling/className/style; arranged via layout primitives. Left:
 * Section «Сообщения» + search + ConversationItem·list (each opens /chats?gig=<id>). Right: the selected conversation's
 * ChatPanel (header + thread + composer wired to the existing sendMessage), or an empty-state Notice. Client: selection
 * nav + search filter + the send form.
 */
export function Chats({
  conversations,
  thread,
  selectedGigId,
}: {
  conversations: ConversationItemVM[]
  thread: { header: ChatHeaderVM; chat: ChatPanelVM } | null
  selectedGigId?: string
}) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [sendState, sendAction] = useActionState(sendMessage, null)

  const q = query.toLowerCase()
  const shown = q
    ? conversations.filter((c) => `${c.name} ${c.subtitle ?? ''} ${c.preview}`.toLowerCase().includes(q))
    : conversations

  return (
    <Split ratio="1:2">
      <Section title="Сообщения" gap={4}>
        <SearchPanel placeholder="Поиск по названию или описанию" actionLabel="Найти" onSubmit={setQuery} />
        <Stack gap={1}>
          {shown.map((c) => (
            <ConversationItem key={c.id} vm={c} onOpen={() => router.push(`/chats?gig=${c.id}`)} />
          ))}
          {shown.length === 0 && <Notice tone="muted">Чаты не найдены</Notice>}
        </Stack>
      </Section>

      {thread ? (
        <form action={sendAction}>
          <input type="hidden" name="gigId" value={selectedGigId} />
          <ChatPanel vm={thread.chat} />
          {sendState?.error && <Notice tone="error">{sendState.error}</Notice>}
        </form>
      ) : (
        <Notice tone="muted">Выберите чат, чтобы открыть переписку</Notice>
      )}
    </Split>
  )
}
