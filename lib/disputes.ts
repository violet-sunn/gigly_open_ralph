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
      reason: d.reason,
      amount: `${new Intl.NumberFormat('ru-RU').format(d.amount / 100)} ₽`,
      created: new Date(d.createdAt).toLocaleDateString('ru-RU'),
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

/**
 * Context for the dedicated «Открыть спор» screen (reconcile-disputes-flow) — the gig title for `/disputes/new?gig=<id>`.
 * Participant-gated: returns null unless the viewer is the gig's client or assigned specialist (and the gig is a real,
 * assigned, non-example engagement) — `openDispute` re-validates server-side on submit.
 */
export async function getNewDisputeContext(
  gigId: string,
  viewer: { userId: string; role: string },
): Promise<{ gigId: string; gigTitle: string } | null> {
  const gig = await prisma.gig.findUnique({
    where: { id: gigId },
    select: { id: true, title: true, clientId: true, assignedSpecialistId: true, isExample: true },
  })
  if (!gig || gig.isExample || !gig.assignedSpecialistId) return null
  const isParticipant = gig.clientId === viewer.userId || gig.assignedSpecialistId === viewer.userId
  if (!isParticipant) return null
  return { gigId: gig.id, gigTitle: gig.title }
}

export async function getDisputeDetail(
  id: string,
  viewer?: { userId: string; role: string },
) {
  const d = await prisma.dispute.findUnique({
    where: { id },
    include: {
      gig: {
        include: {
          client: { include: { clientProfile: true } },
          assignedSpecialist: { include: { specialistProfile: true } },
        },
      },
      opener: { include: { specialistProfile: true, clientProfile: true } },
      resolvedBy: true,
      resolutionLog: true,
      timeline: { orderBy: { createdAt: 'asc' } },
    },
  })
  if (!d) return null

  // «Контрагент» — the other party in the dispute, viewer-relative (disputeDetail.*). A SPECIALIST viewer sees the
  // client company; a CLIENT viewer sees the assigned specialist; an ADMIN (or no viewer) sees the client/заказчик,
  // matching the prototype's resolve view («открыл: Специалист · Kryston»).
  const clientName =
    d.gig?.client?.clientProfile?.companyName || d.gig?.client?.email || ''
  const specialistName =
    d.gig?.assignedSpecialist?.specialistProfile?.displayName || d.gig?.assignedSpecialist?.email || ''
  const viewerIsClient = !!viewer && d.gig?.clientId === viewer.userId
  const counterparty =
    viewer && viewer.role !== 'ADMIN' ? (viewerIsClient ? specialistName : clientName) : clientName

  return {
    id: d.id,
    gig: d.gig?.title ?? '',
    // The title alone made the screen a dead end: a moderator could read the complaint but never open the work it is
    // about. Carry the id so the detail can link to /gigs/<id> (and from there to the correspondence).
    gigId: d.gigId,
    counterparty,
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
