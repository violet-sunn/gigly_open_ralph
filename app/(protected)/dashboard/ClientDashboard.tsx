/* @composed-screen */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Split } from '@/app/components/layout/Split'
import { Grid } from '@/app/components/layout/Grid'
import { Stack } from '@/app/components/layout/Stack'
import { Tabs } from '@/app/components/primitives'
import { SectionHeader, OnboardingCard, GigCard, CreateGigCTA, MessagesPanel } from '@/app/components/blocks'
import type { ClientDashboardData } from '@/lib/view-models'

/**
 * CLIENT/company dashboard — composed purely from the kit (reconcile-dashboards, Phase 1; reconciled to Дашборд/company
 * 3371:5387). Renders inside the layout's AppShell. WELCOME (greeting + OnboardingCard×2) → BOARD (2-col Split: col1
 * «Активные задачи» SectionHeader + Tabs Menu-switcher + GigCard feed ‖ col2 «Найти новый проект» CreateGigCTA +
 * «Сообщения» MessagesPanel). The 6× attention strip is hidden on company per the mock. Template + slotted blocks +
 * data only — no styling/className/style.
 */
export function ClientDashboard({ greeting, onboarding, gigCards, tabs, messages }: ClientDashboardData) {
  const router = useRouter()
  const [tab, setTab] = useState('all')

  const shown = gigCards.filter((g) => {
    if (tab === 'all') return true
    if (tab === 'COMPLETED') return g.rawStatus === 'COMPLETED' || g.rawStatus === 'PAID'
    return g.rawStatus === tab
  })

  return (
    <Stack gap={6}>
      {/* WELCOME — greeting + onboarding tiles */}
      <Stack gap={4}>
        <SectionHeader vm={{ title: greeting }} />
        <Grid columns={2} gap={4}>
          {onboarding.map((vm, i) => (
            <OnboardingCard key={i} vm={vm} onCta={i === 0 ? () => router.push('/profile/edit') : undefined} />
          ))}
        </Grid>
      </Stack>

      {/* BOARD — Активные задачи feed ‖ Найти новый проект + Сообщения */}
      <Split ratio="2:1">
        <Stack gap={4}>
          <SectionHeader vm={{ title: 'Активные задачи' }} />
          <Tabs active={tab} onSelect={setTab} tabs={tabs} aria-label="Гиги по статусу" />
          <Stack gap={4}>
            {shown.map((vm) => (
              <GigCard key={vm.id} vm={vm} onOpen={() => router.push(`/gigs/${vm.id}?from=dashboard`)} />
            ))}
          </Stack>
        </Stack>
        <Stack gap={6}>
          <Stack gap={4}>
            <SectionHeader vm={{ title: 'Найти новый проект' }} />
            <CreateGigCTA label="Создать гиг" href="/gigs/new" />
          </Stack>
          <Stack gap={4}>
            <SectionHeader vm={{ title: 'Сообщения' }} />
            <MessagesPanel vm={messages} variant="preview" />
          </Stack>
        </Stack>
      </Split>
    </Stack>
  )
}
