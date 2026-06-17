import { prisma } from '@/lib/prisma'

/**
 * Account preferences data layer (the Settings screen — Select + Toggle·list). Server-only. The Settings screen has
 * no §5 view-model (it binds primitives), so `Preferences` is the typed shape the Select value + Toggle states bind.
 */

export const LOCALES = ['ru', 'en'] as const // RU default
export const isLocale = (s: string): boolean => (LOCALES as readonly string[]).includes(s)

export interface Preferences {
  locale: string
  notifyApplications: boolean
  notifyStatusChanges: boolean
  notifyMessages: boolean
}

/**
 * A user's account preferences (locale + notification toggles). Returns null if the user does not exist.
 */
export async function getPreferences(userId: string): Promise<Preferences | null> {
  const u = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      locale: true,
      notifyApplications: true,
      notifyStatusChanges: true,
      notifyMessages: true,
    },
  })
  return u ?? null
}
