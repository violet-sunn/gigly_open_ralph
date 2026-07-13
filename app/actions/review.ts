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
    return { error: 'Выберите оценку от 1 до 5 звёзд.' }
  }

  const comment = sanitizeInput(rawComment).trim()
  if (comment.length > MAX_COMMENT) {
    return { error: `Your review is too long (max ${MAX_COMMENT} characters).` }
  }

  const gig = await prisma.gig.findUnique({ where: { id: gigId } })
  if (!gig) {
    return { error: 'Этот гиг больше не существует или был удалён.' }
  }

  if (gig.status !== 'COMPLETED' && gig.status !== 'PAID') {
    return { error: 'Оставить отзыв можно только после завершения гига.' }
  }

  // The author must be a party; the target is the counterparty.
  let targetId: string | null = null
  if (gig.clientId === session.userId) {
    targetId = gig.assignedSpecialistId
  } else if (gig.assignedSpecialistId === session.userId) {
    targetId = gig.clientId
  } else {
    return { error: 'Оставить отзыв может только заказчик или назначенный специалист.' }
  }

  if (!targetId) {
    return { error: 'По этому гигу некого оценивать.' }
  }

  // One review per author per gig (also enforced by @@unique([gigId, authorId])).
  const existing = await prisma.review.findUnique({
    where: { gigId_authorId: { gigId, authorId: session.userId } },
  })
  if (existing) {
    return { error: 'Вы уже оставили отзыв по этому гигу.' }
  }

  await prisma.review.create({
    data: { gigId, authorId: session.userId, targetId, rating, comment },
  })

  redirect(`/gigs/${gigId}`)
}
