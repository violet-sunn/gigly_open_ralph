import { prisma } from '@/lib/prisma'
import { getRatingForUser } from '@/lib/reviews'
import type { ProfileHeaderVM, StatVM } from '@/app/components/blocks/view-models'

/**
 * Onboarding dropdown datasets (RU market). The Phase-2 onboarding wizard (compose-auth-onboarding)
 * populates its <select>s from these, and `updateProfile` validates supplied values against them so
 * stored data never drifts from the dropdowns.
 */
export const TIMEZONES = [
  'Europe/Kaliningrad',
  'Europe/Moscow',
  'Europe/Samara',
  'Asia/Yekaterinburg',
  'Asia/Omsk',
  'Asia/Krasnoyarsk',
  'Asia/Irkutsk',
  'Asia/Yakutsk',
  'Asia/Vladivostok',
  'Asia/Magadan',
  'Asia/Kamchatka',
] as const

export const SPECIALIZATIONS = [
  'Frontend',
  'Backend',
  'Fullstack',
  'Mobile',
  'DevOps',
  'Data',
  'QA',
  'Design',
  'Management',
] as const

export const EXPERIENCE_LEVELS = ['MIDDLE', 'SENIOR'] as const

export const isTimezone = (s: string): boolean => (TIMEZONES as readonly string[]).includes(s)
export const isSpecialization = (s: string): boolean =>
  (SPECIALIZATIONS as readonly string[]).includes(s)
export const isExperienceLevel = (s: string): boolean =>
  (EXPERIENCE_LEVELS as readonly string[]).includes(s)

/**
 * The exact ProfileHeaderVM shape this helper fulfils. Imported `import type` (erased at build), so the
 * data layer matches the view-model SSOT with NO runtime UI coupling — the same pattern as
 * `lib/reviews.ts` (RatingAggregate) and `lib/categories.ts`.
 */
export type ProfileHeaderData = ProfileHeaderVM

/**
 * Assemble a user's ProfileHeader (the data the ProfileHeader block renders):
 *   avatar      = avatarUrl (specialist or client; "" → block renders a placeholder)
 *   name        = displayName / companyName / email
 *   roleTag     = position / specialization / experienceLevel (specialist) or "Клиент"
 *   verified    = phoneVerified (logical identity verification — distinct from a rating's transaction-verified)
 *   memberSince = User.createdAt (no new column — derived here as an ISO string the block formats)
 *   location    = specialist location (optional)
 *   stats       = rating (value/count) + completed-gig count, merged from `getRatingForUser`
 *
 * Server-only data helper (consumed by Phase-2 screens via @/lib/profiles).
 */
export async function getProfileHeader(userId: string): Promise<ProfileHeaderData | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { specialistProfile: true, clientProfile: true },
  })
  if (!user) return null

  const sp = user.specialistProfile
  const cp = user.clientProfile

  const rating = await getRatingForUser(userId)
  const completed = await prisma.gig.count({
    where: { assignedSpecialistId: userId, status: 'COMPLETED' },
  })

  const name = sp?.displayName || cp?.companyName || user.email
  const roleTag = sp
    ? sp.position || sp.specialization || sp.experienceLevel || 'Специалист'
    : 'Клиент'

  const stats: StatVM[] = [
    { label: 'Рейтинг', value: rating.value },
    { label: 'Отзывы', value: rating.count },
    { label: 'Завершено задач', value: completed },
  ]

  return {
    avatar: sp?.avatarUrl || cp?.avatarUrl || '',
    name,
    roleTag,
    verified: sp?.phoneVerified ?? cp?.phoneVerified ?? false,
    memberSince: user.createdAt.toISOString(),
    location: sp?.location || undefined,
    stats,
  }
}

/**
 * A specialist's work history, ordered for the ExperienceList block ("Опыт работы").
 * Returns [] when there is none (graceful for existing profiles).
 */
export async function getWorkExperience(userId: string) {
  return prisma.workExperience.findMany({
    where: { profileId: userId },
    orderBy: { order: 'asc' },
  })
}
