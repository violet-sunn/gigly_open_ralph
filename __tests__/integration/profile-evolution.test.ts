import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getTestPrismaClient } from '../helpers/db'
import { withAuthContext, setTestSessionToken, getTestSessionToken } from '../helpers/auth'
import { createTestUser } from '../helpers/seed'

// Mock @/lib/prisma to use the test database (lazy getter)
vi.mock('@/lib/prisma', () => ({
  get prisma() {
    return getTestPrismaClient()
  },
}))

// Mock next/headers for session cookie management
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: (name: string) => {
      if (name === 'session') {
        const token = getTestSessionToken()
        return token ? { value: token } : undefined
      }
      return undefined
    },
    set: vi.fn(),
    delete: vi.fn(),
  })),
}))

// Mock next/navigation redirect
vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`)
  }),
}))

// Import after mocks
import { updateProfile, setWorkExperience } from '@/app/actions/profile'
import {
  getProfileHeader,
  getWorkExperience,
  TIMEZONES,
  SPECIALIZATIONS,
  isTimezone,
  isSpecialization,
} from '@/lib/profiles'
import type { ProfileHeaderVM } from '@/app/components/blocks/view-models'

function form(fields: Record<string, string>) {
  const fd = new FormData()
  for (const [k, v] of Object.entries(fields)) fd.set(k, v)
  return fd
}

function expForm(entries: unknown[]) {
  const fd = new FormData()
  fd.set('entries', JSON.stringify(entries))
  return fd
}

describe('profile-evolution — edit (scalar fields)', () => {
  beforeEach(() => setTestSessionToken(undefined))
  afterEach(() => setTestSessionToken(undefined))

  it('updateProfile persists the new specialist fields (and keeps the existing ones)', async () => {
    const prisma = getTestPrismaClient()
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

    await withAuthContext(specialist, async () => {
      await expect(
        updateProfile(
          null,
          form({
            displayName: 'Иван',
            techStack: 'React, TypeScript',
            experienceLevel: 'SENIOR',
            bio: 'Опытный инженер',
            avatarUrl: '/avatars/ivan.png',
            phoneNumber: '+7 900 111-22-33',
            phoneVerified: 'true',
            position: 'Senior Frontend Developer',
            specialization: 'Frontend',
            location: 'Москва',
            timezone: 'Europe/Moscow',
          })
        )
      ).rejects.toThrow('NEXT_REDIRECT')
    })

    const profile = await prisma.specialistProfile.findUnique({ where: { userId: specialist.id } })
    expect(profile?.avatarUrl).toBe('/avatars/ivan.png')
    expect(profile?.phoneNumber).toBe('+7 900 111-22-33')
    expect(profile?.phoneVerified).toBe(true)
    expect(profile?.position).toBe('Senior Frontend Developer')
    expect(profile?.specialization).toBe('Frontend')
    expect(profile?.location).toBe('Москва')
    expect(profile?.timezone).toBe('Europe/Moscow')
    // existing fields untouched
    expect(profile?.displayName).toBe('Иван')
    expect(profile?.bio).toBe('Опытный инженер')
  })

  it('updateProfile persists the new client fields (avatar + logical verified)', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })

    await withAuthContext(client, async () => {
      await expect(
        updateProfile(
          null,
          form({
            companyName: 'ООО Тест',
            inn: '7700000000',
            avatarUrl: '/avatars/company.png',
            phoneVerified: 'on',
          })
        )
      ).rejects.toThrow('NEXT_REDIRECT')
    })

    const profile = await prisma.clientProfile.findUnique({ where: { userId: client.id } })
    expect(profile?.avatarUrl).toBe('/avatars/company.png')
    expect(profile?.phoneVerified).toBe(true)
    expect(profile?.companyName).toBe('ООО Тест')
  })

  it('updateProfile persists the design client onboarding fields (position/location/timezone), INN optional', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })

    // The design's client onboarding (Auth.dc.html step 3): Компания / ФИО / Должность / Местоположение+часовой пояс.
    // No INN at signup — only the company name is mandatory.
    await withAuthContext(client, async () => {
      await expect(
        updateProfile(
          null,
          form({
            companyName: 'ООО Ромашка',
            contactPerson: 'Иван Петров',
            position: 'Генеральный директор',
            location: 'Москва',
            timezone: 'Europe/Moscow',
          })
        )
      ).rejects.toThrow('NEXT_REDIRECT')
    })

    const profile = await prisma.clientProfile.findUnique({ where: { userId: client.id } })
    expect(profile?.companyName).toBe('ООО Ромашка')
    expect(profile?.contactPerson).toBe('Иван Петров')
    expect(profile?.position).toBe('Генеральный директор')
    expect(profile?.location).toBe('Москва')
    expect(profile?.timezone).toBe('Europe/Moscow')
    expect(profile?.inn).toBe('') // not collected at signup
  })

  it('updateProfile rejects an invalid client timezone (not persisted)', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })

    const result = await withAuthContext(client, async () =>
      updateProfile(null, form({ companyName: 'ООО Тест', timezone: 'Mars/Olympus' }))
    )
    expect(result).toEqual({ error: 'Выберите корректный часовой пояс.' })
    // The invalid value is rejected before persistence — the stored timezone is untouched.
    const profile = await prisma.clientProfile.findUnique({ where: { userId: client.id } })
    expect(profile?.timezone).not.toBe('Mars/Olympus')
  })
})

describe('profile-evolution — validation', () => {
  beforeEach(() => setTestSessionToken(undefined))
  afterEach(() => setTestSessionToken(undefined))

  it('rejects an off-dataset timezone and leaves the profile unchanged', async () => {
    const prisma = getTestPrismaClient()
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

    const result = await withAuthContext(specialist, async () =>
      updateProfile(null, form({ timezone: 'Mars/Phobos' }))
    )
    expect(result?.error).toBeTruthy()
    const profile = await prisma.specialistProfile.findUnique({ where: { userId: specialist.id } })
    expect(profile?.timezone).toBe('')
  })

  it('rejects an off-dataset specialization', async () => {
    const prisma = getTestPrismaClient()
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

    const result = await withAuthContext(specialist, async () =>
      updateProfile(null, form({ specialization: 'Astrology' }))
    )
    expect(result?.error).toBeTruthy()
    const profile = await prisma.specialistProfile.findUnique({ where: { userId: specialist.id } })
    expect(profile?.specialization).toBe('')
  })
})

describe('profile-evolution — work experience (ExperienceList)', () => {
  beforeEach(() => setTestSessionToken(undefined))
  afterEach(() => setTestSessionToken(undefined))

  it('sets and queries a specialist work history, ordered; re-setting replaces it', async () => {
    const prisma = getTestPrismaClient()
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

    const res = await withAuthContext(specialist, async () =>
      setWorkExperience(
        null,
        expForm([
          { company: 'Яндекс', title: 'Developer', startYear: 2019, endYear: 2021 },
          { company: 'VK', title: 'Senior Developer', startYear: 2021, endYear: null },
        ])
      )
    )
    expect(res?.success).toBe(true)

    const exp = await getWorkExperience(specialist.id)
    expect(exp).toHaveLength(2)
    expect(exp.map((e) => e.company)).toEqual(['Яндекс', 'VK'])
    expect(exp[0].order).toBe(0)
    expect(exp[1].order).toBe(1)
    expect(exp[1].endYear).toBeNull()

    // replace semantics
    await withAuthContext(specialist, async () =>
      setWorkExperience(null, expForm([{ company: 'Только один', title: 'Lead' }]))
    )
    const replaced = await getWorkExperience(specialist.id)
    expect(replaced).toHaveLength(1)
    expect(replaced[0].company).toBe('Только один')
  })

  it('rejects a non-specialist', async () => {
    const prisma = getTestPrismaClient()
    const client = await createTestUser(prisma, { role: 'CLIENT' })

    const res = await withAuthContext(client, async () =>
      setWorkExperience(null, expForm([{ company: 'X' }]))
    )
    expect(res?.error).toBeTruthy()
  })

  it('rejects an entry with an empty company (and writes nothing)', async () => {
    const prisma = getTestPrismaClient()
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

    const res = await withAuthContext(specialist, async () =>
      setWorkExperience(null, expForm([{ company: '   ' }]))
    )
    expect(res?.error).toBeTruthy()
    expect(await getWorkExperience(specialist.id)).toHaveLength(0)
  })

  it('rejects when endYear is before startYear', async () => {
    const prisma = getTestPrismaClient()
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })

    const res = await withAuthContext(specialist, async () =>
      setWorkExperience(null, expForm([{ company: 'X', startYear: 2022, endYear: 2019 }]))
    )
    expect(res?.error).toBeTruthy()
  })
})

describe('profile-evolution — display / ProfileHeader contract', () => {
  beforeEach(() => setTestSessionToken(undefined))
  afterEach(() => setTestSessionToken(undefined))

  it('getProfileHeader returns the ProfileHeaderVM shape with memberSince from createdAt', async () => {
    const prisma = getTestPrismaClient()
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST', displayName: 'Пётр' })

    await withAuthContext(specialist, async () => {
      await expect(
        updateProfile(
          null,
          form({
            displayName: 'Пётр',
            position: 'Backend Engineer',
            specialization: 'Backend',
            location: 'Казань',
            phoneVerified: 'true',
          })
        )
      ).rejects.toThrow('NEXT_REDIRECT')
    })

    const header = await getProfileHeader(specialist.id)
    expect(header).not.toBeNull()
    // compile-time contract assertion: the result is assignable to the block view-model
    const contract: ProfileHeaderVM = header!
    expect(contract.name).toBe('Пётр')
    expect(contract.roleTag).toBe('Backend Engineer')
    expect(contract.location).toBe('Казань')
    expect(contract.verified).toBe(true)
    expect(contract.avatar).toBe('')
    expect(typeof contract.memberSince).toBe('string')
    expect(contract.memberSince).toBe(specialist.createdAt.toISOString())
    expect(Array.isArray(contract.stats)).toBe(true)
    expect(contract.stats.length).toBeGreaterThan(0)
  })

  it('getWorkExperience returns [] for a specialist with none', async () => {
    const prisma = getTestPrismaClient()
    const specialist = await createTestUser(prisma, { role: 'SPECIALIST' })
    expect(await getWorkExperience(specialist.id)).toEqual([])
  })
})

describe('profile-evolution — existing profiles unaffected (defaults)', () => {
  beforeEach(() => setTestSessionToken(undefined))
  afterEach(() => setTestSessionToken(undefined))

  it('a profile created without the new fields takes the defaults and reads gracefully', async () => {
    const prisma = getTestPrismaClient()
    const specialist = await createTestUser(prisma, {
      role: 'SPECIALIST',
      experienceLevel: 'MIDDLE',
    })

    const profile = await prisma.specialistProfile.findUnique({ where: { userId: specialist.id } })
    expect(profile?.avatarUrl).toBe('')
    expect(profile?.phoneNumber).toBe('')
    expect(profile?.phoneVerified).toBe(false)
    expect(profile?.position).toBe('')
    expect(profile?.specialization).toBe('')
    expect(profile?.location).toBe('')
    expect(profile?.timezone).toBe('')

    // getProfileHeader still returns a valid shape, falling back through the roleTag chain
    const header = await getProfileHeader(specialist.id)
    expect(header).not.toBeNull()
    expect(header!.roleTag).toBe('MIDDLE') // position/specialization empty → experienceLevel
    expect(header!.location).toBeUndefined()
    expect(header!.verified).toBe(false)
  })
})

describe('profile-evolution — onboarding datasets', () => {
  it('TIMEZONES / SPECIALIZATIONS exist and their guards work', () => {
    expect(TIMEZONES.length).toBeGreaterThan(0)
    expect(SPECIALIZATIONS.length).toBeGreaterThan(0)
    expect(isTimezone('Europe/Moscow')).toBe(true)
    expect(isTimezone('Mars/Phobos')).toBe(false)
    expect(isSpecialization('Frontend')).toBe(true)
    expect(isSpecialization('Astrology')).toBe(false)
  })
})
