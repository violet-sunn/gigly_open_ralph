/* @composed-screen */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Section } from '@/app/components/layout/Section'
import { Grid } from '@/app/components/layout/Grid'
import { Tabs } from '@/app/components/primitives'
import { BannerCard, GigCard, CreateGigCTA, MessagesPanel } from '@/app/components/blocks'
import type { ClientDashboardData } from '@/lib/view-models'

/**
 * CLIENT dashboard — composed purely from the kit (compose-client-dashboard, Phase 2). Renders inside the layout's
 * AppShell. Template + slotted blocks + data only — no styling/className/style; arranged via layout primitives.
 * Client: tabs state + gig-link navigation (the presentational blocks expose onSelect/onOpen callbacks).
 */
export function ClientDashboard({ banner, gigCards, tabs, messages }: ClientDashboardData) {
  const router = useRouter()
  const [tab, setTab] = useState('all')

  const shown = gigCards.filter((g) => {
    if (tab === 'all') return true
    if (tab === 'COMPLETED') return g.rawStatus === 'COMPLETED' || g.rawStatus === 'PAID'
    return g.rawStatus === tab
  })

  return (
    <Section title="Дашборд" gap={6}>
      <BannerCard vm={banner} />
      <Tabs active={tab} onSelect={setTab} tabs={tabs} aria-label="Гиги по статусу" />
      <Grid columns={3} gap={4}>
        {shown.map((vm) => (
          <GigCard key={vm.id} vm={vm} onOpen={() => router.push(`/gigs/${vm.id}?from=dashboard`)} />
        ))}
      </Grid>
      <CreateGigCTA label="Создать гиг" href="/gigs/new" />
      <MessagesPanel vm={messages} variant="preview" />
    </Section>
  )
}
