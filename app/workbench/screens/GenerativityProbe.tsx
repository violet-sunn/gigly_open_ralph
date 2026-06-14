/* @composed-screen */
"use client";
import { AppShell } from "@/app/components/templates/AppShell";
import { SidebarNav, Topbar, FilterBar, StatPanel, GigCard, ClientCard } from "@/app/components/blocks";
import { Grid } from "@/app/components/layout/Grid";
import { Section } from "@/app/components/layout/Section";
import {
  sidebarNavSpecialistCollapsed,
  topbarFixture,
  filterBarFixture,
  statPanelFixture,
  gigCardFixtures,
  clientCardFixture,
} from "@/app/components/blocks/fixtures";

/**
 * Generativity probe — an ARBITRARY, novel screen (no mock among the 12 references) assembled purely
 * from the kit (AppShell + existing blocks + fixtures), arranged via layout-primitive props with no
 * styling. The generativity gate (`lint:generativity`) asserts this composes with ZERO off-system
 * values. This is the scaffold `prove-extensibility-admin` (#29) extends to the full admin proof.
 */
export function GenerativityProbe() {
  return (
    <AppShell sidebar={<SidebarNav vm={sidebarNavSpecialistCollapsed} />} topbar={<Topbar vm={topbarFixture} />} collapsed>
      <Section title="Сводка" gap={6}>
        <FilterBar vm={filterBarFixture} variant="full" />
        <StatPanel vm={statPanelFixture} variant="grid" />
        <Grid columns={2} gap={4}>
          {gigCardFixtures
            .filter((g) => g.layout === "list")
            .slice(0, 2)
            .map((vm) => (
              <GigCard key={vm.id} vm={vm} />
            ))}
        </Grid>
        <ClientCard vm={clientCardFixture} />
      </Section>
    </AppShell>
  );
}
