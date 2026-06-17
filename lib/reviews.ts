import { prisma } from '@/lib/prisma'
import type { RatingVM } from '@/app/components/blocks/view-models'

/**
 * The exact subset of the RatingVM block contract this aggregate fulfils. Imported `import type`
 * (erased at build) so the data layer matches the view-model SSOT with NO runtime UI coupling.
 */
export type RatingAggregate = Pick<RatingVM, 'value' | 'count' | 'verified'>

/**
 * Aggregate a user's received reviews into the RatingVM contract shape:
 *   value    = average rating (0 when there are none)
 *   count    = number of reviews
 *   verified = backed by ≥1 gig-verified review (reviews exist only after COMPLETED/PAID, so each is
 *              a verified transaction). profile-evolution (#13) will fold in identity verification.
 *
 * Server-only data helper (consumed by Phase-2 screens via @/lib/reviews).
 */
export async function getRatingForUser(userId: string): Promise<RatingAggregate> {
  const result = await prisma.review.aggregate({
    where: { targetId: userId },
    _avg: { rating: true },
    _count: { _all: true },
  })

  const count = result._count._all
  return {
    value: result._avg.rating ?? 0,
    count,
    verified: count > 0,
  }
}
