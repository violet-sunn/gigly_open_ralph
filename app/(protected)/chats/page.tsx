import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { getConversations, getChatThread } from '@/lib/view-models'
import { markNotificationAsRead } from '@/app/actions/notification'
import { ChatsDesign } from './ChatsDesign'

export default async function ChatsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  const params = await searchParams
  const selectedGigId = typeof params.gig === 'string' ? params.gig : undefined

  const viewer = { userId: session.userId, role: session.role }
  const conversations = await getConversations(viewer)

  let thread = null
  if (selectedGigId) {
    thread = await getChatThread(selectedGigId, viewer)
    // Opening a conversation marks it read (clears its unread + decrements the sidebar «Чаты» count).
    if (thread) {
      await markNotificationAsRead(selectedGigId)
    }
  }

  return <ChatsDesign conversations={conversations} thread={thread} selectedGigId={selectedGigId} />
}
