import { StatusBadge } from "@/app/components/primitives";
import { Panel } from "@/app/components/layout/Panel";
import { Stack } from "@/app/components/layout/Stack";
import { ClientCard } from "./ClientCard";
import { STATUS_LABEL } from "./util";
import type { DisputeDetailVM } from "./view-models";

/**
 * DisputeDetail block (compose-disputes gap fill, DESIGN_SYSTEM_SPEC §3.2) — one dispute's detail: the gig + status,
 * the opener, the reason, and (once resolved) the resolution + resolver — paired with a ClientCard for the opener.
 * Read-only — the admin resolve control is a separate island. Composed from primitives + layout primitives + tokens.
 * Token-pure.
 */
export function DisputeDetail({ vm }: { vm: DisputeDetailVM }) {
  return (
    <Panel surface={1} radius="lg" padding={6}>
      <Stack gap={4}>
        <Stack axis="row" gap={4} align="center" justify="between">
          <span className="text-title font-title text-strong">{vm.gig}</span>
          <StatusBadge variant="pill" status={vm.status}>
            {STATUS_LABEL[vm.status]}
          </StatusBadge>
        </Stack>

        <ClientCard vm={{ avatar: "", name: vm.opener, rating: { value: 0, count: 0, verified: false } }} />

        <Stack gap={2}>
          <span className="text-label font-label text-subtle">Причина</span>
          <span className="text-body font-body text-strong">{vm.reason}</span>
        </Stack>

        {vm.resolution && (
          <Stack gap={2}>
            <span className="text-label font-label text-subtle">Решение</span>
            <span className="text-body font-body text-strong">{vm.resolution}</span>
            {vm.resolvedBy && (
              <span className="text-caption font-caption text-muted">Рассмотрено: {vm.resolvedBy}</span>
            )}
          </Stack>
        )}
      </Stack>
    </Panel>
  );
}
