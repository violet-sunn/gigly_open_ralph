/* @composed-screen */
'use client'

import { useRouter } from 'next/navigation'
import { Section } from '@/app/components/layout/Section'
import { Split } from '@/app/components/layout/Split'
import { Stack } from '@/app/components/layout/Stack'
import {
  ProfileHeader,
  StatPanel,
  TagList,
  CategoryTags,
  ExperienceList,
  GigCard,
} from '@/app/components/blocks'
import type { ProfileData } from '@/lib/view-models'

/**
 * Profile — composed purely from the kit (reconcile-profile-screen, Phase 1; reconciled to Профиль/specialist
 * 2860:2103). Renders inside the layout's AppShell, shared by the own (`/profile`) and public (`/profile/[userId]`)
 * views. The node CONTENT leads with the ID block (ProfileHeader ‖ the «на стадии разработки» placeholder StatPanel)
 * — no page-title heading — followed by the 2-col BLOCK. Template + slotted blocks + data only — no
 * styling/className/style; arranged via layout primitives. The single interaction is the owner edit affordance →
 * `/profile/edit` (the existing edit form is unchanged); `isOwner=false` (public view) drops it.
 */
export function Profile({ data }: { data: ProfileData }) {
  const router = useRouter()
  const edit = data.isOwner ? () => router.push('/profile/edit?from=profile') : undefined

  return (
    <Section gap={6}>
      <Split ratio="2:1">
        <ProfileHeader vm={data.header} onEdit={edit} />
        <StatPanel vm={data.stats} variant="single" />
      </Split>

      {data.role === 'SPECIALIST' && data.stack && data.categories && data.experience && (
        <Split ratio="1:1">
          <Stack gap={6}>
            <TagList vm={data.stack} onEdit={edit} />
            <ExperienceList vm={data.experience} onEdit={edit} />
          </Stack>
          <Stack gap={6}>
            <CategoryTags vm={data.categories} onEdit={edit} />
            <Section title={`Реализованные проекты (${data.realized.length})`} gap={4}>
              <Stack gap={4}>
                {data.realized.map((g) => (
                  <GigCard key={g.id} vm={g} onOpen={() => router.push(`/gigs/${g.id}`)} />
                ))}
              </Stack>
            </Section>
          </Stack>
        </Split>
      )}
    </Section>
  )
}
