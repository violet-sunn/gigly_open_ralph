/* @composed-screen */
import Link from "next/link";
import { Section } from "@/app/components/layout/Section";
import { Stack } from "@/app/components/layout/Stack";
import { StatPanel, Notice } from "@/app/components/blocks";
import { Button } from "@/app/components/primitives";
import type { StatPanelVM } from "@/app/components/blocks/view-models";

/**
 * AdminDashboard — the /admin screen, composed purely from the kit (prove-extensibility-admin, the generativity proof).
 * Renders inside the admin AppShell. The platform StatPanel + links to the moderation lists. Template + slotted blocks +
 * data only — no className/style; assembled from existing kit only (zero off-system values).
 */
export function AdminDashboard({ stats }: { stats: StatPanelVM }) {
  return (
    <Section title="Админ" gap={6}>
      <Notice tone="muted">Панель модерации платформы.</Notice>
      <StatPanel vm={stats} variant="grid" />
      <Stack axis="row" gap={3}>
        <Link href="/admin/users">
          <Button type="button" variant="primary">
            Пользователи
          </Button>
        </Link>
        <Link href="/admin/gigs">
          <Button type="button" variant="secondary">
            Гиги
          </Button>
        </Link>
      </Stack>
    </Section>
  );
}
