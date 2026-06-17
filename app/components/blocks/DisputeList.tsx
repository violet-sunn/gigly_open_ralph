import Link from "next/link";
import { StatusBadge } from "@/app/components/primitives";
import { Panel } from "@/app/components/layout/Panel";
import { Stack } from "@/app/components/layout/Stack";
import { STATUS_LABEL } from "./util";
import type { DisputeListVM } from "./view-models";

/**
 * DisputeList block (compose-disputes gap fill, DESIGN_SYSTEM_SPEC §3.2) — the dispute inbox: a header + one row per
 * dispute (gig · opener · StatusBadge), each row a link to the dispute detail, with an empty state when there are no
 * disputes in scope. Composed from primitives + layout primitives + tokens. Token-pure.
 */
export function DisputeList({ vm }: { vm: DisputeListVM }) {
  return (
    <Panel surface={1} radius="lg" padding={6}>
      {vm.disputes.length === 0 ? (
        <span className="text-body font-body text-muted">Споров нет</span>
      ) : (
        <Stack gap={2}>
          <Stack axis="row" gap={4} align="center" justify="between">
            <span className="text-caption font-caption text-subtle">Гиг</span>
            <span className="text-caption font-caption text-subtle">Инициатор</span>
            <span className="text-caption font-caption text-subtle">Статус</span>
          </Stack>
          {vm.disputes.map((d) => (
            <Link key={d.id} href={`/disputes/${d.id}`} className="text-body font-body text-strong">
              <Stack axis="row" gap={4} align="center" justify="between">
                <span className="text-body font-body text-strong">{d.gig}</span>
                <span className="text-caption font-caption text-muted">{d.opener}</span>
                <StatusBadge variant="inline-dot" status={d.status}>
                  {STATUS_LABEL[d.status]}
                </StatusBadge>
              </Stack>
            </Link>
          ))}
        </Stack>
      )}
    </Panel>
  );
}
