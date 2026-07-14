'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

export interface RecentMessage {
  gigId: string
  gigTitle: string
  senderName: string
  contentPreview: string
  createdAt: Date
}

export async function getRecentMessages(): Promise<RecentMessage[]> {
  const session = await getSession()
  if (!session) {
    return []
  }

  // Build where clause based on user role
  const whereClause = session.role === 'CLIENT'
    ? { clientId: session.userId, assignedSpecialistId: { not: null } }
    : { assignedSpecialistId: session.userId }

  // Query gigs where user is involved, with their most recent message
  const gigs = await prisma.gig.findMany({
    where: whereClause,
    include: {
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        include: {
          sender: {
            include: {
              specialistProfile: true,
              clientProfile: true,
            },
          },
        },
      },
    },
  })

  // Filter gigs that have at least one message and transform to RecentMessage format
  const recentMessages: RecentMessage[] = gigs
    .filter(gig => gig.messages.length > 0)
    .map(gig => {
      const message = gig.messages[0]
      const sender = message.sender

      // Determine sender name: platform label for system messages (null sender), otherwise
      // display name or company name, fallback to email.
      const senderName = !sender
        ? 'Gigly'
        : sender.specialistProfile?.displayName ||
          sender.clientProfile?.companyName ||
          sender.email

      // Create content preview: first 50 chars with ellipsis if truncated
      const contentPreview = message.content.length > 50
        ? message.content.substring(0, 50) + '...'
        : message.content

      return {
        gigId: gig.id,
        gigTitle: gig.title,
        senderName,
        contentPreview,
        createdAt: message.createdAt,
      }
    })

  // Sort by most recent message first
  recentMessages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  return recentMessages
}
