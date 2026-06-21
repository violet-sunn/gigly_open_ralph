/* @composed-screen */
import Link from "next/link";
import { Section } from "@/app/components/layout/Section";
import { Stack } from "@/app/components/layout/Stack";
import { StatPanel, DisputeList, DataTable, SectionHeader, Notice } from "@/app/components/blocks";
import { Button } from "@/app/components/primitives";
import type { AdminDashboardData } from "@/lib/view-models";

/**
 * AdminDashboard — the /admin moderation console, composed purely from the kit (reconcile-finances-and-admin extends the
 * generativity-proof dashboard). Renders inside the admin AppShell: the platform StatPanel, the «Споры на модерации»
 * dispute queue (DisputeList of OPEN disputes → each links to /disputes/[id] to resolve), the «Журнал модерации»
 * moderation log (DataTable), and the links to the paginated Пользователи / Гиги moderation lists. Template + slotted
 * blocks + data only — no className/style.
 */
export function AdminDashboard({ stats, disputes, log }: AdminDashboardData) {
  return (
    <Section title="Админ" gap={6}>
      <Notice tone="muted">Панель модерации платформы.</Notice>
      <StatPanel vm={stats} variant="grid" />

      <Stack gap={3}>
        <SectionHeader vm={{ title: "Споры на модерации", count: disputes.disputes.length }} />
        <DisputeList vm={disputes} />
      </Stack>

      <Stack gap={3}>
        <SectionHeader vm={{ title: "Журнал модерации" }} />
        <DataTable
          columns={["Действие", "Кто", "Когда"]}
          rows={log.map((l) => ({ id: l.id, cells: [l.action, l.actor, l.at] }))}
          empty="Записей пока нет"
        />
      </Stack>

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
