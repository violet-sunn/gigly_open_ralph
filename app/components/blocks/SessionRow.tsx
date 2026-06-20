import { StatusBadge, Button, IconButton, ICON } from "@/app/components/primitives";
import { Panel } from "@/app/components/layout/Panel";
import { Stack } from "@/app/components/layout/Stack";
import { cx } from "@/app/components/layout/scale";
import type { SessionRowVM } from "./view-models";

/**
 * SessionRow block (DESIGN_SYSTEM_SPEC §3.2) — Figma `session` (3149:2645): Default | active | delete.
 * Reuses primitives — active shows the «Текущий» pill via StatusBadge variant="current"; delete uses the
 * destructive Button variant="danger". Page-bg surface (level-0). Token-pure.
 */
export function SessionRow({
  vm,
  onRemove,
  onDelete,
}: {
  vm: SessionRowVM;
  onRemove?: () => void;
  onDelete?: () => void;
}) {
  const text = (
    <Stack gap={1} className="flex-1">
      <span className="text-label font-label text-strong">{vm.title}</span>
      {vm.description && <span className="text-body font-body text-muted">{vm.description}</span>}
    </Stack>
  );

  if (vm.state === "delete") {
    return (
      <Panel surface={0} radius="sm" padding={3}>
        <Stack gap={3} align="start">
          {text}
          <Button variant="danger" onClick={onDelete}>
            {vm.title}
          </Button>
        </Stack>
      </Panel>
    );
  }

  return (
    <Panel surface={0} radius="sm" padding={3} className={cx(vm.state === "active" && "border border-brand-default")}>
      <Stack axis="row" gap={3} align="center" justify="between">
        {text}
        {vm.state === "active" ? (
          <StatusBadge variant="current" />
        ) : (
          <IconButton icon={ICON.clear} aria-label="Удалить сессию" onClick={onRemove} />
        )}
      </Stack>
    </Panel>
  );
}
