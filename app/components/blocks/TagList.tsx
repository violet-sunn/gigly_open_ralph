import { Tag, IconButton, ICON, type Category } from "@/app/components/primitives";
import { Panel } from "@/app/components/layout/Panel";
import { Stack } from "@/app/components/layout/Stack";
import type { TagListVM } from "./view-models";

/** Cycle the five category colours so a stack of tech tags reads like the mock. */
const TAG_COLORS: Category[] = ["programming", "design", "development", "marketing", "coding"];

/**
 * TagList block (compose-profile gap fill, DESIGN_SYSTEM_SPEC §3.2) — the «Стек» card: a titled
 * list of Tag primitives, with an optional owner edit affordance. Composed from primitives +
 * layout primitives + tokens. Token-pure.
 */
export function TagList({ vm, onEdit }: { vm: TagListVM; onEdit?: () => void }) {
  return (
    <Panel surface={1} radius="lg" padding={6}>
      <Stack gap={5}>
        <Stack axis="row" gap={3} align="center" justify="between">
          <span className="text-h2 font-h2 text-strong">{vm.title}</span>
          {onEdit && <IconButton icon={ICON.gear} onClick={onEdit} aria-label="Редактировать" />}
        </Stack>
        <Stack axis="row" gap={2}>
          {vm.tags.map((t, i) => (
            <Tag key={t.label} color={t.color ?? TAG_COLORS[i % TAG_COLORS.length]}>
              {t.label}
            </Tag>
          ))}
        </Stack>
      </Stack>
    </Panel>
  );
}
