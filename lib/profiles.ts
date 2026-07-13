import { prisma } from '@/lib/prisma'
import { getRatingForUser } from '@/lib/reviews'
import type { ProfileHeaderVM, StatVM } from '@/app/components/blocks/view-models'

/**
 * Onboarding dropdown datasets (RU market). The Phase-2 onboarding wizard (compose-auth-onboarding)
 * populates its <select>s from these, and `updateProfile` validates supplied values against them so
 * stored data never drifts from the dropdowns.
 */
// transport-settings — the «Часовой пояс» dropdown covers all 11 Russian zones + popular Russian-IT relocation hubs
// (Тбилиси/Ереван/Алматы/Белград/Стамбул/Дубай/Кипр/Лиссабон/Бангкок/Бали/Ташкент/Бишкек/Буэнос-Айрес) + the major
// world business/tech hubs (LA/NY/London/Berlin/Mumbai/Shanghai/Singapore/Tokyo/Sydney/São Paulo). Ordered by GMT
// offset ascending so the dropdown reads geographically. `TIMEZONE_LABELS` MUST cover every entry (validated in tests).
export const TIMEZONES = [
  'America/Los_Angeles',
  'America/Chicago',
  'America/New_York',
  'America/Sao_Paulo',
  'America/Argentina/Buenos_Aires',
  'Europe/London',
  'Europe/Lisbon',
  'Europe/Berlin',
  'Europe/Belgrade',
  'Europe/Kaliningrad',
  'Asia/Nicosia',
  'Europe/Moscow',
  'Europe/Istanbul',
  'Europe/Samara',
  'Asia/Tbilisi',
  'Asia/Yerevan',
  'Asia/Dubai',
  'Asia/Yekaterinburg',
  'Asia/Almaty',
  'Asia/Tashkent',
  'Asia/Kolkata',
  'Asia/Omsk',
  'Asia/Bishkek',
  'Asia/Krasnoyarsk',
  'Asia/Bangkok',
  'Asia/Irkutsk',
  'Asia/Shanghai',
  'Asia/Singapore',
  'Asia/Makassar',
  'Asia/Yakutsk',
  'Asia/Tokyo',
  'Asia/Vladivostok',
  'Australia/Sydney',
  'Asia/Magadan',
  'Asia/Kamchatka',
] as const

/** Russian `(GMT±N) City` display labels for the «Часовой пояс» dropdown. One entry per `TIMEZONES` value. */
export const TIMEZONE_LABELS: Record<string, string> = {
  'America/Los_Angeles': '(GMT-8) Лос-Анджелес, Сан-Франциско',
  'America/Chicago': '(GMT-6) Чикаго',
  'America/New_York': '(GMT-5) Нью-Йорк',
  'America/Sao_Paulo': '(GMT-3) Сан-Паулу',
  'America/Argentina/Buenos_Aires': '(GMT-3) Буэнос-Айрес',
  'Europe/London': '(GMT+0) Лондон',
  'Europe/Lisbon': '(GMT+0) Лиссабон',
  'Europe/Berlin': '(GMT+1) Берлин, Париж',
  'Europe/Belgrade': '(GMT+1) Белград, Подгорица',
  'Europe/Kaliningrad': '(GMT+2) Калининград',
  'Asia/Nicosia': '(GMT+2) Кипр (Лимасол)',
  'Europe/Moscow': '(GMT+3) Москва, Санкт-Петербург',
  'Europe/Istanbul': '(GMT+3) Стамбул',
  'Europe/Samara': '(GMT+4) Самара, Ижевск',
  'Asia/Tbilisi': '(GMT+4) Тбилиси',
  'Asia/Yerevan': '(GMT+4) Ереван',
  'Asia/Dubai': '(GMT+4) Дубай',
  'Asia/Yekaterinburg': '(GMT+5) Екатеринбург',
  'Asia/Almaty': '(GMT+5) Алматы, Астана',
  'Asia/Tashkent': '(GMT+5) Ташкент',
  'Asia/Kolkata': '(GMT+5:30) Мумбаи, Бангалор',
  'Asia/Omsk': '(GMT+6) Омск',
  'Asia/Bishkek': '(GMT+6) Бишкек',
  'Asia/Krasnoyarsk': '(GMT+7) Красноярск, Новосибирск',
  'Asia/Bangkok': '(GMT+7) Бангкок, Пхукет',
  'Asia/Irkutsk': '(GMT+8) Иркутск',
  'Asia/Shanghai': '(GMT+8) Шанхай, Пекин',
  'Asia/Singapore': '(GMT+8) Сингапур',
  'Asia/Makassar': '(GMT+8) Бали',
  'Asia/Yakutsk': '(GMT+9) Якутск',
  'Asia/Tokyo': '(GMT+9) Токио',
  'Asia/Vladivostok': '(GMT+10) Владивосток',
  'Australia/Sydney': '(GMT+10) Сидней',
  'Asia/Magadan': '(GMT+11) Магадан, Сахалин',
  'Asia/Kamchatka': '(GMT+12) Камчатка, Анадырь',
}

/** Display label for a timezone (falls back to the raw IANA id if unmapped). */
export const timezoneLabel = (tz: string): string => TIMEZONE_LABELS[tz] ?? tz

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
