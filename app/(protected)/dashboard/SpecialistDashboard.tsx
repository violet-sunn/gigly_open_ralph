/* @composed-screen */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Section } from "@/app/components/layout/Section";
import { Grid } from "@/app/components/layout/Grid";
import { Tabs } from "@/app/components/primitives";
import { BannerCard, GigCard, SearchPanel, MessagesPanel } from "@/app/components/blocks";
import type { SpecialistDashboardData } from "@/lib/view-models";

/**
 * SPECIALIST dashboard — composed purely from the kit (compose-specialist-dashboard, Phase 2). Renders inside the
 * layout's AppShell. Template + slotted blocks + data only — no styling/className/style; arranged via layout
 * primitives. Client: tabs state + gig-link navigation + search submit (the presentational blocks expose
 * onSelect/onOpen/onSubmit callbacks). Tabs: Все/Заявки/В работе/На проверке/Завершённые, filtered by each card's
 * tabKey (Все shows everything, incl. archived rejected/withdrawn applications).
 */
export function SpecialistDashboard({ banner, gigCards, tabs, messages }: SpecialistDashboardData) {
  const router = useRouter();
  const [tab, setTab] = useState("all");

  const shown = tab === "all" ? gigCards : gigCards.filter((g) => g.tabKey === tab);

  return (
    <Section title="Дашборд" gap={6}>
      <BannerCard vm={banner} />
      <SearchPanel onSubmit={(q) => router.push(`/gigs?q=${encodeURIComponent(q)}`)} />
      <Tabs active={tab} onSelect={setTab} tabs={tabs} aria-label="Гиги по статусу" />
      <Grid columns={3} gap={4}>
        {shown.map((vm) => (
          <GigCard key={`${vm.tabKey}-${vm.id}`} vm={vm} onOpen={() => router.push(`/gigs/${vm.id}?from=dashboard`)} />
        ))}
      </Grid>
      <MessagesPanel vm={messages} variant="preview" />
    </Section>
  );
}
