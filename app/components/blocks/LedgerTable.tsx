import { StatusBadge } from "@/app/components/primitives";
import { Panel } from "@/app/components/layout/Panel";
import { Stack } from "@/app/components/layout/Stack";
import { STATUS_LABEL } from "./util";
import type { LedgerTableVM } from "./view-models";

/**
 * LedgerTable block (compose-finances gap fill, DESIGN_SYSTEM_SPEC §3.2) — the logical finances ledger: a header row +
 * one row per entry (date · label · StatusBadge · amount in mono) + a summed balance footer, with an empty state when
 * there are no entries. Formats the DateISO for display (per the view-model contract). Composed from primitives +
 * layout primitives + tokens. Token-pure.
 */
export function LedgerTable({ vm }: { vm: LedgerTableVM }) {
  return (
    <Panel surface={1} radius="lg" padding={6}>
      <Stack gap={4}>
        {vm.entries.length === 0 ? (
          <span className="text-body font-body text-muted">Пока нет операций</span>
        ) : (
          <Stack gap={2}>
            <Stack axis="row" gap={4} align="center" justify="between">
              <span className="text-caption font-caption text-subtle">Дата</span>
              <span className="text-caption font-caption text-subtle">Операция</span>
              <span className="text-caption font-caption text-subtle">Статус</span>
              <span className="text-caption font-caption text-subtle">Сумма</span>
            </Stack>
            {vm.entries.map((e, i) => (
              <Stack key={i} axis="row" gap={4} align="center" justify="between">
                <span className="text-caption font-caption text-muted">
                  {new Date(e.date).toLocaleDateString("ru-RU")}
                </span>
                <span className="text-body font-body text-strong">{e.label}</span>
                <StatusBadge variant="inline-dot" status={e.status}>
                  {STATUS_LABEL[e.status]}
                </StatusBadge>
                <span className="font-mono text-mono text-strong">{e.amount}</span>
              </Stack>
            ))}
          </Stack>
        )}
        <Stack axis="row" gap={4} align="center" justify="between">
          <span className="text-label font-label text-muted">Баланс</span>
          <span className="font-mono text-mono text-strong">{vm.balance}</span>
        </Stack>
      </Stack>
    </Panel>
  );
}
