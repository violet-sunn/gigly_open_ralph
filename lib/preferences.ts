import { prisma } from '@/lib/prisma'

/**
 * Account preferences data layer (the Settings screen — Select + Toggle·list). Server-only. The Settings screen has
 * no §5 view-model (it binds primitives), so `Preferences` is the typed shape the Select value + Toggle states bind.
 */

export const LOCALES = ['ru', 'en'] as const // RU default
export const isLocale = (s: string): boolean => (LOCALES as readonly string[]).includes(s)

// transport-settings — «Валюта получения выплат» (Платежные данные). RUB default.
export const CURRENCIES = ['rub', 'usd', 'eur'] as const
export const isCurrency = (s: string): boolean => (CURRENCIES as readonly string[]).includes(s)

export interface Preferences {
  locale: string
  notifyApplications: boolean
  notifyStatusChanges: boolean
  notifyMessages: boolean
  // reconcile-settings — the prototype's «оплаты» notification + the ПРИВАТНОСТЬ toggles.
  notifyPayments: boolean
  showRatingInProfile: boolean
  showOnlineStatus: boolean
  // transport-settings — currency + the two extra Email-уведомления toggles (platform news / new gigs).
  currency: string
  notifyPlatformNews: boolean
  notifyNewGigs: boolean
}

/** The default preferences (mirror the schema @default(true) + RU locale) — used when a user row is absent. */
export const DEFAULT_PREFERENCES: Preferences = {
  locale: 'ru',
  notifyApplications: true,
  notifyStatusChanges: true,
  notifyMessages: true,
  notifyPayments: true,
  showRatingInProfile: true,
  showOnlineStatus: true,
  currency: 'rub',
  notifyPlatformNews: true,
  notifyNewGigs: true,
}

/**
 * A user's account preferences (locale + notification + privacy toggles). Returns null if the user does not exist.
 */
export async function getPreferences(userId: string): Promise<Preferences | null> {
  const u = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      locale: true,
      notifyApplications: true,
      notifyStatusChanges: true,
      notifyMessages: true,
      notifyPayments: true,
      showRatingInProfile: true,
      showOnlineStatus: true,
      currency: true,
      notifyPlatformNews: true,
      notifyNewGigs: true,
    },
  })
  return u ?? null
}
