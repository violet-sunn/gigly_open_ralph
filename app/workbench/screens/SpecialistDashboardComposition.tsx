/* @composed-screen */
"use client";
import { AppShell } from "@/app/components/templates/AppShell";
import { SidebarNav, Topbar, BannerCard, GigCard, MessagesPanel } from "@/app/components/blocks";
import { Grid } from "@/app/components/layout/Grid";
import { Section } from "@/app/components/layout/Section";
import { Tabs } from "@/app/components/primitives";
import {
  sidebarNavClientExpanded,
  topbarFixture,
  bannerCardFixture,
  gigCardFixtures,
  messagesPanelFixture,
} from "@/app/components/blocks/fixtures";

/**
 * Sample composed screen — specialist dashboard, assembled purely from the kit (AppShell +
 * blocks) bound to fixtures, BEFORE any Phase 2 route exists. The first affirmative
 * `@composed-screen`: Template + slotted Blocks + data only — no styling, no className/style,
 * arranged via layout-primitive props. Validates `lint:composition` end to end.
 */
export function SpecialistDashboardComposition() {
  return (
    <AppShell sidebar={<SidebarNav vm={sidebarNavClientExpanded} />} topbar={<Topbar vm={topbarFixture} />}>
      <Section title="Дашборд" gap={6}>
        <BannerCard vm={bannerCardFixture} />
        <Tabs
          active="all"
          tabs={[
            { value: "all", label: "Все" },
            { value: "apps", label: "Заявки" },
            { value: "progress", label: "В работе" },
            { value: "review", label: "На проверке" },
            { value: "done", label: "Завершённые" },
          ]}
        />
        <Grid columns={3} gap={4}>
          {gigCardFixtures
            .filter((g) => g.layout === "grid")
            .map((vm) => (
              <GigCard key={vm.id} vm={vm} />
            ))}
        </Grid>
        <MessagesPanel vm={messagesPanelFixture} variant="preview" />
      </Section>
    </AppShell>
  );
}
