/* @composed-screen */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Split } from "@/app/components/layout/Split";
import { Grid } from "@/app/components/layout/Grid";
import { Stack } from "@/app/components/layout/Stack";
import { Tabs } from "@/app/components/primitives";
import {
  SectionHeader,
  OnboardingCard,
  AttentionCard,
  GigCard,
  SearchPanel,
  MessagesPanel,
} from "@/app/components/blocks";
import type { SpecialistDashboardData } from "@/lib/view-models";

/**
 * SPECIALIST dashboard — composed purely from the kit (reconcile-dashboards, Phase 1; reconciled to Дашборд/specialist
 * 2860:3751). Renders inside the layout's AppShell. WELCOME (greeting + OnboardingCard×2) → BOARD (2-col Split: col1
 * «Активные задачи» SectionHeader + Tabs status filter + GigCard feed ‖ col2 «найти гиг» SearchPanel + «Сообщения»
 * MessagesPanel) → WELCOME-2 (the 6× AttentionCard notification strip, shown when present). Template + slotted blocks +
 * data only — no styling/className/style. Tabs: Все/Заявки/В работе/На проверке/Завершённые, filtered by each card's
 * tabKey (Все shows everything, incl. archived rejected/withdrawn applications).
 */
export function SpecialistDashboard({ greeting, onboarding, attention, gigCards, tabs, messages }: SpecialistDashboardData) {
  const router = useRouter();
  const [tab, setTab] = useState("all");

  const shown = tab === "all" ? gigCards : gigCards.filter((g) => g.tabKey === tab);

  return (
    <Stack gap={6}>
      {/* WELCOME — greeting + onboarding tiles */}
      <Stack gap={4}>
        <SectionHeader vm={{ title: greeting }} />
        <Grid columns={2} gap={4}>
          {onboarding.map((vm, i) => (
            <OnboardingCard key={i} vm={vm} onCta={i === 0 ? () => router.push("/profile/edit") : undefined} />
          ))}
        </Grid>
      </Stack>

      {/* BOARD — Активные задачи feed ‖ найти гиг + Сообщения */}
      <Split ratio="2:1">
        <Stack gap={4}>
          <SectionHeader vm={{ title: "Активные задачи" }} />
          <Tabs active={tab} onSelect={setTab} tabs={tabs} aria-label="Гиги по статусу" />
          <Stack gap={4}>
            {shown.map((vm) => (
              <GigCard key={`${vm.tabKey}-${vm.id}`} vm={vm} onOpen={() => router.push(`/gigs/${vm.id}?from=dashboard`)} />
            ))}
          </Stack>
        </Stack>
        <Stack gap={6}>
          <Stack gap={4}>
            <SectionHeader vm={{ title: "Найти гиг" }} />
            <SearchPanel onSubmit={(q) => router.push(`/gigs?q=${encodeURIComponent(q)}`)} />
          </Stack>
          <Stack gap={4}>
            <SectionHeader vm={{ title: "Сообщения" }} />
            <MessagesPanel vm={messages} variant="preview" />
          </Stack>
        </Stack>
      </Split>

      {/* WELCOME-2 — the notification strip (only when there are notifications) */}
      {attention.length > 0 && (
        <Stack gap={4}>
          <SectionHeader vm={{ title: "Уведомления" }} />
          <Grid columns={3} gap={4}>
            {attention.map((vm, i) => (
              <AttentionCard key={i} vm={vm} />
            ))}
          </Grid>
        </Stack>
      )}
    </Stack>
  );
}
