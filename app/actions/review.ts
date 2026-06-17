'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { sanitizeInput } from '@/lib/sanitize'
import { redirect } from 'next/navigation'

const MAX_COMMENT = 1000

/**
 * leaveReview — a party (client or assigned specialist) reviews the counterparty after the gig is
 * COMPLETED or PAID. Rating 1–5; comment sanitized + length-capped; one review per author per gig.
 * Mirrors the lifecycle actions in app/actions/gig.ts. Fulfills the Review side of the Rating contract.
 */
export async function leaveReview(
  prevState: { error?: string } | null,
  formData: FormData
) {
  const session = await getSession()
  if (!session) redirect('/login')

  const gigId = formData.get('gigId') as string
  const rating = Number(formData.get('rating'))
  const rawComment = (formData.get('comment') as string) ?? ''

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: 'Please choose a rating from 1 to 5 stars.' }
  }

  const comment = sanitizeInput(rawComment).trim()
  if (comment.length > MAX_COMMENT) {
    return { error: `Your review is too long (max ${MAX_COMMENT} characters).` }
  }

  const gig = await prisma.gig.findUnique({ where: { id: gigId } })
  if (!gig) {
    return { error: 'This gig no longer exists or has been removed.' }
  }

  if (gig.status !== 'COMPLETED' && gig.status !== 'PAID') {
    return { error: 'You can only leave a review once the gig is completed.' }
  }

  // The author must be a party; the target is the counterparty.
  let targetId: string | null = null
  if (gig.clientId === session.userId) {
    targetId = gig.assignedSpecialistId
  } else if (gig.assignedSpecialistId === session.userId) {
    targetId = gig.clientId
  } else {
    return { error: 'Only the client or the assigned specialist can review this gig.' }
  }

  if (!targetId) {
    return { error: 'This gig has no counterparty to review.' }
  }

  // One review per author per gig (also enforced by @@unique([gigId, authorId])).
  const existing = await prisma.review.findUnique({
    where: { gigId_authorId: { gigId, authorId: session.userId } },
  })
  if (existing) {
    return { error: 'You have already reviewed this gig.' }
  }

  await prisma.review.create({
    data: { gigId, authorId: session.userId, targetId, rating, comment },
  })

  redirect(`/gigs/${gigId}`)
}
