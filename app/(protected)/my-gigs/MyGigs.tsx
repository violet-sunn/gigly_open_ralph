/* @composed-screen */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Stack } from '@/app/components/layout/Stack'
import { Grid } from '@/app/components/layout/Grid'
import { Tabs } from '@/app/components/primitives'
import { SectionHeader, GigCard, Notice } from '@/app/components/blocks'
import type { MyGigsData } from '@/lib/view-models'

/**
 * MyGigs — the /my-gigs «Мои гиги» screen, composed purely from the kit (reconcile-my-projects, Phase 3; reconciled to
 * the gigly_full_design `gigs` prototype). Renders inside the layout's AppShell. A SectionHeader «Мои гиги» + a Tabs
 * status bar (Все/Заявки/В работе/На проверке/Завершённые, with counts) over a 2-col GigCard grid of the viewer's OWN
 * gigs, filtered client-side by the active tab (Все = all). When a tab is empty, the prototype empty state. Template +
 * slotted blocks + data only — no styling/className/style; arranged via layout primitives.
 */
export function MyGigs({ gigCards, tabs }: MyGigsData) {
  const router = useRouter()
  const [tab, setTab] = useState('all')

  const shown = tab === 'all' ? gigCards : gigCards.filter((g) => g.tabKey === tab)

  return (
    <Stack gap={4}>
      <SectionHeader vm={{ title: 'Мои гиги' }} />
      <Tabs active={tab} onSelect={setTab} tabs={tabs} aria-label="Гиги по статусу" />
      {shown.length > 0 ? (
        <Grid columns={2} gap={4}>
          {shown.map((vm) => (
            <GigCard key={`${vm.tabKey}-${vm.id}`} vm={vm} onOpen={() => router.push(`/gigs/${vm.id}`)} />
          ))}
        </Grid>
      ) : (
        <Stack gap={2}>
          <SectionHeader vm={{ title: 'Здесь пока пусто' }} />
          <Notice tone="muted">
            Гигов с таким статусом нет. Они появятся здесь, когда изменится статус работ.
          </Notice>
        </Stack>
      )}
    </Stack>
  )
}
