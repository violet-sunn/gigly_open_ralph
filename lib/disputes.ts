import { prisma } from '@/lib/prisma'
import type { DisputeListVM } from '@/app/components/blocks/view-models'
import type { Status } from '@/app/components/primitives'

/**
 * Server-only disputes data layer. Fulfils the DisputeList / DisputeDetail contracts
 * (docs/DESIGN_SYSTEM_SPEC.md §5 / DisputeListVM). View-model types imported `import type` (erased at build)
 * so the data layer matches the SSOT with NO runtime UI coupling — the lib/reviews.ts / lib/finances.ts pattern.
 */

// Dispute status → design Status (all clean mappings; unlike PAID there is no missing value).
const STATUS_MAP: Record<string, Status> = {
  OPEN: 'open',
  RESOLVED: 'completed',
  REJECTED: 'rejected',
}
const toDesignStatus = (s: string): Status => STATUS_MAP[s] ?? 'open'

type OpenerUser = {
  email: string
  specialistProfile?: { displayName: string } | null
  clientProfile?: { companyName: string } | null
}
const openerName = (u: OpenerUser): string =>
  u.specialistProfile?.displayName || u.clientProfile?.companyName || u.email

/**
 * The dispute list (DisputeListVM). Admin → all disputes; scoped → disputes where the user is the opener OR the
 * gig's client / assigned specialist (so participants see their disputes' status). Newest first.
 */
export async function getDisputeList(opts?: {
  status?: string
  participantId?: string
}): Promise<DisputeListVM> {
  const where: Record<string, unknown> = {}
  if (opts?.status) where.status = opts.status
  if (opts?.participantId) {
    where.OR = [
      { openerId: opts.participantId },
      { gig: { clientId: opts.participantId } },
      { gig: { assignedSpecialistId: opts.participantId } },
    ]
  }

  const rows = await prisma.dispute.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      gig: true,
      opener: { include: { specialistProfile: true, clientProfile: true } },
    },
  })

  return {
    disputes: rows.map((d) => ({
      id: d.id,
      gig: d.gig?.title ?? '',
      status: toDesignStatus(d.status),
      opener: openerName(d.opener),
    })),
  }
}

/**
 * A dispute's detail (for the DisputeDetail block, which pairs this with a ClientCard). §5 has no DisputeDetailVM,
 * so this returns a lib-local detail shape. Returns null when the dispute does not exist.
 */
const money = (kopecks: number): string => `${new Intl.NumberFormat('ru-RU').format(kopecks / 100)} ₽`
const entryRole = (r: string): 'specialist' | 'company' | 'moderator' =>
  r === 'company' || r === 'moderator' ? r : 'specialist'

export async function getDisputeDetail(id: string) {
  const d = await prisma.dispute.findUnique({
    where: { id },
    include: {
      gig: true,
      opener: { include: { specialistProfile: true, clientProfile: true } },
      resolvedBy: true,
      resolutionLog: true,
      timeline: { orderBy: { createdAt: 'asc' } },
    },
  })
  if (!d) return null
  return {
    id: d.id,
    gig: d.gig?.title ?? '',
    opener: openerName(d.opener),
    openerRole: (d.openerRole === 'company' ? 'company' : d.openerRole === 'specialist' ? 'specialist' : '') as
      | 'specialist'
      | 'company'
      | '',
    amount: money(d.amount),
    reason: d.reason,
    evidence: d.evidence ? d.evidence.split(',').map((s) => s.trim()).filter(Boolean) : [],
    timeline: d.timeline.map((e) => ({
      authorRole: entryRole(e.authorRole),
      authorName: e.authorName,
      text: e.text,
      at: new Date(e.createdAt).toLocaleDateString('ru-RU'),
    })),
    status: toDesignStatus(d.status),
    resolution: d.resolution,
    resolvedBy: d.resolvedBy?.email ?? null,
  }
}
