import { StatusBadge } from "@/app/components/primitives";
import { Panel } from "@/app/components/layout/Panel";
import { Stack } from "@/app/components/layout/Stack";
import { ClientCard } from "./ClientCard";
import { STATUS_LABEL } from "./util";
import type { DisputeDetailVM, DisputeEntryVM } from "./view-models";

/** DisputeEntry author role → its Russian label (the timeline party). */
const ENTRY_ROLE_LABEL: Record<DisputeEntryVM["authorRole"], string> = {
  specialist: "Специалист",
  company: "Заказчик",
  moderator: "Модератор",
};
const OPENER_ROLE_LABEL: Record<string, string> = { specialist: "Специалист", company: "Заказчик" };

/**
 * DisputeDetail block (compose-disputes + reconcile-disputes-flow, DESIGN_SYSTEM_SPEC §3.2) — one dispute's full detail:
 * the gig + status, the opener (party) + the frozen amount, the reason, the evidence, the chronology (timeline of
 * specialist/company/moderator entries), and (once resolved) the resolution + resolver. Read-only — the admin resolve
 * control is a separate island. Composed from primitives + layout primitives + tokens. Token-pure.
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

        <Stack axis="row" gap={4} align="center" justify="between">
          <ClientCard vm={{ avatar: "", name: vm.opener, rating: { value: 0, count: 0, verified: false } }} />
          <Stack gap={1} align="end">
            {vm.openerRole && (
              <span className="text-caption font-caption text-subtle">{OPENER_ROLE_LABEL[vm.openerRole]}</span>
            )}
            <span className="text-caption font-caption text-subtle">Заморожено</span>
            <span className="text-label font-grotesk text-strong">{vm.amount}</span>
          </Stack>
        </Stack>

        <Stack gap={2}>
          <span className="text-label font-label text-subtle">Причина</span>
          <span className="text-body font-body text-strong">{vm.reason}</span>
        </Stack>

        {vm.evidence.length > 0 && (
          <Stack gap={2}>
            <span className="text-label font-label text-subtle">Доказательства</span>
            <Stack gap={1}>
              {vm.evidence.map((f) => (
                <span key={f} className="text-body font-body text-muted">
                  {f}
                </span>
              ))}
            </Stack>
          </Stack>
        )}

        {vm.timeline.length > 0 && (
          <Stack gap={2}>
            <span className="text-label font-label text-subtle">Хронология</span>
            <Stack gap={3}>
              {vm.timeline.map((e, i) => (
                <Stack key={i} gap={1}>
                  <Stack axis="row" gap={2} align="center" justify="between">
                    <span className="text-label font-label text-strong">
                      {e.authorName || ENTRY_ROLE_LABEL[e.authorRole]}
                    </span>
                    <span className="text-caption font-caption text-muted">
                      {ENTRY_ROLE_LABEL[e.authorRole]} · {e.at}
                    </span>
                  </Stack>
                  <span className="text-body font-body text-muted">{e.text}</span>
                </Stack>
              ))}
            </Stack>
          </Stack>
        )}

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
