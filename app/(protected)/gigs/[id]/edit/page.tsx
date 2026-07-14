import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { CATEGORIES } from '@/lib/categories'
import { EditGigDesign, type EditGigInitial } from './EditGigDesign'

/**
 * «Редактировать гиг» (gig-editing-with-notification) — owner-only edit screen for an already-published gig. The guard
 * here is server-authoritative (never relies on the gig-detail button being hidden): only the owning CLIENT of an OPEN,
 * non-closed, non-example gig can render the form. Everyone else is bounced (to /login unauthenticated, otherwise back
 * to the gig detail). The gig's stored values are pre-split (criteria from the `\n`-joined string, tags from the comma
 * string) and budget converted kopecks → roubles so the form starts filled and the readiness checklist is satisfied.
 */
export default async function EditGigPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) redirect('/login')

  const { id } = await params
  const gig = await prisma.gig.findUnique({ where: { id } })

  // Owner + OPEN + not-closed + not-example, else bounce to the gig detail (or /login already handled above).
  if (
    !gig ||
    session.role !== 'CLIENT' ||
    gig.clientId !== session.userId ||
    gig.closedByAdmin ||
    gig.isExample ||
    gig.status !== 'OPEN'
  ) {
    redirect(`/gigs/${id}`)
  }

  const categoryOptions = CATEGORIES.map((c) => ({ key: c.slug, label: c.name }))

  const initial: EditGigInitial = {
    id: gig.id,
    title: gig.title,
    description: gig.description,
    goal: gig.goal,
    deliverables: gig.deliverables,
    constraints: gig.constraints,
    // Criteria are stored `\n`-joined and tags comma-joined (see createGig / the create form). Split back into chips,
    // dropping empties so a trailing separator doesn't create a blank chip.
    criteria: (gig.acceptanceCriteria ?? '').split('\n').map((s) => s.trim()).filter(Boolean),
    tags: gig.tags.split(',').map((s) => s.trim()).filter(Boolean),
    budgetRub: Math.round(gig.budget / 100),
    deadlineDays: gig.deadlineDays,
    stageCount: gig.stageCount,
    categorySlug: gig.categorySlug ?? '',
  }

  return <EditGigDesign categoryOptions={categoryOptions} gig={initial} />
}
